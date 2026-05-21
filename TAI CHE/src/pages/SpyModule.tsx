import React, { useState } from 'react';
import { callAI, fetchYoutubeMeta } from '../services/aiService';
import { SYSTEM_PROMPT_IQ160_SPY } from '../data/prompts';
import { showToast } from '../components/Toast';

interface SpyModuleProps {
  onUseStrategy?: (title: string) => void;
}

const SpyModule: React.FC<SpyModuleProps> = ({ onUseStrategy }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);



  // Trích xuất YouTube Video ID trong thời gian thực ngay khi dán link
  const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  const handleAnalyze = async () => {
    if (!url) return showToast('Nhập link YouTube!');
    
    // Auto-clear old data when starting new analysis
    setResult(null);
    setMeta(null);
    setLoading(true);
    try {
      const m = await fetchYoutubeMeta(url);
      setMeta(m);
      let prompt = `URL: ${url}\nMETADATA: Title="${m.title}", Channel="${m.author}"`;
      if (m.fullData) prompt += `\nDESCRIPTION: ${m.description}\nTAGS: ${m.tags}\nSTATS: ${m.viewCount} views, ${m.likeCount} likes.`;
      prompt += `\nANALYZE Recycled Art & Vietnamese Folklore CONTENT. RESPOND ALL TEXT FIELDS IN VIETNAMESE.`;
      const data = await callAI(prompt, SYSTEM_PROMPT_IQ160_SPY);
      setResult(data);
    } catch (e: any) { showToast(e.message); }
    finally { setLoading(false); }
  };

  const tierColor = (t: string) => {
    const s = (t || '').toLowerCase();
    if (s.includes('premium')) return 'bg-green-900/20 border-green-500/30 text-green-300';
    if (s.includes('high')) return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300';
    return 'bg-red-900/20 border-red-500/30 text-red-300';
  };
  const impactColor = (i: string) => {
    const s = (i || '').toLowerCase();
    if (s.includes('high')) return 'text-red-400 font-bold';
    if (s.includes('medium')) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      {/* Input Card */}
      <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-brands fa-youtube text-red-500" /> Phân Tích Kênh Truyện Cổ Tích Tái Chế
        </h2>
        <div className="flex gap-2 mb-4">
          <input 
            value={url} 
            onChange={e => {
              setUrl(e.target.value);
              // Auto-clear when input is completely emptied
              if (e.target.value.trim() === '') {
                setResult(null);
                setMeta(null);
              }
            }}
            placeholder="Dán link Video/Kênh Truyện Cổ Tích Tái Chế..."
            className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-slate-600" 
          />
          <button onClick={() => { setUrl(''); setResult(null); setMeta(null); }} className="p-3 bg-[#12161e] rounded-xl hover:bg-[#1e2230] border border-slate-700/30">
            <i className="fa-solid fa-trash text-slate-400" />
          </button>
        </div>

        {/* INSTANT VISUAL THUMBNAIL PREVIEW - HIỂN THỊ TỨC THÌ KHI DÁN LINK */}
        {videoId && (
          <div className="mb-4 bg-[#0a0e14]/50 border border-slate-700/30 rounded-xl p-3 flex gap-4 items-center animate-[slideIn_0.3s_ease-out] relative overflow-hidden">
            <div className="relative w-28 sm:w-36 shrink-0 aspect-video rounded-lg overflow-hidden border border-slate-700/50 shadow-md group">
              <img 
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                alt="YouTube Instant Preview" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <i className="fa-brands fa-youtube text-red-500 text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                ĐÃ NHẬN DIỆN THUMBNAIL VIDEO
              </div>
              <div className="text-xs text-slate-200 font-bold truncate pr-2">
                {meta ? meta.title : 'Đang tải thông tin chi tiết từ YouTube...'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                {meta ? `Kênh: ${meta.author}` : 'Bấm nút "PHÂN TÍCH INSIGHT" để tiến hành Bẻ lái Giả Kim Thuật'}
              </div>
            </div>
          </div>
        )}

        {/* BẢN CHỈ DẪN GIẢ KIM THUẬT TÁI CHẾ */}
        <div className="mb-4 bg-[#0a0e14]/50 rounded-xl p-4 border border-slate-700/30 text-xs leading-relaxed space-y-3">
          <div className="flex items-start gap-2.5">
            <span className="text-base select-none">💡</span>
            <div>
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block mb-0.5"><i className="fa-solid fa-wand-magic-sparkles" /> CƠ CHẾ GIẢ KIM THUẬT TÁI CHẾ:</span>
              <span className="text-slate-300">
                Bạn có thể dán <strong>BẤT KỲ link YouTube nào</strong>! Hệ thống AI V16.0 sẽ tự động "bẻ lái" và chuyển thể 100% sang nội dung phù hợp ngách <strong>Truyện Cổ Tích Tái Chế</strong> triệu view.
              </span>
            </div>
          </div>
        </div>
        <button onClick={handleAnalyze} disabled={loading}
          className="w-full py-4 bg-amber-900/40 hover:bg-amber-800/40 border border-amber-500/30 text-amber-100 font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 transition-all disabled:opacity-50">
          {loading ? <><i className="fa-solid fa-sync animate-spin" /> ĐANG QUÉT...</> : <><i className="fa-solid fa-eye" /> PHÂN TÍCH INSIGHT</>}
        </button>
      </div>

      {/* Results */}
      {meta && result && (
        <div className="space-y-6 pb-10">
          {/* Meta */}
          <div className="bg-[#12161e] border border-slate-700/30 p-4 rounded-xl flex gap-4 items-start flex-col sm:flex-row shadow-lg">
            <div className="relative w-full sm:w-48 shrink-0 aspect-video rounded-lg overflow-hidden border border-slate-700/30 shadow-lg">
              <img 
                src={meta.thumb || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white leading-tight mb-2">{meta.title}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1 text-amber-200"><i className="fa-solid fa-user" /> {meta.author}</span>
                {meta.fullData && <span className="flex items-center gap-1 text-green-200"><i className="fa-solid fa-eye" /> {meta.viewCount} views</span>}
              </div>
            </div>
          </div>

          {/* Revenue */}
          {result.revenue_analysis && (
            <div className="bg-gradient-to-br from-green-900/10 to-amber-900/10 border border-green-500/20 rounded-xl p-5">
              <h4 className="text-sm font-bold text-green-400 mb-4 flex items-center gap-2 uppercase"><i className="fa-solid fa-dollar-sign" /> 💰 REVENUE ANALYSIS</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                {['estimated_cpm', 'estimated_rpm', 'total_estimated_earnings'].map(k => (
                  <div key={k} className="bg-[#0a0e14]/30 p-3 rounded border border-green-500/10">
                    <div className="text-[10px] text-green-300 mb-1">{k.replace(/_/g, ' ').replace(/estimated /i, '')}</div>
                    <div className={`text-lg font-bold ${k.includes('earnings') ? 'text-green-400' : 'text-white'}`}>{result.revenue_analysis[k] || 'N/A'}</div>
                  </div>
                ))}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${tierColor(result.revenue_analysis.monetization_tier)}`}>{result.revenue_analysis.monetization_tier}</span>
            </div>
          )}

          {/* Strengths + Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(result.strengths) && result.strengths.length > 0 && (
              <div className="bg-[#12161e] p-5 rounded-xl border border-amber-500/20">
                <h4 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2"><i className="fa-solid fa-check-circle" /> ⚡ STRENGTHS</h4>
                <div className="space-y-3">
                  {result.strengths.map((s: any, i: number) => (
                    <div key={i} className="bg-amber-900/10 p-3 rounded border border-amber-500/20">
                      <div className="text-xs text-white font-medium mb-1">{s.point}</div>
                      <div className="text-[10px]"><span className="text-slate-500">Impact:</span> <span className={impactColor(s.impact)}>{s.impact}</span></div>
                      {s.evidence && <div className="text-[10px] text-slate-400 mt-1 italic">💡 {s.evidence}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(result.weaknesses) && result.weaknesses.length > 0 && (
              <div className="bg-[#12161e] p-5 rounded-xl border border-red-500/20">
                <h4 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2"><i className="fa-solid fa-exclamation-triangle" /> ⚠️ WEAKNESSES</h4>
                <div className="space-y-3">
                  {result.weaknesses.map((w: any, i: number) => (
                    <div key={i} className="bg-red-900/10 p-3 rounded border border-red-500/20">
                      <div className="text-xs text-white font-medium mb-1">{w.point}</div>
                      <div className="text-[10px]"><span className="text-slate-500">Impact:</span> <span className={impactColor(w.impact)}>{w.impact}</span></div>
                      {w.fix && <div className="text-[10px] text-green-300 bg-green-900/10 p-2 rounded border border-green-500/20 mt-2">✅ Fix: {w.fix}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audio Strategy */}
          {result.audio_strategy && (
            <div className="bg-gradient-to-br from-teal-900/10 to-amber-900/10 border border-teal-500/20 rounded-xl p-5">
              <h4 className="text-sm font-bold text-teal-400 mb-4 uppercase"><i className="fa-solid fa-music" /> 🎵 AUDIO STRATEGY</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['voice_analysis', 'music_style', 'hook_sounds'].map(k => (
                  <div key={k} className="bg-[#0a0e14]/30 p-3 rounded border border-teal-500/10">
                    <div className="text-[10px] text-teal-300 mb-1 font-bold">{k.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-slate-300">{result.audio_strategy[k] || 'N/A'}</div>
                  </div>
                ))}
                <div className="bg-[#0a0e14]/30 p-3 rounded border border-teal-500/10">
                  <div className="text-[10px] text-teal-300 mb-1 font-bold">Sound Effects</div>
                  <div className="flex flex-wrap gap-1">{Array.isArray(result.audio_strategy.sound_effects) ? result.audio_strategy.sound_effects.map((s: string, i: number) => <span key={i} className="bg-teal-900/20 text-teal-300 px-2 py-0.5 rounded text-[10px] border border-teal-500/20">{s}</span>) : 'N/A'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Engagement */}
          {result.engagement_signals && (
            <div className="bg-gradient-to-br from-cyan-900/10 to-teal-900/10 border border-cyan-500/20 rounded-xl p-5">
              <h4 className="text-sm font-bold text-cyan-400 mb-4 uppercase"><i className="fa-solid fa-chart-line" /> 📊 ENGAGEMENT</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(result.engagement_signals).map(([k, v]) => (
                  <div key={k} className="bg-[#0a0e14]/30 p-3 rounded border border-cyan-500/10 text-center">
                    <div className="text-[10px] text-cyan-300 mb-1">{k.replace(/_/g, ' ')}</div>
                    <div className="text-sm font-bold text-white">{String(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hook Timeline */}
          {Array.isArray(result.hook_timeline) && result.hook_timeline.length > 0 && (
            <div className="bg-gradient-to-br from-amber-900/10 to-orange-900/10 border border-amber-500/20 rounded-xl p-5">
              <h4 className="text-sm font-bold text-amber-400 mb-4 uppercase"><i className="fa-solid fa-clock" /> 🎯 HOOK TIMELINE</h4>
              <div className="space-y-3">
                {result.hook_timeline.map((h: any, i: number) => (
                  <div key={i} className="bg-[#0a0e14]/30 p-3 rounded border border-amber-500/10 flex items-start gap-3">
                    <div className="bg-amber-900/30 text-amber-300 px-2 py-1 rounded text-[10px] font-bold border border-amber-500/20 shrink-0">{h.timestamp}</div>
                    <div><div className="text-xs font-bold text-white mb-1">{h.hook_type}</div><div className="text-[10px] text-slate-400">{h.description}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Viral Suggestions */}
          {Array.isArray(result.viral_suggestions) && result.viral_suggestions.length > 0 && (
            <div className="bg-gradient-to-r from-amber-900/5 to-teal-900/5 p-5 rounded-xl border border-amber-500/20">
              <h3 className="text-sm font-bold text-amber-400 mb-4 uppercase"><i className="fa-solid fa-lightbulb" /> VIRAL TITLES</h3>
              <div className="space-y-3">
                {result.viral_suggestions.map((idea: any, idx: number) => (
                  <div key={idx} className="bg-[#12161e]/80 p-4 rounded-lg border border-slate-700/30 hover:border-amber-500/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-amber-900/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">OPTION {idx + 1}</span>
                        <h4 className="text-sm font-bold text-white">{idea.hook_title}</h4>
                      </div>
                      <div className="text-xs text-slate-400 pl-1 border-l-2 border-slate-700">💡 {idea.outline_idea}</div>
                    </div>
                    <button onClick={() => onUseStrategy?.(idea.hook_title)} className="shrink-0 bg-amber-900/30 hover:bg-amber-800/40 text-amber-300 border border-amber-500/30 px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all hover:scale-105">
                      <i className="fa-solid fa-bolt" /> KÍCH HOẠT
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpyModule;