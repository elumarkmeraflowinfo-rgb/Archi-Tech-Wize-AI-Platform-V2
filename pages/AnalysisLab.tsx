import React, { useState } from 'react';
import { aiService } from '../src/services/aiService';
import { Network, Brain, GitBranch, ArrowRight, Loader2, Users, AlertTriangle, CheckCircle, Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Gatekeeper from '../components/Gatekeeper';
import { useSubscription } from '../context/SubscriptionContext';
import lawsOfArchitect from '../src/config/laws-of-architect.json';

// Dynamic Node Visualization component
const NodeGraph = ({ data }: { data: any }) => {
    // Default visual if no structured data
    if (!data || !data.nodes) {
        return (
            <div className="relative w-full h-[400px] border border-gray-800 rounded-2xl bg-black overflow-hidden flex items-center justify-center">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20 bg-grid-cyan"></div>
                <div className="text-gray-600 italic">Waiting for structured analysis...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[400px] border border-gray-800 rounded-2xl bg-black overflow-hidden flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 bg-grid-cyan"></div>

            <div className="relative z-10 w-full h-full p-8 flex flex-wrap gap-8 items-center justify-center animate-fade-in-up">
                {data.nodes.map((node: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center">
                        <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center text-xs font-bold text-center p-2 shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all hover:scale-110 ${idx === 0 ? 'bg-cyan-900/50 border-cyan-500 text-cyan-300' : 'bg-purple-900/50 border-purple-500 text-purple-300'}`}>
                            {node.label || node.name || "Node"}
                        </div>
                        {node.description && (
                            <div className="mt-2 text-[10px] text-gray-400 max-w-[120px] text-center bg-black/50 p-1 rounded">
                                {node.description}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Simple label for prototype */}
            <div className="absolute bottom-4 right-4 text-xs text-cyan-500 font-mono">
                {data.edges?.length || 0} Synaptic Connections Detected
            </div>
        </div>
    );
};

interface DebateMessage {
    persona: 'visionary' | 'skeptic' | 'executor';
    message: string;
    timestamp: number;
}

const AnalysisLab = () => {
    const { tier, features } = useSubscription();
    const [prompt, setPrompt] = useState('');
    const [graphData, setGraphData] = useState<any>(null);
    const [textResult, setTextResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Multi-agent council state
    const [mode, setMode] = useState<'analysis' | 'council'>('analysis');
    const [debateMessages, setDebateMessages] = useState<DebateMessage[]>([]);
    const [isDebating, setIsDebating] = useState(false);
    const [roundCount, setRoundCount] = useState(0);
    const [validationScore, setValidationScore] = useState<number | null>(null);

    const handleAnalyze = async () => {
        if (!prompt) return;
        setIsAnalyzing(true);
        setGraphData(null);
        setTextResult('');

        try {
            const res = await aiService.analyzeData(prompt, tier);

            // Try parsing JSON
            try {
                // Remove code blocks if present
                const cleanJson = res.replace(/```json\n?|\n?```/g, '');
                const parsed = JSON.parse(cleanJson);
                setGraphData(parsed);
                setTextResult(JSON.stringify(parsed, null, 2));
            } catch (e) {
                // Fallback to text
                setTextResult(res);
            }
        } catch (error: any) {
            console.error(error);
            setTextResult(`Error: ${error.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const summonCouncil = async () => {
        if (!prompt) return;

        const maxRounds = 999; // Unrestricted: unlimited rounds for all users
        if (roundCount >= maxRounds) {
            return;
        }

        setIsDebating(true);
        setDebateMessages([]);
        setValidationScore(null);

        const personas = [
            {
                id: 'visionary' as const,
                name: 'The Visionary',
                systemPrompt: `You are The Visionary, an optimistic futurist who sees opportunities and potential. Your role in this council is to:
- Identify innovative aspects and growth potential
- Expand on possibilities and blue-sky thinking
- Connect the idea to larger trends and markets
- Be enthusiastic but substantive
Provide your perspective in 3-4 sentences. Focus on what could work and why it's exciting.`
            },
            {
                id: 'skeptic' as const,
                name: 'The Skeptic',
                systemPrompt: `You are The Skeptic, a critical analyst who identifies risks and flaws. Your role is to:
- Point out logical inconsistencies and gaps
- Identify potential failure points and risks
- Challenge assumptions with tough questions
- Be constructive but brutally honest
Provide your critique in 3-4 sentences. What are the biggest red flags?`
            },
            {
                id: 'executor' as const,
                name: 'The Executor',
                systemPrompt: `You are The Executor, a pragmatic implementer focused on execution. Your role is to:
- Assess feasibility and resource requirements
- Break down concrete steps needed
- Identify practical blockers and dependencies
- Focus on "how" not "why"
Provide your assessment in 3-4 sentences. What needs to happen to make this real?`
            }
        ];

        try {
            // Sequential debate - each persona responds with context
            let currentContext = `Business Plan/Idea for review: ${prompt}\n\n`;

            for (const persona of personas) {
                const response = await aiService.chat(
                    `${currentContext}\nProvide your unique perspective as ${persona.name}. Keep it concise and substantive.`,
                    persona.systemPrompt,
                    tier
                );

                const message: DebateMessage = {
                    persona: persona.id,
                    message: response,
                    timestamp: Date.now()
                };

                // Add this response to the context for the NEXT persona
                currentContext += `\n--- ${persona.name}'s Feedback ---\n${response}\n`;

                setDebateMessages(prev => [...prev, message]);
                await new Promise(resolve => setTimeout(resolve, 800)); // Dramatic pause
            }

            // Validate against Laws of the Architect
            const score = validateAgainstLaws(prompt);
            setValidationScore(score);
            setRoundCount(prev => prev + 1);
        } catch (error: any) {
            console.error(error);
            alert(`Council Error: ${error.message}`);
        } finally {
            setIsDebating(false);
        }
    };

    const validateAgainstLaws = (businessPlan: string): number => {
        // Simple keyword-based validation (in production, this would use AI)
        let score = 0;
        const plan = businessPlan.toLowerCase();

        lawsOfArchitect.principles.forEach((principle) => {
            let principleScore = 0;
            principle.criteria.forEach((criterion) => {
                // Check if keywords from criterion appear in plan
                const keywords = criterion.toLowerCase().split(' ').filter(w => w.length > 4);
                const matches = keywords.filter(kw => plan.includes(kw));
                if (matches.length > 0) principleScore++;
            });
            score += (principleScore / principle.criteria.length) * principle.weight;
        });

        return Math.round(score * 100); // 0-100
    };

    const personaConfig = {
        visionary: { name: 'The Visionary', icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
        skeptic: { name: 'The Skeptic', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20' },
        executor: { name: 'The Executor', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
    };

    return (
        <div className="min-h-screen pt-24 px-6 bg-black text-white">
            <header className="mb-12 text-center relative">
                <Link to="/demos" className="absolute left-0 top-0 text-blue-500 hover:text-blue-400 flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> <span className="hidden md:inline">Back to Playground</span>
                </Link>
                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    ANALYSIS LAB
                </h1>
                <p className="text-gray-400">The Logical Brain. Structural breakdown, deep reasoning, and causal linking.</p>

                {/* Mode Toggle */}
                <div className="mt-6 inline-flex bg-gray-900/50 border border-gray-800 rounded-xl p-1">
                    <button
                        onClick={() => setMode('analysis')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'analysis'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Brain className="inline mr-2" size={18} />
                        Deep Analysis
                    </button>
                    <button
                        onClick={() => setMode('council')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all relative ${mode === 'council'
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Users className="inline mr-2" size={18} />
                        Council Debate
                    </button>
                </div>
            </header>

            {mode === 'analysis' ? (
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Input Panel */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl h-fit">
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-blue-400">
                            <Brain className="mr-3" /> Topic Ingestion
                        </h2>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter a complex topic (e.g., 'The geopolitical impact of quantum computing')..."
                            className="w-full bg-black border border-gray-800 rounded-xl p-4 text-gray-200 min-h-[200px] mb-6 focus:border-blue-500/50 outline-none font-mono text-sm"
                        />

                        <div className="flex items-center justify-between mb-8 p-4 bg-black/50 rounded-lg border border-gray-800">
                            <div className="text-sm text-gray-400">Mode: <span className="text-purple-400 font-bold">Deep Reasoning (Gemini 2.0)</span></div>
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                        </div>

                        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-blue-600 hover:bg-blue-500 py-4">
                            {isAnalyzing ? (
                                <><Loader2 className="animate-spin mr-2" /> Deconstructing...</>
                            ) : (
                                <><Network className="mr-2" /> Start Structural Analysis</>
                            )}
                        </Button>
                    </div>

                    {/* Output Panel */}
                    <div className="space-y-6">
                        {/* Visualizer */}
                        <NodeGraph data={graphData} />

                        {/* Text Output */}
                        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 min-h-[300px] backdrop-blur-xl">
                            <h3 className="text-xl font-bold mb-4 text-gray-300 flex items-center">
                                <GitBranch className="mr-2" /> Causal Links
                            </h3>
                            {textResult ? (
                                <div className="prose prose-invert max-w-none text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">
                                    {textResult}
                                </div>
                            ) : (
                                <div className="text-gray-600 italic text-center mt-20">
                                    Waiting for data stream...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto">
                    {/* Council Input */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl mb-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-purple-400">
                            <Users className="mr-3" /> Business Plan Submission
                        </h2>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your business idea or plan in detail. The council will critique it from multiple perspectives..."
                            className="w-full bg-black border border-gray-800 rounded-xl p-4 text-gray-200 min-h-[150px] mb-6 focus:border-purple-500/50 outline-none"
                        />

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Rounds used: <span className="text-purple-400 font-bold">{roundCount}</span>
                            </div>
                            <Button
                                onClick={summonCouncil}
                                disabled={isDebating}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-3 px-6"
                            >
                                {isDebating ? (
                                    <><Loader2 className="animate-spin mr-2" /> Council Deliberating...</>
                                ) : (
                                    <><Users className="mr-2" /> Summon Council</>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Debate Messages */}
                    {debateMessages.length > 0 && (
                        <div className="space-y-6 mb-8">
                            {debateMessages.map((msg, idx) => {
                                const config = personaConfig[msg.persona];
                                const Icon = config.icon;
                                return (
                                    <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 backdrop-blur-xl animate-fade-in-up">
                                        <div className="flex items-center mb-4">
                                            <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center mr-4`}>
                                                <Icon className={`${config.color}`} size={24} />
                                            </div>
                                            <div>
                                                <div className={`font-bold ${config.color}`}>{config.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    Round {roundCount}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-gray-300 leading-relaxed pl-16">
                                            {msg.message}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Validation Score */}
                    {validationScore !== null && (
                        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8">
                            <h3 className="text-2xl font-bold mb-6 flex items-center">
                                <CheckCircle className="mr-3 text-emerald-400" /> Laws of the Architect Validation
                            </h3>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="text-center">
                                    <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                        {validationScore}%
                                    </div>
                                    <div className="text-gray-400 text-sm">Compliance Score</div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className={`text-lg font-semibold ${validationScore >= 70 ? 'text-emerald-400' :
                                        validationScore >= 50 ? 'text-yellow-400' :
                                            'text-red-400'
                                        }`}>
                                        {validationScore >= 70 ? '\u2713 Strong Foundation' :
                                            validationScore >= 50 ? '\u26a0\ufe0f Needs Refinement' :
                                                '\u2717 Critical Gaps'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {lawsOfArchitect.principles.map((principle, idx) => (
                                    <div key={idx} className="bg-black/50 border border-gray-800 rounded-lg p-3">
                                        <div className="text-sm font-semibold text-gray-300 mb-1">
                                            {principle.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {principle.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnalysisLab;
