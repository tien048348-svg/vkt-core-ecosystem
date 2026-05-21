import React, { useState } from 'react';
import { callAI } from '../services/aiService';
import { SYSTEM_PROMPT_SCRIPT_WRITER, SYSTEM_PROMPT_AUDIO_REENGINEERING, getStyleRecPrompt } from '../data/prompts';
import { TARGET_MARKETS, VISUAL_STYLES, SECONDS_PER_SCENE, SOLFEGGIO_FREQUENCIES } from '../data/constants';
import { showToast } from '../components/Toast';

const STYLE_RECOMMENDATION_PROMPT = `
BẠN LÀ CHUYÊN GIA ĐỀ XUẤT PHONG CÁCH NHẠC PHẬT PHÁP VKT.
Dựa trên chủ đề được cung cấp, hãy phân tích và đề xuất phong cách âm nhạc cùng tần số Solfeggio phù hợp nhất.

CÁC PHONG CÁCH CÓ SẴN (constants.ts VISUAL_STYLES):
1. "zen_flute" — Sáo Trúc Thiền Tông (Zen Flute)
2. "singing_bowls" — Chuông Xoay Tây Tạng (Tibetan Bowls)
3. "guzheng_solitude" — Cổ Cầm Cô Tịch (Guqin & Guzheng)
4. "ethereal_pad" — Pad Không Gian Hư Không (Ethereal Ambient)
5. "monastic_chants" — Trì Chú Thiền Ca (Monastic Chanting)
6. "nature_stream" — Nước Chảy Rừng Thiền (Zen Stream & Birds)

OUTPUT JSON:
{
  "recommended_style": "style_id",
  "reason": "Giải thích ngắn gọn tại sao nhạc cụ và tông nhạc này phù hợp",
  "alternative_style": "style_id thay thế",
  "alternative_reason": "Lý do thay thế"
}
`;

