import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Brain, Calendar as CalendarIcon, Plug, Briefcase,
    MessageSquare, User, Settings, Bell, Search, Plus,
    FileText, Database, Globe, Share2, Youtube, Bot, Zap,
    CheckCircle, Clock, MoreVertical, LogOut, Code, Send, Loader2, Sparkles, AlertCircle, Check,
    Terminal, Activity, Server, ExternalLink, BarChart3, X, ChevronRight, PlayCircle, PauseCircle, RefreshCw,
    PieChart, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight,
    Image as ImageIcon, Video, Mic, PenTool, BookOpen, GraduationCap, Users, Layers, Command, Laptop, Wrench,
    HelpCircle, Lightbulb, Power, ShoppingCart, Download, Lock, Rocket
} from 'lucide-react';

import BusinessBuilderWizard from '../components/BusinessBuilderWizard';

// Icon Helper
const PaletteIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>;

// --- TYPES ---

type ServiceMode = 'overview' | 'web' | 'creative' | 'automation' | 'agent' | 'student';

interface WorkspaceConfig {
    id: ServiceMode;
    label: string;
    icon: React.ReactNode;
    color: string;
}

// --- MOCK DATA ---
const MOCK_WEB_PROJECTS = [
    { id: 'p1', name: 'Real Estate Lander', url: 'estate.architech.app', status: 'Live', platform: 'React', thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=200', visitors: '1.2k' },
    { id: 'p2', name: 'Restaurant Menu', url: 'bistro.architech.app', status: 'In Review', platform: 'Next.js', thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200', visitors: '0' },
];

const MOCK_MEDIA = [
    { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200', name: 'Hero Banner V1' },
    { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200', name: 'Tech Background' },
    { id: 'm3', type: 'video', url: '', name: 'Promo Teaser.mp4' },
];

const MOCK_WORKFLOWS = [
    { id: 'w1', name: 'Lead Gen to CRM', trigger: 'Webhook', status: 'Active', runs: 1240, successRate: '99%' },
    { id: 'w2', name: 'Invoice Chaser', trigger: 'Schedule', status: 'Active', runs: 45, successRate: '95%' },
    { id: 'w3', name: 'Social Auto-Post', trigger: 'RSS', status: 'Paused', runs: 890, successRate: '100%' },
];

const MOCK_AGENTS = [
    { id: 'a1', name: 'Sales Closer Bot', role: 'Sales', status: 'active', conversations: 450, satisfaction: '4.8/5', model: 'Gemini 1.5 Pro' },
    { id: 'a2', name: 'Support Tier 1', role: 'Support', status: 'learning', conversations: 12, satisfaction: 'N/A', model: 'Gemini 1.5 Flash' },
];

const MOCK_COURSES = [
    { id: 'c1', title: 'AI Generalist Track', progress: 35, totalModules: 12, nextLesson: 'Prompt Engineering 101', cohort: 'Cohort 4' },
    { id: 'c2', title: 'n8n Masterclass', progress: 0, totalModules: 8, nextLesson: 'Welcome & Setup', cohort: 'Self-Paced' },
];

const MOCK_RESOURCES = [
    { id: 'r1', title: 'Master Prompt Cheatsheet.pdf', type: 'PDF', size: '2.4 MB' },
    { id: 'r2', title: 'Automation Blueprints.zip', type: 'ZIP', size: '15 MB' },
    { id: 'r3', title: 'Course Slides - Module 1', type: 'PPTX', size: '5 MB' },
];

const MOCK_COMMUNITY_TOPICS = [
    { id: 't1', title: 'How to fix n8n error 403?', author: 'Sarah J.', replies: 12, views: 340, time: '2h ago' },
    { id: 't2', title: 'Showcase: My first Agent!', author: 'David K.', replies: 8, views: 210, time: '5h ago' },
    { id: 't3', title: 'Cohort 4 Meetup link?', author: 'Admin', replies: 2, views: 50, time: '1d ago' },
];

const WORKSPACES: WorkspaceConfig[] = [
    { id: 'overview', label: 'Command Center', icon: <LayoutDashboard size={18} />, color: 'bg-slate-900' },
    { id: 'web', label: 'Web Builder', icon: <Laptop size={18} />, color: 'bg-blue-600' },
    { id: 'creative', label: 'Content Studio', icon: <PaletteIcon width={18} height={18} />, color: 'bg-pink-600' },
    { id: 'automation', label: 'Automation Hub', icon: <Zap size={18} />, color: 'bg-amber-600' },
    { id: 'agent', label: 'Agent Fleet', icon: <Bot size={18} />, color: 'bg-purple-600' },
    { id: 'student', label: 'Student Campus', icon: <GraduationCap size={18} />, color: 'bg-green-600' },
];

// --- COMPONENTS ---

const ServiceSwitcher: React.FC<{
    current: ServiceMode,
    onChange: (m: ServiceMode) => void
}> = ({ current, onChange }) => {
    const active = WORKSPACES.find(w => w.id === current) || WORKSPACES[0];
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative mb-6 px-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Current Workspace</label>
            <button
                id="workspace-switcher"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-white shadow-lg transition-all ${active.color}`}
            >
                <div className="flex items-center gap-3">
                    <div className="p-1 bg-white/20 rounded-lg">{active.icon}</div>
                    <span className="font-bold text-sm">{active.label}</span>
                </div>
                <ChevronRight className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} size={16} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-fade-in-down">
                    {WORKSPACES.map(w => (
                        <button
                            key={w.id}
                            onClick={() => { onChange(w.id); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                        >
                            <div className={`p-2 rounded-lg ${current === w.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {w.icon}
                            </div>
                            <span className={`text-sm font-medium ${current === w.id ? 'text-slate-900' : 'text-slate-600'}`}>{w.label}</span>
                            {current === w.id && <Check size={14} className="ml-auto text-brand-primary" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const ChatMessage: React.FC<{ role: 'user' | 'model', text: string }> = ({ role, text }) => (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] p-4 rounded-2xl ${role === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
    </div>
);

// Expanded Global Planner
const Planner = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const currentDay = today.getDate();
    const events = [
        { day: currentDay, title: 'Cohort Meetup', time: '10:00 AM', type: 'student' },
        { day: currentDay + 2, title: 'Project Review', time: '2:00 PM', type: 'web' },
        { day: currentDay + 5, title: 'Automation Audit', time: '11:00 AM', type: 'automation' }
    ];

    return (
        <div className="bg-white rounded-3xl border border-slate-200 h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <CalendarIcon size={20} className="text-brand-primary" /> {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><ChevronRight className="rotate-180" size={16} /></button>
                    <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><ChevronRight size={16} /></button>
                </div>
            </div>
            <div className="flex-1 p-6">
                <div className="grid grid-cols-7 mb-4 text-center text-xs font-bold text-slate-400 uppercase">
                    {days.map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {[...Array(35)].map((_, i) => {
                        const dayNum = i - 2; // Offset for mock starting day
                        const isValid = dayNum > 0 && dayNum <= 31;
                        const dayEvents = isValid ? events.filter(e => e.day === dayNum) : [];

                        return (
                            <div key={i} className={`min-h-[80px] border border-slate-100 rounded-xl p-2 flex flex-col gap-1 transition-colors ${isValid ? 'bg-white hover:border-brand-primary/30' : 'bg-slate-50/50'}`}>
                                {isValid && (
                                    <>
                                        <span className={`text-xs font-bold mb-1 ${dayNum === currentDay ? 'bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-500'}`}>{dayNum}</span>
                                        {dayEvents.map((ev, idx) => (
                                            <div key={idx} className={`text-[10px] p-1 rounded font-medium truncate ${ev.type === 'student' ? 'bg-green-100 text-green-700' :
                                                ev.type === 'web' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {ev.time} {ev.title}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const DashboardOnboarding: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm pointer-events-auto" onClick={onDismiss}></div>
            <div className="pointer-events-auto bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-fade-in-up mx-4">
                <button onClick={onDismiss} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-secondary border border-brand-secondary/20">
                        <Lightbulb size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Welcome to Your Workspace</h3>
                    <p className="text-slate-500 mt-2">Here is a quick tour of your new command center.</p>
                </div>

                <div className="space-y-4 text-left">
                    <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="bg-slate-900 text-white p-2 rounded-lg h-fit"><Layers size={20} /></div>
                        <div>
                            <h4 className="font-bold text-slate-900">Workspace Switcher</h4>
                            <p className="text-sm text-slate-600">Use the dropdown in the sidebar to switch between Web Builder, Creative Studio, Automation Hub, and more.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="bg-brand-primary text-white p-2 rounded-lg h-fit"><Plus size={20} /></div>
                        <div>
                            <h4 className="font-bold text-slate-900">Add & Create</h4>
                            <p className="text-sm text-slate-600">Look for the "Create New" or "Add" buttons in each hub to launch new projects, deploy agents, or enroll in courses.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="bg-brand-secondary text-white p-2 rounded-lg h-fit"><Bot size={20} /></div>
                        <div>
                            <h4 className="font-bold text-slate-900">AI Assistance</h4>
                            <p className="text-sm text-slate-600">Use "Master Brain" for strategic advice or "Support Chat" to talk to our team instantly.</p>
                        </div>
                    </div>
                </div>

                <button onClick={onDismiss} className="w-full mt-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                    Got it, Let's Build!
                </button>
            </div>
        </div>
    );
};

// --- BUILDER LAUNCHER CARD ---
const BuilderLauncher = ({ onLaunch }: { onLaunch: () => void }) => (
    <div onClick={onLaunch} className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all relative overflow-hidden group">
        <div className="relative z-10 flex justify-between items-center">
            <div>
                <h3 className="text-2xl font-bold mb-2">Guided Business Builder</h3>
                <p className="text-blue-100 max-w-sm">Launch your professional digital ecosystem in 5 guided steps. AI-powered.</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <Rocket size={32} className="animate-pulse" />
            </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all"></div>
    </div>
);

// --- MAIN PORTAL COMPONENT ---

const ClientPortal: React.FC = () => {
    const { user, isAuthenticated, logout } = useUser();
    const { lowBandwidth } = useTheme();
    const { supportChats, sendSupportMessage, initiateSupportChat, markChatRead } = useAdmin();
    const navigate = useNavigate();

    // State
    const [currentMode, setCurrentMode] = useState<ServiceMode>('overview');
    const [activeTab, setActiveTab] = useState('dashboard'); // Sub-tabs within modes
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [apiKey, setApiKey] = useState('');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showBuilder, setShowBuilder] = useState(false);

    // Chat States
    const [brainMessages, setBrainMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [brainInput, setBrainInput] = useState('');
    const [mentorInput, setMentorInput] = useState('');
    const mentorEndRef = useRef<HTMLDivElement>(null);

    // Derived state from User Profile (or mock if empty for demo population)
    const hasPurchases = user && user.purchases && user.purchases.length > 0;

    const myCourses = user?.purchases.filter(p => p.type === 'course').map(p => ({
        id: p.id, title: p.name, progress: 0, totalModules: 10, nextLesson: 'Start Here', cohort: 'Self-Paced'
    })).length > 0 ? user?.purchases.filter(p => p.type === 'course').map(p => ({
        id: p.id, title: p.name, progress: 0, totalModules: 10, nextLesson: 'Start Here', cohort: 'Self-Paced'
    })) : MOCK_COURSES; // Use mock if user has no courses for display purposes

    useEffect(() => {
        if (!isAuthenticated) {
            const timer = setTimeout(() => { if (!isAuthenticated) navigate('/'); }, 500);
            return () => clearTimeout(timer);
        }
        if (user && user.email) initiateSupportChat({ email: user.email, name: user.name });

        // Check if onboarding seen
        const seen = localStorage.getItem('aw-dashboard-onboarding');
        if (!seen) {
            setTimeout(() => setShowOnboarding(true), 1000);
        }
    }, [isAuthenticated, navigate, user]);

    // Scroll to chat bottom
    const currentChat = user ? supportChats.find(c => c.id === user.email) : null;
    useEffect(() => {
        if (activeTab === 'mentor' && currentChat) {
            mentorEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            if (currentChat.unreadUser > 0) markChatRead(user!.email, 'user');
        }
    }, [supportChats, activeTab]);

    // Handlers
    const handleMentorSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mentorInput.trim() || !user) return;
        sendSupportMessage(user.email, { sender: 'user', text: mentorInput });
        setMentorInput('');
    };

    const handleBrainSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brainInput.trim()) return;
        setBrainMessages(prev => [...prev, { role: 'user', text: brainInput }]);
        setBrainInput('');
        setTimeout(() => setBrainMessages(prev => [...prev, { role: 'model', text: "I am a simulated strategic advisor. In a live environment, I would connect to the Gemini API to analyze your project data." }]), 1000);
    };

    const closeOnboarding = () => {
        setShowOnboarding(false);
        localStorage.setItem('aw-dashboard-onboarding', 'true');
    };

    if (!isAuthenticated) return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-brand-primary" size={32} /></div>;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">

            {/* Onboarding Assistant */}
            {showOnboarding && <DashboardOnboarding onDismiss={closeOnboarding} />}

            {/* Business Builder Wizard */}
            {showBuilder && (
                <BusinessBuilderWizard
                    onComplete={(config) => {
                        console.log("Business Config:", config);
                        setShowBuilder(false);
                        alert("System Generated! (Simulation): Branding applied, Pages created.");
                    }}
                    onCancel={() => setShowBuilder(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-all z-20 ${isSidebarOpen ? '' : 'hidden md:flex'}`}>
                <div>
                    <div className="h-20 flex items-center px-6 border-b border-slate-100">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white mr-3">
                            <Brain size={18} className="text-brand-secondary" />
                        </div>
                        <span className="font-bold font-display text-slate-900">ArchiTech Portal</span>
                    </div>

                    <div className="p-4">
                        <ServiceSwitcher current={currentMode} onChange={setCurrentMode} />

                        <nav className="space-y-1">
                            <SidebarLink id="dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />

                            {/* DYNAMIC SIDEBAR LINKS BASED ON MODE */}
                            {currentMode === 'web' && (
                                <>
                                    <SidebarLink id="sites" icon={<Globe size={18} />} label="My Sites" active={activeTab === 'sites'} onClick={() => setActiveTab('sites')} />
                                    <SidebarLink id="media" icon={<ImageIcon size={18} />} label="Media Gallery" active={activeTab === 'media'} onClick={() => setActiveTab('media')} />
                                    <SidebarLink id="analytics" icon={<BarChart3 size={18} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                                </>
                            )}

                            {currentMode === 'creative' && (
                                <>
                                    <SidebarLink id="studio" icon={<PenTool size={18} />} label="Creation Studio" active={activeTab === 'studio'} onClick={() => setActiveTab('studio')} />
                                    <SidebarLink id="gallery" icon={<ImageIcon size={18} />} label="Asset Library" active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
                                    <SidebarLink id="models" icon={<Brain size={18} />} label="My Models" active={activeTab === 'models'} onClick={() => setActiveTab('models')} />
                                </>
                            )}

                            {currentMode === 'automation' && (
                                <>
                                    <SidebarLink id="workflows" icon={<Zap size={18} />} label="Active Workflows" active={activeTab === 'workflows'} onClick={() => setActiveTab('workflows')} />
                                    <SidebarLink id="library" icon={<Database size={18} />} label="Template Library" active={activeTab === 'library'} onClick={() => setActiveTab('library')} />
                                    <SidebarLink id="logs" icon={<Terminal size={18} />} label="Execution Logs" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
                                </>
                            )}

                            {currentMode === 'agent' && (
                                <>
                                    <SidebarLink id="fleet" icon={<Bot size={18} />} label="Deployed Agents" active={activeTab === 'fleet'} onClick={() => setActiveTab('fleet')} />
                                    <SidebarLink id="configure" icon={<Settings size={18} />} label="Configuration" active={activeTab === 'configure'} onClick={() => setActiveTab('configure')} />
                                    <SidebarLink id="metrics" icon={<Activity size={18} />} label="Performance" active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')} />
                                </>
                            )}

                            {currentMode === 'student' && (
                                <>
                                    <SidebarLink id="classroom" icon={<BookOpen size={18} />} label="My Classroom" active={activeTab === 'classroom'} onClick={() => setActiveTab('classroom')} />
                                    <SidebarLink id="community" icon={<Users size={18} />} label="Cohort Community" active={activeTab === 'community'} onClick={() => setActiveTab('community')} />
                                    <SidebarLink id="resources" icon={<Database size={18} />} label="Library & Refs" active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} />
                                </>
                            )}

                            {/* Global Links */}
                            <div className="pt-4 mt-4 border-t border-slate-100">
                                <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Global Tools</p>
                                <SidebarLink id="masterbrain" icon={<Sparkles size={18} />} label="Master Brain AI" active={activeTab === 'masterbrain'} onClick={() => setActiveTab('masterbrain')} />
                                <SidebarLink id="mentor" icon={<MessageSquare size={18} />} label="Support Chat" active={activeTab === 'mentor'} onClick={() => setActiveTab('mentor')} notification={currentChat?.unreadUser} />
                                <SidebarLink id="calendar" icon={<CalendarIcon size={18} />} label="Planner" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                            </div>
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
                    <button onClick={() => setShowOnboarding(true)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-brand-primary hover:bg-slate-50 transition-colors text-sm font-medium">
                        <HelpCircle size={18} /> Help & Tour
                    </button>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors text-sm font-medium">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-slate-50/50">
                {/* Background Patterns */}
                {!lowBandwidth && (
                    <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-3xl"></div>
                    </div>
                )}

                {/* Header */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 capitalize flex items-center gap-2">
                        {currentMode !== 'overview' && <span className="text-slate-400 font-normal">{WORKSPACES.find(w => w.id === currentMode)?.label} /</span>}
                        {activeTab.replace('-', ' ')}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md text-xs">
                            {user?.name?.charAt(0) || 'C'}
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 relative z-10 max-w-7xl mx-auto">

                    {/* === MODE: WEB BUILDER === */}
                    {currentMode === 'web' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {activeTab === 'dashboard' && <DashboardHeader title="Web Architect Dashboard" subtitle="Manage your digital real estate." icon={<Laptop />} color="bg-blue-600" />}

                            {activeTab === 'dashboard' || activeTab === 'sites' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-bold text-slate-900">Active Projects</h3>
                                            <button onClick={() => navigate('/marketing', { state: { intent: 'web-dev' } })} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"><Plus size={16} /> Create New Site</button>
                                        </div>
                                        <div className="space-y-4">
                                            {MOCK_WEB_PROJECTS.map(site => (
                                                <div key={site.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:shadow-md transition-all bg-slate-50">
                                                    <img src={site.thumbnail} alt={site.name} className="w-16 h-16 rounded-xl object-cover" />
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-slate-900">{site.name}</h4>
                                                        <div className="text-xs text-blue-500 hover:underline flex items-center gap-1">{site.url} <ExternalLink size={10} /></div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${site.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{site.status}</span>
                                                        <p className="text-xs text-slate-400 mt-1">{site.platform}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {activeTab === 'dashboard' && (
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4"><BarChart3 size={32} /></div>
                                            <h3 className="font-bold text-xl text-slate-900">Total Traffic</h3>
                                            <p className="text-4xl font-display font-bold text-slate-900 my-2">1.2k</p>
                                            <span className="text-slate-500 text-sm font-bold flex items-center gap-1">Visits this month</span>
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            {activeTab === 'media' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold">Media Gallery</h2>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Upload Media</button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {MOCK_MEDIA.map(m => (
                                            <div key={m.id} className="group relative rounded-xl overflow-hidden aspect-square border border-slate-200 bg-white">
                                                {m.type === 'image' ? (
                                                    <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white"><Video size={32} /></div>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                    <p className="text-white text-xs truncate">{m.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer">
                                            <Plus size={32} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'analytics' && (
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                                    <h3 className="text-xl font-bold mb-4">Site Performance</h3>
                                    <div className="h-64 bg-slate-50 rounded-2xl flex items-end justify-between p-4 px-12 gap-4">
                                        {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                                            <div key={i} className="w-full bg-blue-500 rounded-t-xl transition-all hover:bg-blue-600 relative group" style={{ height: `${h}%` }}>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">{h * 10}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-4 text-slate-500 text-xs uppercase font-bold">
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* === MODE: CREATIVE STUDIO === */}
                    {currentMode === 'creative' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {activeTab === 'dashboard' && <DashboardHeader title="Creator Studio" subtitle="Generate, Edit, Publish." icon={<PaletteIcon />} color="bg-pink-600" />}

                            {activeTab === 'dashboard' || activeTab === 'studio' ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <QuickActionCard title="Generate Image" icon={<ImageIcon size={24} />} color="bg-purple-500" onClick={() => navigate('/demos')} />
                                        <QuickActionCard title="Create Video" icon={<Video size={24} />} color="bg-pink-500" onClick={() => navigate('/marketing')} />
                                        <QuickActionCard title="Train Model" icon={<Brain size={24} />} color="bg-orange-500" onClick={() => navigate('/demos')} />
                                    </div>
                                    {activeTab === 'studio' && (
                                        <div className="bg-white p-8 rounded-3xl border border-slate-200 mt-8">
                                            <h3 className="font-bold text-lg mb-4">Quick Generate</h3>
                                            <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4" rows={3} placeholder="Describe the image you want to create..."></textarea>
                                            <button className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Sparkles size={18} /> Generate Preview</button>
                                        </div>
                                    )}
                                </>
                            ) : null}

                            {(activeTab === 'gallery' || activeTab === 'dashboard') && (
                                <div className="mt-8">
                                    <h3 className="font-bold text-slate-900 text-xl mb-4">Asset Library</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {MOCK_MEDIA.map(m => (
                                            <div key={m.id} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer">
                                                <img src={m.url || 'https://via.placeholder.com/300'} className="w-full h-40 object-cover" alt={m.name} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'models' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-3xl border border-slate-200">
                                        <div className="flex justify-between mb-4">
                                            <h3 className="font-bold text-slate-900">Custom Avatar Model</h3>
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Ready</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-4">Trained on 20 photos of the CEO.</p>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-green-500 w-full h-full"></div></div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl border border-slate-200">
                                        <div className="flex justify-between mb-4">
                                            <h3 className="font-bold text-slate-900">Product Style V2</h3>
                                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">Training 45%</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-4">Fine-tuning on product catalog.</p>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-amber-500 w-[45%] h-full animate-pulse"></div></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* === MODE: AUTOMATION HUB === */}
                    {currentMode === 'automation' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {activeTab === 'dashboard' && <DashboardHeader title="Automation Hub" subtitle="Orchestrate your business logic." icon={<Zap />} color="bg-amber-600" />}

                            {activeTab === 'dashboard' || activeTab === 'workflows' ? (
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-900">Active Workflows</h3>
                                        <button onClick={() => navigate('/marketplace', { state: { category: 'Operations' } })} className="text-white bg-amber-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-amber-700 transition-colors"><Plus size={16} /> Create New</button>
                                    </div>
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                            <tr><th className="p-4">Name</th><th className="p-4">Trigger</th><th className="p-4">Status</th><th className="p-4">Runs</th></tr>
                                        </thead>
                                        <tbody>
                                            {MOCK_WORKFLOWS.map(w => (
                                                <tr key={w.id} className="border-b last:border-0 border-slate-50 hover:bg-slate-50">
                                                    <td className="p-4 font-bold text-slate-900">{w.name}</td>
                                                    <td className="p-4 text-sm text-slate-500">{w.trigger}</td>
                                                    <td className="p-4"><span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${w.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{w.status}</span></td>
                                                    <td className="p-4 font-mono text-sm">{w.runs}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : null}

                            {activeTab === 'library' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {['Lead Qualification', 'Social Scheduler', 'Invoice Generator', 'Support Ticket Router'].map((t, i) => (
                                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-400 transition-all cursor-pointer">
                                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4"><Database size={20} /></div>
                                            <h4 className="font-bold text-slate-900">{t}</h4>
                                            <p className="text-sm text-slate-500 mt-2">Pre-built n8n workflow.</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'logs' && (
                                <div className="bg-slate-900 text-green-400 font-mono p-6 rounded-3xl h-96 overflow-y-auto text-sm">
                                    <div className="mb-2 opacity-50">System initialized...</div>
                                    <div className="mb-2">[10:00:01] Workflow 'Lead Gen' started. Trigger: Webhook</div>
                                    <div className="mb-2">[10:00:02] Processing JSON payload... OK</div>
                                    <div className="mb-2">[10:00:03] AI Analysis (Gemini 1.5)... Score: 85/100</div>
                                    <div className="mb-2">[10:00:04] CRM Updated. </div>
                                    <div className="mb-2">[10:00:05] Slack Notification sent.</div>
                                    <div className="mb-2 text-white bg-green-900/50 inline-block px-2 rounded">[Success] Execution finished in 4.2s</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* === MODE: AGENT FLEET === */}
                    {currentMode === 'agent' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {activeTab === 'dashboard' && <DashboardHeader title="Agent Command Center" subtitle="Monitor and optimize your AI workforce." icon={<Bot />} color="bg-purple-600" />}

                            {activeTab === 'dashboard' || activeTab === 'fleet' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {MOCK_AGENTS.map(agent => (
                                        <div key={agent.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600"><Bot size={24} /></div>
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{agent.status}</span>
                                                </div>
                                                <h3 className="font-bold text-lg text-slate-900">{agent.name}</h3>
                                                <p className="text-sm text-slate-500 mb-6">{agent.role} • {agent.model}</p>
                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="bg-slate-50 p-3 rounded-xl"><p className="text-[10px] text-slate-400 uppercase font-bold">Volume</p><p className="font-mono font-bold text-slate-700">{agent.conversations}</p></div>
                                                    <div className="bg-slate-50 p-3 rounded-xl"><p className="text-[10px] text-slate-400 uppercase font-bold">CSAT</p><p className="font-mono font-bold text-green-600">{agent.satisfaction}</p></div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800">Logs</button>
                                                    <button onClick={() => setActiveTab('configure')} className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50">Config</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div onClick={() => navigate('/marketplace', { state: { category: 'All' } })} className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-slate-400 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 transition-all cursor-pointer">
                                        <Plus size={48} className="mb-2 opacity-50" /><span className="font-bold text-sm">Deploy New Agent</span>
                                    </div>
                                </div>
                            ) : null}

                            {activeTab === 'configure' && (
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-3xl mx-auto">
                                    <h3 className="font-bold text-xl mb-6">Agent Configuration: Sales Closer Bot</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">System Instruction</label>
                                            <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono" rows={6} defaultValue="You are a senior sales expert. Your goal is to qualify leads and book meetings. Be professional, concise, and helpful. Always check the calendar before proposing a time."></textarea>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Temperature</label>
                                                <input type="range" className="w-full" min="0" max="1" step="0.1" defaultValue="0.7" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Model</label>
                                                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"><option>Gemini 1.5 Pro</option><option>Gemini 1.5 Flash</option></select>
                                            </div>
                                        </div>
                                        <button className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700">Save Configuration</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'metrics' && (
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
                                    <Activity size={48} className="mx-auto text-purple-200 mb-4" />
                                    <h3 className="text-xl font-bold">Live Performance Analytics</h3>
                                    <p className="text-slate-500">Real-time charts coming in next update.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* === MODE: STUDENT CAMPUS === */}
                    {currentMode === 'student' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {activeTab === 'dashboard' && <DashboardHeader title="Student Campus" subtitle="Learn, Connect, Grow." icon={<GraduationCap />} color="bg-green-600" />}

                            {activeTab === 'dashboard' || activeTab === 'classroom' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="font-bold text-slate-900">My Courses</h3>
                                                <button onClick={() => navigate('/programs')} className="text-green-600 bg-green-50 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors flex items-center gap-2"><Plus size={16} /> Enroll in Course</button>
                                            </div>
                                            <div className="space-y-6">
                                                {MOCK_COURSES.map(course => (
                                                    <div key={course.id}>
                                                        <div className="flex justify-between items-end mb-2">
                                                            <div><h4 className="font-bold text-slate-800">{course.title}</h4><p className="text-xs text-slate-500">Cohort: {course.cohort} • Next: {course.nextLesson}</p></div>
                                                            <span className="text-sm font-bold text-brand-primary">{course.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-brand-primary h-full rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><BookOpen size={18} /> Quick Stats</h3>
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div className="bg-slate-50 p-3 rounded-xl"><p className="text-2xl font-bold text-slate-900">12</p><p className="text-xs text-slate-500">Hours</p></div>
                                            <div className="bg-slate-50 p-3 rounded-xl"><p className="text-2xl font-bold text-slate-900">4</p><p className="text-xs text-slate-500">Projects</p></div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {activeTab === 'community' && (
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-6">Cohort Discussions</h3>
                                    <div className="space-y-4">
                                        {MOCK_COMMUNITY_TOPICS.map(topic => (
                                            <div key={topic.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-800">{topic.title}</h4>
                                                    <p className="text-xs text-slate-500">by {topic.author} • {topic.time}</p>
                                                </div>
                                                <div className="text-right text-xs text-slate-400">
                                                    <p>{topic.replies} replies</p>
                                                    <p>{topic.views} views</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold">New Topic</button>
                                </div>
                            )}

                            {activeTab === 'resources' && (
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-6">Learning Resources</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {MOCK_RESOURCES.map(res => (
                                            <div key={res.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-green-400 transition-colors cursor-pointer group">
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xs">{res.type}</div>
                                                <div className="flex-1 overflow-hidden">
                                                    <h4 className="font-bold text-sm text-slate-800 truncate">{res.title}</h4>
                                                    <p className="text-xs text-slate-500">{res.size}</p>
                                                </div>
                                                <Download size={16} className="text-slate-300 group-hover:text-green-600" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* === GLOBAL OVERVIEW (DEFAULT) === */}
                    {currentMode === 'overview' && activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {/* Welcome Banner */}
                            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                                <div className="relative z-10">
                                    <h1 className="text-3xl font-bold font-display mb-2">Welcome back, {user?.name?.split(' ')[0]}</h1>
                                    <p className="text-slate-400 max-w-xl">Your ecosystem is online. Select a workspace from the sidebar to begin.</p>
                                </div>
                                <div className="absolute right-0 bottom-0 w-64 h-64 opacity-10"><Brain size={256} /></div>
                            </div>

                            <BuilderLauncher onLaunch={() => setShowBuilder(true)} />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        {WORKSPACES.filter(w => w.id !== 'overview').map(w => (
                                            <button key={w.id} onClick={() => setCurrentMode(w.id)} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 text-left">
                                                <div className={`p-3 rounded-xl text-white ${w.color}`}>{w.icon}</div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{w.label}</h3>
                                                    <p className="text-xs text-slate-500">Access Hub</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-full">
                                    <Planner />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GLOBAL: SUPPORT CHAT */}
                    {activeTab === 'mentor' && (
                        <div className="bg-white rounded-3xl border border-slate-200 h-[calc(100vh-140px)] flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-md"><User size={24} /></div>
                                    <div><h3 className="font-bold text-slate-900">Dr. Amani (Live Support)</h3><p className="text-xs text-slate-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online</p></div>
                                </div>
                            </div>
                            <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30 custom-scrollbar">
                                {currentChat && currentChat.messages.map(msg => (
                                    <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] p-4 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}`}>{msg.text}</div>
                                    </div>
                                ))}
                                <div ref={mentorEndRef}></div>
                            </div>
                            <div className="p-4 bg-white border-t border-slate-100">
                                <form onSubmit={handleMentorSend} className="relative flex gap-2">
                                    <input value={mentorInput} onChange={(e) => setMentorInput(e.target.value)} placeholder="Type message..." className="flex-1 pl-6 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-brand-primary" />
                                    <button type="submit" className="p-4 bg-brand-primary text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"><Send size={18} /></button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* GLOBAL: PLANNER (FULL VIEW) */}
                    {activeTab === 'calendar' && (
                        <div className="h-[calc(100vh-140px)]">
                            <Planner />
                        </div>
                    )}

                    {/* GLOBAL: MASTER BRAIN */}
                    {activeTab === 'masterbrain' && (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-140px)]">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm col-span-1">
                                <h3 className="font-bold mb-4">Master Brain</h3>
                                <p className="text-sm text-slate-500 mb-4">Ask strategic questions about any of your workspaces.</p>
                                <input type="password" placeholder="API Key" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full p-3 border rounded-xl text-sm mb-2" />
                            </div>
                            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden">
                                <div className="flex-1 p-6 overflow-y-auto bg-slate-50">{brainMessages.map((m, i) => <ChatMessage key={i} role={m.role} text={m.text} />)}</div>
                                <div className="p-4 border-t border-slate-100 bg-white">
                                    <form onSubmit={handleBrainSend} className="relative"><input value={brainInput} onChange={e => setBrainInput(e.target.value)} className="w-full p-4 bg-slate-50 rounded-full outline-none" placeholder="Ask AI..." /><button className="absolute right-2 top-2 p-2 bg-slate-900 text-white rounded-full"><Send size={16} /></button></form>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

// --- HELPER COMPONENTS ---

const SidebarLink = ({ id, icon, label, active, onClick, notification }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative ${active ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
    >
        <div className={active ? 'text-brand-primary' : ''}>{icon}</div>
        <span className="hidden lg:block text-sm">{label}</span>
        {notification > 0 && <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>}
    </button>
);

const DashboardHeader = ({ title, subtitle, icon, color }: any) => (
    <div className={`rounded-3xl p-8 text-white relative overflow-hidden shadow-xl ${color}`}>
        <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                {React.cloneElement(icon, { size: 32, className: 'text-white' })}
            </div>
            <div>
                <h1 className="text-3xl font-bold font-display">{title}</h1>
                <p className="text-white/80 mt-1">{subtitle}</p>
            </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            {React.cloneElement(icon, { size: 200 })}
        </div>
    </div>
);

const QuickActionCard = ({ title, icon, color, onClick }: any) => (
    <button onClick={onClick} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex items-center gap-4 group text-left">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${color}`}>
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{title}</h4>
            <p className="text-xs text-slate-500">Launch Tool</p>
        </div>
    </button>
);

export default ClientPortal;