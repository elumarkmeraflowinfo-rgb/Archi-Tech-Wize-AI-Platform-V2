import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Megaphone, Video, PenTool, Layout, 
  ShoppingBag, Home, Truck, Utensils, Heart, 
  Briefcase, Search, ArrowRight, CheckCircle2, 
  Sparkles, Layers, DollarSign, Calendar,
  Music, Wrench, GraduationCap, Laptop, Check,
  Globe, Monitor, Smartphone, Code
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

// --- DATA TYPES ---
interface Industry {
  id: string;
  name: string;
  icon: React.ReactNode;
  niches: string[]; // List of specific sub-niches
  recommendedPack: string;
}

interface ServicePackage {
  id: string;
  name: string;
  type: 'video' | 'branding' | 'ads' | 'print' | 'web';
  description: string;
  startingPrice: string; // KSH / USD display
  features: string[];
}

// --- DATASETS ---

const industries: Industry[] = [
  {
    id: 'real-estate',
    name: 'Real Estate & Property',
    icon: <Home size={24} className="text-blue-500" />,
    recommendedPack: 'video',
    niches: ['Plot Selling', 'Apartment Rentals', 'Commercial Real Estate', 'Airbnb Management', 'Construction', 'Interior Design', 'Land Surveying', 'Architecture Firms', 'Property Flipping', 'Estate Agency']
  },
  {
    id: 'food',
    name: 'Food & Beverage',
    icon: <Utensils size={24} className="text-orange-500" />,
    recommendedPack: 'ads',
    niches: ['Cafe', 'Fine Dining', 'Fast Food', 'Bakery', 'Food Truck', 'Catering Service', 'Bar/Lounge', 'Organic Farm Produce', 'Butchery', 'Grocery Store', 'Liquor Store', 'Meal Prep']
  },
  {
    id: 'beauty',
    name: 'Health & Beauty',
    icon: <Heart size={24} className="text-pink-500" />,
    recommendedPack: 'branding',
    niches: ['Salon', 'Barbershop', 'Spa', 'Gym/Fitness Center', 'Yoga Studio', 'Cosmetics Shop', 'Dermatology Clinic', 'Personal Trainer', 'Massage Therapy', 'Nail Bar', 'Supplements']
  },
  {
    id: 'auto',
    name: 'Automotive & Logistics',
    icon: <Truck size={24} className="text-slate-700" />,
    recommendedPack: 'ads',
    niches: ['Car Dealership', 'Car Hire', 'Auto Spares', 'Mechanic/Garage', 'Car Wash', 'Logistics/Trucking', 'Boda Boda Fleet', 'Taxi Service', 'Driving School', 'Import/Export']
  },
  {
    id: 'agri',
    name: 'Agriculture & Farming',
    icon: <Layout size={24} className="text-green-600" />,
    recommendedPack: 'print',
    niches: ['Farm Merchandise', 'Poultry Farming', 'Dairy Production', 'Agro-Vet', 'Fertilizer Supply', 'Tractor Leasing', 'Greenhouse Construction', 'Fresh Produce Export', 'Irrigation Systems']
  },
  {
    id: 'retail',
    name: 'Retail & E-Commerce',
    icon: <ShoppingBag size={24} className="text-purple-500" />,
    recommendedPack: 'ads',
    niches: ['Clothing Boutique', 'Shoe Store', 'Electronics Shop', 'Furniture Store', 'Phone Accessories', 'Online Store', 'Thrift/Mitumba', 'Jewelry', 'Pet Store', 'Bookshop']
  },
  {
    id: 'events',
    name: 'Events & Entertainment',
    icon: <Music size={24} className="text-red-500" />,
    recommendedPack: 'video',
    niches: ['Wedding Planner', 'DJ / MC', 'Concert Organizer', 'Photography', 'Videography', 'Equipment Rental', 'Venue Hire', 'Catering']
  },
  {
    id: 'home-services',
    name: 'Home Services',
    icon: <Wrench size={24} className="text-amber-600" />,
    recommendedPack: 'ads',
    niches: ['Plumbing', 'Electrical', 'Cleaning Services', 'Landscaping', 'Solar Installation', 'Security Services', 'Moving Company', 'Pest Control']
  },
  {
    id: 'education',
    name: 'Education & Training',
    icon: <GraduationCap size={24} className="text-indigo-600" />,
    recommendedPack: 'branding',
    niches: ['Private School', 'Kindergarten', 'Driving School', 'Computer College', 'Online Tutor', 'Language School', 'Corporate Training']
  },
  {
    id: 'tech',
    name: 'Tech & Professional',
    icon: <Laptop size={24} className="text-cyan-600" />,
    recommendedPack: 'ads',
    niches: ['SaaS Startup', 'App Developer', 'IT Support', 'Accounting Firm', 'Law Firm', 'Consultancy', 'Marketing Agency', 'HR Services']
  },
  {
    id: 'personal',
    name: 'Personal Brand',
    icon: <Briefcase size={24} className="text-indigo-500" />,
    recommendedPack: 'video',
    niches: ['Influencer', 'Consultant', 'Politician', 'Musician', 'Author', 'Life Coach', 'Motivational Speaker', 'Artist']
  }
];

