import React from 'react';
import { useAiPrefs } from '../../context/aiProviderPrefs';
import { PROVIDER_REGISTRY } from '../../ai/registry';
import { UserAiPreference } from '../../ai/types';

const AiProvidersPage: React.FC = () => {
    const { prefs, updatePrefs, isLoading } = useAiPrefs();
    const providers = Object.values(PROVIDER_REGISTRY);

    if (isLoading) return <div className="p-10 text-white">Loading Neural Configurations...</div>;

    const handleModeChange = (mode: UserAiPreference['mode']) => {
        updatePrefs({ mode });
    };

    const toggleProvider = (id: string) => {
        const currentDisabled = new Set(prefs.disabledProviders);
        if (currentDisabled.has(id)) {
            currentDisabled.delete(id);
        } else {
            currentDisabled.add(id);
        }
        updatePrefs({ disabledProviders: Array.from(currentDisabled) });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                AI Provider Settings
            </h1>
            <p className="text-gray-400 mb-8">Configure how ArchiTech-Wize accesses intelligence.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mode Selection */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Compute Mode</h2>
                    <div className="space-y-3">
                        {['auto', 'device', 'community', 'cloud'].map((m) => (
                            <button
                                key={m}
                                onClick={() => handleModeChange(m as any)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${prefs.mode === m
                                        ? 'border-blue-500 bg-blue-900/20 text-blue-200'
                                        : 'border-gray-700 hover:bg-gray-750'
                                    }`}
                            >
                                <span className="font-bold uppercase tracking-wider text-sm">{m}</span>
                                <div className="text-xs text-gray-400 mt-1">
                                    {m === 'auto' && "Balances Speed, Cost, and Quality automatically."}
                                    {m === 'device' && "Forces local WebGPU models (High Privacy, Low Cost)."}
                                    {m === 'community' && "Prefers P2P networks like Petals."}
                                    {m === 'cloud' && "Prefers high-end APIs (OpenRouter, Gemini)."}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={prefs.allowPaidFallback}
                                onChange={(e) => updatePrefs({ allowPaidFallback: e.target.checked })}
                                className="form-checkbox h-5 w-5 text-purple-600 rounded bg-gray-700 border-gray-600 focus:ring-purple-500"
                            />
                            <div>
                                <span className="font-medium">Allow Paid Fallback</span>
                                <p className="text-xs text-gray-400">If free providers fail, use paid credits?</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Provider Registry */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Active Providers</h2>
                    <div className="space-y-4">
                        {providers.map(p => {
                            const isDisabled = prefs.disabledProviders.includes(p.id);
                            return (
                                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold">{p.name}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${p.layer === 0 ? 'bg-green-900 text-green-300' :
                                                    p.layer === 5 ? 'bg-yellow-900 text-yellow-300' : 'bg-gray-700'
                                                }`}>Layer {p.layer}</span>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {p.capabilities.join(', ')}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleProvider(p.id)}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${isDisabled
                                                ? 'bg-red-900/20 text-red-400 border border-red-900 hover:bg-red-900/40'
                                                : 'bg-green-900/20 text-green-400 border border-green-900 hover:bg-green-900/40'
                                            }`}
                                    >
                                        {isDisabled ? 'DISABLED' : 'ACTIVE'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiProvidersPage;
