import React, { useState } from 'react';
import Button from '../components/Button';
import { BookOpen, Code, Cpu, Share2, Check, Award, Terminal, Calendar, Users, Video, Clock, Timer, Rocket, X, MessageSquare, Send, Search } from 'lucide-react';
import { useAdmin, Service } from '../context/AdminContext';
import { useUser } from '../context/UserContext';
import AuthModal from '../components/AuthModal';
import { useNavigate } from 'react-router-dom';

type FilterType = 'all' | 'no-code' | 'automation' | 'core-ai';

const Programs: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { services, addProgramComment } = useAdmin();
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  
  // Modal State
  const [selectedProgram, setSelectedProgram] = useState<Service | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const filteredPrograms = services.filter(p => {
      const matchesFilter = activeFilter === 'all' || p.category === activeFilter;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
  });

  const getIcon = (category: string) => {
    switch(category) {
      case 'core-ai': return <Cpu className="text-brand-primary" size={28} />;
      case 'automation': return <Code className="text-brand-secondary" size={28} />;
      case 'no-code': return <Share2 className="text-indigo-500" size={28} />;
      default: return <BookOpen className="text-pink-500" size={28} />;
    }
  };

  const getColor = (category: string) => {
    switch(category) {
       case 'core-ai': return "border-sky-200 hover:border-brand-primary hover:shadow-sky-100";
       case 'automation': return "border-amber-200 hover:border-brand-secondary hover:shadow-amber-100";
       case 'no-code': return "border-indigo-200 hover:border-indigo-400 hover:shadow-indigo-100";
       default: return "border-pink-200 hover:border-pink-400 hover:shadow-pink-100";
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Live Cohort': return <Users size={14} />;
      case '1-on-1': return <Video size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const handleEnroll = (program: Service) => {
      navigate('/checkout', {
          state: {
              item: {
                  name: program.title,
                  price: program.priceUsd,
                  type: 'course'
              }
          }
      });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram || !newComment.trim()) return;
    
    if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
    }

    const commentData = {
        user: user?.name || 'Anonymous',
        text: newComment,
    };

    addProgramComment(selectedProgram.id, commentData);
    setNewComment('');
    
    // Optimistically update view
    setSelectedProgram(prev => prev ? ({
        ...prev,
        comments: [...(prev.comments || []), { ...commentData, id: 'temp', date: new Date().toISOString() }]
    }) : null);
  };

  return (
    <div className="w-full min-h-screen">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} triggerAction="post a question" />

      {/* Hero Section */}
      <section className="pt-32 pb-12 text-center container mx-auto px-6 bg-sunrise-gradient">
        <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 mb-6 tracking-tight">The Academy</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
          Curriculum designed for the real world. Practical, scalable, and verifiable skills for the AI age.
        </p>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search skills, titles, technologies..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-slate-200 outline-none focus:ring-2 focus:ring-brand-primary bg-white/80 backdrop-blur-sm shadow-sm"
                />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'core-ai', label: 'Core AI' },
                { id: 'automation', label: 'Automation' },
                { id: 'no-code', label: 'No-Code' },
              ].map((filter) => (
                 <button
                   key={filter.id}
                   onClick={() => setActiveFilter(filter.id as FilterType)}
                   className={`px-4 py-2 rounded-full text-sm font-bold transition-all font-display tracking-wide ${
                     activeFilter === filter.id
                       ? 'bg-slate-900 text-white shadow-lg'
                       : 'bg-white/80 text-slate-600 border border-slate-200 hover:border-brand-secondary hover:text-brand-secondary'
                   }`}
                 >
                   {filter.label}
                 </button>
              ))}
            </div>
        </div>
      </section>

      {/* Tribal Divider */}
      <div className="w-full h-4 bg-tribal-gradient opacity-20 mb-12"></div>

      <section className="pb-24 container mx-auto px-6">
        {filteredPrograms.length === 0 ? (
          <div className="text-center text-slate-400 py-12">No programs found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredPrograms.map((prog) => (
              <div 
                key={prog.id} 
                className={`bg-white/90 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${getColor(prog.category)} ${prog.featured ? 'shadow-lg ring-1 ring-brand-secondary/30 relative overflow-hidden' : ''} flex flex-col group`}
              >
                {/* Featured Ribbon */}
                {prog.featured && (
                    <div className="absolute top-0 right-0">
                        <div className="bg-gradient-to-l from-brand-secondary to-amber-500 text-white text-[10px] font-bold px-8 py-1 transform rotate-45 translate-x-8 translate-y-4 shadow-sm uppercase tracking-wider font-display">
                            Featured
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                    {getIcon(prog.category)}
                  </div>
                  <div className="flex flex-col items-end gap-2 mt-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600 uppercase tracking-wide border border-slate-200">
                      {prog.level}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold font-display text-slate-900 mb-3 leading-tight group-hover:text-brand-primary transition-colors">{prog.title}</h3>
                <p className="text-slate-500 mb-6 flex-grow leading-relaxed text-sm line-clamp-3">{prog.description}</p>
                
                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      {getModeIcon(prog.mode)} {prog.mode}
                   </div>
                   <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      <Timer size={14} className="text-slate-400" /> {prog.duration || 'Flexible'}
                   </div>
                </div>

                {/* Tech Stack Preview */}
                {prog.technologies && prog.technologies.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                      {prog.technologies.slice(0, 3).map((tech, tIdx) => (
                        <span key={tIdx} className="px-2 py-1 bg-white text-slate-500 text-[10px] rounded border border-slate-100 font-mono">
                          {tech}
                        </span>
                      ))}
                      {prog.technologies.length > 3 && <span className="text-[10px] text-slate-400 self-center">+{prog.technologies.length - 3} more</span>}
                  </div>
                )}

                <div className="mt-auto border-t border-slate-100 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <span className="block text-2xl font-bold font-display text-slate-900">{prog.priceUsd}</span>
                            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">{prog.priceKsh}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setSelectedProgram(prog)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            Details
                        </button>
                        <button onClick={() => handleEnroll(prog)} className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors shadow-md ${prog.featured ? 'bg-slate-900 hover:bg-brand-primary' : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900'}`}>
                          Enroll
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PROGRAM DETAILS MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col relative animate-fade-in-up border border-slate-200">
                <button onClick={() => setSelectedProgram(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10">
                    <X size={20} className="text-slate-600" />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-8 md:p-12">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                {getIcon(selectedProgram.category)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold font-display text-slate-900 mb-2">{selectedProgram.title}</h2>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full">{selectedProgram.level}</span>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{selectedProgram.mode}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="md:col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold font-display text-slate-900 mb-3">Overview</h3>
                                    <p className="text-slate-600 leading-relaxed">{selectedProgram.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold font-display text-slate-900 mb-3 flex items-center gap-2"><Award size={18}/> Skills You'll Master</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedProgram.skills.map((skill, idx) => (
                                            <div key={idx} className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <Check size={16} className="text-green-500 mt-0.5 shrink-0"/>
                                                <span className="text-sm text-slate-700 font-medium">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedProgram.prerequisites && (
                                    <div>
                                        <h3 className="text-lg font-bold font-display text-slate-900 mb-3">Prerequisites</h3>
                                        <ul className="list-disc list-inside text-slate-600 space-y-1 ml-2">
                                            {selectedProgram.prerequisites.map((req, idx) => (
                                                <li key={idx}>{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-1 space-y-6">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 font-display">Program Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <Timer size={18} className="text-brand-secondary"/> 
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Duration</p>
                                                <p className="font-medium">{selectedProgram.duration || 'Self-Paced'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <Calendar size={18} className="text-brand-secondary"/>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Start Date</p>
                                                <p className="font-medium">{selectedProgram.startDate || 'Immediate Access'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <Terminal size={18} className="text-brand-secondary"/>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Tech Stack</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {selectedProgram.technologies.map(t => (
                                                        <span key={t} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-slate-200">
                                        <div className="mb-4">
                                            <span className="block text-3xl font-bold font-display text-slate-900">{selectedProgram.priceUsd}</span>
                                            <span className="text-sm text-slate-500">{selectedProgram.priceKsh}</span>
                                        </div>
                                        <Button onClick={() => handleEnroll(selectedProgram)} className="w-full">Secure Spot</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Q&A Section */}
                        <div className="border-t border-slate-100 pt-12">
                            <h3 className="text-2xl font-bold font-display text-slate-900 mb-8 flex items-center gap-2">
                                <MessageSquare className="text-brand-primary" /> Q&A / Discussion
                            </h3>

                            <div className="space-y-6 mb-10">
                                {(!selectedProgram.comments || selectedProgram.comments.length === 0) && (
                                    <p className="text-slate-400 italic bg-slate-50 p-6 rounded-xl text-center">
                                        No questions yet. Be the first to ask about this program!
                                    </p>
                                )}
                                {selectedProgram.comments?.map((comment, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                                                    {comment.user.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900 text-sm">{comment.user}</span>
                                            </div>
                                            <span className="text-xs text-slate-400">{new Date(comment.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-slate-600 text-sm pl-10">{comment.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <form onSubmit={handleAddComment} className="flex gap-4">
                                    <input 
                                        required
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder={isAuthenticated ? "Ask a question about this program..." : "Login to ask a question..."}
                                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none bg-white"
                                    />
                                    <button 
                                        type="submit" 
                                        className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Programs;