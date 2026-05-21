import React, { useState, useEffect, useCallback } from 'react';
import type { TabId } from './data/constants';
import { loadApiConfig, getValidKeyCount, hasAnyApiKey } from './services/aiService';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ApiKeyModal from './components/ApiKeyModal';
import ToastContainer from './components/Toast';
import SpyModule from './pages/SpyModule';
import ScriptModule from './pages/ScriptModule';
import StudioModule from './pages/StudioModule';
import SeoModule from './pages/SeoModule';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('spy');
  const [showConfig, setShowConfig] = useState(false);
  const [uiLang, setUiLang] = useState<'vi' | 'en'>('vi');
  const [keyCount, setKeyCount] = useState(0);
  const [scriptSegments, setScriptSegments] = useState<any[]>([]);
  const [scriptTopic, setScriptTopic] = useState('');
  const [strategyTopic, setStrategyTopic] = useState('');
  const [scriptData, setScriptData] = useState<any>(null);

  useEffect(() => {
    loadApiConfig();
    setKeyCount(getValidKeyCount());
    if (!hasAnyApiKey()) setShowConfig(true);

    const saved = localStorage.getItem('dharmaP_autosave_script');
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
        console.error('Failed to restore autosaved script:', e);
      }
    }
  }, []);

  const handleConfigClose = useCallback(() => {
    setShowConfig(false);
    setKeyCount(getValidKeyCount());
  }, []);

  const handleScriptGenerated = useCallback((segs: any[], _style: string, topic?: string) => {
    setScriptSegments(segs);
    if (topic) setScriptTopic(topic);
    setActiveTab('studio');
  }, []);

  // Audio refinement: chỉ cập nhật data, KHÔNG chuyển tab
  const handleAudioRefined = useCallback((segs: any[], topic?: string) => {
    setScriptSegments(segs);
    if (topic) setScriptTopic(topic);
  }, []);

  const handleUseStrategy = useCallback((title: string) => {
    setStrategyTopic(title);
    setScriptSegments([]); // Đảm bảo xóa sạch dữ liệu cũ ở mức App khi kích hoạt chủ đề mới
    setScriptData(null);
    localStorage.removeItem('dharmaP_autosave_script');
    setActiveTab('script');
  }, []);

  const handleToggleLang = useCallback(() => {
    setUiLang(p => p === 'vi' ? 'en' : 'vi');
  }, []);

  const handleOpenConfig = useCallback(() => {
    setShowConfig(true);
  }, []);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
  }, []);

  // ⭐ Bước 7.2: Render ALL modules, use display:none to preserve state
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        uiLang={uiLang}
        onToggleLang={handleToggleLang}
        onOpenConfig={handleOpenConfig}
        keyCount={keyCount}
      />

      <main className="flex-1 max-w-[1800px] mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 md:h-[calc(100vh-70px)] h-auto">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hasScriptData={scriptSegments.length > 0}
          uiLang={uiLang}
        />
        <div className="flex-1 bg-[#10141c]/80 rounded-2xl border border-slate-700/30 p-4 md:p-6 md:overflow-y-auto relative min-h-[500px] backdrop-blur-sm">
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
              uiLang={uiLang} 
              onNavigateToStudio={() => setActiveTab('studio')}
            />
          </div>
          <div style={{ display: activeTab === 'studio' ? 'block' : 'none' }}>
            <StudioModule segments={scriptSegments} topic={scriptTopic} uiLang={uiLang} />
          </div>
          <div style={{ display: activeTab === 'seo' ? 'block' : 'none' }}>
            <SeoModule initialTopic={strategyTopic} uiLang={uiLang} />
          </div>
        </div>
      </main>

      <footer className="relative border-t border-amber-900/20 py-6 bg-[#0a0e14]">
        <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
          <div className="text-slate-500 text-xs font-light tracking-wide">
            Copyright © {new Date().getFullYear()}{' '}
            <span className="text-slate-300 font-bold uppercase ml-1">VKT</span>.
            <span className="ml-2 text-slate-600">{uiLang === 'vi' ? 'Bảo lưu mọi quyền.' : 'All rights reserved.'}</span>
          </div>
        </div>
      </footer>

      <ApiKeyModal isOpen={showConfig} onClose={handleConfigClose} uiLang={uiLang} />
      <ToastContainer />
    </div>
  );
};

export default App;