import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Bot, Wifi, LogIn, Star } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  targetId?: string; // ID of element to point to (optional, used for positioning)
  icon: React.ReactNode;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const steps: Step[] = [
  {
    id: 1,
    title: "Welcome to ArchiTech-Wize AI",
    description: "We're building the future of AI education in Africa. Let's take a quick tour of your new workspace.",
    icon: <Star className="text-yellow-400" size={24} />,
    position: 'center'
  },
  {
    id: 2,
    title: "Meet Wize-Agent",
    description: "Your personal AI guide. Ask for learning paths, automation advice, or partnerships instantly.",
    targetId: 'hero-agent-card',
    icon: <Bot className="text-blue-400" size={24} />,
    position: 'center' // Simplified for reliability
  },
  {
    id: 3,
    title: "Low Bandwidth Mode",
    description: "Slow internet? Toggle 'Lite Mode' here to remove heavy animations and speed up loading.",
    targetId: 'low-bandwidth-toggle',
    icon: <Wifi className="text-green-400" size={24} />,
    position: 'top-right'
  },
  {
    id: 4,
    title: "Client Portal",
    description: "Already working with us? Log in here to access your dashboard and project files.",
    targetId: 'client-login-btn',
    icon: <LogIn className="text-purple-400" size={24} />,
    position: 'bottom-right'
  }
];

const OnboardingTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('aw-onboarding-complete');
    if (!hasSeenTutorial) {
      // Delay slightly for initial render
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('aw-onboarding-complete', 'true');
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm pointer-events-auto transition-opacity duration-500"></div>

      {/* Tutorial Card */}
      <div className={`
        pointer-events-auto bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fade-in-up transform transition-all duration-500
        ${step.position === 'top-right' ? 'md:absolute md:top-24 md:right-24' : ''}
        ${step.position === 'bottom-right' ? 'md:absolute md:bottom-24 md:right-24' : ''}
      `}>
        <button 
          onClick={handleComplete}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-200">
            {step.icon}
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {step.description}
          </p>

          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              {steps.map((s, idx) => (
                <div 
                  key={s.id} 
                  className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? 'bg-brand-primary' : 'bg-slate-200'}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;