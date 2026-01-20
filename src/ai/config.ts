// Core AI Configuration

export const AI_CONFIG = {
    // 1. Timeouts (Milliseconds)
    TIMEOUTS: {
        REALTIME: 8000,    // 8 seconds (Fast or fail)
        COMPLEX: 25000,    // 25s for reasoning
        BATCH: 300000,     // 5 minutes for video/heavy jobs
    },

    // 2. Circuit Breaker
    CIRCUIT_BREAKER: {
        FAILURE_THRESHOLD: 3,           // 3 strikes
        COOLDOWN_MS: 10 * 60 * 1000,    // 10 minutes timeout
        RESET_AFTER_SUCCESS: 1,         // 1 success resets counter
    },

    // 3. Retries & Hops
    ROUTING: {
        MAX_FALLBACK_HOPS: 3,    // Don't try more than 3 providers
        LAYER_0_ALWAYS_ON: true, // The "Safety Net" rule
        PREFERRED_LATENCY_MS: 1500,
    },

    // 4. Job Queue
    QUEUE: {
        MAX_CONCURRENT: 2,
        POLL_INTERVAL_MS: 5000,
    },

    // 5. Scoring Weights (Must sum to 1.0)
    SCORING: {
        CAPABILITY: 0.4,
        RELIABILITY: 0.3,
        LATENCY: 0.2,
        COST: 0.1,
    }
};

export const IS_BROWSER = typeof window !== 'undefined';
