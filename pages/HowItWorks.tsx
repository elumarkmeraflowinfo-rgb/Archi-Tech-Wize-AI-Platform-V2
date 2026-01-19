
import React from 'react';
import { Layers, Zap, Brain, Rocket, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Layers size={48} className="text-blue-500" />,
            title: "1. Defined Foundation",
            desc: "We don't just give you tools; we map your business DNA. You input your industry and goals, and our core engine structures your entire digital presence automatically."
        },
        {
            icon: <Brain size={48} className="text-purple-500" />,
            title: "2. Visual Intelligence",
            desc: "Our AI generates your brand assets, website layout, and content strategy in seconds—tailored to your market's psychology."
        },
        {
            icon: <Zap size={48} className="text-amber-500" />,
            title: "3. Automated Logistics",
            desc: "Pre-built workflows for lead capture, emails, and CRM are installed instantly. No manual 'gluing' of scattered SaaS tools required."
        },
        {
            icon: <Rocket size={48} className="text-green-500" />,
            title: "4. Activation & Scale",
            desc: "Launch with a click. Then, use our integrated AI Agent Fleet to handle support and sales while you focus on growth."
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-5xl font-bold text-slate-900 mb-6 mt-16">System-First. Not Tool-First.</h1>
                    <p className="text-xl text-slate-600">
                        Most platforms hand you a hammer and say "build a house."<br />
                        <span className="text-blue-600 font-bold">ArchiTech-Wize AI</span> generates the blueprint, pours the foundation, and frames the walls for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 relative">
                    {/* Connector Line */}
                    <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -z-10"></div>

                    {steps.map((s, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl hover:-translate-y-2 transition-transform">
                            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-slate-100">
                                {s.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">{s.title}</h3>
                            <p className="text-slate-500 text-center leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-24 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-8">Stop stitching. Start scaling.</h2>
                        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                            Join the founders who switched from "Chaos Stack" to the Unified Sovereign System.
                        </p>
                        <Link to="/portal" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-blue-900/20">
                            Build My Business System <Rocket size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
