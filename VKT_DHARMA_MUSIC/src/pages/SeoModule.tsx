import React, { useState } from 'react';
import { callAI, generateImage } from '../services/aiService';
import { SYSTEM_PROMPT_SEO_MASTER } from '../data/prompts';
import { TARGET_MARKETS, SEO_CHECKLIST_DATA } from '../data/constants';
import { showToast } from '../components/Toast';

interface Props { market?: string; initialTopic?: string; }

const SeoModule: React.FC<Props> = ({ market = 'vn_dharma', initialTopic = '' }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [thumbnails, setThumbnails] = useState<Record<number, { url?: string, loading?: boolean }>>({});

  React.useEffect(() => { if (initialTopic) setTopic(initialTopic); }, [initialTopic]);

  const copy = (t: string) => { navigator.clipboard.writeText(t); showToast('✅ Copied!', 'success'); };
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

  const exportSEO = () => {
    if (!result) return;
    
    let content = `=== BỘ TỪ KHÓA SEO: ${topic.toUpperCase()} ===\n\n`;
    
    if (result.keywords) {
      content += `1. KEYWORDS\n`;
      if (result.keywords.primary) content += `- Chính: ${result.keywords.primary.join(', ')}\n`;
      if (result.keywords.secondary) content += `- Phụ: ${result.keywords.secondary.join(', ')}\n`;
      if (result.keywords.long_tail) content += `- Long-tail: ${result.keywords.long_tail.join(', ')}\n`;
      content += `\n`;
    }

    if (result.hashtags) {
      content += `2. HASHTAGS\n`;
      content += `${result.hashtags.join(' ')}\n\n`;
    }

    if (result.viral_titles) {
      content += `3. TIÊU ĐỀ ĐỀ XUẤT\n`;
      result.viral_titles.forEach((t: string, i: number) => {
        content += `${i + 1}. ${t}\n`;
      });
      content += `\n`;
    }

    if (result.video_description) {
      content += `4. MÔ TẢ VIDEO\n`;
      if (result.video_description.hook) content += `[HOOK]: ${result.video_description.hook}\n\n`;
      if (result.video_description.full_description) content += `${result.video_description.full_description}\n\n`;
    }

    if (Array.isArray(result.thumbnail_suggestions)) {
      content += `5. Ý TƯỞNG THUMBNAIL (3 GỢI Ý)\n`;
      result.thumbnail_suggestions.forEach((thumb: any, i: number) => {
        content += `--- Gợi ý ${i + 1}: ${thumb.concept_name} ---\n`;
        content += `- Hình ảnh: ${thumb.visual_concept}\n`;
        content += `- Text trên ảnh: ${thumb.text_on_image}\n`;
        content += `- Tông màu: ${thumb.color_psychology}\n`;
        content += `- Prompt AI: ${thumb.ai_image_prompt}\n\n`;
      });
    }

    const safeTopic = (topic || 'seo').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const date = new Date();
    const ts = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;
    
    downloadFile(content, `${safeTopic}_seo_pack_${ts}.txt`, 'text/plain;charset=utf-8');
    showToast('Đã tải xuống bộ SEO!', 'success');
  };

  const handleGenerate = async () => {
    if (!topic) return showToast('Nhập chủ đề SEO!');
    setLoading(true);
    try {
      const mk = TARGET_MARKETS[market] || TARGET_MARKETS['vn_dharma'];
      const prompt = `TOPIC: "${topic}"\nTARGET_LANGUAGE: ${mk.voice_lang}\nTARGET_MARKET: ${mk.name}\nRESPOND ALL TEXT FIELDS IN VIETNAMESE.\nGENERATE JSON.`;
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
        showToast('Đã tạo ảnh thành công!', 'success');
      } else {
        throw new Error('Lỗi tạo ảnh. Vui lòng thử lại sau.');
      }
    } catch (e: any) {
      setThumbnails(p => ({ ...p, [index]: { loading: false } }));
      showToast(e.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#0b0f14] border border-emerald-950/40 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><i className="fa-solid fa-seedling text-emerald-400" /> SEO Nhạc Thiền Chuyên Sâu</h2>
        <div className="flex gap-2 md:gap-4 mb-6 flex-col sm:flex-row">
          <input value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 bg-[#05080b] border border-emerald-950/50 rounded-lg p-3 text-sm text-white outline-none focus:border-emerald-500/50 placeholder-slate-600" placeholder="Nhập chủ đề video nhạc thiền phật giáo..." />
          <button onClick={handleGenerate} disabled={loading} className="px-6 py-3 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-100 font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 shrink-0">
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> ĐANG TỐI ƯU...</> : <><i className="fa-solid fa-magic" /> Tối Ưu SEO</>}
          </button>
          {result && (
            <button onClick={exportSEO} className="px-4 py-3 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 font-bold rounded-lg flex items-center gap-2 transition-all shrink-0">
              <i className="fa-solid fa-download" /> Tải SEO (.txt)
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {/* Checklist */}
          <div className="bg-[#0b0f14] border border-emerald-950/40 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><i className="fa-solid fa-check-square" /> CHECKLIST</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {Object.entries(SEO_CHECKLIST_DATA).map(([sec, items]) => (
                <div key={sec} className="bg-[#05080b]/50 rounded-lg p-3 border border-emerald-950/30">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">{sec}</div>
                  <div className="space-y-2">
                    {items.map(item => (
                      <label key={item.id} className="flex items-start gap-2 cursor-pointer group" onClick={() => toggle(item.id)}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${checks[item.id] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-800 bg-[#05080b]'}`}>
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
          {/* Results */}
          <div className="space-y-4">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-10 bg-emerald-950/10 border border-emerald-950/30 border-dashed rounded-xl">
                <i className="fa-solid fa-seedling mb-2 opacity-50" /><p className="text-sm">Nhập chủ đề để phân tích</p>
              </div>
            ) : (
              <>
                {/* Keywords */}
                {result.keywords && (
                  <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-emerald-400 mb-3 uppercase">🔑 KEYWORDS</h4>
                    {['primary', 'secondary', 'long_tail'].map(type => Array.isArray(result.keywords[type]) && (
                      <div key={type} className="mb-2">
                        <div className="text-[10px] text-slate-400 mb-1 font-bold">{type}</div>
                        <div className="flex flex-wrap gap-1">{result.keywords[type].map((k: string, i: number) => <span key={i} className="bg-emerald-950/20 text-emerald-200 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/20">{k}</span>)}</div>
                      </div>
                    ))}
                  </div>
                )}
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
                  <div className="bg-[#0b0f14] border border-emerald-950/40 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-emerald-400 mb-3 uppercase">⚡ VIRAL TITLES</h4>
                    <div className="space-y-2">{result.viral_titles.map((t: string, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-[#05080b] p-2 rounded border border-emerald-950/40">
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
                {/* Thumbnails */}
                {Array.isArray(result.thumbnail_suggestions) && (
                  <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-purple-400 mb-3 uppercase flex items-center gap-2"><i className="fa-solid fa-image" /> THUMBNAIL TƯƠNG TÁC CAO (3 GỢI Ý)</h4>
                    <div className="space-y-4">
                      {result.thumbnail_suggestions.map((thumb: any, i: number) => (
                        <div key={i} className="bg-[#05080b]/80 p-4 rounded-lg border border-purple-500/20 relative">
                          <div className="absolute top-3 right-3 bg-purple-900/40 text-purple-300 text-[10px] px-2 py-0.5 rounded font-bold">OPTION {i + 1}</div>
                          <h5 className="text-sm font-bold text-white mb-2 pr-16">{thumb.concept_name}</h5>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-start gap-2"><span className="text-purple-400 font-bold w-16 shrink-0">Text:</span> <span className="text-white bg-red-900/30 px-2 py-0.5 rounded font-black border border-red-500/30">{thumb.text_on_image}</span></div>
                            <div className="flex items-start gap-2"><span className="text-purple-400 font-bold w-16 shrink-0">Visual:</span> <span className="text-slate-300">{thumb.visual_concept}</span></div>
                            <div className="flex items-start gap-2"><span className="text-purple-400 font-bold w-16 shrink-0">Color:</span> <span className="text-amber-200/80">{thumb.color_psychology}</span></div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-emerald-950/40">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] text-slate-500 font-bold uppercase"><i className="fa-solid fa-robot" /> AI Prompt</span>
                              <button onClick={() => copy(thumb.ai_image_prompt)} className="text-[10px] text-purple-400 hover:text-white transition-colors"><i className="fa-regular fa-copy" /> Copy Prompt</button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono bg-[#05080b] p-2 rounded border border-emerald-950/40">{thumb.ai_image_prompt}</p>
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
                                {thumbnails[i]?.loading ? <><i className="fa-solid fa-sync animate-spin" /> Đang Vẽ AI...</> : <><i className="fa-solid fa-palette" /> Vẽ Ảnh AI Ngay</>}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
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
