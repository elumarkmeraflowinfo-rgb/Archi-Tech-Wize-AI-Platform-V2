import React, { useState } from 'react';
import { aiService } from '../src/services/aiService';
import { Search, Sparkles, Lock, Copy, Check, Terminal, ShoppingBag, Zap, Wand2, FileText, Code, Palette, Briefcase, Globe } from 'lucide-react';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import AuthModal from '../components/AuthModal';

// --- DATA: MASTER PROMPTS & LIBRARY ---

interface Prompt {
   id: string;
   title: string;
   description: string;
   category: string;
   isFree: boolean;
   priceUsd?: string;
   priceKsh?: string;
   content: string;
}

const masterPrompts: Prompt[] = [
   {
      id: 'm1',
      title: 'Restaurant Website Master Architect',
      description: 'A comprehensive prompt to build a high-converting restaurant website with admin dashboard, menu management, and reservation system.',
      category: 'Business',
      isFree: false,
      priceUsd: '$12',
      priceKsh: 'KSH 1,500',
      content: `You are a Senior Full-Stack Website Builder, UX Designer, Conversion Copywriter, and No-Code Systems Architect. 
Build a modern, high-converting restaurant website based on the details below. 
Website Name: [[RESTAURANT NAME]] 
Restaurant Type: [[Cuisine / Casual / Fine Dining / Cafe / Fast Food]] 
Primary Goal: Table reservations & customer inquiries 
Target Audience: [[Local diners / tourists / families / professionals]] 
Brand Style: [[Modern / Elegant / Casual / Luxury]] 

FRONTEND REQUIREMENTS 
Create a professional, mobile-first restaurant website with: 
• Hero section with signature dish imagery, tagline, and “Book a Table” CTA 
• About section with restaurant story & chef introduction 
• Menu section (categorized, image-based, prices editable) 
• Popular dishes / chef recommendations 
• Reservation call-to-action block 
• Testimonials & Google review snippets 
• Location & opening hours 
• FAQ (dietary options, parking, bookings) 
• Footer with contact info, social links, and map 
• Image for menu should match 

BACKEND & ADMIN DASHBOARD 
Include an admin panel with: 
• Menu manager (add/edit/remove dishes, prices, images) 
• Reservation system (Date, time, guests, Admin confirmation & email notifications) 
• Contact form submissions 
• Opening hours editor 
• SEO settings per page 
• Media library 
• Design customization (colors, fonts, layout) 
• Built-in CMS allowing the restaurant owner to create and manage blog posts, announcements, or events.

DESIGN & TECH 
• Fully responsive 
• Fast loading 
• Clean navigation 
• SEO-optimized 
• Accessible typography 
Generate the complete website UI, backend logic, and admin dashboard. The site must be fully editable and production-ready.`
   },
   {
      id: 'm2',
      title: 'Medical Clinic Trust Architect',
      description: 'HIPAA-aware website structure for doctors and clinics, focusing on trust, patient booking, and service clarity.',
      category: 'Health',
      isFree: false,
      priceUsd: '$15',
      priceKsh: 'KSH 2,000',
      content: `You are a Senior Medical Website Architect, UX Designer, and HIPAA-aware No-Code Expert. Build a professional healthcare website with trust-focused design and booking functionality. 
Website Name: [[CLINIC NAME]] 
Specialty: [[General Practice / Dental / Dermatology / Specialist]] 
Primary Goal: Appointment bookings 
Target Audience: Patients & families 
Brand Style: Clean, calm, trustworthy 

FRONTEND REQUIREMENTS 
Include: 
• Hero section with doctor credibility and “Book Appointment” CTA 
• Services / treatments overview 
• Doctor profile(s) with qualifications 
• Patient benefits & care approach 
• Appointment CTA section 
• Testimonials 
• FAQ (insurance, availability, first visit)
• Contact & location section 
• Professional medical footer 

BACKEND & ADMIN DASHBOARD 
Admin must manage: 
• Appointment booking system (Date, time, service, doctor, Confirmation & notifications) 
• Services & pricing 
• Doctor profiles 
• Patient inquiries 
• SEO controls 
• Page & content editor 
• Social links 
• CMS system enabling staff to create and manage health articles.

DESIGN & TECH 
• Mobile-first 
• Accessibility compliant 
• Secure form handling 
• SEO-ready structure 
Generate the full frontend, backend, and admin dashboard. Fully editable and ready for production.`
   },
   {
      id: 'm3',
      title: 'SaaS Growth Engine',
      description: 'The ultimate SaaS landing page prompt. Optimized for free-trial conversions, feature showcasing, and pricing psychology.',
      category: 'SaaS',
      isFree: false,
      priceUsd: '$15',
      priceKsh: 'KSH 2,000',
      content: `You are a Senior SaaS Product Designer, Growth Marketer, and Full-Stack No-Code Engineer.
Build a high-converting SaaS marketing website. 
Website Name: [[SAAS NAME]] 
Product Type: [[Automation / AI / Productivity / Analytics]] 
Primary Goal: Free trials & signups 
Target Audience: [[Founders / Teams / Enterprises]] 
Brand Style: Modern, tech-forward 

FRONTEND REQUIREMENTS 
Include: 
• Hero with value proposition & CTA (“Start Free Trial”) 
• How it works (step-based) 
• Feature sections with benefits 
• Use cases by audience 
• Pricing table 
• Social proof (logos, testimonials) 
• FAQ 
• Conversion CTA section 
• Footer with legal & socials 

BACKEND & ADMIN DASHBOARD 
Include: 
• Content management (pages, features, blog) 
• Pricing plan editor 
• Lead capture forms 
• SEO tools 
• Design customization 
• Analytics-ready structure 
• CMS for creating and managing blog posts, product updates, changelogs.

DESIGN & TECH 
• Clean SaaS UI 
• Responsive 
• Fast performance 
• Conversion-optimized layout 
Generate the full SaaS website structure and admin dashboard. Fully editable and scalable.`
   },
   {
      id: 'm4',
      title: 'Travel Agency Booking System',
      description: 'Build a vibrant travel platform with destination guides, package booking logic, and inspiring visual layouts.',
      category: 'Travel',
      isFree: false,
      priceUsd: '$10',
      priceKsh: 'KSH 1,300',
      content: `You are a Senior Travel Platform Architect, UX Designer, and Booking Systems Expert. Build a travel agency or travel blog website with booking capability. 
Website Name: [[TRAVEL BRAND NAME]] 
Website Type: [[Agency / Blog / Package Booking]] 
Primary Goal: Package bookings & inquiries 
Brand Style: Vibrant, inspiring 

FRONTEND REQUIREMENTS 
Include: 
• Hero with destination imagery & CTA (“Explore Packages”) 
• Popular destinations 
• Travel packages with pricing 
• Package detail pages 
• Testimonials 
• Offers & deals 
• Blog / travel guides 
• Booking & inquiry CTA 
• Footer with socials & contact 

BACKEND & ADMIN DASHBOARD 
Admin must manage: 
• Destinations 
• Packages (price, itinerary, duration) 
• Booking requests
• Blog posts 
• SEO 
• Media 
• Design customization 
• CMS allowing creation and management of travel blog posts and destination guides.

DESIGN & TECH 
• Mobile-friendly 
• Visual-first UI 
• SEO-optimized 
• Fast load speed 
Generate the complete travel website with frontend, backend, and admin dashboard.`
   },
   {
      id: 'm5',
      title: 'High-Ticket Agency Portfolio',
      description: 'Position your agency as a premium solution. Includes case study structures, service breakdowns, and lead capture.',
      category: 'Business',
      isFree: false,
      priceUsd: '$12',
      priceKsh: 'KSH 1,500',
      content: `You are a Senior Brand Strategist, Conversion Copywriter, and Web Architect. Build a high-converting agency website. 
Website Name: [[AGENCY NAME]] 
Agency Type: [[Marketing / Design / Automation / Consulting]] 
Primary Goal: Lead generation & bookings 
Brand Style: Premium, bold, modern 

FRONTEND REQUIREMENTS 
Include: 
• Hero with bold positioning & CTA 
• Services overview 
• How we work 
• Case studies / results
• Testimonials 
• About section 
• Booking / contact form 
• FAQ 
• Strong CTA block 
• Professional footer 

BACKEND & ADMIN DASHBOARD 
Admin must manage: 
• Services 
• Case studies 
• Leads & bookings 
• Page content 
• SEO settings 
• Design & branding options 
• CMS to create and manage blog posts, insights, and case studies.

DESIGN & TECH 
• Conversion-focused layout 
• Smooth animations 
• Fully responsive 
• SEO-ready 
Generate the complete agency website including UI, backend logic, and admin dashboard.`
   },
   {
      id: 'm6',
      title: 'Consistent AI Character Workflow',
      description: 'A 3-step advanced workflow to generate consistent AI characters for video ads across different scenes using Midjourney/Flux and Veo.',
      category: 'AI Art',
      isFree: false,
      priceUsd: '$20',
      priceKsh: 'KSH 2,600',
      content: `CONSISTENT AI CHARACTERS FOR AD CAMPAIGNS PROMPT 

Step 1 — Character + Product Green Screen Image Prompt 
You are an expert AI ad creator. Generate a highly detailed image prompt of one main character holding, using, or interacting with [INSERT PRODUCT IMAGE].  
Requirements: 
1. Character must be fully described in one paragraph including: Name, Age, Gender, Nationality, Skin tone, Hair style/color, Outfit.
2. Character must appear consistent across all later scenes. 
3. Character should be standing or posing with the [PRODUCT] clearly visible. 
4. The background must be plain GREEN SCREEN (solid green).
5. Make the image prompt cinematic, high quality, realistic, with professional lighting. 

Step 2 — Consistent Character Ad Script Prompt 
Now using the same consistent character from Step 1, generate a full ad video script for [INSERT PRODUCT IMAGE].  
Format: 4 to 8 scenes. Each scene description includes: (a) Character + Action (b) Background / Environment.
Rules: 
1. Always use the same character description from Step 1.  
2. Keep scenes short (4–8 seconds).  
3. Ensure product visibility.  

Step 3 — Converting Script to Veo 3 JSON PROMPT 
You are an expert AI director. Convert the ad script into a cinematic Google Veo 3 JSON format.  
Rules: 
1. Each scene must be output as its own separate JSON block 
2. Keys: "character" (description), "scene" (cinematic description), "voice" (dialogue).
3. Cinematic Style: Add camera actions (close-up, wide shot) and lighting.
4. Background replacement instructions.
[Include specific JSON structure provided in full prompt]`
   },
   {
      id: 'm7',
      title: 'Claude 3 Opus Coder',
      description: 'The ultimate system prompt for generating clean, modular, and error-free React/Next.js code with TypeScript.',
      category: 'Coding',
      isFree: false,
      priceUsd: '$25',
      priceKsh: 'KSH 3,250',
      content: `You are Claude 3 Opus, acting as a Senior Principal Software Engineer. 
Your goal is to write robust, scalable, and secure code.

RULES FOR CODE GENERATION:
1.  **Strict TypeScript**: Always use explicit types. No 'any'.
2.  **Modern React**: Use Functional Components, Hooks (useMemo, useCallback), and Context API.
3.  **Tailwind CSS**: Use utility classes for styling. Ensure responsive design (mobile-first).
4.  **Error Handling**: Implement try/catch blocks and UI error boundaries.
5.  **Comments**: Comment complex logic, but avoid stating the obvious.
6.  **Directory Structure**: Suggest a file structure before writing code.

TASK: [INSERT CODING TASK HERE]
Output the solution in multiple file blocks if necessary.`
   },
   {
      id: 'm8',
      title: 'Midjourney Photorealism V6',
      description: 'A master prompt structure to get 8k, National Geographic quality photography from AI.',
      category: 'AI Art',
      isFree: true,
      content: `/imagine prompt: [SUBJECT DESCRIPTION], shot on 35mm lens, f/1.8 aperture, natural lighting, golden hour, highly detailed skin texture, cinematic color grading, photorealistic, 8k resolution, --v 6.0 --style raw --ar 16:9`
   },
   {
      id: 'm9',
      title: 'Executive Summary Generator',
      description: 'Turn messy meeting notes into a board-ready one-pager.',
      category: 'Business',
      isFree: true,
      content: `Act as a McKinsey Consultant. I will paste raw meeting notes below. 
Please convert them into a structured Executive Summary.
Format:
1. **Headline**: The single most important takeaway.
2. **Key Decisions**: Bullet points of what was agreed upon.
3. **Action Items**: Who does what by when (Table format).
4. **Risks/Blockers**: Potential issues.
Tone: Professional, concise, action-oriented.
[PASTE NOTES HERE]`
   },
   {
      id: 'm10',
      title: 'Full-Stack App Architecture',
      description: 'Generate a complete schema, API structure, and frontend plan for any app idea.',
      category: 'System Engineering',
      isFree: false,
      priceUsd: '$30',
      priceKsh: 'KSH 3,900',
      content: `Act as a Chief Technology Officer (CTO). I have an app idea: [INSERT IDEA].
Produce a complete Technical Design Document (TDD).
Include:
1.  **Database Schema**: ERD description or SQL definitions (PostgreSQL).
2.  **API Endpoints**: RESTful routes with methods, params, and response types.
3.  **Tech Stack**: Recommend the best tools for speed and scale.
4.  **Security Measures**: Auth flow, RLS, and encryption standards.
5.  **Frontend Component Hierarchy**: Tree structure of React components.`
   }
];

