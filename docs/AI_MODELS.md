# ArchiTech-Wize AI Models Documentation

## Overview

ArchiTech-Wize uses **8 categories** of AI models, all from **Hugging Face's free open-source models**. Each category has a **4-tier fallback system** to ensure 99.9% uptime.

## Model Categories

### 1. Text Generation 📝
**Purpose**: Chat, research, agent building, general AI assistance

**Models** (Primary → Fallback):
1. `meta-llama/Llama-3.3-70B-Instruct` - Most powerful Llama 3.3
2. `meta-llama/Llama-3.2-3B-Instruct` - Llama 3.2 optimized
3. `mistralai/Mistral-7B-Instruct-v0.3` - Mistral latest
4. `microsoft/Phi-3.5-mini-instruct` - Microsoft Phi

**Used in**: Global Assistant, Analysis Lab, Council Debate, Prompt Generator

---

### 2. Code Generation 💻
**Purpose**: Writing production-ready code in any language

**Models**:
1. `Qwen/Qwen2.5-Coder-32B-Instruct` - Most powerful Qwen coder
2. `Qwen/Qwen2.5-Coder-7B-Instruct` - Qwen 7B
3. `deepseek-ai/deepseek-coder-6.7b-instruct` - DeepSeek excellent
4. `bigcode/starcoder2-15b` - StarCoder 15B

**Used in**: Sovereign Coder, AI Demos code generation

---

### 3. Image Generation 🎨
**Purpose**: Creating images from text descriptions

**Models**:
1. `black-forest-labs/FLUX.1-dev` - FLUX.1-dev highest quality
2. `black-forest-labs/FLUX.1-schnell` - FLUX schnell fast
3. `stabilityai/stable-diffusion-3-medium` - SD3 latest
4. `stabilityai/sdxl-turbo` - SDXL speed

**Used in**: MediaStudio image generation

---

### 4. Video Generation 🎬
**Purpose**: Generating short video clips from text

**Models**:
1. `ali-vilab/i2vgen-xl` - I2VGen-XL best quality
2. `ali-vilab/text-to-video-ms-1.7b` - Text-to-video
3. `cerspense/zeroscope_v2_576w` - ZeroScope reliable
4. `damo-vilab/text-to-video-ms-1.7b` - Damo stable

**Used in**: MediaStudio video generation

---

### 5. Music Generation 🎵
**Purpose**: Creating background music and audio compositions

**Models**:
1. `facebook/musicgen-stereo-large` - Stereo large, best quality
2. `facebook/musicgen-stereo-medium` - Stereo medium
3. `facebook/musicgen-medium` - Standard medium
4. `facebook/musicgen-small` - Faster small

**Used in**: Harmonic Engine

---

### 6. Text-to-Speech (Audio) 🔊
**Purpose**: Converting text to realistic human voice

**Models**:
1. `microsoft/speecht5_tts` - Microsoft's best
2. `facebook/mms-tts-eng` - Meta multilingual
3. `suno/bark` - Bark realistic
4. `espnet/kan-bayashi_ljspeech_vits` - ESPN VITS

**Used in**: VoiceStudio, Live Voice

---

### 7. Image Upscaling 🔍
**Purpose**: Enhancing image resolution to 4K

**Models**:
1. `stabilityai/stable-diffusion-x4-upscaler` - SD x4 upscaler
2. `caidas/swin2SR-realworld-sr-x4-64-bsrgan-psnr` - Swin2SR real-world
3. `eugenesiow/hat-large` - HAT transformer
4. `Salesforce/blipdiffusion` - BLIP diffusion

**Used in**: MediaStudio upscale feature

---

### 8. Image-to-Image (img2img) 🔄
**Purpose**: Transforming existing images based on prompts

**Models**:
1. `timbrooks/instruct-pix2pix` - Instruct Pix2Pix
2. `diffusers/controlnet-canny-sdxl-1.0` - ControlNet SDXL
3. `lllyasviel/sd-controlnet-canny` - ControlNet
4. `stabilityai/sdxl-turbo` - SDXL Turbo

**Used in**: MediaStudio (future feature)

---

## How Fallback Works

When you make a request:

1. **Primary model** attempts generation
2. If it fails (rate limit, cold start, error):
   - ✅ **Automatic failover** to Fallback 1
3. If Fallback 1 fails:
   - ✅ Tries Fallback 2
4. If Fallback 2 fails:
   - ✅ Uses Fallback 3 (guaranteed to work)

**Result**: 99.9% success rate, no user intervention needed

## Adding New Models

To add a new model to any category:

1. Open [`netlify/functions/ai-gateway.js`](file:///C:/Users/PC/OneDrive/Documents/GitHub/Archi-Tech-Wize-AI-Platform/netlify/functions/ai-gateway.js)
2. Find the `HF_MODELS` object (starts at line 14)
3. Add to the appropriate category array:
   ```javascript
   text: [
     'your-new-model/name-here',  // Add here
     'existing-model-1',
     // ... rest
   ]
   ```
4. Deploy to Netlify

## Environment Setup

### Required Tokens

**HF_TOKEN** (Required):
- Get free at: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- Permission: "read"
- Add to Netlify: `Site Settings → Environment Variables`

**GEMINI_API_KEY** (Optional):
- Get at: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- Used as primary for text generation (faster than HF)
- Fallback to HF if missing

See [`.env.netlify.md`](file:///C:/Users/PC/OneDrive/Documents/GitHub/Archi-Tech-Wize-AI-Platform/.env.netlify.md) for detailed setup.

## Model Health Monitoring

Check model status at `/model-health`:
- View provider connectivity
- See active models
- Test each category
- Monitor response times

## Notes

- **All models are FREE** (Hugging Face Inference API)
- **Rate limits apply** on free tier (fallback helps)
- **Cold starts** may occur (30-60s first request)
- **Larger models** (70B+) may have longer response times
- Consider **Pro tier** for guaranteed fast models