const SceneCard = React.memo(({ seg, idx }: { seg: any, idx: number }) => {
  return (
    <div className="bg-[#0b0f14] border border-emerald-900/30 p-5 rounded-2xl flex flex-col sm:flex-row gap-5 hover:border-emerald-500/30 transition-all relative shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="w-full sm:w-28 shrink-0 text-center pt-2 border-r border-emerald-950/50 pr-3">
        <div className="text-[10px] bg-[#0c131a] border border-emerald-500/20 px-2 py-1 rounded-lg font-extrabold text-emerald-400 mb-1">SCENE {seg.scene_number || idx + 1}</div>
        <div className="text-[9px] text-slate-500 font-mono mb-1">{seg.time}</div>
        <div className="text-[9px] text-emerald-400 font-bold uppercase break-words">{seg.section}</div>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SOUND PLANNING */}
        <div className="bg-[#070b0e]/80 p-4 rounded-xl border border-emerald-950/40 flex flex-col">
          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5 mb-2"><i className="fa-solid fa-volume-high" /> BẢN ĐỒ HOÀ ÂM TỪNG GIÂY</div>
          <p className="text-xs text-slate-300 mb-2 flex-1 leading-relaxed">{seg.voice_text || '(Đang dệt nhạc...)'}</p>
          
          {seg.pacing_score !== undefined && (
            <div className="mt-2 bg-black/40 p-2.5 rounded-lg border border-emerald-950/60 flex items-center gap-2">
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${seg.pacing_score >= 8 ? 'bg-emerald-900/40 text-emerald-400' : 'bg-amber-900/40 text-amber-400'}`}>HỘI ÂM: {seg.pacing_score}/10</div>
              <div className="text-[9px] text-slate-400 italic flex-1">{seg.pacing_warning || "Dòng nhạc ổn định"}</div>
            </div>
          )}

          {seg.sfx_music_suggestion && (
            <div className="mt-2 p-2.5 rounded bg-emerald-950/10 border border-emerald-500/20">
              <div className="text-[9px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5"><i className="fa-solid fa-music" /> HIỆU ỨNG TÂM LINH ASMR (VEO3 + VKT)</div>
              <div className="text-[10px] text-emerald-200/80 leading-relaxed">{seg.sfx_music_suggestion}</div>
            </div>
          )}
        </div>

        {/* PROMPTS FOR SUNO/UDIO */}
        <div className="bg-[#070b0e]/80 p-4 rounded-xl border border-emerald-950/40">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5"><i className="fa-solid fa-wand-magic-sparkles" /> AI MUSIC PROMPTS (SUNO / UDIO)</div>
            <button onClick={() => { 
              const textToCopy = `Suno Prompt:\n${seg.video_prompt}\n\nUdio Prompt:\n${seg.image_prompt}`;
              navigator.clipboard.writeText(textToCopy); 
              showToast('✅ Copied Prompts!', 'success'); 
            }} className="text-slate-500 hover:text-emerald-400 transition-colors"><i className="fa-regular fa-copy" /></button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-[#05080b] rounded-lg p-2.5 border-l-2 border-emerald-500/60">
              <div className="text-[9px] font-bold text-emerald-400/80 mb-1 flex items-center gap-1"><i className="fa-solid fa-music text-[8px]" /> SUNO PROMPT (THIỀN CỔ ĐIỂN)</div>
              <p className="text-[11px] text-emerald-100/90 leading-relaxed font-mono select-all break-words">{seg.video_prompt}</p>
            </div>
            
            <div className="bg-[#05080b] rounded-lg p-2.5 border-l-2 border-teal-500/60">
              <div className="text-[9px] font-bold text-teal-400/80 mb-1 flex items-center gap-1"><i className="fa-solid fa-waveform-path text-[8px]" /> UDIO PROMPT (HÒA ÂM CHỮA LÀNH)</div>
              <p className="text-[11px] text-teal-100/90 leading-relaxed font-mono select-all break-words">{seg.image_prompt}</p>
            </div>
          </div>

          {seg.voice_profile && (
            <div className="mt-3 p-2 bg-emerald-950/20 rounded-lg border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1"><i className="fa-solid fa-user-tie" /> SPEAKER: {seg.voice_profile.speaker}</div>
                <div className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-900/30 text-emerald-400">FREQUENCY: {seg.voice_profile.accent}</div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="bg-[#05080b] rounded p-1 border border-emerald-900/20 text-center">
                  <div className="text-[8px] text-emerald-500 font-bold">FREQUENCY</div>
                  <div className="text-[9px] text-slate-300 font-mono">{seg.voice_profile.accent}</div>
                </div>
                <div className="bg-[#05080b] rounded p-1 border border-emerald-900/20 text-center">
                  <div className="text-[8px] text-emerald-500 font-bold">TIMBRE</div>
                  <div className="text-[9px] text-slate-300">{seg.voice_profile.timbre}</div>
                </div>
                <div className="bg-[#05080b] rounded p-1 border border-emerald-900/20 text-center">
                  <div className="text-[8px] text-emerald-500 font-bold">VOLUME</div>
                  <div className="text-[9px] text-slate-300">{seg.voice_profile.tone}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

interface Props {
  segments: any[];
  setSegments: React.Dispatch<React.SetStateAction<any[]>>;
  scriptData: any;
  setScriptData: React.Dispatch<React.SetStateAction<any>>;
  onScriptGenerated: (segments: any[], style: string, topic?: string) => void;
  onAudioRefined?: (segments: any[], topic?: string) => void;
  initialTopic?: string;
  onNavigateToStudio?: () => void;
}

const ScriptModule: React.FC<Props> = ({ 
  segments, 
  setSegments, 
  scriptData, 
  setScriptData, 
  onScriptGenerated, 
  onAudioRefined, 
  initialTopic = '',
  onNavigateToStudio
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [duration, setDuration] = useState<number | string>(1);
  const [market, setMarket] = useState('vn_dharma');
  const [style, setStyle] = useState('auto');
  const [frequency, setFrequency] = useState('528hz');
  const [loading, setLoading] = useState(false);
  const [suggestedStyle, setSuggestedStyle] = useState<any>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  // Audio Re-Engineering V16.5
  const [refiningAudio, setRefiningAudio] = useState(false);
  const [audioRefinedCount, setAudioRefinedCount] = useState(0);

  // Dynamic Loading V16.5 - Cyber Console Stepper
  const [loadingType, setLoadingType] = useState<'script' | 'audio'>('script');
  const [loadingStep, setLoadingStep] = useState(1);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
  const logEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [loadingLogs]);

  React.useEffect(() => { 
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  const durationNum = parseFloat(duration as string) || 0;
  const scenes = Math.ceil((Math.max(0.1, durationNum) * 60) / SECONDS_PER_SCENE);
  const mode = durationNum < 3 ? { name: '🟢 QUICK ZEN (<3m)', wpm: 260 } : durationNum <= 10 ? { name: '🔵 SPIRITUAL MATRIC (3-10m)', wpm: 260 } : { name: '🟣 ETERNAL MINDFULNESS (>10m)', wpm: 260 };
  const modeColor = durationNum < 3 ? 'text-emerald-400 border-emerald-500/50 bg-emerald-950/10' : durationNum <= 10 ? 'text-teal-400 border-teal-500/50 bg-teal-950/10' : 'text-emerald-400 border-emerald-500/50 bg-emerald-950/10';

  // === AI STYLE SUGGESTION — Brain Core ===
  const handleSuggestStyle = async () => {
    if (!topic) return showToast('Nhập chủ đề trước!');
    setLoadingSuggestion(true);
    try {
      const result = await callAI(getStyleRecPrompt(topic), STYLE_RECOMMENDATION_PROMPT);
      setSuggestedStyle(result);
      if (result.recommended_style) {
        setStyle(result.recommended_style);
        showToast(`✨ AI đề xuất: ${VISUAL_STYLES.find(s => s.id === result.recommended_style)?.name || result.recommended_style}`, 'success');
      }
    } catch (e: any) { showToast(e.message); }
    finally { setLoadingSuggestion(false); }
  };

  const handleGenerate = async () => {
    if (!topic) return showToast('Vui lòng nhập chủ đề!');
    
    // Pre-flight check: ensure we have at least 1 valid API key in storage
    const { hasAnyApiKey } = await import('../services/aiService');
    if (!hasAnyApiKey()) {
      showToast('❌ Cảnh báo: Chưa cấu hình API Key! Vui lòng mở biểu tượng Config (chìa khóa) ở góc trên bên phải để nhập API Key hoạt động.', 'error');
      return;
    }

    // UX Hard Limit: Force maximum 10 minutes (~75 scenes) to guarantee stability
    let targetDuration = durationNum;
    if (targetDuration > 10) {
      targetDuration = 10;
      setDuration(10);
      showToast('⚠️ Hệ thống giới hạn tối đa 10 phút (~75 cảnh) để bảo toàn chất lượng kịch bản cao nhất!', 'warning');
    }

    // Auto-clear old data when starting a new generation
    setSegments([]);
    setScriptData(null);
    setSuggestedStyle(null);
    setAudioRefinedCount(0);
    setLoading(true);
    setLoadingType('script');
    setLoadingStep(1);
    setLoadingPercent(0);
    setLoadingLogs([]);

    // Khởi động mô phỏng tiến trình thời gian thực
    let percent = 0;
    const logsList: string[] = [];
    const addLog = (msg: string) => {
      logsList.push(msg);
      setLoadingLogs([...logsList]);
    };

    addLog('🔥 Khởi tạo động cơ Giả Kim Thuật Hoà Âm Phật Pháp V16.5...');

    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 3) + 2;
      if (percent > 98) percent = 98;
      setLoadingPercent(percent);

      if (percent <= 20) {
        setLoadingStep(1);
      } else if (percent <= 45) {
        setLoadingStep(2);
      } else if (percent <= 70) {
        setLoadingStep(3);
      } else if (percent <= 88) {
        setLoadingStep(4);
      } else {
        setLoadingStep(5);
      }

      if (percent >= 10 && logsList.length === 1) {
        addLog(`📝 Đã nhận dạng ý định phối nhạc: "${topic}"`);
      }
      if (percent >= 20 && logsList.length === 2) {
        addLog(`🎨 Lựa chọn nhạc cụ chủ đạo: ${VISUAL_STYLES.find(s => s.id === style)?.name || 'Tự động đề xuất style'}`);
      }
      if (percent >= 30 && logsList.length === 3) {
        addLog(`🔄 Áp dụng tần số Solfeggio chữa lành: ${SOLFEGGIO_FREQUENCIES.find(f => f.id === frequency)?.hz}`);
      }
      if (percent >= 40 && logsList.length === 4) {
        addLog(`🎙️ THIẾT QUÂN LUẬT DUCKING: Tự động hạ nhạc nền -18dB khi có giọng đọc của kịch bản.`);
      }
      if (percent >= 50 && logsList.length === 5) {
        addLog(`🎭 Đang chèn nhịp mõ gỗ đều đặn nhịp cốc cốc...`);
      }
      if (percent >= 60 && logsList.length === 6) {
        addLog(`📸 Đang thiết kế prompt tạo nhạc Suno cao cấp với cấu trúc Verse / Chorus / Outro...`);
      }
      if (percent >= 70 && logsList.length === 7) {
        addLog(`🎬 Đang thiết kế prompt hòa âm Udio 8K stereo rộng mở...`);
      }
      if (percent >= 78 && logsList.length === 8) {
        addLog(`🔊 Đồng bộ tiếng chuông chùa ngân vang thâm trầm dài lâu cuối mỗi cảnh...`);
      }
      if (percent >= 84 && logsList.length === 9) {
        addLog(`🛡️ Phối hợp dải tần SFX tự nhiên khớp với clip Veo 3 môi trường...`);
      }
      if (percent >= 90 && logsList.length === 10) {
        addLog(`📦 Đang đóng gói cấu trúc JSON Sound Map đạt chuẩn V16.5 Failsafe...`);
      }
      if (percent >= 95 && logsList.length === 11) {
        addLog(`📡 Đang chờ kết quả gói tin từ Máy chủ AI...`);
      }
    }, 350);

    try {
      const styleObj = VISUAL_STYLES.find(s => s.id === style);
      const mk = TARGET_MARKETS[market] || TARGET_MARKETS['vn_dharma'];
      const freqObj = SOLFEGGIO_FREQUENCIES.find(f => f.id === frequency);
      
      let styleContext = styleObj?.name || 'Auto';
      styleContext += ` - SOLFEGGIO FREQUENCY: ${freqObj?.hz} (${freqObj?.label}). TARGET CULTURE: ${mk.culture}.`;

      // 1. Calculate the total requested scenes
      const totalScenes = Math.ceil((Math.max(0.1, targetDuration) * 60) / SECONDS_PER_SCENE);

      // 2. Define safe chunk size: 25 scenes per round
      const chunkSize = 25;
      const totalRounds = Math.ceil(totalScenes / chunkSize);

      let allSegments: any[] = [];
      let finalSuggestedStyle = styleObj?.id || 'auto';
      let coppaText = '';

      // 3. Process incrementally in rounds to guarantee system memory and API stability
      for (let round = 1; round <= totalRounds; round++) {
        const startSceneNum = (round - 1) * chunkSize + 1;
        const endSceneNum = Math.min(round * chunkSize, totalScenes);
        const roundSceneCount = endSceneNum - startSceneNum + 1;

        addLog(`⏳ [Đợt ${round}/${totalRounds}] Đang thiết kế bản đồ âm thanh phân cảnh ${startSceneNum} đến ${endSceneNum}...`);

        let continuityContext = '';
        if (allSegments.length > 0) {
          const lastFew = allSegments.slice(-3);
          continuityContext = `\n[CONTINUITY CONTEXT]: The musical flow has already progressed through the first ${allSegments.length} scenes. Here are the last 3 scenes music instructions for context:
${JSON.stringify(lastFew.map(s => ({ scene_number: s.scene_number, voice_text: s.voice_text, sfx_music_suggestion: s.sfx_music_suggestion })), null, 2)}
CRITICAL: You MUST write the next scenes continuing this exact ambient theme seamlessly starting at Scene ${startSceneNum}. Do NOT repeat these scene contents, move the musical narrative forward.`;
        }

        const randomSeed = Math.floor(Math.random() * 1000000);
        const prompt = `TOPIC: "${topic}"
DURATION: ${targetDuration}m (Total video duration)
ROUND_GENERATING: Round ${round} of ${totalRounds} (Generating scenes ${startSceneNum} to ${endSceneNum})
ROUND_SCENE_COUNT: ${roundSceneCount} (Generate exactly ${roundSceneCount} scenes starting at number ${startSceneNum})
TARGET_MARKET: ${mk.name}
VISUAL_STYLE: ${styleContext}
[ANTI-REPETITION SEED]: ${randomSeed}${continuityContext}
RESPOND ALL TEXT FIELDS IN VIETNAMESE.
GENERATE JSON OBJECT.`;

        const json = await callAI(prompt, SYSTEM_PROMPT_SCRIPT_WRITER);

        let roundSegs: any[] = [];
        if (json) {
          if (Array.isArray(json)) {
            roundSegs = json;
          } else if (json.script && Array.isArray(json.script)) {
            roundSegs = json.script;
          } else if (json.scenes && Array.isArray(json.scenes)) {
            roundSegs = json.scenes;
          } else if (json.refined_scenes && Array.isArray(json.refined_scenes)) {
            roundSegs = json.refined_scenes;
          } else {
            const arrayKey = Object.keys(json).find(k => Array.isArray(json[k]));
            if (arrayKey) {
              roundSegs = json[arrayKey];
            }
          }
        }

        if (round === 1) {
          if (json.suggested_style) finalSuggestedStyle = json.suggested_style;
          if (json.coppa_disclaimer) coppaText = json.coppa_disclaimer;
        }

        // Standardize output structure
        roundSegs = roundSegs.map((s: any, idx: number) => {
          const calculatedNum = startSceneNum + idx;
          const min = Math.floor(((calculatedNum - 1) * SECONDS_PER_SCENE) / 60);
          const secStart = ((calculatedNum - 1) * SECONDS_PER_SCENE) % 60;
          const secEnd = (calculatedNum * SECONDS_PER_SCENE) % 60;
          const minEnd = Math.floor((calculatedNum * SECONDS_PER_SCENE) / 60);
          
          const formatTime = (m: number, s: number) => `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
          
          return {
            ...s,
            scene_number: s.scene_number || calculatedNum,
            time: s.time || `${formatTime(min, secStart)} - ${formatTime(minEnd, secEnd)}`,
          };
        });

        // Apply prompt enforce
        let enforce = '';
        if (styleObj && styleObj.id !== 'auto') enforce = styleObj.prompt_enforce;
        else if (json && json.suggested_style) enforce = `, Visual Style: ${json.suggested_style}`;
        if (enforce) {
          roundSegs = roundSegs.map((s: any) => ({
            ...s,
            video_prompt: s.video_prompt?.includes('ambient') ? s.video_prompt : `${s.video_prompt}, ${enforce}`,
            image_prompt: s.image_prompt?.includes('ambient') ? s.image_prompt : `${s.image_prompt}, ${enforce}`,
          }));
        }

        allSegments = [...allSegments, ...roundSegs];
      }

      // 4. Merge all rounds
      const finalJson = {
        mode_detected: targetDuration < 3 ? "Quick Zen" : targetDuration <= 10 ? "Spiritual Matrix" : "Eternal Mindfulness",
        suggested_style: finalSuggestedStyle,
        script: allSegments,
        coppa_disclaimer: coppaText || "Video chữa lành mang tính chất thư giãn, không chèn âm tần nghịch tai gây giật mình."
      };

      // Hoàn tất thành công
      clearInterval(interval);
      setLoadingPercent(100);
      setLoadingStep(5);
      addLog(`✨ Giả Kim Thuật hoàn tất! Bản đồ âm nhạc đã được dệt thành công với tổng số ${allSegments.length} phân cảnh.`);
      await new Promise(r => setTimeout(r, 600));

      setScriptData(finalJson);
      setSegments(allSegments);
      localStorage.setItem('dhmusic_autosave_script', JSON.stringify({ segments: allSegments, scriptData: finalJson, topic }));
      onScriptGenerated(allSegments, finalSuggestedStyle, topic);
    } catch (e: any) { 
      clearInterval(interval);
      showToast(e.message); 
    }
    finally { 
      clearInterval(interval);
      setLoading(false); 
    }
  };

  const copyAll = () => {
    const text = segments.map(s => s.voice_text).join('\n\n');
    navigator.clipboard.writeText(text);
    showToast('✅ Đã copy bản đồ âm thanh toàn bộ!', 'success');
  };

  // === MASTER COMMAND V16.5: AUDIO RE-ENGINEERING ===
  const handleAudioReengineering = async () => {
    if (segments.length === 0) return showToast('Chưa có kịch bản để tinh chỉnh!');
    
    setRefiningAudio(true);
    setLoading(true);
    setLoadingType('audio');
    setLoadingStep(1);
    setLoadingPercent(0);
    setLoadingLogs([]);

    let percent = 0;
    const logsList: string[] = [];
    const addLog = (msg: string) => {
      logsList.push(msg);
      setLoadingLogs([...logsList]);
    };

    addLog('🎙️ Khởi động hệ thống Tái Cấu Trúc Âm Học Phật Giáo V16.5...');

    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 4) + 3;
      if (percent > 98) percent = 98;
      setLoadingPercent(percent);

      if (percent <= 20) {
        setLoadingStep(1);
      } else if (percent <= 45) {
        setLoadingStep(2);
      } else if (percent <= 70) {
        setLoadingStep(3);
      } else if (percent <= 88) {
        setLoadingStep(4);
      } else {
        setLoadingStep(5);
      }

      if (percent >= 10 && logsList.length === 1) {
        addLog(`📂 Đã tải thành công danh sách ${segments.length} phân cảnh đầu vào.`);
      }
      if (percent >= 22 && logsList.length === 2) {
        addLog(`🎭 Đang rà soát và tinh chỉnh biểu thức gõ chuông mõ và sáo tre...`);
      }
      if (percent >= 32 && logsList.length === 3) {
        addLog(`🎙️ THIẾT QUÂN LUẬT: Đan cài nhịp gõ mõ cách đều đặn 2 giây tự nhiên.`);
      }
      if (percent >= 45 && logsList.length === 4) {
        addLog(`🗣️ Thiết lập cơ chế Ducking âm lượng nền khi chèn thoại CapCut / Veo 3...`);
      }
      if (percent >= 58 && logsList.length === 5) {
        addLog(`🔊 Điều phối tiếng chuông chùa thâm trầm dài lâu ở cuối mỗi cảnh...`);
      }
      if (percent >= 70 && logsList.length === 6) {
        addLog(`⚡ Tinh lọc dải tần ASMR tiếng suối róc rách, gió tre kêu xào xạc...`);
      }
      if (percent >= 80 && logsList.length === 7) {
        addLog(`💥 Tối ưu hóa câu Prompt Suno & Udio khớp hoàn chỉnh với cấu trúc nhạc cụ...`);
      }
      if (percent >= 88 && logsList.length === 8) {
        addLog(`🛡️ Chèn lớp lọc an toàn âm thanh chữa lành...`);
      }
      if (percent >= 94 && logsList.length === 9) {
        addLog(`📡 Đang truyền tải gói tin kết quả hòa âm refined_scenes về client...`);
      }
    }, 280);

    try {
      const payload = segments.map(s => ({
        scene_number: s.scene_number,
        dialogues: s.dialogues || [],
        voice_text: s.voice_text || '',
        visual_context: s.visual_desc_vi || '',
        section: s.section || '',
        character: s.character || '',
        time: s.time || '',
        sfx_music_suggestion: s.sfx_music_suggestion || ''
      }));
      const prompt = `DANH SÁCH BẢN ĐỒ HOÀ ÂM GỐC (${payload.length} scenes):\n${JSON.stringify(payload, null, 2)}\n\nTINH CHỈNH THANH ÂM TỰ NHIÊN VÀ PROMPT TẠO NHẠC SUNO/UDIO BÙNG NỔ CHO TẤT CẢ ${payload.length} SCENES. OUTPUT JSON.`;
      const res = await callAI(prompt, SYSTEM_PROMPT_AUDIO_REENGINEERING);
      
      let refinedList: any[] = [];
      if (res) {
        if (Array.isArray(res)) {
          refinedList = res;
        } else if (res.refined_scenes && Array.isArray(res.refined_scenes)) {
          refinedList = res.refined_scenes;
        } else if (res.script && Array.isArray(res.script)) {
          refinedList = res.script;
        } else if (res.scenes && Array.isArray(res.scenes)) {
          refinedList = res.scenes;
        } else {
          const arrayKey = Object.keys(res).find(k => Array.isArray(res[k]));
          if (arrayKey) {
            refinedList = res[arrayKey];
          }
        }
      }

      if (refinedList.length > 0) {
        const newSegments = segments.map((original, idx) => {
          const refined = refinedList.find((r: any) => r.scene_number === original.scene_number) || refinedList[idx];
          if (!refined) return original;
          return {
            ...original,
            voice_text: refined.voice_text || original.voice_text,
            voice_profile: refined.voice_profile || null,
            dialogues: refined.dialogues || original.dialogues,
            sfx_music_suggestion: refined.sfx_music_suggestion || original.sfx_music_suggestion
          };
        });

        clearInterval(interval);
        setLoadingPercent(100);
        setLoadingStep(5);
        addLog(`✨ Tinh chỉnh thanh âm thiền định hoàn tất!`);
        await new Promise(r => setTimeout(r, 600));

        setSegments(newSegments);
        const currentData = scriptData ? { ...scriptData, script: newSegments } : null;
        if (currentData) setScriptData(currentData);
        localStorage.setItem('dhmusic_autosave_script', JSON.stringify({
          topic: topic,
          scriptData: currentData || { suggested_style: 'auto' },
          segments: newSegments
        }));
        if (onAudioRefined) onAudioRefined(newSegments, topic);
        else onScriptGenerated(newSegments, '', topic);
        setAudioRefinedCount(prev => prev + 1);
        showToast('🎙️ Bản đồ âm thanh đã được nâng cấp chánh niệm tinh tế!', 'success');
      } else {
        throw new Error('AI không trả về dữ liệu thanh âm đúng cấu trúc.');
      }
    } catch (e: any) { 
      clearInterval(interval);
      showToast(`Audio Error: ${e.message}`); 
    }
    finally { 
      clearInterval(interval);
      setLoading(false);
      setRefiningAudio(false); 
    }
  };

  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.segments && Array.isArray(data.segments)) {
          setTopic(data.topic || '');
          setSegments(data.segments);
          setScriptData({ suggested_style: 'auto' });
          onScriptGenerated(data.segments, 'auto', data.topic || '');
          localStorage.setItem('dhmusic_autosave_script', JSON.stringify({ segments: data.segments, scriptData: { suggested_style: 'auto' }, topic: data.topic }));
          showToast('✅ Đã khôi phục dự án thành công!', 'success');
        } else {
          showToast('File dự án không hợp lệ!');
        }
      } catch (err) {
        showToast('Lỗi đọc file JSON dự án!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#0b0f14] border border-emerald-950/40 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2.5"><i className="fa-solid fa-scroll text-emerald-400" /> Thiết Kế Nhạc Nền Thiền Định Phật Pháp</span>
          <label className="cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/30 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/30 transition-all flex items-center gap-2">
            <i className="fa-solid fa-folder-open" /> Mở Dự Án (.json)
            <input type="file" accept=".json" className="hidden" onChange={handleImportProject} />
          </label>
        </h2>
        
        <div className="space-y-5">
          <div className="relative">
            <label className="text-xs font-bold text-emerald-400 uppercase mb-1.5 block">Ý Định Phối Nhạc Nền</label>
            <div className="flex gap-2">
              <input 
                value={topic} 
                onChange={e => {
                  setTopic(e.target.value);
                  if (e.target.value.trim() === '') {
                    setSegments([]);
                    setScriptData(null);
                  }
                }}
                className="flex-1 bg-[#05080b] border border-emerald-950/50 rounded-lg p-3 text-sm text-white outline-none focus:border-emerald-500/50 shadow-inner placeholder-slate-600" 
                placeholder="VD: Tạo bản nhạc thiền tĩnh lặng buông bỏ muộn phiền..." 
              />
              <button onClick={handleSuggestStyle} disabled={loadingSuggestion || !topic}
                className="px-4 py-2 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                {loadingSuggestion ? <><i className="fa-solid fa-sync animate-spin" /> Đang phân tích...</> : <><i className="fa-solid fa-wand-magic-sparkles" /> AI Đề Xuất Style</>}
              </button>
            </div>
          </div>

          {/* AI Style Suggestion Card */}
          {suggestedStyle && (
            <div className="bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border border-emerald-500/30 rounded-xl p-4 animate-[slideIn_0.3s_ease-out]">
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-wand-magic-sparkles text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase">AI Đề Xuất Nhạc Cụ & Tông Nhạc</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-black/30 p-3 rounded-lg border border-emerald-500/20">
                  <div className="text-[10px] text-emerald-300 mb-1 font-bold">🏆 ĐỀ XUẤT CHÍNH</div>
                  <div className="text-sm font-bold text-white mb-1">{VISUAL_STYLES.find(s => s.id === suggestedStyle.recommended_style)?.name || suggestedStyle.recommended_style}</div>
                  <div className="text-[10px] text-slate-400 leading-relaxed">{suggestedStyle.reason}</div>
                </div>
                {suggestedStyle.alternative_style && (
                  <div className="bg-black/30 p-3 rounded-lg border border-teal-500/20">
                    <div className="text-[10px] text-teal-300 mb-1 font-bold">🔄 THAY THẾ</div>
                    <div className="text-sm font-bold text-white mb-1">{VISUAL_STYLES.find(s => s.id === suggestedStyle.alternative_style)?.name || suggestedStyle.alternative_style}</div>
                    <div className="text-[10px] text-slate-400 leading-relaxed">{suggestedStyle.alternative_reason}</div>
                    <button onClick={() => { setStyle(suggestedStyle.alternative_style); showToast('Đã chọn style thay thế!', 'info'); }}
                      className="mt-2 text-[10px] text-teal-400 hover:underline flex items-center gap-1">
                      <i className="fa-solid fa-arrow-right" /> Dùng style này
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* THỜI LƯỢNG */}
            <div className="bg-[#070b0e] border border-emerald-950/40 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <label className="text-xs font-bold text-emerald-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-clock text-emerald-400" /> THỜI LƯỢNG (PHÚT)</label>
              <div className="flex items-center gap-4">
                <input type="number" value={duration} step={0.5} onChange={e => setDuration(e.target.value)} className="w-16 bg-[#05080b] border border-emerald-950/50 rounded-lg p-2.5 text-xl font-black text-white text-center outline-none" />
                <div className="flex flex-col text-[10px] text-slate-400 space-y-0.5">
                  <div>Số phân cảnh kịch bản: <span className="font-bold text-emerald-400">~{scenes} cảnh</span></div>
                  <div>Thời lượng nhạc: <span className="font-bold text-teal-400">~{scenes * 8} giây</span></div>
                </div>
              </div>
            </div>

            {/* THỊ TRƯỜNG */}
            <div className="bg-[#070b0e] border border-emerald-950/40 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-emerald-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-globe text-emerald-400" /> THỊ TRƯỜNG</label>
              <select value={market} onChange={e => setMarket(e.target.value)} className="w-full bg-[#05080b] border border-emerald-950/50 rounded-lg p-2.5 text-xs text-white outline-none cursor-pointer">
                {Object.values(TARGET_MARKETS).map(m => <option key={m.id} value={m.id}>{m.flag} {m.name}</option>)}
              </select>
            </div>

            {/* TẦN SỐ CHỮA LÀNH */}
            <div className="bg-[#070b0e] border border-emerald-950/40 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-emerald-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-wave-square text-emerald-400" /> TẦN SỐ CHỮA LÀNH (SOLFEGGIO)</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full bg-[#05080b] border border-emerald-950/50 rounded-lg p-2.5 text-xs text-white outline-none cursor-pointer font-bold text-emerald-400">
                {SOLFEGGIO_FREQUENCIES.map(f => <option key={f.id} value={f.id}>{f.hz} — {f.label.split(' ')[0]}</option>)}
              </select>
            </div>
          </div>

          {/* ACTIVE FREQUENCY CARD */}
          <div className={`border rounded-xl p-3 text-xs leading-relaxed transition-all ${modeColor}`}>
            <span className="font-extrabold">{mode.name}</span> — {SOLFEGGIO_FREQUENCIES.find(f => f.id === frequency)?.desc}
          </div>

          {/* CHỌN STYLE NHẠC THIỀN */}
          <div className="bg-[#070b0e] border border-emerald-950/40 rounded-xl p-4">
            <label className="text-xs font-bold text-emerald-400 uppercase mb-2.5 block flex items-center gap-2"><i className="fa-solid fa-palette text-emerald-400" /> THỂ LOẠI NHẠC PHẬT PHÁP / THIỀN TÂM LINH</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {VISUAL_STYLES.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  className={`text-[10px] p-2.5 rounded-lg border text-left transition-all ${style === s.id ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]' : 'bg-[#05080b] border-emerald-950/30 text-slate-400 hover:bg-emerald-950/10'}`}>
                  <div className="font-extrabold mb-0.5">{s.name}</div>
                  <div className="text-[9px] opacity-70 truncate">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* PROGRESS TERMINAL CONSOLE */}
          {loading && (
            <div className="bg-black/90 border border-emerald-500/30 rounded-xl p-5 space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-[scan_2s_linear_infinite]" />
              
              <div className="flex justify-between items-center border-b border-emerald-950 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    {loadingType === 'script' ? 'ZEN-ALCHEMIST V16.5 SOUNDTRACK PROCESSOR' : 'ZEN-ALCHEMIST V16.5 AUDIO RE-ENGINEER'}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-400">{loadingPercent}%</div>
              </div>

              <div className="grid grid-cols-5 gap-2 text-center">
                {(loadingType === 'script'
                  ? [
                      { step: 1, label: 'Khởi Động' },
                      { step: 2, label: 'Phân Tích Ngách' },
                      { step: 3, label: 'Hoà Âm 432Hz' },
                      { step: 4, label: 'Ducking Lời Nói' },
                      { step: 5, label: 'Xuất JSON' }
                    ]
                  : [
                      { step: 1, label: 'Khởi Động' },
                      { step: 2, label: 'Gõ Mõ Chuông' },
                      { step: 3, label: 'Sáo Tre Cổ Cầm' },
                      { step: 4, label: 'Ducking Matrix' },
                      { step: 5, label: 'Hoàn Tất JSON' }
                    ]
                ).map((s) => {
                  const isActive = loadingStep === s.step;
                  const isDone = loadingStep > s.step;
                  return (
                    <div key={s.step} className="space-y-1">
                      <div className={`h-1.5 rounded-full transition-all duration-500 ${isDone ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isActive ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-[#05080b]'}`} />
                      <div className={`text-[8px] sm:text-[9px] font-bold truncate ${isDone ? 'text-emerald-400' : isActive ? 'text-amber-400' : 'text-slate-500'}`}>
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#05080b]/90 rounded-lg p-3 h-32 overflow-y-auto font-mono text-[10px] text-emerald-400/90 space-y-1 border border-emerald-950/80 scrollbar-none select-none">
                {loadingLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          )}

          {/* ACTIONS BUTTONS */}
          <button onClick={handleGenerate} disabled={loading || refiningAudio}
            className="w-full py-4 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-100 font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 uppercase tracking-widest text-xs">
            {loading && loadingType === 'script' ? (
              <><i className="fa-solid fa-sync animate-spin" /> ĐANG BIÊN SOẠN BẢN ĐỒ ÂM NHẠC ({loadingPercent}%)...</>
            ) : (
              <><i className="fa-solid fa-music" /> KIẾN TẠO NHẠC NỀN THIỀN ĐỊNH</>
            )}
          </button>

          {segments.length > 0 && (
            <button onClick={handleAudioReengineering} disabled={loading || refiningAudio}
              className="w-full py-4 bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-emerald-900/40 hover:from-emerald-800/40 hover:to-teal-800/40 border border-emerald-500/30 text-emerald-100 font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 relative overflow-hidden group uppercase tracking-widest text-xs">
              {loading && loadingType === 'audio' ? (
                <><i className="fa-solid fa-sync animate-spin" /> ĐANG TÁI CẤU TRÚC HÒA ÂM ({loadingPercent}%)...</>
              ) : (
                <><i className="fa-solid fa-headphones" /> TÁI CẤU TRÚC HÒA ÂM AN NHIÊN {audioRefinedCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-600 text-[9px] font-bold">×{audioRefinedCount}</span>}</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Results view */}
      {segments.length > 0 && (
        <div className="space-y-4 pb-10">
          {scriptData?.coppa_disclaimer && (
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl flex items-start gap-3 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
              <i className="fa-solid fa-shield-halved text-emerald-400 mt-0.5 text-lg" />
              <div>
                <div className="text-xs font-bold text-emerald-400 mb-1 uppercase">CẢNH BÁO HOÀ ÂM CHỮA LÀNH</div>
                <div className="text-xs text-emerald-200/80 leading-relaxed">{scriptData.coppa_disclaimer}</div>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center px-2">
            <div className="text-xs text-slate-500 font-bold">Bản đồ âm thanh: {segments.length} Phân Cảnh Khớp Bối Cảnh</div>
            <button onClick={copyAll} className="text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shadow-lg"><i className="fa-solid fa-copy" /> Copy Bản Đồ Toàn Bộ</button>
          </div>
          {segments.map((seg, idx) => (
            <SceneCard key={idx} seg={seg} idx={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScriptModule;