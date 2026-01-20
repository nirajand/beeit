
import React, { useState, useEffect } from 'react';
import { Page, AppSettings } from './types';
import Navigation from './components/Navigation';
import Breadcrumbs from './components/Breadcrumbs';
import FloatingBee from './components/FloatingBee';
import HomeSection from './components/HomeSection';
import AboutSection from './components/AboutSection';
import EventSection from './components/EventSection';
import TeamSection from './components/TeamSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import ArticlesSection from './components/ArticlesSection';
import TrainingSection from './components/TrainingSection';
import AdminPanel from './components/AdminPanel';
import PrivacySection from './components/PrivacySection';
import TermsSection from './components/TermsSection';
import SitemapSection from './components/SitemapSection';
import BrandingSection from './components/BrandingSection';
import Footer from './components/Footer';
import BackgroundEffects from './components/BackgroundEffects';
import AgreementOverlay from './components/AgreementOverlay';
import LoadingScreen from './components/LoadingScreen';
import MeetingMinutesSection from './components/MeetingMinutesSection';
import MatrixEffect from './components/MatrixEffect';
import { DataProvider } from './context/DataContext';
import { ScrollProgress } from './components/ui/ScrollProgress';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [breadcrumbDetail, setBreadcrumbDetail] = useState<string | null>(null);
  const [hasAgreed, setHasAgreed] = useState<boolean>(() => {
    return localStorage.getItem('hive-agreement-v1') === 'true';
  });
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('hive-settings');
    if (saved) return JSON.parse(saved);
    return {
      theme: 'light',
      fontSize: 'default',
      highContrast: false,
      reduceMotion: false,
      dyslexicFont: false,
      matrixMode: false
    };
  });

  useEffect(() => {
    // Simulate loading sequence - 2 seconds exact
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('hive-settings', JSON.stringify(settings));
    const root = document.documentElement;
    
    if (settings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    
    if (settings.highContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');
    
    if (settings.reduceMotion) root.classList.add('reduce-motion');
    else root.classList.remove('reduce-motion');

    if (settings.dyslexicFont) root.classList.add('dyslexic-font');
    else root.classList.remove('dyslexic-font');
    
    root.classList.remove('text-large', 'text-xl');
    if (settings.fontSize === 'large') root.classList.add('text-large');
    if (settings.fontSize === 'xl') root.classList.add('text-xl');

  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setBreadcrumbDetail(null);
    window.scrollTo(0, 0);
  };

  const handleAgreement = () => {
    localStorage.setItem('hive-agreement-v1', 'true');
    setHasAgreed(true);
  };

  const renderContent = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomeSection onPageChange={handlePageChange} />;
      case Page.About:
      case Page.FAQ:
        return <AboutSection />;
      case Page.Events:
        return <EventSection onBreadcrumbUpdate={setBreadcrumbDetail} />;
      case Page.Contact:
        return <ContactSection />;
      case Page.Team:
        return <TeamSection />;
      case Page.Gallery:
        return <GallerySection onBreadcrumbUpdate={setBreadcrumbDetail} />;
      case Page.Articles:
        return <ArticlesSection />;
      case Page.Training:
        return <TrainingSection />;
      case Page.Minutes:
        return <MeetingMinutesSection />;
      case Page.Admin:
        return <AdminPanel />;
      case Page.Privacy:
        return <PrivacySection />;
      case Page.Terms:
        return <TermsSection />;
      case Page.Sitemap:
        return <SitemapSection onNavigate={handlePageChange} />;
      case Page.Branding:
        return <BrandingSection />;
      default:
        return <HomeSection onPageChange={handlePageChange} />;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <DataProvider>
      <ScrollProgress />
      {!hasAgreed && <AgreementOverlay onAgree={handleAgreement} />}
      
      {/* Matrix Overlay */}
      {settings.matrixMode && <MatrixEffect />}

      <div className={`min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-500 ${settings.theme === 'dark' ? 'bg-[#01041a]' : 'bg-[#F9FAFB]'} ${!hasAgreed ? 'h-screen overflow-hidden filter blur-sm' : ''}`}>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
          settings={settings}
          updateSettings={updateSettings}
        />
        
        {currentPage !== Page.Home && currentPage !== Page.Admin && (
          <Breadcrumbs 
            currentPage={currentPage} 
            detail={breadcrumbDetail} 
            onNavigate={handlePageChange} 
          />
        )}
        
        <main className={`flex-grow ${currentPage !== Page.Home ? 'pt-8' : ''}`}>
          {renderContent()}
        </main>

        <Footer onPageChange={handlePageChange} />
        
        {currentPage !== Page.Admin && (
          <FloatingBee 
            onPageChange={handlePageChange} 
            settings={settings}
            updateSettings={updateSettings}
          />
        )}
        
        <BackgroundEffects settings={settings} />

        <style>{`
          .high-contrast {
            --hive-blue: #000000;
            --hive-gold: #ffff00;
            filter: contrast(1.2);
          }
          
          .reduce-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }

          .dyslexic-font * {
            font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif !important;
            letter-spacing: 0.03em !important;
            line-height: 1.6 !important;
            word-spacing: 0.1em !important;
          }
          
          .text-large { font-size: 110%; }
          .text-xl { font-size: 125%; }
        `}</style>
      </div>
    </DataProvider>
  );
};

export default App;
