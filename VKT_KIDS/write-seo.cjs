const fs = require('fs');
const path = 'e:/HMKT/VKT_ECOSYSTEM_CORE/VKT_KIDS/src/pages/SeoModule.tsx';

const seoModuleContent = `import React, { useState } from 'react';
import { callAI, generateImage } from '../services/aiService';
import { SYSTEM_PROMPT_SEO_MASTER } from '../data/prompts';
import { TARGET_MARKETS, SEO_CHECKLIST_DATA } from '../data/constants';
import { showToast } from '../components/Toast';

interface Props { market?: string; initialTopic?: string; scriptSegments?: any[]; }

const SeoModule: React.FC<Props> = ({ market = Object.keys(TARGET_MARKETS)[0], initialTopic = '', scriptSegments = [] }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [thumbnails, setThumbnails] = useState<Record<number, { url?: string, loading?: boolean }>>({});
  const [activeTab, setActiveTab] = useState<'youtube' | 'tiktok' | 'facebook'>('youtube');

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
    
    let content = \`=== BỘ TỪ KHÓA SEO ĐA NỀN TẢNG: \${topic.toUpperCase()} ===\\n\\n\`;
    
    if (result.keywords) {
      content += \`--- 1. KEYWORDS CHUNG ---\\n\`;
      if (result.keywords.primary) content += \`- Chính: \${result.keywords.primary.join(', ')}\\n\`;
      if (result.keywords.secondary) content += \`- Phụ: \${result.keywords.secondary.join(', ')}\\n\`;
      if (result.keywords.long_tail) content += \`- Long-tail: \${result.keywords.long_tail.join(', ')}\\n\`;
      content += \`\\n\`;
    }

    if (result.hashtags) {
      content += \`--- 2. HASHTAGS CHUNG ---\\n\`;
      content += \`\${result.hashtags.join(' ')}\\n\\n\`;
    }

    if (result.youtube) {
      content += \`=== YOUTUBE ===\\n\`;
      if (result.youtube.viral_titles) {
         content += \`- Tiêu đề: \\n  + \${result.youtube.viral_titles.join('\\n  + ')}\\n\`;
      }
      if (result.youtube.video_description) {
         content += \`- Mô tả: \\n\${result.youtube.video_description.hook}\\n\${result.youtube.video_description.full_description}\\n\`;
      }
      content += \`\\n\`;
    }

    if (result.tiktok) {
      content += \`=== TIKTOK ===\\n\`;
      if (result.tiktok.viral_titles) content += \`- Tiêu đề: \\n  + \${result.tiktok.viral_titles.join('\\n  + ')}\\n\`;
      if (result.tiktok.caption) content += \`- Caption: \\n\${result.tiktok.caption}\\n\`;
      content += \`\\n\`;
    }
    
    if (result.facebook) {
      content += \`=== FACEBOOK ===\\n\`;
      if (result.facebook.viral_titles) content += \`- Tiêu đề: \\n  + \${result.facebook.viral_titles.join('\\n  + ')}\\n\`;
      if (result.facebook.status_post) content += \`- Status: \\n\${result.facebook.status_post}\\n\`;
      content += \`\\n\`;
    }

    if (Array.isArray(result.thumbnail_suggestions)) {
      content += \`=== Ý TƯỞNG THUMBNAIL ===\\n\`;
      result.thumbnail_suggestions.forEach((thumb: any, i: number) => {
        content += \`--- Gợi ý \${i + 1}: \${thumb.concept_name} ---\\n\`;
        content += \`- Hình ảnh: \${thumb.visual_concept}\\n\`;
        content += \`- Text trên ảnh: \${thumb.text_on_image}\\n\`;
        content += \`- Tông màu: \${thumb.color_psychology}\\n\`;
        content += \`- Prompt AI: \${thumb.ai_image_prompt}\\n\\n\`;
      });
    }

    const safeTopic = (topic || 'seo').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const date = new Date();
    const ts = \`\${String(date.getDate()).padStart(2, '0')}-\${String(date.getMonth() + 1).padStart(2, '0')}-\${date.getFullYear()}_\${String(date.getHours()).padStart(2, '0')}\${String(date.getMinutes()).padStart(2, '0')}\`;
    
    downloadFile(content, \`\${safeTopic}_multiplatform_seo_\${ts}.txt\`, 'text/plain;charset=utf-8');
    showToast('Đã tải xuống bộ SEO!', 'success');
  };

  const handleGenerate = async () => {
    if (!topic && scriptSegments.length === 0) return showToast('Nhập chủ đề SEO hoặc tạo kịch bản trước!');
    setLoading(true);
    try {
      const mk = TARGET_MARKETS[market] || Object.values(TARGET_MARKETS)[0];
      
      let contextData = \`TOPIC: "\${topic}"\`;
      if (scriptSegments && scriptSegments.length > 0) {
        const fullScript = scriptSegments.map(s => s.dialogues?.map((d: any) => d.line).join(' ') || s.voice_text).join(' ');
        contextData += \`\\n\\nSCRIPT_CONTEXT: """\\n\${fullScript}\\n"""\`;
      }

      const prompt = \`\${contextData}\\n\\nTARGET_LANGUAGE: \${mk.voice_lang}\\nTARGET_MARKET: \${mk.name}\\nRESPOND ALL TEXT FIELDS IN VIETNAMESE EXCEPT WHEN SPECIFIED OTHERWISE.\\nGENERATE JSON.\`;
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
      <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><i className="fa-solid fa-seedling text-amber-500" /> SEO Đa Nền Tảng Thông Minh</h2>
        <div className="flex gap-2 md:gap-4 mb-6 flex-col sm:flex-row">
          <input value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-slate-600" placeholder={scriptSegments.length > 0 ? "Tự động phân tích từ Kịch bản hiện tại..." : "Nhập chủ đề video..."} readOnly={scriptSegments.length > 0} />
          <button onClick={handleGenerate} disabled={loading} className="px-6 py-3 bg-amber-900/40 hover:bg-amber-800/40 border border-amber-500/30 text-amber-100 font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 shrink-0">
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> ĐANG TỐI ƯU...</> : <><i className="fa-solid fa-magic" /> Tối Ưu Đa Nền Tảng</>}
          </button>
          {result && (
            <button onClick={exportSEO} className="px-4 py-3 bg-teal-900/40 hover:bg-teal-800/40 border border-teal-500/30 text-teal-300 font-bold rounded-lg flex items-center gap-2 transition-all shrink-0">
              <i className="fa-solid fa-download" /> Tải SEO (.txt)
            </button>
          )}
        </div>

        {scriptSegments.length > 0 && !result && (
           <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm flex items-start gap-3">
             <i className="fa-solid fa-circle-info mt-1" />
             <p>Hệ thống đã nhận diện được <strong>{scriptSegments.length} cảnh</strong> kịch bản. Khi bấm "Tối Ưu", AI sẽ đọc trực tiếp nội dung kịch bản để tạo ra bộ SEO sát nhất cho YouTube, TikTok và Facebook.</p>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Checklist Area (1 Col) */}
          <div className="md:col-span-1 bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><i className="fa-solid fa-check-square" /> CHECKLIST</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {Object.entries(SEO_CHECKLIST_DATA).map(([sec, items]) => (
                <div key={sec} className="bg-[#12161e]/50 rounded-lg p-3 border border-slate-700/30">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">{sec}</div>
                  <div className="space-y-2">
                    {items.map(item => (
                      <label key={item.id} className="flex items-start gap-2 cursor-pointer group" onClick={() => toggle(item.id)}>
                        <div className={\`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 \${checks[item.id] ? 'bg-amber-500 border-amber-500' : 'border-slate-600 bg-[#0a0e14]'}\`}>
                          {checks[item.id] && <i className="fa-solid fa-check text-white text-[10px]" />}
                        </div>
                        <span className={\`text-xs \${checks[item.id] ? 'text-slate-500 line-through' : 'text-slate-400 group-hover:text-white'}\`}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Area (2 Cols) */}
          <div className="md:col-span-2 space-y-4">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-10 bg-slate-800/20 border border-slate-700/30 border-dashed rounded-xl">
                <i className="fa-solid fa-chart-pie mb-2 opacity-50 text-2xl" /><p className="text-sm">Chưa có dữ liệu phân tích</p>
              </div>
            ) : (
              <>
                {/* Keywords & Hashtags Global */}
                <div className="flex gap-4">
                  {result.keywords && (
                    <div className="flex-1 bg-amber-900/10 border border-amber-500/20 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-amber-400 mb-2 uppercase">🔑 KEYWORDS</h4>
                      <div className="flex flex-wrap gap-1">{result.keywords.primary?.map((k: string, i: number) => <span key={i} className="bg-amber-900/20 text-amber-200 px-2 py-0.5 rounded-full text-[10px] border border-amber-500/20">{k}</span>)}</div>
                    </div>
                  )}
                  {result.hashtags && (
                    <div className="flex-1 bg-teal-900/10 border border-teal-500/20 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-teal-400 mb-2 uppercase">#️⃣ HASHTAGS</h4>
                      <div className="flex flex-wrap gap-1">{result.hashtags.map((h: string, i: number) => <span key={i} className="text-teal-300 text-[10px]">{h}</span>)}</div>
                    </div>
                  )}
                </div>

                {/* Platform Tabs */}
                <div className="bg-[#10141c] rounded-xl border border-slate-700/30 overflow-hidden">
                  <div className="flex border-b border-slate-700/50">
                    <button onClick={() => setActiveTab('youtube')} className={\`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 \${activeTab === 'youtube' ? 'bg-red-900/20 text-red-400 border-b-2 border-red-500' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}\`}>
                      <i className="fa-brands fa-youtube" /> YouTube
                    </button>
                    <button onClick={() => setActiveTab('tiktok')} className={\`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 \${activeTab === 'tiktok' ? 'bg-slate-800 text-white border-b-2 border-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}\`}>
                      <i className="fa-brands fa-tiktok" /> TikTok
                    </button>
                    <button onClick={() => setActiveTab('facebook')} className={\`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 \${activeTab === 'facebook' ? 'bg-blue-900/20 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}\`}>
                      <i className="fa-brands fa-facebook" /> Facebook
                    </button>
                  </div>
                  
                  <div className="p-4 min-h-[300px]">
                    {activeTab === 'youtube' && result.youtube && (
                       <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                          <div>
                            <h4 className="text-xs font-bold text-red-400 mb-2">🔥 TIÊU ĐỀ YOUTUBE</h4>
                            {result.youtube.viral_titles?.map((t: string, i: number) => (
                               <div key={i} className="bg-black/20 p-2 rounded border border-red-900/30 text-sm text-slate-200 mb-2 flex justify-between"><span className="flex-1">{t}</span><button onClick={() => copy(t)} className="text-slate-500 hover:text-white"><i className="fa-solid fa-copy" /></button></div>
                            ))}
                          </div>
                          {result.youtube.video_description && (
                            <div>
                               <h4 className="text-xs font-bold text-red-400 mb-2">📝 MÔ TẢ YOUTUBE</h4>
                               <div className="bg-black/20 p-3 rounded border border-red-900/30 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed relative">
                                  <button onClick={() => copy(result.youtube.video_description.hook + '\\n\\n' + result.youtube.video_description.full_description)} className="absolute top-2 right-2 text-slate-500 hover:text-white"><i className="fa-solid fa-copy" /></button>
                                  <strong>[HOOK]: </strong> {result.youtube.video_description.hook}\\n\\n
                                  {result.youtube.video_description.full_description}
                               </div>
                            </div>
                          )}
                       </div>
                    )}

                    {activeTab === 'tiktok' && result.tiktok && (
                       <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                          <div>
                            <h4 className="text-xs font-bold text-white mb-2">🔥 TIÊU ĐỀ TIKTOK</h4>
                            {result.tiktok.viral_titles?.map((t: string, i: number) => (
                               <div key={i} className="bg-black/20 p-2 rounded border border-slate-700/50 text-sm text-slate-200 mb-2 flex justify-between"><span className="flex-1">{t}</span><button onClick={() => copy(t)} className="text-slate-500 hover:text-white"><i className="fa-solid fa-copy" /></button></div>
                            ))}
                          </div>
                          {result.tiktok.caption && (
                            <div>
                               <h4 className="text-xs font-bold text-white mb-2">💬 CAPTION TIKTOK (NGẮN GỌN)</h4>
                               <div className="bg-black/20 p-3 rounded border border-slate-700/50 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed relative">
                                  <button onClick={() => copy(result.tiktok.caption)} className="absolute top-2 right-2 text-slate-500 hover:text-white"><i className="fa-solid fa-copy" /></button>
                                  {result.tiktok.caption}
                               </div>
                            </div>
                          )}
                       </div>
                    )}

                    {activeTab === 'facebook' && result.facebook && (
                       <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                          <div>
                            <h4 className="text-xs font-bold text-blue-400 mb-2">🔥 TIÊU ĐỀ FACEBOOK</h4>
                            {result.facebook.viral_titles?.map((t: string, i: number) => (
                               <div key={i} className="bg-black/20 p-2 rounded border border-blue-900/30 text-sm text-slate-200 mb-2 flex justify-between"><span className="flex-1">{t}</span><button onClick={() => copy(t)} className="text-slate-500 hover:text-white"><i className="fa-solid fa-copy" /></button></div>
                            ))}
                          </div>
                          {result.facebook.status_post && (
                            <div>
                               <h4 className="text-xs font-bold text-blue-400 mb-2">📝 BÀI ĐĂNG FACEBOOK (STATUS)</h4>
                               <div className="bg-black/20 p-3 rounded border border-blue-900/30 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed relative">
                                  <button onClick={() => copy(result.facebook.status_post)} className="absolute top-2 right-2 text-slate-500 hover:text-white"><i className="fa-solid fa-copy" /></button>
                                  {result.facebook.status_post}
                               </div>
                            </div>
                          )}
                       </div>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {Array.isArray(result.thumbnail_suggestions) && (
                  <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-purple-400 mb-3 uppercase flex items-center gap-2"><i className="fa-solid fa-image" /> THUMBNAIL TƯƠNG TÁC CAO (3 GỢI Ý)</h4>
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
                            <p className="text-[10px] text-slate-400 font-mono bg-[#12161e] p-2 rounded border border-slate-800">{thumb.ai_image_prompt}</p>
                          </div>
                          
                          {/* Image Generation Section */}
                          <div className="mt-3">
                            {thumbnails[i]?.url ? (
                              <div className="relative group">
                                <img src={thumbnails[i].url} alt={thumb.concept_name} className="w-full h-auto rounded-lg border border-purple-500/30 object-cover aspect-video" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-lg">
                                  <a href={thumbnails[i].url} download={\`thumbnail_opt\${i+1}.png\`} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-sm flex items-center gap-2">
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
`;

fs.writeFileSync(path, seoModuleContent, 'utf8');
console.log('SeoModule rewritten for VKT_KIDS.');
