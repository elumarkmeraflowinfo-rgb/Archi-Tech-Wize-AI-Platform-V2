import React, { useState, useEffect, useRef } from 'react';
import {
    MessageSquare, Sparkles, Video, Image as ImageIcon, Mic,
    Send, Loader2, Play, Search, MapPin, Brain, Zap,
    Upload, FileAudio, FileVideo, Music, Pause, Activity, Lock, Settings, Bot, CheckCircle, Terminal
} from 'lucide-react';
import { aiService } from '../src/services/aiService';
import { useTheme } from '../context/ThemeContext';
import { useAdmin } from '../context/AdminContext';

// --- CONFIG & TYPES ---

type Mode = 'chat' | 'media' | 'analysis' | 'live' | 'music' | 'code' | 'tuning';
type ChatMode = 'standard' | 'fast' | 'thinking' | 'search' | 'maps';

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    chunks?: any[];
}

// --- HELPERS ---

// Base64 Helpers for Live API
function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Audio Decode Helper
async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

// File Reader
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// --- COMPONENT ---

const AIDemos: React.FC = () => {
    const { lowBandwidth } = useTheme();
    const { addFeedback } = useAdmin();
    const [activeTab, setActiveTab] = useState<Mode>('chat');
    // apiKey removed - using serverless gateway

    // Chat State
    const [chatMode, setChatMode] = useState<ChatMode>('standard');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    // Media State
    const [mediaType, setMediaType] = useState<'image-gen' | 'image-edit' | 'video-gen' | 'tts'>('image-gen');
    const [mediaPrompt, setMediaPrompt] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [mediaOptions, setMediaOptions] = useState({
        aspectRatio: '1:1',
        imageSize: '1K',
        voice: 'Puck'
    });
    const [videoStatus, setVideoStatus] = useState<string>("");

    // Analysis State
    const [analysisFile, setAnalysisFile] = useState<File | null>(null);
    const [analysisPreview, setAnalysisPreview] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string>("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Live State
    const [isConnected, setIsConnected] = useState(false);
    const [liveStatus, setLiveStatus] = useState("Disconnected");
    const [volumeLevel, setVolumeLevel] = useState(0); // For visualizer

    // Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const liveSessionRef = useRef<any>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafRef = useRef<number | null>(null);

    // --- CHAT LOGIC ---
    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsThinking(true);

        try {
            const text = await aiService.chat(userMsg);
            setMessages(prev => [...prev, { role: 'model', text }]);
        } catch (err: any) {
            setMessages(prev => [...prev, { role: 'model', text: `Error: ${err.message || 'Failed to connect to AI Gateway'}` }]);
        } finally {
            setIsThinking(false);
        }
    };

    // --- OVERLAY COMPONENT ---
    const ComingSoonOverlay = ({ title, featureId }: { title: string, featureId: string }) => {
        const [feedback, setFeedback] = useState('');
        const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!feedback.trim()) return;

            setStatus('sending');

            // Save to internal Admin Context
            addFeedback({
                helpful: true,
                intent: `Feature Request [${title}]: ${feedback}`
            });

            // Send Email Notification via Formspree
            try {
                await fetch("https://formspree.io/f/mnjaagaa", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({
                        subject: `Wize Agent Feedback: ${title}`,
                        message: feedback,
                        feature: title,
                        source: "AIDemos Coming Soon Overlay"
                    })
                });
            } catch (e) {
                console.warn("Email notification failed", e);
            }

            setStatus('success');
        };

        return (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 transition-all duration-500 rounded-3xl border border-slate-200">
                {/* Animated Icon Container */}
                <div className="bg-white p-6 rounded-full shadow-2xl mb-6 animate-bounce-slow border border-slate-100 relative group cursor-default">
                    <Lock size={48} className="text-slate-900 group-hover:opacity-20 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                        <Settings size={32} className="text-brand-primary animate-spin-slow" />
                    </div>
                    <div className="absolute -right-2 -bottom-2 bg-slate-900 text-white p-2.5 rounded-full border-4 border-white shadow-lg">
                        <Bot size={20} />
                    </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{title}</h2>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-8">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div> Under Construction
                </div>

                {/* Chat Interface Card */}
                <div className="bg-white p-1 rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden transform transition-all hover:scale-[1.02]">
                    {/* Chat Header */}
                    <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center shadow-md">
                            <Bot size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-900 leading-none">Wize Architect</p>
                            <p className="text-slate-500 text-[10px] flex items-center gap-1 mt-1 font-medium">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online • Designing Module
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-white">
                        {status === 'success' ? (
                            <div className="flex flex-col items-center py-6 animate-fade-in-up">
                                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                    <CheckCircle size={28} />
                                </div>
                                <p className="font-bold text-slate-900 text-lg">Input Received</p>
                                <p className="text-sm text-slate-500 mt-2 max-w-[240px] leading-relaxed">
                                    "I've added this to my architecture queue. Thank you for helping build the future."
                                </p>
                                <button onClick={() => { setFeedback(''); setStatus('idle'); }} className="mt-6 text-xs font-bold text-brand-primary hover:underline">
                                    Submit another idea
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Bot Message Bubble */}
                                <div className="flex gap-3">
                                    <div className="bg-slate-100 p-3.5 rounded-2xl rounded-tl-none text-xs text-slate-600 text-left leading-relaxed shadow-sm">
                                        I am currently building the logic for <strong>{title}</strong>. What specific capabilities would maximize your workflow here?
                                    </div>
                                </div>

                                {/* User Input */}
                                <form onSubmit={handleSubmit} className="relative">
                                    <input
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        disabled={status === 'sending'}
                                        placeholder="e.g. I need to export results to PDF..."
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3.5 text-sm outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all placeholder:text-slate-400 shadow-sm"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === 'sending' || !feedback.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-2 rounded-lg hover:bg-brand-primary disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-md active:scale-95"
                                        aria-label="Submit Feedback"
                                    >
                                        {status === 'sending' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // --- RENDER ---
    return (
        <div className="w-full bg-slate-50 min-h-screen pt-20 flex">
            {/* Sidebar Navigation */}
            <aside className="w-20 md:w-64 bg-slate-900 text-white fixed h-full z-10 flex flex-col pt-8">
                <div className="px-6 mb-8 hidden md:block">
                    <h1 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-brand-accent" /> AI Playground</h1>
                    <p className="text-xs text-slate-400 mt-1">Experimental Features</p>
                </div>
                <nav className="flex-1 space-y-2 px-2 md:px-4">
                    <SidebarButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare />} label="Chat & Grounding" />
                    <SidebarButton active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={<Video />} label="Media Studio" />
                    <SidebarButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} icon={<Brain />} label="Analysis Lab" />
                    <SidebarButton active={activeTab === 'live'} onClick={() => setActiveTab('live')} icon={<Mic />} label="Live Voice" />
                    <SidebarButton active={activeTab === 'music'} onClick={() => setActiveTab('music')} icon={<Music />} label="Harmonic Engine" />
                    <SidebarButton active={activeTab === 'code'} onClick={() => setActiveTab('code')} icon={<Activity />} label="Sovereign Coder" />
                    <SidebarButton active={activeTab === 'tuning'} onClick={() => setActiveTab('tuning')} icon={<Settings />} label="Model Tuning" />
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-20 md:ml-64 p-6 md:p-10 overflow-y-auto">
                <div className="max-w-5xl mx-auto">

                    {/* CHAT TAB - UNLOCKED */}
                    {activeTab === 'chat' && (
                        <div className="relative h-[80vh] flex flex-col">
                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                        <Bot size={48} className="mb-4 opacity-50" />
                                        <p>Start a conversation with the AI.</p>
                                    </div>
                                )}
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none'}`}>
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isThinking && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                            <Loader2 size={16} className="animate-spin text-brand-primary" />
                                            <span className="text-xs text-slate-500">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 bg-white border-t border-slate-200 rounded-b-3xl">
                                <div className="flex gap-2">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary/50"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={isThinking || !input.trim()}
                                        className="bg-slate-900 text-white p-3 rounded-xl hover:bg-brand-primary disabled:opacity-50 transition-colors"
                                        aria-label="Send message"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MEDIA TAB - UNLOCKED LINK */}
                    {activeTab === 'media' && (
                        <div className="relative min-h-[500px] flex flex-col items-center justify-center text-center">
                            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 max-w-2xl animate-holographic animate-tribal-pulse">
                                <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Video size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Media Studio is Online</h2>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    The Visual Cortex has been fully activated. Generate images, synthesized video, and upscale assets in the dedicated studio.
                                </p>
                                <a href="#/media-studio" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-brand-primary transition-all shadow-lg hover:shadow-xl">
                                    <Sparkles size={20} /> Enter Media Studio
                                </a>
                            </div>
                        </div>
                    )}

                    {/* ANALYSIS TAB - UNLOCKED LINK */}
                    {activeTab === 'analysis' && (
                        <div className="relative min-h-[500px] flex flex-col items-center justify-center text-center">
                            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 max-w-2xl animate-holographic animate-tribal-pulse">
                                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Brain size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Analysis Lab is Online</h2>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    Deep Reasoning protocols are active. Deconstruct complex topics and analyze structural logic in the dedicated lab.
                                </p>
                                <a href="#/analysis-lab" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg hover:shadow-xl">
                                    <Brain size={20} /> Enter Analysis Lab
                                </a>
                            </div>
                        </div>
                    )}

                    {/* LIVE TAB - UNLOCKED LINK */}
                    {activeTab === 'live' && (
                        <div className="relative min-h-[500px] flex flex-col items-center justify-center text-center">
                            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 max-w-2xl animate-holographic animate-tribal-pulse">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mic size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Voice Studio is Online</h2>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    The Auditory Engine is ready. Perform text-to-speech synthesis and voice replication in the dedicated studio.
                                </p>
                                <a href="#/voice-studio" className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all shadow-lg hover:shadow-xl">
                                    <Mic size={20} /> Enter Voice Studio
                                </a>
                            </div>
                        </div>
                    )}

                    {/* MUSIC TAB - UNLOCKED */}
                    {activeTab === 'music' && (
                        <div className="relative min-h-[500px] flex flex-col items-center justify-center text-center">
                            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 max-w-2xl animate-holographic animate-tribal-pulse">
                                <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Music size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Harmonic Engine Online</h2>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    Generate original compositions using Facebook's MusicGen. Describe the vibe, and the AI will compose it.
                                </p>
                                <a href="#/harmonic-engine" className="inline-flex items-center gap-2 px-8 py-4 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-500 transition-all shadow-lg hover:shadow-xl">
                                    <Music size={20} /> Enter Harmonic Engine
                                </a>
                            </div>
                        </div>
                    )}

                    {/* CODE TAB - UNLOCKED LINK */}
                    {activeTab === 'code' && (
                        <div className="relative min-h-[500px] flex flex-col items-center justify-center text-center">
                            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 max-w-2xl animate-holographic animate-tribal-pulse">
                                <div className="w-20 h-20 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Activity size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Sovereign Coder Online</h2>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    Powered by Qwen-2.5-Coder (32B). Use this terminal to generate full-stack components.
                                </p>
                                <a href="#/sovereign-coder" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
                                    <Terminal size={20} /> Open Terminal
                                </a>
                            </div>
                        </div>
                    )}

                    {/* TUNING TAB */}
                    {activeTab === 'tuning' && (
                        <div className="relative min-h-[500px] flex flex-col items-center justify-center text-center">
                            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 max-w-2xl">
                                <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Settings size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Neural Forge is Online</h2>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    System instruction tuning is available. Upload knowledge bases and refine the sovereign model in the dedicated forge.
                                </p>
                                <a href="#/model-tuning" className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all shadow-lg hover:shadow-xl">
                                    <Settings size={20} /> Enter Neural Forge
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const SidebarButton = ({ active, onClick, icon, label }: any) => (
    <button onClick={onClick} className={`w-full flex flex-col md:flex-row items-center md:gap-3 px-2 md:px-4 py-3 rounded-xl transition-all mb-1 ${active ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        <span className="text-xl md:text-lg">{icon}</span>
        <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">{label}</span>
    </button>
);

export default AIDemos;