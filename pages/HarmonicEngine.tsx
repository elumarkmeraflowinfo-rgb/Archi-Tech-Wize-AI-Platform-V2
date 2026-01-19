import React, { useState } from 'react';
import { aiService } from '../src/services/aiService';
import { Music, Play, Pause, Save, Share2, Volume2, Search, Loader2, ArrowLeft, Disc, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const HarmonicEngine = () => {
    const [prompt, setPrompt] = useState('');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev]);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setAudioUrl(null); // Clear previous
        setLogs([]);
        addLog("Syncing with Harmonic Wavefront...");
        addLog("Synthesizing neural frequency...");
        try {
            const res = await aiService.generateMusic(prompt);
            setAudioUrl(res);
            addLog("Signal captured and decoded.");
        } catch (error: any) {
            console.error(error);
            addLog(`ERR: ${error.message || "Waveform collapse"}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 bg-black text-white selection:bg-pink-500/30">
            <header className="mb-12 text-center relative max-w-6xl mx-auto">
                <Link to="/demos" className="absolute left-0 top-0 text-pink-500 hover:text-pink-400 flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> <span className="hidden md:inline">Back to Lab</span>
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-900/20 border border-pink-500/20 text-pink-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Disc size={12} className="animate-spin-slow" /> Waveform Generator Active
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-pink-500">
                    HARMONIC ENGINE
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg lowercase">
                    describe the frequency. manifest the melody. professional-grade neural audio synthesis.
                </p>
            </header>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Input Area */}
                    <div className="space-y-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl opacity-20 group-hover:opacity-40 transition duration-1000 blur-xl"></div>
                            <div className="relative bg-black/40 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Audio Prompt</label>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {[
                                        { l: 'Retro Synthwave', p: 'Cinematic 80s synthwave with heavy analog bass, neon atmosphere, 110bpm' },
                                        { l: 'Modern Afrobeat', p: 'Groovy Afrobeat rhythm with complex percussion, brass accents, and sunny energy' },
                                        { l: 'Lo-Fi Study', p: 'Chill lo-fi hip hop with crackling vinyl, soft piano, and dusty drums' },
                                        { l: 'Cyberpunk Industrial', p: 'Dark aggressive cyberpunk techno with glitchy textures and distorted kicks' },
                                        { l: 'Ethereal Ambient', p: 'Spacey ambient soundscape with long evolving pads and granular textures' }
                                    ].map(mood => (
                                        <button
                                            key={mood.l}
                                            onClick={() => setPrompt(mood.p)}
                                            className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-gray-800 text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-all active:scale-95"
                                        >
                                            {mood.l}
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. Cinematic synthwave with heavy bass and ethereal pads, 120bpm..."
                                    className="w-full bg-transparent border-none text-2xl font-light text-white focus:outline-none min-h-[150px] resize-none placeholder:text-gray-800"
                                />

                                <Button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="w-full mt-6 py-5 rounded-2xl bg-white text-black hover:bg-pink-500 hover:text-white transition-all duration-500 font-black text-xl"
                                >
                                    {isGenerating ? (
                                        <><Loader2 className="animate-spin mr-3" size={24} /> Synthesizing Waveform</>
                                    ) : (
                                        <><Wind className="mr-3" size={24} /> Manifest Sound</>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Visual Logs */}
                        <div className="bg-gray-900/20 border border-gray-800 rounded-3xl p-6 font-mono text-[10px] h-32 overflow-y-auto">
                            {logs.map((log, i) => (
                                <div key={i} className="mb-1 text-pink-500/60 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-pink-500 rounded-full"></span> {log}
                                </div>
                            ))}
                            {logs.length === 0 && <span className="text-gray-700 italic">Waiting for signal...</span>}
                        </div>
                    </div>

                    {/* Result Area */}
                    <div className="relative flex flex-col items-center justify-center min-h-[400px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent blur-3xl rounded-full animate-pulse"></div>

                        {audioUrl ? (
                            <div className="relative z-10 w-full animate-fade-in-up">
                                <div className="bg-white/5 border border-white/10 rounded-full p-8 backdrop-blur-3xl flex flex-col items-center">
                                    <div className="w-32 h-32 bg-pink-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.5)] mb-8 animate-pulse">
                                        <Music size={48} className="text-white" />
                                    </div>
                                    <audio src={audioUrl} controls className="w-full h-12 invert mb-6" />
                                    <div className="flex gap-4">
                                        <button
                                            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                                            aria-label="Save audio"
                                        >
                                            <Save size={20} className="text-white" />
                                        </button>
                                        <button
                                            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                                            aria-label="Share audio"
                                        >
                                            <Share2 size={20} className="text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center opacity-30 select-none">
                                <div className="w-40 h-40 border-2 border-dashed border-gray-800 rounded-full flex items-center justify-center mb-6">
                                    <Volume2 size={48} />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-widest text-gray-500">Frequency Empty</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HarmonicEngine;
