import { AiRequest, AiResponse } from '../types';

export interface AiProvider {
    id: string; // Matches registry ID
    execute(request: AiRequest): Promise<AiResponse>;
}
