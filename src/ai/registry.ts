import { ProviderMeta } from './types';

// The Single Source of Truth for Providers
export const PROVIDER_REGISTRY: Record<string, ProviderMeta> = {
    'legacy-hf': {
        id: 'legacy-hf',
        name: 'Hugging Face (Legacy)',
        layer: 0,
        capabilities: ['text', 'image', 'code', 'music'], // Broad capability for the legacy wrapper
        isEnabled: true,
        requiresServerProxy: true, // HF Token is a secret
        maxContextWindow: 2048,
    },
    'webllm-browser': {
        id: 'webllm-browser',
        name: 'WebLLM (Local)',
        layer: 1,
        capabilities: ['text'],
        isEnabled: false, // Default off until configured
        requiresServerProxy: false,
    },
    'petals-p2p': {
        id: 'petals-p2p',
        name: 'Petals (P2P)',
        layer: 2,
        capabilities: ['text', 'reasoning'],
        isEnabled: false,
        requiresServerProxy: false,
    },
    'openrouter-free': {
        id: 'openrouter-free',
        name: 'OpenRouter (Free)',
        layer: 3,
        capabilities: ['text', 'reasoning', 'code'],
        isEnabled: true,
        requiresServerProxy: true,
    }
};

export const getProvidersByLayer = (layer: number): ProviderMeta[] => {
    return Object.values(PROVIDER_REGISTRY).filter(p => p.layer === layer && p.isEnabled);
};

export const getProvidersByCapability = (capability: string): ProviderMeta[] => {
    return Object.values(PROVIDER_REGISTRY).filter(p =>
        p.isEnabled && p.capabilities.includes(capability as any)
    );
};

export const getProvider = (id: string): ProviderMeta | undefined => {
    return PROVIDER_REGISTRY[id];
};

/**
 * Runtime toggling of providers (e.g., from Debug Panel)
 */
export const toggleProvider = (id: string, enabled: boolean, reason?: string) => {
    const provider = PROVIDER_REGISTRY[id];
    if (provider) {
        provider.isEnabled = enabled;
        if (!enabled && reason) {
            provider.disabledReason = reason;
        } else if (enabled) {
            provider.disabledReason = undefined;
        }
    }
};
