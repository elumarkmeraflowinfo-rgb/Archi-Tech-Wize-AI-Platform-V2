
import React, { useState } from 'react';
import {
    Briefcase, Globe, Zap, CheckCircle, ArrowRight, ArrowLeft,
    Palette, Layout, Rocket, Loader2, Target
} from 'lucide-react';
import { aiService } from '../src/services/aiService';

interface BusinessConfig {
    name: string;
    industry: string;
    description: string;
    goal: string;
    colors: string[];
    features: string[];
}

const STEPS = [
    { id: 'basics', label: 'Business Identity', icon: <Briefcase /> },
    { id: 'branding', label: 'Brand DNA', icon: <Palette /> },
    { id: 'structure', label: 'Site Structure', icon: <Layout /> },
    { id: 'automation', label: 'Automation', icon: <Zap /> },
    { id: 'code', label: 'Code Blueprint', icon: <CheckCircle /> },
    { id: 'launch', label: 'Launch', icon: <Rocket /> },
];

const BusinessBuilderWizard: React.FC<{ onComplete: (config: any) => void, onCancel: () => void }> = ({ onComplete, onCancel }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState<BusinessConfig>({
        name: '',
        industry: '',
        description: '',
        goal: 'leads',
        colors: ['#0f172a', '#3b82f6', '#ffffff'],
        features: []
    });
    const [aiSuggestions, setAiSuggestions] = useState<any>(null);

    const handleNext = async () => {
        if (currentStep === 0 && !aiSuggestions) {
            setIsLoading(true);
            try {
                // Determine subscriptionTier logic elsewhere or default
                const prompt = `Suggest branding (colors, tone) and site structure for a ${config.industry} business named "${config.name}" that wants to "${config.goal}". Return JSON with keys: recommendedColors (array of hex), tone, suggestedPages (array of strings).`;
                const res = await aiService.chat(prompt, "You are a Brand Strategist. Output valid JSON only.", "novice");

                try {
                    const parsed = JSON.parse(res.replace(/```json\n?|\n?```/g, ''));
                    setAiSuggestions(parsed);
                    if (parsed.recommendedColors) {
                        setConfig(prev => ({ ...prev, colors: parsed.recommendedColors }));
                    }
                } catch (e) {
                    console.error("AI Parse Error", e);
                }
            } catch (e) {
                console.error("AI Error", e);
            } finally {
                setIsLoading(false);
            }
        }

        if (currentStep === 3) { // Trigger code gen before moving to step 4 (Code Preview)
            if (!aiSuggestions?.generatedCode) {
                setIsLoading(true);
                try {
                    const codePrompt = `Create a solid NodeJS/Express backend structure for a ${config.industry} company named ${config.name}. Include routes for ${config.features.join(', ')}.`;
                    const code = await aiService.generateCode(codePrompt, "javascript", "novice");
                    setAiSuggestions(prev => ({ ...prev, generatedCode: code }));
                } catch (e) {
                    console.error("Code Gen Error", e);
                } finally {
                    setIsLoading(false);
                }
            }
        }

        if (currentStep < 5) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete(config);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Let's Define Your Business</h2>
                            <p className="text-slate-500">We'll build your entire digital ecosystem around this core.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                            <input
                                type="text" className="w-full p-4 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. Acme Innovations"
                                value={config.name} onChange={e => setConfig({ ...config, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Industry / Niche</label>
                            <input
                                type="text" className="w-full p-4 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. Digital Marketing Agency"
                                value={config.industry} onChange={e => setConfig({ ...config, industry: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Primary Goal</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['Get Leads', 'Sell Products', 'Book Appointments', 'Build Community'].map(g => (
                                    <div
                                        key={g}
                                        onClick={() => setConfig({ ...config, goal: g })}
                                        className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-2 ${config.goal === g ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <Target size={18} />
                                        <span className="font-bold text-sm">{g}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Your Brand DNA</h2>
                            <p className="text-slate-500">AI-suggested aesthetics based on your industry.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Color Palette</label>
                            <div className="flex gap-4 mb-4">
                                {config.colors.map((c, i) => (
                                    <div key={i} className="w-16 h-16 rounded-full shadow-md border border-slate-100" style={{ backgroundColor: c }}></div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500">Suggested based on "{config.industry}" psychology.</p>
                        </div>

                        {aiSuggestions && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-sm text-slate-900 mb-2">Recommended Tone</h4>
                                <p className="text-sm text-slate-600">{aiSuggestions.tone || "Professional, trustworthy, and innovative."}</p>
                            </div>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Site Architecture</h2>
                            <p className="text-slate-500">We'll generate these pages for you automatically.</p>
                        </div>

                        <div className="space-y-3">
                            {(aiSuggestions?.suggestedPages || ['Home', 'About', 'Services', 'Contact']).map((page: string, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Layout size={16} /></div>
                                        <span className="font-bold text-slate-800">{page}</span>
                                    </div>
                                    <CheckCircle size={18} className="text-green-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Core Automation</h2>
                            <p className="text-slate-500">Select the workflows to install immediately.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: 'lead-email', name: 'Lead Welcome Email', desc: 'Auto-send welcome guide when form submitted.' },
                                { id: 'crm-sync', name: 'CRM Sync', desc: 'Save all contacts to built-in CRM.' },
                                { id: 'audit-log', name: 'Security Audit', desc: 'Log all admin actions.' }
                            ].map((w) => (
                                <div
                                    key={w.id}
                                    onClick={() => {
                                        const newFeatures = config.features.includes(w.id)
                                            ? config.features.filter(f => f !== w.id)
                                            : [...config.features, w.id];
                                        setConfig({ ...config, features: newFeatures });
                                    }}
                                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-4 ${config.features.includes(w.id) ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}
                                >
                                    <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center ${config.features.includes(w.id) ? 'bg-green-500 border-green-500' : 'border-slate-300 bg-white'}`}>
                                        {config.features.includes(w.id) && <CheckCircle size={14} className="text-white" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{w.name}</h4>
                                        <p className="text-sm text-slate-500">{w.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">System Blueprint & Code</h2>
                            <p className="text-slate-500">Qwen-Coder has generated your core architectural boilerplate.</p>
                        </div>

                        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                            <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
                                <span className="text-xs font-mono text-slate-400">src/server.js</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                {aiSuggestions?.generatedCode ? (
                                    <pre className="text-xs font-mono text-blue-300 whitespace-pre-wrap">{aiSuggestions.generatedCode}</pre>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                        <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
                                        <p>Generating Full-Stack Boilerplate...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6 animate-fade-in-up text-center">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Rocket size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Ready to Launch?</h2>
                        <p className="text-slate-500 max-w-md mx-auto">
                            We are about to generate your website structure, configure your brand assets, and activate your selected automations.
                        </p>

                        <div className="bg-slate-50 p-6 rounded-2xl max-w-sm mx-auto text-left space-y-2 mt-8">
                            <div className="flex justify-between text-sm"><span className="text-slate-500">Business:</span> <span className="font-bold">{config.name}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-500">Pages:</span> <span className="font-bold">{aiSuggestions?.suggestedPages?.length || 4}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-500">Automations:</span> <span className="font-bold">{config.features.length}</span></div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                            {currentStep + 1}
                        </div>
                        <span className="font-bold text-slate-700">{STEPS[currentStep].label} ({(currentStep < STEPS.length) ? '' : 'Final'})</span>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-red-500 px-3 py-1 text-sm font-bold">Exit Builder</button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto flex-1 relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                            <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
                            <p className="text-slate-500 font-bold animate-pulse">Analying Industry Trends...</p>
                        </div>
                    ) : renderStepContent()}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 flex justify-between items-center bg-white">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`text-slate-500 font-bold hover:text-slate-800 flex items-center gap-2 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!config.name && currentStep === 0}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/20"
                    >
                        {currentStep === 5 ? 'Launch System' : 'Continue'} <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BusinessBuilderWizard;
