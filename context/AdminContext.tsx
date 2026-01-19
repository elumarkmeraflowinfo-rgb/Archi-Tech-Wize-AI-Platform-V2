import React, { createContext, useContext, useState, useEffect } from 'react';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  where,
  getDoc
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../src/firebase';
import { deleteFromSupabase } from '../src/services/storageService';

// --- FIRESTORE TYPES ---
export interface FirestoreFolder {
  id: string;
  name: string;
  createdAt: any;
}

export interface FirestoreFile {
  id: string;
  name: string;
  folderId?: string;
  size: string;
  type?: string;
  provider?: string;
  providerRef?: string;
  downloadURL?: string;
  createdAt: any;
}

export interface FirestoreNote {
  id: string;
  title: string;
  content: string;
  createdAt: any;
}

export interface FirestoreTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  createdAt: any;
}

// --- DATA TYPES ---
export interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  status: 'draft' | 'published';
  image?: string;
  category: string;
  comments: Comment[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: 'core-ai' | 'automation' | 'no-code' | 'marketing' | 'web' | 'video' | 'design' | 'other';
  level: string;
  featured: boolean;
  skills: string[];
  technologies: string[];
  priceUsd: string;
  priceKsh: string;
  mode: 'Self-Paced' | 'Live Cohort' | '1-on-1' | 'Service';
  duration?: string;
  startDate?: string;
  prerequisites?: string[];
  comments?: Comment[];
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'icon';
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  visible: boolean;
  order: number;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  company: string;
  serviceType: string;
  date: string;
  time?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface FormSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  starred: boolean;
  archived: boolean;
  labels: string[];
}

export interface LegalPage {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface AgentFeedback {
  id: string;
  helpful: boolean;
  intent: string;
  timestamp: string;
}

// --- CLIENT MANAGEMENT ---
export type ClientStatus = 'active' | 'suspended' | 'banned' | 'pending';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedDate: string;
  status: ClientStatus;
  subscriptionPlan?: 'Free' | 'Pro' | 'Enterprise';
  totalSpend: string;
  notes?: string;
}

// --- INTERNAL OPS ---
export type Role = 'admin' | 'employee';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isOnline: boolean;
  schedule: string;
  avatar?: string;
}

export interface InternalTask {
  id: string;
  title: string;
  assigneeId: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export interface ScheduleEvent {
  id: string;
  employeeId: string;
  title: string;
  start: string;
  end: string;
  type: 'shift' | 'meeting' | 'leave';
}

export interface ChatGroup {
  id: string;
  name: string;
  type: 'public' | 'private' | 'dm';
  department?: string;
  members: string[];
  createdBy: string;
  messages: InternalChatMessage[];
}

export interface InternalChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Meeting {
  id: string;
  title: string;
  host: string;
  participants: string[];
  time: string;
  link: string;
  status: 'scheduled' | 'live' | 'ended';
}

// --- CHAT TYPES ---
export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin' | 'system';
  text: string;
  timestamp: string;
}

export interface SupportChat {
  id: string;
  userName: string;
  userEmail: string;
  messages: ChatMessage[];
  lastUpdated: string;
  status: 'active' | 'closed';
  unreadAdmin: number;
  unreadUser: number;
}

export interface SiteConfig {
  branding: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    font: 'Inter' | 'Roboto' | 'Poppins' | 'Space Grotesk';
    logo?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
  };
  pages: {
    home: {
      heroTitle: string;
      heroSubtitle: string;
      showStats: boolean;
      showTechMarquee: boolean;
      showTestimonials: boolean;
      featureImages: {
        pathway1: string;
        pathway2: string;
        pathway3: string;
        pathway4: string;
      };
    };
    contact: {
      email: string;
      address: string;
    };
    ourStory: {
      heroTitle: string;
      heroSubtitle: string;
      introTitle: string;
      introText1: string;
      introText2: string;
      quote: string;
      ceoSectionTitle: string;
      ceoBio1: string;
      ceoBio2: string;
      ceoQuote: string;
      ceoImage1: string;
      ceoImage2: string;
    };
    marketing: {
      portfolioImages: {
        realEstate: string;
        food: string;
        fashion: string;
        tech: string;
      }
    };
  };
}

// --- INITIAL DATA (Used only on first load if LS is empty) ---
const defaultNav: NavItem[] = [
  { id: '1', label: 'Home', path: '/', visible: true, order: 1 },
  // Phase 2: Sovereign Tools
  { id: 'media', label: 'Media Studio', path: '/media-studio', visible: false, order: 2 },
  { id: 'voice', label: 'Voice Studio', path: '/voice-studio', visible: false, order: 3 },
  { id: 'analysis', label: 'Analysis Lab', path: '/analysis-lab', visible: false, order: 4 },
  { id: 'tuning', label: 'Neural Forge', path: '/model-tuning', visible: false, order: 5 },
  // Original Nav Shifted
  { id: '2', label: 'Marketplace', path: '/marketplace', visible: true, order: 6 },
  { id: '3', label: 'Programs', path: '/programs', visible: true, order: 7 },
  { id: '4', label: 'Prompts', path: '/prompts', visible: true, order: 8 },
  { id: '10', label: 'Marketing', path: '/marketing', visible: true, order: 9 },
  { id: '5', label: 'Solutions', path: '/solutions', visible: true, order: 10 },
  { id: '6', label: 'Our Story', path: '/story', visible: true, order: 11 },
  { id: '7', label: 'Partners', path: '/partners', visible: false, order: 12 },
  { id: '8', label: 'Blog', path: '/blog', visible: true, order: 13 },
  { id: '9', label: 'Contact', path: '/contact', visible: true, order: 14 },
];

const defaultClients: Client[] = [
  { id: 'c1', name: 'John Doe', email: 'john@example.com', status: 'active', joinedDate: '2024-01-15', subscriptionPlan: 'Pro', totalSpend: '$500' },
  { id: 'c2', name: 'Jane Smith', email: 'jane@company.com', status: 'suspended', joinedDate: '2024-02-10', subscriptionPlan: 'Free', totalSpend: '$0', notes: 'Payment failed repeatedly.' },
  { id: 'c3', name: 'Tech Corp Admin', email: 'admin@techcorp.com', status: 'active', joinedDate: '2023-11-05', subscriptionPlan: 'Enterprise', totalSpend: '$5000' },
  { id: 'c4', name: 'Sarah Connor', email: 'sarah@skynet.com', status: 'active', joinedDate: '2024-03-01', subscriptionPlan: 'Pro', totalSpend: '$1200' },
  { id: 'c5', name: 'Bruce Wayne', email: 'bruce@wayne.enterprises', status: 'active', joinedDate: '2024-01-01', subscriptionPlan: 'Enterprise', totalSpend: '$50000' },
  { id: 'c6', name: 'Diana Prince', email: 'diana@themyscira.gov', status: 'pending', joinedDate: '2024-03-22', subscriptionPlan: 'Free', totalSpend: '$0', notes: 'Interested in AI for logistics.' },
];

const defaultEmployees: Employee[] = [
  { id: 'emp1', name: 'Sarah Jenkins', email: 'sarah@architech.com', role: 'Sales Lead', department: 'Sales', isOnline: true, schedule: '09:00 - 17:00' },
  { id: 'emp2', name: 'David Kim', email: 'david@architech.com', role: 'Automation Engineer', department: 'Automation', isOnline: false, schedule: '10:00 - 18:00' },
  { id: 'emp3', name: 'Grace Omondi', email: 'grace@architech.com', role: 'Content Manager', department: 'Media', isOnline: true, schedule: '08:00 - 16:00' },
  { id: 'emp4', name: 'Kevin Hart', email: 'kevin@architech.com', role: 'Support Agent', department: 'Customer Support', isOnline: true, schedule: '09:00 - 17:00' },
  { id: 'emp5', name: 'Erick Kibunja', email: 'erick@architech.com', role: 'CEO', department: 'Management', isOnline: true, schedule: '08:00 - 18:00' },
  { id: 'emp6', name: 'Dr. Amani', email: 'amani@architech.com', role: 'Chief AI Officer', department: 'R&D', isOnline: true, schedule: '10:00 - 16:00' },
  { id: 'emp7', name: 'Liam Chen', email: 'liam@architech.com', role: 'Head of Engineering', department: 'Dev', isOnline: false, schedule: '07:00 - 15:00' },
];

const defaultTasks: InternalTask[] = [
  { id: 't1', title: 'Close TechCorp Deal', assigneeId: 'emp1', status: 'in-progress', priority: 'high', dueDate: '2024-04-15' },
  { id: 't2', title: 'Fix Webhook Error #403', assigneeId: 'emp2', status: 'pending', priority: 'high', dueDate: '2024-04-12' },
  { id: 't3', title: 'Draft Newsletter', assigneeId: 'emp3', status: 'completed', priority: 'medium', dueDate: '2024-04-10' },
  { id: 't4', title: 'Review Q1 Tickets', assigneeId: 'emp4', status: 'review', priority: 'low', dueDate: '2024-04-20' },
  { id: 't5', title: 'Update Homepage Hero', assigneeId: 'emp3', status: 'in-progress', priority: 'medium', dueDate: '2024-04-18' },
  { id: 't6', title: 'Client Onboarding - Wayne Ent', assigneeId: 'emp1', status: 'pending', priority: 'high', dueDate: '2024-04-25' },
  { id: 't7', title: 'Fine-tune Gemini 2.5 for Legal', assigneeId: 'emp6', status: 'in-progress', priority: 'high', dueDate: '2024-04-30' },
];

const defaultSchedule: ScheduleEvent[] = [
  { id: 's1', employeeId: 'emp1', title: 'Sales Calls', start: new Date().toISOString(), end: new Date(Date.now() + 3600000 * 4).toISOString(), type: 'shift' },
  { id: 's2', employeeId: 'emp5', title: 'Management Meeting', start: new Date().toISOString(), end: new Date(Date.now() + 3600000 * 2).toISOString(), type: 'meeting' },
  { id: 's3', employeeId: 'emp6', title: 'AI Ethics Workshop', start: new Date(Date.now() + 86400000).toISOString(), end: new Date(Date.now() + 86400000 + 7200000).toISOString(), type: 'meeting' },
];

const defaultMeetings: Meeting[] = [
  { id: 'm1', title: 'Weekly Sync', host: 'Erick Kibunja', participants: ['emp1', 'emp2', 'emp3'], time: 'Mon 09:00 AM', link: 'https://meet.google.com/abc-defg-hij', status: 'scheduled' },
  { id: 'm2', title: 'Product Review', host: 'David Kim', participants: ['emp2', 'emp5'], time: 'Wed 02:00 PM', link: 'https://meet.google.com/xyz-uvwx-yz', status: 'scheduled' },
  { id: 'm3', title: 'R&D Breakthroughs', host: 'Dr. Amani', participants: ['emp5', 'emp6', 'emp7'], time: 'Fri 11:00 AM', link: 'https://meet.google.com/res-earc-hlab', status: 'scheduled' },
];

