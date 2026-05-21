import React, { useState, useEffect } from 'react';
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

    // Tự động khôi phục kịch bản phiên cũ từ localStorage khi F5 để giữ nguyên trải nghiệm người dùng
    const saved = localStorage.getItem('dhmusic_autosave_script');
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
  }, []);

  const handleConfigClose = () => {
    setShowConfig(false);
    setKeyCount(getValidKeyCount());
  };

  const handleScriptGenerated = (segs: any[], _style: string, topic?: string) => {
    setScriptSegments(segs);
    if (topic) setScriptTopic(topic);
    // GIỮ NGUYÊN TAB 2: Để người dùng duyệt danh sách cảnh từ 1 đến N trực quan theo yêu cầu!
  };

  // Audio refinement: chỉ cập nhật data, KHÔNG chuyển tab
  const handleAudioRefined = (segs: any[], topic?: string) => {
    setScriptSegments(segs);
    if (topic) setScriptTopic(topic);
  };

  const handleUseStrategy = (title: string) => {
    setStrategyTopic(title);
    setScriptSegments([]); // Xóa sạch dữ liệu cũ khi kích hoạt chủ đề mới
    setScriptData(null);
    localStorage.removeItem('dhmusic_autosave_script');
    setActiveTab('script');
  };

  // ⭐ Bước 7.2: Render ALL modules, use display:none to preserve state
  return (
    <div className="min-h-screen flex flex-col bg-[#070b0d]">
      <Header
        uiLang={uiLang}
        onToggleLang={() => setUiLang(p => p === 'vi' ? 'en' : 'vi')}
        onOpenConfig={() => setShowConfig(true)}
        keyCount={keyCount}
      />

      <main className="flex-1 max-w-[1800px] mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 md:h-[calc(100vh-70px)] h-auto">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasScriptData={scriptSegments.length > 0}
        />
        <div className="flex-1 bg-[#0b0f14]/80 rounded-2xl border border-emerald-950/40 p-4 md:p-6 md:overflow-y-auto relative min-h-[500px] backdrop-blur-sm">
          <div style={{ display: activeTab === 'spy' ? 'block' : 'none' }}>
            <SpyModule onUseStrategy={handleUseStrategy} />
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
            />
          </div>
          <div style={{ display: activeTab === 'studio' ? 'block' : 'none' }}>
            <StudioModule segments={scriptSegments} topic={scriptTopic} />
          </div>
          <div style={{ display: activeTab === 'seo' ? 'block' : 'none' }}>
            <SeoModule initialTopic={strategyTopic} />
          </div>
        </div>
      </main>

      <footer className="relative border-t border-emerald-950/20 py-6 bg-[#070b0d]">
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
    </div>
  );
};

export default App;