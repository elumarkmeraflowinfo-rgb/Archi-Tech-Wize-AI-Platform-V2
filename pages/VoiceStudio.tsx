import React, { useState } from 'react';
import { aiService } from '../src/services/aiService';
import { Mic, Volume2, Radio, Activity, Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const VoiceStudio = () => {
    const [text, setText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [voiceId, setVoiceId] = useState<string | null>(null);

    const handleRecord = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            // Start recording simulation
            setTimeout(() => {
                setIsRecording(false);
                setVoiceId('user-voice-clone-001');
                alert("Voice Fingerprint Captured: 'user-voice-clone-001'");
            }, 3000);
        }
    };

    const handleSpeak = async () => {
        if (!text) return;
        setIsProcessing(true);
        try {
            // If voiceId exists, use it for cloning simulation
            const res = await aiService.generateSpeech(text, voiceId || undefined);
            setAudioUrl(res);
        } catch (error: any) {
            console.error(error);
            alert(`Speech generation failed: ${error.message || 'The neural link was severed. Please try another sample.'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 bg-black text-white">
            <header className="mb-12 text-center relative">
                <Link to="/demos" className="absolute left-0 top-0 text-emerald-500 hover:text-emerald-400 flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> <span className="hidden md:inline">Back to Playground</span>
                </Link>
                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    VOICE STUDIO
                </h1>
                <p className="text-gray-400">The Auditory Engine. Clone, Synthesize, and Broadcast.</p>
            </header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Cloning Station */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden animate-holographic">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Activity className="w-32 h-32 text-emerald-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center text-emerald-400">
                        <Mic className="mr-3" /> Neural Mimicry
                    </h2>

                    <div className="flex flex-col items-center justify-center py-12 space-y-6">
                        <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all animate-tribal-pulse ${isRecording ? 'border-red-500 animate-pulse bg-red-500/20' :
                            voiceId ? 'border-emerald-500 bg-emerald-500/20' : 'border-gray-700 bg-gray-800'
                            }`}>
                            <Mic className={`w-10 h-10 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
                        </div>

                        <Button onClick={handleRecord} className="bg-gray-800 hover:bg-gray-700 border-gray-700">
                            {isRecording ? 'Recording Sample...' : voiceId ? 'Voice Cloned ✅' : 'Record Voice Sample (3s)'}
                        </Button>

                        {voiceId && <div className="text-xs font-mono text-emerald-500">ID: {voiceId}</div>}
                    </div>
                </div>

                {/* 2. Synthesis Station */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl animate-holographic">
                    <h2 className="text-2xl font-bold mb-6 flex items-center text-cyan-400">
                        <Volume2 className="mr-3" /> Text-to-Speech
                    </h2>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text to synthesize..."
                        className="w-full bg-black border border-gray-800 rounded-xl p-4 text-gray-200 min-h-[120px] mb-6 focus:border-cyan-500/50 outline-none"
                    />

                    <Button onClick={handleSpeak} disabled={isProcessing} className="w-full bg-cyan-600 hover:bg-cyan-500">
                        {isProcessing ? 'Synthesizing...' : 'Generate Speech'}
                    </Button>

                    {audioUrl && (
                        <div className="mt-8 p-4 bg-black rounded-xl border border-gray-800">
                            <audio src={audioUrl} controls className="w-full" />
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 font-mono">
                                <span>WAV // 44.1kHz</span>
                                <span className="flex items-center text-emerald-500"><Radio className="w-3 h-3 mr-1" /> ACTIVE</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoiceStudio;
