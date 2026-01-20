import { GoogleGenerativeAI } from "@google/generative-ai";
import { HfInference } from "@huggingface/inference";
import dotenv from 'dotenv';
dotenv.config();

// Headers for CORS
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// --- MODEL CONFIGURATION ---
// Updated with top-ranked open-source models + 4-tier fallback system
const HF_MODELS = {
  text: [
    'meta-llama/Llama-3.3-70B-Instruct',         // Performance King
    'Qwen/Qwen2.5-72B-Instruct',                 // High Stability
    'mistralai/Mistral-7B-Instruct-v0.3',        // Legacy Reliable
    'google/gemma-2-27b-it'                      // Strong Alternative
  ],
  code: [
    'Qwen/Qwen2.5-Coder-32B-Instruct',           // Top Tier Coder
    'Qwen/Qwen2.5-Coder-7B-Instruct',            // Very stable
    'deepseek-ai/deepseek-coder-6.7b-instruct'   // Reliable backup
  ],
  image: [
    'black-forest-labs/FLUX.1-schnell',           // Best for free API
    'stabilityai/stable-diffusion-xl-base-1.0',    // Rock solid
    'runwayml/stable-diffusion-v1-5'               // Ultimate legacy fallback
  ],
  video: [
    'ali-vilab/text-to-video-ms-1.7b',
    'cerspense/zeroscope_v2_576w'
  ],
  upscale: [
    'stabilityai/stable-diffusion-x4-upscaler'
  ],
  img2img: [
    'timbrooks/instruct-pix2pix',
    'stabilityai/stable-diffusion-xl-refiner-1.0'
  ],
  audio: [
    'facebook/mms-tts-eng',
    'microsoft/speecht5_tts'
  ],
  music: [
    'facebook/musicgen-medium',
    'facebook/musicgen-small'
  ],
  analysis: [
    'meta-llama/Llama-3.3-70B-Instruct',
    'Qwen/Qwen2.5-72B-Instruct'
  ]
};

