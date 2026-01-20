import { AiProvider } from './base';
import { AiRequest, AiResponse } from '../types';

export class OpenRouterProvider implements AiProvider {
    id = 'openrouter-free';

    async execute(request: AiRequest): Promise<AiResponse> {
        throw new Error('OpenRouter integration not yet fully implemented. Please use Legacy Layer 0.');

        // Implementation TODO:
        // fetch('https://openrouter.ai/api/v1/chat/completions', ...)
    }
}
