import { AiProvider } from './base';
import { AiRequest, AiResponse } from '../types';

export class LegacyHfProvider implements AiProvider {
    id = 'legacy-hf';

    async execute(request: AiRequest): Promise<AiResponse> {
        // Map new AiRequest to the format the Netlify Function expects
        const payload = {
            mode: this.mapTaskToMode(request.task),
            prompt: request.prompt,
            systemInstruction: request.systemInstruction,
            subscriptionTier: request.tier || 'novice',
            imageUrl: request.imageUrl,
            voiceCloneUrl: request.voiceCloneUrl
        };

        const response = await fetch('/api/ai-gateway', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Legacy Provider Failed');
        }

        return {
            result: data.result,
            providerId: 'legacy-hf',
            providerLayer: 0,
            latencyMs: 0, // We could measure this, but gateway does it
            metadata: {
                backendModel: 'unknown' // The function hides it
            }
        };
    }

    private mapTaskToMode(task: string): string {
        switch (task) {
            case 'REALTIME_CHAT': return 'text';
            case 'DEEP_REASONING': return 'text'; // Fallback
            case 'CREATIVE_WRITING': return 'text';
            case 'IMAGE_GENERATION': return 'image';
            case 'VIDEO_GENERATION': return 'video';
            case 'AUDIO_SPEECH': return 'tts';
            case 'CODE_GENERATION': return 'code-generation';
            case 'MUSIC_GENERATION': return 'music';
            case 'ANALYSIS': return 'analyze';
            default: return 'text';
        }
    }
}