// Retry/Fallback Logic
async function tryHfGeneration(hf, category, input, options = {}) {
  const models = HF_MODELS[category];
  if (!models) throw new Error(`Unknown category: ${category}`);

  let lastError;

  for (const model of models) {
    try {
      console.log(`[${category.toUpperCase()}] Attempting: ${model}...`);

      // Merge default options with provided options
      const currentOptions = {
        wait_for_model: true,
        use_cache: false, // Force fresh generation for better reliability
        ...options
      };

      let result;
      if (category === 'text' || category === 'code' || category === 'analysis') {
        // Text/Code Generation
        result = await hf.chatCompletion({
          model: model,
          messages: [
            { role: "system", content: currentOptions.systemInstruction || "You are a helpful AI assistant." },
            { role: "user", content: input }
          ],
          max_tokens: options.max_tokens || 2048,
          temperature: 0.7
        });
        return result.choices[0].message.content;
      }
      else if (category === 'image') {
        result = await hf.textToImage({ model, inputs: input, parameters: { negative_prompt: 'blurry, ugly' } });
      }
      else if (category === 'video') {
        result = await hf.request({
          model,
          inputs: input,
          task: 'text-to-video'
        });
      }
      else if (category === 'music') {
        result = await hf.request({
          model,
          inputs: input,
          task: 'text-to-audio'
        });
      }
      else if (category === 'audio') {
        result = await hf.textToSpeech({ model, inputs: input });
      }
      else if (category === 'upscale' || category === 'img2img') {
        const imageInput = options.imageUrl || input;
        let blob;

        if (typeof imageInput === 'string' && imageInput.startsWith('http')) {
          console.log(`[${category.toUpperCase()}] Fetching image from URL: ${imageInput}`);
          const imageRes = await fetch(imageInput);
          if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageRes.statusText}`);
          // Use ArrayBuffer for better Node compatibility with HF client
          blob = await imageRes.arrayBuffer();
        } else if (typeof imageInput === 'string' && imageInput.startsWith('data:')) {
          // Handle base64
          const base64Data = imageInput.split(',')[1];
          blob = Buffer.from(base64Data, 'base64');
        } else {
          blob = imageInput;
        }

        if (!blob) throw new Error("No valid image input provided for " + category);

        result = await hf.imageToImage({
          model,
          inputs: blob,
          parameters: {
            prompt: category === 'img2img' ? input : "upscale this image to high quality 4k",
            negative_prompt: "blurry, low quality, distorted"
          }
        });
      }

      console.log(`[${category.toUpperCase()}] ✓ Success with ${model}`);

      // --- BINARY UNWRAP LOGIC ---
      // Some tasks like text-to-video or text-to-audio return structured objects: { video: Blob } or { audio: Blob }
      if (result && typeof result === 'object' && !Buffer.isBuffer(result) && !(result instanceof ArrayBuffer) && !(result.constructor && result.constructor.name === 'Blob')) {
        console.log(`[AI-Gateway] Structured results detected for ${category}, attempting to unwrap...`);
        if (result.video) result = result.video;
        else if (result.audio) result = result.audio;
        else if (result.blob) result = result.blob;
      }

      return result;

    } catch (e) {
      const errorMsg = e.message || "Unknown error";
      console.warn(`[${category.toUpperCase()}] ✗ Failed with ${model}: ${errorMsg}`);
      lastError = new Error(`[${model}] ${errorMsg}`);
      // Continue to next model
    }
  }
  throw lastError || new Error(`All models failed for ${category}. The neural link might be saturated - please try again in a moment.`);
}

export const handler = async (event, context) => {
  // Handle Preflight options
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { mode, prompt, systemInstruction, subscriptionTier = 'novice' } = body;

    // Health Check Mode
    if (mode === 'health') {
      const hfStatus = !!process.env.HF_TOKEN;
      const geminiStatus = !!process.env.GEMINI_API_KEY;
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          status: 'online',
          providers: { huggingface: hfStatus, gemini: geminiStatus },
          models: HF_MODELS
        })
      };
    }

    if (!prompt) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing prompt" }) };
    }

    // --- GATEKEEPER ---
    // ALL MODES NOW UNRESTRICTED - Available for all tiers (as requested)
    const tierPermissions = {
      novice: ['text', 'code-generation', 'music', 'text-hf', 'agent-build', 'research', 'analyze', 'image', 'video', 'upscale', 'img2img', 'tts', 'voice-clone', 'vibe-check'],
      pro: ['text', 'code-generation', 'music', 'text-hf', 'agent-build', 'research', 'analyze', 'image', 'video', 'upscale', 'img2img', 'tts', 'voice-clone', 'vibe-check'],
      sovereign: ['text', 'code-generation', 'music', 'text-hf', 'agent-build', 'research', 'analyze', 'vibe-check', 'image', 'video', 'upscale', 'img2img', 'tts', 'voice-clone']
    };

    const allowedModes = tierPermissions[subscriptionTier] || tierPermissions.novice;
    if (!allowedModes.includes(mode)) {
      return {
        statusCode: 402, headers,
        body: JSON.stringify({ error: "Payment Required", message: "Upgrade required for this feature." })
      };
    }

    // --- EXECUTION ---

    // 1. GEMINI (Legacy/Fast Text) - OPTIONAL/DISABLED BY DEFAULT
    // Set useGemini to true only if you strictly want to use it. Now defaulting to HF.
    const useGemini = false;

    if (useGemini && ['text', 'agent-build', 'research', 'analyze', 'vibe-check'].includes(mode)) {
      try {
        // If HF is requested specifically or if Gemini fails later, we might switch, 
        // but for now 'text' defaults to Gemini for speed if available.
        if (process.env.GEMINI_API_KEY) {
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-001",
            systemInstruction: systemInstruction || "You are ArchiTech-Wize."
          });

          let finalPrompt = prompt;
          if (mode === 'analyze') finalPrompt = `Analyze structured data: ${prompt}. Return JSON.`;

          const result = await model.generateContent(finalPrompt);
          return { statusCode: 200, headers, body: JSON.stringify({ result: result.response.text() }) };
        }
      } catch (e) {
        console.log("Gemini failed or missing, falling back to HF if possible...");
        // Fallthrough to HF logic below if it's a text task
      }
    }

    // 2. HUGGING FACE SOVEREIGNTY (Everything Else + Fallbacks)
    if (!process.env.HF_TOKEN) throw new Error("Missing HF_TOKEN");
    const hf = new HfInference(process.env.HF_TOKEN);
    let resultData;

    if (mode === 'code-generation' || mode === 'code') {
      const systemPrompt = "You are an expert Full-Stack Developer. Write clean, working code. Do not include markdown backticks or explanations unless asked.";
      let code = await tryHfGeneration(hf, 'code', prompt, { systemInstruction: systemPrompt });

      // Cleanup: Remove markdown code blocks if they exist
      if (typeof code === 'string') {
        code = code.replace(/```(javascript|typescript|js|ts|tsx|html|css)?\n?/g, '').replace(/```/g, '');
      }

      resultData = { result: code };
    }
    else if (mode === 'text-hf' || ['text', 'agent-build', 'research', 'analyze'].includes(mode)) {
      // 'text-hf' forces HF, others fall through here if Gemini failed
      const text = await tryHfGeneration(hf, 'text', prompt, { systemInstruction });
      resultData = { result: text };
    }
    else if (['image', 'video', 'music', 'audio', 'upscale', 'img2img', 'tts', 'voice-clone'].includes(mode)) {
      // Determine the category for HF fallback
      const categoryMap = {
        'tts': 'audio', 'voice-clone': 'audio',
        'image': 'image', 'video': 'video',
        'music': 'music', 'audio': 'audio',
        'upscale': 'upscale', 'img2img': 'img2img'
      };
      const category = categoryMap[mode];

      let imageUrl;
      let finalPrompt = prompt;

      // Special handling for img2img/upscale input
      if (mode === 'img2img' || mode === 'upscale') {
        try {
          const parsed = JSON.parse(prompt);
          imageUrl = parsed.imageUrl || (typeof prompt === 'string' && prompt.startsWith('http') ? prompt : undefined);
          finalPrompt = parsed.targetPrompt || prompt;
        } catch (e) {
          imageUrl = (typeof prompt === 'string' && prompt.startsWith('http')) ? prompt : undefined;
        }
      }

      let result = await tryHfGeneration(hf, category, finalPrompt, { imageUrl, subscriptionTier });

      // Convert binary results (Blobs, Buffers, ArrayBuffers) to base64 for JSON response
      // Safer check for Blob to avoid ReferenceError in Node environments
      const isBlob = (val) => val && (typeof val.arrayBuffer === 'function' || (val.constructor && val.constructor.name === 'Blob'));

      if (result && (isBlob(result) || Buffer.isBuffer(result) || result instanceof ArrayBuffer)) {
        let buffer;
        let mimeType = 'image/png'; // Default

        if (Buffer.isBuffer(result)) {
          buffer = result;
        } else if (result instanceof ArrayBuffer) {
          buffer = Buffer.from(result);
        } else if (isBlob(result)) {
          const ab = await result.arrayBuffer();
          buffer = Buffer.from(ab);
          mimeType = result.type || 'image/png';
        }

        // Adjust MIME type based on mode if it's still default
        if (mimeType === 'image/png' || !mimeType) {
          if (mode === 'video') mimeType = 'video/mp4';
          else if (['music', 'audio', 'tts', 'voice-clone'].includes(mode)) mimeType = 'audio/wav';
        }

        result = `data:${mimeType};base64,${buffer.toString('base64')}`;
      }

      resultData = { result: result };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(resultData)
    };

  } catch (error) {
    console.error("Gateway Final Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Internal Server Error" })
    };
  }
};
