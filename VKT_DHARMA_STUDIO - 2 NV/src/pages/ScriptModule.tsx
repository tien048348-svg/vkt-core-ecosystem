import React, { useState } from 'react';
import { callAI } from '../services/aiService';
import { 
  SECONDS_PER_SCENE, 
  TARGET_MARKETS, 
  VISUAL_STYLES 
} from '../data/constants';
import { 
  SYSTEM_PROMPT_SCRIPT_WRITER,
  SYSTEM_PROMPT_AUDIO_REENGINEERING,
  getStyleRecPrompt,
  getScriptWriterPrompt,
  getAudioReengineeringPrompt
} from '../data/prompts';
import { showToast } from '../components/Toast';

export const DHARMA_TOPICS = [
  { id: 'karma', label: '⚖️ Luật Nhân Quả (Karma Law)' },
  { id: 'mindfulness', label: '🧘 Thiền Định & Tĩnh Thức (Mindfulness)' },
  { id: 'compassion', label: '🙏 Từ Bi Hỷ Xả (Compassion & Love)' },
  { id: 'letting_go', label: '🍃 Buông Bỏ Phiền Não (Letting Go)' },
  { id: 'impermanence', label: '🌊 Vô Thường & Duyên Sinh (Impermanence)' }
];

const MICRO_CONTEXTS: Record<string, string[]> = {
  'karma': [
    'Lời Phật dạy về gieo nhân gặt quả hiền lành', 'Câu chuyện quả báo nhãn tiền của sự hận thù',
    'Cách chuyển hóa nghiệp xấu bằng tình yêu thương', 'Hạt giống lành sẽ nảy mầm thành quả ngọt ngào'
  ],
  'mindfulness': [
    'An trú trong giây phút hiện tại tĩnh lặng', 'Quan sát hơi thở dịu êm xoa dịu lo âu',
    'Thiền hành giữa rừng thông ban mai sương mờ', 'Lắng nghe tiếng chuông chùa vang vọng hư không'
  ],
  'compassion': [
    'Bao dung cho lỗi lầm của người gieo cay đắng', 'Ánh mắt từ bi sưởi ấm tâm hồn lạnh giá',
    'Nụ cười hòa ái xua tan bóng tối hận thù', 'Hành động nhỏ cứu giúp chúng sinh hoạn nạn'
  ],
  'letting_go': [
    'Buông bỏ những muộn phiền quá khứ dĩ vãng', 'Tha thứ cho chính mình để sống đời an nhiên',
    'Không dính mắc vào danh lợi hư ảo thế gian', 'Nhẹ nhàng trút bỏ gánh nặng ưu tư chất chồng'
  ],
  'impermanence': [
    'Nhận diện hoa nở rồi tàn như quy luật tự nhiên', 'Duyên đến thì đón nhận duyên đi thì mỉm cười',
    'Cuộc sống như dòng nước trôi không ngừng biến đổi', 'Chấp nhận vô thường để thấy lòng bình yên nhẹ nhõm'
  ]
};


const translations = {
  vi: {
    script: {
      title: "Biên Kịch & Xây Dựng Storyboard",
    },
    common: {
      copied: "Đã copy thành công!"
    }
  },
  en: {
    script: {
      title: "Scripting & Storyboard Builder",
    },
    common: {
      copied: "Copied successfully!"
    }
  }
};

