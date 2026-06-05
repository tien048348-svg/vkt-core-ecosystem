import React from 'react';
import type { TabId } from '../data/constants';
import { translations } from '../data/translations';

interface HeaderProps {
  uiLang: 'vi' | 'en';
  onToggleLang: () => void;
  onOpenConfig: () => void;
  keyCount: number;
  onOpenAdmin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ uiLang, onToggleLang, onOpenConfig, keyCount, onOpenAdmin }) => {
  const t = translations[uiLang].header;
  const clickTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <header className="bg-[#0a0e14]/95 backdrop-blur-md border-b border-amber-900/30 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-700 shadow-[0_0_15px_rgba(245,166,35,0.4)]">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-full h-full rounded-full object-cover border-2 border-[#0a0e14] cursor-pointer" 
              onClick={(e) => {
                if (e.detail === 3 && onOpenAdmin) {
                  onOpenAdmin();
                }
              }}
              title="VKT DHARMA STUDIO"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 
                className="text-lg md:text-xl font-black tracking-tighter text-slate-100 cursor-default select-none uppercase"
              >
                BẢN TEST CHUẨN <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">V21.8.1</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="text-[9px] text-slate-500 font-medium tracking-widest uppercase mt-0.5 opacity-80 flex items-center">
                CORE BRAIN TESTING ENVIRONMENT <span className="ml-1.5 px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">V21.8.1 - PEAK EDITION</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Home Button */}
          <button 
            onClick={(e) => {
              const count = e.detail;
              if (count === 3 && onOpenAdmin) {
                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
                onOpenAdmin();
              } else if (count === 1) {
                clickTimeoutRef.current = setTimeout(() => {
                  window.location.href = "https://kiemtienvu.com";
                }, 400);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#161a22] text-slate-300 border border-slate-700/50 hover:bg-[#1e2230] hover:text-white transition-all group shadow-[0_0_10px_rgba(0,0,0,0.3)] cursor-pointer">
            <i className="fa-solid fa-house group-hover:scale-110 transition-transform text-amber-400"></i>
            <span className="hidden md:inline">{uiLang === 'vi' ? 'Trang Chủ' : 'Home'}</span>
          </button>

          <a href="https://zalo.me/0559793678" target="_blank" rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/15 transition-all group">
            <i className="fa-solid fa-headset pulse-glow"></i>
            <span className="group-hover:scale-105 transition-transform">{t.support}: 055.979.3678</span>
          </a>

          {/* Language Switcher */}
          <button onClick={onToggleLang}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold bg-[#161a22] text-slate-300 border border-slate-700/50 hover:bg-[#1e2230] transition-all hover:text-slate-100">
            <span>{uiLang === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
            <span>{uiLang === 'vi' ? 'VI' : 'EN'}</span>
          </button>

          {/* Config Button */}
          <button onClick={onOpenConfig}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-xs font-bold transition-all ${
              keyCount > 0 
                ? 'bg-[#161a22] text-slate-400 border border-slate-700/50 hover:bg-[#1e2230] hover:text-slate-200' 
                : 'bg-red-950/20 text-red-400 border border-red-500/40 animate-pulse hover:bg-red-900/30'
            }`}>
            <i className={`fa-solid fa-key ${keyCount === 0 ? 'text-red-400 animate-spin' : ''}`}></i>
            <span className="hidden md:inline">{t.config}</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
              keyCount > 0 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-red-500 text-white border border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-bounce'
            }`}>
              {keyCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);