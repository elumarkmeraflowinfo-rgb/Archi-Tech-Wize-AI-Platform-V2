const API_URL = '/api/ai-gateway';

export interface AgentRequirements {
    role?: string;
    industry?: string;
    tasks?: string[];
    tone?: string;
}

export const aiService = {
    // 1. General Chat / Research
    chat: async (prompt: string, systemInstruction: string = "", subscriptionTier: string = "novice", provider: "auto" | "hf" | "gemini" = "auto"): Promise<string> => {
        try {
            const finalMode: string = provider === 'hf' ? 'text-hf' : 'text'; // 'text' falls back to HF if Gemini fails, 'text-hf' forces HF
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: finalMode, prompt, systemInstruction, subscriptionTier }),
            });
            const data = await res.json();

            if (res.status === 402) {
                throw new Error(`⚠️ Upgrade Required: ${data.message || 'This feature requires a premium tier'}`);
            }

            if (!res.ok) throw new Error(data.error || 'Chat request failed');
            return data.result;
        } catch (error) {
            console.error('AI chat error:', error);
            throw error;
        }
    },

    // 2. The Super Agent Builder
    buildAgent: async (requirements: string, subscriptionTier: string = "novice", provider: "auto" | "hf" | "gemini" = "auto"): Promise<any> => {
        const systemInstruction = `You are the Architectwise Meta-Agent. 
    Your goal is to draft detailed system prompts for NEW AI agents based on user requirements.
    Output format: JSON object with fields 'name', 'tagline', 'systemPrompt' (detailed), 'suggestedTools' (array of strings).
    Do not output markdown code blocks, just the raw JSON.`;

        try {
            // If provider is 'hf', we use 'text-hf' mode but with the specific system instruction for agents
            // However, gateway's 'text-hf' uses a generic system prompt override if passed?
            // Yes, gateway accepts systemInstruction in body.
            const mode = provider === 'hf' ? 'text-hf' : 'agent-build';

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode, prompt: requirements, systemInstruction, subscriptionTier }),
            });
            const data = await res.json();
            if (res.status === 402) throw new Error(`⚠️ Upgrade Required: ${data.message}`);
            if (!res.ok) throw new Error(data.error || 'Builder request failed');

            // Attempt to parse JSON if wrapped in markdown or prefix text
            let text = data.result || "";

            // 1. Clean up markdown and common hallucinations
            text = text.replace(/```(json)?\n?|```/g, '').trim();

            // 2. Find the first '{' and the last '}' to extract the core JSON object
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                text = jsonMatch[0];
            }

            try {
                const parsed = JSON.parse(text);
                // Ensure all expected fields exist as strings/arrays
                return {
                    name: typeof parsed.name === 'string' ? parsed.name : "Architected Agent",
                    tagline: typeof parsed.tagline === 'string' ? parsed.tagline : "The custom solution",
                    systemPrompt: typeof parsed.systemPrompt === 'string' ? parsed.systemPrompt :
                        (typeof parsed.systemPrompt === 'object' ? JSON.stringify(parsed.systemPrompt, null, 2) : String(parsed.systemPrompt)),
                    suggestedTools: Array.isArray(parsed.suggestedTools) ? parsed.suggestedTools : []
                };
            } catch (pE) {
                console.error("JSON Parse failed, returning raw as object:", text);
                return {
                    name: "Architected Agent",
                    tagline: "Neural sync issues detected",
                    systemPrompt: text,
                    suggestedTools: []
                };
            }
        } catch (error) {
            console.error('AI build error:', error);
            throw error;
        }
    },

    // 3. Image Generation
    generateImage: async (prompt: string, subscriptionTier: string = "novice"): Promise<string> => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'image', prompt, subscriptionTier }),
            });
            const data = await res.json();
            if (res.status === 402) throw new Error(`⚠️ Upgrade Required: ${data.message}`);
            if (!res.ok) throw new Error(data.error || 'Image generation failed');
            return data.result;
        } catch (error) {
            console.error('AI image error:', error);
            throw error;
        }
    },

    // 4. Video Generation (The Kinetic Engine)
    generateVideo: async (prompt: string, subscriptionTier: string = "novice"): Promise<string> => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'video', prompt, subscriptionTier }),
            });
            const data = await res.json();
            if (res.status === 402) throw new Error(`⚠️ Upgrade Required: ${data.message}`);
            if (!res.ok) throw new Error(data.error || 'Video generation failed');
            return data.result;
        } catch (error) {
            console.error('AI video error:', error);
            throw error;
        }
    },

    // 5. Upscaling (The Visual Cortex)
    upscaleImage: async (imageUrl: string, subscriptionTier: string = "pro"): Promise<string> => {
        if (!imageUrl) throw new Error('Image URL required for upscaling');

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'upscale', prompt: imageUrl, subscriptionTier }),
            });
            const data = await res.json();
            if (res.status === 402) throw new Error(`⚠️ Upgrade Required: ${data.message}`);
            if (!res.ok) throw new Error(data.error || 'Upscaling failed');
            return data.result;
        } catch (error) {
            console.error('AI upscale error:', error);
            throw error;
        }
    },

    // 5b. Image-to-Image Transformation (The Transmutation Engine)
    transformImage: async (imageUrl: string, targetPrompt: string, subscriptionTier: string = "novice"): Promise<string> => {
        if (!imageUrl || !targetPrompt) throw new Error('Both image URL and target prompt required');

        try {
            const payload = JSON.stringify({ imageUrl, targetPrompt });
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'img2img', prompt: payload, subscriptionTier }),
            });
            const data = await res.json();
            if (res.status === 402) throw new Error(`⚠️ Upgrade Required: ${data.message}`);
            if (!res.ok) throw new Error(data.error || 'Image transformation failed');
            return data.result;
        } catch (error) {
            console.error('AI img2img error:', error);
            throw error;
        }
    },

    // 6. Auditory Engine (TTS & Cloning)
    generateSpeech: async (text: string, voiceCloneUrl?: string, subscriptionTier: string = "novice"): Promise<string> => {
        try {
            const mode = voiceCloneUrl ? 'voice-clone' : 'tts';
            // If voiceCloneUrl exists, we'd ideally pass it, but for now using the prompt as text input
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode, prompt: text, subscriptionTier }),
            });
            const data = await res.json();
            if (res.status === 402) throw new Error(`⚠️ Upgrade Required: ${data.message}`);
            if (!res.ok) throw new Error(data.error || 'Speech generation failed');
            return data.result;
        } catch (error) {
            console.error('AI speech error:', error);
            throw error;
        }
    },

    // 7. Deep Analysis (The Brain)
    analyzeData: async (dataInput: string, subscriptionTier: string = "novice"): Promise<string> => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'analyze', prompt: dataInput, subscriptionTier }),
            });
            const data = await res.json();
            // Removed tier check
            if (!res.ok) throw new Error(data.error || 'Analysis failed');
            return data.result;
        } catch (error) {
            console.error('AI analysis error:', error);
            throw error;
        }
    },

    // 8. Sovereign Code Generation (Qwen/Coder)
    generateCode: async (prompt: string, language: string = "javascript", subscriptionTier: string = "novice"): Promise<string> => {
        const fullPrompt = `Write ${language} code for: ${prompt}. Return ONLY the code, no markdown wrapping if possible.`;
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'code-generation', prompt: fullPrompt, subscriptionTier }),
            });
            const data = await res.json();
            if (res.status === 402) throw new Error(`⚠️ Upgrade Required: ${data.message}`);
            if (!res.ok) throw new Error(data.error || 'Code generation failed');
            return data.result;
        } catch (error) {
            console.error('AI code error:', error);
            throw error;
        }
    },

    // 9. Music Generation (MusicGen)
    generateMusic: async (prompt: string, subscriptionTier: string = "novice"): Promise<string> => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'music', prompt, subscriptionTier }),
            });
            const data = await res.json();
            if (res.status === 402) throw new Error(`⚠️ Upgrade Required: ${data.message}`);
            if (!res.ok) throw new Error(data.error || 'Music generation failed');
            return data.result;
        } catch (error) {
            console.error('AI music error:', error);
            throw error;
        }
    },

    // 10. System Health Check
    checkHealth: async (): Promise<{ status: string, providers: any }> => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'health', prompt: 'ping' }),
            });
            if (!res.ok) return { status: 'offline', providers: {} };
            return await res.json();
        } catch (e) {
            return { status: 'offline', providers: {} };
        }
    }
};
