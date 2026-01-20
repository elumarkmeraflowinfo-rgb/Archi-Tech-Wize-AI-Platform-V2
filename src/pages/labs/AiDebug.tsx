import React, { useEffect, useState } from 'react';
import { telemetry } from '../../ai/telemetry';
import { healthSystem } from '../../ai/health';
import { PROVIDER_REGISTRY } from '../../ai/registry';

const AiDebugPage: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Auto-refresh logs every second
    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(telemetry.getRecentLogs());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const copyLogs = () => {
        navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
        alert('Logs copied to clipboard');
    };

    const providers = Object.values(PROVIDER_REGISTRY);

    return (
        <div className="min-h-screen bg-black text-green-400 p-8 font-mono text-xs">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold border-b border-green-600 pb-2 w-full">
                    TERMINAL :: AI_GATEWAY_DEBUG
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Health Status Panel */}
                <div className="col-span-1 border border-green-800 p-4 bg-gray-900 rounded opacity-90">
                    <h2 className="text-lg font-bold mb-4 text-white">SYSTEM_HEALTH</h2>
                    <div className="space-y-4">
                        {providers.map(p => {
                            const health = healthSystem.getHealth(p.id);
                            const statusColor = health.circuitBreakerOpen
                                ? 'text-red-500'
                                : (health.consecutiveFailures > 0 ? 'text-yellow-500' : 'text-green-500');

                            return (
                                <div key={p.id} className="border-b border-gray-800 pb-2">
                                    <div className="flex justify-between">
                                        <span className="font-bold">{p.id}</span>
                                        <span className={statusColor}>
                                            {health.circuitBreakerOpen ? 'OPEN (CRITICAL)' : 'HEALTHY'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-1 text-gray-400">
                                        <div>Success: {health.successRate.toFixed(2)}</div>
                                        <div>Avg Latency: {Math.floor(health.avgLatencyMs)}ms</div>
                                        <div>Failures: {health.consecutiveFailures}</div>
                                        <div>Total Reqs: {health.totalRequests}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Telemetry Stream */}
                <div className="col-span-2 border border-green-800 p-4 bg-gray-900 rounded opacity-90 h-[80vh] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-white">TELEMETRY_STREAM</h2>
                        <div className="space-x-2">
                            <button onClick={() => telemetry.clearLogs()} className="bg-red-900 px-3 py-1 rounded hover:bg-red-800">CLEAR</button>
                            <button onClick={copyLogs} className="bg-blue-900 px-3 py-1 rounded hover:bg-blue-800">EXPORT_LOGS</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto space-y-2 font-mono">
                        {logs.length === 0 && <div className="text-gray-500 italic">No events recorded. Waiting for signal...</div>}
                        {logs.map((log, idx) => (
                            <div key={idx} className="border-l-2 border-green-700 pl-2 py-1">
                                <div className="flex space-x-2 text-gray-500">
                                    <span>[{new Date(log.timestamp).toISOString().split('T')[1].replace('Z', '')}]</span>
                                    <span className={`font-bold ${log.type.includes('FAILURE') ? 'text-red-500' :
                                            log.type.includes('SUCCESS') ? 'text-blue-400' : 'text-yellow-300'
                                        }`}>{log.type}</span>
                                </div>
                                <div className="text-gray-300 ml-6">
                                    TaskId: <span className="text-white">{log.taskId}</span>
                                </div>
                                <pre className="ml-6 text-gray-500 overflow-x-auto whitespace-pre-wrap">
                                    {JSON.stringify(log.details, null, 2)}
                                </pre>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiDebugPage;
