import React from 'react';
import Button from '../components/Button';
import { Globe, Handshake, TrendingUp, MapPin } from 'lucide-react';

const Partners: React.FC = () => {
  return (
    <div className="w-full min-h-screen pt-32 pb-20 relative z-10">
      {/* Hero */}
      <section className="container mx-auto px-6 text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 mb-6">Partners & Impact</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          We are building the infrastructure for Africa's AI future. Join us in scaling education, access, and opportunity.
        </p>
      </section>

      {/* Global-Local Map Visualization */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
             {/* Animated Grid Background */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#48D1CC 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
             
             <div className="relative z-10 text-center mb-12">
               <h2 className="text-3xl font-bold font-display text-white mb-4">Our Global Footprint</h2>
               <p className="text-slate-400">Connecting African talent with global opportunity.</p>
             </div>

             <div className="relative max-w-4xl mx-auto h-[300px] md:h-[400px] border border-slate-700 rounded-2xl bg-slate-800/50 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                {/* Simulated Map SVG using dots */}
                <div className="absolute inset-0 opacity-30 flex flex-wrap gap-4 p-8 justify-center items-center">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-slate-600 rounded-full"></div>
                    ))}
                </div>
                
                {/* Active Hub Nodes */}
                <div className="absolute top-1/2 left-1/2 -translate-x-12 translate-y-8 flex flex-col items-center">
                  <div className="w-4 h-4 bg-brand-accent rounded-full animate-ping absolute"></div>
                  <div className="w-4 h-4 bg-brand-accent rounded-full relative z-10 border-2 border-slate-900 shadow-[0_0_15px_#FFD700]"></div>
                  <span className="text-white text-xs mt-2 font-medium bg-slate-900/80 px-2 py-1 rounded border border-slate-700">Nairobi Hub</span>
                </div>

                <div className="absolute top-1/3 left-1/2 -translate-x-32 flex flex-col items-center">
                   <div className="w-3 h-3 bg-brand-secondary rounded-full relative z-10 animate-pulse"></div>
                   <span className="text-slate-300 text-[10px] mt-1 bg-slate-900/80 px-2 py-1 rounded border border-slate-700">Lagos</span>
                </div>

                <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                   <div className="w-3 h-3 bg-sky-500 rounded-full relative z-10"></div>
                   <span className="text-slate-300 text-[10px] mt-1 bg-slate-900/80 px-2 py-1 rounded border border-slate-700">New York (Partner)</span>
                </div>
                
                <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
                   <div className="w-3 h-3 bg-sky-500 rounded-full relative z-10"></div>
                   <span className="text-slate-300 text-[10px] mt-1 bg-slate-900/80 px-2 py-1 rounded border border-slate-700">London (Partner)</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Tribal Divider */}
      <div className="w-full h-4 bg-tribal-gradient opacity-20 mb-20 max-w-4xl mx-auto rounded-full"></div>

      {/* Impact Metrics */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">Live Impact Stats</h2>
            <p className="text-slate-500">Real-time data from our learning platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 border border-slate-100 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all">
              <TrendingUp className="mx-auto mb-4 text-brand-primary" size={32} />
              <h3 className="text-4xl font-bold font-display mb-2 text-slate-900">10,000+</h3>
              <p className="text-slate-500">Learners Enrolled</p>
            </div>
            <div className="p-8 border border-slate-100 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all">
              <Zap className="mx-auto mb-4 text-brand-secondary" size={32} />
              <h3 className="text-4xl font-bold font-display mb-2 text-slate-900">50,000+</h3>
              <p className="text-slate-500">Hours Automated</p>
            </div>
            <div className="p-8 border border-slate-100 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all">
              <Handshake className="mx-auto mb-4 text-brand-accent" size={32} />
              <h3 className="text-4xl font-bold font-display mb-2 text-slate-900">500+</h3>
              <p className="text-slate-500">Jobs Created</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-6 max-w-4xl bg-white/50 backdrop-blur-sm p-12 rounded-3xl border border-slate-200 shadow-lg">
          <h2 className="text-4xl font-bold font-display text-slate-900 mb-6">Invest in the Future</h2>
          <p className="text-lg text-slate-600 mb-10">
            Whether you are an EdTech company, an NGO, or an angel investor, your partnership can accelerate the AI revolution in Africa.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button to="/contact" className="px-8">Become a Partner</Button>
             <Button to="/story" variant="outline">Read Our Vision</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper for icon
import { Zap } from 'lucide-react';

export default Partners;