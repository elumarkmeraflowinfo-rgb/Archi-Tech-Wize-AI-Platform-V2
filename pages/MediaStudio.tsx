import React, { useState } from 'react';
import { aiService } from '../src/services/aiService';
import {
    Image as ImageIcon, Video, Zap, Wand2, Layers,
    Download, Share2, Maximize, PlayCircle, Loader2, ArrowLeft, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Gatekeeper from '../components/Gatekeeper';
import { useSubscription } from '../context/SubscriptionContext';

// Types
type MediaType = 'image' | 'video' | 'upscale' | 'img2img';

const MediaStudio = () => {
    const { tier, incrementRequestCount } = useSubscription();
    const [activeBox, setActiveBox] = useState<MediaType>('image');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev]);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setLogs([]); // Clear logs on new gen
        addLog(`Initializing ${activeBox} protocol...`);
        addLog(`Targeting neural engine...`);

        try {
            let res;
            if (activeBox === 'image') {
                addLog("Projecting neural imagery (FLUX/SDXL)...");
                res = await aiService.generateImage(prompt, tier);
                incrementRequestCount(); // Track request count
            } else if (activeBox === 'img2img') {
                addLog("Initiating Transmutation Engine (Pix2Pix/ControlNet)...");
                res = await aiService.transformImage(resultUrl || prompt, prompt || "enhance this image");
                incrementRequestCount();
            } else if (activeBox === 'video') {
                addLog("Waking Motion Engine (Zeroscope/MS)...");
                res = await aiService.generateVideo(prompt, tier);
                incrementRequestCount();
            } else if (activeBox === 'upscale') {
                addLog("Upscaling to 4K neural clarity...");
                // If we have a resultUrl, upscale that. Otherwise use prompt as URL.
                const target = resultUrl || prompt;
                if (!target) throw new Error("No image found to upscale. Generate or paste a URL.");
                res = await aiService.upscaleImage(target);
                incrementRequestCount();
            }

            if (res) {
                setResultUrl(res);
                addLog("Asset materialized successfully.");
            }
        } catch (error: any) {
            console.error(error);
            const msg = error.message || "Neural link collapse";
            addLog(`FAILURE: ${msg}`);
            if (msg.includes("No Inference Provider")) {
                addLog("NOTICE: This engine is currently in maintenance. Auto-routing to fallback...");
            } else if (msg.includes("Upgrade Required")) {
                addLog("NOTICE: Energy depletion. Core upgrade required for this frequency.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (!resultUrl) return;
        const link = document.createElement('a');
        link.href = resultUrl;
        const extension = activeBox === 'video' ? 'mp4' : 'png';
        link.download = `architech-wize-${activeBox}-${Date.now()}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 bg-black text-white selection:bg-cyan-500/30">
            {/* Header */}
            <header className="mb-12 text-center relative">
                <Link to="/demos" className="absolute left-0 top-0 text-cyan-500 hover:text-cyan-400 flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> <span className="hidden md:inline">Back to Playground</span>
                </Link>
                <div className="flex justify-center gap-4 mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/20 border border-cyan-500/20 text-cyan-500 text-[10px] font-bold uppercase tracking-widest">
                        <Activity size={12} className="animate-pulse" /> Neural Link: Online
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 border border-purple-500/20 text-purple-500 text-[10px] font-bold uppercase tracking-widest">
                        <Zap size={12} /> Buffer: Clear
                    </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                    MEDIA STUDIO
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    The Visual Cortex. Generate master-level imagery, synthesize motion, and upscale to 4K neural clarity.
                </p>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. Control Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 h-fit backdrop-blur-xl">
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {[
                                { id: 'image', icon: ImageIcon, label: 'FLUX Gen' },
                                { id: 'video', icon: Video, label: 'Motion' },
                                { id: 'upscale', icon: Maximize, label: 'Upscale 4K' },
                                { id: 'img2img', icon: Wand2, label: 'Transform' },
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => {
                                        setActiveBox(mode.id as MediaType);
                                        // Keeping resultUrl so user can transform/upscale it
                                    }}
                                    className={`flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all ${activeBox === mode.id
                                        ? 'bg-gray-800 text-cyan-400 shadow-lg shadow-cyan-900/20'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    <mode.icon className="w-4 h-4 mr-2" />
                                    {mode.label}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-1000 blur"></div>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={
                                        activeBox === 'image' ? "Describe a visual masterpiece..." :
                                            activeBox === 'video' ? "Describe a moving scene (e.g. cloud time-lapse)..." :
                                                activeBox === 'img2img' ? "Describe the transformation..." :
                                                    "Paste an image URL to upscale..."
                                    }
                                    className="relative w-full bg-black border border-gray-800 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-cyan-500/50 min-h-[160px] resize-none font-mono text-sm placeholder:text-gray-700"
                                />
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full justify-center py-4 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                            >
                                {isGenerating ? (
                                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Neural Processing...</>
                                ) : (
                                    <><Zap className="w-5 h-5 mr-2" /> Activate Engine</>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Logs Terminal */}
                    <div className="bg-black/50 rounded-3xl border border-gray-800 p-6 font-mono text-xs h-48 overflow-y-auto backdrop-blur-xl">
                        <div className="text-gray-500 border-b border-gray-900 pb-2 mb-2 flex items-center justify-between">
                            <div className="flex items-center">
                                <Layers className="w-3 h-3 mr-2" /> SYSTEM LOGS
                            </div>
                            <span className="text-[10px] opacity-30">ENCRYPTED STREAM</span>
                        </div>
                        {logs.map((log, i) => (
                            <div key={i} className="mb-1 text-cyan-500/80">
                                <span className="opacity-50 mr-2 text-[10px] font-bold">ARC-SYS:</span>{log}
                            </div>
                        ))}
                        {logs.length === 0 && <span className="text-gray-800 italic opacity-50">Waiting for neural link...</span>}
                    </div>
                </div>
            </div>

            {/* 2. Viewport / Canvas */}
            <div className="lg:col-span-2 min-h-[500px] bg-gray-900/30 border border-gray-800 rounded-3xl p-2 md:p-8 flex items-center justify-center backdrop-blur-sm relative overflow-hidden group animate-holographic animate-tribal-pulse">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 bg-grid-white"></div>

                {resultUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        {activeBox === 'video' || resultUrl.startsWith('data:video') ? (
                            <video
                                src={resultUrl}
                                controls
                                autoPlay
                                loop
                                className="max-w-full max-h-[600px] rounded-xl shadow-2xl shadow-cyan-900/20 border border-gray-800"
                            />
                        ) : (
                            <img
                                src={resultUrl}
                                alt="Generated"
                                className="max-w-full max-h-[600px] rounded-xl shadow-2xl shadow-cyan-900/20 border border-gray-800 group-hover:scale-[1.01] transition duration-700"
                            />
                        )}

                        {/* Overlay Actions */}
                        <div className="absolute bottom-6 flex space-x-3 opacity-0 group-hover:opacity-100 transition duration-300">
                            <button
                                onClick={handleDownload}
                                className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-full border border-gray-700 flex items-center text-sm backdrop-blur-md transition-all active:scale-95"
                            >
                                <Download className="w-4 h-4 mr-2" /> Save Asset
                            </button>
                            {activeBox === 'image' && (
                                <button
                                    onClick={() => { setActiveBox('upscale'); setPrompt(resultUrl); }}
                                    className="bg-purple-600/80 hover:bg-purple-600 text-white px-4 py-2 rounded-full border border-purple-500/50 flex items-center text-sm backdrop-blur-md"
                                >
                                    <Maximize className="w-4 h-4 mr-2" /> Upscale to 4K
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                            <Wand2 className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-500">Visual Cortex Standby</h3>
                        <p className="text-gray-600 mt-2 max-w-md mx-auto">
                            Ready to synthesize visual data. Select a mode and input parameters to begin generation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaStudio;
