import { gateway } from '../ai/gateway';
import { AiRequest, AiResponse, Capability } from '../ai/types';

// Backward compatibility interface
export interface AgentRequirements {
    role?: string;
    industry?: string;
    tasks?: string[];
    tone?: string;
}

export const aiService = {
    // 1. General Chat / Research
    chat: async (prompt: string, systemInstruction: string = "", subscriptionTier: string = "novice", provider: "auto" | "hf" | "gemini" = "auto"): Promise<string> => {
        try {
            // Note: 'provider' arg is ignored in favor of Gateway logic unless we map it to user preference
            const response = await gateway.routeRequest({
                task: 'REALTIME_CHAT',
                prompt,
                systemInstruction,
                tier: subscriptionTier as any,
                userId: 'legacy-user' // Ideally get from context
            });
            return response.result;
        } catch (error) {
            console.error('AI chat error:', error);
            throw error;
        }
    },

    // 2. The Super Agent Builder
    buildAgent: async (requirements: string, subscriptionTier: string = "novice", provider: "auto" | "hf" | "gemini" = "auto"): Promise<any> => {
        try {
            const systemInstruction = `You are the Architectwise Meta-Agent. 
            Your goal is to draft detailed system prompts for NEW AI agents based on user requirements.
            Output format: JSON object with fields 'name', 'tagline', 'systemPrompt' (detailed), 'suggestedTools' (array of strings).
            Do not output markdown code blocks, just the raw JSON.`;

            const response = await gateway.routeRequest({
                task: 'DEEP_REASONING', // Agent building needs reasoning
                prompt: requirements,
                systemInstruction,
                tier: subscriptionTier as any
            });

            // Parse Logic (Kept from original)
            let text = response.result || "";
            text = text.replace(/```(json)?\n?|```/g, '').trim();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) text = jsonMatch[0];

            try {
                const parsed = JSON.parse(text);
                return {
                    name: typeof parsed.name === 'string' ? parsed.name : "Architected Agent",
                    tagline: typeof parsed.tagline === 'string' ? parsed.tagline : "The custom solution",
                    systemPrompt: typeof parsed.systemPrompt === 'string' ? parsed.systemPrompt :
                        (typeof parsed.systemPrompt === 'object' ? JSON.stringify(parsed.systemPrompt, null, 2) : String(parsed.systemPrompt)),
                    suggestedTools: Array.isArray(parsed.suggestedTools) ? parsed.suggestedTools : []
                };
            } catch (pE) {
                console.error("JSON Parse failed, returning raw:", text);
                return {
                    name: "Architected Agent",
                    tagline: "Neural sync issues detected",
                    systemPrompt: text,
                    suggestedTools: []
                };
            }
        } catch (error) {
            console.error('AI build error:', error);
            throw error;
        }
    },

    // 3. Image Generation
    generateImage: async (prompt: string, subscriptionTier: string = "novice"): Promise<string> => {
        try {
            const response = await gateway.routeRequest({
                task: 'IMAGE_GENERATION',
                prompt,
                tier: subscriptionTier as any
            });
            return response.result;
        } catch (error) {
            console.error('AI image error:', error);
            throw error;
        }
    },

    // 4. Video Generation
    generateVideo: async (prompt: string, subscriptionTier: string = "novice"): Promise<string> => {
        try {
            const response = await gateway.routeRequest({
                task: 'VIDEO_GENERATION',
                prompt,
                tier: subscriptionTier as any
            });
            return response.result; // Likely a Job ID "REQ_ID:..."
        } catch (error) {
            console.error('AI video error:', error);
            throw error;
        }
    },

    // 5. Upscaling
    upscaleImage: async (imageUrl: string, subscriptionTier: string = "pro"): Promise<string> => {
        if (!imageUrl) throw new Error('Image URL required');
        try {
            const response = await gateway.routeRequest({
                task: 'IMAGE_GENERATION', // Treat as image task
                prompt: 'Upscale this image',
                imageUrl,
                tier: subscriptionTier as any
            });
            return response.result;
        } catch (error) {
            console.error('AI upscale error:', error);
            throw error;
        }
    },

    // 5b. Img2Img
    transformImage: async (imageUrl: string, targetPrompt: string, subscriptionTier: string = "novice"): Promise<string> => {
        if (!imageUrl || !targetPrompt) throw new Error('Helpers required');
        try {
            // Note: Original sent JSON string as prompt. Gateway expects clean prompt and separate imageUrl
            const response = await gateway.routeRequest({
                task: 'IMAGE_GENERATION',
                prompt: targetPrompt,
                imageUrl,
                tier: subscriptionTier as any
            });
            return response.result;
        } catch (error) {
            console.error('AI img2img error:', error);
            throw error;
        }
    },

    // 6. Speech
    generateSpeech: async (text: string, voiceCloneUrl?: string, subscriptionTier: string = "novice"): Promise<string> => {
        try {
            const response = await gateway.routeRequest({
                task: 'AUDIO_SPEECH',
                prompt: text,
                voiceCloneUrl,
                tier: subscriptionTier as any
            });
            return response.result;
        } catch (error) {
            console.error('AI speech error:', error);
            throw error;
        }
    },

    // 7. Analysis
    analyzeData: async (dataInput: string, subscriptionTier: string = "novice"): Promise<string> => {
        try {
            const response = await gateway.routeRequest({
                task: 'ANALYSIS',
                prompt: dataInput,
                tier: subscriptionTier as any
            });
            return response.result;
        } catch (error) {
            console.error('AI analysis error:', error);
            throw error;
        }
    },

    // 8. Code
    generateCode: async (prompt: string, language: string = "javascript", subscriptionTier: string = "novice"): Promise<string> => {
        try {
            const fullPrompt = `Write ${language} code for: ${prompt}. Return ONLY the code.`;
            const response = await gateway.routeRequest({
                task: 'CODE_GENERATION',
                prompt: fullPrompt,
                tier: subscriptionTier as any
            });
            return response.result;
        } catch (error) {
            console.error('AI code error:', error);
            throw error;
        }
    },

    // 9. Music
    generateMusic: async (prompt: string, subscriptionTier: string = "novice"): Promise<string> => {
        try {
            const response = await gateway.routeRequest({
                task: 'MUSIC_GENERATION',
                prompt,
                tier: subscriptionTier as any
            });
            return response.result;
        } catch (error) {
            console.error('AI music error:', error);
            throw error;
        }
    },

    // 10. Health
    checkHealth: async (): Promise<{ status: string, providers: any }> => {
        // We can expose the internal health store here
        // For now, minimal mock to satisfy interface
        return {
            status: 'online',
            providers: {}
        };
    }
};
