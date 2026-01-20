// Health Store & Circuit Breaker Logic
import { ProviderHealth } from './types';
import { AI_CONFIG } from './config';

// In-memory store (per session)
// Note: For serverless, this resets on cold start. 
// Ideally, we'd sync this to KV, but for now memory is acceptable for individual instance resilience.
const healthStore: Record<string, ProviderHealth> = {};

const getInitialHealth = (): ProviderHealth => ({
    lastSuccess: 0,
    lastFailure: 0,
    consecutiveFailures: 0,
    circuitBreakerOpen: false,
    cooldownUntil: 0,
    avgLatencyMs: 0,
    totalRequests: 0,
    successRate: 1.0
});

export const healthSystem = {
    getHealth: (providerId: string): ProviderHealth => {
        if (!healthStore[providerId]) {
            healthStore[providerId] = getInitialHealth();
        }
        return healthStore[providerId];
    },

    reportSuccess: (providerId: string, latencyMs: number) => {
        const health = healthSystem.getHealth(providerId);
        health.lastSuccess = Date.now();
        health.consecutiveFailures = 0;

        // Rolling average (simple)
        if (health.totalRequests === 0) {
            health.avgLatencyMs = latencyMs;
        } else {
            health.avgLatencyMs = (health.avgLatencyMs * 0.8) + (latencyMs * 0.2);
        }

        health.totalRequests++;
        health.successRate = (health.successRate * 9 + 1) / 10; // decayed update

        // Reset breaker if it was previously open (though usually we won't get here if open)
        if (health.circuitBreakerOpen) {
            health.circuitBreakerOpen = false;
            health.cooldownUntil = 0;
        }
    },

    reportFailure: (providerId: string, isCritical: boolean = false) => {
        const health = healthSystem.getHealth(providerId);
        health.lastFailure = Date.now();
        health.consecutiveFailures++;
        health.totalRequests++;
        health.successRate = (health.successRate * 9) / 10;

        if (isCritical || health.consecutiveFailures >= AI_CONFIG.CIRCUIT_BREAKER.FAILURE_THRESHOLD) {
            health.circuitBreakerOpen = true;
            health.cooldownUntil = Date.now() + AI_CONFIG.CIRCUIT_BREAKER.COOLDOWN_MS;
            console.warn(`[Reflex] Circuit Breaker OPEN for ${providerId}. Cooldown until ${new Date(health.cooldownUntil).toISOString()}`);
        }
    },

    isHealthy: (providerId: string): boolean => {
        const health = healthSystem.getHealth(providerId);

        // Check Cooldown
        if (health.circuitBreakerOpen) {
            if (Date.now() > health.cooldownUntil) {
                // Trial run allowed
                return true;
            }
            return false;
        }
        return true;
    }
};
