import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, MoveLeft } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-8 animate-bounce-slow">
                <span className="text-4xl font-bold text-slate-400 font-display">404</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 mb-4">
                Page Not Found
            </h1>

            <p className="text-lg text-slate-600 max-w-md mb-10 leading-relaxed">
                The architectural blueprint you are looking for doesn't exist or has been moved to a secure archive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex items-center gap-2 justify-center transition-colors"
                >
                    <MoveLeft size={18} /> Go Back
                </button>

                <Link
                    to="/"
                    className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-sky-600 flex items-center gap-2 justify-center transition-colors shadow-lg hover:shadow-xl"
                >
                    <Home size={18} /> Return Home
                </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-400 mb-4">Were you looking for one of these?</p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <Link to="/programs" className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-brand-primary hover:text-brand-primary transition-colors">Academy</Link>
                    <Link to="/marketplace" className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-brand-secondary hover:text-brand-secondary transition-colors">Marketplace</Link>
                    <Link to="/contact" className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-green-600 hover:text-green-600 transition-colors">Support</Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
