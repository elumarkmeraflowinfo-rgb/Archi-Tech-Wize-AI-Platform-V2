import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FORBIDDEN_KEYS = [
    'HF_TOKEN',
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'REPLICATE_API_TOKEN',
    'GEMINI_API_KEY'
];

const IGNORED_FILES = [
    '.env',
    '.env.example',
    'audit_env_exposure.js',
    'check_architecture.js',
    'package-lock.json',
    'yarn.lock'
];

const ROOT_DIR = path.resolve(__dirname, '../src');

let foundLeaks = 0;

function scanDir(directory) {
    if (!fs.existsSync(directory)) return;
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else {
            if (IGNORED_FILES.includes(file)) continue;
            // Only scan source files
            if (!file.match(/\.(ts|tsx|js|jsx)$/)) continue;

            const content = fs.readFileSync(fullPath, 'utf8');

            FORBIDDEN_KEYS.forEach(key => {
                if (content.includes(`process.env.${key}`) || content.includes(`import.meta.env.${key}`)) {
                    console.error(`[CRITICAL] Possible leak of ${key} in ${fullPath}`);
                    foundLeaks++;
                }
            });
        }
    }
}

console.log(`Scanning ${ROOT_DIR} for forbidden keys: ${FORBIDDEN_KEYS.join(', ')}...`);

try {
    scanDir(ROOT_DIR);
} catch (e) {
    console.error("Scan failed:", e);
}

if (foundLeaks > 0) {
    console.error(`\nFAILED: Found ${foundLeaks} potential secret leaks.`);
    process.exit(1);
} else {
    console.log(`\nPASSED: No obvious secret leaks found in src/`);
    process.exit(0);
}
