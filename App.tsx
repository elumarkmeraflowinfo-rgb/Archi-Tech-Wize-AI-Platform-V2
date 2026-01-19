import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import { UserProvider } from './context/UserContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import OurStory from './pages/OurStory';
import Programs from './pages/Programs';
import Partners from './pages/Partners';
import Contact from './pages/Contact';
import Solutions from './pages/Solutions';
import AdminDashboard from './pages/AdminDashboard';
import Legal from './pages/Legal';
import Blog from './pages/Blog';
import AIDemos from './pages/AIDemos';
import Marketplace from './pages/Marketplace';
import Prompts from './pages/Prompts';
import MarketingServices from './pages/MarketingServices';
import ClientPortal from './pages/ClientPortal';
import Checkout from './pages/Checkout';
import HowItWorks from './pages/HowItWorks';

import MediaStudio from './pages/MediaStudio';
import VoiceStudio from './pages/VoiceStudio';
import AnalysisLab from './pages/AnalysisLab';
import ModelTuning from './pages/ModelTuning';
import SovereignCoder from './pages/SovereignCoder';
import HarmonicEngine from './pages/HarmonicEngine';
import AdminSentinel from './pages/AdminSentinel';
import Subscription from './pages/Subscription';
import ModelHealthCheck from './pages/ModelHealthCheck';
import GlobalAssistant from './components/GlobalAssistant';

const App: React.FC = () => {
  return (
    <AdminProvider>
      <UserProvider>
        <SubscriptionProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <HashRouter>
                <GlobalAssistant />
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="story" element={<OurStory />} />
                    <Route path="how-it-works" element={<HowItWorks />} />
                    <Route path="programs" element={<Programs />} />
                    <Route path="solutions" element={<Solutions />} />
                    <Route path="demos" element={<AIDemos />} />
                    <Route path="marketplace" element={<Marketplace />} />
                    <Route path="prompts" element={<Prompts />} />
                    <Route path="marketing" element={<MarketingServices />} />
                    <Route path="partners" element={<Partners />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="privacy" element={<Legal />} />
                    <Route path="terms" element={<Legal />} />
                    <Route path="portal" element={<ClientPortal />} />
                    <Route path="checkout" element={<Checkout />} />

                    {/* Phase 2: Total Architectural Activation Routes */}
                    <Route path="subscription" element={<Subscription />} />
                    <Route path="media-studio" element={<MediaStudio />} />
                    <Route path="voice-studio" element={<VoiceStudio />} />
                    <Route path="analysis-lab" element={<AnalysisLab />} />
                    <Route path="model-tuning" element={<ModelTuning />} />
                    <Route path="sovereign-coder" element={<SovereignCoder />} />
                    <Route path="harmonic-engine" element={<HarmonicEngine />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/sentinel" element={<AdminSentinel />} />
                  <Route path="/admin/health-check" element={<ModelHealthCheck />} />
                </Routes>
              </HashRouter>
            </ErrorBoundary>
          </ThemeProvider>
        </SubscriptionProvider>
      </UserProvider>
    </AdminProvider>
  );
};

export default App;