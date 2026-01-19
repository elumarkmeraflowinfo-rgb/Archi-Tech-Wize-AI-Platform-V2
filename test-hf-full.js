
import { HfInference } from "@huggingface/inference";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envConfig = dotenv.parse(fs.readFileSync(path.resolve('.env.local')));
const key = envConfig.HF_TOKEN;

if (!key) {
    console.error("❌ HF_TOKEN not found");
    process.exit(1);
}

const hf = new HfInference(key);

async function testHF() {
    console.log("--- TESTING HUGGING FACE MODELS ---");

    // 1. Text to Image (Confirmed working earlier, but quick double check)
    process.stdout.write("1. Image (FLUX.1-schnell) ... ");
    try {
        await hf.textToImage({
            model: 'black-forest-labs/FLUX.1-schnell',
            inputs: "A cube",
        });
        console.log("✅ Working");
    } catch (e) {
        console.log(`❌ Failed: ${e.message}`);
    }

    // 2. Text to Speech
    process.stdout.write("2. Audio (facebook/mms-tts-eng) ... ");
    try {
        await hf.textToSpeech({
            model: 'facebook/mms-tts-eng',
            inputs: "Hello world",
        });
        console.log("✅ Working");
    } catch (e) {
        console.log(`❌ Failed: ${e.message}`);
    }

    // 3. Text to Video (Often distinct permissions)
    process.stdout.write("3. Video (ByteDance/AnimateDiff-Lightning) ... ");
    try {
        // Just checking if we can hit the endpoint, video gen takes time so we might catch errors early
        await hf.textToImage({ // AnimateDiff endpoint often uses textToImage signature in valid HF.js usage or raw request
            model: 'ByteDance/AnimateDiff-Lightning',
            inputs: "A moving ball",
        });
        console.log("✅ Working");
    } catch (e) {
        console.log(`❌ Failed: ${e.message}`);
    }
}

testHF();
