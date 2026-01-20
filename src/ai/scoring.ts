import { ProviderMeta, ProviderScore, AiTaskType, Capability } from './types';
import { healthSystem } from './health';
import { AI_CONFIG } from './config';

export const calculateScore = (provider: ProviderMeta, task: AiTaskType, requiredCapability: Capability): ProviderScore => {
    let score = 0;

    // 1. Capability (40%)
    // Since we filtered candidates by capability already, this is usually 100,
    // but we could have partial matches in future.
    const capScore = 100;

    // 2. Reliability (30%)
    const health = healthSystem.getHealth(provider.id);
    // 100 base - 20 per failure. If breaker open, it's 0.
    const reliabilityScore = health.circuitBreakerOpen
        ? 0
        : Math.max(0, 100 - (health.consecutiveFailures * 20));

    // 3. Latency (20%)
    let latencyScore = 50; // default neutral
    if (health.avgLatencyMs > 0) {
        if (health.avgLatencyMs < 1000) latencyScore = 100;
        else if (health.avgLatencyMs < 3000) latencyScore = 80;
        else if (health.avgLatencyMs < 5000) latencyScore = 40;
        else latencyScore = 10;
    }

    // 4. Cost/Priority (10%)
    // Layer 0 and 1 get max points for being free/cheap
    const costScore = provider.layer <= 1 ? 100 : (provider.layer <= 3 ? 80 : 50);

    // Weighted Sum
    score = (capScore * AI_CONFIG.SCORING.CAPABILITY) +
        (reliabilityScore * AI_CONFIG.SCORING.RELIABILITY) +
        (latencyScore * AI_CONFIG.SCORING.LATENCY) +
        (costScore * AI_CONFIG.SCORING.COST);

    return {
        providerId: provider.id,
        score,
        breakdown: {
            capability: capScore,
            reliability: reliabilityScore,
            latency: latencyScore,
            cost: costScore
        }
    };
};
