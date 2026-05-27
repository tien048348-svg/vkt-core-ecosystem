import React, { useState } from 'react';
import { callAI, generateImage } from '../services/aiService';
import { SYSTEM_PROMPT_SEO_MASTER } from '../data/prompts';
import { TARGET_MARKETS, SEO_CHECKLIST_DATA } from '../data/constants';
import { showToast } from '../components/Toast';
import { translations } from '../data/translations';
import ProgressBar from '../components/ProgressBar';

interface Props { market?: string; initialTopic?: string; scriptSegments?: any[]; uiLang: 'vi' | 'en'; }

const SeoModule: React.FC<Props> = ({ market = 'vn_dharma', initialTopic = '', scriptSegments = [], uiLang }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [seoProgress, setSeoProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [thumbnails, setThumbnails] = useState<Record<number, { url?: string, loading?: boolean }>>({});

  React.useEffect(() => { if (initialTopic) setTopic(initialTopic); }, [initialTopic]);

  const t = translations[uiLang];
  const copy = (txt: string) => { 
    navigator.clipboard.writeText(txt); 
    showToast(t.common.copied, 'success'); 
  };
  const toggle = (id: string) => setChecks(p => ({ ...p, [id]: !p[id] }));

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = fileName; a.click(); URL.revokeObjectURL(url);
  };

  const exportSEO = () => {
    if (!result) return;
    const isVi = uiLang === 'vi';
    let content = `=== SEO PACK: ${topic.toUpperCase()} ===\n\n`;
    if (result.keywords) {
      content += `1. KEYWORDS\n`;
      if (result.keywords.primary) content += `- ${isVi ? 'Chính' : 'Primary'}: ${result.keywords.primary.join(', ')}\n`;
      if (result.keywords.secondary) content += `- ${isVi ? 'Phụ' : 'Secondary'}: ${result.keywords.secondary.join(', ')}\n`;
      if (result.keywords.long_tail) content += `- Long-tail: ${result.keywords.long_tail.join(', ')}\n`;
      content += `\n`;
    }
    if (result.hashtags) {
      content += `2. HASHTAGS\n${result.hashtags.join(' ')}\n\n`;
    }
    if (result.viral_titles) {
      content += `3. ${isVi ? 'TIÊU ĐỀ' : 'TITLES'}\n`;
      result.viral_titles.forEach((tit: string, i: number) => { content += `${i + 1}. ${tit}\n`; });
      content += `\n`;
    }
    if (result.video_description) {
      content += `4. ${isVi ? 'MÔ TẢ' : 'DESCRIPTION'}\n`;
      if (result.video_description.hook) content += `[HOOK]: ${result.video_description.hook}\n\n`;
      if (result.video_description.full_description) content += `${result.video_description.full_description}\n\n`;
    }

    const safeTopic = (topic || 'seo').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    downloadFile(content, `${safeTopic}_seo_pack.txt`, 'text/plain;charset=utf-8');
    showToast(isVi ? 'Đã tải xuống!' : 'Downloaded!', 'success');
  };

  const handleGenerate = async () => {
    const hasScript = scriptSegments && scriptSegments.length > 0;
    if (!topic && !hasScript) return showToast(uiLang === 'vi' ? 'Nhập chủ đề SEO!' : 'Enter SEO topic!');
    const finalTopic = topic || (uiLang === 'vi' ? 'Kịch bản đang xử lý' : 'Current Script');
    setLoading(true);
    setSeoProgress(2);
    const progressInterval = setInterval(() => {
      setSeoProgress(prev => (prev < 90 ? prev + 2 : prev));
    }, 150);

    try {
      const mk = TARGET_MARKETS[market] || TARGET_MARKETS['vn_dharma'];
      let scriptContext = '';
      if (scriptSegments && scriptSegments.length > 0) {
        scriptContext = '\n\n[CRITICAL SCRIPT CONTEXT: The following is the exact story script. You MUST strictly base your SEO keywords, hashtags, viral titles, and description on the contents, characters, and events described in this script.]\n';
        const texts = scriptSegments.map((s: any) => {
          if (s.dialogues && s.dialogues.length > 0) {
            return s.dialogues.map((d: any) => `${d.character_name || ''}: ${d.line || ''}`).join('\n');
          }
          return s.voice_text || s.chapter_voice_block || '';
        });
        scriptContext += texts.join('\n\n');
      }

      const prompt = `TOPIC: "${finalTopic}"\nTARGET_LANGUAGE: ${mk.voice_lang}\nTARGET_MARKET: ${mk.name}${scriptContext}\nRESPOND ALL TEXT FIELDS IN ${uiLang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.\nGENERATE JSON.`;
      const json = await callAI(prompt, SYSTEM_PROMPT_SEO_MASTER);
      setResult(json);
    } catch (e: any) { showToast(e.message); }
    finally { 
      clearInterval(progressInterval);
      setSeoProgress(100);
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleGenerateImage = async (prompt: string, index: number) => {
    setThumbnails(p => ({ ...p, [index]: { loading: true } }));
    try {
      const url = await generateImage(prompt, '16:9');
      if (url) {
        setThumbnails(p => ({ ...p, [index]: { url, loading: false } }));
        showToast(uiLang === 'vi' ? 'Đã tạo ảnh!' : 'Image generated!', 'success');
      }
    } catch (e: any) {
      setThumbnails(p => ({ ...p, [index]: { loading: false } }));
      showToast(e.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fa-solid fa-leaf text-amber-500" /> {t.seo.title}</h2>
          {scriptSegments && scriptSegments.length > 0 && (
            <div className="px-3 py-1 bg-green-900/40 border border-green-500/50 text-green-400 rounded-full text-xs font-bold flex items-center gap-2 animate-[pulse_2s_infinite]">
              <i className="fa-solid fa-link" /> {uiLang === 'vi' ? 'Đã liên kết Kịch Bản' : 'Script Linked'}
            </div>
          )}
        </div>
        <div className="flex gap-2 md:gap-4 mb-6 flex-col sm:flex-row">
          <input value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-slate-600" placeholder={uiLang === 'vi' ? "Nhập chủ đề video chữa lành, triết lý Phật Pháp..." : "Enter Dharma/Healing video topic..."} />
          {loading ? (
            <div className="flex-1">
              <ProgressBar 
                percent={seoProgress} 
                text={uiLang === 'vi' ? 'Đang tối ưu hóa siêu dữ liệu...' : 'Optimizing metadata...'} 
                subText="VKT SEO Core"
                colorTheme="blue"
              />
            </div>
          ) : (
            <button onClick={handleGenerate} disabled={loading} className="px-6 py-3 bg-amber-900/40 hover:bg-amber-800/40 border border-amber-500/30 text-amber-100 font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 shrink-0">
              <i className="fa-solid fa-magic" /> {uiLang === 'vi' ? 'Tối Ưu SEO' : 'Optimize SEO'}
            </button>
          )}
          {result && (
            <button onClick={exportSEO} className="px-4 py-3 bg-teal-900/40 hover:bg-teal-800/40 border border-teal-500/30 text-teal-300 font-bold rounded-lg flex items-center gap-2 transition-all shrink-0">
              <i className="fa-solid fa-download" /> {uiLang === 'vi' ? 'Tải SEO' : 'Export SEO'}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><i className="fa-solid fa-check-square" /> CHECKLIST</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
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
          <div className="space-y-4">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-10 bg-slate-800/20 border border-slate-700/30 border-dashed rounded-xl">
                <i className="fa-solid fa-seedling mb-2 opacity-50" /><p className="text-sm">{uiLang === 'vi' ? 'Nhập chủ đề để phân tích' : 'Enter topic to analyze'}</p>
              </div>
            ) : (
              <>
                {result.keywords && (
                  <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 mb-3 uppercase">🔑 KEYWORDS</h4>
                    {['primary', 'secondary', 'long_tail'].map(type => Array.isArray(result.keywords[type]) && (
                      <div key={type} className="mb-2">
                        <div className="text-[10px] text-slate-400 mb-1 font-bold">{type}</div>
                        <div className="flex flex-wrap gap-1">{result.keywords[type].map((k: string, i: number) => <span key={i} className="bg-amber-900/20 text-amber-200 px-2 py-0.5 rounded-full text-[10px] border border-amber-500/20">{k}</span>)}</div>
                      </div>
                    ))}
                  </div>
                )}
                {Array.isArray(result.hashtags) && (
                  <div className="bg-teal-900/10 border border-teal-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-teal-400 mb-3 uppercase">#️⃣ HASHTAGS</h4>
                    <div className="flex flex-wrap gap-2">{result.hashtags.map((h: string, i: number) => <button key={i} onClick={() => copy(h)} className="bg-teal-900/20 text-teal-300 px-3 py-1 rounded-lg text-sm border border-teal-500/20 hover:bg-teal-900/30">{h}</button>)}</div>
                    <button onClick={() => copy(result.hashtags.join(' '))} className="mt-2 text-xs text-teal-400 hover:underline flex items-center gap-1"><i className="fa-solid fa-copy" /> Copy All</button>
                  </div>
                )}
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
                {result.video_description?.full_description && (
                  <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-green-400 mb-3 uppercase">📝 DESCRIPTION</h4>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{result.video_description.full_description}</p>
                    <button onClick={() => copy(result.video_description.full_description)} className="mt-2 text-xs text-green-400 hover:underline flex items-center gap-1"><i className="fa-solid fa-copy" /> {uiLang === 'vi' ? 'Copy' : 'Copy'}</button>
                  </div>
                )}
                {Array.isArray(result.thumbnail_suggestions) && (
                  <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-purple-400 mb-3 uppercase flex items-center gap-2"><i className="fa-solid fa-image" /> {uiLang === 'vi' ? 'GỢI Ý THUMBNAIL (3)' : 'THUMBNAIL SUGGESTIONS (3)'}</h4>
                    <div className="space-y-4">
                      {result.thumbnail_suggestions.map((thumb: any, i: number) => (
                        <div key={i} className="bg-[#0a0e14]/80 p-4 rounded-lg border border-purple-500/20 relative">
                          <h5 className="text-sm font-bold text-white mb-2">{thumb.concept_name}</h5>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-start gap-2"><span className="text-purple-400 font-bold w-16 shrink-0">Text:</span> <span className="text-white bg-red-900/30 px-2 py-0.5 rounded font-black border border-red-500/30">{thumb.text_on_image}</span></div>
                            <div className="flex items-start gap-2"><span className="text-purple-400 font-bold w-16 shrink-0">Visual:</span> <span className="text-slate-300">{thumb.visual_concept}</span></div>
                          </div>
                          <div className="mt-3">
                            {thumbnails[i]?.url ? (
                              <img src={thumbnails[i].url} className="w-full h-auto rounded-lg border border-purple-500/30 aspect-video object-cover" />
                            ) : (
                              <button onClick={() => handleGenerateImage(thumb.ai_image_prompt, i)} disabled={thumbnails[i]?.loading} className="w-full py-2 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-300 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                                {thumbnails[i]?.loading ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang === 'vi' ? 'Đang Vẽ...' : 'Drawing...'}</> : <><i className="fa-solid fa-palette" /> {uiLang === 'vi' ? 'Vẽ Ảnh AI' : 'AI Generate'}</>}
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

export default React.memo(SeoModule);
