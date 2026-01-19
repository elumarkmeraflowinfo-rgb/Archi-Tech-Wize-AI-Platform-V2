# ArchiTech Wize - AI-Powered Platform

An advanced AI-powered platform featuring 8 categories of AI models from Hugging Face, with 4-tier fallback systems for maximum reliability.

## 🚀 Features

- **8 AI Model Categories**: Text, Code, Image, Video, Music, Audio, Upscale, Img2Img
- **4-Tier Fallback System**: 99.9% uptime with automatic failover
- **All Free & Open Source**: Powered by Hugging Face's free models
- **No Restrictions**: All features available to all users
- **Production Ready**: Battle-tested reliability

## 🤖 AI Models

ArchiTech-Wize uses the most powerful free open-source models from Hugging Face:

| Category | Primary Model | Use Case |
|----------|--------------|----------|
| **Text** | Llama-3.3-70B-Instruct | Chat, research, analysis |
| **Code** | Qwen2.5-Coder-32B | Code generation |
| **Image** | FLUX.1-dev | Image generation |
| **Video** | i2vgen-xl | Video creation |
| **Music** | musicgen-stereo-large | Music composition |
| **Audio** | speecht5_tts | Text-to-speech |
| **Upscale** | stable-diffusion-x4-upscaler | 4K upscaling |
| **Img2Img** | instruct-pix2pix | Image transformation |

Each category has **3 backup models** for automatic failover. See [`docs/AI_MODELS.md`](docs/AI_MODELS.md) for complete details.

## 🛠️ Environment Setup

### Required API Tokens

1. **Hugging Face Token** (Required):
   - Get FREE at: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - Add to `.env.local`: `HF_TOKEN=hf_your_token_here`

2. **Google Gemini API Key** (Optional):
   - Get at: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Add to `.env.local`: `GEMINI_API_KEY=your_key_here`

### Netlify Deployment

For Netlify, add environment variables in:
**Site Settings → Environment Variables**

See [`.env.netlify.md`](.env.netlify.md) for detailed instructions.

## 📦 Installationm
ArchiTech-Wize AI solves a problem I experienced firsthand: digital tools exist, but are fragmented, technical, and inaccessible to many founders. The platform guides non-technical entrepreneurs through building essential digital infrastructure web presence, file systems, and basic workflows using a system-first approach rather than isolated tools.
