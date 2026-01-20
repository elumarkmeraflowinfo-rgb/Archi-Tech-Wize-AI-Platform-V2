import { AiProvider } from './base';
import { AiRequest, AiResponse } from '../types';

export class WebLlmProvider implements AiProvider {
    id = 'webllm-browser';

    async execute(request: AiRequest): Promise<AiResponse> {
        throw new Error('WebLLM integration not yet fully implemented.');
    }
}
