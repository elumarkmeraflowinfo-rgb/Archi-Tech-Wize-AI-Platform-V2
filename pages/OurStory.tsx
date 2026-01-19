import React from 'react';
import { Quote, Target, Layers, Cpu, CheckCircle, Lightbulb, Shield, Briefcase } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const OurStory: React.FC = () => {
  const { config } = useAdmin();
  const content = config.pages.ourStory;

  return (
    <div className="w-full min-h-screen pt-32 pb-20 relative z-10">
      
      {/* Header */}
      <section className="container mx-auto px-6 text-center mb-20 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 mb-6">{content.heroTitle || "Our Story"}</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {content.heroSubtitle}
        </p>
      </section>

      {/* Narrative */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-8 md:p-16 rounded-3xl shadow-lg border border-slate-100 animate-fade-in-up">
            <div className="prose prose-lg prose-slate mx-auto">
              <p className="lead text-2xl font-light text-slate-800 mb-8 font-display">
                {content.introTitle} <span className="italic font-medium text-brand-primary">{content.introText1}</span>
              </p>
              
              <p className="mb-8 whitespace-pre-wrap text-slate-600 leading-8">
                {content.introText2}
              </p>

              <div className="my-14 p-10 bg-slate-50 rounded-3xl border-l-4 border-brand-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Quote size={120} />
                </div>
                <div className="relative z-10">
                    <Quote className="text-brand-primary mb-4" size={32} />
                    <p className="text-2xl font-medium text-slate-900 italic mb-4 font-display leading-tight">
                    "{content.quote}"
                    </p>
                </div>
              </div>

              {/* Milestone Timeline */}
              <div className="my-16 border-l-2 border-slate-200 pl-8 space-y-12">
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-slate-200 border-4 border-white shadow-sm"></div>
                  <h4 className="text-lg font-bold font-display text-slate-900">The Spark</h4>
                  <p className="text-slate-500 text-sm mb-2">2020</p>
                  <p className="text-slate-600">The realization that AI was not just a tool, but a fundamental shift in how value is created. Self-education begins in Nairobi.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-brand-secondary border-4 border-white shadow-sm"></div>
                  <h4 className="text-lg font-bold font-display text-slate-900">Overcoming Limits</h4>
                  <p className="text-slate-500 text-sm mb-2">2022</p>
                  <p className="text-slate-600">Mastering systems thinking without formal resources. Building the first complex automations on 3G networks.</p>
                </div>
                 <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-brand-primary border-4 border-white shadow-sm"></div>
                  <h4 className="text-lg font-bold font-display text-slate-900">ArchiTech-Wize Born</h4>
                  <p className="text-slate-500 text-sm mb-2">2024</p>
                  <p className="text-slate-600">Launch of the platform. A promise to scale wisdom and empower 1 million African builders.</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold font-display text-slate-900 mb-4">Overcoming Limitation Through Knowledge</h3>
              <p className="mb-6 text-slate-600 leading-relaxed">
                We believe that limitation is often just a lack of systems. By providing structured, high-quality, and accessible AI education, we are dismantling barriers. We are not just teaching people how to use AI; we are teaching them how to be architects of their own future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CEO / Leadership Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden mt-12">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-10 left-10 opacity-10"><Cpu size={120} /></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Image Column */}
            <div className="w-full lg:w-1/2">
               <div className="relative group">
                  {/* Decorative Frame */}
                  <div className="absolute -inset-6 border-2 border-dashed border-slate-700 rounded-3xl z-0 group-hover:border-brand-primary/50 transition-colors duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary to-brand-secondary transform rotate-3 rounded-3xl opacity-20 blur-sm group-hover:rotate-6 transition-transform duration-500"></div>
                  
                  {/* Image Grid */}
                  <div className="relative z-10 flex gap-4">
                     {/* Image 1 */}
                     <div className="w-1/2 relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] transform transition-transform duration-700 group-hover:-translate-y-2">
                         <img 
                           src={content.ceoImage1} 
                           alt="Erick Kibunja" 
                           className="w-full h-full object-cover"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                     </div>

                     {/* Image 2 */}
                     <div className="w-1/2 relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] mt-12 transform transition-transform duration-700 group-hover:translate-y-2">
                         <img 
                           src={content.ceoImage2} 
                           alt="Technology Focus" 
                           className="w-full h-full object-cover"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                         
                         {/* Floating Badge */}
                         <div className="absolute bottom-4 left-4 bg-brand-primary/90 px-3 py-1 rounded-lg backdrop-blur-md">
                            <p className="text-white text-xs font-bold uppercase tracking-wider">Visionary</p>
                         </div>
                     </div>
                  </div>

                  {/* Floating Icon */}
                  <div className="absolute -top-8 -right-8 bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-700 hidden md:block animate-float z-20">
                     <Layers className="text-brand-accent" size={32} />
                  </div>
               </div>
            </div>

            {/* Content Column */}
            <div className="w-full lg:w-1/2">
               <div className="flex items-center gap-3 mb-6">
                 <span className="h-px w-12 bg-brand-secondary"></span>
                 <span className="text-brand-secondary font-bold tracking-widest uppercase text-sm font-display">About The CEO</span>
               </div>
               
               <h2 className="text-3xl md:text-5xl font-bold font-display mb-8 leading-tight">
                 {content.ceoSectionTitle}
               </h2>

               <div className="space-y-6 text-slate-300 text-lg leading-relaxed mb-10">
                 <p className="whitespace-pre-wrap border-l-2 border-slate-700 pl-4">{content.ceoBio1}</p>
                 <p className="whitespace-pre-wrap">{content.ceoBio2}</p>
               </div>

               {/* Quote Card */}
               <div className="relative bg-slate-800/50 p-8 rounded-2xl border-l-4 border-brand-accent backdrop-blur-sm shadow-xl">
                 <Quote className="absolute top-8 right-8 text-slate-700 opacity-50" size={48} />
                 <p className="text-xl md:text-2xl font-serif italic text-white mb-6 relative z-10">
                   "{content.ceoQuote}"
                 </p>
                 
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary border border-brand-primary/30">
                      <Target size={24} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">Erick Kibunja</p>
                      <p className="text-sm text-slate-400">CEO & Founder, ArchiTech-Wize AI</p>
                    </div>
                 </div>
               </div>

               <div className="mt-8 text-slate-400 italic text-sm">
                  “Technology should work for people quietly in the background—so humans can focus on creativity, growth, and meaning.”
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY WORK WITH US SECTION */}
      <section className="py-24 bg-white relative">
         <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto bg-slate-50 rounded-[40px] p-8 md:p-16 border border-slate-200 shadow-xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-6">Why Work With Us</h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        Archi-Tech-Wize AI is not built on hype—it’s built on structure, intelligence, and accountability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:border-brand-primary/30 transition-all group">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <Lightbulb size={32} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Strategy First</h3>
                        <p className="text-slate-500 text-sm">Clear strategy before development. We don't just build; we plan for impact.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:border-brand-secondary/30 transition-all group">
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                            <Cpu size={32} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Empowering Automation</h3>
                        <p className="text-slate-500 text-sm">Automation that reduces friction, not control. Technology serving you, not the other way around.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:border-green-300/30 transition-all group">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                            <Shield size={32} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Responsible Scale</h3>
                        <p className="text-slate-500 text-sm">Solutions designed to scale responsibly. Built for the long haul, not just the launch.</p>
                    </div>
                </div>

                <div className="text-center space-y-6">
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Clients and partners trust Archi-Tech-Wize AI because the leadership understands both vision and implementation—ensuring ideas are not just imagined, but delivered with precision.
                    </p>
                    <div className="inline-block p-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full">
                        <div className="bg-white px-8 py-3 rounded-full flex items-center gap-2">
                            <Briefcase size={18} className="text-slate-900" />
                            <span className="font-bold text-slate-900">If you’re looking for a long-term digital partner—not just a service provider—you’re in the right place.</span>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default OurStory;