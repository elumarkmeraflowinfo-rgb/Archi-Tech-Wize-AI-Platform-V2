import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, X, MessageSquare, Zap } from 'lucide-react';

const GlobalAssistant = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("Greetings, Architect. I am online.");
    const [isPulsing, setIsPulsing] = useState(false);
    const [diagnosticStatus, setDiagnosticStatus] = useState<string | null>(null);

    // Context-Aware Logic
    useEffect(() => {
        const path = location.pathname;
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 2000);

        if (path === '/voice-studio') {
            setMessage("I can help you capture a pristine voice fingerprint. Try a quiet room.");
        } else if (path === '/media-studio') {
            setMessage("The Visual Cortex is active. Try 'AnimateDiff' for rapid motion synthesis.");
        } else if (path === '/analysis-lab') {
            setMessage("Deep Reasoning enabled. I can deconstruct complex geopolitical topics here.");
        } else if (path === '/model-tuning') {
            setMessage("Synthetic Fine-Tuning allows me to adapt to your specific domain knowledge.");
        } else if (path === '/admin/sentinel') {
            setMessage("Admin privileges recognized. Displaying sovereign metrics.");
        } else {
            setMessage("I am ArchiTech-Wize. Ready to build your entire digital ecosystem?");
        }
    }, [location.pathname]);

    const handleDiagnostics = async () => {
        setDiagnosticStatus("running");
        setMessage("Running system diagnostics...");

        setTimeout(() => {
            const checks = [
                "Neural Engine ... ONLINE",
                "Visual Cortex ... ONLINE",
                "Memory Banks ... SYNCED",
                "Sovereignty Protocols ... ACTIVE"
            ];
            setMessage(checks.join('\n'));
            setDiagnosticStatus("complete");
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Bubble */}
            {isOpen && (
                <div className="mb-4 bg-gray-900/90 border border-cyan-500/30 p-4 rounded-2xl rounded-tr-none w-72 backdrop-blur-xl shadow-2xl animate-fade-in-up">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-cyan-400">ARCHITECH-WIZE // ASSISTANT</span>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="text-sm text-gray-200 leading-relaxed font-light whitespace-pre-line">
                        {message}
                    </div>
                    <div className="mt-3 flex space-x-2">
                        <button
                            onClick={handleDiagnostics}
                            disabled={diagnosticStatus === 'running'}
                            className="text-xs bg-cyan-900/50 hover:bg-cyan-900 text-cyan-300 px-2 py-1 rounded border border-cyan-800 transition flex items-center"
                        >
                            {diagnosticStatus === 'running' ? <Zap className="w-3 h-3 animate-spin mr-1" /> : <Zap className="w-3 h-3 mr-1" />}
                            {diagnosticStatus === 'running' ? 'Scanning...' : 'Run Diagnostics'}
                        </button>
                        <button
                            onClick={() => window.location.hash = '/portal'}
                            className="text-xs bg-blue-900/50 hover:bg-blue-900 text-blue-300 px-2 py-1 rounded border border-blue-800 transition flex items-center"
                        >
                            Build System
                        </button>
                        <button onClick={() => setIsOpen(false)} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-700 transition">
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Floating 'A' Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative group flex items-center justify-center w-14 h-14 rounded-full bg-black border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 ${isPulsing ? 'scale-110 ring-4 ring-cyan-500/20' : ''}`}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-40 transition"></div>
                {isOpen ? (
                    <MessageSquare className="w-6 h-6 text-cyan-400" />
                ) : (
                    <Bot className="w-7 h-7 text-white group-hover:text-cyan-400 transition" />
                )}

                {/* Notification Dot */}
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse"></span>
            </button>
        </div>
    );
};

export default GlobalAssistant;
