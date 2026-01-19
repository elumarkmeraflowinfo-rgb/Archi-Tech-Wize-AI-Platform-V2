import React, { useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Database, Server, Code, Wifi, Cpu, Globe, ArrowUpRight } from 'lucide-react';

// 1. Animated Terminal Window
export const TerminalVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { lowBandwidth } = useTheme();
  
  if (lowBandwidth) return (
     <div className={`bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-700 ${className} p-4 font-mono text-sm text-sky-400`}>
         <div>&gt; System Initialized</div>
         <div className="text-slate-400">&gt; Low bandwidth mode active.</div>
         <div className="text-green-400">&gt; Core modules ready.</div>
     </div>
  );

  return (
    <div className={`bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 ${className} animate-float`}>
      <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-4 text-xs text-slate-400 font-mono">wize-agent.py</div>
      </div>
      <div className="p-4 font-mono text-xs md:text-sm text-sky-400 space-y-2 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-900/10 to-transparent animate-scan pointer-events-none h-full"></div>
        <div className="flex gap-2">
          <span className="text-brand-accent">➜</span>
          <span className="text-white">init_system(user="student")</span>
        </div>
        <div className="text-slate-400 ml-4">Loading modules...</div>
        <div className="text-slate-400 ml-4">[OK] Neural Network</div>
        <div className="text-slate-400 ml-4">[OK] Knowledge Graph</div>
        <div className="flex gap-2">
          <span className="text-brand-accent">➜</span>
          <span className="text-white">connect_platform(target=["whatsapp", "github", "excel"])</span>
        </div>
        <div className="text-brand-secondary ml-4 blink">Integrations active...</div>
      </div>
    </div>
  );
};

// 2. Animated Node Network
export const NetworkVisual: React.FC = () => {
  const { lowBandwidth } = useTheme();
  
  if (lowBandwidth) return <Globe className="text-brand-primary opacity-20" size={200} />;

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Central Hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center z-20 border-2 border-brand-primary">
        <Server className="text-brand-primary" size={24} />
      </div>
      
      {/* Orbiting Nodes */}
      {[0, 1, 2, 3].map((i) => (
        <div 
          key={i}
          className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2"
          style={{ 
            animation: `spin-slow ${8 + i * 2}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}` 
          }}
        >
          <div className="absolute -top-4 left-1/2 w-8 h-8 bg-white rounded-full shadow-md border border-slate-200 flex items-center justify-center">
            {i === 0 ? <Database size={14} className="text-brand-secondary"/> : 
             i === 1 ? <Wifi size={14} className="text-brand-accent"/> :
             i === 2 ? <Code size={14} className="text-sky-500"/> :
             <Cpu size={14} className="text-brand-primary"/>}
          </div>
        </div>
      ))}
      
      {/* Connecting Lines (Simulated with massive circles) */}
      <div className="absolute inset-0 rounded-full border border-dashed border-slate-300 opacity-50"></div>
      <div className="absolute inset-4 rounded-full border border-dashed border-slate-200 opacity-50"></div>
    </div>
  );
};

// 3. Floating Workflow Card
export const WorkflowCard: React.FC<{ icon: React.ReactNode, title: string, delay?: string }> = ({ icon, title, delay = '0s' }) => {
  const { lowBandwidth } = useTheme();

  return (
    <div 
      className={`bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 w-48 ${!lowBandwidth ? 'animate-float' : ''}`}
      style={{ animationDelay: delay }}
    >
      <div className="p-2 bg-slate-50 rounded-lg text-brand-primary">
        {icon}
      </div>
      <span className="font-medium text-slate-700 text-sm">{title}</span>
    </div>
  );
};

// 4. Tech Stack Marquee
export const TechMarquee: React.FC = () => {
    const { lowBandwidth } = useTheme();
    
    // Updated list to include Socials, Excel/Docs, Community platforms, and GitHub
    const techs = [
      "Python", "n8n", "OpenAI", "React", "PostgreSQL", 
      "GitHub", "Excel", "Google Sheets", "LinkedIn", "WhatsApp", 
      "Facebook", "Instagram", "YouTube", "Discord", "Skool", 
      "Docker", "AWS", "Zapier"
    ];
    
    return (
        <div className="w-full overflow-hidden bg-white/50 backdrop-blur-sm border-y border-slate-100 py-6">
            <div className={`flex gap-12 whitespace-nowrap ${!lowBandwidth ? 'animate-scroll' : 'overflow-x-auto no-scrollbar'}`}>
                {[...techs, ...techs].map((tech, i) => ( // Duplicate for seamless loop
                    <div key={i} className="flex items-center gap-2 text-slate-400 font-bold text-xl uppercase tracking-wider font-display">
                         <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                         {tech}
                    </div>
                ))}
            </div>
        </div>
    );
};

// 5. HD Tilt Card
export const TiltCard: React.FC<{ title: string; image: string; subtitle: string; className?: string }> = ({ title, image, subtitle, className = '' }) => {
  const { lowBandwidth } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lowBandwidth || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      className={`relative h-64 md:h-80 rounded-2xl overflow-hidden cursor-pointer group ${className} shadow-lg hover:shadow-2xl transition-shadow duration-300`}
      onMouseMove={(e) => { setIsHovering(true); handleMouseMove(e); }}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: !lowBandwidth ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)` : 'none',
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Fallback color if image fails to load or for very low bandwidth */}
      <div className="absolute inset-0 bg-slate-800 z-0"></div>
      
      {!lowBandwidth && (
         <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500 scale-105" loading="lazy" />
      )}
      
      {/* Glare Effect */}
      {isHovering && !lowBandwidth && (
        <div 
          className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-tr from-transparent via-white to-transparent"
          style={{ transform: `translateX(${rotate.y * 2}%) translateY(${rotate.x * 2}%)` }}
        />
      )}

      {/* Content */}
      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent">
        <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
          <p className="text-brand-secondary text-xs font-bold uppercase tracking-widest mb-2">{subtitle}</p>
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold text-white leading-tight max-w-[80%] font-display">{title}</h3>
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};