
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envConfig = dotenv.parse(fs.readFileSync(path.resolve('.env.local')));
const key = envConfig.GEMINI_API_KEY;

if (!key) {
    console.error("❌ GEMINI_API_KEY not found in .env.local");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log(`--- DIAGNOSING KEY: ${key.substring(0, 10)}... ---`);
console.log(`Requesting: ${url.replace(key, 'HIDDEN')}`);

async function checkModels() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("\n❌ API Error:");
            console.error(JSON.stringify(data.error, null, 2));
            return;
        }

        if (!data.models) {
            console.log("\n⚠️ No models returned. Key might be valid but has no access?");
            console.log(JSON.stringify(data, null, 2));
            return;
        }

        console.log(`\n✅ Success! Found ${data.models.length} accessible models:`);
        const geminiModels = data.models.filter(m => m.name.includes('gemini'));

        geminiModels.forEach(m => {
            console.log(`- ${m.name.replace('models/', '')} [${m.supportedGenerationMethods.join(', ')}]`);
        });

        if (geminiModels.length === 0) {
            console.log("... but NO 'gemini' models found. Only legacy Palm/Bison?");
            data.models.forEach(m => console.log(`  - ${m.name}`));
        }

    } catch (e) {
        console.error("❌ Network/Script Error:", e);
    }
}

checkModels();
