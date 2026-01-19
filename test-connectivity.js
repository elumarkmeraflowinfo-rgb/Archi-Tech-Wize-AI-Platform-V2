
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HfInference } from "@huggingface/inference";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Manually load .env.local because dotenv doesn't auto-load it by default
const envConfig = dotenv.parse(fs.readFileSync(path.resolve('.env.local')));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

console.log("--- STARTING CONNECTIVITY DIAGNOSIS ---");

async function testGemini() {
    console.log("\n1. Testing Google Gemini (Text)...");
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("❌ GEMINI_API_KEY missing in .env.local");
        return;
    }
    console.log(`   Key found: ${key.substring(0, 8)}...`);

    const genAI = new GoogleGenerativeAI(key);

    // Test 1: List Models
    console.log("   Attempting to list available models...");
    try {
        // Did not see a listModels method exposed easily in the unified Node SDK sometimes without admin, 
        // but let's try a simple generation which is the real test.
        const modelNames = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-pro"];

        let success = false;

        for (const name of modelNames) {
            console.log(`   Trying model: ${name}...`);
            try {
                const model = genAI.getGenerativeModel({ model: name });
                const result = await model.generateContent("Hello, just say 'Working'");
                const response = await result.response;
                console.log(`   ✅ SUCCESS with ${name}: ${response.text().trim()}`);
                success = true;
                break;
            } catch (e) {
                console.error(`   ❌ FAILED with ${name}: ${e.message}`);
            }
        }

        if (!success) console.error("   ❌ All Gemini model tests failed. Check API Key permissions or quota.");

    } catch (e) {
        console.error("   ❌ Gemini Critical Error:", e.message);
    }
}

async function testHuggingFace() {
    console.log("\n2. Testing Hugging Face (Image)...");
    const key = process.env.HF_TOKEN;
    if (!key) {
        console.error("❌ HF_TOKEN missing in .env.local");
        return;
    }
    console.log(`   Token found: ${key.substring(0, 8)}...`);

    const hf = new HfInference(key);
    const models = [
        'black-forest-labs/FLUX.1-schnell',
        'ByteDance/SDXL-Lightning',
        'stabilityai/stable-diffusion-2-1'
    ];

    let success = false;
    for (const model of models) {
        console.log(`   Trying model: ${model}...`);
        try {
            // Check availability by generating a tiny image
            await hf.textToImage({
                model: model,
                inputs: "A small red dot",
            });
            console.log(`   ✅ SUCCESS with ${model}`);
            success = true;
            // No break, let's see which ones work
        } catch (e) {
            console.error(`   ❌ FAILED with ${model}: ${e.message}`);
        }
    }

    if (!success) console.error("   ❌ All Hugging Face model tests failed. Check HF Token permissions.");
}

async function run() {
    await testGemini();
    await testHuggingFace();
    console.log("\n--- DIAGNOSIS COMPLETE ---");
}

run();
