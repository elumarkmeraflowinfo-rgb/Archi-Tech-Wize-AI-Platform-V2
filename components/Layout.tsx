import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, Brain, Zap, ZapOff, MessageCircle, Lock, User, Sparkles, LogOut, Wifi, WifiOff, Layout as LayoutIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAdmin } from '../context/AdminContext';
import { useUser } from '../context/UserContext';
import AuthModal from './AuthModal';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { lowBandwidth, toggleLowBandwidth } = useTheme();
  const { config, navigation, isAuthenticated: isAdminAuthenticated } = useAdmin();
  const { user, isAuthenticated: isUserAuthenticated, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path: string) => location.pathname === path;

  // Filter visible nav items & sort
  const visibleNav = navigation.filter(n => n.visible).sort((a, b) => a.order - b.order);

  // Apply CMS font
  useEffect(() => {
    document.body.style.fontFamily = config.branding.font + ', sans-serif';
  }, [config.branding.font]);

  const handlePortalClick = () => {
    if (isUserAuthenticated) {
      navigate('/portal');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen text-slate-700 selection:bg-brand-secondary selection:text-white relative ${lowBandwidth ? 'low-bandwidth' : ''}`}>
      {!lowBandwidth && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-brand-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <header className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 transition-all duration-300 ${lowBandwidth ? 'shadow-sm' : ''}`}>
        <div className="h-1.5 w-full bg-tribal-gradient"></div>

        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            {config.branding.logo ? (
              <img src={config.branding.logo} alt={config.branding.name} className="h-10 w-auto rounded-lg object-contain" />
            ) : (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform ${!lowBandwidth ? 'group-hover:scale-105' : ''} bg-slate-900 border border-slate-700`}>
                <Brain size={24} className="text-brand-secondary" />
              </div>
            )}
            <span className="text-xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">{config.branding.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {visibleNav.map((link) => (
              <Link key={link.id} to={link.path} className={`text-sm font-medium transition-colors duration-200 font-display tracking-wide ${isActive(link.path) ? 'text-brand-primary font-bold' : 'text-slate-500 hover:text-brand-primary'}`} style={{ color: isActive(link.path) ? config.branding.primaryColor : undefined }}>
                {link.label}
              </Link>
            ))}

            <Link to="/how-it-works" className={`text-sm font-medium transition-colors duration-200 font-display tracking-wide ${isActive('/how-it-works') ? 'text-brand-primary font-bold' : 'text-slate-500 hover:text-brand-primary'}`}>
              How It Works
            </Link>

            <Link to="/demos" className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1 font-display tracking-wide ${isActive('/demos') ? 'text-brand-primary font-bold' : 'text-slate-500 hover:text-brand-primary'}`}>
              <Sparkles size={14} className="text-brand-secondary" /> AI Playground
            </Link>

            <div className="w-px h-6 bg-slate-200 mx-2"></div>

            <button onClick={toggleLowBandwidth} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${lowBandwidth ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-50/50 text-slate-500 border-slate-200 hover:bg-slate-100'}`} title={lowBandwidth ? "Enable rich animations" : "Enable Lite Mode for slow connections"}>
              {lowBandwidth ? <WifiOff size={14} /> : <Wifi size={14} />}
              <span className="hidden lg:inline">{lowBandwidth ? 'Lite' : 'Full'}</span>
            </button>

            {isUserAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <button onClick={handlePortalClick} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-all cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>
                <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className={`px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-brand-primary transition-all ${!lowBandwidth ? 'hover:shadow-lg hover:shadow-brand-primary/20' : ''}`}>
                Login / Join
              </button>
            )}

            <Link to="/admin" className={`p-2 rounded-full transition-colors ${isAdminAuthenticated ? 'text-brand-primary bg-sky-50' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`} title="Admin Dashboard">
              <Lock size={18} />
            </Link>
          </nav>

          <button onClick={toggleMenu} className="md:hidden p-2 text-slate-600 hover:text-slate-900">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-100 p-6 shadow-xl z-50 ${!lowBandwidth ? 'animate-fade-in-down' : ''}`}>
            <nav className="flex flex-col gap-4">
              {visibleNav.map((link) => (
                <Link key={link.id} to={link.path} onClick={closeMenu} className={`text-lg font-medium font-display ${isActive(link.path) ? 'text-brand-primary' : 'text-slate-600'}`}>{link.label}</Link>
              ))}
              <Link to="/demos" onClick={closeMenu} className="text-lg font-medium font-display text-slate-600 flex items-center gap-2"><Sparkles size={18} className="text-brand-secondary" /> AI Playground</Link>
              <hr className="border-slate-100 my-2" />
              <button onClick={() => { toggleLowBandwidth(); closeMenu(); }} className="flex items-center gap-2 text-slate-600 font-medium py-2">{lowBandwidth ? <WifiOff size={18} /> : <Wifi size={18} />}{lowBandwidth ? 'Disable Lite Mode' : 'Enable Lite Mode'}</button>

              {isUserAuthenticated && user ? (
                <div className="flex flex-col gap-2">
                  <button onClick={() => { handlePortalClick(); closeMenu(); }} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 w-full text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{user.name}</span>
                    </div>
                    <LayoutIcon size={18} className="text-slate-400" />
                  </button>
                  <button onClick={() => { logout(); closeMenu(); }} className="w-full text-center py-2 text-red-500 font-bold bg-red-50 rounded-xl">Logout</button>
                </div>
              ) : (
                <button onClick={() => { setShowAuthModal(true); closeMenu(); }} className="mt-4 w-full text-center px-6 py-3 rounded-xl bg-slate-900 text-white font-medium">Login / Join</button>
              )}

              <Link to="/admin" onClick={closeMenu} className="flex items-center justify-center gap-2 text-slate-500 font-medium py-4 mt-2 border-t border-slate-100 hover:text-slate-900">
                <Lock size={16} /> Admin Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow pt-20 relative z-10"><Outlet /></main>

      {location.pathname !== '/portal' && (
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className={`fixed bottom-6 right-6 z-40 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 group transition-all duration-300 ${!lowBandwidth ? 'hover:scale-110 hover:shadow-xl' : ''}`} aria-label="Chat on WhatsApp">
          <MessageCircle size={32} />
          <span className={`absolute right-full mr-3 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg ${!lowBandwidth ? 'translate-x-2 group-hover:translate-x-0' : ''}`}>
            Chat with Us on WhatsApp
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
          </span>
        </a>
      )}

      {location.pathname !== '/portal' && (
        <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-8 relative overflow-hidden z-20">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #d97706 25%, transparent 25%, transparent 75%, #d97706 75%, #d97706), linear-gradient(45deg, #d97706 25%, transparent 25%, transparent 75%, #d97706 75%, #d97706)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }}></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  {config.branding.logo ? <img src={config.branding.logo} className="h-8 w-auto rounded" alt="logo" /> : <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 bg-brand-secondary"><Brain size={18} /></div>}
                  <span className="text-lg font-bold font-display text-white">{config.branding.name}</span>
                </div>
                <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">Empowering Africa and the world through practical AI education. Building intelligent minds for a smarter, more equitable future.</p>
              </div>
              <div>
                <h4 className="font-semibold font-display text-brand-secondary mb-6">Platform</h4>
                <ul className="space-y-3">
                  <li><Link to="/programs" className="text-slate-400 hover:text-white transition-colors">Academy</Link></li>
                  <li><Link to="/solutions" className="text-slate-400 hover:text-white transition-colors">Business Solutions</Link></li>
                  <li><Link to="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold font-display text-brand-secondary mb-6">Contact</h4>
                <ul className="space-y-3">
                  <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors font-medium">Send a Message</Link></li>
                  <li className="text-slate-400">{config.pages.contact.email}</li>
                  <li className="text-slate-400">{config.pages.contact.address}</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-500">© 2024 {config.branding.name}. All rights reserved.</p>
              <div className="flex gap-6 text-sm text-slate-500 items-center">
                <Link to="/privacy" className="hover:text-white">Privacy</Link>
                <Link to="/terms" className="hover:text-white">Terms</Link>
                <Link to="/admin" className="flex items-center gap-1 hover:text-brand-secondary ml-4 border-l border-slate-800 pl-4 font-bold text-slate-600 transition-colors">
                  <Lock size={12} /> Admin Login
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;