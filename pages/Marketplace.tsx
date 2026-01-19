import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot, Sparkles, Briefcase, Code, PenTool,
  Search, Filter, ShoppingBag, ArrowRight,
  CheckCircle, Zap, Cpu, Users, Layers, DollarSign, FileText
} from 'lucide-react';
import Button from '../components/Button';
import { aiService } from '../src/services/aiService';
import { Loader2 } from 'lucide-react';

// Types for the marketplace items
interface Agent {
  id: string;
  title: string;
  category: string;
  description: string;
  priceUsd: string;
  priceKsh: string;
  capabilities: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const Marketplace: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Agent Builder State
  const [builderPrompt, setBuilderPrompt] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [builtAgent, setBuiltAgent] = useState<any>(null);

  const handleBuildAgent = async () => {
    if (!builderPrompt.trim()) return;
    setIsBuilding(true);
    setBuiltAgent(null);
    try {
      const result = await aiService.buildAgent(builderPrompt);
      setBuiltAgent(result);
    } catch (error) {
      console.error(error);
      alert('Failed to build agent. Please try again.');
    } finally {
      setIsBuilding(false);
    }
  };

  const categories = ['All', 'Founders', 'Creators', 'Operations', 'Sales', 'Developers', 'Finance', 'HR'];

  const agents: Agent[] = [
    // Founders
    {
      id: 'f1', title: 'Pitch Deck Analyst', category: 'Founders',
      description: 'Upload your slides and get brutal, VC-level feedback on narrative, metrics, and design.',
      priceUsd: '$49', priceKsh: 'KSH 6,500', capabilities: ['PDF Analysis', 'SWOT Generation', 'Metric Validation'],
      icon: <Briefcase className="text-purple-500" />
    },
    {
      id: 'f2', title: 'Legal Eagle Lite', category: 'Founders',
      description: 'Review NDAs, contracts, and term sheets for red flags before you send them to a real lawyer.',
      priceUsd: '$79', priceKsh: 'KSH 10,300', capabilities: ['Contract Review', 'Clause Detection', 'Risk Assessment'],
      icon: <ShieldIcon className="text-purple-500" />
    },
    {
      id: 'f3', title: 'Co-Founder GPT', category: 'Founders',
      description: 'A strategic partner for brainstorming, pivoting, and mental model analysis.',
      priceUsd: '$29/mo', priceKsh: 'KSH 3,800/mo', capabilities: ['Strategy', 'Mental Models', 'Debate Partner'],
      icon: <Users className="text-purple-500" />, popular: true
    },

    // Creators
    {
      id: 'c1', title: 'Viral Hook Generator', category: 'Creators',
      description: 'Trained on top performing tweets and thumbnails. Generates 50 hooks in seconds.',
      priceUsd: '$19', priceKsh: 'KSH 2,500', capabilities: ['Copywriting', 'Trend Analysis', 'A/B Testing'],
      icon: <Zap className="text-amber-500" />, popular: true
    },
    {
      id: 'c2', title: 'YouTube Script Architect', category: 'Creators',
      description: 'Turns loose ideas into structured, retention-optimized video scripts.',
      priceUsd: '$39', priceKsh: 'KSH 5,000', capabilities: ['Storytelling', 'Pacing', 'Call-to-Actions'],
      icon: <VideoIcon className="text-amber-500" />
    },
    {
      id: 'c3', title: 'Sponsorship Negotiator', category: 'Creators',
      description: 'Drafts email responses to brands to maximize your deal value.',
      priceUsd: '$29', priceKsh: 'KSH 3,800', capabilities: ['Negotiation', 'Email Drafting', 'Rate Calculation'],
      icon: <Briefcase className="text-amber-500" />
    },

    // Operations
    {
      id: 'o1', title: 'Inbox Zero Hero', category: 'Operations',
      description: 'Connects to Gmail. Drafts replies, archives spam, and highlights urgent deals.',
      priceUsd: '$99', priceKsh: 'KSH 12,900', capabilities: ['Email API', 'Priority Sorting', 'Auto-Drafting'],
      icon: <MailIcon className="text-blue-500" />
    },
    {
      id: 'o2', title: 'Meeting Minutes Maestra', category: 'Operations',
      description: 'Transcribes audio and extracts action items, assigning them to team members in Notion.',
      priceUsd: '$59', priceKsh: 'KSH 7,700', capabilities: ['Transcription', 'Summarization', 'Task Assignment'],
      icon: <FileTextIcon className="text-blue-500" />
    },
    {
      id: 'o3', title: 'Invoice Chaser', category: 'Operations',
      description: 'Politely but firmly follows up on unpaid invoices via email and WhatsApp.',
      priceUsd: '$49', priceKsh: 'KSH 6,500', capabilities: ['Payment Tracking', 'Automated Follow-ups', 'CRM Sync'],
      icon: <DollarSignIcon className="text-blue-500" />, popular: true
    },

    // Sales
    {
      id: 's1', title: 'Cold Outreach Architect', category: 'Sales',
      description: 'Scrapes LinkedIn profiles and writes hyper-personalized icebreakers.',
      priceUsd: '$89', priceKsh: 'KSH 11,600', capabilities: ['LinkedIn Scraping', 'Personalization', 'Sequence Building'],
      icon: <TargetIcon className="text-green-500" />
    },
    {
      id: 's2', title: 'Objection Handler', category: 'Sales',
      description: 'Real-time battle cards for overcoming "It\'s too expensive" or "Not now".',
      priceUsd: '$39', priceKsh: 'KSH 5,000', capabilities: ['Sales Psychology', 'Scripting', 'Real-time Aid'],
      icon: <MessageSquareIcon className="text-green-500" />
    },

    // Developers
    {
      id: 'd1', title: 'Code Reviewer 9000', category: 'Developers',
      description: 'Spots security vulnerabilities and messy patterns before you merge.',
      priceUsd: '$59', priceKsh: 'KSH 7,700', capabilities: ['Security Audit', 'Refactoring', 'Documentation'],
      icon: <Code className="text-slate-500" />
    },
    {
      id: 'd2', title: 'Regex Wizard', category: 'Developers',
      description: 'Describe the pattern in English, get the perfect Regex string instantly.',
      priceUsd: '$9', priceKsh: 'KSH 1,200', capabilities: ['Pattern Matching', 'Testing', 'Explanation'],
      icon: <TerminalIcon className="text-slate-500" />
    },
    {
      id: 'd3', title: 'Documentation Bot', category: 'Developers',
      description: 'Reads your codebase and writes beautiful, formatted READMEs and wikis.',
      priceUsd: '$49', priceKsh: 'KSH 6,500', capabilities: ['Code Analysis', 'Technical Writing', 'Markdown'],
      icon: <BookIcon className="text-slate-500" />
    },

    // Finance (New)
    {
      id: 'fin1', title: 'Tax Compliance Bot', category: 'Finance',
      description: 'Scans expense receipts and categorizes them for KRA/IRS compliance. Alerts on missing VAT details.',
      priceUsd: '$69', priceKsh: 'KSH 9,000', capabilities: ['OCR', 'Tax Rules', 'Report Generation'],
      icon: <DollarSign className="text-emerald-600" />
    },
    {
      id: 'fin2', title: 'Crypto Portfolio Tracker', category: 'Finance',
      description: 'Connects to exchanges via API to track PnL, gas fees, and rebalancing opportunities.',
      priceUsd: '$39', priceKsh: 'KSH 5,000', capabilities: ['API Integration', 'Real-time Data', 'Alerts'],
      icon: <Zap className="text-emerald-600" />
    },

    // HR (New)
    {
      id: 'hr1', title: 'Recruitment Screener', category: 'HR',
      description: 'Parses 100s of CVs instantly. Ranks candidates based on job description matching.',
      priceUsd: '$89', priceKsh: 'KSH 11,500', capabilities: ['Resume Parsing', 'Keyword Matching', 'Bias Reduction'],
      icon: <Users className="text-pink-600" />
    },
    {
      id: 'hr2', title: 'Onboarding Buddy', category: 'HR',
      description: 'An AI chatbot that guides new hires through company policy, Slack setup, and tool access.',
      priceUsd: '$49', priceKsh: 'KSH 6,500', capabilities: ['Q&A', 'Process Automation', 'Checklists'],
      icon: <Bot className="text-pink-600" />
    }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesCategory = activeCategory === 'All' || agent.category === activeCategory;
    const matchesSearch = agent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuy = (agent: Agent) => {
    navigate('/checkout', {
      state: {
        item: {
          name: agent.title,
          price: agent.priceUsd,
          type: 'agent'
        }
      }
    });
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-32 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 shadow-sm mb-6 animate-fade-in-up">
          <Sparkles size={14} className="text-brand-accent animate-pulse" />
          <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">The Agent Economy is Here</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
          Hire Your Digital Workforce
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Browse 100+ ready-made AI agents, custom GPTs, and automation gems designed to scale your output without increasing headcount.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for 'Sales Bot', 'Legal Review', 'Content'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 shadow-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-lg transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
        </div>
      </section>

      {/* Educational Banner */}
      <section className="container mx-auto px-6 mb-20">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Bot className="text-brand-secondary" /> What is a Wize-Gem?
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                Think of a Wize-Gem as a specialized intern that never sleeps. It's a pre-prompted AI model equipped with specific knowledge files, brand voice guidelines, and tool capabilities. Unlike generic chat, these gems are engineered to perform <strong>one specific job perfectly</strong>.
              </p>
            </div>
            <div className="md:w-1/3 flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><CheckCircle size={18} className="text-green-400" /> <span>Pre-Trained Context</span></div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><CheckCircle size={18} className="text-green-400" /> <span>Custom Knowledge Base</span></div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><CheckCircle size={18} className="text-green-400" /> <span>Plug-and-Play</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === cat
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
              {agent.popular && (
                <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={10} /> Popular
                </div>
              )}

              <div className="mb-6 w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-100 transition-colors">
                {agent.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{agent.title}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-grow">{agent.description}</p>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((cap, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded border border-slate-100">
                      {cap}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-slate-900">{agent.priceUsd}</span>
                    <span className="text-xs font-semibold text-slate-500">{agent.priceKsh}</span>
                  </div>
                  <button
                    onClick={() => handleBuy(agent)}
                    className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-blue-700 transition-colors"
                  >
                    Get Access <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Simulation */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 mb-4 italic">Displaying {filteredAgents.length} of 100+ available models</p>
          <Button to="/contact" variant="outline" className="px-8">
            Request Full Catalog Access
          </Button>
        </div>
      </section>

      {/* Custom Build CTA - Interactiv AI Builder */}
      <section className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-10 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Build Your Own Agent</h2>
            <p className="text-xl text-blue-100 mb-10">
              Describe the perfect employee, and our Meta-Agent will architect the system prompt for you instantly.
            </p>

            {!builtAgent ? (
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <textarea
                  value={builderPrompt}
                  onChange={(e) => setBuilderPrompt(e.target.value)}
                  placeholder="e.g. I need a sales agent that speaks Spanish, identifies leads from real estate websites, and drafts friendly intro emails..."
                  className="w-full h-32 bg-white/90 text-slate-800 placeholder:text-slate-400 rounded-xl p-4 mb-4 outline-none focus:ring-4 focus:ring-white/30"
                />
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleBuildAgent}
                    disabled={isBuilding || !builderPrompt.trim()}
                    className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isBuilding ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                    {isBuilding ? 'Architecting...' : 'Design Agent'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white text-left text-slate-800 p-8 rounded-2xl shadow-2xl animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{typeof builtAgent.name === 'string' ? builtAgent.name : 'Custom Agent'}</h3>
                    <p className="text-slate-500">{typeof builtAgent.tagline === 'string' ? builtAgent.tagline : 'The Architected Solution'}</p>
                  </div>
                  <button onClick={() => setBuiltAgent(null)} className="text-sm text-blue-600 hover:underline">Start Over</button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-slate-600">{typeof builtAgent.systemPrompt === 'string' ? builtAgent.systemPrompt : JSON.stringify(builtAgent.systemPrompt, null, 2)}</pre>
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                  {Array.isArray(builtAgent.suggestedTools) && builtAgent.suggestedTools.map((tool: any, i: number) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {typeof tool === 'string' ? tool : JSON.stringify(tool)}
                    </span>
                  ))}
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setBuiltAgent(null)}>Discard</Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white border-none">
                    <CheckCircle size={18} className="mr-2" /> Deploy Agent
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Icons for the mock data
const ShieldIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const VideoIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>;
const MailIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
const FileTextIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>;
const DollarSignIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const TargetIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
const MessageSquareIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const TerminalIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></svg>;
const BookIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;

export default Marketplace;