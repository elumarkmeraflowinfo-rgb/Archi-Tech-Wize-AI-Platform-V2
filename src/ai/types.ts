export type AiTaskType = 
    | 'REALTIME_CHAT' 
    | 'DEEP_REASONING' 
    | 'CREATIVE_WRITING' 
    | 'IMAGE_GENERATION' 
    | 'VIDEO_GENERATION' 
    | 'AUDIO_SPEECH'
    | 'CODE_GENERATION'
    | 'MUSIC_GENERATION'
    | 'ANALYSIS';

export type Capability = 
    | 'text' 
    | 'reasoning' 
    | 'image' 
    | 'audio' 
    | 'video' 
    | 'code'
    | 'embeddings';

export interface AiRequest {
    task: AiTaskType;
    prompt: string;
    systemInstruction?: string;
    imageUrl?: string; // For img2img or vision
    voiceCloneUrl?: string; // For TTS
    userId?: string; // Optional context
    tier?: 'free' | 'pro' | 'enterprise'; // User tier
}

export interface AiResponse {
    result: string;
    providerId: string;
    providerLayer: number;
    latencyMs: number;
    costUsd?: number;
    cached?: boolean;
    metadata?: Record<string, any>;
}

export interface AiError {
    message: string;
    code: 'PROVIDER_ERROR' | 'RATE_LIMIT' | 'QUOTA_EXCEEDED' | 'TIMEOUT' | 'AUTH_ERROR' | 'OFFLINE';
    providerId?: string;
    retryable: boolean;
}

export interface ProviderMeta {
    id: string;
    name: string;
    layer: number; // 0-5
    capabilities: Capability[];
    isEnabled: boolean;
    requiresServerProxy: boolean;
    disabledReason?: string;
    maxContextWindow?: number;
    costPerMillionTokens?: number;
}

export interface ProviderHealth {
    lastSuccess: number; // timestamp
    lastFailure: number; // timestamp
    consecutiveFailures: number;
    circuitBreakerOpen: boolean;
    cooldownUntil: number; // timestamp
    avgLatencyMs: number;
    totalRequests: number;
    successRate: number; // 0.0 - 1.0
}

export interface ProviderScore {
    providerId: string;
    score: number;
    breakdown: {
        capability: number;
        reliability: number;
        latency: number;
        cost: number;
    };
}

export interface UserAiPreference {
    mode: 'auto' | 'device' | 'community' | 'cloud';
    allowPaidFallback: boolean;
    disabledProviders: string[]; // IDs explicitly disabled
}
