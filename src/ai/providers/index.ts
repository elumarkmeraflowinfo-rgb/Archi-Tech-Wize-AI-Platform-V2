import { AiProvider } from './base';
import { LegacyHfProvider } from './legacyHf';
import { OpenRouterProvider } from './openrouter';
import { WebLlmProvider } from './webgpu';

const adapters: Record<string, AiProvider> = {
    'legacy-hf': new LegacyHfProvider(),
    'openrouter-free': new OpenRouterProvider(),
    'webllm-browser': new WebLlmProvider(),
    // 'petals-p2p': ...
};

export const getProviderAdapter = (id: string): AiProvider | undefined => {
    return adapters[id];
};
