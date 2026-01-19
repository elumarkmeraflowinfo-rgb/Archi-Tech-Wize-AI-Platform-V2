import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { Shield, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Legal: React.FC = () => {
  const { legalPages } = useAdmin();
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  const pageData = isPrivacy
    ? legalPages.find(p => p.id === 'privacy')
    : legalPages.find(p => p.id === 'terms');



  // Fallback content if CMS is empty
  const defaultContent = {
    title: isPrivacy ? "Privacy Policy" : "Terms of Service",
    lastUpdated: new Date().toLocaleDateString(),
    content: isPrivacy
      ? "Your privacy is important to us. We collect data to provide the services of the ArchiTech-Wize platform, including business generation and automation. We do not sell your personal data to third parties."
      : "By using ArchiTech-Wize AI, you agree to these terms. You retain ownership of content you generate. We retain rights to the platform infrastructure."
  };

  const finalData = pageData || defaultContent;

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
              {isPrivacy ? <Shield size={24} /> : <FileText size={24} />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{finalData.title}</h1>
              <p className="text-slate-500 text-sm">Last Updated: {finalData.lastUpdated}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none whitespace-pre-wrap">
            {finalData.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;