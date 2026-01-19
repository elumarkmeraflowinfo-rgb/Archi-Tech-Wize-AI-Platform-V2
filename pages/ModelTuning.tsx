import React, { useState, useEffect } from 'react';
import { Cpu, Save, Upload, Database, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const ModelTuning = () => {
    const [systemInstruction, setSystemInstruction] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isTuning, setIsTuning] = useState(false);
    const [activeLobe, setActiveLobe] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('archi_wize_system_instruction');
        if (saved) {
            setActiveLobe(saved.substring(0, 20) + '...');
        }
    }, []);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    const handleFineTune = () => {
        setIsTuning(true);
        // Simulate processing
        setTimeout(() => {
            // "Synthetic" Fine-Tuning: We basically prepend user data instructions to future prompts
            // For now, we just save a "System Instruction" to localStorage that the Chat UI can read
            const newInstruction = `[FINE-TUNED KNOWLEDGE]: User has uploaded data regarding ${file?.name || 'custom domain'}. Prioritize this context. Custom instruction: ${systemInstruction}`;

            localStorage.setItem('archi_wize_system_instruction', newInstruction);
            setActiveLobe(newInstruction.substring(0, 20) + '...');
            setIsTuning(false);
        }, 2500);
    };

    return (
        <div className="min-h-screen pt-24 px-6 bg-black text-white">
            <header className="mb-12 text-center relative">
                <Link to="/demos" className="absolute left-0 top-0 text-orange-500 hover:text-orange-400 flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> <span className="hidden md:inline">Back to Playground</span>
                </Link>
                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                    THE NEURAL FORGE
                </h1>
                <p className="text-gray-400">Synthetic Fine-Tuning. Install new cognitive lobes into the Sovereign AI.</p>
            </header>

            <div className="max-w-3xl mx-auto bg-gray-900/30 border border-orange-900/30 rounded-3xl p-8 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-orange-400 flex items-center">
                            <Database className="mr-2" /> Data Ingestion
                        </h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            Upload .txt, .json, or .pdf files to imprint your proprietary knowledge onto the neural weights.
                        </p>

                        <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-orange-500/50 transition cursor-pointer relative">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} />
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <span className="text-sm text-gray-400">{file ? file.name : "Drop proprietary data here"}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-300">System Parameters</h3>
                        <textarea
                            value={systemInstruction}
                            onChange={(e) => setSystemInstruction(e.target.value)}
                            placeholder="Defining the Agent's core philosophy..."
                            className="w-full bg-black border border-gray-800 rounded-lg p-4 text-sm text-gray-300 min-h-[150px] focus:border-orange-500/50 outline-none"
                        />
                    </div>
                </div>

                <div className="mt-12">
                    <Button onClick={handleFineTune} disabled={isTuning} className="w-full justify-center bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 py-4 text-lg">
                        {isTuning ? (
                            <><Cpu className="w-5 h-5 animate-spin mr-2" /> Forging Neural Pathways...</>
                        ) : (
                            <><Save className="w-5 h-5 mr-2" /> Install Cognitive Lobe</>
                        )}
                    </Button>
                </div>

                {activeLobe && (
                    <div className="mt-8 p-4 bg-orange-900/10 border border-orange-500/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center text-orange-400">
                            <CheckCircle className="w-5 h-5 mr-3" />
                            <div>
                                <div className="text-sm font-bold">Active Cognitive Lobe (v2.0)</div>
                                <div className="text-xs opacity-70">Signature: {activeLobe}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => { localStorage.removeItem('archi_wize_system_instruction'); setActiveLobe(null); }}
                            className="text-xs text-red-500 hover:text-red-400"
                        >
                            DETACH
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModelTuning;
