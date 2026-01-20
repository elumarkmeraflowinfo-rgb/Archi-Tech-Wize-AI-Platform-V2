export const quotaSystem = {
    checkQuota: (providerId: string): boolean => {
        // Future: Check against Firestore user quota or local session limits
        // For now, allow everything unless manually blocked
        return true;
    },

    reportUsage: (providerId: string, tokens: number) => {
        // Future: Telemetry usage
        // usageStore[providerId] += tokens;
    }
};