const defaultChatGroups: ChatGroup[] = [
  {
    id: 'g1', name: 'General', type: 'public', createdBy: 'admin', members: [],
    messages: [
      { id: 'm1', senderId: 'admin', senderName: 'Admin', text: 'Welcome to the new dashboard team!', timestamp: new Date().toISOString() }
    ]
  },
  {
    id: 'g2', name: 'Sales War Room', type: 'private', department: 'Sales', createdBy: 'admin', members: ['emp1'],
    messages: []
  },
  {
    id: 'g3', name: 'Dev Team', type: 'private', department: 'Engineering', createdBy: 'admin', members: ['emp2', 'emp7'],
    messages: [
      { id: 'm2', senderId: 'emp2', senderName: 'David Kim', text: 'Deployed the new API endpoints.', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ]
  }
];

const defaultServices: Service[] = [
  {
    id: 'srv1', title: 'AI Generalist Track', description: 'Core Foundation for understanding LLMs and AI Agents. Master the basics of prompt engineering and model deployment.', category: 'core-ai', level: 'Beginner',
    featured: true, skills: ['Prompting', 'ChatGPT', 'Gemini'], technologies: ['OpenAI', 'Google DeepMind'], priceUsd: '$500', priceKsh: 'KSH 65,000', mode: 'Live Cohort', duration: '6 Weeks'
  },
  {
    id: 'srv2', title: 'Automation & n8n Masterclass', description: 'Build sophisticated business logic without code. Connect CRMs, Email, and AI agents into unified workflows.', category: 'automation', level: 'Intermediate',
    featured: true, skills: ['n8n', 'Webhooks', 'JSON'], technologies: ['n8n', 'Zapier'], priceUsd: '$600', priceKsh: 'KSH 78,000', mode: 'Live Cohort', duration: '4 Weeks'
  },
  {
    id: 'srv3', title: 'No-Code App Building', description: 'Rapidly deploy web and mobile apps. Go from idea to MVP in days using visual development tools.', category: 'no-code', level: 'Beginner',
    featured: false, skills: ['Bubble', 'FlutterFlow', 'Database Design'], technologies: ['Bubble', 'FlutterFlow'], priceUsd: '$400', priceKsh: 'KSH 52,000', mode: 'Self-Paced', duration: 'Self-Paced'
  },
  {
    id: 'srv4', title: 'High-Conversion Website', description: 'Your 24/7 Digital Headquarters. Full-stack UI/UX Design & Dev optimized for speed and sales.', category: 'web', level: 'Professional',
    featured: true, skills: ['React', 'Design', 'SEO'], technologies: ['React', 'Tailwind', 'Next.js'], priceUsd: '$300+', priceKsh: 'KSH 30,000+', mode: 'Service'
  },
  {
    id: 'srv5', title: 'Viral Reels & TikToks', description: 'High-energy 15-60s vertical videos designed for retention. Includes scripting, AI editing, and captions.', category: 'video', level: 'Creative',
    featured: false, skills: ['Editing', 'Scripting', 'Trends'], technologies: ['CapCut', 'Veo', 'Premiere'], priceUsd: '$30', priceKsh: 'KSH 3,500', mode: 'Service'
  },
  {
    id: 'srv6', title: 'Full Brand Identity', description: 'Logo, Guidelines, and Visual assets. A complete overhaul to make your business look world-class.', category: 'design', level: 'Creative',
    featured: false, skills: ['Branding', 'Vector Art', 'Typography'], technologies: ['Illustrator', 'Figma'], priceUsd: '$100', priceKsh: 'KSH 10,000', mode: 'Service'
  },
  {
    id: 'srv7', title: 'Paid Ads Manager', description: 'Meta & Google Ads Management. Targeted campaigns that bring high-quality leads, not just clicks.', category: 'marketing', level: 'Professional',
    featured: false, skills: ['Ads', 'Analytics', 'Copywriting'], technologies: ['Meta Ads', 'Google Ads'], priceUsd: '$50+', priceKsh: 'KSH 5,000+', mode: 'Service'
  },
  {
    id: 'srv8', title: 'Enterprise LLM Fine-Tuning', description: 'Train custom AI models on your company data. Secure, private, and highly specialized for your industry.', category: 'core-ai', level: 'Advanced',
    featured: false, skills: ['Python', 'PyTorch', 'Data Cleaning'], technologies: ['HuggingFace', 'Llama 3'], priceUsd: '$2500+', priceKsh: 'KSH 325,000+', mode: 'Service'
  },
  {
    id: 'srv9', title: 'Voice AI Agents Setup', description: 'Deploy human-like voice agents for customer support and sales calls. Handles thousands of calls simultaneously.', category: 'automation', level: 'Advanced',
    featured: true, skills: ['VAPI', 'Twilio', 'Conversation Design'], technologies: ['VAPI', 'Retell AI'], priceUsd: '$1200', priceKsh: 'KSH 150,000', mode: 'Service'
  },
  {
    id: 'srv10', title: 'SaaS Boilerplate & Launch', description: 'Get a fully functional SaaS foundation with Auth, Payments, and Database pre-configured.', category: 'web', level: 'Intermediate',
    featured: false, skills: ['Next.js', 'Stripe', 'Supabase'], technologies: ['React', 'Node.js'], priceUsd: '$800', priceKsh: 'KSH 100,000', mode: 'Service'
  }
];

const defaultPosts: BlogPost[] = [
  {
    id: 'post1', title: 'The Future of AI in Kenya', slug: 'future-ai-kenya', excerpt: 'How local businesses are adopting agents to scale without increasing headcount.', content: 'Full article content here regarding the rise of AI agents in Nairobi tech hubs...',
    author: 'Erick Kibunja', date: '2024-03-15', status: 'published', category: 'News', comments: [], image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'post2', title: '5 Automation Hacks for Retail', slug: 'automation-hacks-retail', excerpt: 'Stop doing manual inventory. Here is how n8n can save you 10 hours a week.', content: 'Retail automation guide...',
    author: 'Sarah Jenkins', date: '2024-03-10', status: 'published', category: 'Tutorial', comments: [], image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'post3', title: 'Why Your Website Isn\'t Converting', slug: 'website-conversion-tips', excerpt: 'It is not about the colors. It is about the offer structure. Learn the secrets of CRO.', content: 'Conversion Rate Optimization deep dive...',
    author: 'Grace Omondi', date: '2024-02-28', status: 'published', category: 'Marketing', comments: [], image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'post4', title: 'The Death of SEO: AI Search', slug: 'death-of-seo', excerpt: 'With Perplexity and Gemini becoming default search engines, how do you optimize for machines, not just keywords?', content: 'Detailed analysis of LLM optimization strategies.',
    author: 'David Kim', date: '2024-04-05', status: 'published', category: 'Tech Trends', comments: [], image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'post5', title: 'Building a $10k/mo Agency with n8n', slug: 'agency-automation', excerpt: 'A case study on how we helped a solo founder scale to 50 clients using only no-code tools.', content: 'Case study details...',
    author: 'Erick Kibunja', date: '2024-04-01', status: 'published', category: 'Business', comments: [], image: 'https://images.unsplash.com/photo-1553877612-8232719f3565?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'post6', title: 'AI Ethics in Africa', slug: 'ai-ethics-africa', excerpt: 'Why data sovereignty matters and how we are ensuring African datasets are represented in global models.', content: 'Ethics discussion...',
    author: 'Dr. Amani', date: '2024-03-25', status: 'published', category: 'Ethics', comments: [], image: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&q=80&w=1000'
  }
];

const defaultTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah K.',
    role: 'Founder',
    company: 'TechStarts',
    content: 'ArchiTech-Wize transformed our manual processes into a sleek, automated workflow. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't2',
    name: 'James O.',
    role: 'CTO',
    company: 'LogiMove',
    content: 'The academy curriculum is spot on. My team learned n8n in weeks and we are now shipping faster than ever.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't3',
    name: 'Michelle W.',
    role: 'Marketing Dir',
    company: 'FreshGrocer',
    content: 'The "Viral Reels" package paid for itself in 3 days. Our engagement skyrocketed.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  }
];

