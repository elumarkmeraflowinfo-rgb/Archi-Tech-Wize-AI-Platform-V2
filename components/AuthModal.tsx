import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { X, Mail, ArrowRight, Check, Lock, Sparkles, Globe, Shield, RefreshCw } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    triggerAction?: string;
}

type AuthStep = 'email-entry' | 'profile-setup' | 'verification-pending' | 'success';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, triggerAction }) => {
    const { signup, login, loginWithGoogle, isVerificationSent, pendingPurchase } = useUser();
    const navigate = useNavigate();
    const [step, setStep] = useState<AuthStep>('email-entry');
    const [isLoginMode, setIsLoginMode] = useState(!pendingPurchase);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const headerBgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (headerBgRef.current) {
            headerBgRef.current.style.backgroundImage = 'radial-gradient(#48D1CC 2px, transparent 2px)';
            headerBgRef.current.style.backgroundSize = '20px 20px';
        }
    }, [isOpen]);

    // Form State
    const [email, setEmail] = useState(pendingPurchase?.email || '');
    const [password, setPassword] = useState('');

    // Profile State
    const [profile, setProfile] = useState({
        name: pendingPurchase?.fullName || '',
        phone: pendingPurchase?.phoneNumber || '',
        gender: '',
        ageRange: '',
        role: '',
        primaryGoal: '',
        interests: [] as string[]
    });

    if (!isOpen) return null;

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isLoginMode) {
            const success = await login(email, password);
            if (success) {
                onClose();
                if (!triggerAction || triggerAction.includes('client') || triggerAction.includes('portal')) {
                    navigate('/portal');
                }
            } else {
                if (isVerificationSent) {
                    setStep('verification-pending');
                } else {
                    setError("Login failed. Check credentials/verification.");
                }
            }
        } else {
            setStep('profile-setup');
        }
        setLoading(false);
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const success = await signup(email, password, profile);
        if (success) {
            setStep('verification-pending');
        } else {
            setError("Sign up failed. User might exist.");
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const success = await loginWithGoogle();
        if (success) {
            onClose();
            navigate('/portal');
        }
        setLoading(false);
    };

    const handleAdminBackdoor = () => {
        onClose();
        navigate('/admin');
    };

    const handleAdminClientTestBackdoor = () => {
        // Mock log into portal as admin
        onClose();
        navigate('/portal');
        alert("ADMIN OVERRIDE: Entering Client Portal as System Administrator");
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Decorative Header */}
                <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-800 relative flex items-center justify-center">
                    <div ref={headerBgRef} className="absolute inset-0 opacity-20"></div>
                    <button onClick={onClose} title="Close" aria-label="Close" className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-20"><X size={24} /></button>

                    <div className="text-center z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-white/20">
                            <Sparkles className="text-brand-accent" size={24} />
                        </div>
                        <h2 className="text-white font-bold text-xl">
                            {step === 'verification-pending' ? 'Verify Your Email' : (pendingPurchase ? 'Complete Your Profile' : (isLoginMode ? 'Client Portal Login' : 'Guest Registration'))}
                        </h2>
                        <p className="text-slate-400 text-xs mt-1">
                            {step === 'verification-pending' ? 'Check your inbox to activate account' : (pendingPurchase ? 'Finalize account to access your purchase' : (isLoginMode ? 'Access your dashboard' : (triggerAction ? `Sign up to ${triggerAction}` : 'Create your account')))}
                        </p>
                    </div>
                </div>

                <div className="p-8">
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs rounded-lg border border-red-100 flex items-center gap-2"><Shield size={14} /> {error}</div>}

                    {step === 'email-entry' && (
                        <div className="space-y-4">
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-900"
                                            placeholder="you@example.com"
                                            readOnly={!!pendingPurchase}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-900"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <RefreshCw className="animate-spin" size={18} /> : (isLoginMode ? 'Login' : 'Next Step')} <ArrowRight size={18} />
                                </button>
                            </form>

                            <div className="relative flex items-center justify-center py-2">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                                <span className="relative bg-white px-3 text-xs text-slate-500 uppercase font-bold">Or</span>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Globe className="text-blue-500" size={18} /> Continue with Google
                            </button>

                            {!pendingPurchase && (
                                <div className="text-center text-sm text-slate-500 mt-4">
                                    {isLoginMode ? "New here? " : "Already have an account? "}
                                    <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="text-brand-primary font-bold hover:underline">
                                        {isLoginMode ? 'Register' : 'Login'}
                                    </button>
                                </div>
                            )}

                            {/* Hidden Admin Footer */}
                            <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity">
                                <button onClick={handleAdminBackdoor} className="text-[10px] text-slate-300 hover:text-slate-500 font-mono">ROOT_SENTINEL_ACCESS</button>
                                <button onClick={handleAdminClientTestBackdoor} className="text-[10px] text-slate-300 hover:text-slate-500 font-mono">PORTAL_SIM_OVERRIDE</button>
                            </div>
                        </div>
                    )}

                    {step === 'profile-setup' && (
                        <form onSubmit={handleProfileSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="text-center mb-2">
                                <h3 className="font-bold text-slate-900">Setup your Profile</h3>
                                <p className="text-xs text-slate-500">We use this to personalize your portal.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 block mb-1">Full Name</label>
                                    <input required value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 block mb-1">Phone</label>
                                    <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900" placeholder="+254..." />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 block mb-1">Age Group</label>
                                    <select required title="Age Group" value={profile.ageRange} onChange={e => setProfile({ ...profile, ageRange: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900">
                                        <option value="">Select...</option>
                                        <option value="18-24">18-24</option>
                                        <option value="25-34">25-34</option>
                                        <option value="35-44">35-44</option>
                                        <option value="45+">45+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 block mb-1">Gender</label>
                                    <select required title="Gender" value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900">
                                        <option value="">Select...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-1">Primary Goal</label>
                                <select required title="Primary Goal" value={profile.primaryGoal} onChange={e => setProfile({ ...profile, primaryGoal: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900">
                                    <option value="">What brings you here?</option>
                                    <option value="Upskilling">Upskilling / Learning AI</option>
                                    <option value="Startup">Building a Startup</option>
                                    <option value="Freelancing">Freelancing / Agency</option>
                                    <option value="Corporate">Corporate Efficiency</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={18} /> : (pendingPurchase ? 'Register & Purchase' : 'Create Account')}
                            </button>
                            <button type="button" onClick={() => setStep('email-entry')} className="w-full text-xs text-slate-400 hover:text-slate-600">Back</button>
                        </form>
                    )}

                    {step === 'verification-pending' && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4 animate-pulse">
                                <Mail size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Check Your Email</h3>
                            <p className="text-slate-500 text-sm mb-6">We've sent a verification link to <span className="font-bold">{email}</span>. Please click it to activate your account.</p>
                            <button onClick={onClose} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Got it</button>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4 scale-up">
                                <Check size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Success!</h3>
                            <p className="text-slate-500">Redirecting you to your portal...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;