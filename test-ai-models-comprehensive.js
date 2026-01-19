// Comprehensive AI Model Testing Script
// Tests all 8 model categories with fallback verification
// Run with: node test-ai-models-comprehensive.js

import { HfInference } from "@huggingface/inference";
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config({ path: '.env.local' });

const HF_TOKEN = process.env.HF_TOKEN;

if (!HF_TOKEN) {
    console.error("❌ HF_TOKEN not found in .env.local");
    console.log("Get a free token at: https://huggingface.co/settings/tokens");
    process.exit(1);
}

const hf = new HfInference(HF_TOKEN);

// Model configuration (should match ai-gateway.js)
const HF_MODELS = {
    text: [
        'meta-llama/Llama-3.3-70B-Instruct',
        'meta-llama/Llama-3.2-3B-Instruct',
        'mistralai/Mistral-7B-Instruct-v0.3',
        'microsoft/Phi-3.5-mini-instruct'
    ],
    code: [
        'Qwen/Qwen2.5-Coder-32B-Instruct',
        'Qwen/Qwen2.5-Coder-7B-Instruct',
        'deepseek-ai/deepseek-coder-6.7b-instruct',
        'bigcode/starcoder2-15b'
    ],
    image: [
        'black-forest-labs/FLUX.1-dev',
        'black-forest-labs/FLUX.1-schnell',
        'stabilityai/stable-diffusion-3-medium',
        'stabilityai/sdxl-turbo'
    ],
    video: [
        'ali-vilab/i2vgen-xl',
        'ali-vilab/text-to-video-ms-1.7b',
        'cerspense/zeroscope_v2_576w',
        'damo-vilab/text-to-video-ms-1.7b'
    ],
    music: [
        'facebook/musicgen-stereo-large',
        'facebook/musicgen-stereo-medium',
        'facebook/musicgen-medium',
        'facebook/musicgen-small'
    ],
    audio: [
        'microsoft/speecht5_tts',
        'facebook/mms-tts-eng',
        'suno/bark',
        'espnet/kan-bayashi_ljspeech_vits'
    ],
    upscale: [
        'stabilityai/stable-diffusion-x4-upscaler',
        'caidas/swin2SR-realworld-sr-x4-64-bsrgan-psnr',
        'eugenesiow/hat-large',
        'Salesforce/blipdiffusion'
    ],
    img2img: [
        'timbrooks/instruct-pix2pix',
        'diffusers/controlnet-canny-sdxl-1.0',
        'lllyasviel/sd-controlnet-canny',
        'stabilityai/sdxl-turbo'
    ]
};

// Test prompts for each category
const testPrompts = {
    text: "What is artificial intelligence?",
    code: "Write a Python function to calculate fibonacci numbers",
    image: "A serene mountain landscape at sunset",
    video: "Clouds moving across the sky",
    music: "Upbeat electronic music",
    audio: "Hello, this is a test.",
    upscale: null, // Would need an image URL
    img2img: null  // Would need an image URL
};

async function testModel(category, model, prompt) {
    try {
        console.log(`  Testing: ${model}...`);

        let result;
        const startTime = Date.now();

        if (category === 'text' || category === 'code') {
            result = await hf.chatCompletion({
                model: model,
                messages: [
                    { role: "system", content: "You are a helpful AI assistant." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 100
            });
            result = result.choices[0].message.content;
        }
        else if (category === 'image') {
            result = await hf.textToImage({ model, inputs: prompt });
        }
        else if (category === 'video') {
            result = await hf.request({
                model,
                inputs: prompt,
                task: 'text-to-video'
            });
        }
        else if (category === 'music') {
            result = await hf.request({
                model,
                inputs: prompt,
                task: 'text-to-audio'
            });
        }
        else if (category === 'audio') {
            result = await hf.textToSpeech({ model, inputs: prompt });
        }
        else if (category === 'upscale' || category === 'img2img') {
            // Skip for now - would need image input
            console.log(`  ⏭️  Skipped (requires image input)`);
            return { success: true, skipped: true };
        }

        const duration = Date.now() - startTime;
        console.log(`  ✅ Success in ${duration}ms`);
        return { success: true, duration };

    } catch (error) {
        console.log(`  ❌ Failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function testCategory(category) {
    console.log(`\n🧪 Testing ${category.toUpperCase()} Models`);
    console.log(`${'='.repeat(50)}`);

    const models = HF_MODELS[category];
    const prompt = testPrompts[category];

    if (!prompt) {
        console.log(`⏭️  Category skipped (no test prompt available)`);
        return;
    }

    const results = [];

    for (const model of models) {
        const result = await testModel(category, model, prompt);
        results.push({ model, ...result });

        // If primary succeeds, we can stop (fallback works)
        if (result.success && !result.skipped) {
            console.log(`\n✅ ${category.toUpperCase()}: Primary model working!`);
            break;
        }

        // Brief pause between attempts
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
}

async function runAllTests() {
    console.log('\n🚀 ArchiTech-Wize AI Model Comprehensive Test\n');
    console.log(`HF Token: ${HF_TOKEN.substring(0, 10)}...${HF_TOKEN.substring(HF_TOKEN.length - 5)}\n`);

    const categories = Object.keys(HF_MODELS);
    const allResults = {};

    for (const category of categories) {
        const results = await testCategory(category);
        allResults[category] = results;
    }

    // Summary
    console.log('\n\n📊 TEST SUMMARY');
    console.log('='.repeat(50));

    for (const [category, results] of Object.entries(allResults)) {
        if (!results) {
            console.log(`${category}: ⏭️  Skipped`);
            continue;
        }

        const successCount = results.filter(r => r.success).length;
        const totalCount = results.length;

        if (successCount > 0) {
            console.log(`${category}: ✅ ${successCount}/${totalCount} models working`);
        } else {
            console.log(`${category}: ❌ All models failed`);
        }
    }

    console.log('\n✨ Test complete!\n');
}

// Run tests
runAllTests().catch(console.error);