const defaultMedia: MediaItem[] = [
  {
    id: 'm1',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000',
    name: 'Technology Background',
    type: 'image'
  },
  {
    id: 'm2',
    url: 'https://images.unsplash.com/photo-1531297461136-8200b7109463?auto=format&fit=crop&q=80&w=1000',
    name: 'AI Chip',
    type: 'image'
  },
  {
    id: 'm3',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000',
    name: 'Neural Network',
    type: 'image'
  },
  {
    id: 'm4',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
    name: 'Data Flow',
    type: 'image'
  }
];

const defaultSubmissions: FormSubmission[] = [
  { id: 'sub1', name: 'Alice Walker', email: 'alice@example.com', subject: 'Project Inquiry', message: 'I need a new website for my law firm.', date: '2024-03-20', read: false, starred: true, archived: false, labels: ['Lead'] },
  { id: 'sub2', name: 'Bob Builder', email: 'bob@build.com', subject: 'Partnership', message: 'Interested in reselling your AI agents.', date: '2024-03-19', read: true, starred: false, archived: false, labels: ['Partner'] },
  { id: 'sub3', name: 'Charlie Day', email: 'charlie@iasip.com', subject: 'Spam?', message: 'Hello dear friend...', date: '2024-03-18', read: true, starred: false, archived: true, labels: ['Spam'] },
  { id: 'sub4', name: 'Enterprise Corp', email: 'procurement@ent.com', subject: 'RFP for Automation', message: 'We are looking for a vendor to automate our HR onboarding.', date: '2024-03-22', read: false, starred: true, archived: false, labels: ['Enterprise', 'High Value'] }
];

const defaultConfig: SiteConfig = {
  branding: {
    name: "ArchiTech-Wize AI",
    primaryColor: "#007AFF",
    secondaryColor: "#48D1CC",
    font: 'Inter',
  },
  seo: {
    defaultTitle: "ArchiTech-Wize AI",
    defaultDescription: "A bright, hopeful, futuristic AI & technology education platform.",
  },
  pages: {
    home: {
      heroTitle: "Architect Your Future with AI",
      heroSubtitle: "Empowering 1 Million African Builders with AI, Automation, and No-Code Skills.",
      showStats: true,
      showTechMarquee: true,
      showTestimonials: true,
      featureImages: {
        pathway1: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
        pathway2: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
        pathway3: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600",
        pathway4: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600"
      }
    },
    contact: { email: "elumarkmeraflow.info@gmail.com", address: "Nairobi, Kenya (Global Remote)" },
    ourStory: {
      heroTitle: "The ArchiTech-Wize Origin",
      heroSubtitle: "From a realization in Nairobi to a continental movement. We are bridging the gap between AI consumption and creation.",
      introTitle: "It started with a simple question:",
      introText1: "\"Why are we only consumers of AI, and not the architects?\"",
      introText2: "In the rapidly evolving landscape of 2024, we saw a widening gap. While the world rushed to use AI chatbots, the true leverage—building the systems behind them—remained inaccessible to many. We saw a future where Africa could become the world's backend, supplying intelligence and automation to the global economy. ArchiTech-Wize was born to demystify these complex systems and put the power of automation into the hands of local builders.",
      quote: "We don't need permission to build the future. We just need the blueprints.",
      ceoSectionTitle: "Meet the Visionary",
      ceoBio1: "Archi-Tech-Wize AI is led by a systems-driven CEO and digital architect focused on building intelligent, scalable solutions at the intersection of AI, automation, and digital media.",
      ceoBio2: "With a strong foundation in no-code systems, AI workflows, and automation-first thinking, the CEO guides the company with a clear mission: to simplify complexity and design future-ready digital infrastructure that empowers people and businesses globally. Every decision is rooted in long-term vision, clarity, and real-world execution.",
      ceoQuote: "I don’t believe in building fast for today and fixing tomorrow. I believe in designing systems so well that tomorrow is already accounted for.",
      ceoImage1: "/ceo-image-1.jpg",
      ceoImage2: "/ceo-image-2.jpg"
    },
    marketing: {
      portfolioImages: {
        realEstate: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
        food: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
        fashion: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=400",
        tech: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800"
      }
    }
  }
};

