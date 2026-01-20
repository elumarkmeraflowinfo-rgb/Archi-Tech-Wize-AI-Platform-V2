import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AiRequest, AiResponse } from './types';

export const jobQueue = {
    /**
     * Submits a batch job to Firestore for processing by external workers (Layer 4)
     */
    submit: async (request: AiRequest): Promise<AiResponse> => {
        if (!request.userId) {
            throw new Error('Batch jobs require a userId');
        }

        try {
            const jobsRef = collection(db, `users/${request.userId}/jobs`);
            const docRef = await addDoc(jobsRef, {
                type: request.task,
                prompt: request.prompt,
                payload: request, // Full details
                status: 'pending',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                layer: 4 // Explicitly marking as Batch/Layer 4
            });

            // For batch jobs, we strictly return a "Ticket" response right away
            // The UI should poll this Job ID or listen to it.
            return {
                result: `REQ_ID:${docRef.id}`, // Protocol: Client sees this and knows to poll
                providerId: 'batch-queue',
                providerLayer: 4,
                latencyMs: 0,
                metadata: {
                    jobId: docRef.id,
                    status: 'pending'
                }
            };
        } catch (error) {
            console.error('Job Queue submission failed:', error);
            throw error;
        }
    }
};
