import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Lock, CreditCard, Smartphone, Mail, Globe, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import AuthModal from '../components/AuthModal';

const COUNTRY_CODES = [
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
];

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setPendingPurchase, user, isAuthenticated } = useUser();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Item Details
  const item = location.state?.item || {
    name: 'General Consultation',
    price: '$50.00',
    type: 'project'
  };

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    countryCode: '+254',
    phoneNumber: user?.phone || '',
    paymentMethod: 'mpesa'
  });

  const handlePayment = async () => {
    setLoading(true);
    // Simulate Payment Processing API Call
    await new Promise(resolve => setTimeout(resolve, 3000));
    setLoading(false);
    setStep('success');
    
    // Store purchase for the auth flow
    setPendingPurchase({
        itemName: item.name,
        price: item.price,
        type: item.type,
        ...formData
    });
  };

  const handleCreateAccount = () => {
      setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} triggerAction="client portal setup" />
      
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold font-display flex items-center gap-2">
                        <Lock size={18} className="text-brand-secondary"/> Secure Checkout
                    </h2>
                    <div className="text-xs text-slate-400 font-mono">ID: {Math.floor(Math.random()*100000)}</div>
                </div>

                {step === 'details' && (
                    <div className="p-8 space-y-6 animate-fade-in-up">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Client Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                <input 
                                    value={formData.fullName} 
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                                <input 
                                    type="email"
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                            <div className="flex gap-2">
                                <select 
                                    value={formData.countryCode}
                                    onChange={e => setFormData({...formData, countryCode: e.target.value})}
                                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary w-32"
                                >
                                    {COUNTRY_CODES.map(c => (
                                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                                    ))}
                                    <option value="+">Other (+)</option>
                                </select>
                                <input 
                                    value={formData.phoneNumber} 
                                    onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary"
                                    placeholder="712 345 678"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                onClick={() => setStep('payment')}
                                disabled={!formData.email || !formData.fullName || !formData.phoneNumber}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                Continue to Payment <ArrowRight size={18}/>
                            </button>
                        </div>
                    </div>
                )}

                {step === 'payment' && (
                    <div className="p-8 space-y-6 animate-fade-in-up">
                        <button onClick={() => setStep('details')} className="text-xs text-slate-500 hover:text-slate-900 mb-2">&larr; Back to Details</button>
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Select Payment Method</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setFormData({...formData, paymentMethod: 'mpesa'})}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'mpesa' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 hover:border-slate-300'}`}
                            >
                                <Smartphone size={24} />
                                <span className="font-bold">M-Pesa</span>
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, paymentMethod: 'paypal'})}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-300'}`}
                            >
                                <Globe size={24} />
                                <span className="font-bold">PayPal</span>
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, paymentMethod: 'skrill'})}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'skrill' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 hover:border-slate-300'}`}
                            >
                                <Lock size={24} />
                                <span className="font-bold">Skrill</span>
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, paymentMethod: 'card'})}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'card' ? 'border-slate-800 bg-slate-100 text-slate-900' : 'border-slate-100 hover:border-slate-300'}`}
                            >
                                <CreditCard size={24} />
                                <span className="font-bold">Card</span>
                            </button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            {formData.paymentMethod === 'mpesa' && (
                                <p className="text-sm text-slate-600">A payment prompt will be sent to <strong>{formData.countryCode} {formData.phoneNumber}</strong>. Please ensure your phone is unlocked.</p>
                            )}
                            {formData.paymentMethod === 'paypal' && (
                                <p className="text-sm text-slate-600">You will be redirected to PayPal to complete your secure transaction.</p>
                            )}
                            {formData.paymentMethod === 'card' && (
                                <p className="text-sm text-slate-600">Secure Stripe Encryption Active. Your card details are never stored on our servers.</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button 
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                            >
                                {loading ? <Loader2 className="animate-spin"/> : `Pay ${item.price} Now`}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-12 flex flex-col items-center text-center animate-fade-in-up">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-sm">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment Confirmed!</h2>
                        <p className="text-slate-500 mb-8 max-w-md">
                            Receipt #{Math.floor(Math.random()*999999)} has been sent to <strong>{formData.email}</strong>.
                        </p>
                        
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 w-full max-w-md mb-8">
                            <h4 className="font-bold text-slate-900 mb-2">Next Step: Access Your Hub</h4>
                            <p className="text-sm text-slate-600 mb-4">
                                Your service <strong>"{item.name}"</strong> is ready to be deployed. Create your account to access the Client Portal.
                            </p>
                            
                            {!isAuthenticated ? (
                                <button 
                                    onClick={handleCreateAccount}
                                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    Create Account & Access Portal
                                </button>
                            ) : (
                                <button 
                                    onClick={() => navigate('/portal')}
                                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    Go to Client Portal
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-6 flex justify-center gap-6 text-slate-400">
                <div className="flex items-center gap-1 text-xs"><Shield size={12}/> 256-bit SSL Encrypted</div>
                <div className="flex items-center gap-1 text-xs"><CheckCircle size={12}/> Money Back Guarantee</div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-32">
                <h3 className="font-bold text-slate-900 mb-6">Order Summary</h3>
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                    <div>
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500 capitalize">{item.type}</div>
                    </div>
                    <div className="font-bold text-slate-900">{item.price}</div>
                </div>
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>Subtotal</span>
                        <span>{item.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>Tax (16% VAT)</span>
                        <span>-</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                        <span>Total</span>
                        <span>{item.price}</span>
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
                    <Shield size={20} className="text-blue-500 shrink-0 mt-0.5"/>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        <strong>ArchiTech Promise:</strong> If we don't deliver within the agreed timeframe, you are eligible for a full refund.
                    </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;