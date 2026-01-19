
import React from 'react';
import { Target, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const Solutions = () => {
  const segments = [
    {
      id: 'founders',
      title: "For Founders",
      icon: <Target size={32} className="text-blue-600" />,
      desc: "Launch your MVP and brand identity in days, not months. No tech debt.",
      features: ["Instant Landing Page", "Investor Pitch Deck AI", "Brand Kit Generation", "Waitlist Automation"]
    },
    {
      id: 'smes',
      title: "For SMEs",
      icon: <Users size={32} className="text-green-600" />,
      desc: "Operational efficiency on autopilot. Reduce overhead and automate admin.",
      features: ["CRM Integration", "Invoice Automation", "Support Chatbots", "Staff Onboarding AI"]
    },
    {
      id: 'creators',
      title: "For Creators",
      icon: <Zap size={32} className="text-purple-600" />,
      desc: "Monetize your audience with digital products and automated funnels.",
      features: ["Course Builder", "Newsletter Automation", "Social Content AI", "Digital Storefront"]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Solutions for every stage.</h1>
          <p className="text-xl text-slate-600">Whether you're starting solo or scaling a team, we have a system for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {segments.map(seg => (
            <div key={seg.id} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {seg.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{seg.title}</h3>
              <p className="text-slate-500 mb-8">{seg.desc}</p>
              <ul className="space-y-3 mb-8">
                {seg.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <CheckCircle size={16} className="text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Button to="/portal" className="w-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-900 hover:text-white">Build for {seg.title.replace('For ', '')}</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Solutions;