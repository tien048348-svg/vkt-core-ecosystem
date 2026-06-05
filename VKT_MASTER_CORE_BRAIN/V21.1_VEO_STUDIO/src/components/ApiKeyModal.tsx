import React, { useState, useEffect } from 'react';
import { loadApiConfig, saveApiConfig } from '../services/aiService';
import { translations } from '../data/translations';

interface Props { isOpen: boolean; onClose: () => void; uiLang: 'vi' | 'en'; }

const ApiKeyModal: React.FC<Props> = ({ isOpen, onClose, uiLang }) => {
  const [keys, setKeys] = useState<string[]>(['']);
  const t = translations[uiLang].apiModal;

  useEffect(() => {
    if (isOpen) {
      const cfg = loadApiConfig();
      setKeys(cfg.keyPool.length > 0 ? cfg.keyPool : ['']);
    }
  }, [isOpen]);

  const updateKey = (i: number, v: string) => {
    const k = [...keys]; k[i] = v; setKeys(k);
    saveApiConfig({ keyPool: k });
  };

  const addKey = () => setKeys([...keys, '']);
  const removeKey = (i: number) => {
    const k = keys.filter((_, x) => x !== i);
    const next = k.length ? k : [''];
    setKeys(next);
    saveApiConfig({ keyPool: next });
  };

  const validCount = keys.filter(k => k.trim().startsWith('AIza')).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#12161e] border border-amber-900/30 w-full max-w-md rounded-2xl p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-900/30 p-2 rounded-lg border border-amber-500/20">
            <i className="fa-solid fa-key text-amber-400"></i>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{t.title}</h3>
            <p className="text-[11px] text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
          className="block mb-1 text-center py-2 px-4 bg-amber-900/10 border border-amber-500/20 rounded-lg text-xs text-amber-400 font-bold hover:bg-amber-900/20 transition-all">
          {t.getLink}
        </a>
        <p className="text-[10px] text-amber-500/70 text-center mb-4 italic">
          (Nếu trang Google bị lỗi "Loading..." liên tục, vui lòng bật VPN hoặc dùng tab Ẩn danh)
        </p>

        <div className="space-y-2 mb-4">
          {keys.map((k, i) => (
            <div key={i} className="flex gap-2">
              <input type="password" value={k} onChange={e => updateKey(i, e.target.value)}
                className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm font-mono text-slate-200 placeholder-slate-600 outline-none focus:border-amber-500/50"
                placeholder="AIza..." />
              {keys.length > 1 && (
                <button onClick={() => removeKey(i)} className="text-red-500/50 hover:text-red-300 p-2"><i className="fa-solid fa-trash"></i></button>
              )}
            </div>
          ))}
        </div>

        <button onClick={addKey} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 mb-4 hover:underline">
          <i className="fa-solid fa-plus"></i> {t.addKey}
        </button>

        {validCount === 0 && (
          <div className="text-[11px] text-yellow-500 bg-yellow-900/10 border border-yellow-500/20 rounded-lg p-2 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i>
            {t.warning}
          </div>
        )}

        <button onClick={onClose} disabled={validCount === 0}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${validCount > 0 ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'}`}>
          <i className="fa-solid fa-lock"></i> {t.submit}
        </button>

        <p className="text-[10px] text-slate-600 mt-3 text-center">{t.securityNote}</p>
      </div>
    </div>
  );
};

export default ApiKeyModal;