const services: ServicePackage[] = [
  {
    id: 'web-dev',
    name: 'High-Conversion Websites',
    type: 'web',
    description: 'Your 24/7 Digital Headquarters. From stunning one-page landing sites to complex full-stack web applications.',
    startingPrice: 'KSH 15,000+',
    features: ['UI/UX Design', 'Mobile Responsive', 'SEO Optimization', 'CMS Integration']
  },
  {
    id: 'video-short',
    name: 'Viral Reels & TikToks',
    type: 'video',
    description: 'High-energy 15-60s vertical videos designed for maximum retention. Includes scripting, shooting, and editing.',
    startingPrice: 'KSH 3,500 / video',
    features: ['Scripting & Storyboard', 'Professional 4K Shooting', 'Trending Audio Selection', 'Motion Graphics & Captions']
  },
  {
    id: 'video-long',
    name: 'Brand Story / Commercials',
    type: 'video',
    description: 'Cinematic 1-3 minute horizontal videos for YouTube, Website, or TV. Perfect for real estate tours or company profiles.',
    startingPrice: 'KSH 15,000 / project',
    features: ['Drone Footage Available', 'Professional Voiceover', 'Color Grading', 'Interview Setup']
  },
  {
    id: 'branding-kit',
    name: 'Full Brand Identity',
    type: 'branding',
    description: 'A complete visual overhaul. We build brands that look expensive and trustworthy.',
    startingPrice: 'KSH 10,000',
    features: ['Logo Design (3 Premium Concepts)', 'Brand Guidelines PDF', 'Social Media Covers', 'Business Card & Letterhead']
  },
  {
    id: 'campaign-meta',
    name: 'Paid Ads Manager',
    type: 'ads',
    description: 'Stop burning money on "Boost Post". We run targeted campaigns on FB, IG, and Google to generate leads.',
    startingPrice: 'KSH 5,000 + Ad Spend',
    features: ['Audience Targeting Strategy', 'A/B Testing Creatives', 'Pixel Setup & Retargeting', 'Weekly Performance Reports']
  },
  {
    id: 'print-pack',
    name: 'Print & Merchandise',
    type: 'print',
    description: 'Physical marketing assets designed to convert local foot traffic and build loyalty.',
    startingPrice: 'KSH 2,500 / design',
    features: ['Posters & Flyers', 'Large Format Billboards', 'Staff Uniform Branding', 'Product Packaging Design']
  }
];

