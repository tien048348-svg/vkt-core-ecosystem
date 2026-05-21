import React, { useState } from 'react';
import { generateImage } from '../services/aiService';
import { showToast } from '../components/Toast';

interface Props { segments: any[]; topic?: string; }

function downloadFile(content: string, fileName: string, mimeType: string) {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  } catch (error) {
    console.error("Download failed:", error);
    showToast("Lỗi hệ thống khi tạo file tải xuống!", "error");
  }
}

function makeFileName(topic: string, suffix: string, ext: string): string {
  const slug = (topic || 'kich_ban').trim().toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF\s-]/gi, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${slug}_${suffix}_${d}-${m}-${y}_${h}${min}.${ext}`;
}

const StudioModule: React.FC<Props> = ({ segments, topic = '' }) => {
  const [mode, setMode] = useState<'video' | 'image'>('video');
  const [media, setMedia] = useState<Record<string, string>>({});
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const [showExport, setShowExport] = useState(false);

  const copy = (t: string) => { navigator.clipboard.writeText(t); showToast('✅ Copied!', 'success'); };

  const genMedia = async (idx: number) => {
    if (loadingIdx !== null) return;
    setLoadingIdx(idx);
    try {
      const seg = segments[idx];
      let prompt = mode === 'video' ? seg.video_prompt : seg.image_prompt;
      prompt += mode === 'video' ? ', 8k, cinematic lighting, clean textless video' : ', masterpiece, 8k';
      const result = await generateImage(prompt, mode === 'video' ? '16:9' : '1:1');
      if (result) { setMedia(prev => ({ ...prev, [`${idx}_${mode}`]: result })); }
      else showToast('Lỗi Safety/API. Thử prompt khác.');
    } catch (e: any) { showToast(e.message); }
    finally { setLoadingIdx(null); }
  };

  const exportCSV = () => {
    if (!segments.length) return;
    let csv = '\uFEFFScene,Time,Section,Character,Voice,Speaker,Timbre,Tone,Pacing,Speed,Words,End Time,State,Video Prompt,Image Prompt\n';
    segments.forEach((s, i) => {
      const vp = s.voice_profile || {};
      csv += `${i + 1},"${s.time}","${s.section}","${s.character}","${(s.voice_text || '').replace(/"/g, '""')}","${vp.speaker || ''}","${vp.timbre || ''}","${vp.tone || ''}","${vp.pacing || ''}","${vp.pacing_speed || ''}","${s.word_count || ''}","${s.audio_end_time || ''}","${vp.state || ''}","${(s.video_prompt || '').replace(/"/g, '""')}","${(s.image_prompt || '').replace(/"/g, '""')}"\n`;
    });
    downloadFile(csv, makeFileName(topic, 'kich_ban', 'csv'), 'text/csv;charset=utf-8;');
    setShowExport(false);
  };

  const exportPrompts = (type: 'video' | 'image', format: 'csv' | 'txt') => {
    if (!segments.length) return;
    if (format === 'csv') {
      let csv = `\uFEFFScene,${type === 'video' ? 'Video' : 'Image'} Prompt\n`;
      segments.forEach((s, i) => { csv += `${i + 1},"${((type === 'video' ? s.video_prompt : s.image_prompt) || '').replace(/"/g, '""')}"\n`; });
      downloadFile(csv, makeFileName(topic, `prompt_${type}`, 'csv'), 'text/csv;charset=utf-8;');
    } else {
      const content = segments.map(s => (type === 'video' ? s.video_prompt : s.image_prompt) || '').filter(Boolean).join('\n\n');
      downloadFile(content, makeFileName(topic, `prompt_${type}`, 'txt'), 'text/plain;charset=utf-8;');
    }
    setShowExport(false);
  };

  const exportProjectJSON = () => {
    if (!segments || !segments.length) {
      showToast('Chưa có kịch bản để tải!', 'error');
      return;
    }
    try {
      const projectData = {
        version: '1.0',
        topic: topic || 'Kich Ban',
        segments
      };
      const content = JSON.stringify(projectData, null, 2);
      downloadFile(content, makeFileName(topic, 'project', 'json'), 'application/json;charset=utf-8');
      setShowExport(false);
      showToast('✅ Tải dự án thành công!', 'success');
    } catch (e: any) {
      console.error(e);
      showToast('Lỗi khi tạo file JSON: ' + e.message, 'error');
    }
  };

  if (!segments.length) return (
    <div className="h-full flex flex-col items-center justify-center animate-[slideIn_0.4s_ease-out]">
      <div className="text-center text-slate-500 py-10 italic">Chưa có dữ liệu kịch bản. Hãy thiết kế nhạc nền thiền trước.</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-[slideIn_0.4s_ease-out]">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fa-solid fa-clapperboard text-emerald-400" /> Xưởng Viết Prompt Suno & Udio</h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#05080b] rounded p-1 border border-emerald-950/40">
            <button onClick={() => setMode('video')} className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors ${mode === 'video' ? 'bg-emerald-950/50 text-emerald-100 shadow' : 'text-slate-400 hover:text-white'}`}><i className="fa-solid fa-video" /> SUNO PROMPT</button>
            <button onClick={() => setMode('image')} className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors ${mode === 'image' ? 'bg-emerald-950/50 text-emerald-100 shadow' : 'text-slate-400 hover:text-white'}`}><i className="fa-solid fa-image" /> UDIO PROMPT</button>
          </div>
          <div className="relative">
            <button onClick={() => setShowExport(!showExport)} className="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-500/20"><i className="fa-solid fa-download" /> Tải <i className="fa-solid fa-chevron-down text-[10px]" /></button>
            {showExport && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#0b0f14] border border-emerald-950/40 rounded-xl shadow-xl z-50 overflow-hidden">
                <button onClick={exportProjectJSON} className="w-full text-left px-4 py-2 text-xs text-emerald-300 hover:bg-slate-800/20 border-b border-emerald-950/30 flex items-center gap-2 font-bold bg-emerald-950/20"><i className="fa-solid fa-file-code text-emerald-400" /> Tải Dự Án (.json)</button>
                <button onClick={exportCSV} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-emerald-950/30 flex items-center gap-2"><i className="fa-solid fa-file-excel text-emerald-500" /> Excel Kịch Bản</button>
                <button onClick={() => exportPrompts('video', 'csv')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-emerald-950/30 flex items-center gap-2"><i className="fa-solid fa-file-video text-emerald-400" /> Excel Prompt Suno</button>
                <button onClick={() => exportPrompts('image', 'csv')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-emerald-950/30 flex items-center gap-2"><i className="fa-solid fa-file-image text-emerald-400" /> Excel Prompt Udio</button>
                <button onClick={() => exportPrompts('video', 'txt')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-emerald-950/30 flex items-center gap-2"><i className="fa-regular fa-file-lines text-emerald-400" /> TXT Prompt Suno</button>
                <button onClick={() => exportPrompts('image', 'txt')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 flex items-center gap-2"><i className="fa-regular fa-file-lines text-emerald-400" /> TXT Prompt Udio</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-10">
        {segments.map((seg, idx) => {
          const prompt = mode === 'video' ? seg.video_prompt : seg.image_prompt;
          const result = media[`${idx}_${mode}`];
          return (
            <div key={idx} className="bg-[#0b0f14] border border-emerald-950/40 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start hover:border-emerald-500/30 transition-colors">
              <div className={`px-3 py-1.5 rounded text-xs font-bold text-white h-fit shadow-lg ${mode === 'video' ? 'bg-emerald-950/50' : 'bg-teal-950/50'}`}>SCENE {idx + 1}</div>
              <div className="flex-1 w-full">
                <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">{mode === 'video' ? '🎬 SUNO PROMPT' : '🖼️ UDIO PROMPT'}</div>
                <div className="relative group">
                  <p className="text-xs text-slate-300 font-mono mb-3 bg-[#05080b]/50 p-3 rounded border border-emerald-950/40 leading-relaxed pr-10">{prompt || 'No prompt'}</p>
                  <button onClick={() => copy(prompt || '')} className="absolute top-2 right-2 p-1.5 bg-[#0b0f14] text-slate-300 rounded hover:bg-emerald-900/50 hover:text-white border border-emerald-950/40"><i className="fa-solid fa-copy" /></button>
                </div>
                <button onClick={() => genMedia(idx)} disabled={loadingIdx !== null}
                  className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50 ${mode === 'video' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' : 'bg-teal-950/20 text-teal-400 border-teal-500/20'}`}>
                  {loadingIdx === idx ? <><i className="fa-solid fa-sync animate-spin" /> Đang tạo...</> : <><i className="fa-solid fa-magic" /> Tạo {mode === 'video' ? 'Video' : 'Ảnh'}</>}
                </button>
                {seg.voice_profile && (
                  <div className="mt-3 p-2.5 bg-emerald-950/20 rounded-lg border border-emerald-500/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1"><i className="fa-solid fa-user-tie" /> {seg.voice_profile.speaker}</div>
                      <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${seg.voice_profile.state === 'ON-SCREEN' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>{seg.voice_profile.state}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="bg-[#05080b]/30 rounded p-1.5 border border-emerald-900/20">
                        <div className="text-[8px] text-emerald-500 font-bold">TIMBRE</div>
                        <div className="text-[9px] text-slate-300">{seg.voice_profile.timbre}</div>
                      </div>
                      <div className="bg-[#05080b]/30 rounded p-1.5 border border-emerald-900/20">
                        <div className="text-[8px] text-emerald-500 font-bold">TONE</div>
                        <div className="text-[9px] text-slate-300">{seg.voice_profile.tone}</div>
                      </div>
                      <div className="bg-[#05080b]/30 rounded p-1.5 border border-emerald-900/20">
                        <div className="text-[8px] text-emerald-500 font-bold">SPEED</div>
                        <div className="text-[9px] text-slate-300">{seg.voice_profile.pacing_speed || seg.voice_profile.pacing}</div>
                      </div>
                    </div>
                    {(seg.word_count || seg.audio_end_time) && (
                      <div className="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-emerald-900/30">
                        {seg.word_count && (
                          <div className="flex items-center gap-1.5 text-[9px]">
                            <span className="text-emerald-400/70 font-bold">WORDS:</span>
                            <span className="text-emerald-200 font-mono">{seg.word_count}</span>
                          </div>
                        )}
                        {seg.audio_end_time && (
                          <div className="flex items-center gap-1.5 text-[9px]">
                            <span className="text-emerald-400/70 font-bold">END TIME:</span>
                            <span className="text-emerald-200 font-mono">{seg.audio_end_time}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-emerald-100 italic mt-1">"{seg.voice_text}"</p>
                  </div>
                )}
              </div>
              <div className={`w-full sm:w-64 bg-[#05080b] rounded border border-emerald-950/40 overflow-hidden shrink-0 flex items-center justify-center ${mode === 'video' ? 'aspect-video' : 'aspect-square'}`}>
                {result ? (
                  <div className="relative group w-full h-full">
                    <img src={result} className="w-full h-full object-cover" />
                    
                    {/* VKT Premium Watermark Mask (Che đè logo Veo ở góc phải dưới) */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-emerald-500/30 text-[8px] font-black text-emerald-400 tracking-wider pointer-events-none select-none z-10 flex items-center gap-1 shadow-md">
                      <i className="fa-solid fa-rocket animate-pulse text-[7px]" /> VKT DHARMA
                    </div>

                    <div className="absolute inset-0 bg-[#05080b]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={result} download={`scene_${idx}.png`} className="px-3 py-1.5 bg-white text-black rounded text-xs font-bold flex items-center gap-1"><i className="fa-solid fa-cloud-download-alt" /> Tải</a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4"><i className={`fa-solid ${mode === 'video' ? 'fa-film' : 'fa-image'} text-2xl mb-2 opacity-50`} /><div className="text-[10px] text-slate-500">Chưa có dữ liệu</div></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudioModule;