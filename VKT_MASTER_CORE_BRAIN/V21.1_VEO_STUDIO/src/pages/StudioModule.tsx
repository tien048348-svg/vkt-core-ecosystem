import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/aiService';
import { showToast } from '../components/Toast';
import ProgressBar from '../components/ProgressBar';
import { getDynamicSpeed } from './ScriptModule';
import JSZip from 'jszip';

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
    const slug = (topic || 'kich_ban')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .trim().toLowerCase()
      .replace(/[^a-z0-9\s-]/gi, '')
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

const getVoiceText = (s: any) => {
  if (s.dialogues && Array.isArray(s.dialogues) && s.dialogues.length > 0) {
    return s.dialogues.map((d: any) => {
      const isNarrator = d.character_name.toLowerCase().includes('dẫn chuyện') || d.character_name.toLowerCase().includes('narrator');
      return isNarrator ? d.line : `[${d.character_name}] ${d.line}`;
    }).join(' | ');
  }
  return s.voice_text || '';
};

const injectAudioParamsToPrompt = (prompt: string, vp: any): string => {
  if (!prompt || typeof prompt !== 'string' || !vp) return prompt || '';
  const audioContext = `[AUDIO PROFILE: ${vp.speaker || ''}, Gender: ${vp.gender || ''}, Age: ${vp.age || ''}, Accent: ${vp.accent || ''}, Timbre: ${vp.timbre || ''}, Tone: ${vp.tone || ''}, Pacing: ${vp.pacing || ''}, Speed: ${vp.pacing_speed || ''}]`;
  
  if (prompt.includes('[AUDIO PROFILE:')) {
    // Replace the existing [AUDIO PROFILE: ...] block with the new one
    return prompt.replace(/\[AUDIO PROFILE:[^\]]*\]/g, audioContext);
  }
  
  if (prompt.includes('VEO3 AUTO-SHIELD')) {
    return prompt.replace('VEO3 AUTO-SHIELD', `${audioContext} VEO3 AUTO-SHIELD`);
  }
  return `${audioContext} ${prompt}`;
};

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
  genProgress: number,
  genMedia: (idx: number) => void, 
  copy: (t: string) => void 
}) => {
  const prompt = mode === 'video' ? injectAudioParamsToPrompt(seg.video_prompt, seg.voice_profile) : seg.image_prompt;
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
        {isLoading ? (
          <div className="mt-3 mb-2">
            <ProgressBar 
              percent={genProgress} 
              text={mode === 'video' ? 'Đang render Video nghệ thuật...' : 'Đang render Ảnh nghệ thuật...'} 
              subText="VKT Studio AI Core"
              colorTheme="amber"
            />
          </div>
        ) : (
          <button onClick={() => genMedia(idx)} disabled={loadingIdx !== null}
            className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50 mt-2 ${mode === 'video' ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500/20' : 'bg-purple-900/20 text-purple-400 border-purple-500/20'}`}>
            <i className="fa-solid fa-magic" /> Tạo {mode === 'video' ? 'Video' : 'Ảnh'}
          </button>
        )}
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

const StudioModule: React.FC<Props> = ({ segments: initialSegments, topic = '' }) => {
  const segments = initialSegments.map(seg => ({
    ...seg,
    voice_profile: seg.voice_profile ? {
      ...seg.voice_profile,
      pacing_speed: getDynamicSpeed(seg.word_count || seg.voice_text, 8, 1, null, null)
    } : seg.voice_profile
  }));
  const [mode, setMode] = useState<'video' | 'image'>('video');
  const [media, setMedia] = useState<Record<string, string>>({});
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const [genProgress, setGenProgress] = useState(0);
  const [showExport, setShowExport] = useState(false);

  const copy = useCallback((t: string) => { 
    navigator.clipboard.writeText(t); 
    showToast('✅ Copied!', 'success'); 
  }, []);

  const genMedia = useCallback(async (idx: number) => {
    if (loadingIdx !== null) return;
    setLoadingIdx(idx);
    setGenProgress(2);
    const progressInterval = setInterval(() => {
      setGenProgress(prev => (prev < 90 ? prev + 1.5 : prev));
    }, 100);

    try {
      const seg = segments[idx];
      let prompt = mode === 'video' ? injectAudioParamsToPrompt(seg.video_prompt, seg.voice_profile) : seg.image_prompt;
      prompt += mode === 'video' ? ', 8k, cinematic lighting, clean textless video' : ', masterpiece, 8k';
      const result = await generateImage(prompt, mode === 'video' ? '16:9' : '1:1');
      if (result) { 
        setMedia(prev => ({ ...prev, [`${idx}_${mode}`]: result })); 
      }
      else showToast('Lỗi Safety/API. Thử prompt khác.');
    } catch (e: any) { 
      showToast(e.message); 
    } finally { 
      clearInterval(progressInterval);
      setGenProgress(100);
      setTimeout(() => {
        setLoadingIdx(null); 
        setGenProgress(0);
      }, 500);
    }
  }, [segments, mode, loadingIdx]);

  const exportCSV = () => {
    if (!segments.length) return;
    let csv = '\uFEFFScene,Time,Section,Character,Voice Text,Speaker,Gender,Age,Accent,Timbre,Tone,Pacing,Speed,Words,End Time,State,Audio SFX ASMR Music,Video Prompt,Image Prompt\n';
    segments.forEach((s, i) => {
      const vp = s.voice_profile || {};
      const sfx = s.sfx_music_suggestion || s.sfx_suggestion || '';
      csv += `${i + 1},"${s.time}","${s.section}","${s.character}","${getVoiceText(s).replace(/"/g, '""')}","${vp.speaker || ''}","${vp.gender || ''}","${vp.age || ''}","${vp.accent || ''}","${vp.timbre || ''}","${vp.tone || ''}","${vp.pacing || ''}","${vp.pacing_speed || ''}","${s.word_count || ''}","${s.audio_end_time || ''}","${vp.state || ''}","${sfx.replace(/"/g, '""')}","${injectAudioParamsToPrompt(s.video_prompt, vp).replace(/"/g, '""')}","${(s.image_prompt || '').replace(/"/g, '""')}"\n`;
    });
    downloadFile(csv, makeFileName(topic || '', 'KichBan_TongThe', 'csv'), 'text/csv;charset=utf-8;');
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
      const colD = `Voice : ${getVoiceText(s)}`;
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
      const colQ = `Video Prompt : ${injectAudioParamsToPrompt(s.video_prompt, vp)}`;
      const colR = `Image Prompt : ${s.image_prompt || ''}`;

      csv += `"${colA.replace(/"/g, '""')}","${colB.replace(/"/g, '""')}","${colC.replace(/"/g, '""')}","${colD.replace(/"/g, '""')}","${colE.replace(/"/g, '""')}","${colF.replace(/"/g, '""')}","${colG.replace(/"/g, '""')}","${colH.replace(/"/g, '""')}","${colI.replace(/"/g, '""')}","${colJ.replace(/"/g, '""')}","${colK.replace(/"/g, '""')}","${colL.replace(/"/g, '""')}","${colM.replace(/"/g, '""')}","${colN.replace(/"/g, '""')}","${colO.replace(/"/g, '""')}","${colP.replace(/"/g, '""')}","${colQ.replace(/"/g, '""')}","${colR.replace(/"/g, '""')}"\n`;
    });
    downloadFile(csv, makeFileName(topic || '', 'KichBan_V2', 'csv'), 'text/csv;charset=utf-8;');
    setShowExport(false);
  };

  const exportPrompts = (type: 'video' | 'image', format: 'csv' | 'txt' | 'json') => {
    if (!segments.length) return;
    const suffix = `Prompt_${type === 'video' ? 'Video' : 'Anh'}`;
    if (format === 'csv') {
      let csv = `\uFEFFScene,Voice Text,${type === 'video' ? 'Video' : 'Image'} Prompt\n`;
      segments.forEach((s, i) => { 
        csv += `${i + 1},"${getVoiceText(s).replace(/"/g, '""')}","${((type === 'video' ? injectAudioParamsToPrompt(s.video_prompt, s.voice_profile) : s.image_prompt) || '').replace(/"/g, '""')}"\n`; 
      });
      downloadFile(csv, makeFileName(topic || '', suffix, 'csv'), 'text/csv;charset=utf-8;');
    } else if (format === 'txt') {
      const content = segments.map((s, i) => {
        const prompt = ((type === 'video' ? injectAudioParamsToPrompt(s.video_prompt, s.voice_profile) : s.image_prompt) || '').trim();
        const vText = getVoiceText(s).trim();
        const voiceText = vText ? `\n[VOICE TEXT]: ${vText}` : '';
        return `[SCENE ${i + 1}]${voiceText}\n${prompt}`;
      }).filter(Boolean).join('\n\n');
      downloadFile(content, makeFileName(topic || '', suffix, 'txt'), 'text/plain;charset=utf-8;');
    } else if (format === 'json') {
      const data = segments.map((s, i) => ({
        scene: i + 1,
        voice_text: getVoiceText(s).trim(),
        prompt: ((type === 'video' ? injectAudioParamsToPrompt(s.video_prompt, s.voice_profile) : s.image_prompt) || '').trim()
      }));
      downloadFile(JSON.stringify(data, null, 2), makeFileName(topic || '', suffix, 'json'), 'application/json;charset=utf-8;');
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
      const content = JSON.stringify(projectData);
      downloadFile(content, makeFileName(topic || '', 'HeThong_KhoiPhuc', 'json'), 'application/json;charset=utf-8');
      setShowExport(false);
      showToast('✅ Tải hệ thống khôi phục thành công!', 'success');
    } catch (e: any) {
      console.error(e);
      showToast('Lỗi khi tạo file JSON: ' + e.message, 'error');
    }
  };

  const exportProjectJSON_CastLock = () => {
    if (!segments || !segments.length) {
      showToast('Chưa có kịch bản để tải!', 'error');
      return;
    }
    try {
      const projectData = {
        version: '1.0',
        topic: topic || 'Kich Ban',
        cast_lock: [
          {
            "character_id": "char_001",
            "display_name": "Zen Master",
            "identity_lock": "SOLO 1 character ONLY, A 70-year-old living sentient white marble monk standing on two feet with radiant 24k Kintsugi gold veins",
            "face_design": "pure pristine white marble skin with glowing 24k Kintsugi gold veins, deep marble wrinkles, realistic facial hair but made of marble, 100% completely bald shaved head, NO CARVED STATUE LOOK",
            "hair_design": "100% completely bald shaved head, zero hair on top of head",
            "body_design": "full body standing on two feet, structured entirely from pristine white marble with glowing radiant 24k Kintsugi gold veins, NOT a bust, NOT a statue",
            "wardrobe": "pristine white marble monk robes with glowing Kintsugi gold veins, seamless with body",
            "color_palette": "pure white, 24k amber gold",
            "voice_profile": "Temple Reverb, Awakening, engaging, profound, 70-year-old male",
            "regional_accent": "NORTHERN_VIETNAMESE",
            "style_expression": "hyper-realistic pristine white marble living monk with solid marble beard and glowing kintsugi veins",
            "personality": "wise, compassionate, enlightened",
            "props": "none",
            "sheet_layout": "single 16:9 character reference sheet with one large close-up portrait area on the left side and three full-body orthographic views on the right side: front, side, back",
            "negative_prompt": "multiple characters, 2 boys, 2 men, extra people, statue, sculpture, bust, cropped limbs, duplicate limbs, cut off, half body, text labels, watermark, logo, UI, soft human skin, loose portrait",
            "character_render_prompt": "Create one final 16:9 character reference sheet image showing one large close-up portrait area on the left side and three full-body orthographic views of the same character on the right side in a single image: front, side, back, consistent identity, clean layout, pure white studio background, soft diffused lighting, no text labels, 8K Resolution, 3D Unreal Engine 5 hyper-realistic cinematography. SOLO 1 character ONLY, A highly polished living sentient monk character with pristine white marble skin, realistic facial hair but made of marble, deep wrinkles, and glowing 24k Kintsugi gold veins. Standing fully on two feet. NOT a statue, NOT a bust."
          }
        ],
        segments
      };
      const content = JSON.stringify(projectData);
      downloadFile(content, makeFileName(topic || '', 'HeThong_KhoiPhuc_VEO3_Cast', 'json'), 'application/json;charset=utf-8');
      setShowExport(false);
      showToast('✅ Tải hệ thống khôi phục (VEO 3 Cast Lock) thành công!', 'success');
    } catch (e: any) {
      console.error(e);
      showToast('Lỗi khi tạo file JSON: ' + e.message, 'error');
    }
  };

  const ENABLE_PRO_EXPORT = localStorage.getItem('dharma_enable_pro_export') === 'true';

  const exportJSON_PRO = () => {
    if (!segments.length) return;
    try {
      const chunkSize = 25;
      const chunks = [];
      for (let i = 0; i < segments.length; i += chunkSize) {
        const chunkData = segments.slice(i, i + chunkSize);
        chunks.push({
          chunk_id: `CHUNK_${chunks.length + 1}`,
          scene_count: chunkData.length,
          previous_memory: chunks.length > 0 ? "Tiếp nối sự kiện..." : "Khởi đầu câu chuyện.",
          global_context: topic || 'Kich Ban',
          data: chunkData
        });
      }
      const proData = {
        project_name: topic || 'Kich Ban',
        export_version: 'V18.0_PRO_MAX',
        total_scenes: segments.length,
        chunks: chunks
      };
      const content = JSON.stringify(proData);
      downloadFile(content, makeFileName(topic || '', 'HeThong_KhoiPhuc_PRO', 'json'), 'application/json;charset=utf-8');
      setShowExport(false);
      showToast('🚀 Tải File Hệ Thống PRO thành công!', 'success');
    } catch (e: any) {
      console.error(e);
      showToast('Lỗi xuất PRO: ' + e.message, 'error');
    }
  };

  const exportCSV_PRO = () => {
    if (!segments.length) return;
    let csv = '\uFEFFChunk_ID,Chunk_Memory,Scene,Time,Section,Character,Voice,Speaker,Gender,Age,Accent,Timbre,Tone,Pacing,Speed,Words,End Time,State,Audio SFX ASMR Music,Video Prompt,Image Prompt\n';
    const chunkSize = 25;
    segments.forEach((s, i) => {
      const chunkIdx = Math.floor(i / chunkSize) + 1;
      const chunkId = `CHUNK_${chunkIdx}`;
      const prevMemory = chunkIdx > 1 ? "Tiếp nối sự kiện..." : "Bắt đầu...";
      const vp = s.voice_profile || {};
      const sfx = s.sfx_music_suggestion || s.sfx_suggestion || '';
      csv += `"${chunkId}","${prevMemory}",${i + 1},"${s.time}","${s.section}","${s.character}","${getVoiceText(s).replace(/"/g, '""')}","${vp.speaker || ''}","${vp.gender || ''}","${vp.age || ''}","${vp.accent || ''}","${vp.timbre || ''}","${vp.tone || ''}","${vp.pacing || ''}","${vp.pacing_speed || ''}","${s.word_count || ''}","${s.audio_end_time || ''}","${vp.state || ''}","${sfx.replace(/"/g, '""')}","${injectAudioParamsToPrompt(s.video_prompt, vp).replace(/"/g, '""')}","${(s.image_prompt || '').replace(/"/g, '""')}"\n`;
    });
    downloadFile(csv, makeFileName(topic || '', 'KichBan_TongThe_PRO', 'csv'), 'text/csv;charset=utf-8;');
    setShowExport(false);
    showToast('🚀 Tải CSV PRO thành công!', 'success');
  };

  const exportAllAsZip = async () => {
    if (!segments.length) return;
    try {
      const zip = new JSZip();

      let csv1 = '\uFEFFScene,Time,Section,Character,Voice Text,Speaker,Gender,Age,Accent,Timbre,Tone,Pacing,Speed,Words,End Time,State,Audio SFX ASMR Music,Video Prompt,Image Prompt\n';
      segments.forEach((s, i) => {
        const vp = s.voice_profile || {};
        const sfx = s.sfx_music_suggestion || s.sfx_suggestion || '';
        csv1 += `${i + 1},"${s.time}","${s.section}","${s.character}","${getVoiceText(s).replace(/"/g, '""')}","${vp.speaker || ''}","${vp.gender || ''}","${vp.age || ''}","${vp.accent || ''}","${vp.timbre || ''}","${vp.tone || ''}","${vp.pacing || ''}","${vp.pacing_speed || ''}","${s.word_count || ''}","${s.audio_end_time || ''}","${vp.state || ''}","${sfx.replace(/"/g, '""')}","${injectAudioParamsToPrompt(s.video_prompt, vp).replace(/"/g, '""')}","${(s.image_prompt || '').replace(/"/g, '""')}"\n`;
      });
      zip.file(makeFileName(topic || '', 'KichBan_TongThe', 'csv'), csv1);

      let csv2 = '\uFEFF';
      segments.forEach((s, i) => {
        const vp = s.voice_profile || {};
        const sfx = s.sfx_music_suggestion || s.sfx_suggestion || '';
        const colA = `Scene ${i + 1}`;
        const colB = `Time : ${s.time} Section :${s.section}`;
        const colC = `Character : ${s.character}`;
        const colD = `Voice : ${getVoiceText(s)}`;
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
        const colQ = `Video Prompt : ${injectAudioParamsToPrompt(s.video_prompt, vp)}`;
        const colR = `Image Prompt : ${s.image_prompt || ''}`;
        csv2 += `"${colA.replace(/"/g, '""')}","${colB.replace(/"/g, '""')}","${colC.replace(/"/g, '""')}","${colD.replace(/"/g, '""')}","${colE.replace(/"/g, '""')}","${colF.replace(/"/g, '""')}","${colG.replace(/"/g, '""')}","${colH.replace(/"/g, '""')}","${colI.replace(/"/g, '""')}","${colJ.replace(/"/g, '""')}","${colK.replace(/"/g, '""')}","${colL.replace(/"/g, '""')}","${colM.replace(/"/g, '""')}","${colN.replace(/"/g, '""')}","${colO.replace(/"/g, '""')}","${colP.replace(/"/g, '""')}","${colQ.replace(/"/g, '""')}","${colR.replace(/"/g, '""')}"\n`;
      });
      zip.file(makeFileName(topic || '', 'KichBan_V2', 'csv'), csv2);

      const projectData = { version: '1.0', topic: topic || 'Kich Ban', segments };
      zip.file(makeFileName(topic || '', 'HeThong_KhoiPhuc', 'json'), JSON.stringify(projectData));

      const projectDataCast = {
        version: '1.0', topic: topic || 'Kich Ban', segments,
        cast_lock: [
          {
            "character_id": "char_001", "display_name": "Zen Master",
            "identity_lock": "SOLO 1 character ONLY, A 70-year-old living sentient white marble monk standing on two feet with radiant 24k Kintsugi gold veins",
            "face_design": "pure pristine white marble skin with glowing 24k Kintsugi gold veins, deep marble wrinkles, realistic facial hair but made of marble, 100% completely bald shaved head, NO CARVED STATUE LOOK",
            "hair_design": "100% completely bald shaved head, zero hair on top of head",
            "body_design": "full body standing on two feet, structured entirely from pristine white marble with glowing radiant 24k Kintsugi gold veins, NOT a bust, NOT a statue",
            "wardrobe": "pristine white marble monk robes with glowing Kintsugi gold veins, seamless with body",
            "color_palette": "pure white, 24k amber gold",
            "voice_profile": "Temple Reverb, Awakening, engaging, profound, 70-year-old male",
            "regional_accent": "NORTHERN_VIETNAMESE",
            "style_expression": "hyper-realistic pristine white marble living monk with solid marble beard and glowing kintsugi veins",
            "personality": "wise, compassionate, enlightened",
            "props": "none",
            "sheet_layout": "single 16:9 character reference sheet with one large close-up portrait area on the left side and three full-body orthographic views on the right side: front, side, back",
            "negative_prompt": "multiple characters, 2 boys, 2 men, extra people, statue, sculpture, bust, cropped limbs, duplicate limbs, cut off, half body, text labels, watermark, logo, UI, soft human skin, loose portrait",
            "character_render_prompt": "Create one final 16:9 character reference sheet image showing one large close-up portrait area on the left side and three full-body orthographic views of the same character on the right side in a single image: front, side, back, consistent identity, clean layout, pure white studio background, soft diffused lighting, no text labels, 8K Resolution, 3D Unreal Engine 5 hyper-realistic cinematography. SOLO 1 character ONLY, A highly polished living sentient monk character with pristine white marble skin, realistic facial hair but made of marble, deep wrinkles, and glowing 24k Kintsugi gold veins. Standing fully on two feet. NOT a statue, NOT a bust."
          }
        ]
      };
      zip.file(makeFileName(topic || '', 'HeThong_KhoiPhuc_VEO3_Cast', 'json'), JSON.stringify(projectDataCast));

      ['video', 'image'].forEach(type => {
        const suffix = `Prompt_${type === 'video' ? 'Video' : 'Anh'}`;
        let pCsv = `\uFEFFScene,Voice Text,${type === 'video' ? 'Video' : 'Image'} Prompt\n`;
        segments.forEach((s, i) => { 
          pCsv += `${i + 1},"${getVoiceText(s).replace(/"/g, '""')}","${((type === 'video' ? injectAudioParamsToPrompt(s.video_prompt, s.voice_profile) : s.image_prompt) || '').replace(/"/g, '""')}"\n`; 
        });
        zip.file(makeFileName(topic || '', suffix, 'csv'), pCsv);
        
        const pTxt = segments.map((s, i) => {
          const prompt = ((type === 'video' ? injectAudioParamsToPrompt(s.video_prompt, s.voice_profile) : s.image_prompt) || '').trim();
          const vText = getVoiceText(s).trim();
          return `[SCENE ${i + 1}]${vText ? `\n[VOICE TEXT]: ${vText}` : ''}\n${prompt}`;
        }).filter(Boolean).join('\n\n');
        zip.file(makeFileName(topic || '', suffix, 'txt'), pTxt);
        
        const pJson = segments.map((s, i) => ({
          scene: i + 1,
          voice_text: getVoiceText(s).trim(),
          prompt: ((type === 'video' ? injectAudioParamsToPrompt(s.video_prompt, s.voice_profile) : s.image_prompt) || '').trim()
        }));
        zip.file(makeFileName(topic || '', suffix, 'json'), JSON.stringify(pJson, null, 2));
      });

      if (ENABLE_PRO_EXPORT) {
        const chunkSize = 25;
        const chunks = [];
        for (let i = 0; i < segments.length; i += chunkSize) {
          const chunkData = segments.slice(i, i + chunkSize);
          chunks.push({
            chunk_id: `CHUNK_${chunks.length + 1}`,
            scene_count: chunkData.length,
            previous_memory: chunks.length > 0 ? "Tiếp nối sự kiện..." : "Khởi đầu câu chuyện.",
            global_context: topic || 'Kich Ban',
            data: chunkData
          });
        }
        const proData = { project_name: topic || 'Kich Ban', export_version: 'V18.0_PRO_MAX', total_scenes: segments.length, chunks };
        zip.file(makeFileName(topic || '', 'HeThong_KhoiPhuc_PRO', 'json'), JSON.stringify(proData));

        let csvPro = '\uFEFFChunk_ID,Chunk_Memory,Scene,Time,Section,Character,Voice,Speaker,Gender,Age,Accent,Timbre,Tone,Pacing,Speed,Words,End Time,State,Audio SFX ASMR Music,Video Prompt,Image Prompt\n';
        segments.forEach((s, i) => {
          const chunkIdx = Math.floor(i / chunkSize) + 1;
          const vp = s.voice_profile || {};
          const sfx = s.sfx_music_suggestion || s.sfx_suggestion || '';
          csvPro += `"CHUNK_${chunkIdx}","${chunkIdx > 1 ? "Tiếp nối sự kiện..." : "Bắt đầu..."}",${i + 1},"${s.time}","${s.section}","${s.character}","${getVoiceText(s).replace(/"/g, '""')}","${vp.speaker || ''}","${vp.gender || ''}","${vp.age || ''}","${vp.accent || ''}","${vp.timbre || ''}","${vp.tone || ''}","${vp.pacing || ''}","${vp.pacing_speed || ''}","${s.word_count || ''}","${s.audio_end_time || ''}","${vp.state || ''}","${sfx.replace(/"/g, '""')}","${injectAudioParamsToPrompt(s.video_prompt, vp).replace(/"/g, '""')}","${(s.image_prompt || '').replace(/"/g, '""')}"\n`;
        });
        zip.file(makeFileName(topic || '', 'KichBan_TongThe_PRO', 'csv'), csvPro);
      }

      showToast('⏳ Đang nén file ZIP...', 'success');
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = makeFileName(topic || '', 'ToanBo', 'zip');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setShowExport(false);
      showToast('🚀 Tải ZIP thành công!', 'success');
    } catch (e: any) {
      console.error(e);
      showToast('Lỗi tạo ZIP: ' + e.message, 'error');
    }
  };

  if (!segments.length) return (
    <div className="h-full flex flex-col items-center justify-center animate-[slideIn_0.4s_ease-out]">
      <div className="text-center text-slate-500 py-10 italic">Chưa có dữ liệu kịch bản. Hãy tạo kịch bản trước.</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-[slideIn_0.4s_ease-out] relative">
      <div className="p-4 border-b border-slate-800 bg-[#06080a] shrink-0 sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-clapperboard text-cyan-500" /> Studio Sáng Tạo
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="text-[9px] text-slate-500 font-medium tracking-widest uppercase mt-0.5 opacity-80 flex items-center">
                CORE BRAIN TESTING ENVIRONMENT <span className="ml-1.5 px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">V21.8.1</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            <div className="flex bg-[#12161e] rounded p-1 border border-slate-700/30">
              <button onClick={() => setMode('video')} className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors ${mode === 'video' ? 'bg-cyan-900/50 text-cyan-100 shadow' : 'text-slate-400 hover:text-white'}`}><i className="fa-solid fa-video" /> VIDEO</button>
              <button onClick={() => setMode('image')} className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors ${mode === 'image' ? 'bg-purple-900/50 text-purple-100 shadow' : 'text-slate-400 hover:text-white'}`}><i className="fa-solid fa-image" /> ẢNH</button>
            </div>
            <button onClick={() => setShowExport(!showExport)} className="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 bg-green-900/40 text-green-300 hover:bg-green-800/50 border border-green-500/20"><i className="fa-solid fa-download" /> Tải Xuống Đồng Bộ <i className="fa-solid fa-chevron-down text-[10px]" /></button>
            {showExport && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#0a0e14] border border-slate-700 rounded shadow-2xl overflow-hidden z-50">
                <button onClick={exportAllAsZip} className="w-full text-left px-4 py-3 text-xs text-white hover:bg-rose-600 border-b border-slate-700/50 flex items-center gap-2 font-black bg-rose-700 transition-colors"><i className="fa-solid fa-file-zipper text-white animate-bounce" /> TẢI TẤT CẢ (ZIP)</button>
                <div className="px-3 py-1.5 bg-slate-800/50 text-[10px] font-bold text-slate-400 border-b border-slate-700/50">FILE HỆ THỐNG ĐỂ KHÔI PHỤC</div>
                {ENABLE_PRO_EXPORT && (
                    <button onClick={exportJSON_PRO} className="w-full text-left px-4 py-2 text-xs text-amber-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2 font-black bg-amber-900/20"><i className="fa-solid fa-crown text-amber-400 animate-pulse" /> Tải JSON PRO (Smart Chunking)</button>
                )}
                <button onClick={exportProjectJSON} className="w-full text-left px-4 py-2 text-xs text-amber-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2 font-bold bg-amber-900/10"><i className="fa-solid fa-file-code text-amber-500" /> Tải Dự Án Tiêu Chuẩn (.json)</button>
                <button onClick={exportProjectJSON_CastLock} className="w-full text-left px-4 py-2 text-xs text-pink-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2 font-bold bg-pink-900/20"><i className="fa-solid fa-id-badge text-pink-500" /> Tải Dự Án VEO 3 (+ Cast Lock JSON)</button>
                
                <div className="px-3 py-1.5 bg-slate-800/50 text-[10px] font-bold text-slate-400 border-b border-slate-700/50 border-t">KỊCH BẢN TỔNG THỂ</div>
                {ENABLE_PRO_EXPORT && (
                    <button onClick={exportCSV_PRO} className="w-full text-left px-4 py-2 text-xs text-emerald-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2 font-black bg-emerald-900/20"><i className="fa-solid fa-crown text-emerald-400 animate-pulse" /> Tải Excel PRO (Smart Chunking)</button>
                )}
                <button onClick={exportCSV} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-excel text-green-500" /> Tải Excel Kịch Bản</button>
                <button onClick={exportCSV2} className="w-full text-left px-4 py-2 text-xs text-emerald-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2 font-bold"><i className="fa-solid fa-file-excel text-emerald-400" /> Tải Excel Kịch Bản V2</button>
                
                <div className="px-3 py-1.5 bg-slate-800/50 text-[10px] font-bold text-slate-400 border-b border-slate-700/50 border-t">PROMPT SẢN XUẤT TỰ ĐỘNG</div>
                <button onClick={() => exportPrompts('video', 'csv')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-video text-cyan-500" /> Excel Prompt Video</button>
                <button onClick={() => exportPrompts('image', 'csv')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-image text-purple-500" /> Excel Prompt Ảnh</button>
                <button onClick={() => exportPrompts('video', 'txt')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-regular fa-file-lines text-cyan-500" /> TXT Prompt Video</button>
                <button onClick={() => exportPrompts('image', 'txt')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-regular fa-file-lines text-purple-500" /> TXT Prompt Ảnh</button>
                <button onClick={() => exportPrompts('video', 'json')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-code text-cyan-500" /> JSON Prompt Video</button>
                <button onClick={() => exportPrompts('image', 'json')} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20 flex items-center gap-2"><i className="fa-solid fa-code text-purple-500" /> JSON Prompt Ảnh</button>
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
            genProgress={genProgress}
            genMedia={genMedia}
            copy={copy}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(StudioModule);