const MarketingServices: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useAdmin();
  
  // Campaign Builder State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState('Standard (Recommended)');

  // Filter industries based on search including their niches
  const filteredIndustries = industries.filter(ind => 
    ind.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ind.niches.some(n => n.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleWhatsAppConsultation = () => {
    const serviceNames = selectedServices.map(id => services.find(s => s.id === id)?.name).join(', ');
    const industryName = selectedIndustry?.name || 'My Business';
    
    const message = `Hello ArchiTech Team, 

I am interested in growing my business: *${industryName}*.

I need help with the following services:
${serviceNames ? serviceNames : '- General Marketing Inquiry'}

My estimated budget tier is: *${budgetRange}*

Can we schedule a call to discuss a strategy?`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getServiceColor = (type: string) => {
    switch(type) {
      case 'web': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'video': return 'bg-red-100 text-red-600 border-red-200';
      case 'branding': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'ads': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-green-100 text-green-600 border-green-200';
    }
  };

  const getServiceIcon = (type: string) => {
    switch(type) {
      case 'web': return <Globe size={20}/>;
      case 'video': return <Video size={20}/>;
      case 'branding': return <PenTool size={20}/>;
      case 'ads': return <Megaphone size={20}/>;
      default: return <Layout size={20}/>;
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-32 pb-24">
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm mb-6 animate-fade-in-up">
          <Megaphone size={14} className="text-indigo-600 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">Agency-Level Marketing for Everyone</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
          Explode Your Brand Visibility
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
          From local farm produce to luxury real estate. We create high-converting websites, cinematic videos, and targeted ad campaigns for 
          <span className="font-bold text-slate-900"> 1,000+ business types</span>.
        </p>
      </section>

      {/* Campaign Builder / Interactive Tool */}
      <section className="container mx-auto px-6 max-w-6xl mb-24">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-6 md:p-8 text-white flex justify-between items-center flex-wrap gap-4">
             <div>
                <h2 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="text-brand-accent"/> Campaign Builder</h2>
                <p className="text-slate-400 text-sm">Customize your package in 3 steps</p>
             </div>
             <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-mono border border-white/20">
                Step {selectedIndustry ? (selectedServices.length > 0 ? 3 : 2) : 1} of 3
             </div>
          </div>

          <div className="p-6 md:p-10">
            
            {/* STEP 1: SELECT INDUSTRY */}
            <div className={`mb-12 transition-all duration-500 ${selectedIndustry ? 'opacity-50 pointer-events-none hover:opacity-100 hover:pointer-events-auto' : ''}`}>
               <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <span className="bg-brand-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                 Select Your Business Type
               </h3>
               
               <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search e.g., 'Goat Farming', 'Nail Salon', 'Car Wash', 'Event Planner'..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-80 overflow-y-auto custom-scrollbar p-1">
                  {filteredIndustries.map(ind => (
                    <button
                      key={ind.id}
                      onClick={() => setSelectedIndustry(ind)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${selectedIndustry?.id === ind.id ? 'bg-brand-primary text-white border-brand-primary ring-2 ring-offset-2 ring-brand-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      <div className={`mb-2 ${selectedIndustry?.id === ind.id ? 'text-white' : ''}`}>{ind.icon}</div>
                      <span className="text-xs font-bold text-center leading-tight">{ind.name}</span>
                    </button>
                  ))}
               </div>
               
               {/* Niche Tag Cloud Display */}
               {searchTerm && (
                 <div className="mt-4 flex flex-wrap gap-2 animate-fade-in-up">
                    {filteredIndustries.flatMap(i => i.niches.filter(n => n.toLowerCase().includes(searchTerm.toLowerCase()))).slice(0, 10).map((niche, idx) => (
                       <span key={idx} className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full border border-yellow-200 font-medium flex items-center gap-1">
                          <CheckCircle2 size={10} /> {niche}
                       </span>
                    ))}
                 </div>
               )}
            </div>

            {/* STEP 2: SELECT SERVICES */}
            {selectedIndustry && (
              <div className="mb-12 animate-fade-in-up">
                 <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <span className="bg-brand-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
                   Choose Your Weapons
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(svc => (
                       <div 
                         key={svc.id}
                         onClick={() => toggleService(svc.id)}
                         className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedServices.includes(svc.id) ? 'border-brand-primary bg-sky-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                       >
                          {selectedServices.includes(svc.id) && (
                             <div className="absolute top-4 right-4 text-brand-primary"><CheckCircle2 size={24} fill="currentColor" className="text-white"/></div>
                          )}
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${getServiceColor(svc.type)}`}>
                             {getServiceIcon(svc.type)}
                          </div>
                          <h4 className="font-bold text-slate-900 mb-2">{svc.name}</h4>
                          <p className="text-xs text-slate-500 mb-4 leading-relaxed">{svc.description}</p>
                          <div className="text-sm font-bold text-slate-900 bg-white px-3 py-1 rounded-md inline-block border border-slate-200">
                             {svc.startingPrice}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {/* STEP 3: REVIEW & CTA */}
            {selectedServices.length > 0 && (
               <div className="bg-slate-50 rounded-2xl p-8 animate-fade-in-up border border-slate-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Campaign Summary</h3>
                        <p className="text-slate-500">
                           Industry: <span className="font-semibold text-slate-800">{selectedIndustry?.name}</span> • 
                           Services: <span className="font-semibold text-slate-800">{selectedServices.length} selected</span>
                        </p>
                     </div>
                     <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <select 
                           value={budgetRange}
                           onChange={(e) => setBudgetRange(e.target.value)}
                           className="bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none cursor-pointer w-full md:w-auto"
                        >
                           <option value="Starter Budget (Lean)">Starter Budget (Lean)</option>
                           <option value="Standard (Recommended)">Standard (Recommended)</option>
                           <option value="Aggressive (High Growth)">Aggressive (High Growth)</option>
                        </select>
                        <button 
                           onClick={handleWhatsAppConsultation}
                           className="px-8 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full md:w-auto"
                        >
                           Get Quote on WhatsApp <ArrowRight size={18} />
                        </button>
                     </div>
                  </div>
               </div>
            )}

          </div>
        </div>
      </section>

      {/* WEB DEV STANDALONE SPOTLIGHT */}
      <section className="container mx-auto px-6 mb-24">
         <div className="bg-slate-900 rounded-3xl p-8 md:p-16 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-6">
                     <Code size={12} /> Digital Real Estate
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Your Website is Your 24/7 Salesman.</h2>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                     Don't just build a "page". Build a conversion machine. Whether you need a simple landing page for your campaign or a complex full-stack application, we architect digital experiences that sell.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                     <div className="flex items-start gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><Layout size={20}/></div>
                        <div>
                           <h4 className="font-bold">One-Page Landers</h4>
                           <p className="text-sm text-slate-400">Perfect for specific campaigns. High speed, high focus, high conversion.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><Layers size={20}/></div>
                        <div>
                           <h4 className="font-bold">Full-Stack Applications</h4>
                           <p className="text-sm text-slate-400">Complex systems with user logins, databases, and custom logic.</p>
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setSelectedServices(['web-dev']); // Pre-select web dev
                     }}
                     className="px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-xl hover:bg-cyan-400 transition-colors flex items-center gap-2"
                  >
                     Start Your Build <ArrowRight size={18} />
                  </button>
               </div>
               
               <div className="relative">
                  <div className="relative z-10 bg-slate-800 rounded-2xl p-2 border border-slate-700 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                      <div className="bg-slate-900 rounded-xl overflow-hidden aspect-[16/10] relative group">
                          <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-700">
                             <div className="w-3 h-3 rounded-full bg-red-500"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                             <div className="w-3 h-3 rounded-full bg-green-500"></div>
                             <div className="ml-4 h-4 w-40 bg-slate-700 rounded-full opacity-50"></div>
                          </div>
                          <div className="pt-8 h-full flex flex-col items-center justify-center text-slate-600">
                             <img src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80" alt="Web Design" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                             <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex gap-2 mb-2">
                                   <span className="px-2 py-1 bg-cyan-500 text-slate-900 text-xs font-bold rounded">React</span>
                                   <span className="px-2 py-1 bg-white text-slate-900 text-xs font-bold rounded">Tailwind</span>
                                   <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded">UI/UX</span>
                                </div>
                                <h3 className="text-white font-bold text-xl">Modern Architecture</h3>
                             </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="absolute -top-6 -right-6 p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-xl animate-float">
                     <Smartphone className="text-cyan-400" size={24} />
                  </div>
                  <div className="absolute -bottom-6 -left-6 p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-xl animate-float-delayed">
                     <Code className="text-purple-400" size={24} />
                  </div>
               </div>
            </div>
         </div>
      </section>

      <section className="container mx-auto px-6 mb-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How We Scale Your Brand</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We don't just "post content". We build systems that turn viewers into paying customers.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold text-slate-300 select-none pointer-events-none -mt-4 -mr-4">1</div>
               <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
                  <Search size={28} />
               </div>
               <h3 className="font-bold text-lg text-slate-900 mb-2">Discovery</h3>
               <p className="text-slate-500 text-sm">We analyze your niche, competitors, and offer. We find the "hook" that makes you unique in the market.</p>
            </div>

            <div className="relative p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold text-slate-300 select-none pointer-events-none -mt-4 -mr-4">2</div>
               <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles size={28} />
               </div>
               <h3 className="font-bold text-lg text-slate-900 mb-2">Production</h3>
               <p className="text-slate-500 text-sm">We use advanced AI to generate hyper-realistic videos, voiceovers, and visuals. No expensive camera crews, just pure digital magic.</p>
            </div>

            <div className="relative p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold text-slate-300 select-none pointer-events-none -mt-4 -mr-4">3</div>
               <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                  <Megaphone size={28} />
               </div>
               <h3 className="font-bold text-lg text-slate-900 mb-2">Amplification</h3>
               <p className="text-slate-500 text-sm">We launch ads and distribute content. We optimize daily to ensure your budget brings maximum ROI.</p>
            </div>

            <div className="relative p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold text-slate-300 select-none pointer-events-none -mt-4 -mr-4">4</div>
               <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                  <DollarSign size={28} />
               </div>
               <h3 className="font-bold text-lg text-slate-900 mb-2">Growth</h3>
               <p className="text-slate-500 text-sm">You get leads, sales, and bookings. We provide a monthly report and strategy to scale further.</p>
            </div>
         </div>
      </section>

      {/* Portfolio / Visuals - Improved */}
      <section className="container mx-auto px-6 mb-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">We Make You Look Good</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Visuals that stop the scroll and branding that builds trust.</p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-[500px]">
            {/* Real Estate Item */}
            <div className="col-span-2 md:col-span-2 row-span-2 relative group rounded-2xl overflow-hidden cursor-pointer shadow-lg">
               <img src={config.pages.marketing.portfolioImages.realEstate} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Modern African Gated Community" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <span className="text-white font-bold text-2xl mb-1">Luxury Real Estate</span>
                  <span className="text-slate-300 text-sm">Video Tours & Drone Shots</span>
               </div>
            </div>

            {/* Food Item */}
            <div className="col-span-1 md:col-span-1 relative group rounded-2xl overflow-hidden cursor-pointer shadow-lg">
               <img src={config.pages.marketing.portfolioImages.food} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Luxury African Hotel Dining" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold text-sm border border-white px-3 py-1 rounded-full backdrop-blur-sm">Hospitality & Dining</span>
               </div>
            </div>

            {/* Fashion Item */}
            <div className="col-span-1 md:col-span-1 relative group rounded-2xl overflow-hidden cursor-pointer shadow-lg">
               <img src={config.pages.marketing.portfolioImages.fashion} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="African Fashion" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold text-sm border border-white px-3 py-1 rounded-full backdrop-blur-sm">Fashion Retail</span>
               </div>
            </div>

            {/* Tech/SaaS Item */}
            <div className="col-span-2 md:col-span-2 relative group rounded-2xl overflow-hidden cursor-pointer shadow-lg">
               <img src={config.pages.marketing.portfolioImages.tech} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="African Tech Team" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold border border-white px-4 py-2 rounded-full backdrop-blur-sm">Corporate & SaaS</span>
               </div>
            </div>
         </div>
      </section>

      {/* Why Us - Simple Grid */}
      <section className="bg-white py-20 border-y border-slate-100">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
               <div className="p-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                     <DollarSign size={32} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Priced for Growth</h3>
                  <p className="text-slate-500 text-sm">We understand small business margins. Our packages are designed to be affordable yet high-quality.</p>
               </div>
               <div className="p-6">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                     <Layers size={32} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">All-in-One Solution</h3>
                  <p className="text-slate-500 text-sm">Don't hire a separate designer, editor, and ad manager. We handle the entire creative stack.</p>
               </div>
               <div className="p-6">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-4">
                     <Calendar size={32} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Fast Turnaround</h3>
                  <p className="text-slate-500 text-sm">Speed matters. Get your first draft videos and designs within 48 hours of shooting.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 mt-24 text-center">
         <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Stop Being the "Best Kept Secret"</h2>
               <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
                  Your customers are scrolling right now. Let's put your brand in front of them with content they can't ignore.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a 
                    href="https://wa.me/?text=Hello%2C%20I%20want%20to%20scale%20my%20business%20with%20ArchiTech%20Marketing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#25D366] text-white font-bold rounded-full hover:bg-green-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 gap-2"
                  >
                     <CheckCircle2 size={20} /> Claim Your Free Strategy Session
                  </a>
               </div>
               <p className="mt-4 text-xs text-slate-400 opacity-70">Limited spots available for this month.</p>
            </div>
         </div>
      </section>

    </div>
  );
};

export default MarketingServices;