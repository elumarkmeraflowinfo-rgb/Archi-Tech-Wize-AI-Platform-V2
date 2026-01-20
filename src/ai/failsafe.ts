import { AiTaskType, AiResponse } from './types';

const FAILSAFE_MESSAGES: Record<string, string> = {
    'default': "I'm having trouble connecting to my neural network right now. I'm secure and operational, but I can't generate new creative thoughts at the moment. Please try again in 1 minute.",
    'REALTIME_CHAT': "I'm offline right now. I can still help you navigate the system, but I can't chat until my connection is restored.",
    'CODE_GENERATION': "// Connection to verification server lost.\n// Please check your network or try again later.",
};

export const getFailsafeResponse = (task: AiTaskType): AiResponse => {
    const message = FAILSAFE_MESSAGES[task] || FAILSAFE_MESSAGES['default'];
    return {
        result: message,
        providerId: 'failsafe-system',
        providerLayer: 0, // Treated as baseline
        latencyMs: 0,
        metadata: {
            isFailsafe: true,
            error: 'All providers exhausted'
        }
    };
};