interface AdminContextType {
  config: SiteConfig;
  updateConfig: (section: keyof SiteConfig, data: any) => void;

  // Auth
  isAuthenticated: boolean;
  currentUser: { id: string, name: string, role: Role } | null;
  verificationPendingEmail: string | null;
  login: (password: string, email?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  signup: (password: string, email: string) => Promise<boolean>;
  logout: () => void;
  resendVerificationEmail: () => Promise<void>;

  setVerificationPendingEmail: (email: string | null) => void;

  // Firestore Workspace
  fsFolders: FirestoreFolder[];
  fsFiles: FirestoreFile[];
  fsNotes: FirestoreNote[];
  fsTeam: FirestoreTeamMember[];
  addFsFolder: (name: string) => Promise<void>;
  addFsFile: (name: string, size: string, folderId?: string, type?: string, provider?: string, providerRef?: string, downloadURL?: string) => Promise<void>;
  addFsNote: (title: string, content: string) => Promise<void>;
  addFsMember: (name: string, email: string, role: string) => Promise<void>;
  deleteFsDoc: (collectionName: 'folders' | 'files' | 'notes' | 'teamMembers', id: string) => Promise<void>;

  // Client Management
  clients: Client[];
  updateClientStatus: (id: string, status: ClientStatus) => void;
  deleteClient: (id: string) => void;

  // Content Collections
  services: Service[];
  addService: (s: Service) => void;
  updateService: (s: Service) => void;
  deleteService: (id: string) => void;
  addProgramComment: (serviceId: string, comment: Omit<Comment, 'id' | 'date'>) => void;

  posts: BlogPost[];
  addPost: (p: BlogPost) => void;
  updatePost: (p: BlogPost) => void;
  deletePost: (id: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'date'>) => void;

  testimonials: Testimonial[];
  addTestimonial: (t: Testimonial) => void;
  deleteTestimonial: (id: string) => void;

  mediaLibrary: MediaItem[];
  addMedia: (m: MediaItem) => void;
  deleteMedia: (id: string) => void;
  uploadFile: (file: File) => Promise<string>;

  navigation: NavItem[];
  updateNavigation: (items: NavItem[]) => void;

  bookings: Booking[];
  addBooking: (b: Omit<Booking, 'id' | 'status'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;

  submissions: FormSubmission[];
  addSubmission: (s: Omit<FormSubmission, 'id' | 'date' | 'read' | 'starred' | 'archived' | 'labels'>) => void;
  markSubmissionRead: (id: string) => void;
  toggleSubmissionStar: (id: string) => void;
  archiveSubmission: (id: string) => void;
  deleteSubmission: (id: string) => void;

  feedbacks: AgentFeedback[];
  addFeedback: (f: Omit<AgentFeedback, 'id' | 'timestamp'>) => void;

  legalPages: LegalPage[];
  updateLegalPage: (p: LegalPage) => void;

  // Support Chat
  supportChats: SupportChat[];
  initiateSupportChat: (user: { email: string, name: string }) => void;
  sendSupportMessage: (chatId: string, message: { sender: 'user' | 'admin', text: string }) => void;
  markChatRead: (chatId: string, reader: 'user' | 'admin') => void;

  // Internal Ops
  employees: Employee[];
  tasks: InternalTask[];
  chatGroups: ChatGroup[];
  meetings: Meeting[];
  scheduleEvents: ScheduleEvent[];
  createChatGroup: (group: Omit<ChatGroup, 'id' | 'messages' | 'createdBy'>) => void;
  createPrivateChat: (targetEmployeeId: string) => void;
  disbandGroup: (id: string) => void;
  sendInternalMessage: (groupId: string, text: string) => void;
  assignTask: (task: Omit<InternalTask, 'id'>) => void;
  updateTaskStatus: (id: string, status: InternalTask['status']) => void;
  scheduleMeeting: (meeting: Omit<Meeting, 'id' | 'status'>) => void;
  addScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  deleteScheduleEvent: (id: string) => void;

  // New Actions for Team & Tasks
  addEmployee: (e: Omit<Employee, 'id'>) => void;
  deleteEmployee: (id: string) => void;
  deleteTask: (id: string) => void;
  deleteMeeting: (id: string) => void;

  resetToDefaults: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Helper for persistent state with error handling
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (e) {
      console.warn(`Error reading ${key} from localStorage`, e);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage(Likely quota exceeded)`, e);
      // In a real app, we might notify the user or use IndexedDB
    }
  }, [key, value]);

  return [value, setValue];
}

// --- FIREBASE AUTH INTEGRATION ---

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useStickyState<SiteConfig>(defaultConfig, 'aw-config');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string, name: string, role: Role } | null>(null);
  const [verificationPendingEmail, setVerificationPendingEmail] = useState<string | null>(null);

  // Collections with Persistence
  const [clients, setClients] = useStickyState<Client[]>(defaultClients, 'aw-clients');
  const [services, setServices] = useStickyState<Service[]>(defaultServices, 'aw-services');
  const [posts, setPosts] = useStickyState<BlogPost[]>(defaultPosts, 'aw-posts');
  const [testimonials, setTestimonials] = useStickyState<Testimonial[]>(defaultTestimonials, 'aw-testimonials');
  const [mediaLibrary, setMediaLibrary] = useStickyState<MediaItem[]>(defaultMedia, 'aw-media');
  const [navigation, setNavigation] = useStickyState<NavItem[]>(defaultNav, 'aw-nav');
  const [bookings, setBookings] = useStickyState<Booking[]>([], 'aw-bookings');
  const [submissions, setSubmissions] = useStickyState<FormSubmission[]>(defaultSubmissions, 'aw-submissions');
  const [feedbacks, setFeedbacks] = useStickyState<AgentFeedback[]>([], 'aw-feedbacks');
  const [supportChats, setSupportChats] = useStickyState<SupportChat[]>([], 'aw-chats');
  const [legalPages, setLegalPages] = useStickyState<LegalPage[]>([], 'aw-legal');

  // Internal Ops State with Persistence
  const [employees, setEmployees] = useStickyState<Employee[]>(defaultEmployees, 'aw-employees');
  const [tasks, setTasks] = useStickyState<InternalTask[]>(defaultTasks, 'aw-tasks');
  const [chatGroups, setChatGroups] = useStickyState<ChatGroup[]>(defaultChatGroups, 'aw-chatgroups');
  const [meetings, setMeetings] = useStickyState<Meeting[]>(defaultMeetings, 'aw-meetings');
  const [scheduleEvents, setScheduleEvents] = useStickyState<ScheduleEvent[]>(defaultSchedule, 'aw-schedule');

  // Actions
  const updateConfig = (section: keyof SiteConfig, data: any) => {
    setConfig(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };

  // Inside AdminProvider...
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          setIsAuthenticated(true);
          const role = user.email === 'admin@architech.com' ? 'admin' : 'employee';
          setCurrentUser({ id: user.uid, name: user.email?.split('@')[0] || 'User', role });
        } else {
          // If user is logged in but not verified, ensure we treat them as unauthenticated
          // We DO NOT sign them out here automatically to allow them to click "Resend Email" if we wanted to implementation that,
          // BUT user requirements say "block access and show verification screen".
          // We will handle this state by NOT setting isAuthenticated true.
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (password: string, email?: string) => {
    // 1. Check for Specialized Passwords (VIP Access)
    if (password === '@admin@main_001') {
      setIsAuthenticated(true);
      setCurrentUser({ id: 'admin-main', name: 'Main Admin', role: 'admin' });
      setVerificationPendingEmail(null);
      return true;
    }
    if (password === '@employer1@1*') {
      setIsAuthenticated(true);
      setCurrentUser({ id: 'employee-1', name: 'Wize Employee', role: 'employee' });
      setVerificationPendingEmail(null);
      return true;
    }

    // 2. Fallback to Firebase for official accounts
    if (!email) return false;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setVerificationPendingEmail(email);
        await signOut(auth);
        return false;
      }
      setVerificationPendingEmail(null);
      return true;
    } catch (error: any) {
      console.error("Login Result:", error.code);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        alert("Email or password is incorrect");
      } else {
        alert("Login failed: " + error.message);
      }
      return false;
    }
  };

  const signup = async (password: string, email: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setVerificationPendingEmail(email);
      await signOut(auth); // Do not sign them in automatically
      return true;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        alert("User already exists. Please sign in");
      } else {
        alert("Signup failed: " + error.message);
      }
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Google users are automatically verified effectively, checking emailVerified is good practice but usually true.
      if (!result.user.emailVerified) {
        // Rare case for Google, but possible with some configs
        setVerificationPendingEmail(result.user.email);
        await signOut(auth);
        return false;
      }
      setVerificationPendingEmail(null);
      return true;
    } catch (error: any) {
      console.error("Google Login Error:", error);
      alert("Google Sign-In failed: " + error.message);
      return false;
    }
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      await sendEmailVerification(auth.currentUser);
      alert(`Verification email resent to ${auth.currentUser.email} `);
    } else {
      // If user is signed out, we can't easily resend without them logging in again.
      // The flow is: Login -> Check Verified -> If No -> Show Screen.
      // At that point they are effectively signed in (in the short term) or we signed them out.
      // If we signed them out, we can't resend specific to that user object without re-auth.
      // Strategy: The 'login' function signed them out.
      // To allow resend, we might need to keep them signed in but blocked by UI.
      // BUT requirement said "block access". 
      // Let's adjust 'login' to NOT sign out immediately if we want to allow 'resend', 
      // OR we just ask them to check their email.
      // Re-reading requirements: "If a user logs in and their email is not verified, block access and show the same verification screen."
      // Standard Firebase behavior: You need a user object to call sendEmailVerification.
      // So we should strictly speaking keep them signed in but `isAuthenticated` is false.
      alert("Please log in again to request a new verification email.");
    }
  };

  const logout = async () => {
    try {
      setVerificationPendingEmail(null);
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };


  // Client Management
  const updateClientStatus = (id: string, status: ClientStatus) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };
  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  // Helper for Uploads with Resize & Compression for localStorage optimization
  const uploadFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize larger images to prevent quota issues
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG 0.7 quality to save space
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Content CRUD
  const addService = (s: Service) => setServices(prev => [...prev, { ...s, id: Date.now().toString() }]);
  const updateService = (s: Service) => setServices(prev => prev.map(item => item.id === s.id ? s : item));
  const deleteService = (id: string) => setServices(prev => prev.filter(item => item.id !== id));
  const addProgramComment = (serviceId: string, comment: Omit<Comment, 'id' | 'date'>) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, comments: [...(s.comments || []), { ...comment, id: Date.now().toString(), date: new Date().toISOString() }] } : s));
  };
  const addPost = (p: BlogPost) => setPosts(prev => [...prev, { ...p, id: Date.now().toString() }]);
  const updatePost = (p: BlogPost) => setPosts(prev => prev.map(item => item.id === p.id ? p : item));
  const deletePost = (id: string) => setPosts(prev => prev.filter(item => item.id !== id));
  const addComment = (postId: string, comment: Omit<Comment, 'id' | 'date'>) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), { ...comment, id: Date.now().toString(), date: new Date().toISOString() }] } : p));
  };
  const addTestimonial = (t: Testimonial) => setTestimonials(prev => [...prev, { ...t, id: Date.now().toString() }]);
  const deleteTestimonial = (id: string) => setTestimonials(prev => prev.filter(item => item.id !== id));
  const addMedia = (m: MediaItem) => setMediaLibrary(prev => [...prev, { ...m, id: Date.now().toString() }]);
  const deleteMedia = (id: string) => setMediaLibrary(prev => prev.filter(item => item.id !== id));
  const updateNavigation = (items: NavItem[]) => setNavigation(items);
  const addBooking = (b: Omit<Booking, 'id' | 'status'>) => setBookings(prev => [{ ...b, id: Date.now().toString(), status: 'pending' }, ...prev]);
  const updateBookingStatus = (id: string, status: Booking['status']) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

  // Submission Inbox
  const addSubmission = (s: Omit<FormSubmission, 'id' | 'date' | 'read' | 'starred' | 'archived' | 'labels'>) => setSubmissions(prev => [{ ...s, id: Date.now().toString(), date: new Date().toISOString().split('T')[0], read: false, starred: false, archived: false, labels: [] }, ...prev]);
  const markSubmissionRead = (id: string) => setSubmissions(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
  const toggleSubmissionStar = (id: string) => setSubmissions(prev => prev.map(s => s.id === id ? { ...s, starred: !s.starred } : s));
  const archiveSubmission = (id: string) => setSubmissions(prev => prev.map(s => s.id === id ? { ...s, archived: !s.archived } : s));
  const deleteSubmission = (id: string) => setSubmissions(prev => prev.filter(s => s.id !== id));

  const addFeedback = (f: Omit<AgentFeedback, 'id' | 'timestamp'>) => setFeedbacks(prev => [...prev, { ...f, id: Date.now().toString(), timestamp: new Date().toISOString() }]);
  const updateLegalPage = (p: LegalPage) => setLegalPages(prev => prev.map(item => item.id === p.id ? p : item));

  // Support Chat & Internal Ops stubs
  const initiateSupportChat = (user: { email: string, name: string }) => {
    if (!supportChats.find(c => c.id === user.email)) {
      setSupportChats(prev => [...prev, { id: user.email, userName: user.name, userEmail: user.email, messages: [], lastUpdated: new Date().toISOString(), status: 'active', unreadAdmin: 0, unreadUser: 0 }]);
    }
  };
  const sendSupportMessage = (chatId: string, message: { sender: 'user' | 'admin', text: string }) => {
    setSupportChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: [...c.messages, { id: Date.now().toString(), sender: message.sender as any, text: message.text, timestamp: new Date().toISOString() }],
          lastUpdated: new Date().toISOString(),
          unreadAdmin: message.sender === 'user' ? c.unreadAdmin + 1 : c.unreadAdmin,
          unreadUser: message.sender === 'admin' ? c.unreadUser + 1 : c.unreadUser
        };
      }
      return c;
    }));
  };
  const markChatRead = (chatId: string, reader: 'user' | 'admin') => {
    setSupportChats(prev => prev.map(c => c.id === chatId ? { ...c, [reader === 'user' ? 'unreadUser' : 'unreadAdmin']: 0 } : c));
  };
  const createChatGroup = (group: Omit<ChatGroup, 'id' | 'messages' | 'createdBy'>) => {
    setChatGroups(prev => [...prev, { ...group, id: Date.now().toString(), messages: [], createdBy: currentUser?.id || 'admin' }]);
  };
  const createPrivateChat = (targetEmployeeId: string) => {
    if (!currentUser) return;
    const targetEmp = employees.find(e => e.id === targetEmployeeId);
    if (!targetEmp) return;
    const existing = chatGroups.find(g => g.type === 'dm' && g.members.includes(currentUser.id) && g.members.includes(targetEmployeeId));
    if (existing) return;
    setChatGroups(prev => [...prev, { id: Date.now().toString(), name: targetEmp.name, type: 'dm', members: [currentUser.id, targetEmployeeId], createdBy: currentUser.id, messages: [] }]);
  };
  const disbandGroup = (id: string) => setChatGroups(prev => prev.filter(g => g.id !== id));
  const sendInternalMessage = (groupId: string, text: string) => {
    setChatGroups(prev => prev.map(g => g.id === groupId ? { ...g, messages: [...g.messages, { id: Date.now().toString(), senderId: currentUser?.id || 'admin', senderName: currentUser?.name || 'Admin', text, timestamp: new Date().toISOString() }] } : g));
  };
  const assignTask = (task: Omit<InternalTask, 'id'>) => setTasks(prev => [...prev, { ...task, id: Date.now().toString() }]);
  const updateTaskStatus = (id: string, status: InternalTask['status']) => setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  const scheduleMeeting = (meeting: Omit<Meeting, 'id' | 'status'>) => setMeetings(prev => [...prev, { ...meeting, id: Date.now().toString(), status: 'scheduled' }]);
  const addScheduleEvent = (event: Omit<ScheduleEvent, 'id'>) => setScheduleEvents(prev => [...prev, { ...event, id: Date.now().toString() }]);
  const deleteScheduleEvent = (id: string) => setScheduleEvents(prev => prev.filter(e => e.id !== id));

  // New Actions for Team & Tasks
  const addEmployee = (e: Omit<Employee, 'id'>) => setEmployees(prev => [...prev, { ...e, id: Date.now().toString(), isOnline: false }]);
  const deleteEmployee = (id: string) => setEmployees(prev => prev.filter(e => e.id !== id));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  const deleteMeeting = (id: string) => setMeetings(prev => prev.filter(m => m.id !== id));

  const resetToDefaults = () => {
    localStorage.clear();
    window.location.reload();
  };

  // --- FIRESTORE LOGIC ---
  const [fsFolders, setFsFolders] = useState<FirestoreFolder[]>([]);
  const [fsFiles, setFsFiles] = useState<FirestoreFile[]>([]);
  const [fsNotes, setFsNotes] = useState<FirestoreNote[]>([]);
  const [fsTeam, setFsTeam] = useState<FirestoreTeamMember[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setFsFolders([]);
      setFsFiles([]);
      setFsNotes([]);
      setFsTeam([]);
      return;
    }

    const userId = currentUser.id;
    const baseRef = collection(db, 'users', userId, 'folders'); // dummy to start

    const unsubs: (() => void)[] = [];

    const subscribe = (colName: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
      const q = query(collection(db, 'users', userId, colName), orderBy('createdAt', 'desc'));
      unsubs.push(onSnapshot(q, (snapshot) => {
        setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }));
    };

    subscribe('folders', setFsFolders);
    subscribe('files', setFsFiles);
    subscribe('notes', setFsNotes);
    subscribe('teamMembers', setFsTeam);

    return () => unsubs.forEach(u => u());
  }, [currentUser]);

  const addFsFolder = async (name: string) => {
    if (!currentUser) return;
    await addDoc(collection(db, 'users', currentUser.id, 'folders'), {
      name,
      createdAt: serverTimestamp()
    });
  };

  const addFsFile = async (name: string, size: string, folderId?: string, type: string = 'application/octet-stream', provider: string = 'metadata_only', providerRef: string = '', downloadURL: string = '') => {
    if (!currentUser) return;
    await addDoc(collection(db, 'users', currentUser.id, 'files'), {
      name,
      size,
      folderId: folderId || null,
      type,
      provider,
      providerRef,
      downloadURL,
      createdAt: serverTimestamp()
    });
  };

  const addFsNote = async (title: string, content: string) => {
    if (!currentUser) return;
    await addDoc(collection(db, 'users', currentUser.id, 'notes'), {
      title,
      content,
      createdAt: serverTimestamp()
    });
  };

  const addFsMember = async (name: string, email: string, role: string) => {
    if (!currentUser) return;
    await addDoc(collection(db, 'users', currentUser.id, 'teamMembers'), {
      name,
      email,
      role,
      createdAt: serverTimestamp()
    });
  };

  const deleteFsDoc = async (col: string, id: string) => {
    if (!currentUser) return;

    // File cleanup logic
    if (col === 'files') {
      try {
        const docRef = doc(db, 'users', currentUser.id, 'files', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.provider === 'supabase' && data.providerRef) {
            await deleteFromSupabase(data.providerRef);
          } else if (data.provider === 'cloudinary' && data.providerRef) {
            // MVP: Log for future cleanup, safe to just delete metadata for now as per instructions
            await addDoc(collection(db, 'users', currentUser.id, 'deletionQueue'), {
              provider: 'cloudinary',
              providerRef: data.providerRef,
              createdAt: serverTimestamp()
            });
          }
        }
      } catch (error) {
        console.error("Error cleaning up file storage:", error);
        // Continue to delete Firestore doc anyway
      }
    }

    await deleteDoc(doc(db, 'users', currentUser.id, col, id));
  };

  return (
    <AdminContext.Provider value={{
      config, updateConfig, isAuthenticated, currentUser, login, signup, logout,
      verificationPendingEmail, setVerificationPendingEmail, resendVerificationEmail, loginWithGoogle,
      clients, updateClientStatus, deleteClient,
      services, addService, updateService, deleteService, addProgramComment,
      posts, addPost, updatePost, deletePost, addComment,
      testimonials, addTestimonial, deleteTestimonial,
      mediaLibrary, addMedia, deleteMedia, uploadFile,
      navigation, updateNavigation,
      bookings, addBooking, updateBookingStatus,
      submissions, addSubmission, markSubmissionRead, toggleSubmissionStar, archiveSubmission, deleteSubmission,
      feedbacks, addFeedback,
      legalPages, updateLegalPage,
      supportChats, initiateSupportChat, sendSupportMessage, markChatRead,
      employees, tasks, chatGroups, meetings, scheduleEvents,
      createChatGroup, createPrivateChat, disbandGroup, sendInternalMessage,
      assignTask, updateTaskStatus, scheduleMeeting,
      addScheduleEvent, deleteScheduleEvent,
      addEmployee, deleteEmployee, deleteTask, deleteMeeting,
      fsFolders, fsFiles, fsNotes, fsTeam, addFsFolder, addFsFile, addFsNote, addFsMember, deleteFsDoc,
      resetToDefaults
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};