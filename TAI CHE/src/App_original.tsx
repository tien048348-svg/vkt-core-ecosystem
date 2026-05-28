import React, { useState, useEffect } from 'react';
import type { TabId } from './data/constants';
import { loadApiConfig, getValidKeyCount, hasAnyApiKey } from './services/aiService';
import { db } from './services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ApiKeyModal from './components/ApiKeyModal';
import ToastContainer from './components/Toast';
import SpyModule from './pages/SpyModule';
import ScriptModule from './pages/ScriptModule';
import StudioModule from './pages/StudioModule';
import SeoModule from './pages/SeoModule';
import AdminModule from './pages/AdminModule';

export interface GlobalSettings {
  maxDuration: number;
  allowedStyles: string[];
  enableAudioRefinement: boolean;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('spy');
  const [showConfig, setShowConfig] = useState(false);
  const [uiLang, setUiLang] = useState<'vi' | 'en'>('vi');
  const [isAdmin, setIsAdmin] = useState(false);
  const [keyCount, setKeyCount] = useState(0);
  const [scriptSegments, setScriptSegments] = useState<any[]>([]);
  const [scriptTopic, setScriptTopic] = useState('');
  const [strategyTopic, setStrategyTopic] = useState('');
  const [scriptData, setScriptData] = useState<any>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // V20.0 Global Settings from Firebase
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    maxDuration: 180,
    allowedStyles: [],
    enableAudioRefinement: true
  });

  useEffect(() => {
    loadApiConfig();
    setKeyCount(getValidKeyCount());
    if (!hasAnyApiKey()) setShowConfig(true);

    // V20.0 Firebase Listener
    const unsub = onSnapshot(doc(db, 'config', 'global_settings'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGlobalSettings({
          maxDuration: data.maxDuration || 180,
          allowedStyles: data.allowedStyles || [],
          enableAudioRefinement: data.enableAudioRefinement !== false
        });
      }
    });

    const saved = localStorage.getItem('recycle_autosave_script');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.segments && Array.isArray(parsed.segments)) {
          setScriptSegments(parsed.segments);
          setScriptData(parsed.scriptData || null);
          setScriptTopic(parsed.topic || '');
          setStrategyTopic(parsed.topic || '');
        }
      } catch (e) {
        console.error('Failed to restore autosaved script in App:', e);
      }
    }
    
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollTop > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    const handleWindowScroll = () => {
      if (window.scrollY > 300) setShowScrollTop(true);
      else setShowScrollTop(false);
    };
    window.addEventListener('scroll', handleWindowScroll);

    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [activeTab]);

  const scrollToTop = () => {
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfigClose = () => {
    setShowConfig(false);
    setKeyCount(getValidKeyCount());
  };

  const handleScriptGenerated = (segs: any[], _style: string, topic?: string) => {
    setScriptSegments(segs);
    if (topic) setScriptTopic(topic);
  };

  const handleAudioRefined = (segs: any[], topic?: string) => {
    setScriptSegments(segs);
    if (topic) setScriptTopic(topic);
  };

  const handleUseStrategy = (title: string) => {
    setStrategyTopic(title);
    setScriptSegments([]);
    setScriptData(null);
    localStorage.removeItem('recycle_autosave_script');
    setActiveTab('script');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        uiLang={uiLang}
        onToggleLang={() => setUiLang(p => p === 'vi' ? 'en' : 'vi')}
        onOpenConfig={() => setShowConfig(true)}
        keyCount={keyCount}
        onOpenAdmin={() => {
          if (!isAdmin) {
            setTimeout(() => {
              const pass = prompt('Hệ thống yêu cầu Mật mã Quản trị:');
              if (pass === 'admin' || pass === 'vkt') {
                setIsAdmin(true);
                setActiveTab('admin');
              } else if (pass !== null) {
                alert('Mã truy cập không hợp lệ!');
              }
            }, 50);
          } else {
            setActiveTab('admin');
          }
        }}
      />

      <main className="flex-1 max-w-[1800px] mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 md:h-[calc(100vh-70px)] h-auto">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasScriptData={scriptSegments.length > 0}
          uiLang={uiLang}
        />
        <div id="main-scroll-container" className="flex-1 bg-[#10141c]/80 rounded-2xl border border-slate-700/30 p-4 md:p-6 md:overflow-y-auto relative min-h-[500px] backdrop-blur-sm scroll-smooth">
          <div style={{ display: activeTab === 'spy' ? 'block' : 'none' }}>
            <SpyModule onUseStrategy={handleUseStrategy} uiLang={uiLang} />
          </div>
          <div style={{ display: activeTab === 'script' ? 'block' : 'none' }}>
            <ScriptModule 
              segments={scriptSegments} 
              setSegments={setScriptSegments}
              scriptData={scriptData}
              setScriptData={setScriptData}
              onScriptGenerated={handleScriptGenerated} 
              onAudioRefined={handleAudioRefined} 
              initialTopic={strategyTopic}
              onNavigateToStudio={() => setActiveTab('studio')}
              globalSettings={globalSettings}
              uiLang={uiLang}
              isAdmin={isAdmin}
            />
          </div>
          <div style={{ display: activeTab === 'studio' ? 'block' : 'none' }}>
            <StudioModule segments={scriptSegments} topic={scriptTopic} uiLang={uiLang} />
          </div>
          <div style={{ display: activeTab === 'seo' ? 'block' : 'none' }}>
            <SeoModule initialTopic={strategyTopic} scriptSegments={scriptSegments} scriptTopic={scriptTopic} uiLang={uiLang} />
          </div>
          <div style={{ display: activeTab === 'admin' ? 'block' : 'none' }}>
            {activeTab === 'admin' && <AdminModule globalSettings={globalSettings} uiLang={uiLang} />}
          </div>
        </div>
      </main>

      <footer className="relative border-t border-amber-900/20 py-6 bg-[#0a0e14]">
        <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
          <div className="text-slate-500 text-xs font-light tracking-wide">
            Copyright © {new Date().getFullYear()}{' '}
            <span className="text-slate-300 font-bold uppercase ml-1">VKT</span>.
            <span className="ml-2 text-slate-600">All rights reserved.</span>
          </div>
        </div>
      </footer>

      <ApiKeyModal isOpen={showConfig} onClose={handleConfigClose} />
      <ToastContainer />

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-teal-500/20 hover:bg-teal-500 text-teal-400 hover:text-white rounded-full flex items-center justify-center border border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all z-50 animate-[fadeIn_0.3s_ease-out]"
          title={uiLang === 'vi' ? 'Lên đầu trang' : 'Scroll to top'}
        >
          <i className="fa-solid fa-arrow-up text-lg"></i>
        </button>
      )}
    </div>
  );
};

export default App;