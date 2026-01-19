import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, MapPin, Twitter, Linkedin, Send, Loader2, CheckCircle2, AlertCircle, Calendar, MessageSquare, Building, Clock, Wallet } from 'lucide-react';
import { NetworkVisual } from '../components/Visuals';
import { useAdmin } from '../context/AdminContext';

const Contact: React.FC = () => {
  const location = useLocation();
  const { addSubmission, addBooking, config } = useAdmin();
  const [activeTab, setActiveTab] = useState<'general' | 'booking'>('general');
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'General Inquiry',
    serviceType: 'automation',
    budget: 'starter',
    timeframe: 'immediate',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.intent) {
      const intent = location.state.intent;
      
      if (['automation_consult', 'automation_audit', 'partnership', 'enrollment'].includes(intent)) {
        setActiveTab('booking');
        let service = 'automation';
        if (intent === 'enrollment') service = 'education';
        if (intent === 'partnership') service = 'partnership';
        
        setFormState(prev => ({ 
          ...prev, 
          serviceType: service,
          subject: `Booking Request: ${service.charAt(0).toUpperCase() + service.slice(1)}` 
        }));
      } else {
        setActiveTab('general');
      }
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formspreeEndpoint = "https://formspree.io/f/mnjaagaa";
    
    // Prepare payload
    let finalMessage = formState.message;

    // Concatenate Booking Details into the main message body to ensure they appear in simple email clients
    if (activeTab === 'booking') {
        finalMessage += `\n\n--- BOOKING DETAILS ---\nCompany: ${formState.company || 'N/A'}\nService: ${formState.serviceType}\nBudget: ${formState.budget}\nTimeframe: ${formState.timeframe}`;
    }

    const payload: any = {
      name: formState.name,
      email: formState.email,
      message: finalMessage,
      _subject: activeTab === 'booking' ? `New Booking: ${formState.serviceType} - ${formState.name}` : `Contact Inquiry: ${formState.subject} - ${formState.name}`,
    };

    // Also send structured data for Formspree to parse if needed
    if (activeTab === 'booking') {
      payload.company = formState.company || 'Individual';
      payload.serviceType = formState.serviceType;
      payload.budget = formState.budget;
      payload.timeframe = formState.timeframe;
    } else {
      payload.subject = formState.subject;
    }

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Success!
        // Also save locally for Admin Dashboard visibility
        if (activeTab === 'booking') {
           addBooking({
             name: formState.name,
             email: formState.email,
             company: formState.company || 'Individual',
             serviceType: formState.serviceType,
             date: new Date().toISOString().split('T')[0]
           });
        }
        
        addSubmission({
          name: formState.name,
          email: formState.email,
          subject: activeTab === 'booking' ? `Booking: ${formState.serviceType}` : formState.subject,
          message: finalMessage
        });

        setSubmitted(true);
        setFormState(prev => ({ ...prev, message: '' }));
      } else {
        const data = await response.json();
        if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
          setError(data.errors.map((err: any) => err.message).join(", "));
        } else {
          setError("Oops! There was a problem submitting your form. Please try again.");
        }
      }
    } catch (err) {
      setError("Network connection error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 border border-slate-300 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Systems Online
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Communication Hub</h1>
          <p className="text-lg text-slate-600">
            Connect with our team for general inquiries or schedule a consultation to begin your architectural journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          {/* LEFT COLUMN: Contact Details & Visuals */}
          <div className="lg:col-span-4 space-y-8">
            {/* Info Card */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/30 transition-all duration-700"></div>
              <div className="absolute -bottom-12 -right-12 opacity-20 transform scale-125 pointer-events-none">
                 <NetworkVisual />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Building size={20} className="text-brand-secondary"/> HQ Details
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/10 text-brand-secondary">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email</p>
                      <a href={`mailto:${config.pages.contact.email}`} className="text-white hover:text-brand-secondary transition-colors break-all">{config.pages.contact.email}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/10 text-brand-secondary">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Base</p>
                      <p className="text-white">{config.pages.contact.address}</p>
                      <p className="text-slate-500 text-sm">Global Remote Operations</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                   <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-4">Network</p>
                   <div className="flex gap-3">
                     <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-brand-primary transition-colors"><Twitter size={18}/></a>
                     <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-brand-primary transition-colors"><Linkedin size={18}/></a>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Command Center Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="flex border-b border-slate-100">
                <button 
                  onClick={() => setActiveTab('general')}
                  className={`flex-1 py-6 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'general' ? 'bg-white text-brand-primary border-b-2 border-brand-primary' : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                >
                  <MessageSquare size={18} /> General Inquiry
                </button>
                <button 
                  onClick={() => setActiveTab('booking')}
                  className={`flex-1 py-6 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'booking' ? 'bg-white text-brand-primary border-b-2 border-brand-primary' : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                >
                  <Calendar size={18} /> Book Consultation
                </button>
              </div>

              <div className="p-8 md:p-10">
                {submitted ? (
                  <div className="text-center py-12 animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6 shadow-sm border border-green-100">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">
                      {activeTab === 'booking' 
                        ? "Your booking request has been securely transmitted. We will review the data and establish contact shortly." 
                        : "Transmission successful. We will respond to your inquiry soon."}
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="text-brand-primary font-medium hover:underline"
                    >
                      Start New Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formState.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all bg-slate-50 focus:bg-white"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all bg-slate-50 focus:bg-white"
                          placeholder="jane@company.com"
                        />
                      </div>
                    </div>

                    {activeTab === 'booking' && (
                      <div className="space-y-6 animate-fade-in-up">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Building size={14}/> Project Brief
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Company / Org</label>
                                <input
                                  type="text"
                                  name="company"
                                  value={formState.company}
                                  onChange={handleChange}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all bg-white"
                                  placeholder="Tech Corp Ltd."
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Service Interest</label>
                                <select
                                  name="serviceType"
                                  value={formState.serviceType}
                                  onChange={handleChange}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all bg-white"
                                >
                                  <option value="automation">Business Automation (n8n/AI)</option>
                                  <option value="education">Corporate Training</option>
                                  <option value="audit">Systems Audit</option>
                                  <option value="partnership">Partnership / Investment</option>
                                </select>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                  <Wallet size={14} className="text-slate-400"/> Estimated Budget
                                </label>
                                <select
                                  name="budget"
                                  value={formState.budget}
                                  onChange={handleChange}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all bg-white"
                                >
                                  <option value="starter">$1k - $5k (Starter)</option>
                                  <option value="growth">$5k - $20k (Growth)</option>
                                  <option value="enterprise">$20k+ (Enterprise)</option>
                                  <option value="tbd">Not decided yet</option>
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                  <Clock size={14} className="text-slate-400"/> Timeline
                                </label>
                                <select
                                  name="timeframe"
                                  value={formState.timeframe}
                                  onChange={handleChange}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all bg-white"
                                >
                                  <option value="immediate">Immediately</option>
                                  <option value="1_month">Within 1 Month</option>
                                  <option value="quarter">This Quarter</option>
                                  <option value="exploration">Just Exploring</option>
                                </select>
                             </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'general' && (
                       <div className="space-y-2 animate-fade-in-up">
                        <label className="text-sm font-semibold text-slate-700">Subject</label>
                        <select
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all bg-slate-50 focus:bg-white"
                        >
                          <option>General Inquiry</option>
                          <option>Student Support</option>
                          <option>Press / Media</option>
                          <option>Career</option>
                        </select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        {activeTab === 'booking' ? 'Additional Details / Goals' : 'Message'}
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formState.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none bg-slate-50 focus:bg-white"
                        placeholder={activeTab === 'booking' ? "Describe your current bottleneck or what you hope to achieve..." : "How can we help you today?"}
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                        <AlertCircle size={18} />
                        {error}
                      </div>
                    )}

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed group w-full md:w-auto ${activeTab === 'booking' ? 'bg-brand-primary hover:bg-blue-600 focus:ring-blue-500' : 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-900'}`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={20} className="mr-2 animate-spin" />
                            Transmitting...
                          </>
                        ) : (
                          <>
                            {activeTab === 'booking' ? 'Request Booking' : 'Send Message'}
                            <Send size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-center text-xs text-slate-400">
                      Protected by ArchiTech Security. We respect your privacy.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;