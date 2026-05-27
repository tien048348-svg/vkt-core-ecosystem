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
}

const SeoModule: React.FC<Props> = ({ 
  market = 'vn_recycle', 
  initialTopic = '',
  scriptSegments = [],
  scriptTopic = ''
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [thumbnails, setThumbnails] = useState<Record<number, { url?: string, loading?: boolean }>>({});
  const [activePlatform, setActivePlatform] = useState<'youtube' | 'tiktok' | 'facebook_reels'>('youtube');

  React.useEffect(() => { 
    if (initialTopic) setTopic(initialTopic); 
  }, [initialTopic]);

  const copy = (t: string) => { 
    navigator.clipboard.writeText(t); 
    showToast('✅ Đã sao chép thành công!', 'success'); 
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

  const exportSEO = () => {
    if (!result) return;
    
    let content = `=========================================================\n`;
    content += `BỘ TỐI ƯU SEO 3 NỀN TẢNG: ${(scriptTopic || topic || 'KỊCH BẢN').toUpperCase()}\n`;
    content += `Dự án: Tái Chế phế liệu (TAI CHE)\n`;
    content += `Ngày tạo: ${new Date().toLocaleString()}\n`;
    content += `=========================================================\n\n`;
    
    if (result.keywords) {
      content += `🔑 KEYWORDS CHUNG:\n`;
      if (result.keywords.primary) content += `- Chính: ${result.keywords.primary.join(', ')}\n`;
      if (result.keywords.secondary) content += `- Phụ: ${result.keywords.secondary.join(', ')}\n`;
      if (result.keywords.long_tail) content += `- Long-tail: ${result.keywords.long_tail.join(', ')}\n`;
      content += `\n---------------------------------------------------------\n\n`;
    }

    // YouTube
    const yt = result.platforms?.youtube;
    if (yt) {
      content += `🔴 NỀN TẢNG YOUTUBE:\n\n`;
      content += `[Viral Titles / Tiêu đề thu hút CTR]:\n`;
      if (Array.isArray(yt.viral_titles)) {
        yt.viral_titles.forEach((t: string, i: number) => {
          content += `- Tiêu đề ${i + 1}: ${t}\n`;
        });
      }
      content += `\n[Description / Mô tả chi tiết & Timestamps]:\n`;
      content += `${yt.description}\n\n`;
      content += `[Hashtags]:\n`;
      if (Array.isArray(yt.hashtags)) content += `${yt.hashtags.join(' ')}\n`;
      content += `\n---------------------------------------------------------\n\n`;
    }

    // TikTok
    const tt = result.platforms?.tiktok;
    if (tt) {
      content += `⚫ NỀN TẢNG TIKTOK:\n\n`;
      content += `[Viral Titles / Tiêu đề giật gân]:\n`;
      if (Array.isArray(tt.viral_titles)) {
        tt.viral_titles.forEach((t: string, i: number) => {
          content += `- Tiêu đề ${i + 1}: ${t}\n`;
        });
      }
      content += `\n[Description / Mô tả ngắn & Hook]:\n`;
      content += `${tt.description}\n\n`;
      content += `[Hashtags]:\n`;
      if (Array.isArray(tt.hashtags)) content += `${tt.hashtags.join(' ')}\n`;
      content += `\n---------------------------------------------------------\n\n`;
    }

    // Facebook Reels
    const fb = result.platforms?.facebook_reels || result.platforms?.reels;
    if (fb) {
      content += `🔵 NỀN TẢNG FACEBOOK REELS:\n\n`;
      content += `[Viral Titles / Tiêu đề khơi gợi thảo luận]:\n`;
      if (Array.isArray(fb.viral_titles)) {
        fb.viral_titles.forEach((t: string, i: number) => {
          content += `- Tiêu đề ${i + 1}: ${t}\n`;
        });
      }
      content += `\n[Description / Mô tả kích thích comment]:\n`;
      content += `${fb.description}\n\n`;
      content += `[Hashtags]:\n`;
      if (Array.isArray(fb.hashtags)) content += `${fb.hashtags.join(' ')}\n`;
      content += `\n---------------------------------------------------------\n\n`;
    }

    // Thumbnail
    if (Array.isArray(result.thumbnail_suggestions)) {
      content += `🖼️ Ý TƯỞNG THUMBNAIL (3 GỢI Ý):\n\n`;
      result.thumbnail_suggestions.forEach((thumb: any, i: number) => {
        content += `--- Gợi ý ${i + 1}: ${thumb.concept_name} ---\n`;
        content += `- Hình ảnh: ${thumb.visual_concept}\n`;
        content += `- Text trên ảnh: ${thumb.text_on_image}\n`;
        content += `- Tông màu: ${thumb.color_psychology}\n`;
        content += `- Prompt AI: ${thumb.ai_image_prompt}\n\n`;
      });
      content += `---------------------------------------------------------\n\n`;
    }

    // Engagement
    const comment = result.engagement_comments;
    if (comment) {
      content += `💬 KỊCH BẢN TƯƠNG TÁC (ENGAGEMENT):\n\n`;
      if (comment.pinned_comment) content += `- Bình luận Ghim: ${comment.pinned_comment}\n`;
      if (Array.isArray(comment.discussion_starters)) {
        content += `- Câu hỏi thảo luận:\n`;
        comment.discussion_starters.forEach((ds: string) => content += `  + ${ds}\n`);
      }
      if (comment.call_to_action) content += `- Quà tặng kêu gọi hành động (CTA): ${comment.call_to_action}\n`;
    }

    const safeTopic = (scriptTopic || topic || 'seo').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const date = new Date();
    const ts = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;
    
    downloadFile(content, `${safeTopic}_seo_pack_${ts}.txt`, 'text/plain;charset=utf-8');
    showToast('Đã tải xuống bộ SEO đầy đủ 3 nền tảng!', 'success');
  };

  const handleGenerate = async () => {
    if (!topic) return showToast('Nhập chủ đề SEO!');
    setLoading(true);
    try {
      const mk = TARGET_MARKETS[market] || TARGET_MARKETS['vn_recycle'];
      let prompt = `TOPIC: "${topic}"\nTARGET_LANGUAGE: ${mk.voice_lang}\nTARGET_MARKET: ${mk.name}\nRESPOND ALL TEXT FIELDS IN VIETNAMESE.\nGENERATE JSON.`;
      
      if (scriptSegments && scriptSegments.length > 0) {
        prompt += `\n\nDETAILED SCRIPT SEGMENTS FOR TIMESTAMPS GENERATION:\n${JSON.stringify(scriptSegments.map(s => ({
          scene_number: s.scene_number,
          section: s.section,
          visual_desc_vi: s.visual_desc_vi || s.visual_desc,
          time: s.time
        })), null, 2)}`;
      }
      
      const json = await callAI(prompt, SYSTEM_PROMPT_SEO_MASTER);
      setResult(json);
      showToast('✨ Đã phân tích & bóc tách SEO 3 nền tảng thành công!', 'success');
    } catch (e: any) { 
      showToast(e.message); 
    } finally { 
      setLoading(false); 
    }
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
    <div className="max-w-[1600px] mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-seedling text-amber-500 animate-bounce" /> SEO Eco-Art 3 Nền Tảng
        </h2>

        {/* Nhãn liên kết kịch bản thành công màu Amber */}
        {scriptSegments && scriptSegments.length > 0 && (
          <div className="mb-6 p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center gap-3 animate-pulse">
            <i className="fa-solid fa-link text-amber-400 text-lg" />
            <div className="text-xs">
              <span className="font-extrabold text-amber-300 uppercase tracking-wider block mb-0.5">🔗 LIÊN KẾT KỊCH BẢN THÀNH CÔNG</span>
              <span className="text-slate-300">Đã nạp kịch bản: <strong className="text-amber-400 font-black">"{scriptTopic || topic}"</strong> ({scriptSegments.length} Phân cảnh 8 giây). Sẵn sàng bóc tách SEO Timeline tự động.</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 md:gap-4 mb-6 flex-col sm:flex-row">
          <input 
            value={topic} 
            onChange={e => setTopic(e.target.value)} 
            className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-slate-600 font-semibold" 
            placeholder="Nhập chủ đề hoặc kịch bản tự động đồng bộ..." 
          />
          <button 
            onClick={handleGenerate} 
            disabled={loading} 
            className="px-6 py-3 bg-amber-900/40 hover:bg-amber-800/40 border border-amber-500/30 text-amber-100 font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
          >
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> ĐANG TỐI ƯU...</> : <><i className="fa-solid fa-wand-magic-sparkles" /> Tối Ưu SEO 3 Nền Tảng</>}
          </button>
          {result && (
            <button 
              onClick={exportSEO} 
              className="px-4 py-3 bg-teal-900/40 hover:bg-teal-800/40 border border-teal-500/30 text-teal-300 font-bold rounded-lg flex items-center gap-2 transition-all shrink-0"
            >
              <i className="fa-solid fa-download" /> Tải SEO (.txt)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Cột 1: Checklist - Chiếm 2/5 */}
          <div className="lg:col-span-2 bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-check-square text-amber-400" /> BẢNG KIỂM TRA CHẤT LƯỢNG SEO
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
              {Object.entries(SEO_CHECKLIST_DATA).map(([sec, items]) => (
                <div key={sec} className="bg-[#12161e]/50 rounded-lg p-3 border border-slate-700/30">
                  <div className="text-[10px] font-bold text-amber-400 uppercase mb-2 tracking-wider">{sec}</div>
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

          {/* Cột 2: Kết quả bóc tách SEO 3 Nền tảng - Chiếm 3/5 */}
          <div className="lg:col-span-3 space-y-4">
            {!result ? (
              <div className="h-[400px] flex flex-col items-center justify-center text-slate-500 p-10 bg-slate-800/10 border border-slate-700/30 border-dashed rounded-xl">
                <i className="fa-solid fa-seedling mb-3 text-4xl opacity-40 text-amber-500 animate-pulse" />
                <p className="text-sm font-semibold text-slate-400">Chưa có kết quả phân tích SEO</p>
                <p className="text-xs text-slate-500 mt-1">Vui lòng nạp kịch bản từ tab Biên kịch hoặc click "Tối Ưu SEO 3 Nền Tảng"</p>
              </div>
            ) : (
              <>
                {/* Keywords chung */}
                {result.keywords && (
                  <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 mb-3 uppercase tracking-wider flex items-center gap-1">
                      <i className="fa-solid fa-key" /> Từ Khóa Độc Quyền Chung
                    </h4>
                    {['primary', 'secondary', 'long_tail'].map(type => Array.isArray(result.keywords[type]) && (
                      <div key={type} className="mb-3">
                        <div className="text-[9px] text-slate-500 mb-1 font-bold uppercase tracking-wider">
                          {type === 'primary' ? 'Chính (High Traffic)' : type === 'secondary' ? 'Phụ (Supporting)' : 'Long-tail (Ngách sâu)'}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {result.keywords[type].map((k: string, i: number) => (
                            <span key={i} className="bg-amber-950/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] border border-amber-500/20 font-medium">{k}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab Bar Chọn Nền Tảng Chuyên Biệt */}
                <div className="bg-[#10141c] border border-slate-700/30 rounded-xl overflow-hidden shadow-md">
                  <div className="flex border-b border-slate-700/50 bg-[#0a0e14]/50">
                    {(['youtube', 'tiktok', 'facebook_reels'] as const).map((platform) => {
                      const label = platform === 'youtube' ? 'YouTube SEO' : platform === 'tiktok' ? 'TikTok Viral' : 'Facebook Reels';
                      const icon = platform === 'youtube' ? 'fa-youtube' : platform === 'tiktok' ? 'fa-tiktok' : 'fa-facebook-f';
                      const colorClass = platform === 'youtube' ? 'text-red-500' : platform === 'tiktok' ? 'text-cyan-400' : 'text-blue-400';
                      const isActive = activePlatform === platform;
                      
                      return (
                        <button
                          key={platform}
                          onClick={() => setActivePlatform(platform)}
                          className={`flex-1 py-3.5 px-4 text-xs font-black transition-all flex items-center justify-center gap-2 border-b-2 uppercase tracking-wider ${isActive ? 'bg-[#10141c] border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0a0e14]/30'}`}
                        >
                          <i className={`fa-brands ${icon} ${isActive ? colorClass : 'text-slate-500'}`} />
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 space-y-4 bg-[#10141c]">
                    {result.platforms && result.platforms[activePlatform] ? (
                      <>
                        {/* Viral Titles */}
                        {Array.isArray(result.platforms[activePlatform].viral_titles) && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">Tiêu đề đề xuất (CTR cao):</label>
                              <button onClick={() => copy(result.platforms[activePlatform].viral_titles.join('\n'))} className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"><i className="fa-solid fa-copy" /> Copy All</button>
                            </div>
                            {result.platforms[activePlatform].viral_titles.map((t: string, i: number) => (
                              <div key={i} className="flex justify-between items-center bg-[#0a0e14] p-3 rounded-lg border border-slate-700/30 hover:border-amber-500/20 transition-all">
                                <span className="text-xs text-white font-bold leading-relaxed">{t}</span>
                                <button onClick={() => copy(t)} className="text-slate-500 hover:text-amber-400 ml-3 transition-colors shrink-0"><i className="fa-solid fa-copy" /></button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Description */}
                        {result.platforms[activePlatform].description && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">Nội dung mô tả (Đã bóc tách):</label>
                              <button onClick={() => copy(result.platforms[activePlatform].description)} className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"><i className="fa-solid fa-copy" /> Copy Mô Tả</button>
                            </div>
                            <div className="bg-[#0a0e14]/60 border border-slate-700/50 p-4 rounded-lg">
                              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line text-justify font-mono max-h-[300px] overflow-y-auto scrollbar-thin">{result.platforms[activePlatform].description}</p>
                            </div>
                          </div>
                        )}

                        {/* Hashtags */}
                        {Array.isArray(result.platforms[activePlatform].hashtags) && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">Hashtag Viral của nền tảng:</label>
                              <button onClick={() => copy(result.platforms[activePlatform].hashtags.join(' '))} className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"><i className="fa-solid fa-copy" /> Copy All</button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 p-3 bg-[#0a0e14]/40 border border-slate-700/30 rounded-lg">
                              {result.platforms[activePlatform].hashtags.map((h: string, i: number) => (
                                <button key={i} onClick={() => copy(h)} className="bg-amber-950/20 text-amber-300 px-3 py-1 rounded text-xs border border-amber-500/20 hover:bg-amber-950/40 hover:border-amber-500/40 transition-all font-mono font-bold">{h}</button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-6 text-slate-500 text-xs">Không tìm thấy dữ liệu tối ưu cho nền tảng này trong kết quả AI.</div>
                    )}
                  </div>
                </div>

                {/* Thumbnails gợi ý vẽ ảnh */}
                {Array.isArray(result.thumbnail_suggestions) && (
                  <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 mb-3 uppercase tracking-wider flex items-center gap-2"><i className="fa-solid fa-image" /> Ý Tưởng Thumbnail Kích Thích CTR (3 GỢI Ý)</h4>
                    <div className="space-y-4">
                      {result.thumbnail_suggestions.map((thumb: any, i: number) => (
                        <div key={i} className="bg-[#0a0e14]/80 p-4 rounded-lg border border-slate-700/40 relative">
                          <div className="absolute top-3 right-3 bg-amber-900/20 text-amber-400 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-500/20 uppercase tracking-wide">OPTION {i + 1}</div>
                          <h5 className="text-xs font-black text-amber-400 mb-2 pr-20 uppercase">{thumb.concept_name}</h5>
                          <div className="space-y-2 text-[11px] mb-3">
                            <div className="flex items-start gap-2"><span className="text-slate-500 font-extrabold w-20 shrink-0 uppercase">Text:</span> <span className="text-white bg-amber-500/10 px-2 py-0.5 rounded font-black border border-amber-500/20 uppercase tracking-wide text-xs">{thumb.text_on_image}</span></div>
                            <div className="flex items-start gap-2"><span className="text-slate-500 font-extrabold w-20 shrink-0 uppercase">Hình ảnh:</span> <span className="text-slate-300 leading-relaxed">{thumb.visual_concept}</span></div>
                            <div className="flex items-start gap-2"><span className="text-slate-500 font-extrabold w-20 shrink-0 uppercase">Tông màu:</span> <span className="text-amber-200/80 font-bold">{thumb.color_psychology}</span></div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-800">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] text-slate-500 font-bold uppercase"><i className="fa-solid fa-robot" /> AI Image Prompt</span>
                              <button onClick={() => copy(thumb.ai_image_prompt)} className="text-[10px] text-amber-400 hover:text-white transition-colors flex items-center gap-1 font-bold"><i className="fa-regular fa-copy" /> Copy Prompt</button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono bg-[#12161e] p-2.5 rounded border border-slate-800 leading-relaxed text-justify">{thumb.ai_image_prompt}</p>
                          </div>
                          
                          {/* Vẽ ảnh AI */}
                          <div className="mt-3">
                            {thumbnails[i]?.url ? (
                              <div className="relative group overflow-hidden rounded-lg border border-amber-500/30">
                                <img src={thumbnails[i].url} alt={thumb.concept_name} className="w-full h-auto object-cover aspect-video transition-all duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                  <a href={thumbnails[i].url} download={`thumbnail_option_${i+1}.png`} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-lg text-xs flex items-center gap-2 uppercase tracking-wider">
                                    <i className="fa-solid fa-download" /> Tải Xuống Ảnh
                                  </a>
                                  <button onClick={() => handleGenerateImage(thumb.ai_image_prompt, i)} className="text-[10px] text-slate-300 hover:text-white underline">Vẽ lại ảnh khác</button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleGenerateImage(thumb.ai_image_prompt, i)} 
                                disabled={thumbnails[i]?.loading}
                                className="w-full py-2 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/20 text-amber-300 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                              >
                                {thumbnails[i]?.loading ? <><i className="fa-solid fa-sync animate-spin" /> Đang Vẽ AI...</> : <><i className="fa-solid fa-palette" /> Vẽ Ảnh AI Thumbnail Option {i+1}</>}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Engagement Comments */}
                {result.engagement_comments && (
                  <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 mb-3 uppercase tracking-wider flex items-center gap-2"><i className="fa-solid fa-comments" /> Kịch Bản Tương Tác & Chăm Sóc Độc Giả</h4>
                    <div className="space-y-3 text-xs">
                      {result.engagement_comments.pinned_comment && (
                        <div className="bg-[#0a0e14] p-3 rounded border border-slate-800">
                          <div className="text-[9px] text-amber-400 font-bold uppercase mb-1 flex items-center justify-between">
                            <span>📌 Bình Luận Ghim Đầu Trang:</span>
                            <button onClick={() => copy(result.engagement_comments.pinned_comment)} className="text-slate-500 hover:text-amber-400"><i className="fa-solid fa-copy" /></button>
                          </div>
                          <p className="text-slate-300 leading-relaxed font-semibold">"{result.engagement_comments.pinned_comment}"</p>
                        </div>
                      )}
                      
                      {Array.isArray(result.engagement_comments.discussion_starters) && (
                        <div className="bg-[#0a0e14] p-3 rounded border border-slate-800 space-y-2">
                          <div className="text-[9px] text-amber-400 font-bold uppercase mb-1">💬 Câu hỏi kích thích thảo luận / tạo comment:</div>
                          {result.engagement_comments.discussion_starters.map((ds: string, idx: number) => (
                            <div key={idx} className="flex justify-between items-start gap-2 border-b border-slate-800/40 pb-1.5 last:border-0 last:pb-0">
                              <p className="text-slate-300 flex-1 leading-relaxed">"{ds}"</p>
                              <button onClick={() => copy(ds)} className="text-slate-500 hover:text-amber-400 shrink-0"><i className="fa-solid fa-copy" /></button>
                            </div>
                          ))}
                        </div>
                      )}

                      {result.engagement_comments.call_to_action && (
                        <div className="bg-[#0a0e14] p-3 rounded border border-slate-800">
                          <div className="text-[9px] text-amber-400 font-bold uppercase mb-1 flex items-center justify-between">
                            <span>🎯 Kêu Gọi Hành Động (CTA):</span>
                            <button onClick={() => copy(result.engagement_comments.call_to_action)} className="text-slate-500 hover:text-amber-400"><i className="fa-solid fa-copy" /></button>
                          </div>
                          <p className="text-slate-300 leading-relaxed font-semibold">"{result.engagement_comments.call_to_action}"</p>
                        </div>
                      )}
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
