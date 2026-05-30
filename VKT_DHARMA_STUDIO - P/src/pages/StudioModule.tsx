import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/aiService';
import { showToast } from '../components/Toast';

interface Props { segments: any[]; topic?: string; uiLang?: 'vi' | 'en'; }

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

// 🌟 StudioSceneCard: Memoized sub-component to prevent unnecessary card re-renders
const StudioSceneCard = React.memo(({ 
  seg, 
  idx, 
  mode, 
  result, 
  loadingIdx, 
  genMedia, 
  copy 
}: { 
  seg: any, 
  idx: number, 
  mode: 'video' | 'image', 
  result: string | undefined, 
  loadingIdx: number | null, 
  genMedia: (idx: number) => void, 
  copy: (t: string) => void 
}) => {
  const prompt = mode === 'video' ? seg.video_prompt : seg.image_prompt;
  const isLoading = loadingIdx === idx;

  return (
    <div className="bg-[#12161e] border border-slate-700/30 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start hover:border-slate-600 transition-colors">
      <div className={`px-3 py-1.5 rounded text-xs font-bold text-white h-fit shadow-lg shrink-0 ${mode === 'video' ? 'bg-cyan-900/50' : 'bg-purple-900/50'}`}>SCENE {idx + 1}</div>
      <div className="flex-1 w-full min-w-0">
        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{mode === 'video' ? '🎬 VIDEO PROMPT' : '🖼️ IMAGE PROMPT'}</div>
        <div className="relative group">
          <p className="text-xs text-slate-300 font-mono mb-3 bg-[#0a0e14]/50 p-3 rounded border border-slate-700/30 leading-relaxed pr-10 break-words">{prompt || 'No prompt'}</p>
          <button onClick={() => copy(prompt || '')} className="absolute top-2 right-2 p-1.5 bg-[#12161e] text-slate-300 rounded hover:bg-blue-900/50 hover:text-white border border-slate-700/30"><i className="fa-solid fa-copy" /></button>
        </div>
        <button onClick={() => genMedia(idx)} disabled={loadingIdx !== null}
          className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50 ${mode === 'video' ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500/20' : 'bg-purple-900/20 text-purple-400 border-purple-500/20'}`}>
          {isLoading ? <><i className="fa-solid fa-sync animate-spin" /> Đang tạo...</> : <><i className="fa-solid fa-magic" /> Tạo {mode === 'video' ? 'Video' : 'Ảnh'}</>}
        </button>
        {seg.voice_profile && (
          <div className="mt-3 p-2.5 bg-purple-950/20 rounded-lg border border-purple-500/20 space-y-1.5 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-purple-400 flex items-center gap-1"><i className="fa-solid fa-user-tie" /> {seg.voice_profile.speaker}</div>
              <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${seg.voice_profile.state === 'ON-SCREEN' ? 'bg-amber-900/40 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>{seg.voice_profile.state}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              <div className="bg-[#0a0e14]/30 rounded p-1.5 border border-purple-900/20">
                <div className="text-[8px] text-purple-500 font-bold">AGE & DETAILS</div>
                <div className="text-[9px] text-slate-300 font-medium">{seg.voice_profile.age || (seg.voice_profile.gender ? `${seg.voice_profile.gender}` : 'Chưa rõ độ tuổi')}</div>
              </div>
              <div className="bg-[#0a0e14]/30 rounded p-1.5 border border-purple-900/20">
                <div className="text-[8px] text-purple-500 font-bold">ACCENT</div>
                <div className="text-[9px] text-slate-300 font-mono text-purple-300/80">{seg.voice_profile.accent || 'NORTHERN_VIETNAMESE'}</div>
              </div>
              <div className="bg-[#0a0e14]/30 rounded p-1.5 border border-purple-900/20">
                <div className="text-[8px] text-purple-500 font-bold">TIMBRE</div>
                <div className="text-[9px] text-slate-300">{seg.voice_profile.timbre}</div>
              </div>
              <div className="bg-[#0a0e14]/30 rounded p-1.5 border border-purple-900/20">
                <div className="text-[8px] text-purple-500 font-bold">TONE</div>
                <div className="text-[9px] text-slate-300">{seg.voice_profile.tone}</div>
              </div>
              <div className="bg-[#0a0e14]/30 rounded p-1.5 border border-purple-900/20">
                <div className="text-[8px] text-purple-500 font-bold">SPEED</div>
                <div className="text-[9px] text-slate-300">{seg.voice_profile.pacing_speed || seg.voice_profile.pacing}</div>
              </div>
            </div>
            {(seg.word_count || seg.audio_end_time) && (
              <div className="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-purple-900/30">
                {seg.word_count && (
                  <div className="flex items-center gap-1.5 text-[9px]">
                    <span className="text-purple-400/70 font-bold">WORDS:</span>
                    <span className="text-purple-200 font-mono">{seg.word_count}</span>
                  </div>
                )}
                {seg.audio_end_time && (
                  <div className="flex items-center gap-1.5 text-[9px]">
                    <span className="text-purple-400/70 font-bold">END TIME:</span>
                    <span className="text-purple-200 font-mono">{seg.audio_end_time}</span>
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-amber-100 italic mt-1">"{seg.voice_text}"</p>
          </div>
        )}
      </div>
      <div className={`w-full sm:w-64 bg-[#0a0e14] rounded border border-slate-700/30 overflow-hidden shrink-0 flex items-center justify-center ${mode === 'video' ? 'aspect-video' : 'aspect-square'}`}>
        {result ? (
          <div className="relative group w-full h-full">
            <img src={result} className="w-full h-full object-cover" />
            
            {/* VKT Premium Watermark Mask (Che đè logo Veo ở góc phải dưới) */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-amber-500/30 text-[8px] font-black text-amber-400 tracking-wider pointer-events-none select-none z-10 flex items-center gap-1 shadow-md">
              <i className="fa-solid fa-rocket animate-pulse text-[7px]" /> VKT STUDIO
            </div>

            <div className="absolute inset-0 bg-[#0a0e14]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <a href={result} download={`scene_${idx}.png`} className="px-3 py-1.5 bg-white text-black rounded text-xs font-bold flex items-center gap-1"><i className="fa-solid fa-cloud-download-alt" /> Tải</a>
            </div>
          </div>
        ) : (
          <div className="text-center p-4"><i className={`fa-solid ${mode === 'video' ? 'fa-film' : 'fa-image'} text-2xl mb-2 opacity-50`} /><div className="text-[10px] text-slate-500">Chưa có dữ liệu</div></div>
        )}
      </div>
    </div>
  );
});

const StudioModule: React.FC<Props> = ({ segments, topic = '' }) => {
  const [mode, setMode] = useState<'video' | 'image'>('video');
  const [media, setMedia] = useState<Record<string, string>>({});
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const [showExport, setShowExport] = useState(false);

  const copy = useCallback((t: string) => { 
    navigator.clipboard.writeText(t); 
    showToast('✅ Copied!', 'success'); 
  }, []);

  const genMedia = useCallback(async (idx: number) => {
    if (loadingIdx !== null) return;
    setLoadingIdx(idx);
    try {
      const seg = segments[idx];
      let prompt = mode === 'video' ? seg.video_prompt : seg.image_prompt;
      prompt += mode === 'video' ? ', 8k, cinematic lighting, clean textless video' : ', masterpiece, 8k';
      const result = await generateImage(prompt, mode === 'video' ? '16:9' : '1:1');
      if (result) { 
        setMedia(prev => ({ ...prev, [`${idx}_${mode}`]: result })); 
      }
      else showToast('Lỗi Safety/API. Thử prompt khác.');
    } catch (e: any) { 
      showToast(e.message); 
    } finally { 
      setLoadingIdx(null); 
    }
  }, [segments, mode, loadingIdx]);

  const exportCSV = () => {
    if (!segments.length) return;
    let csv = '\uFEFFScene,Time,Section,Character,Voice,Speaker,Gender,Age,Accent,Timbre,Tone,Pacing,Speed,Words,End Time,State,Audio SFX ASMR Music,Video Prompt,Image Prompt\n';
    segments.forEach((s, i) => {
      const vp = s.voice_profile || {};
      const sfx = s.sfx_music_suggestion || s.sfx_suggestion || '';
      csv += `${i + 1},"${s.time}","${s.section}","${s.character}","${(s.voice_text || '').replace(/"/g, '""')}","${vp.speaker || ''}","${vp.gender || ''}","${vp.age || ''}","${vp.accent || ''}","${vp.timbre || ''}","${vp.tone || ''}","${vp.pacing || ''}","${vp.pacing_speed || ''}","${s.word_count || ''}","${s.audio_end_time || ''}","${vp.state || ''}","${sfx.replace(/"/g, '""')}","${(s.video_prompt || '').replace(/"/g, '""')}","${(s.image_prompt || '').replace(/"/g, '""')}"\n`;
      csv += '\n';
    });
    downloadFile(csv, makeFileName(topic, 'kich_ban', 'csv'), 'text/csv;charset=utf-8;');
    setShowExport(false);
  };

  const exportCSV2 = () => {
    if (!segments.length) return;
    let csv = '\uFEFF';
    segments.forEach((s, i) => {
      const vp = s.voice_profile || {};
      const sfx = s.sfx_music_suggestion || s.sfx_suggestion || '';
      
      const colA = `Scene ${i + 1}`;
      const colB = `Time : ${s.time} Section :${s.section}`;
      const colC = `Character : ${s.character}`;
      const colD = `Voice : ${s.voice_text || ''}`;
      const colE = `Speaker : ${vp.speaker || ''}`;
      const colF = `Gender : ${vp.gender || ''}`;
      const colG = `Age : ${vp.age || ''}`;
      const colH = `Accent : ${vp.accent || ''}`;
      const colI = `Timbre : ${vp.timbre || ''}`;
      const colJ = `Tone : ${vp.tone || ''}`;
      const colK = `Pacing : ${vp.pacing || ''}`;
      const colL = `Speed : ${vp.pacing_speed || ''}`;
      const colM = `Words : ${s.word_count || ''}`;
      const colN = `End Time : ${s.audio_end_time || ''}`;
      const colO = `State : ${vp.state || ''}`;
      const colP = `Audio SFX ASMR Music : ${sfx}`;
      const colQ = `Video Prompt : ${s.video_prompt || ''}`;
      const colR = `Image Prompt : ${s.image_prompt || ''}`;

      csv += `"${colA.replace(/"/g, '""')}","${colB.replace(/"/g, '""')}","${colC.replace(/"/g, '""')}","${colD.replace(/"/g, '""')}","${colE.replace(/"/g, '""')}","${colF.replace(/"/g, '""')}","${colG.replace(/"/g, '""')}","${colH.replace(/"/g, '""')}","${colI.replace(/"/g, '""')}","${colJ.replace(/"/g, '""')}","${colK.replace(/"/g, '""')}","${colL.replace(/"/g, '""')}","${colM.replace(/"/g, '""')}","${colN.replace(/"/g, '""')}","${colO.replace(/"/g, '""')}","${colP.replace(/"/g, '""')}","${colQ.replace(/"/g, '""')}","${colR.replace(/"/g, '""')}"\n`;
      csv += '\n';
    });
    downloadFile(csv, makeFileName(topic, 'csv2', 'csv'), 'text/csv;charset=utf-8;');
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

  const exportCompactJSON = () => {
    if (!segments || !segments.length) return;
    try {
      const formatFileName = (str: string) => {
        return (str || 'kich_ban').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "_").substring(0, 30);
      };
      const renderData = segments.map((scene: any) => ({
        scene_number: scene.scene_number,
        video_prompt: scene.video_prompt || '',
        image_prompt: scene.image_prompt || ''
      }));
      const compactPackage = {
        project_name: topic,
        export_version: "V20.0_PRO_RENDER_ONLY",
        total_scenes: segments.length,
        render_data: renderData
      };
      const content = JSON.stringify(compactPackage, null, 2);
      downloadFile(content, `${formatFileName(topic)}.json`, 'application/json;charset=utf-8');
      setShowExport(false);
      showToast('📦 Đã tải JSON Siêu Ngắn (AI Render)!', 'success');
    } catch (e: any) {
      showToast('Lỗi khi xuất JSON: ' + e.message, 'error');
    }
  };

  if (!segments.length) return (
    <div className="h-full flex flex-col items-center justify-center animate-[slideIn_0.4s_ease-out]">
      <div className="text-center text-slate-500 py-10 italic">Chưa có dữ liệu kịch bản. Hãy tạo kịch bản trước.</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-[slideIn_0.4s_ease-out]">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fa-solid fa-clapperboard text-cyan-500" /> Studio Sáng Tạo</h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#12161e] rounded p-1 border border-slate-700/30">
            <button onClick={() => setMode('video')} className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors ${mode === 'video' ? 'bg-cyan-900/50 text-cyan-100 shadow' : 'text-slate-400 hover:text-white'}`}><i className="fa-solid fa-video" /> VIDEO</button>
            <button onClick={() => setMode('image')} className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors ${mode === 'image' ? 'bg-purple-900/50 text-purple-100 shadow' : 'text-slate-400 hover:text-white'}`}><i className="fa-solid fa-image" /> ẢNH</button>
          </div>
          <div className="relative">
            <button onClick={() => setShowExport(!showExport)} className="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 bg-green-900/40 text-green-300 hover:bg-green-800/50 border border-green-500/20"><i className="fa-solid fa-download" /> Tải <i className="fa-solid fa-chevron-down text-[10px]" /></button>
            {showExport && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#12161e] border border-slate-700/30 rounded-xl shadow-xl z-50 overflow-hidden">
                <button onClick={exportProjectJSON} className="w-full text-left px-4 py-2 text-xs text-amber-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2 font-bold bg-amber-900/10"><i className="fa-solid fa-file-code text-amber-500" /> Tải Dự Án (.json)</button>
                <button onClick={exportCompactJSON} className="w-full text-left px-4 py-2 text-xs text-cyan-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2 font-bold bg-cyan-900/10"><i className="fa-solid fa-microchip text-cyan-500" /> Tải JSON Siêu Ngắn (AI Render)</button>
                <button onClick={exportCSV} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-excel text-green-500" /> Excel Kịch Bản</button>
                <button onClick={exportCSV2} className="w-full text-left px-4 py-2 text-xs text-emerald-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2 font-bold"><i className="fa-solid fa-file-excel text-emerald-400" /> Excel Kịch Bản V2</button>
                <button onClick={() => exportPrompts('video', 'csv')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-video text-cyan-500" /> Excel Prompt Video</button>
                <button onClick={() => exportPrompts('image', 'csv')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-image text-purple-500" /> Excel Prompt Ảnh</button>
                <button onClick={() => exportPrompts('video', 'txt')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-regular fa-file-lines text-cyan-500" /> TXT Prompt Video</button>
                <button onClick={() => exportPrompts('image', 'txt')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 flex items-center gap-2"><i className="fa-regular fa-file-lines text-purple-500" /> TXT Prompt Ảnh</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-10">
        {segments.map((seg, idx) => (
          <StudioSceneCard
            key={idx}
            seg={seg}
            idx={idx}
            mode={mode}
            result={media[`${idx}_${mode}`]}
            loadingIdx={loadingIdx}
            genMedia={genMedia}
            copy={copy}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(StudioModule);