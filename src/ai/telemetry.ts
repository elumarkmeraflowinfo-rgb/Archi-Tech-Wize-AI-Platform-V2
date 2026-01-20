import { AiRequest, AiResponse, AiError, ProviderScore } from './types';
import { IS_BROWSER } from './config';

interface TelemetryEvent {
    timestamp: number;
    type: 'REQUEST_START' | 'PROVIDER_SELECTED' | 'REQUEST_SUCCESS' | 'REQUEST_FAILURE' | 'FALLBACK_TRIGGERED' | 'FAILSAFE_TRIGGERED';
    taskId: string;
    details: any;
}

// In-memory buffer for the Debug Panel
export const telemetryLog: TelemetryEvent[] = [];
const MAX_LOG_SIZE = 100;

export const telemetry = {
    log: (type: TelemetryEvent['type'], details: any) => {
        const event: TelemetryEvent = {
            timestamp: Date.now(),
            type,
            taskId: details.taskId || 'unknown',
            details
        };

        // Add to in-memory log
        telemetryLog.unshift(event);
        if (telemetryLog.length > MAX_LOG_SIZE) telemetryLog.pop();

        // Console log for dev
        if (IS_BROWSER) {
            console.debug(`[AiGateway] ${type}`, details);
        } else {
            console.log(JSON.stringify(event));
        }

        // Future: Send to Firebase Analytics or Logging Service
    },

    getRecentLogs: () => [...telemetryLog],

    clearLogs: () => {
        telemetryLog.length = 0;
    }
};