const SceneCard = React.memo(({ seg, idx, uiLang }: { seg: any, idx: number, uiLang: 'vi' | 'en' }) => {
  return (
    <div className="bg-[#12161e] border border-slate-700/30 p-4 rounded-xl flex flex-col sm:flex-row gap-4 hover:border-teal-500/30 transition-colors relative">
      <div className="w-full sm:w-24 shrink-0 text-center pt-1 border-r border-slate-700/30 pr-2">
        <div className="text-[10px] bg-[#12161e] px-2 py-1 rounded font-bold text-white mb-1">SCENE {seg.scene_number || idx + 1}</div>
        <div className="text-[9px] text-slate-500 font-mono mb-1">{seg.time}</div>
        <div className="text-[9px] text-teal-400 font-bold uppercase break-words">{seg.section}</div>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#10141c]/50 p-3 rounded border border-slate-700/30 flex flex-col">
          <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1 mb-1"><i className="fa-solid fa-eye" /> VISUAL</div>
          <p className="text-xs text-slate-300 mb-2 flex-1">{seg.visual_desc_vi || seg.visual_desc}</p>
          
          {seg.pacing_score !== undefined && (
            <div className="mt-2 bg-black/30 p-2 rounded border border-slate-800 flex items-center gap-2">
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${seg.pacing_score >= 8 ? 'bg-green-900/50 text-green-400' : seg.pacing_score >= 5 ? 'bg-amber-900/50 text-amber-400' : 'bg-red-900/50 text-red-400'}`}>PACING: {seg.pacing_score}/10</div>
              <div className="text-[9px] text-slate-400 italic flex-1">{seg.pacing_warning || "Nhịp độ ổn định"}</div>
            </div>
          )}

          {seg.sfx_music_suggestion && (
            <div className="mt-2 p-2 rounded bg-blue-900/10 border border-blue-500/20">
              <div className="text-[9px] font-bold text-blue-400 flex items-center gap-1 mb-1"><i className="fa-solid fa-music" /> ASMR / AUDIO FX</div>
              <div className="text-[10px] text-blue-200/80">{seg.sfx_music_suggestion}</div>
            </div>
          )}

          {seg.strategy_note && <div className="mt-2 p-2 rounded bg-amber-900/10 border border-amber-500/20 text-[10px] text-amber-200/80 italic">💡 {seg.strategy_note}</div>}
        </div>
        <div className="bg-[#10141c]/50 p-3 rounded border border-slate-700/30">
          <div className="flex justify-between items-center mb-1">
            <div className="text-[10px] text-teal-400 font-bold flex items-center gap-1"><i className="fa-solid fa-microphone-alt" /> VOICE & DIALOGUE</div>
            <button onClick={() => { 
              const textToCopy = seg.dialogues ? seg.dialogues.map((d: any) => `${d.character_name}: ${d.line}`).join('\n') : (seg.voice_text || '');
              navigator.clipboard.writeText(textToCopy); 
              showToast('✅ Copied!', 'success'); 
            }} className="text-slate-500 hover:text-white"><i className="fa-regular fa-copy" /></button>
          </div>
          
          {seg.dialogues && Array.isArray(seg.dialogues) && seg.dialogues.length > 0 ? (
            <div className="space-y-2 mt-2">
              {seg.dialogues.map((dialogue: any, dIdx: number) => (
                <div key={dIdx} className="bg-[#0a0e14]/50 rounded p-2 border-l-2 border-amber-500/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-amber-400">{dialogue.character_name}</span>
                    {dialogue.emotion && <span className="text-[9px] text-slate-400 italic">({dialogue.emotion})</span>}
                  </div>
                  <p className="text-xs text-amber-100 font-medium leading-relaxed">"{dialogue.line}"</p>
                  {dialogue.direction && <p className="text-[9px] text-slate-500 mt-1 flex items-center gap-1"><i className="fa-solid fa-video text-slate-600" /> {dialogue.direction}</p>}
                </div>
              ))}
              {seg.voice_text && (
                 <div className="mt-3 pt-2 border-t border-slate-700/50">
                    <div className="text-[9px] text-slate-500 font-bold mb-1 uppercase">Dẫn truyền:</div>
                    <p className="text-xs text-slate-400 italic leading-relaxed text-justify">{seg.voice_text}</p>
                 </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-amber-100 font-medium italic leading-relaxed text-justify">"{seg.chapter_voice_block || seg.voice_text || '(Đọc tiếp...)'}"</p>
          )}

          {seg.voice_profile && (
            <div className="mt-2 p-2.5 bg-purple-950/20 rounded-lg border border-purple-500/20 space-y-1.5 animate-[fadeIn_0.3s_ease-out]">
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
                <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-purple-900/30">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

interface Props {
  segments: any[];
  setSegments: (segs: any[]) => void;
  scriptData: any;
  setScriptData: (data: any) => void;
  onScriptGenerated: (segments: any[], style: string, topic?: string) => void;
  onAudioRefined?: (segments: any[], topic?: string) => void;
  initialTopic?: string;
  uiLang: 'vi' | 'en';
  onNavigateToStudio?: () => void;
}

const ScriptModule: React.FC<Props> = ({ segments, setSegments, scriptData, setScriptData, onScriptGenerated, onAudioRefined, initialTopic = '', uiLang, onNavigateToStudio }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [duration, setDuration] = useState<number | string>(1);
  const [market, setMarket] = useState('vn_dharma');
  const [style, setStyle] = useState('auto');
  const [dharmaTopic, setDharmaTopic] = useState('karma');
  const [loading, setLoading] = useState(false);
  const [suggestedStyle, setSuggestedStyle] = useState<any>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [refiningAudio, setRefiningAudio] = useState(false);
  const [audioRefinedCount, setAudioRefinedCount] = useState(0);
  const [characterMode, setCharacterMode] = useState<'one' | 'two'>('two');

  const t = translations[uiLang];
  const loadingMessages = uiLang === 'vi' ? 
    ["Đang phân tích triết lý...", "Đang thiết lập bộ lọc tôn nghiêm...", "Đang dệt hội thoại tĩnh tại...", "Đang tinh chỉnh nhịp độ (Pacing)..."] :
    ["Analyzing philosophy...", "Setting solemn filters...", "Weaving peaceful dialogues...", "Refining pacing..."];

  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  React.useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingMsgIdx(0);
      interval = setInterval(() => setLoadingMsgIdx(prev => (prev + 1) % loadingMessages.length), 3000);
    }
    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  React.useEffect(() => { 
    if (initialTopic) {
      setTopic(initialTopic);
      setSegments([]);
      setScriptData(null);
    }
  }, [initialTopic]);

  const durationNum = parseFloat(duration as string) || 0;
  const scenes = Math.ceil((Math.max(0.1, durationNum) * 60) / SECONDS_PER_SCENE);
  const mode = durationNum < 3 ? { name: '🟢 QUICK CRAFT (<3m)', wpm: 130 } : durationNum <= 10 ? { name: '🔵 STORY WEAVER (3-10m)', wpm: 140 } : { name: '🟣 EPIC FOLKLORE (>10m)', wpm: 120 };
  const words = Math.floor(durationNum * mode.wpm);
  const modeColor = durationNum < 3 ? 'text-green-400 border-green-500/50 bg-green-900/10' : durationNum <= 10 ? 'text-teal-400 border-teal-500/50 bg-teal-900/10' : 'text-purple-400 border-purple-500/50 bg-purple-900/10';

  const handleSuggestStyle = async () => {
    if (!topic) return showToast(uiLang === 'vi' ? 'Nhập chủ đề trước!' : 'Enter topic first!');
    setLoadingSuggestion(true);
    try {
      const prompt = `CHỦ ĐỀ: "${topic}"\n\nHãy đề xuất phong cách visual phù hợp nhất.`;
      const result = await callAI(prompt, getStyleRecPrompt(uiLang));
      setSuggestedStyle(result);
      if (result.recommended_style) {
        setStyle(result.recommended_style);
        showToast(`${uiLang === 'vi' ? 'AI đề xuất' : 'AI Suggests'}: ${VISUAL_STYLES.find(s => s.id === result.recommended_style)?.name || result.recommended_style}`, 'success');
      }
    } catch (e: any) { showToast(e.message); }
    finally { setLoadingSuggestion(false); }
  };

  const handleGenerate = async () => {
    if (!topic) return showToast(uiLang === 'vi' ? 'Vui lòng nhập chủ đề!' : 'Please enter a topic!');
    
    // Pre-flight check: ensure we have at least 1 valid API key in storage
    const { hasAnyApiKey } = await import('../services/aiService');
    if (!hasAnyApiKey()) {
      showToast(uiLang === 'vi' 
        ? '❌ Cảnh báo: Chưa cấu hình API Key! Vui lòng mở biểu tượng Config (chìa khóa) ở góc trên bên phải để nhập API Key hoạt động.' 
        : '❌ Warning: No API Key configured! Please click the Config (key icon) at the top right to enter an active API Key.', 'error');
      return;
    }

    // UX Hard Limit: Force maximum 10 minutes (~75 scenes) to guarantee stability
    let targetDuration = duration;
    if (targetDuration > 10) {
      targetDuration = 10;
      setDuration(10);
      showToast(uiLang === 'vi' 
        ? '⚠️ Hệ thống giới hạn tối đa 10 phút (~75 cảnh) để bảo toàn chất lượng kịch bản cao nhất!'
        : '⚠️ System locked to 10 minutes (~75 scenes) maximum to ensure top quality!', 'warning');
    }

    setSegments([]);
    setScriptData(null);
    setSuggestedStyle(null);
    setAudioRefinedCount(0);
    setLoading(true);

    try {
      const styleObj = VISUAL_STYLES.find(s => s.id === style);
      const mk = TARGET_MARKETS[market] || TARGET_MARKETS['vn_dharma'];
      let styleContext = styleObj?.name || 'Auto';
      const topicObj = DHARMA_TOPICS.find(t => t.id === dharmaTopic);
      const contexts = MICRO_CONTEXTS[dharmaTopic] || ['Trong chánh niệm'];
      const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
      styleContext += ` - DHARMA TOPIC: ${topicObj?.label}. MICRO-CONTEXT (CRITICAL): ${randomContext}.`;

      // 1. Calculate the total requested scenes
      const totalScenes = Math.ceil((Math.max(0.1, targetDuration) * 60) / SECONDS_PER_SCENE);
      
      // 2. Define safe chunk size: 25 scenes per API call
      const chunkSize = 25;
      const totalRounds = Math.ceil(totalScenes / chunkSize);
      
      let allSegments: any[] = [];
      let finalSuggestedStyle = styleObj?.id || 'auto';
      let finalCharacterLock = '';
      let coppaText = '';

      // 3. Process incrementally in rounds to bypass LLM context and response token limits
      for (let round = 1; round <= totalRounds; round++) {
        const startSceneNum = (round - 1) * chunkSize + 1;
        const endSceneNum = Math.min(round * chunkSize, totalScenes);
        const roundSceneCount = endSceneNum - startSceneNum + 1;

        // Custom loading messages for each chunk to keep user engaged
        if (uiLang === 'vi') {
          showToast(`⏳ [Đợt ${round}/${totalRounds}] Đang dệt phân cảnh ${startSceneNum} đến ${endSceneNum}...`, 'success');
        } else {
          showToast(`⏳ [Round ${round}/${totalRounds}] Weaving scenes ${startSceneNum} to ${endSceneNum}...`, 'success');
        }

        // Establish previous scenes context to guarantee narrative continuity
        let continuityContext = '';
        if (allSegments.length > 0) {
          const lastFew = allSegments.slice(-3);
          continuityContext = `\n[CONTINUITY CONTEXT]: The story has already progressed through the first ${allSegments.length} scenes. Here are the last 3 scenes for context:
${JSON.stringify(lastFew.map(s => ({ scene_number: s.scene_number, voice_text: s.voice_text, visual_desc_vi: s.visual_desc_vi })), null, 2)}
CRITICAL: You MUST write the next scenes continuing this exact storyline seamlessly starting at Scene ${startSceneNum}. Do NOT repeat these scene contents, move the story forward.`;
        }

        const randomSeed = Math.floor(Math.random() * 1000000);
        const prompt = `TOPIC: "${topic}"
DURATION: ${targetDuration}m (Total video duration)
ROUND_GENERATING: Round ${round} of ${totalRounds} (Generating scenes ${startSceneNum} to ${endSceneNum})
ROUND_SCENE_COUNT: ${roundSceneCount} (Generate exactly ${roundSceneCount} scenes starting at number ${startSceneNum})
TARGET_MARKET: ${mk.name}
NATIVE_LANGUAGE: ${mk.voice_lang}
CULTURAL_CONTEXT: ${mk.culture}
VISUAL_STYLE: ${styleContext}
[ANTI-REPETITION SEED]: ${randomSeed}${continuityContext}

CRITICAL INSTRUCTION:
1. Write the VOICE_TEXT and DIALOGUES in "${mk.voice_lang}" using native idioms, cultural nuances, and the specific spiritual style of that region. 
2. DO NOT just translate from Vietnamese. Think like a native expert in ${mk.name}.
3. The visual descriptions and technical fields should be in ${uiLang === 'vi' ? 'Vietnamese' : 'English'} for the creator to understand.
4. Return a JSON object matching the exact structure below. Make sure the 'script' array contains exactly ${roundSceneCount} elements starting with scene_number: ${startSceneNum} and ending with scene_number: ${endSceneNum}.
5. GENERATE JSON OBJECT.`;

        const systemPrompt = getScriptWriterPrompt(characterMode);
        const json = await callAI(prompt, systemPrompt);
        
        let roundSegs = json.script || (Array.isArray(json) ? json : []);
        if (round === 1) {
          if (json.suggested_style) finalSuggestedStyle = json.suggested_style;
          if (json.character_lock_prompt) finalCharacterLock = json.character_lock_prompt;
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

        // Apply visual style prompt enforce
        let enforce = '';
        if (styleObj && styleObj.id !== 'auto') enforce = styleObj.prompt_enforce;
        if (enforce) {
          roundSegs = roundSegs.map((s: any) => ({
            ...s,
            video_prompt: s.video_prompt?.includes('Visual Style:') ? s.video_prompt : `${s.video_prompt} ${enforce}`,
            image_prompt: s.image_prompt?.includes('Visual Style:') ? s.image_prompt : `${s.image_prompt} ${enforce}`,
          }));
        }

        allSegments = [...allSegments, ...roundSegs];
      }

      // 4. Merge all segments into a master storyboard
      const finalJson = {
        mode_detected: targetDuration < 3 ? "Quick Dharma" : targetDuration <= 10 ? "Story Weaver" : "Epic Teaching",
        suggested_style: finalSuggestedStyle,
        character_lock_prompt: finalCharacterLock,
        script: allSegments,
        coppa_disclaimer: coppaText || "Video này chứa triết lý sâu sắc, có thể không phù hợp cho trẻ em tự nhận thức."
      };

      setScriptData(finalJson);
      setSegments(allSegments);
      
      // Auto-save to localStorage
      localStorage.setItem('dharma2nv_autosave_script', JSON.stringify({
        topic: topic,
        scriptData: finalJson,
        segments: allSegments
      }));

      onScriptGenerated(allSegments, finalSuggestedStyle, topic);
      
      if (uiLang === 'vi') {
        showToast(`🎉 Đã dệt thành công trọn vẹn kịch bản ${allSegments.length} phân cảnh!`, 'success');
      } else {
        showToast(`🎉 Successfully woven full script with ${allSegments.length} scenes!`, 'success');
      }
    } catch (e: any) { 
      showToast(e.message, 'error'); 
    } finally { 
      setLoading(false); 
    }
  };

  const copyAll = () => {
    const text = segments.map(s => s.chapter_voice_block || s.voice_text).join('\n\n');
    navigator.clipboard.writeText(text);
    showToast(t.common.copied, 'success');
  };

  const handleAudioRefining = async () => {
    if (segments.length === 0) return showToast(uiLang === 'vi' ? 'Chưa có kịch bản để tinh chỉnh!' : 'No script to refine!');
    
    // Pre-flight check: ensure we have at least 1 valid API key in storage
    const { hasAnyApiKey } = await import('../services/aiService');
    if (!hasAnyApiKey()) {
      showToast(uiLang === 'vi' 
        ? '❌ Cảnh báo: Chưa cấu hình API Key! Vui lòng mở biểu tượng Config (chìa khóa) ở góc trên bên phải để nhập API Key hoạt động.' 
        : '❌ Warning: No API Key configured! Please click the Config (key icon) at the top right to enter an active API Key.', 'error');
      return;
    }

    setRefiningAudio(true);
    try {
      const payload = segments.map(s => ({
        scene_number: s.scene_number,
        voice_text: s.voice_text || s.chapter_voice_block || '',
        visual_context: s.visual_desc_vi || s.visual_desc || '',
        section: s.section || '',
        character: s.character || '',
        time: s.time || ''
      }));
      const prompt = `KỊCH BẢN GỐC (${payload.length} scenes):\n${JSON.stringify(payload, null, 2)}\n\nTINH CHỈNH THANH ÂM CHO TẤT CẢ ${payload.length} SCENES. RESPOND IN ${uiLang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.`;
      const systemPrompt = getAudioReengineeringPrompt(characterMode);
      const res = await callAI(prompt, systemPrompt);
      if (res?.refined_scenes) {
        const newSegments = segments.map((original, idx) => {
          const refined = res.refined_scenes.find((r: any) => r.scene_number === original.scene_number) || res.refined_scenes[idx];
          if (!refined) return original;
          return { ...original, voice_text: refined.voice_text || original.voice_text, voice_profile: refined.voice_profile || null };
        });
        setSegments(newSegments);
        
        // Auto-save the refined audio
        const currentData = scriptData ? { ...scriptData, script: newSegments } : null;
        if (currentData) setScriptData(currentData);
        localStorage.setItem('dharma2nv_autosave_script', JSON.stringify({
          topic: topic,
          scriptData: currentData,
          segments: newSegments
        }));

        if (onAudioRefined) onAudioRefined(newSegments, topic);
        setAudioRefinedCount(prev => prev + 1);
        showToast(uiLang === 'vi' ? '🎙️ Thanh âm đã được tinh chỉnh thành công!' : '🎙️ Audio refined successfully!', 'success');
      }
    } catch (e: any) { showToast(`Audio Error: ${e.message}`); }
    finally { setRefiningAudio(false); }
  };

  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.segments) {
          setTopic(data.topic || '');
          setSegments(data.segments);
          onScriptGenerated(data.segments, 'auto', data.topic || '');
          showToast(t.common.copied, 'success');
        }
      } catch (err) { showToast('Error reading file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2"><i className="fa-solid fa-om text-teal-500" /> {t.script.title}</span>
          <label className="cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-900/20 text-amber-300 border border-amber-500/30 hover:bg-amber-900/40 transition-all flex items-center gap-2">
            <i className="fa-solid fa-folder-open" /> {uiLang === 'vi' ? 'Mở Dự Án' : 'Open Project'}
            <input type="file" accept=".json" className="hidden" onChange={handleImportProject} />
          </label>
        </h2>
        <div className="space-y-4">
          <div className="relative mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">{uiLang === 'vi' ? 'Chủ Đề Truyện' : 'Story Topic'}</label>
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
                className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none focus:border-teal-500/50 placeholder-slate-600" 
                placeholder={uiLang === 'vi' ? "VD: Luật nhân quả, An trú hiện tại, Buông bỏ phiền não..." : "e.g., Karma law, Living in the present..."} 
              />
              <button onClick={handleSuggestStyle} disabled={loadingSuggestion || !topic}
                className="px-4 py-2 bg-amber-900/30 hover:bg-amber-800/40 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 shrink-0">
                {loadingSuggestion ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang === 'vi' ? 'Đang phân tích...' : 'Analyzing...'}</> : <><i className="fa-solid fa-wand-magic-sparkles" /> {uiLang === 'vi' ? 'AI Đề Xuất Style' : 'AI Suggest Style'}</>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/50" />
              <label className="text-xs font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2"><i className="fa-solid fa-clock text-teal-400" /> {uiLang === 'vi' ? 'THỜI LƯỢNG (PHÚT)' : 'DURATION (MINS)'}</label>
              <div className="flex items-center gap-5">
                <input 
                  type="number" 
                  value={duration} 
                  step={0.5} 
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '') {
                      setDuration('');
                      return;
                    }
                    const num = parseFloat(val);
                    if (num > 10) {
                      showToast(uiLang === 'vi' 
                        ? '⚠️ Giới hạn thời lượng tối đa là 10 phút!' 
                        : '⚠️ Maximum duration limit is 10 minutes!', 'warning');
                      setDuration(10);
                    } else {
                      setDuration(num);
                    }
                  }}
                  onBlur={e => {
                    const num = parseFloat(e.target.value);
                    if (isNaN(num) || num < 0.5) {
                      setDuration(1);
                    } else if (num > 10) {
                      setDuration(10);
                    }
                  }}
                  className="w-20 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-2xl font-black text-white text-center outline-none" 
                />
                <div className="flex flex-col gap-1.5 text-xs">
                  <div><span className="text-slate-500">{uiLang === 'vi' ? 'Số cảnh' : 'Scenes'}:</span> <span className="font-bold text-green-400 text-base">~{scenes}</span></div>
                  <div><span className="text-slate-500">Voice:</span> <span className="font-bold text-teal-400 text-base">~{words} {uiLang === 'vi' ? 'từ' : 'words'}</span></div>
                </div>
              </div>
            </div>
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-globe text-amber-400" /> {uiLang === 'vi' ? 'THỊ TRƯỜNG' : 'MARKET'}</label>
              <select value={market} onChange={e => setMarket(e.target.value)} className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
                {Object.values(TARGET_MARKETS).map(m => <option key={m.id} value={m.id}>{m.flag} {m.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
              <label className="text-xs font-bold text-teal-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-leaf text-teal-400" /> {uiLang === 'vi' ? 'CHỌN PHÂN NGÁCH PHẬT PHÁP' : 'DHARMA SUB-TOPIC'}</label>
              <select value={dharmaTopic} onChange={e => setDharmaTopic(e.target.value)} className="w-full bg-[#0a0e14] border border-teal-500/50 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
                {DHARMA_TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2">
                <i className="fa-solid fa-users text-amber-400" /> {uiLang === 'vi' ? 'SỐ LƯỢNG NHÂN VẬT' : 'NUMBER OF CHARACTERS'}
              </label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setCharacterMode('one')}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    characterMode === 'one'
                      ? 'bg-amber-900/30 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-[#0a0e14] border-slate-700/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <i className="fa-solid fa-user" /> {uiLang === 'vi' ? '1 Nhân Vật (Xuyên Suốt)' : '1 Character (Constant)'}
                </button>
                <button
                  type="button"
                  onClick={() => setCharacterMode('two')}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    characterMode === 'two'
                      ? 'bg-amber-900/30 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-[#0a0e14] border-slate-700/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <i className="fa-solid fa-user-group" /> {uiLang === 'vi' ? '2 Nhân Vật (Thay Phiên)' : '2 Characters (Alternate)'}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <label className="text-xs font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2">
              <i className="fa-solid fa-palette text-pink-400" /> {uiLang === 'vi' ? 'PHONG CÁCH NGHỆ THUẬT (VISUAL STYLE)' : 'VISUAL STYLE'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              <div 
                onClick={() => setStyle('auto')}
                className={`cursor-pointer p-3 rounded-xl border flex items-center justify-center text-center transition-all ${style === 'auto' ? 'bg-pink-900/40 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)] text-white' : 'bg-[#0a0e14] border-slate-700/50 hover:border-slate-500 text-slate-400'}`}
              >
                <div className="text-sm font-bold"><i className="fa-solid fa-wand-magic-sparkles mb-1 block text-lg"></i> Auto AI</div>
              </div>
              {VISUAL_STYLES.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setStyle(s.id)}
                  className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${style === s.id ? 'bg-pink-900/40 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)] text-white' : 'bg-[#0a0e14] border-slate-700/50 hover:border-slate-500 text-slate-400'}`}
                  title={s.desc}
                >
                  <div className="text-xs font-bold leading-tight">{s.name}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={loading || refiningAudio}
            className="w-full py-4 bg-teal-900/50 hover:bg-teal-800/50 border border-teal-500/30 text-teal-100 font-bold rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.15)] flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> {loadingMessages[loadingMsgIdx]}</> : <><i className="fa-solid fa-paper-plane" /> {uiLang === 'vi' ? 'KIẾN TẠO KỊCH BẢN CHỮA LÀNH' : 'GENERATE HEALING SCRIPT'}</>}
          </button>

          {segments.length > 0 && (
            <button onClick={handleAudioRefining} disabled={loading || refiningAudio}
              className="w-full py-3.5 bg-purple-900/30 hover:bg-purple-800/40 border border-purple-500/30 text-purple-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              {refiningAudio ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang === 'vi' ? 'Đang tinh chỉnh âm thanh...' : 'Refining audio...'}</> : <><i className="fa-solid fa-headphones-simple" /> <span>{uiLang === 'vi' ? '🎙️ TINH CHỈNH THANH ÂM (V16.0)' : '🎙️ AUDIO RE-ENGINEERING (V16.0)'}</span><span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded font-black">+{audioRefinedCount}</span></>}
            </button>
          )}
        </div>
      </div>

      {segments.length > 0 && (
        <div className="space-y-4 pb-10">
          <div className="flex justify-between items-center px-2">
            <div className="text-xs text-slate-500 font-bold">{uiLang === 'vi' ? `Đã tạo: ${segments.length} phân đoạn` : `Generated: ${segments.length} segments`}</div>
            <button onClick={copyAll} className="text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 bg-white text-black hover:bg-slate-200"><i className="fa-solid fa-copy" /> {uiLang === 'vi' ? 'Copy Voice Toàn Bộ' : 'Copy Voice All'}</button>
          </div>
          {segments.map((seg, idx) => (
            <SceneCard key={idx} seg={seg} idx={idx} uiLang={uiLang} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScriptModule;