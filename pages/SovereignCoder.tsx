import React, { useState } from 'react';
import { aiService } from '../src/services/aiService';
import { Activity, Code, Terminal, Play, Save, Copy, Check, Loader2, ArrowLeft, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const SovereignCoder = () => {
    const [prompt, setPrompt] = useState('');
    const [language, setLanguage] = useState('react');
    const [code, setCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setCode(""); // Clear previous code
        try {
            const res = await aiService.generateCode(prompt, language);
            setCode(res);
        } catch (error: any) {
            console.error(error);
            setCode(`// ERROR: The neural link was severed.\n// DETECTED: ${error.message || "Connection timeout"}\n// ACTION: Please try again or refine your prompt.`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 bg-[#050505] text-white font-sans">
            <header className="mb-12 text-center relative max-w-6xl mx-auto">
                <Link to="/demos" className="absolute left-0 top-0 text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> <span className="hidden md:inline">Back</span>
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Activity size={12} className="text-blue-500" /> Neural Code Engine Active
                </div>
                <h1 className="text-6xl font-black mb-4 tracking-tighter">
                    SOVEREIGN <span className="text-blue-500">CODER</span>
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Powered by Qwen-2.5-Coder (32B). Generate production-ready infrastructure, logic, and components.
                </p>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 shadow-2xl">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Architectural Requirements</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. Create a React component for a glassmorphic dashboard card with hover effects..."
                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 text-gray-200 min-h-[200px] mb-6 focus:border-blue-500 outline-none font-mono text-sm resize-none"
                        />

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Target Ecosystem</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['react', 'typescript', 'python', 'nodejs', 'rust', 'go'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setLanguage(lang)}
                                        className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${language === lang
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-[#0a0a0a] border-gray-800 text-gray-500 hover:border-gray-600'}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full bg-white text-black hover:bg-gray-200 py-4 font-black transition-all active:scale-95"
                        >
                            {isGenerating ? (
                                <><Loader2 className="animate-spin mr-2" size={20} /> Synthesizing...</>
                            ) : (
                                <><Rocket className="mr-2" size={20} /> Materialize Code</>
                            )}
                        </Button>
                    </div>

                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6">
                        <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                            <Terminal size={16} /> Technical Spec
                        </h4>
                        <p className="text-xs text-blue-300/70 leading-relaxed">
                            Qwen-2.5-Coder provides state-of-the-art coding capabilities, surpassing many proprietary models in logic and syntax accuracy.
                        </p>
                    </div>
                </div>

                {/* Output Terminal */}
                <div className="lg:col-span-8">
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-full min-h-[600px] shadow-2xl">
                        <div className="bg-[#111] border-b border-gray-800 p-4 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleCopy}
                                    className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold transition-all"
                                >
                                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy Source'}
                                </button>
                                <button className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold transition-all">
                                    <Save size={14} /> Download
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 p-6 font-mono text-sm overflow-auto text-blue-100/90 whitespace-pre scrollbar-hide">
                            {code ? code : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-50">
                                    <Code size={48} className="mb-4" />
                                    <p>Terminal ready for stream...</p>
                                </div>
                            )}
                        </div>
                        <div className="bg-[#050505] p-3 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest px-6">
                            <span>Status: Ready</span>
                            <span>Line: {code.split('\n').length}</span>
                            <span>Char: {code.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SovereignCoder;
