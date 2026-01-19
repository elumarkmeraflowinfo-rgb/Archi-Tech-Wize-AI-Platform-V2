import React, { useState, useEffect } from 'react';
import { aiService } from '../src/services/aiService';
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

interface ModelStatus {
    name: string;
    category: string;
    status: 'pending' | 'success' | 'error';
    message?: string;
}

const ModelHealthCheck: React.FC = () => {
    const [healthStatus, setHealthStatus] = useState<any>(null);
    const [modelTests, setModelTests] = useState<ModelStatus[]>([
        { name: 'Text Generation (HF)', category: 'text-hf', status: 'pending' },
        { name: 'Code Generation', category: 'code', status: 'pending' },
        { name: 'Image Generation', category: 'image', status: 'pending' },
        { name: 'Music Generation', category: 'music', status: 'pending' },
        { name: 'Video Generation', category: 'video', status: 'pending' },
        { name: 'Text-to-Speech', category: 'tts', status: 'pending' },
    ]);
    const [isRunning, setIsRunning] = useState(false);

    const checkGatewayHealth = async () => {
        try {
            const health = await aiService.checkHealth();
            setHealthStatus(health);
            return health.status === 'online';
        } catch (err) {
            setHealthStatus({ status: 'offline', providers: {} });
            return false;
        }
    };

    const testModel = async (model: ModelStatus, index: number) => {
        const updated = [...modelTests];

        try {
            let result;
            switch (model.category) {
                case 'text-hf':
                    result = await aiService.chat('Hello', '', 'novice', 'hf');
                    break;
                case 'code':
                    result = await aiService.generateCode('function to add two numbers', 'javascript');
                    break;
                case 'image':
                    result = await aiService.generateImage('a beautiful sunset');
                    break;
                case 'music':
                    result = await aiService.generateMusic('calm piano melody');
                    break;
                case 'video':
                    result = await aiService.generateVideo('ocean waves');
                    break;
                case 'tts':
                    result = await aiService.generateSpeech('Hello world');
                    break;
            }

            updated[index] = { ...model, status: 'success', message: 'Connected ✓' };
        } catch (err: any) {
            updated[index] = { ...model, status: 'error', message: err.message || 'Failed' };
        }

        setModelTests(updated);
    };

    const runAllTests = async () => {
        setIsRunning(true);

        // First check gateway health
        const isOnline = await checkGatewayHealth();

        if (!isOnline) {
            alert('Gateway is offline. Please check HF_TOKEN in Netlify environment variables.');
            setIsRunning(false);
            return;
        }

        // Test each model sequentially
        for (let i = 0; i < modelTests.length; i++) {
            await testModel(modelTests[i], i);
        }

        setIsRunning(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-6">AI Model Health Check</h1>

            {/* Gateway Status */}
            <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h2 className="font-bold text-lg mb-3">Gateway Status</h2>
                {healthStatus ? (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${healthStatus.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {healthStatus.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                            </span>
                        </div>
                        <div className="text-xs text-slate-600">
                            <p>Hugging Face: {healthStatus.providers?.huggingface ? '✓ Connected' : '✗ Missing Token'}</p>
                            <p>Gemini: {healthStatus.providers?.gemini ? '✓ Connected' : '○ Optional'}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-500">Click "Run Tests" to check gateway status</p>
                )}
            </div>

            {/* Model Tests */}
            <div className="space-y-3 mb-6">
                {modelTests.map((model, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                            {model.status === 'pending' && <div className="w-5 h-5 rounded-full bg-slate-300"></div>}
                            {model.status === 'success' && <CheckCircle className="text-green-500" size={20} />}
                            {model.status === 'error' && <XCircle className="text-red-500" size={20} />}
                            <div>
                                <p className="font-bold text-slate-900">{model.name}</p>
                                {model.message && <p className="text-xs text-slate-500">{model.message}</p>}
                            </div>
                        </div>
                        <span className="text-xs text-slate-400 uppercase">{model.category}</span>
                    </div>
                ))}
            </div>

            {/* Run Tests Button */}
            <button
                onClick={runAllTests}
                disabled={isRunning}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isRunning ? (
                    <>
                        <Loader className="animate-spin" size={20} />
                        Testing Models...
                    </>
                ) : (
                    'Run All Tests'
                )}
            </button>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2">
                    <AlertCircle className="text-blue-600 shrink-0" size={20} />
                    <div className="text-sm text-blue-900">
                        <p className="font-bold mb-1">Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Ensure <code className="bg-white px-1 rounded">HF_TOKEN</code> is set in Netlify</li>
                            <li>Click "Run All Tests" to verify each model</li>
                            <li>Green = Working, Red = Error (check console for details)</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelHealthCheck;
