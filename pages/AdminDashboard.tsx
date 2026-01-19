import React, { useState, useRef, useEffect } from 'react';
import { useAdmin, Service, BlogPost, InternalTask, Employee, ChatGroup, ClientStatus } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { uploadToSupabase, uploadToCloudinary } from '../src/services/storageService';
import { authenticateDrive, uploadToDrive, deleteFromDrive } from '../src/services/googleDriveService';
import {
    LayoutDashboard, FileText, Settings, Palette, Image as ImageIcon,
    LogOut, Save, RotateCcw, Lock, Globe, Menu as MenuIcon, X, ChevronRight,
    Inbox, Calendar, Briefcase, PenTool, Trash2, Plus, Check, Edit2, Shield, Link as LinkIcon, Eye, EyeOff, Type, Upload, FileEdit, Grid,
    MessageSquare, User, Send, Clock, Users, PieChart, Video, PlusCircle, UserPlus, Layers, ListTodo, MoreVertical, LogIn, AlertCircle, Mail, MessageCircle,
    Ban, CheckCircle, Power, ImagePlus, Star, Layout, Hash, Phone, MapPin, Archive, Download, ArrowRight
} from 'lucide-react';

const CSSPieChart = ({ data, size = "md" }: { data: { label: string, value: number, color: string }[], size?: "sm" | "md" | "lg" }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let currentAngle = 0;

    const dims = size === 'sm' ? { w: 'w-32', h: 'h-32' } : size === 'lg' ? { w: 'w-64', h: 'h-64' } : { w: 'w-48', h: 'h-48' };

    useEffect(() => {
        if (chartRef.current && total > 0) {
            const gradientParts = data.map(item => {
                const percentage = (item.value / total) * 100;
                const start = currentAngle;
                const end = currentAngle + percentage;
                currentAngle = end;
                return `${item.color} ${start}% ${end}%`;
            }).join(', ');
            chartRef.current.style.background = `conic-gradient(${gradientParts})`;
        }
    }, [data, total]);

    if (total === 0) return <div className={`${dims.w} ${dims.h} rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500`}>No Data</div>;

    return (
        <div ref={chartRef} title="Data Distribution Chart" className={`relative ${dims.w} ${dims.h} rounded-full transition-all duration-500`}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`bg-white rounded-full flex flex-col items-center justify-center shadow-sm ${size === 'sm' ? 'w-20 h-20' : size === 'lg' ? 'w-44 h-44' : 'w-32 h-32'}`}>
                    <span className={`font-bold text-slate-900 ${size === 'sm' ? 'text-lg' : 'text-2xl'}`}>{total}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Total</span>
                </div>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        title={label}
        aria-label={label}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors mb-1 ${active ? 'bg-blue-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
    >
        {icon}
        <span className="text-sm">{label}</span>
    </button>
);

const StatCard = ({ label, value, icon, color }: { label: string, value: string | number, icon: React.ReactNode, color: string }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${color}`}>
            {icon}
        </div>
    </div>
);

// Reusable Image Configuration Component
const ImageConfigItem = ({ label, value, onChange }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4 group hover:border-blue-200 transition-colors">
        <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0 relative">
            {value ? <img src={value} alt={label} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><ImageIcon size={20} className="text-slate-400" /></div>}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Edit2 size={16} className="text-white" />
            </div>
        </div>
        <div className="flex-1">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">{label}</p>
            <label className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">
                Upload New
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onClick={(e) => (e.target as HTMLInputElement).value = ''}
                    onChange={onChange}
                />
            </label>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const {
        config, updateConfig, isAuthenticated, currentUser, login, signup, logout,
        verificationPendingEmail, setVerificationPendingEmail, loginWithGoogle,
        clients, updateClientStatus, deleteClient,
        services, addService, updateService, deleteService,
        posts, addPost, updatePost, deletePost,
        mediaLibrary, addMedia, deleteMedia, uploadFile,
        navigation, updateNavigation,
        bookings, updateBookingStatus,
        submissions, markSubmissionRead, toggleSubmissionStar, archiveSubmission, deleteSubmission,
        legalPages, updateLegalPage,
        supportChats, sendSupportMessage, markChatRead,
        employees, tasks, chatGroups, meetings, scheduleEvents,
        createChatGroup, createPrivateChat, disbandGroup, sendInternalMessage,
        assignTask, updateTaskStatus, scheduleMeeting,
        addScheduleEvent, deleteScheduleEvent,
        addEmployee, deleteEmployee, deleteTask, deleteMeeting,
        fsFolders, fsFiles, fsNotes, fsTeam, addFsFolder, addFsFile, addFsNote, addFsMember, deleteFsDoc
    } = useAdmin();

    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [toast, setToast] = useState<string | null>(null);

    const [loginMode, setLoginMode] = useState<'admin' | 'employee' | 'official'>('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
    const [chatMsg, setChatMsg] = useState('');
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showNewDM, setShowNewDM] = useState(false);
    const [newGroupData, setNewGroupData] = useState({ name: '', department: 'General', type: 'public', participants: [] as string[] });
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [showMeetingModal, setShowMeetingModal] = useState(false);
    const [meetingData, setMeetingData] = useState({ title: '', time: '', participants: [] as string[] });

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTask, setNewTask] = useState<any>({ title: '', assigneeId: '', priority: 'medium', dueDate: '' });

    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [newShift, setNewShift] = useState({ employeeId: '', title: 'Work Shift', start: '', end: '', type: 'shift' });

    const [showServiceModal, setShowServiceModal] = useState(false);
    const [newService, setNewService] = useState<Partial<Service>>({ title: '', priceUsd: '', category: 'core-ai', description: '', image: '' });

    const [showBlogModal, setShowBlogModal] = useState(false);
    const [newPost, setNewPost] = useState<Partial<BlogPost>>({ title: '', content: '', category: 'News', status: 'draft', image: '' });

    const [configState, setConfigState] = useState(config);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [inboxFilter, setInboxFilter] = useState<'inbox' | 'starred' | 'archived'>('inbox');

    // Team Modal State
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ name: '', email: '', role: '', department: '' });

    // New FS Modals
    const [showFsFolderModal, setShowFsFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [showFsFileModal, setShowFsFileModal] = useState(false);
    const [newFile, setNewFile] = useState({ name: '', size: '', folderId: '', file: null as File | null });
    const [storagePref, setStoragePref] = useState<'auto' | 'supabase' | 'cloudinary' | 'gdrive'>('auto');
    const [driveToken, setDriveToken] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState('');

    const [showFsNoteModal, setShowFsNoteModal] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [showFsMemberModal, setShowFsMemberModal] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const FILE_LIMIT = 5;
    const isOverFileLimit = fsFiles.length >= FILE_LIMIT;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Config Tab State
    const [configSection, setConfigSection] = useState<'branding' | 'seo' | 'home' | 'story' | 'marketing'>('branding');

    const navigate = useNavigate();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedGroup, chatGroups, chatMsg]);

    useEffect(() => {
        setConfigState(config);
    }, [config]);

    const isAdmin = currentUser?.role === 'admin';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        // Pass email only for official mode
        const success = await login(password, loginMode === 'official' ? email : undefined);

        if (!success) {
            setLoginError('Verification failed. Invalid keys or internal credentials.');
        }
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // --- Handlers ---

    const handleCreateGroup = () => {
        createChatGroup({
            name: newGroupData.name,
            type: newGroupData.type as 'public' | 'private',
            department: newGroupData.department,
            members: newGroupData.type === 'private' ? newGroupData.participants : employees.map(e => e.id)
        });
        setShowCreateGroup(false);
        showToast('Group Created');
    };

    const handleAssignTask = () => {
        assignTask({
            title: newTask.title,
            assigneeId: newTask.assigneeId,
            priority: newTask.priority,
            dueDate: newTask.dueDate,
            status: 'pending'
        });
        setShowTaskModal(false);
        showToast('Task Assigned');
    };

    const handleAddEmployee = () => {
        addEmployee({
            name: newEmployee.name,
            email: newEmployee.email,
            role: newEmployee.role,
            department: newEmployee.department,
            isOnline: false,
            schedule: '09:00 - 17:00'
        });
        setShowEmployeeModal(false);
        showToast('Team Member Added');
    };

    const handleScheduleMeeting = () => {
        scheduleMeeting({
            title: meetingData.title,
            time: meetingData.time,
            host: currentUser?.name || 'Admin',
            participants: meetingData.participants,
            link: `https://meet.google.com/new`,
        });
        setShowMeetingModal(false);
        showToast('Meeting Scheduled');
    };

    const handleAddShift = () => {
        addScheduleEvent({
            employeeId: newShift.employeeId,
            title: newShift.title,
            start: newShift.start,
            end: newShift.end,
            type: newShift.type as 'shift' | 'meeting' | 'leave'
        });
        setShowScheduleModal(false);
        showToast('Shift Added');
    };

    const handleAddService = () => {
        addService(newService as Service);
        setShowServiceModal(false);
        showToast('Service Created');
    };

    const handleAddPost = () => {
        addPost({
            ...newPost,
            id: Date.now().toString(),
            slug: newPost.title?.toLowerCase().replace(/\s+/g, '-') || 'post',
            date: new Date().toISOString().split('T')[0],
            author: currentUser?.name || 'Admin'
        } as BlogPost);
        setShowBlogModal(false);
        showToast('Post Created');
    };

    const handleConfigSave = () => {
        // Save all sections at once for simplicity, or we could save per section
        updateConfig('branding', configState.branding);
        updateConfig('seo', configState.seo);
        updateConfig('pages', configState.pages);
        showToast('Site Settings Saved');
    };

    // Robust deep object updater for config
    const updateDeepConfig = (path: string, value: any) => {
        setConfigState(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            const keys = path.split('.');
            let current = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newState;
        });
    };

    const handleConfigImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const base64 = await uploadFile(file);
                updateDeepConfig(path, base64);
            } catch (err) {
                console.error("Upload failed", err);
                showToast('Image upload failed');
            }
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'service' | 'post' | 'logo') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const base64 = await uploadFile(file);
                if (target === 'service') setNewService(prev => ({ ...prev, image: base64 }));
                else if (target === 'post') setNewPost(prev => ({ ...prev, image: base64 }));
                else if (target === 'logo') updateDeepConfig('branding.logo', base64);
            } catch (err) { showToast('Image upload failed'); }
        }
    };

    const allAccessibleGroups = chatGroups.filter(g => isAdmin || g.type === 'public' || g.members.includes(currentUser?.id || ''));
    const channelGroups = allAccessibleGroups.filter(g => g.type !== 'dm');
    const dmGroups = allAccessibleGroups.filter(g => g.type === 'dm');
    const visibleTasks = isAdmin ? tasks : tasks.filter(t => t.assigneeId === currentUser?.id);

    const taskStats = [
        { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#94a3b8' },
        { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#3b82f6' },
        { label: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#eab308' },
        { label: 'Done', value: tasks.filter(t => t.status === 'completed').length, color: '#22c55e' },
    ];

    const filteredSubmissions = submissions.filter(s => {
        if (inboxFilter === 'starred') return s.starred;
        if (inboxFilter === 'archived') return s.archived;
        return !s.archived;
    });

    if (!isAuthenticated) {
        if (verificationPendingEmail) {
            return (
                <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 text-center">
                        <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                            <Mail size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify Your Email</h2>
                        <p className="text-slate-500 mb-6">
                            We have sent you a verification email to <span className="font-bold text-slate-900">{verificationPendingEmail}</span>.
                            <br />Please verify it and log in.
                        </p>
                        <button
                            type="button"
                            title="Back to Login"
                            onClick={() => setVerificationPendingEmail(null)}
                            className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                        >
                            <LogIn size={18} /> Back to Login
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 to-red-900"></div>
                    <div className="text-center mb-8 pt-4">
                        <Shield className="mx-auto text-red-600 mb-2" size={40} />
                        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter">Sentinel Command</h2>
                        <p className="text-slate-500 text-xs">Awaiting Identity Verification</p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                        {['admin', 'employee', 'official'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                title={`Switch to ${t} mode`}
                                onClick={() => {
                                    setLoginMode(t as any);
                                    setLoginError('');
                                }}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${loginMode === t ? 'bg-white shadow-sm text-red-600' : 'text-slate-400'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {loginMode === 'official' && (
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-600 text-slate-900 text-sm"
                                placeholder="Internal Email"
                            />
                        )}

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-600 text-slate-900 text-sm"
                                placeholder={loginMode === 'official' ? 'Password' : `Enter ${loginMode} Key`}
                            />
                        </div>

                        {loginError && <div className="text-red-500 text-[10px] text-center flex items-center justify-center gap-1 font-bold italic underline"><AlertCircle size={10} /> {loginError}</div>}

                        <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                            Access System <ArrowRight size={18} />
                        </button>

                        {loginMode === 'official' && (
                            <div className="relative flex items-center justify-center my-4">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                                <span className="relative bg-white px-2 text-[10px] text-slate-400 font-bold uppercase">Or SSO</span>
                            </div>
                        )}

                        {loginMode === 'official' && (
                            <button type="button" title="Sign in with Google" onClick={loginWithGoogle} className="w-full py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                                <Globe size={18} className="text-blue-500" /> Google Identity
                            </button>
                        )}
                    </form>

                    <div className="mt-8 text-center">
                        <button type="button" title="Back to Platform Home" onClick={() => navigate('/')} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest flex items-center justify-center mx-auto gap-2">
                            <RotateCcw size={12} /> Exit to Platform
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    {
        showUpgradeModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-fade-in-up text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <Star size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Upgrade to Pro</h3>
                    <p className="text-slate-500 mb-6">You've reached the 5-file limit on the Free plan. Upgrade now to unlock unlimited storage and advanced AI features.</p>

                    <button onClick={() => setShowUpgradeModal(false)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md mb-3">Upgrade Now</button>
                    <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 font-medium hover:text-slate-600">Maybe Later</button>
                </div>
            </div>
        )
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden">
            {/* Mobile Toggle */}
            <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-slate-700"
            >
                {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
            <aside className={`fixed md:sticky top-0 h-screen w-64 bg-slate-900 text-white transition-transform z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center font-bold">A</div>
                    <div><h1 className="font-bold text-sm">ArchiTech Ops</h1><p className="text-[10px] text-slate-400 uppercase tracking-wider">{isAdmin ? 'Administrator' : 'Employee'}</p></div>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] font-bold text-slate-500 uppercase px-4 py-2">Workspace</div>
                    <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarItem icon={<FileText size={18} />} label="My Files" active={activeTab === 'files'} onClick={() => setActiveTab('files')} />
                    <SidebarItem icon={<Edit2 size={18} />} label="My Notes" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
                    <SidebarItem icon={<Users size={18} />} label="Team Members" active={activeTab === 'my-team'} onClick={() => setActiveTab('my-team')} />
                    <SidebarItem icon={<MessageSquare size={18} />} label="Chat Rooms" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
                    <SidebarItem icon={<ListTodo size={18} />} label="Tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />

                    <div className="text-[10px] font-bold text-slate-500 uppercase px-4 py-2 mt-4">Legacy Org</div>
                    <SidebarItem icon={<Users size={18} />} label="All Staff (Legacy)" active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
                    <SidebarItem icon={<Calendar size={18} />} label="Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
                    <SidebarItem icon={<UserPlus size={18} />} label="Clients" active={activeTab === 'clients'} onClick={() => setActiveTab('clients')} />

                    <div className="text-[10px] font-bold text-slate-500 uppercase px-4 py-2 mt-4">Management</div>
                    <SidebarItem icon={<Briefcase size={18} />} label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
                    <SidebarItem icon={<PenTool size={18} />} label="Blog Content" active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} />
                    <SidebarItem icon={<Inbox size={18} />} label="Inbox" active={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} />
                    <SidebarItem icon={<Settings size={18} />} label="Site Config" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
                </nav>
                <div className="p-4 bg-slate-800 border-t border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">{currentUser?.name.charAt(0)}</div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{currentUser?.name}</p>
                            <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online</p>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2"><LogOut size={14} /> Sign Out</button>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto pb-20">

                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="flex justify-between items-end">
                                <div><h2 className="text-3xl font-bold text-slate-900">Welcome, {currentUser?.name}</h2><p className="text-slate-500">Here is what's happening in the workspace today.</p></div>
                                <div className="text-right hidden md:block"><p className="text-2xl font-bold text-slate-900">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p><p className="text-sm text-slate-500">{new Date().toDateString()}</p></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard label="My Tasks" value={tasks.filter(t => t.assigneeId === currentUser?.id && t.status !== 'completed').length} icon={<ListTodo className="text-white" />} color="bg-blue-500" />
                                <StatCard label="Inbox" value={submissions.filter(s => !s.read).length} icon={<MessageSquare className="text-white" />} color="bg-purple-500" />
                                <StatCard label="Total Clients" value={clients.length} icon={<Users className="text-white" />} color="bg-green-500" />
                                <StatCard label="Next Shift" value="09:00 AM" icon={<Clock className="text-white" />} color="bg-amber-500" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="font-bold text-lg mb-4">Task Distribution</h3>
                                    <div className="flex items-center gap-8">
                                        <CSSPieChart data={taskStats} size="lg" />
                                        <div className="space-y-3" ref={el => {
                                            if (el) {
                                                const children = el.querySelectorAll('.legend-dot');
                                                children.forEach((dot, idx) => {
                                                    (dot as HTMLElement).style.backgroundColor = taskStats[idx]?.color || 'transparent';
                                                });
                                            }
                                        }}>
                                            {taskStats.map((stat, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full legend-dot"></div>
                                                    <span className="text-sm text-slate-600 font-medium">{stat.label}</span>
                                                    <span className="text-sm font-bold text-slate-900">{stat.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="font-bold text-lg mb-4">Team Status</h3>
                                    <div className="space-y-4">
                                        {employees.map(emp => (
                                            <div key={emp.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">{emp.name.charAt(0)}</div>
                                                    <div><p className="text-sm font-bold text-slate-900">{emp.name}</p><p className="text-[10px] text-slate-500">{emp.role}</p></div>
                                                </div>
                                                <div className={`w-2 h-2 rounded-full ${emp.isOnline ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- MY FILES TAB --- */}
                    {activeTab === 'files' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900">My Files</h2>
                                    <p className="text-slate-500">Manage your personal documents and assets.</p>
                                    {isOverFileLimit && <p className="text-red-500 text-sm font-bold mt-1">You’ve reached the free plan limit.</p>}
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" title="Create New Folder" onClick={() => setShowFsFolderModal(true)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"><PlusCircle size={18} /> New Folder</button>
                                    <button
                                        type="button"
                                        title={isOverFileLimit ? 'Upload Limit Reached' : 'Upload New File'}
                                        onClick={() => isOverFileLimit ? setShowUpgradeModal(true) : setShowFsFileModal(true)}
                                        className={`px-4 py-2 rounded-lg font-bold transition-colors shadow-lg flex items-center gap-2 ${isOverFileLimit ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        <Upload size={18} /> {isOverFileLimit ? 'Limit Reached' : 'Upload File'}
                                    </button>
                                </div>
                            </div>

                            {/* Folders */}
                            {fsFolders.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {fsFolders.map(folder => (
                                        <div key={folder.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group relative">
                                            <div className="text-blue-500 mb-3"><Briefcase size={32} /></div>
                                            <p className="font-bold text-slate-900 truncate">{folder.name}</p>
                                            <p className="text-xs text-slate-400">{new Date(folder.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                                            <button onClick={(e) => { e.stopPropagation(); deleteFsDoc('folders', folder.id); }} title="Delete Folder" aria-label={`Delete folder ${folder.name}`} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Files */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-lg">All Files</h3></div>
                                {fsFiles.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400">
                                        <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>No files uploaded yet.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {fsFiles.map(file => (
                                            <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500"><FileText size={20} /></div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{file.name}</p>
                                                        <p className="text-xs text-slate-500 flex items-center gap-2">
                                                            {file.size} • {new Date(file.createdAt?.seconds * 1000).toLocaleDateString()}
                                                            {file.provider === 'supabase' && <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Supabase</span>}
                                                            {file.provider === 'cloudinary' && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Cloudinary</span>}
                                                            {file.provider === 'gdrive' && <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1"><img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" title="Stored in Google Drive" className="w-3 h-3" /> Drive</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {file.downloadURL ? (
                                                        <a href={file.downloadURL} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors" title="Download"><Download size={16} /></a>
                                                    ) : (
                                                        <button onClick={() => alert("No download link available.")} className="p-2 text-slate-300 cursor-not-allowed" title="No Link"><Download size={16} /></button>
                                                    )}
                                                    <button onClick={async () => {
                                                        if (confirm('Are you sure you want to delete this file?')) {
                                                            if (file.provider === 'gdrive' && file.providerRef) {
                                                                if (driveToken) {
                                                                    await deleteFromDrive(file.providerRef, driveToken);
                                                                } else {
                                                                    alert("Note: Could not delete from Google Drive (Not connected). Removing from dashboard only.");
                                                                }
                                                            }
                                                            await deleteFsDoc('files', file.id);
                                                        }
                                                    }} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Delete"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- MY NOTES TAB --- */}
                    {activeTab === 'notes' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <div><h2 className="text-3xl font-bold text-slate-900">My Notes</h2><p className="text-slate-500">Capture ideas and tasks quickly.</p></div>
                                <button type="button" title="Create New Note" onClick={() => setShowFsNoteModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"><Plus size={18} /> New Note</button>
                            </div>

                            {fsNotes.length === 0 ? (
                                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
                                    <Edit2 size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No notes created yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {fsNotes.map(note => (
                                        <div key={note.id} className="bg-yellow-50 p-6 rounded-2xl shadow-sm border border-yellow-100 relative group hover:shadow-md transition-all">
                                            <h3 className="font-bold text-lg text-slate-900 mb-2">{note.title}</h3>
                                            <p className="text-slate-600 whitespace-pre-wrap mb-4">{note.content}</p>
                                            <div className="flex justify-between items-center text-xs text-slate-400 mt-auto pt-4 border-t border-yellow-200">
                                                <span>{new Date(note.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                                <button onClick={() => deleteFsDoc('notes', note.id)} title="Delete Note" aria-label="Delete note" className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TEAM MEMBERS TAB --- */}
                    {activeTab === 'my-team' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <div><h2 className="text-3xl font-bold text-slate-900">Team Members</h2><p className="text-slate-500">Manage your direct team and collaborators.</p></div>
                                <button type="button" title="Add Team Member" onClick={() => setShowFsMemberModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"><UserPlus size={18} /> Add Member</button>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 grid grid-cols-4 gap-4 font-bold text-xs text-slate-500 uppercase tracking-wider">
                                    <div className="col-span-2">Name</div>
                                    <div>Role</div>
                                    <div className="text-right">Actions</div>
                                </div>
                                {fsTeam.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400">
                                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>No team members added yet.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {fsTeam.map(member => (
                                            <div key={member.id} className="p-4 grid grid-cols-4 gap-4 items-center hover:bg-slate-50 transition-colors">
                                                <div className="col-span-2 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{member.name.charAt(0)}</div>
                                                    <div><p className="font-bold text-slate-900">{member.name}</p><p className="text-xs text-slate-500">{member.email}</p></div>
                                                </div>
                                                <div><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{member.role}</span></div>
                                                <div className="text-right">
                                                    <button onClick={() => deleteFsDoc('teamMembers', member.id)} title="Remove Member" aria-label="Remove member" className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-slate-900">Task Board</h2>
                                <button type="button" title="Create New Task" onClick={() => setShowTaskModal(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"><Plus size={18} /> Add Task</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-x-auto pb-4">
                                {['pending', 'in-progress', 'review', 'completed'].map(status => (
                                    <div key={status} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col h-full min-h-[400px]">
                                        <h3 className="font-bold uppercase text-xs text-slate-500 tracking-wider mb-4 flex justify-between">
                                            {status.replace('-', ' ')}
                                            <span className="bg-slate-200 px-2 rounded-full text-slate-600">{tasks.filter(t => t.status === status).length}</span>
                                        </h3>
                                        <div className="space-y-3 flex-1">
                                            {tasks.filter(t => t.status === status).map(task => {
                                                const assignee = employees.find(e => e.id === task.assigneeId);
                                                return (
                                                    <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group relative">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className={`w-2 h-2 rounded-full mt-1.5 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                                                            <button onClick={() => deleteTask(task.id)} title="Delete Task" aria-label="Delete task" className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                                        </div>
                                                        <h4 className="font-bold text-slate-800 text-sm mb-2">{task.title}</h4>
                                                        <div className="flex justify-between items-center text-xs text-slate-500">
                                                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                                <span className="font-bold">{assignee?.name.split(' ')[0] || 'Unassigned'}</span>
                                                            </div>
                                                            <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                        </div>
                                                        <div className="mt-3 flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {status !== 'completed' && (
                                                                <button onClick={() => updateTaskStatus(task.id, 'completed')} className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Complete"><Check size={12} /></button>
                                                            )}
                                                            {status !== 'in-progress' && status !== 'completed' && (
                                                                <button onClick={() => updateTaskStatus(task.id, 'in-progress')} className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="Start"><Clock size={12} /></button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-slate-900">Team & Meetings</h2>
                                {isAdmin && <button type="button" title="Add Employee Member" onClick={() => setShowEmployeeModal(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"><UserPlus size={18} /> Add Member</button>}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Employee List */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Users size={18} /> Roster</h3>
                                    <div className="space-y-4">
                                        {employees.map(emp => (
                                            <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-600 border border-white shadow-sm">
                                                        {emp.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-900">{emp.name}</p>
                                                        <p className="text-xs text-slate-500">{emp.role} • {emp.department}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-2 h-2 rounded-full ${emp.isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`}></span>
                                                    {isAdmin && <button onClick={() => deleteEmployee(emp.id)} title="Delete Employee" aria-label="Delete employee" className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Meetings */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg flex items-center gap-2"><Video size={18} /> Meetings</h3>
                                        <button onClick={() => setShowMeetingModal(true)} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors">Schedule New</button>
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        {meetings.length === 0 && <p className="text-slate-400 text-sm text-center py-8">No upcoming meetings.</p>}
                                        {meetings.map(m => (
                                            <div key={m.id} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-sm">{m.title}</h4>
                                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2"><Clock size={12} /> {m.time} • Host: {m.host}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <a href={m.link} target="_blank" rel="noreferrer" title="Join Meeting" aria-label="Join Meeting" className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"><Video size={14} /></a>
                                                        {isAdmin && <button onClick={() => deleteMeeting(m.id)} title="Delete Meeting" aria-label="Delete meeting" className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>}
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex -space-x-2">
                                                    {m.participants.map(pId => {
                                                        const p = employees.find(e => e.id === pId);
                                                        return p ? (
                                                            <div key={pId} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-600" title={p.name}>{p.name.charAt(0)}</div>
                                                        ) : null;
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)] animate-fade-in-up">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Channels</h3>
                                    <button onClick={() => setShowCreateGroup(true)} title="Create Channel" aria-label="Create channel" className="p-1.5 bg-slate-200 rounded-lg hover:bg-slate-300 text-slate-600"><Plus size={14} /></button>
                                </div>
                                <div className="overflow-y-auto p-2 space-y-1 mb-2">
                                    {channelGroups.map(group => (
                                        <button key={group.id} onClick={() => setSelectedGroup(group)} className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between group transition-colors ${selectedGroup?.id === group.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                                            <div className="flex items-center gap-2"><span className="text-slate-400">#</span><span className="font-bold text-sm truncate max-w-[120px]">{group.name}</span></div>
                                            {group.type === 'private' && <Lock size={12} className="opacity-50" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Direct Messages</h3>
                                    <button onClick={() => setShowNewDM(true)} title="New Direct Message" aria-label="New direct message" className="p-1.5 bg-slate-200 rounded-lg hover:bg-slate-300 text-slate-600"><MessageCircle size={14} /></button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                    {dmGroups.map(group => {
                                        const otherMemberId = group.members.find(m => m !== currentUser?.id) || group.members[0];
                                        const otherMember = employees.find(e => e.id === otherMemberId);
                                        const displayName = otherMember ? otherMember.name : group.name;
                                        return (
                                            <button key={group.id} onClick={() => setSelectedGroup(group)} className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between group transition-colors ${selectedGroup?.id === group.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{displayName.charAt(0)}</div>
                                                    <span className="font-bold text-sm truncate max-w-[120px]">{displayName}</span>
                                                </div>
                                                <div className={`w-2 h-2 rounded-full ${otherMember?.isOnline ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                                {selectedGroup ? (
                                    <>
                                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                                    {selectedGroup.type === 'dm' ? <User size={20} /> : <Hash size={20} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{selectedGroup.type === 'dm' ? (employees.find(e => e.id === selectedGroup.members.find(m => m !== currentUser?.id))?.name || selectedGroup.name) : selectedGroup.name}</h3>
                                                    <p className="text-xs text-slate-500">{selectedGroup.type === 'public' ? 'Public Channel' : selectedGroup.type === 'dm' ? 'Private Message' : 'Private Group'}</p>
                                                </div>
                                            </div>
                                            {isAdmin && selectedGroup.type !== 'dm' && (
                                                <button onClick={() => { disbandGroup(selectedGroup.id); setSelectedGroup(null); showToast('Group Disbanded'); }} className="text-red-500 text-xs font-bold hover:bg-red-50 px-3 py-1 rounded border border-transparent hover:border-red-100 transition-colors">Disband</button>
                                            )}
                                        </div>
                                        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-4">
                                            {selectedGroup.messages.map(msg => (
                                                <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser?.id ? 'items-end' : 'items-start'}`}>
                                                    <div className="flex items-end gap-2 max-w-[80%]">
                                                        {msg.senderId !== currentUser?.id && <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 mb-1">{msg.senderName.charAt(0)}</div>}
                                                        <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.senderId === currentUser?.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>{msg.text}</div>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 mt-1 px-2">{msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            ))}
                                            <div ref={chatEndRef}></div>
                                        </div>
                                        <div className="p-4 bg-white border-t border-slate-100">
                                            <form onSubmit={(e) => { e.preventDefault(); if (chatMsg.trim()) { sendInternalMessage(selectedGroup.id, chatMsg); setChatMsg(''); } }} className="flex gap-2">
                                                <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder={`Message #${selectedGroup.name}...`} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary" />
                                                <button type="submit" title="Send Message" aria-label="Send message" className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"><Send size={20} /></button>
                                            </form>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400"><MessageSquare size={64} className="mb-4 opacity-20" /><p>Select a group or person to message.</p></div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold">Shift Schedule</h2>
                                {isAdmin && <button onClick={() => setShowScheduleModal(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"><PlusCircle size={18} /> Add Shift</button>}
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                        <div key={d} className="p-4 text-center font-bold text-slate-500 text-sm uppercase tracking-wide">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 min-h-[400px]">
                                    {Array.from({ length: 7 }).map((_, i) => {
                                        const dayEvents = scheduleEvents.filter(e => new Date(e.start).getDay() === i);
                                        return (
                                            <div key={i} className="border-r border-slate-100 last:border-0 p-2 space-y-2">
                                                {dayEvents.map(ev => {
                                                    const emp = employees.find(e => e.id === ev.employeeId);
                                                    return (
                                                        <div key={ev.id} className={`p-2 rounded-lg text-xs border ${ev.type === 'shift' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                                            <div className="font-bold">{new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                            <div className="truncate font-semibold">{ev.title}</div>
                                                            <div className="opacity-70 mt-1 flex items-center gap-1">
                                                                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center font-bold text-[8px] border border-slate-200">{emp?.name.charAt(0)}</div>
                                                                <span className="truncate">{emp?.name.split(' ')[0]}</span>
                                                            </div>
                                                            {isAdmin && <button title="Delete Shift" onClick={() => deleteScheduleEvent(ev.id)} className="mt-2 text-red-400 hover:text-red-600 block"><Trash2 size={12} /></button>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'clients' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-slate-900">Client Management</h2>
                                <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Total Clients: {clients.length}</div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                                        <tr>
                                            <th className="p-4">Name / Contact</th>
                                            <th className="p-4">Subscription</th>
                                            <th className="p-4">Spend</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.map(client => (
                                            <tr key={client.id} className="border-b last:border-0 border-slate-100 hover:bg-slate-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                                            {client.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-800">{client.name}</div>
                                                            <div className="text-xs text-slate-500">{client.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{client.subscriptionPlan || 'N/A'}</span></td>
                                                <td className="p-4 text-sm font-mono">{client.totalSpend}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${client.status === 'active' ? 'bg-green-100 text-green-700' : client.status === 'suspended' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                        {client.status === 'active' && <CheckCircle size={10} />}
                                                        {client.status === 'suspended' && <Power size={10} />}
                                                        {client.status === 'banned' && <Ban size={10} />}
                                                        {client.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {client.status !== 'active' && <button onClick={() => { updateClientStatus(client.id, 'active'); showToast(`Activated ${client.name}`); }} className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Activate"><Check size={14} /></button>}
                                                        {client.status === 'active' && <button onClick={() => { updateClientStatus(client.id, 'suspended'); showToast(`Suspended ${client.name}`); }} className="p-2 bg-amber-50 text-amber-600 rounded hover:bg-amber-100" title="Suspend"><Power size={14} /></button>}
                                                        <button title="Delete Client" onClick={() => { deleteClient(client.id); showToast(`Deleted ${client.name}`); }} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-slate-900">Services & Programs</h2>
                                <button type="button" title="Add New Service" onClick={() => setShowServiceModal(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-colors"><PlusCircle size={18} /> Add Service</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {services.map(svc => (
                                    <div key={svc.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                {svc.image ? (
                                                    <img src={svc.image} alt={svc.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                                                ) : (
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${svc.category === 'core-ai' ? 'bg-blue-500' : svc.category === 'automation' ? 'bg-amber-500' : 'bg-slate-500'}`}>
                                                        <Briefcase size={20} />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{svc.title}</h3>
                                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">{svc.category} • {svc.level}</p>
                                                </div>
                                            </div>
                                            {svc.featured && <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><Star size={10} fill="currentColor" /> Featured</span>}
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">{svc.description}</p>
                                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                                            <span className="font-bold text-slate-900 text-lg">{svc.priceUsd}</span>
                                            <div className="flex gap-2">
                                                <button title="Edit Service" className="p-2 bg-slate-50 text-slate-600 rounded hover:bg-slate-100 transition-colors"><Edit2 size={14} /></button>
                                                <button title="Delete Service" onClick={() => deleteService(svc.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'blog' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-slate-900">Blog Content</h2>
                                <button type="button" title="Write New Blog Post" onClick={() => setShowBlogModal(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-colors"><PenTool size={18} /> Write Post</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts.map(post => (
                                    <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full group">
                                        <div className="h-40 bg-slate-200 relative overflow-hidden">
                                            {post.image ? <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={32} /></div>}
                                            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${post.status === 'published' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>{post.status}</div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h4 className="font-bold text-lg text-slate-900 mb-2 leading-tight group-hover:text-brand-primary transition-colors">{post.title}</h4>
                                            <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
                                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                                <span className="text-xs text-slate-400">{post.date}</span>
                                                <div className="flex gap-2">
                                                    <button title="Edit Post" className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"><Edit2 size={14} /></button>
                                                    <button title="Delete Post" onClick={() => deletePost(post.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'inbox' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-slate-900">Inbox</h2>
                                <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
                                    <button type="button" title="Show All Messages" onClick={() => setInboxFilter('inbox')} className={`px-3 py-1 text-xs font-bold rounded ${inboxFilter === 'inbox' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Inbox</button>
                                    <button type="button" title="Show Starred Messages" onClick={() => setInboxFilter('starred')} className={`px-3 py-1 text-xs font-bold rounded ${inboxFilter === 'starred' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Starred</button>
                                    <button type="button" title="Show Archived Messages" onClick={() => setInboxFilter('archived')} className={`px-3 py-1 text-xs font-bold rounded ${inboxFilter === 'archived' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Archived</button>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                {filteredSubmissions.length === 0 ? <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-4"><Inbox size={48} className="opacity-20" /><p>No messages found in {inboxFilter}.</p></div> : (
                                    <div className="divide-y divide-slate-100">
                                        {filteredSubmissions.map(msg => (
                                            <div key={msg.id} className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group flex gap-4 ${selectedMessage === msg.id ? 'bg-blue-50/50' : ''} ${!msg.read ? 'bg-slate-50/30' : ''}`} onClick={() => { setSelectedMessage(msg.id === selectedMessage ? null : msg.id); markSubmissionRead(msg.id); }}>
                                                <div className="flex flex-col items-center gap-2 pt-1">
                                                    <button title="Star Message" onClick={(e) => { e.stopPropagation(); toggleSubmissionStar(msg.id); }} className={`p-1 rounded hover:bg-slate-200 ${msg.starred ? 'text-yellow-400' : 'text-slate-300'}`}><Star size={16} fill={msg.starred ? 'currentColor' : 'none'} /></button>
                                                    <div className={`w-2 h-2 rounded-full ${!msg.read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className={`text-sm truncate ${!msg.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{msg.name}</h4>
                                                        <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{msg.date}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-medium mb-1 truncate">{msg.subject}</div>
                                                    <div className="text-xs text-slate-400 truncate pr-8">{msg.message}</div>

                                                    {selectedMessage === msg.id && (
                                                        <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-700 bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-fade-in-down cursor-default" onClick={e => e.stopPropagation()}>
                                                            <div className="flex justify-between items-center mb-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-slate-500">{msg.name.charAt(0)}</div>
                                                                    <div>
                                                                        <p className="font-bold text-slate-900">{msg.name}</p>
                                                                        <p className="text-xs text-slate-500">{msg.email}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => archiveSubmission(msg.id)} className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-600" title="Archive"><Archive size={16} /></button>
                                                                    <button onClick={() => deleteSubmission(msg.id)} className="p-2 border border-slate-200 rounded hover:bg-red-50 text-red-500" title="Delete"><Trash2 size={16} /></button>
                                                                </div>
                                                            </div>
                                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                                            <div className="mt-6 flex justify-end">
                                                                <a href={`mailto:${msg.email}`} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center gap-2"><Mail size={16} /> Reply</a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'config' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold">Site Configuration</h2>
                                <div className="flex gap-2">
                                    <button onClick={handleConfigSave} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 shadow-lg"><Save size={18} /> Save Changes</button>
                                </div>
                            </div>

                            {/* Config Sub-Nav */}
                            <div className="flex gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
                                <button type="button" title="Branding & SEO Settings" onClick={() => setConfigSection('branding')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${configSection === 'branding' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Branding & SEO</button>
                                <button type="button" title="Home Page Settings" onClick={() => setConfigSection('home')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${configSection === 'home' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Home Page</button>
                                <button type="button" title="Our Story Settings" onClick={() => setConfigSection('story')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${configSection === 'story' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Our Story</button>
                                <button type="button" title="Marketing Settings" onClick={() => setConfigSection('marketing')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${configSection === 'marketing' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Marketing</button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                {/* BRANDING & SEO */}
                                {configSection === 'branding' && (
                                    <>
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Palette size={18} /> Visual Identity</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Site Name</label>
                                                    <input title="Site Name" placeholder="Site Name" value={configState.branding.name} onChange={e => updateDeepConfig('branding.name', e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
                                                </div>
                                                <ImageConfigItem
                                                    label="Logo"
                                                    value={configState.branding.logo || ''}
                                                    onChange={(e) => handleConfigImageUpload(e, 'branding.logo')}
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500 uppercase">Primary Color</label>
                                                        <div className="flex gap-2 mt-1">
                                                            <input type="color" title="Pick Primary Color" value={configState.branding.primaryColor} onChange={e => updateDeepConfig('branding.primaryColor', e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0" />
                                                            <input title="Primary Color Hex" placeholder="#000000" value={configState.branding.primaryColor} onChange={e => updateDeepConfig('branding.primaryColor', e.target.value)} className="w-full p-2 border rounded-lg" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500 uppercase">Secondary Color</label>
                                                        <div className="flex gap-2 mt-1">
                                                            <input type="color" title="Pick Secondary Color" value={configState.branding.secondaryColor} onChange={e => updateDeepConfig('branding.secondaryColor', e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0" />
                                                            <input title="Secondary Color Hex" placeholder="#000000" value={configState.branding.secondaryColor} onChange={e => updateDeepConfig('branding.secondaryColor', e.target.value)} className="w-full p-2 border rounded-lg" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Font Family</label>
                                                    <select title="Font Family" value={configState.branding.font} onChange={e => updateDeepConfig('branding.font', e.target.value)} className="w-full mt-1 p-2 border rounded-lg">
                                                        <option value="Inter">Inter</option>
                                                        <option value="Roboto">Roboto</option>
                                                        <option value="Poppins">Poppins</option>
                                                        <option value="Space Grotesk">Space Grotesk</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Globe size={18} /> SEO & Meta</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Default Page Title</label>
                                                    <input title="SEO Page Title" placeholder="Title" value={configState.seo.defaultTitle} onChange={e => updateDeepConfig('seo.defaultTitle', e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Meta Description</label>
                                                    <textarea title="Meta Description" placeholder="Describe your site" value={configState.seo.defaultDescription} onChange={e => updateDeepConfig('seo.defaultDescription', e.target.value)} className="w-full mt-1 p-2 border rounded-lg" rows={3} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* HOME PAGE CONFIG */}
                                {configSection === 'home' && (
                                    <>
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                            <h3 className="font-bold text-lg mb-4">Hero Section</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Hero Title</label>
                                                    <textarea title="Hero Title" placeholder="Title" value={configState.pages.home.heroTitle} onChange={e => updateDeepConfig('pages.home.heroTitle', e.target.value)} className="w-full mt-1 p-2 border rounded-lg" rows={2} />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Hero Subtitle</label>
                                                    <textarea title="Hero Subtitle" placeholder="Subtitle" value={configState.pages.home.heroSubtitle} onChange={e => updateDeepConfig('pages.home.heroSubtitle', e.target.value)} className="w-full mt-1 p-2 border rounded-lg" rows={3} />
                                                </div>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <input type="checkbox" title="Toggle Stats" checked={configState.pages.home.showStats} onChange={e => updateDeepConfig('pages.home.showStats', e.target.checked)} />
                                                        Show Stats
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <input type="checkbox" title="Toggle Tech Marquee" checked={configState.pages.home.showTechMarquee} onChange={e => updateDeepConfig('pages.home.showTechMarquee', e.target.checked)} />
                                                        Show Tech Marquee
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <input type="checkbox" title="Toggle Testimonials" checked={configState.pages.home.showTestimonials} onChange={e => updateDeepConfig('pages.home.showTestimonials', e.target.checked)} />
                                                        Show Testimonials
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                            <h3 className="font-bold text-lg mb-4">Pathway Images</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <ImageConfigItem label="Pathway 1 (AI Generalist)" value={configState.pages.home.featureImages.pathway1} onChange={e => handleConfigImageUpload(e, 'pages.home.featureImages.pathway1')} />
                                                <ImageConfigItem label="Pathway 2 (Automation)" value={configState.pages.home.featureImages.pathway2} onChange={e => handleConfigImageUpload(e, 'pages.home.featureImages.pathway2')} />
                                                <ImageConfigItem label="Pathway 3 (No-Code)" value={configState.pages.home.featureImages.pathway3} onChange={e => handleConfigImageUpload(e, 'pages.home.featureImages.pathway3')} />
                                                <ImageConfigItem label="Pathway 4 (Open Source)" value={configState.pages.home.featureImages.pathway4} onChange={e => handleConfigImageUpload(e, 'pages.home.featureImages.pathway4')} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* OUR STORY CONFIG */}
                                {configSection === 'story' && (
                                    <>
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                            <h3 className="font-bold text-lg mb-4">Narrative Content</h3>
                                            <div className="space-y-4">
                                                <div><label className="text-xs font-bold text-slate-500 uppercase">Page Title</label><input title="Page Title" value={configState.pages.ourStory.heroTitle} onChange={e => updateDeepConfig('pages.ourStory.heroTitle', e.target.value)} className="w-full mt-1 p-2 border rounded-lg" /></div>
                                                <div><label className="text-xs font-bold text-slate-500 uppercase">Page Subtitle</label><textarea title="Page Subtitle" value={configState.pages.ourStory.heroSubtitle} onChange={e => updateDeepConfig('pages.ourStory.heroSubtitle', e.target.value)} className="w-full mt-1 p-2 border rounded-lg" rows={2} /></div>
                                                <div><label className="text-xs font-bold text-slate-500 uppercase">Main Quote</label><textarea title="Main Quote" value={configState.pages.ourStory.quote} onChange={e => updateDeepConfig('pages.ourStory.quote', e.target.value)} className="w-full mt-1 p-2 border rounded-lg font-serif italic" rows={2} /></div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                            <h3 className="font-bold text-lg mb-4">Leadership Section</h3>
                                            <div className="space-y-4">
                                                <ImageConfigItem label="CEO Image 1" value={configState.pages.ourStory.ceoImage1} onChange={e => handleConfigImageUpload(e, 'pages.ourStory.ceoImage1')} />
                                                <ImageConfigItem label="CEO Image 2" value={configState.pages.ourStory.ceoImage2} onChange={e => handleConfigImageUpload(e, 'pages.ourStory.ceoImage2')} />
                                                <div><label className="text-xs font-bold text-slate-500 uppercase">CEO Bio 1</label><textarea title="CEO Bio" value={configState.pages.ourStory.ceoBio1} onChange={e => updateDeepConfig('pages.ourStory.ceoBio1', e.target.value)} className="w-full mt-1 p-2 border rounded-lg" rows={3} /></div>
                                                <div><label className="text-xs font-bold text-slate-500 uppercase">CEO Quote</label><textarea title="CEO Quote" value={configState.pages.ourStory.ceoQuote} onChange={e => updateDeepConfig('pages.ourStory.ceoQuote', e.target.value)} className="w-full mt-1 p-2 border rounded-lg" rows={2} /></div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* MARKETING CONFIG */}
                                {configSection === 'marketing' && (
                                    <>
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1 lg:col-span-2">
                                            <h3 className="font-bold text-lg mb-4">Portfolio Grid Images</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <ImageConfigItem label="Real Estate / Property" value={configState.pages.marketing.portfolioImages.realEstate} onChange={e => handleConfigImageUpload(e, 'pages.marketing.portfolioImages.realEstate')} />
                                                <ImageConfigItem label="Food / Hospitality" value={configState.pages.marketing.portfolioImages.food} onChange={e => handleConfigImageUpload(e, 'pages.marketing.portfolioImages.food')} />
                                                <ImageConfigItem label="Fashion / Retail" value={configState.pages.marketing.portfolioImages.fashion} onChange={e => handleConfigImageUpload(e, 'pages.marketing.portfolioImages.fashion')} />
                                                <ImageConfigItem label="Tech / SaaS" value={configState.pages.marketing.portfolioImages.tech} onChange={e => handleConfigImageUpload(e, 'pages.marketing.portfolioImages.tech')} />
                                            </div>
                                        </div>
                                    </>
                                )}

                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Modals */}
            {showCreateGroup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 animate-fade-in-up">
                        <h3 className="font-bold text-lg mb-4">Create Channel</h3>
                        <div className="space-y-4">
                            <input title="Channel Name" value={newGroupData.name} onChange={e => setNewGroupData({ ...newGroupData, name: e.target.value })} placeholder="Channel Name" className="w-full p-2 border rounded" />
                            <select title="Channel Type" value={newGroupData.type} onChange={e => setNewGroupData({ ...newGroupData, type: e.target.value })} className="w-full p-2 border rounded">
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                            <button onClick={handleCreateGroup} className="w-full bg-blue-600 text-white py-2 rounded font-bold">Create</button>
                            <button onClick={() => setShowCreateGroup(false)} className="w-full text-slate-500 py-2">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showEmployeeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 animate-fade-in-up">
                        <h3 className="font-bold text-lg mb-4">Add Team Member</h3>
                        <div className="space-y-4">
                            <input title="Full Name" value={newEmployee.name} onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} placeholder="Full Name" className="w-full p-2 border rounded" />
                            <input title="Email" value={newEmployee.email} onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })} placeholder="Email" className="w-full p-2 border rounded" />
                            <input title="Role" value={newEmployee.role} onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })} placeholder="Role" className="w-full p-2 border rounded" />
                            <input title="Department" value={newEmployee.department} onChange={e => setNewEmployee({ ...newEmployee, department: e.target.value })} placeholder="Department" className="w-full p-2 border rounded" />
                            <button onClick={handleAddEmployee} className="w-full bg-slate-900 text-white py-2 rounded font-bold">Add Member</button>
                            <button onClick={() => setShowEmployeeModal(false)} className="w-full text-slate-500 py-2">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {showFsFileModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-4">Upload File</h3>
                        <div className="space-y-4 mb-6">
                            <input
                                title="File Upload"
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        const f = e.target.files[0];
                                        setNewFile({ ...newFile, name: f.name, size: (f.size / 1024).toFixed(1) + ' KB', file: f });
                                        setUploadError('');
                                    }
                                }}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />

                            <select title="Storage Folder" value={newFile.folderId} onChange={(e) => setNewFile({ ...newFile, folderId: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">No Folder (Root)</option>
                                {fsFolders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>

                            <select title="Storage Provider" value={storagePref} onChange={(e) => setStoragePref(e.target.value as any)} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="auto">Auto (Recommended)</option>
                                <option value="supabase">Platform Storage (Supabase)</option>
                                <option value="cloudinary">Cloudinary (Images Only)</option>
                                <option value="gdrive">Google Drive (Personal)</option>
                            </select>

                            {storagePref === 'gdrive' && !driveToken && (
                                <button
                                    onClick={async () => {
                                        try {
                                            const token = await authenticateDrive();
                                            setDriveToken(token);
                                            setUploadError('');
                                        } catch (err: any) {
                                            setUploadError("Failed to connect Google Drive.");
                                        }
                                    }}
                                    className="w-full py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2"
                                >
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-5 h-5" alt="Drive" />
                                    Connect Google Drive
                                </button>
                            )}

                            {uploadProgress > 0 && (
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all" ref={el => { if (el) el.style.width = `${uploadProgress}%`; }}></div>
                                </div>
                            )}

                            {uploadError && <p className="text-red-500 text-xs text-center">{uploadError}</p>}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { setShowFsFileModal(false); setUploadProgress(0); setUploadError(''); }} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button
                                onClick={async () => {
                                    if (!newFile.file || !currentUser) { setUploadError('Please select a file.'); return; }

                                    setIsSubmitting(true);
                                    setUploadProgress(10); // Start

                                    try {
                                        let result;
                                        const isImage = newFile.file.type.startsWith('image/');
                                        let method = storagePref;

                                        if (method === 'auto') {
                                            method = isImage ? 'cloudinary' : 'supabase';
                                        }

                                        if (method === 'cloudinary' && !isImage) {
                                            throw new Error("Cloudinary only supports images.");
                                        }

                                        if (method === 'gdrive') {
                                            if (!driveToken) throw new Error("Please connect Google Drive first.");
                                            const driveRes = await uploadToDrive(newFile.file, driveToken);
                                            result = { provider: 'gdrive', providerRef: driveRes.id, downloadURL: driveRes.webViewLink };
                                        } else if (method === 'cloudinary') {
                                            result = await uploadToCloudinary(newFile.file, currentUser.id);
                                        } else {
                                            result = await uploadToSupabase(newFile.file, currentUser.id);
                                        }

                                        setUploadProgress(100);
                                        await addFsFile(newFile.file.name, newFile.size, newFile.folderId, newFile.file.type, result.provider, result.providerRef, result.downloadURL);

                                        // Reset
                                        setNewFile({ name: '', size: '', folderId: '', file: null });
                                        setStoragePref('auto');
                                        setUploadError('');
                                        setUploadProgress(0);
                                        setShowFsFileModal(false);
                                    } catch (err: any) {
                                        console.error(err);
                                        setUploadError(err.message || 'Upload failed');
                                        setUploadProgress(0);
                                    } finally {
                                        setIsSubmitting(false);
                                    }
                                }}
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMeetingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 animate-fade-in-up">
                        <h3 className="font-bold text-lg mb-4">Schedule Meeting</h3>
                        <div className="space-y-4">
                            <input title="Meeting Title" value={meetingData.title} onChange={e => setMeetingData({ ...meetingData, title: e.target.value })} placeholder="Meeting Title" className="w-full p-2 border rounded" />
                            <input title="Meeting Time" type="datetime-local" value={meetingData.time} onChange={e => setMeetingData({ ...meetingData, time: e.target.value })} className="w-full p-2 border rounded" />
                            <div className="border p-2 rounded max-h-32 overflow-y-auto">
                                <p className="text-xs font-bold text-slate-500 mb-2">Select Participants</p>
                                {employees.map(emp => (
                                    <label key={emp.id} className="flex items-center gap-2 text-sm mb-1">
                                        <input
                                            title="Participant"
                                            type="checkbox"
                                            checked={meetingData.participants.includes(emp.id)}
                                            onChange={e => {
                                                if (e.target.checked) setMeetingData({ ...meetingData, participants: [...meetingData.participants, emp.id] });
                                                else setMeetingData({ ...meetingData, participants: meetingData.participants.filter(id => id !== emp.id) });
                                            }}
                                        />
                                        {emp.name}
                                    </label>
                                ))}
                            </div>
                            <button onClick={handleScheduleMeeting} className="w-full bg-blue-600 text-white py-2 rounded font-bold">Schedule</button>
                            <button onClick={() => setShowMeetingModal(false)} className="w-full text-slate-500 py-2">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showTaskModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 animate-fade-in-up">
                        <h3 className="font-bold text-lg mb-4">Assign New Task</h3>
                        <div className="space-y-4">
                            <input title="Task Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task Title" className="w-full p-2 border rounded" />
                            <select title="Assignee" value={newTask.assigneeId} onChange={e => setNewTask({ ...newTask, assigneeId: e.target.value })} className="w-full p-2 border rounded">
                                <option value="">Select Assignee</option>
                                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                            </select>
                            <select title="Priority" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} className="w-full p-2 border rounded">
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <input type="date" title="Due Date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} className="w-full p-2 border rounded" />
                            <button onClick={handleAssignTask} className="w-full bg-slate-900 text-white py-2 rounded font-bold">Assign</button>
                            <button onClick={() => setShowTaskModal(false)} className="w-full text-slate-500 py-2">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;