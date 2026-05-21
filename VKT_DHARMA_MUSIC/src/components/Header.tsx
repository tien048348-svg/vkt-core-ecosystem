import React from 'react';

interface HeaderProps {
  uiLang: 'vi' | 'en';
  onToggleLang: () => void;
  onOpenConfig: () => void;
  keyCount: number;
}

const Header: React.FC<HeaderProps> = ({ uiLang, onToggleLang, onOpenConfig, keyCount }) => {
  return (
    <header className="bg-[#070b0d]/95 backdrop-blur-md border-b border-emerald-950 sticky top-0 z-50 shadow-[0_1px_15px_rgba(0,0,0,0.6)]">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full p-[2px] bg-gradient-to-tr from-emerald-500 via-teal-200 to-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full object-cover border-2 border-[#070b0d]" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tighter text-slate-100">
              VKT <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">DHARMA MUSIC</span>
            </h1>
            <p className="text-[9px] text-emerald-500/80 tracking-widest font-mono font-bold">ZEN SOUNDTRACK & FREQUENCY STUDIO</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <a href="https://zalo.me/0559793678" target="_blank" rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all group">
            <i className="fa-solid fa-headset pulse-glow"></i>
            <span className="group-hover:scale-105 transition-transform">Support 24/7: 055.979.3678</span>
          </a>

          {/* Language Switcher */}
          <button onClick={onToggleLang}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold bg-[#0e141a] text-slate-300 border border-slate-800/80 hover:bg-[#161f28] transition-all hover:text-slate-100">
            <span>{uiLang === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
            <span>{uiLang === 'vi' ? 'VI' : 'EN'}</span>
          </button>

          {/* Config Button */}
          <button onClick={onOpenConfig}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-xs font-bold bg-[#0e141a] text-slate-400 border border-slate-800/80 hover:bg-[#161f28] transition-all hover:text-slate-200">
            <i className="fa-solid fa-key"></i>
            <span className="hidden md:inline">Config</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${keyCount > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
              {keyCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;