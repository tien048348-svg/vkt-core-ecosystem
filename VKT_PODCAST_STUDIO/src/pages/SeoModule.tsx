import React, { useState } from 'react';
import { callAI, generateImage } from '../services/aiService';
import { SYSTEM_PROMPT_SEO_MASTER } from '../data/prompts';
import { TARGET_MARKETS, SEO_CHECKLIST_DATA } from '../data/constants';
import { showToast } from '../components/Toast';

interface Props { 
  market?: string; 
  initialTopic?: string; 
  scriptSegments?: any[];
  scriptTopic?: string;
  uiLang?: 'vi' | 'en';
}

const SeoModule: React.FC<Props> = ({ 
  market = 'vn_podcast', 
  initialTopic = '', 
  scriptSegments = [],
  scriptTopic = '',
  uiLang = 'vi'
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [thumbnails, setThumbnails] = useState<Record<number, { url?: string, loading?: boolean }>>({});
  const [activeTab, setActiveTab] = useState<'youtube' | 'tiktok' | 'facebook'>('youtube');

  React.useEffect(() => { 
    if (scriptTopic) {
      setTopic(scriptTopic);
    } else if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [scriptTopic, initialTopic]);

  const copy = (t: string) => { 
    navigator.clipboard.writeText(t); 
    showToast('✅ Copied!', 'success'); 
  };
  
  const toggle = (id: string) => setChecks(p => ({ ...p, [id]: !p[id] }));

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isLinked = scriptSegments && scriptSegments.length > 0;
  const hasPlatforms = result?.platforms !== undefined;

  const exportSEO = () => {
    if (!result) return;
    
    let content = `=== BỘ TỐI ƯU SEO PODCAST CHUYÊN SÂU 3 NỀN TẢNG ===\n`;
    content += `Chủ đề: ${topic.toUpperCase()}\n`;
    content += `Ngày tạo: ${new Date().toLocaleString()}\n`;
    content += `===============================================\n\n`;
    
    if (result.keywords) {
      content += `🔑 KEYWORDS\n`;
      if (result.keywords.primary) content += `- Chính: ${result.keywords.primary.join(', ')}\n`;
      if (result.keywords.secondary) content += `- Phụ: ${result.keywords.secondary.join(', ')}\n`;
      if (result.keywords.long_tail) content += `- Long-tail: ${result.keywords.long_tail.join(', ')}\n`;
      content += `\n`;
    }

    if (hasPlatforms) {
      // 1. YouTube SEO
      const yt = result.platforms.youtube || {};
      content += `===============================\n`;
      content += `🔴 PLATFORM 1: YOUTUBE SEO\n`;
      content += `===============================\n`;
      content += `👉 TIÊU ĐỀ CTR CAO:\n`;
      if (Array.isArray(yt.viral_titles)) {
        yt.viral_titles.forEach((t: string, i: number) => { content += `  [Gợi ý ${i + 1}] ${t}\n`; });
      }
      content += `\n👉 MÔ TẢ CHI TIẾT:\n${yt.description || ''}\n\n`;
      
      if (isLinked) {
        content += `👉 TIMELINE TIMESTAMPS TỰ ĐỘNG:\n`;
        scriptSegments.forEach((seg, i) => {
          const startTime = seg.time ? seg.time.split(' - ')[0] : '00:00';
          const sectionName = seg.section || `Scene ${seg.scene_number || i + 1}`;
          const brief = seg.strategy_note || 'Deep reflection';
          content += `  ${startTime} - [${sectionName}] ${brief}\n`;
        });
        content += `\n`;
      }
      content += `👉 HASHTAGS: ${(yt.hashtags || []).join(' ')}\n\n\n`;

      // 2. TikTok Viral
      const tt = result.platforms.tiktok || {};
      content += `===============================\n`;
      content += `⚫ PLATFORM 2: TIKTOK VIRAL\n`;
      content += `===============================\n`;
      content += `👉 TIÊU ĐỀ GIẬT GÂN:\n`;
      if (Array.isArray(tt.viral_titles)) {
        tt.viral_titles.forEach((t: string, i: number) => { content += `  [Gợi ý ${i + 1}] ${t}\n`; });
      }
      content += `\n👉 MÔ TẢ NGẮN (HOOK CAO):\n${tt.description || ''}\n\n`;
      content += `👉 HASHTAGS: ${(tt.hashtags || []).join(' ')}\n\n\n`;

      // 3. Facebook Reels
      const fb = result.platforms.facebook_reels || result.platforms.facebook || {};
      content += `===============================\n`;
      content += `🔵 PLATFORM 3: FACEBOOK REELS\n`;
      content += `===============================\n`;
      content += `👉 TIÊU ĐỀ TƯƠNG TÁC CỘNG ĐỒNG:\n`;
      if (Array.isArray(fb.viral_titles)) {
        fb.viral_titles.forEach((t: string, i: number) => { content += `  [Gợi ý ${i + 1}] ${t}\n`; });
      }
      content += `\n👉 MÔ TẢ BÌNH LUẬN/CHIA SẺ:\n${fb.description || ''}\n\n`;
      content += `👉 HASHTAGS: ${(fb.hashtags || []).join(' ')}\n\n\n`;
    } else {
      // Fallback for old format
      if (result.viral_titles) {
        content += `3. TIÊU ĐỀ ĐỀ XUẤT\n`;
        result.viral_titles.forEach((t: string, i: number) => { content += `${i + 1}. ${t}\n`; });
        content += `\n`;
      }
      if (result.video_description) {
        content += `4. MÔ TẢ VIDEO\n`;
        if (result.video_description.hook) content += `[HOOK]: ${result.video_description.hook}\n\n`;
        if (result.video_description.full_description) content += `${result.video_description.full_description}\n\n`;
      }
      if (result.hashtags) {
        content += `5. HASHTAGS\n${result.hashtags.join(' ')}\n\n`;
      }
    }

    if (Array.isArray(result.thumbnail_suggestions)) {
      content += `===============================\n`;
      content += `🎨 THUMBNAIL SUGGESTIONS (3 OPTIONS)\n`;
      content += `===============================\n`;
      result.thumbnail_suggestions.forEach((thumb: any, i: number) => {
        content += `--- Gợi ý ${i + 1}: ${thumb.concept_name} ---\n`;
        content += `- Hình ảnh: ${thumb.visual_concept}\n`;
        content += `- Text trên ảnh: ${thumb.text_on_image}\n`;
        content += `- Tông màu: ${thumb.color_psychology}\n`;
        content += `- Prompt AI: ${thumb.ai_image_prompt}\n\n`;
      });
    }

    if (result.engagement_comments) {
      content += `===============================\n`;
      content += `💬 ENGAGEMENT & DISCUSSION\n`;
      content += `===============================\n`;
      if (result.engagement_comments.pinned_comment) content += `- Bình luận Ghim: ${result.engagement_comments.pinned_comment}\n`;
      if (Array.isArray(result.engagement_comments.discussion_starters)) {
        content += `- Gợi ý thảo luận:\n`;
        result.engagement_comments.discussion_starters.forEach((d: string) => { content += `  * ${d}\n`; });
      }
      if (result.engagement_comments.call_to_action) content += `- CTA: ${result.engagement_comments.call_to_action}\n`;
    }

    const safeTopic = (topic || 'seo').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const date = new Date();
    const ts = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;
    
    downloadFile(content, `${safeTopic}_seo_master_3in1_${ts}.txt`, 'text/plain;charset=utf-8');
    showToast(uiLang === 'vi' ? 'Đã tải xuống bộ SEO 3 nền tảng!' : 'Downloaded SEO package for 3 platforms!', 'success');
  };

  const handleGenerate = async () => {
    if (!topic) return showToast(uiLang === 'vi' ? 'Nhập chủ đề SEO!' : 'Enter SEO Topic!');
    setLoading(true);
    try {
      const mk = TARGET_MARKETS[market] || TARGET_MARKETS['vn_podcast'];
      let scriptPromptContext = '';
      if (scriptSegments && scriptSegments.length > 0) {
        scriptPromptContext = `\n[SCRIPT SEGMENTS ATTACHED]:\n${JSON.stringify(
          scriptSegments.map(s => ({
            scene_number: s.scene_number,
            time: s.time,
            section: s.section,
            voice_text: s.voice_text || s.chapter_voice_block || '',
            strategy_note: s.strategy_note || ''
          })), 
          null, 
          2
        )}\nCRITICAL: Use these scenes to build accurate YouTube video timestamps timeline and align description insights.`;
      }
      
      const prompt = `TOPIC: "${topic}"\nTARGET_LANGUAGE: ${mk.voice_lang}\nTARGET_MARKET: ${mk.name}${scriptPromptContext}\nRESPOND ALL TEXT FIELDS IN VIETNAMESE.\nGENERATE JSON matching the exact system schema.`;
      const json = await callAI(prompt, SYSTEM_PROMPT_SEO_MASTER);
      setResult(json);
    } catch (e: any) { showToast(e.message); }
    finally { setLoading(false); }
  };

  const handleGenerateImage = async (prompt: string, index: number) => {
    setThumbnails(p => ({ ...p, [index]: { loading: true } }));
    try {
      const url = await generateImage(prompt, '16:9');
      if (url) {
        setThumbnails(p => ({ ...p, [index]: { url, loading: false } }));
        showToast(uiLang === 'vi' ? 'Đã tạo ảnh thành công!' : 'Image generated successfully!', 'success');
      } else {
        throw new Error('Lỗi tạo ảnh. Vui lòng thử lại sau.');
      }
    } catch (e: any) {
      setThumbnails(p => ({ ...p, [index]: { loading: false } }));
      showToast(e.message);
    }
  };

  const platformKey = activeTab === 'facebook' ? 'facebook_reels' : activeTab;
  const platData = hasPlatforms ? (result.platforms[platformKey] || {}) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-seedling text-amber-500" /> 
          <span>{uiLang === 'vi' ? 'Tối Ưu SEO Đa Nền Tảng Chuyên Sâu' : 'Multi-Platform SEO Master Optimizer'}</span>
        </h2>

        {/* Dynamic script sync linkage indicator */}
        {isLinked && (
          <div className="mb-5 p-3.5 bg-teal-950/20 border border-teal-500/20 rounded-xl flex items-center justify-between animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping shrink-0" />
              <span className="text-xs font-bold text-teal-300">
                ✨ {uiLang === 'vi' ? `Liên kết kịch bản thành công (${scriptSegments.length} Cảnh)` : `Script Linked Successfully (${scriptSegments.length} Scenes)`}
              </span>
            </div>
            <span className="text-[9px] bg-teal-900/50 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-black font-mono">
              DYNAMIC SYNC
            </span>
          </div>
        )}

        <div className="flex gap-2 md:gap-4 mb-6 flex-col sm:flex-row">
          <input 
            value={topic} 
            onChange={e => setTopic(e.target.value)} 
            className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-slate-600 font-medium" 
            placeholder={uiLang === 'vi' ? "Nhập chủ đề tối ưu SEO..." : "Enter topic for SEO optimization..."} 
          />
          <button onClick={handleGenerate} disabled={loading} className="px-6 py-3 bg-amber-900/40 hover:bg-amber-800/40 border border-amber-500/30 text-amber-100 font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 shrink-0">
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang === 'vi' ? 'ĐANG TỐI ƯU...' : 'OPTIMIZING...'}</> : <><i className="fa-solid fa-magic" /> {uiLang === 'vi' ? 'Tối Ưu SEO' : 'Optimize SEO'}</>}
          </button>
          {result && (
            <button onClick={exportSEO} className="px-4 py-3 bg-teal-900/40 hover:bg-teal-800/40 border border-teal-500/30 text-teal-300 font-bold rounded-lg flex items-center gap-2 transition-all shrink-0">
              <i className="fa-solid fa-download" /> {uiLang === 'vi' ? 'Tải SEO 3 Nền Tảng (.txt)' : 'Download 3-in-1 SEO (.txt)'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Checklist */}
          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 h-fit">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><i className="fa-solid fa-check-square" /> CHECKLIST</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(SEO_CHECKLIST_DATA).map(([sec, items]) => (
                <div key={sec} className="bg-[#12161e]/50 rounded-lg p-3 border border-slate-700/30">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">{sec}</div>
                  <div className="space-y-2">
                    {items.map(item => (
                      <label key={item.id} className="flex items-start gap-2 cursor-pointer group" onClick={() => toggle(item.id)}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${checks[item.id] ? 'bg-amber-500 border-amber-500' : 'border-slate-600 bg-[#0a0e14]'}`}>
                          {checks[item.id] && <i className="fa-solid fa-check text-white text-[10px]" />}
                        </div>
                        <span className={`text-xs ${checks[item.id] ? 'text-slate-500 line-through' : 'text-slate-400 group-hover:text-white'}`}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-4">
            {!result ? (
              <div className="h-96 flex flex-col items-center justify-center text-slate-500 p-10 bg-slate-800/20 border border-slate-700/30 border-dashed rounded-xl">
                <i className="fa-solid fa-seedling mb-2 text-2xl opacity-50 animate-bounce" />
                <p className="text-sm font-medium">{uiLang === 'vi' ? 'Nhập chủ đề để bắt đầu bóc tách SEO' : 'Enter topic to start SEO extraction'}</p>
              </div>
            ) : (
              <>
                {/* 3 Platforms Tab bar */}
                {hasPlatforms && (
                  <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 space-y-4">
                    <div className="flex gap-1 border-b border-slate-700/50 pb-px">
                      {(['youtube', 'tiktok', 'facebook'] as const).map(plat => {
                        const label = plat === 'youtube' ? 'YouTube SEO' : plat === 'tiktok' ? 'TikTok Viral' : 'FB Reels';
                        const icon = plat === 'youtube' ? 'fa-youtube text-red-500' : plat === 'tiktok' ? 'fa-tiktok text-slate-300' : 'fa-facebook text-blue-500';
                        return (
                          <button
                            key={plat}
                            onClick={() => setActiveTab(plat)}
                            className={`flex-1 py-2 text-[10px] font-extrabold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                              activeTab === plat
                                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                                : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <i className={`fa-brands ${icon}`} />
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Platform Content Output */}
                    {platData && (
                      <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                        {/* Pinned titles */}
                        {Array.isArray(platData.viral_titles) && (
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                              <i className="fa-solid fa-bolt" /> {uiLang === 'vi' ? 'Tiêu Đề CTR Đề Xuất' : 'CTR Proposed Titles'}
                            </h4>
                            <div className="space-y-2">
                              {platData.viral_titles.map((t: string, i: number) => (
                                <div key={i} className="flex justify-between items-center bg-[#0a0e14] p-2 rounded border border-slate-800">
                                  <span className="text-xs text-white font-medium flex-1 pr-2">{t}</span>
                                  <button onClick={() => copy(t)} className="text-slate-500 hover:text-white shrink-0">
                                    <i className="fa-solid fa-copy text-xs" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Description block */}
                        {platData.description && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <h4 className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                                <i className="fa-solid fa-file-text" /> {uiLang === 'vi' ? 'Mô Tả Thuật Toán' : 'Algorithmic Description'}
                              </h4>
                              <button onClick={() => copy(platData.description)} className="text-[10px] text-teal-400 hover:underline flex items-center gap-1 font-bold">
                                <i className="fa-solid fa-copy" /> Copy
                              </button>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed bg-[#0a0e14] p-3 rounded border border-slate-800 whitespace-pre-line max-h-64 overflow-y-auto custom-scrollbar">
                              {platData.description}
                            </p>
                          </div>
                        )}

                        {/* Automatic scene timestamps - YouTube exclusive */}
                        {isLinked && activeTab === 'youtube' && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                <i className="fa-solid fa-clock" /> {uiLang === 'vi' ? 'Timestamps Đồng Bộ Cảnh' : 'Synced Scene Timestamps'}
                              </h4>
                              <button 
                                onClick={() => {
                                  const tl = scriptSegments.map((seg, i) => {
                                    const startTime = seg.time ? seg.time.split(' - ')[0] : '00:00';
                                    const sectionName = seg.section || `Scene ${seg.scene_number || i + 1}`;
                                    const brief = seg.strategy_note || 'Deep reflection';
                                    return `${startTime} - [${sectionName}] ${brief}`;
                                  }).join('\n');
                                  copy(tl);
                                }} 
                                className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-bold"
                              >
                                <i className="fa-solid fa-copy" /> Copy
                              </button>
                            </div>
                            <div className="text-[11px] font-mono text-slate-300 bg-[#0a0e14] p-3 rounded border border-slate-800 max-h-40 overflow-y-auto custom-scrollbar">
                              {scriptSegments.map((seg, i) => {
                                const startTime = seg.time ? seg.time.split(' - ')[0] : '00:00';
                                const sectionName = seg.section || `Scene ${seg.scene_number || i + 1}`;
                                const brief = seg.strategy_note || 'Deep reflection';
                                return (
                                  <div key={i} className="py-0.5 border-b border-slate-900/50 last:border-0 flex justify-between">
                                    <div>
                                      <span className="text-teal-400 mr-2 font-bold">{startTime}</span>
                                      <span className="text-slate-500 mr-1.5">[{sectionName}]</span>
                                      <span className="text-slate-300">{brief}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Platform Hashtags */}
                        {Array.isArray(platData.hashtags) && (
                          <div className="space-y-1.5">
                            <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                              <i className="fa-solid fa-hashtag" /> HASHTAGS
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {platData.hashtags.map((h: string, i: number) => (
                                <button key={i} onClick={() => copy(h)} className="bg-purple-950/30 text-purple-300 px-2 py-0.5 rounded text-[10px] border border-purple-500/20 hover:bg-purple-900/20">
                                  {h}
                                </button>
                              ))}
                            </div>
                            <button onClick={() => copy(platData.hashtags.join(' '))} className="text-[9px] text-purple-400 hover:underline flex items-center gap-1 mt-1">
                              <i className="fa-solid fa-copy" /> Copy All
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Keywords (shared across platforms) */}
                {result.keywords && (
                  <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 mb-3 uppercase">🔑 KEYWORDS</h4>
                    {['primary', 'secondary', 'long_tail'].map(type => Array.isArray(result.keywords[type]) && (
                      <div key={type} className="mb-2 last:mb-0">
                        <div className="text-[9px] text-slate-400 mb-1 font-bold uppercase">{type === 'primary' ? 'Chính' : type === 'secondary' ? 'Phụ' : 'Đuôi dài'}</div>
                        <div className="flex flex-wrap gap-1">{result.keywords[type].map((k: string, i: number) => <span key={i} className="bg-[#0a0e14] text-amber-200 px-2 py-0.5 rounded text-[10px] border border-amber-500/10">{k}</span>)}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Legacy output support if platforms not generated */}
                {!hasPlatforms && (
                  <div className="space-y-4">
                    {/* Hashtags */}
                    {Array.isArray(result.hashtags) && (
                      <div className="bg-teal-900/10 border border-teal-500/20 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-teal-400 mb-3 uppercase">#️⃣ HASHTAGS</h4>
                        <div className="flex flex-wrap gap-2">{result.hashtags.map((h: string, i: number) => <button key={i} onClick={() => copy(h)} className="bg-teal-900/20 text-teal-300 px-3 py-1 rounded-lg text-sm border border-teal-500/20 hover:bg-teal-900/30">{h}</button>)}</div>
                        <button onClick={() => copy(result.hashtags.join(' '))} className="mt-2 text-xs text-teal-400 hover:underline flex items-center gap-1"><i className="fa-solid fa-copy" /> Copy All</button>
                      </div>
                    )}
                    {/* Viral Titles */}
                    {Array.isArray(result.viral_titles) && (
                      <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-amber-400 mb-3 uppercase">⚡ VIRAL TITLES</h4>
                        <div className="space-y-2">{result.viral_titles.map((t: string, i: number) => (
                          <div key={i} className="flex justify-between items-center bg-[#0a0e14] p-2 rounded border border-slate-700/30">
                            <span className="text-sm text-white font-medium flex-1">{i + 1}. {t}</span>
                            <button onClick={() => copy(t)} className="text-slate-500 hover:text-white ml-2"><i className="fa-solid fa-copy" /></button>
                          </div>
                        ))}</div>
                      </div>
                    )}
                    {/* Description */}
                    {result.video_description?.full_description && (
                      <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-green-400 mb-3 uppercase">📝 DESCRIPTION</h4>
                        {result.video_description.hook && <p className="text-sm text-white font-medium bg-green-900/20 p-3 rounded border border-green-500/20 mb-3">{result.video_description.hook}</p>}
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{result.video_description.full_description}</p>
                        <button onClick={() => copy(result.video_description.full_description)} className="mt-2 text-xs text-green-400 hover:underline flex items-center gap-1"><i className="fa-solid fa-copy" /> Copy</button>
                      </div>
                    )}
                  </div>
                )}

                {/* Thumbnails suggestions */}
                {Array.isArray(result.thumbnail_suggestions) && (
                  <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-purple-400 mb-3 uppercase flex items-center gap-2"><i className="fa-solid fa-image" /> {uiLang === 'vi' ? 'THUMBNAIL TƯƠNG TÁC CAO (3 GỢI Ý)' : 'HIGH CTR THUMBNAIL (3 SUGGESTIONS)'}</h4>
                    <div className="space-y-4">
                      {result.thumbnail_suggestions.map((thumb: any, i: number) => (
                        <div key={i} className="bg-[#0a0e14]/80 p-4 rounded-lg border border-purple-500/20 relative">
                          <div className="absolute top-3 right-3 bg-purple-900/40 text-purple-300 text-[10px] px-2 py-0.5 rounded font-bold">OPTION {i + 1}</div>
                          <h5 className="text-sm font-bold text-white mb-2 pr-16">{thumb.concept_name}</h5>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-start gap-2"><span className="text-purple-400 font-bold w-16 shrink-0">Text:</span> <span className="text-white bg-red-900/30 px-2 py-0.5 rounded font-black border border-red-500/30">{thumb.text_on_image}</span></div>
                            <div className="flex items-start gap-2"><span className="text-purple-400 font-bold w-16 shrink-0">Visual:</span> <span className="text-slate-300">{thumb.visual_concept}</span></div>
                            <div className="flex items-start gap-2"><span className="text-purple-400 font-bold w-16 shrink-0">Color:</span> <span className="text-amber-200/80">{thumb.color_psychology}</span></div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] text-slate-500 font-bold uppercase"><i className="fa-solid fa-robot" /> AI Prompt</span>
                              <button onClick={() => copy(thumb.ai_image_prompt)} className="text-[10px] text-purple-400 hover:text-white transition-colors"><i className="fa-regular fa-copy" /> Copy Prompt</button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono bg-[#12161e] p-2 rounded border border-slate-800 max-h-24 overflow-y-auto custom-scrollbar">{thumb.ai_image_prompt}</p>
                          </div>
                          
                          {/* Image Generation Section */}
                          <div className="mt-3">
                            {thumbnails[i]?.url ? (
                              <div className="relative group">
                                <img src={thumbnails[i].url} alt={thumb.concept_name} className="w-full h-auto rounded-lg border border-purple-500/30 object-cover aspect-video" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-lg">
                                  <a href={thumbnails[i].url} download={`thumbnail_opt${i+1}.png`} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-sm flex items-center gap-2">
                                    <i className="fa-solid fa-download" /> Tải Xuống
                                  </a>
                                  <button onClick={() => handleGenerateImage(thumb.ai_image_prompt, i)} className="text-xs text-slate-300 hover:text-white underline">Tạo lại ảnh khác</button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleGenerateImage(thumb.ai_image_prompt, i)} 
                                disabled={thumbnails[i]?.loading}
                                className="w-full py-2 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-300 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                              >
                                {thumbnails[i]?.loading ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang === 'vi' ? 'Đang Vẽ AI...' : 'AI Drawing...'}</> : <><i className="fa-solid fa-palette" /> {uiLang === 'vi' ? 'Vẽ Ảnh AI Ngay' : 'Draw with AI'}</>}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pinned & engagement comment starters */}
                {result.engagement_comments && (
                  <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-comments text-amber-500" /> 
                      <span>{uiLang === 'vi' ? 'Kịch Bản Bình Luận Tăng Tương Tác' : 'Engagement Driving Comments'}</span>
                    </h4>
                    
                    {result.engagement_comments.pinned_comment && (
                      <div className="bg-[#0a0e14] p-3 rounded border border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] text-teal-400 font-bold uppercase"><i className="fa-solid fa-thumbtack" /> Bình luận Ghim</span>
                          <button onClick={() => copy(result.engagement_comments.pinned_comment)} className="text-[9px] text-slate-500 hover:text-white"><i className="fa-solid fa-copy" /></button>
                        </div>
                        <p className="text-xs text-white leading-relaxed italic">"{result.engagement_comments.pinned_comment}"</p>
                      </div>
                    )}

                    {Array.isArray(result.engagement_comments.discussion_starters) && (
                      <div className="bg-[#0a0e14] p-3 rounded border border-slate-800 space-y-2">
                        <span className="text-[9px] text-purple-400 font-bold uppercase block"><i className="fa-solid fa-question-circle" /> Gợi ý khơi mào thảo luận</span>
                        <div className="space-y-1.5">
                          {result.engagement_comments.discussion_starters.map((starter: string, i: number) => (
                            <div key={i} className="flex justify-between items-start gap-2 border-b border-slate-900/40 last:border-0 pb-1.5 last:pb-0">
                              <p className="text-xs text-slate-300 leading-normal flex-1">"{starter}"</p>
                              <button onClick={() => copy(starter)} className="text-slate-500 hover:text-white shrink-0"><i className="fa-solid fa-copy text-[10px]" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.engagement_comments.call_to_action && (
                      <div className="bg-teal-950/10 p-2.5 rounded border border-teal-500/20 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] text-teal-400 font-extrabold block">SMOOTH CTA:</span>
                          <span className="text-xs text-teal-200 font-medium">{result.engagement_comments.call_to_action}</span>
                        </div>
                        <button onClick={() => copy(result.engagement_comments.call_to_action)} className="text-slate-500 hover:text-white ml-2"><i className="fa-solid fa-copy text-xs" /></button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoModule;