// Generate 50+ diverse prompts programmatically to simulate a large library
const generateLibrary = (): Prompt[] => {
   const categories = ['Coding', 'Marketing', 'Writing', 'Business', 'Personal', 'System Engineering'];
   const basePrompts: Prompt[] = [];

   // Coding Prompts
   basePrompts.push({
      id: 'c_1', title: 'React Component Generator', description: 'Create clean, functional React components with Tailwind styling.', category: 'Coding', isFree: true, content: 'Act as a Senior React Developer. Create a [COMPONENT_NAME] component using React and Tailwind CSS. Ensure accessibility (ARIA) and responsive design.'
   });
   basePrompts.push({
      id: 'c_2', title: 'SQL Query Optimizer', description: 'Optimize complex SQL queries for performance.', category: 'Coding', isFree: false, priceUsd: '$2', priceKsh: 'KSH 250', content: 'Act as a Database Administrator. Analyze the following SQL query for performance bottlenecks and rewrite it for maximum efficiency on PostgreSQL.'
   });
   basePrompts.push({
      id: 'c_3', title: 'Python API Boilerplate', description: 'Generate a FastAPI structure for microservices.', category: 'Coding', isFree: true, content: 'Write a production-ready FastAPI boilerplate structure including Pydantic models, dependency injection, and JWT auth.'
   });
   basePrompts.push({
      id: 'c_4', title: 'Regex Wizard', description: 'Generate complex regular expressions from plain English.', category: 'Coding', isFree: true, content: 'Act as a Regex Expert. Create a Regular Expression to match [PATTERN_DESCRIPTION]. Explain each part of the regex.'
   });

   // Marketing Prompts
   basePrompts.push({
      id: 'mk_1', title: 'SEO Blog Post Writer', description: 'Write long-form, keyword-rich articles that rank.', category: 'Marketing', isFree: true, content: 'Act as an SEO Specialist. Write a 1500-word blog post about [TOPIC]. Use the keywords: [KEYWORDS]. Structure with H1, H2, H3 tags.'
   });
   basePrompts.push({
      id: 'mk_2', title: 'Facebook Ad Copy Specialist', description: 'Generate high-CTR ad copy with hooks and CTAs.', category: 'Marketing', isFree: false, priceUsd: '$3', priceKsh: 'KSH 400', content: 'Act as a Direct Response Copywriter. Write 3 variations of Facebook Ad copy for [PRODUCT]. Variation 1: Story-based. Variation 2: Problem-Agitation-Solution. Variation 3: Social Proof.'
   });
   basePrompts.push({
      id: 'mk_3', title: 'Cold Email Sequence', description: 'A 5-step email sequence to warm up leads.', category: 'Marketing', isFree: false, priceUsd: '$5', priceKsh: 'KSH 650', content: 'Create a 5-email cold outreach sequence for [TARGET_AUDIENCE] selling [SERVICE]. Focus on value first, pitching later.'
   });

   // Business
   basePrompts.push({
      id: 'b_1', title: 'Business Plan Generator', description: 'Create a lean canvas business plan in minutes.', category: 'Business', isFree: true, content: 'Act as a Business Consultant. Create a Lean Canvas business plan for a startup idea: [IDEA]. Include USP, Revenue Streams, and Cost Structure.'
   });
   basePrompts.push({
      id: 'b_2', title: 'Contract Reviewer', description: 'Identify red flags in legal documents.', category: 'Business', isFree: false, priceUsd: '$4', priceKsh: 'KSH 500', content: 'Act as a Legal Assistant. Review the following contract clause for potential risks to the freelancer: [PASTE_CLAUSE].'
   });

   // Fillers to reach "100 more" feel (simulated loop for demo)
   for (let i = 0; i < 60; i++) {
      const cat = categories[i % categories.length];
      const isPaid = i % 3 === 0;
      basePrompts.push({
         id: `gen_${i}`,
         title: `${cat} Assistant Pro ${i + 1}`,
         description: `A specialized prompt for ${cat.toLowerCase()} tasks, optimized for efficiency and output quality.`,
         category: cat,
         isFree: !isPaid,
         priceUsd: isPaid ? '$1' : undefined,
         priceKsh: isPaid ? 'KSH 150' : undefined,
         content: `Act as an expert in ${cat}. Help me with task number ${i + 1} related to...`
      });
   }

   return basePrompts;
};

const allPrompts = [...masterPrompts, ...generateLibrary()];

const Prompts: React.FC = () => {
   const [activeTab, setActiveTab] = useState<'library' | 'generator'>('library');
   const [searchQuery, setSearchQuery] = useState('');
   const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');
   const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
   const [copied, setCopied] = useState(false);

   // Auth Context
   const { isAuthenticated } = useUser();
   const [showAuthModal, setShowAuthModal] = useState(false);
   const [authTrigger, setAuthTrigger] = useState("");

   // Generator State
   const [genTopic, setGenTopic] = useState('');
   const [genRole, setGenRole] = useState('');
   const [genResult, setGenResult] = useState('');
   const [isGenerating, setIsGenerating] = useState(false);

   const filteredPrompts = allPrompts.filter(p => {
      // Enhanced search: scans title, description AND content
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = p.title.toLowerCase().includes(searchLower) ||
         p.description.toLowerCase().includes(searchLower) ||
         p.content.toLowerCase().includes(searchLower);

      const matchesFilter = filter === 'all' ? true : filter === 'free' ? p.isFree : !p.isFree;
      return matchesSearch && matchesFilter;
   });

   const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   const handlePromptClick = (prompt: Prompt) => {
      // All prompts now accessible
      setSelectedPrompt(prompt);
   };

   const handleGenerate = async () => {
      if (!genTopic) return;
      // Removed auth requirement as requested
      setIsGenerating(true);

      try {
         const prompt = `Act as a Level 5 Prompt Architect. Create a master-level system prompt optimized for reasoning-heavy LLMs (like Claude 3.5 or Gemini 1.5/2.0). 
        
        GOAL: The user needs a prompt for: "${genTopic}".
        ROLE TO ADOPT: "${genRole || 'Expert System Specialist'}".
        
        THE ARCHITECTED PROMPT MUST INCLUDE:
        1. **Objective & Intent**: Clear, non-ambiguous definition of success.
        2. **Persona & Voice**: Deep psychological profile and communication style.
        3. **Operational Framework**: Step-by-step logic, recursive thinking paths, and Chain-of-Thought requirements.
        4. **Constraints & Boundary Conditions**: Explicit "Never" and "Always" rules.
        5. **Response Architecture**: Exact JSON/Markdown structure required.
        6. **Examples (Few-Shot)**: Placeholder for typical input/output pairs.
        
        OUTPUT ONLY THE ENGINEERED PROMPT. NO INTRO OR OUTRO. START DIRECTLY WITH THE PERSONA DEFINITION.`;

         const response = await aiService.chat(prompt, "You are the ArchiTech-Wize Master Prompt Architect.");
         setGenResult(response);
      } catch (e) {
         setGenResult("Error generating prompt. Please try again.");
      } finally {
         setIsGenerating(false);
      }
   };

   return (
      <div className="w-full bg-slate-50 min-h-screen pt-32 pb-24">
         <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} triggerAction={authTrigger} />

         {/* Hero */}
         <section className="container mx-auto px-6 mb-16 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">Wize Prompt Library</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
               A curated collection of system prompts to unlock the full potential of LLMs.
               From master architects to coding wizards.
            </p>

            <div className="flex justify-center gap-4">
               <button
                  onClick={() => setActiveTab('library')}
                  className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'library' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200'}`}
               >
                  Browse Library
               </button>
               <button
                  onClick={() => setActiveTab('generator')}
                  className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'generator' ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-brand-primary border border-brand-primary/30'}`}
               >
                  <Sparkles size={18} /> AI Prompt Generator
               </button>
            </div>
         </section>

         {/* GENERATOR TAB */}
         {activeTab === 'generator' && (
            <section className="container mx-auto px-6 max-w-4xl animate-fade-in-up">
               <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative min-h-[500px] flex flex-col">
                  {/* Header Decoration */}
                  <div className="bg-gradient-to-r from-brand-primary to-blue-600 p-8 text-white relative overflow-hidden">
                     <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                           <Sparkles className="text-amber-300" /> Master Prompt Architect
                        </h2>
                        <p className="opacity-90 max-w-2xl">
                           Describe what you need, and our AI will engineer the perfect system prompt for you.
                           Uses advanced reasoning to structure persona, context, and constraints.
                        </p>
                     </div>
                     <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col gap-8">
                     {/* Input Section */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <label className="block text-sm font-bold text-slate-700">What do you want the AI to do?</label>
                           <textarea
                              value={genTopic}
                              onChange={(e) => setGenTopic(e.target.value)}
                              placeholder="E.g., Write a high-converting landing page for a coffee shop..."
                              className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none resize-none transition-all text-slate-700"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="block text-sm font-bold text-slate-700">Role / Persona (Optional)</label>
                           <input
                              value={genRole}
                              onChange={(e) => setGenRole(e.target.value)}
                              placeholder="E.g., Senior Copywriter, React Expert..."
                              className="w-full p-4 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all text-slate-700"
                           />

                           <div className="pt-4">
                              <Button
                                 onClick={handleGenerate}
                                 disabled={!genTopic || isGenerating}
                                 variant={!genTopic ? 'outline' : 'primary'}
                                 className="w-full justify-center py-4 text-lg shadow-lg shadow-brand-primary/20"
                              >
                                 {isGenerating ? (
                                    <>
                                       <span className="animate-spin mr-2">⚡</span> Engineering Prompt...
                                    </>
                                 ) : (
                                    <>
                                       <Wand2 size={20} className="mr-2" /> Generate Master Prompt
                                    </>
                                 )}
                              </Button>
                           </div>
                        </div>
                     </div>

                     {/* Result Section */}
                     {genResult && (
                        <div className="animate-fade-in-up border-t border-slate-100 pt-8 mt-2">
                           <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                 <Terminal size={18} className="text-brand-primary" /> Generated Prompt
                              </h3>
                              <button
                                 onClick={() => handleCopy(genResult)}
                                 className="text-brand-primary text-sm font-bold hover:underline flex items-center gap-1"
                              >
                                 {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}
                              </button>
                           </div>
                           <div className="bg-slate-900 rounded-xl p-6 relative group">
                              <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar">
                                 {genResult}
                              </pre>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </section>
         )}

         {/* LIBRARY TAB */}
         {activeTab === 'library' && (
            <section className="container mx-auto px-6">
               {/* Filters */}
               <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
                  <div className="flex gap-2 bg-white p-1 rounded-full border border-slate-200">
                     <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>All</button>
                     <button onClick={() => setFilter('free')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'free' ? 'bg-brand-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>Free</button>
                     <button onClick={() => setFilter('paid')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'paid' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>Premium</button>
                  </div>
                  <div className="relative w-full md:w-96">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search prompts (titles, content)..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 outline-none focus:border-brand-primary"
                     />
                  </div>
               </div>

               {/* Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrompts.map(prompt => (
                     <div key={prompt.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                           <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${prompt.category === 'Business' ? 'bg-blue-50 text-blue-600' : prompt.category === 'Coding' ? 'bg-pink-50 text-pink-600' : 'bg-slate-100 text-slate-600'}`}>
                              {prompt.category}
                           </span>
                           {prompt.isFree ? (
                              <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">Free</span>
                           ) : (
                              <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1"><Lock size={10} /> Paid</span>
                           )}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-primary transition-colors">{prompt.title}</h3>
                        <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-3">{prompt.description}</p>

                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                           {prompt.isFree ? (
                              <button onClick={() => handlePromptClick(prompt)} className="text-slate-900 font-bold text-sm hover:underline flex items-center gap-1">
                                 View & Copy <Code size={14} />
                                 {!isAuthenticated && <Lock size={12} className="text-slate-400 ml-1" />}
                              </button>
                           ) : (
                              <div className="w-full flex justify-between items-center">
                                 <div>
                                    <span className="block font-bold text-slate-900">{prompt.priceUsd}</span>
                                    <span className="text-[10px] text-slate-400">{prompt.priceKsh}</span>
                                 </div>
                                 <button onClick={() => alert("Redirecting to checkout...")} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
                                    Buy <ShoppingBag size={14} />
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         )}

         {/* PROMPT MODAL */}
         {selectedPrompt && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl animate-fade-in-up">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                     <div>
                        <h3 className="text-xl font-bold text-slate-900">{selectedPrompt.title}</h3>
                        <p className="text-slate-500 text-sm">{selectedPrompt.category}</p>
                     </div>
                     <button onClick={() => setSelectedPrompt(null)} className="p-2 hover:bg-slate-100 rounded-full"><span className="sr-only">Close</span>✕</button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                     <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 bg-white p-6 rounded-xl border border-slate-200">
                        {selectedPrompt.content}
                     </pre>
                  </div>
                  <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-2xl">
                     <button onClick={() => setSelectedPrompt(null)} className="px-4 py-2 text-slate-500 font-medium">Close</button>
                     <button onClick={() => handleCopy(selectedPrompt.content)} className="px-6 py-2 bg-brand-primary text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600">
                        {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copied!' : 'Copy to Clipboard'}
                     </button>
                  </div>
               </div>
            </div>
         )}

      </div>
   );
};

export default Prompts;