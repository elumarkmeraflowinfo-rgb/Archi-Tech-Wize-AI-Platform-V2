import { AiTaskType, Capability } from './types';
import { AI_CONFIG } from './config';

export interface TaskProfile {
    id: AiTaskType;
    minCapability: Capability;
    maxLatencyMs: number;
    description: string;
}

export const TASK_PROFILES: Record<AiTaskType, TaskProfile> = {
    'REALTIME_CHAT': {
        id: 'REALTIME_CHAT',
        minCapability: 'text',
        maxLatencyMs: AI_CONFIG.TIMEOUTS.REALTIME,
        description: 'Standard fast chat'
    },
    'DEEP_REASONING': {
        id: 'DEEP_REASONING',
        minCapability: 'reasoning',
        maxLatencyMs: AI_CONFIG.TIMEOUTS.COMPLEX,
        description: 'Complex problem solving'
    },
    'CREATIVE_WRITING': {
        id: 'CREATIVE_WRITING',
        minCapability: 'text',
        maxLatencyMs: 30000,
        description: 'Long form content'
    },
    'IMAGE_GENERATION': {
        id: 'IMAGE_GENERATION',
        minCapability: 'image',
        maxLatencyMs: 20000,
        description: 'Visual asset creation'
    },
    'VIDEO_GENERATION': {
        id: 'VIDEO_GENERATION',
        minCapability: 'video',
        maxLatencyMs: AI_CONFIG.TIMEOUTS.BATCH,
        description: 'Video processing'
    },
    'AUDIO_SPEECH': {
        id: 'AUDIO_SPEECH',
        minCapability: 'audio',
        maxLatencyMs: 5000,
        description: 'TTS and cloning'
    },
    'CODE_GENERATION': {
        id: 'CODE_GENERATION',
        minCapability: 'code',
        maxLatencyMs: 15000,
        description: 'Programming tasks'
    },
    'MUSIC_GENERATION': {
        id: 'MUSIC_GENERATION',
        minCapability: 'audio', // or custom music cap
        maxLatencyMs: 30000,
        description: 'Music composition'
    },
    'ANALYSIS': {
        id: 'ANALYSIS',
        minCapability: 'text', // using large context text models for analysis usually
        maxLatencyMs: 30000,
        description: 'Data analysis'
    }
};

export const getTaskProfile = (task: AiTaskType): TaskProfile => {
    return TASK_PROFILES[task] || TASK_PROFILES['REALTIME_CHAT'];
};
