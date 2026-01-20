import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_FILES = [
    'src/ai/gateway.ts',
    'src/ai/types.ts',
    'src/ai/config.ts',
    'src/ai/registry.ts',
    'src/ai/health.ts',
    'src/ai/quota.ts',
    'src/ai/scoring.ts',
    'src/ai/taskProfiles.ts',
    'src/ai/telemetry.ts',
    'src/ai/queue.ts',
    'src/ai/failsafe.ts',
    'src/ai/providers/base.ts',
    'src/ai/providers/index.ts',
    'src/ai/providers/legacyHf.ts',
    'src/context/aiProviderPrefs.ts',
    'src/pages/labs/AiProviders.tsx',
    'src/pages/labs/AiDebug.tsx'
];

let missing = 0;

console.log('Verifying Architecture Files...');

REQUIRED_FILES.forEach(file => {
    const fullPath = path.resolve(__dirname, '..', file);
    if (!fs.existsSync(fullPath)) {
        console.error(`[MISSING] ${file}`);
        missing++;
    } else {
        console.log(`[OK] ${file}`);
    }
});

// Check Exports (Regex check)
const gatewayPath = path.resolve(__dirname, '../src/ai/gateway.ts');
if (fs.existsSync(gatewayPath)) {
    const content = fs.readFileSync(gatewayPath, 'utf8');
    if (!content.includes('export class AiGateway')) {
        console.error('[FAIL] gateway.ts does not export AiGateway class');
        missing++;
    }
    if (!content.includes('routeRequest')) {
        console.error('[FAIL] gateway.ts does not have routeRequest method');
        missing++;
    }
}

if (missing > 0) {
    console.error(`\nFAILED: Missing ${missing} critical architecture components.`);
    process.exit(1);
} else {
    console.log(`\nPASSED: Architecture structure verified.`);
    process.exit(0);
}
