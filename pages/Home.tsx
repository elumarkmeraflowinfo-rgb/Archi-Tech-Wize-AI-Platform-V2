import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { TerminalVisual, TechMarquee, TiltCard } from '../components/Visuals';
import { Layers, Zap, Globe, BookOpen, CheckCircle, ArrowRight, Bot, ChevronRight, MessageSquare, Award, Monitor, Code, Database, User, Quote, ThumbsUp, ThumbsDown, Shield, LogIn, ShoppingBag, PenTool, Layout, Megaphone, Send, Sparkles, Cpu, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAdmin } from '../context/AdminContext';
import AuthModal from '../components/AuthModal';
import OnboardingTutorial from '../components/OnboardingTutorial';
import ParticleBackground from '../components/ParticleBackground'; // [NEW] visual
import { useDocumentTitle } from '../hooks/useDocumentTitle'; // [NEW] SEO
import { RotateCcw } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  options?: { label: string; value: string; icon: React.ReactNode }[];
}

const Home: React.FC = () => {
  useDocumentTitle('ArchiTech-Wize AI | Building Intelligent Minds'); // Set title
  const { lowBandwidth } = useTheme();
  const { config, testimonials, addFeedback } = useAdmin();
  const navigate = useNavigate();

  // Dynamic BG State
  const heroRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);
  const bg3Ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Agent Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'bot',
      text: "Hello! I'm Wize-Agent, your architect for the digital age. What is your primary goal today?",
      options: [
        { label: "Learn AI Skills", value: "learning", icon: <BookOpen size={14} /> },
        { label: "Automate Business", value: "automation", icon: <Zap size={14} /> },
        { label: "Grow My Brand", value: "marketing", icon: <Megaphone size={14} /> },
        { label: "Hire AI Talent", value: "marketplace", icon: <ShoppingBag size={14} /> },
        { label: "Partner with Us", value: "partner", icon: <Globe size={14} /> }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Background Parallax Effect
  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (lowBandwidth || !heroRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    setMousePos({ x, y });
  };

  // Compliance: Set dynamic styles via Ref to bypass inline-style linting
  useEffect(() => {
    if (lowBandwidth) return;
    if (bg1Ref.current) bg1Ref.current.style.transform = `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`;
    if (bg2Ref.current) bg2Ref.current.style.transform = `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`;
    if (bg3Ref.current) bg3Ref.current.style.transform = `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px) rotate(${mousePos.x * 10}deg)`;
  }, [mousePos, lowBandwidth]);

  const handleAgentSelection = async (option: { label: string; value: string }) => {
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: option.label }]);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1000));

    let responseText = "";
    let nextPath = "";
    let intent = "";

    switch (option.value) {
      case 'learning':
        responseText = "Excellent choice. Sovereignty begins with knowledge. I'm redirecting you to our Academy curriculum.";
        nextPath = "/programs";
        intent = "enrollment";
        break;
      case 'automation':
        responseText = "Efficiency is the ultimate leverage. Let's explore our n8n and AI automation workflows.";
        nextPath = "/solutions";
        intent = "automation_consult";
        break;
      case 'marketing':
        responseText = "Visibility brings opportunity. Our studio creates high-conversion assets to amplify your voice.";
        nextPath = "/marketing";
        intent = "marketing_consult";
        break;
      case 'marketplace':
        responseText = "Scaling output requires a digital workforce. Opening the Agent Marketplace now.";
        nextPath = "/marketplace";
        break;
      case 'partner':
        responseText = "We value strong alliances. Let's build the infrastructure of the future together.";
        nextPath = "/partners";
        intent = "partnership";
        break;
      default:
        responseText = "I can help with that. Let me show you around.";
        nextPath = "/contact";
    }

    setIsTyping(false);
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: responseText }]);

    setTimeout(() => {
      navigate(nextPath, { state: { intent } });
    }, 2500);
  };

  return (
    <div className="w-full overflow-hidden">
      <OnboardingTutorial />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} triggerAction="access client resources" />

      {/* Hero Section */}
      <section
        id="hero-section"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-hidden"
      >
        <ParticleBackground />
        {!lowBandwidth && (
          <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden transition-transform duration-200 ease-out">
            <div
              ref={bg1Ref}
              className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"
            />
            <div
              ref={bg2Ref}
              className="absolute bottom-0 left-0 w-[900px] h-[900px] bg-brand-primary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
            />
            <div
              ref={bg3Ref}
              className="absolute top-10 right-[-100px] w-[600px] h-[600px] border border-dashed border-slate-200 rounded-full opacity-30"
            ></div>
          </div>
        )}

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-secondary/30 shadow-sm mb-6 animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                <span className="text-xs md:text-sm font-semibold text-slate-800 uppercase tracking-wider font-display">System-First • Not Tool-First</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Build Your Entire Digital Ecosystem. <span className="text-blue-600">Guided.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Stop stitching scattered tools. ArchiTech-Wize AI guides you step-by-step to build your website, branding, and automation in one unified system.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button to="/portal" icon>Start Building System</Button>
                <Button to="/how-it-works" variant="outline">How It Works</Button>
              </div>

              {config.pages.home.showStats && (
                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t border-slate-200/50 pt-8">
                  <div><div className="text-2xl font-bold font-display text-slate-900">10k+</div><div className="text-sm text-slate-500">Learners</div></div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div><div className="text-2xl font-bold font-display text-slate-900">500+</div><div className="text-sm text-slate-500">Automations</div></div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div><div className="text-2xl font-bold font-display text-slate-900">100%</div><div className="text-sm text-slate-500">Live Impact</div></div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2 relative">
              {!lowBandwidth && (
                <div className="absolute -top-10 -right-10 w-full h-full z-0 opacity-20 transform scale-90 translate-x-10">
                  <TerminalVisual className="w-full h-full" />
                </div>
              )}

              <div id="hero-agent-card" className={`relative z-10 bg-white rounded-3xl shadow-2xl shadow-brand-primary/10 border border-slate-100 w-full max-w-md mx-auto overflow-hidden transform transition-all duration-500 flex flex-col h-[500px] animate-holographic ${!lowBandwidth ? 'hover:-translate-y-1' : ''}`}>
                <div className="bg-slate-900 p-4 flex items-center justify-between shadow-md z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 relative">
                      <Bot size={20} className="text-brand-secondary" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900 animate-neon-flicker"></div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold font-display text-sm">Wize-Agent</h3>
                      <p className="text-slate-400 text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> <span className="animate-neon-flicker">Online</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setChatHistory([chatHistory[0]]); setIsTyping(false); }}
                    className="text-slate-400 hover:text-white transition-colors p-2"
                    aria-label="Reset chat history"
                    title="Reset chat history"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>

                <div className="flex-1 bg-slate-50 p-4 overflow-y-auto custom-scrollbar space-y-4">
                  {chatHistory.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                      {msg.role === 'bot' && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                          <Bot size={14} className="text-slate-600" />
                        </div>
                      )}
                      <div className="max-w-[80%] space-y-2">
                        <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                          ? 'bg-brand-primary text-white rounded-br-none'
                          : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                          }`}>
                          {msg.text}
                        </div>
                        {msg.options && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {msg.options.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleAgentSelection(opt)}
                                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-brand-primary hover:text-brand-primary hover:bg-sky-50 transition-all shadow-sm active:scale-95"
                              >
                                {opt.icon} {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start animate-fade-in-up">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                        <Bot size={14} className="text-slate-600" />
                      </div>
                      <div className="bg-white border border-slate-100 p-3.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-3 bg-white border-t border-slate-100">
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-100 rounded-xl h-10 px-3 flex items-center text-slate-400 text-xs">
                      Select an option above...
                    </div>
                    <button
                      disabled
                      className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-white cursor-not-allowed"
                      aria-label="Send message"
                      title="Send message"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {config.pages.home.showTechMarquee && <TechMarquee />}

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-4">
              <Layers size={12} /> Our Ecosystem
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900">One Platform. Infinite Possibilities.</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              Everything you need to learn, build, and scale in the AI age.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:border-brand-primary/30 transition-all duration-300 group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="w-14 h-14 bg-blue-100 text-brand-primary rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <BookOpen size={28} />
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">The Academy</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-grow">
                World-class AI & No-Code education. From foundational prompts to advanced LLM deployment.
              </p>
              <Button to="/programs" className="w-full justify-between group-hover:bg-brand-primary group-hover:text-white transition-colors">Start Learning <ArrowRight size={18} /></Button>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 hover:shadow-xl hover:shadow-slate-800/30 transition-all duration-300 group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="w-14 h-14 bg-slate-800 text-brand-secondary rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-3">Automation Agency</h3>
              <p className="text-slate-400 mb-8 leading-relaxed flex-grow">
                We build custom systems that run your business on autopilot. n8n workflows, CRM syncs, and more.
              </p>
              <Button to="/solutions" className="w-full justify-between bg-white text-slate-900 hover:bg-brand-secondary hover:text-white border-none">Book Consultation <ArrowRight size={18} /></Button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all duration-300 group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">Marketing Studio</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-grow">
                High-conversion websites, viral video production, and targeted ad campaigns for any industry.
              </p>
              <Button to="/marketing" className="w-full justify-between bg-white border-2 border-slate-100 text-slate-700 hover:bg-purple-600 hover:text-white hover:border-purple-600">Grow Your Brand <ArrowRight size={18} /></Button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:border-brand-secondary/30 transition-all duration-300 group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="w-14 h-14 bg-amber-100 text-brand-secondary rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">Agent Marketplace</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-grow">
                Hire pre-trained AI employees for sales, support, coding, and content creation. Plug and play.
              </p>
              <Button to="/marketplace" className="w-full justify-between bg-white border-2 border-slate-100 text-slate-700 hover:bg-brand-secondary hover:text-white hover:border-brand-secondary">Browse Talent <ArrowRight size={18} /></Button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:border-pink-200 transition-all duration-300 group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <PenTool size={28} />
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">Prompt Library</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-grow">
                Access master-level system prompts. Copy, paste, and unlock the full potential of your LLMs.
              </p>
              <Button to="/prompts" className="w-full justify-between bg-white border-2 border-slate-100 text-slate-700 hover:bg-pink-600 hover:text-white hover:border-pink-600">Get Prompts <ArrowRight size={18} /></Button>
            </div>

            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 border border-slate-300 hover:shadow-xl transition-all duration-300 group flex flex-col relative overflow-hidden">
              <div className="w-14 h-14 bg-white text-slate-700 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-sm">
                <Layout size={28} />
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">Client Portal</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-grow">
                Existing client? Log in to view your project status, invoices, and automated dashboards.
              </p>
              <button onClick={() => setShowAuthModal(true)} className="w-full flex items-center justify-between px-6 py-3 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all">
                Access Portal <LogIn size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
          <div><h2 className="text-3xl font-bold font-display text-slate-900 mb-2">Popular Pathways</h2><p className="text-slate-500">Most enrolled courses this month</p></div>
          <a href="#/programs" className="text-brand-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowRight size={16} /></a>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <TiltCard title="AI Generalist Track" subtitle="Core Foundation" image={config.pages.home.featureImages.pathway1} className="md:col-span-1 animate-holographic" />
            <TiltCard title="Automation & n8n" subtitle="Business Logic" image={config.pages.home.featureImages.pathway2} className="md:col-span-1 animate-holographic" />
            <TiltCard title="No-Code App Building" subtitle="Rapid Deploy" image={config.pages.home.featureImages.pathway3} className="md:col-span-1 animate-holographic" />
            <TiltCard title="Open Source Models" subtitle="Local AI" image={config.pages.home.featureImages.pathway4} className="md:col-span-1 animate-holographic" />
          </div>
        </div>
      </section>

      <section className="py-24 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-slate-900">Why ArchiTech-Wize AI?</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Built with purpose, engineered for impact.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Ethical First</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We prioritize responsible AI deployment, ensuring systems are safe, unbiased, and serve humanity first.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Built for Access</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Optimized for low-bandwidth. Our 'Lite Mode' ensures knowledge reaches every corner of the continent.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-4 group-hover:scale-110 transition-transform">
                <Cpu size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">African Innovation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Solutions tailored for local markets, solving real infrastructure challenges with cutting-edge tech.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Globe size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Global Standards</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                World-class curriculum and architecture preparing you for remote work with global tech giants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {config.pages.home.showTestimonials && testimonials.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-display text-slate-900">Community Voices</h2>
              <p className="text-slate-500 mt-4">Hear from the builders of tomorrow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map(t => (
                <div key={t.id} className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col h-full">
                  <Quote className="text-brand-primary mb-4 opacity-50" size={32} />
                  <p className="text-slate-600 mb-6 italic flex-grow">"{t.content}"</p>
                  <div className="mt-auto">
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}, {t.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 md:w-2/3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-xs font-bold text-brand-primary uppercase tracking-wider mb-4">
                <Users size={12} /> Client Portal
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Already Building?</h2>
              <p className="text-slate-300 text-lg max-w-xl">
                Access your Guided Business Builder dashboard to manage your sites, automations, and AI workforce.
              </p>
            </div>

            <div className="relative z-10 md:w-1/3 flex justify-center md:justify-end">
              <button
                id="client-login-btn"
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2"
              >
                <LogIn size={20} /> Access Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-sky-50 to-emerald-50 border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold font-display text-slate-900 mb-6">Ready to Build?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/programs" className="px-10 py-4 text-lg">Get Started Today</Button>
            <Button to="/contact" variant="outline" className="px-10 py-4 text-lg bg-white/50 border-slate-300 hover:bg-white">Contact Us</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;