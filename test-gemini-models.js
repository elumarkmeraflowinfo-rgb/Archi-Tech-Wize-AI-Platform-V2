
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envConfig = dotenv.parse(fs.readFileSync(path.resolve('.env.local')));
for (const k in envConfig) process.env[k] = envConfig[k];

async function findWorkingModel() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) { console.error("No Key"); return; }

    const genAI = new GoogleGenerativeAI(key);

    const candidates = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro",
        "gemini-1.5-pro-001",
        "gemini-1.5-pro-002",
        "gemini-1.0-pro",
        "gemini-pro",
        "gemini-2.0-flash-exp"
    ];

    console.log("--- BRUTE FORCE GEMINI MODEL CHECK ---");

    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName.padEnd(25)} ... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log(`✅ WORKED!`);
        } catch (e) {
            if (e.message.includes("404")) {
                console.log(`❌ 404 (Not Found)`);
            } else {
                console.log(`❌ Error: ${e.message.substring(0, 50)}...`);
            }
        }
    }
}

findWorkingModel();
