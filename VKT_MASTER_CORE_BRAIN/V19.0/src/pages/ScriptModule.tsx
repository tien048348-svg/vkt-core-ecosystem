import React, { useState, useRef } from 'react';
import { callAI } from '../services/aiService';
import { 
   
  TARGET_MARKETS, 
  VISUAL_STYLES 
} from '../data/constants';
import { 
  SYSTEM_PROMPT_SCRIPT_WRITER,
  SYSTEM_PROMPT_AUDIO_REENGINEERING,
  getStyleRecPrompt
} from '../data/prompts';
import { showToast } from '../components/Toast';
import ProgressBar from '../components/ProgressBar';

export const DHARMA_TOPICS = [
  { id: 'karma', label: '⚖️ Luật Nhân Quả (Karma Law)' },
  { id: 'mindfulness', label: '🧘 Thiền Định & Tĩnh Thức (Mindfulness)' },
  { id: 'compassion', label: '🙏 Từ Bi Hỷ Xả (Compassion & Love)' },
  { id: 'letting_go', label: '🍃 Buông Bỏ Phiền Não (Letting Go)' },
  { id: 'impermanence', label: '🌊 Vô Thường & Duyên Sinh (Impermanence)' },
  { id: 'gratitude', label: '🌸 Lòng Biết Ơn & Hiếu Đạo (Gratitude & Filial Piety)' },
  { id: 'fortitude', label: '⛰️ Vượt Qua Nghịch Cảnh (Patience & Fortitude)' },
  { id: 'wisdom_prajna', label: '💫 Trí Tuệ & Giác Ngộ (Wisdom & Enlightenment)' },
  { id: 'inner_child', label: '🪴 Chữa Lành Đứa Trẻ Bên Trong (Spiritual Healing)' }
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
  ],
  'gratitude': [
    'Nhớ ơn sâu nặng của đấng sinh thành dưỡng dục', 'Trân quý những hạnh phúc giản đơn đang hiện hữu',
    'Biết ơn từng chén trà, từng hơi thở nhẹ nhàng', 'Hạnh phúc đích thực nảy mầm từ lòng biết ơn'
  ],
  'fortitude': [
    'Đối diện với giông bão cuộc đời bằng sự kiên nhẫn', 'Vững chãi trước những thị phi phiền não nhân gian',
    'Tâm bất biến giữa dòng đời vạn biến xoay vần', 'Nhẫn nhục chuyển hóa oán hận thành hoa sen thơm ngát'
  ],
  'wisdom_prajna': [
    'Lời Phật dạy về bản chất tánh Không diệu kỳ', 'Buông bỏ bám chấp vào thế giới hình tướng ảo ảnh',
    'Trí tuệ Bát Nhã soi sáng con đường giải thoát', 'Nhìn cuộc đời như giấc mộng, tĩnh lặng quan sát'
  ],
  'inner_child': [
    'Xoa dịu đứa trẻ tổn thương ẩn sâu trong tâm hồn', 'Tha thứ cho những sai lầm vụng dại của quá khứ',
    'Ôm ấp lo âu bằng tình yêu thương vô lượng vô biên', 'Lắng nghe nhịp tim và cho phép bản thân được bình yên'
  ]
};


const translations = {
  vi: {
    script: {
      title: "Biên Kịch & Xây Dựng Storyboard",
      speakerMode: "Cấu hình giọng đọc / nhân vật",
      multiSpeaker: "Đa nhân vật (Mặc định)",
      singleSpeaker: "Một nhân vật duy nhất",
      pureAsmr: "Tĩnh lặng tuyệt đối (Pure ASMR)",
      multiSpeakerDesc: "Kịch bản có nhiều nhân vật thay phiên đối thoại/phát biểu qua các phân cảnh.",
      singleSpeakerDesc: "Chỉ một giọng dẫn chuyện hoặc nhân vật nói duy nhất từ đầu đến cuối video.",
      pureAsmrDesc: "Không lời thoại. Tập trung 100% vào hình ảnh thôi miên và âm thanh thiền định ASMR."
    },
    common: {
      copied: "Đã copy thành công!"
    }
  },
  en: {
    script: {
      title: "Scripting & Storyboard Builder",
      speakerMode: "Voice / Character Settings",
      multiSpeaker: "Multi-Character (Default)",
      singleSpeaker: "Single Character Only",
      pureAsmr: "Tĩnh lặng tuyệt đối (Pure ASMR)",
      multiSpeakerDesc: "Multiple characters take turns talking/speaking across different scenes.",
      singleSpeakerDesc: "Only one narrator or character speaks from the beginning to the end of the video.",
      pureAsmrDesc: "No voiceover. Focus 100% on hypnotic visuals and therapeutic Zen ASMR soundscapes."
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
  const [secondsPerScene, setSecondsPerScene] = useState<number | string>(8);
  const [market, setMarket] = useState('vn_dharma');
  const [style, setStyle] = useState('auto');
  const [dharmaTopic, setDharmaTopic] = useState('karma');
  const [loading, setLoading] = useState(false);
  const [suggestedStyle, setSuggestedStyle] = useState<any>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [refiningAudio, setRefiningAudio] = useState(false);
  const [refiningProgress, setRefiningProgress] = useState(0);
  const [audioRefinedCount, setAudioRefinedCount] = useState(0);
  const [speakerMode, setSpeakerMode] = useState<'multi' | 'single' | 'asmr'>('single');
  const [progress, setProgress] = useState({ percent: 0, text: '' });
  const abortRef = useRef(false);

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
  const secPerSceneNum = parseFloat(secondsPerScene as string) || 8;
  const scenes = Math.ceil((Math.max(0.1, durationNum) * 60) / secPerSceneNum);
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

    // UX Hard Limit: Force maximum 180 minutes to guarantee stability
    let targetDuration = duration;
    if (targetDuration > 180) {
      targetDuration = 180;
      setDuration(180);
      showToast(uiLang === 'vi' 
        ? '⚠️ Hệ thống giới hạn tối đa 180 phút (3 tiếng) để bảo toàn chất lượng kịch bản cao nhất!'
        : '⚠️ System locked to 180 minutes (3 hours) maximum to ensure top quality!', 'warning');
    }

    setSegments([]);
    setScriptData(null);
    setSuggestedStyle(null);
    setAudioRefinedCount(0);
    setProgress({ percent: 2, text: uiLang === 'vi' ? 'Đang khởi tạo lõi AI...' : 'Initializing AI core...' });
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
      const totalScenes = Math.ceil((Math.max(0.1, targetDuration) * 60) / secPerSceneNum);
      
      // 2. Define safe chunk size: 25 scenes per API call
      const chunkSize = 25;
      const totalRounds = Math.ceil(totalScenes / chunkSize);
      
      let allSegments: any[] = [];
      let finalSuggestedStyle = styleObj?.id || 'auto';
      let finalCharacterLock = '';
      let coppaText = '';
      let suggestedWatermark = '';

      abortRef.current = false;

      // 3. Process incrementally in rounds to bypass LLM context and response token limits
      for (let round = 1; round <= totalRounds; round++) {
        if (abortRef.current) break;
        const startSceneNum = (round - 1) * chunkSize + 1;
        const endSceneNum = Math.min(round * chunkSize, totalScenes);
        const roundSceneCount = endSceneNum - startSceneNum + 1;
        // Simulate smooth progress for better UX
        let simulatedScene = startSceneNum;
        const estimatedMsPerScene = 1500; // Simulate 1.5s per scene
        
        setProgress({ 
          percent: Math.floor((simulatedScene / totalScenes) * 95), 
          text: uiLang === 'vi' ? `Đang dệt phân cảnh ${simulatedScene}/${totalScenes}...` : `Weaving scene ${simulatedScene}/${totalScenes}...` 
        });

        const simInterval = setInterval(() => {
          if (simulatedScene < endSceneNum - 1) {
            simulatedScene++;
            setProgress({ 
              percent: Math.floor((simulatedScene / totalScenes) * 95), 
              text: uiLang === 'vi' ? `Đang dệt phân cảnh ${simulatedScene}/${totalScenes}...` : `Weaving scene ${simulatedScene}/${totalScenes}...` 
            });
          }
        }, estimatedMsPerScene);
        
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

        const speakerModeInstructions = speakerMode === 'asmr'
          ? `\n[SPEAKER MODE - PURE ASMR ACTIVE]:
- The script MUST contain ABSOLUTELY ZERO voiceovers, dialogues, or spoken words.
- The 'voice_text' field MUST be an empty string ("") in all scenes.
- The 'dialogues' array MUST be empty ([]) in all scenes.
- The 'voice_profile' object should have speaker and timbre as empty/null or empty strings.
- OVERRIDE all dialogue/narrator rules in the system prompt.
- CONCENTRATE 100% of creativity on the 'video_prompt'/'image_prompt' (hypnotic, satisfying, ultra-sharp visuals) and 'sfx_music_suggestion' (extremely rich, multi-layered ASMR sounds and healing frequencies like 432Hz/528Hz).`
          : speakerMode === 'single'
          ? `\n[SPEAKER MODE - SINGLE SPEAKER MONOLOGUE ACTIVE]:
- The entire video script MUST be written for only ONE single character/narrator from the first scene to the last scene (e.g., 'Người dẫn chuyện' or 'Thiền sư' or 'Trưởng lão' or 'Người mẹ'...).
- The 'character' name and 'voice_profile.speaker' MUST be identical across all scenes (e.g. if Scene 1 is 'Trưởng lão', Scene 2, 3, etc. must also be 'Trưởng lão'). Do NOT introduce multiple characters, do NOT have different characters speaking in different scenes.
- OVERRIDE the rule that says "Tuyệt đối cấm chỉ để 1 narrator nói suốt từ đầu đến cuối" or "ĐA NHÂN VẬT THAY PHIÊN" in the system prompt. Instead, keep a single voice speaking from beginning to end.`
          : `\n[SPEAKER MODE - MULTI-CHARACTER DIALOGUE ACTIVE]:
- The script should feature multiple characters taking turns speaking across different scenes to create a dialogue or alternating storytelling (e.g., scene 1: A speaks, scene 2: B speaks...).
- Ensure different scenes use appropriate characters from the story.`;

        const randomSeed = Math.floor(Math.random() * 1000000);
        const prompt = `TOPIC: "${topic}"
DURATION: ${targetDuration}m (Total video duration)
SECONDS_PER_SCENE: ${secPerSceneNum}s
ROUND_GENERATING: Round ${round} of ${totalRounds} (Generating scenes ${startSceneNum} to ${endSceneNum})
ROUND_SCENE_COUNT: ${roundSceneCount} (Generate exactly ${roundSceneCount} scenes starting at number ${startSceneNum})
TARGET_MARKET: ${mk.name}
NATIVE_LANGUAGE: ${mk.voice_lang}
CULTURAL_CONTEXT: ${mk.culture}
VISUAL_STYLE: ${styleContext}
[ANTI-REPETITION SEED]: ${randomSeed}${continuityContext}
${speakerModeInstructions}

CRITICAL INSTRUCTION:
1. Write the VOICE_TEXT and DIALOGUES in "${mk.voice_lang}" using native idioms, cultural nuances, and the specific spiritual style of that region. 
2. DO NOT just translate from Vietnamese. Think like a native expert in ${mk.name}.
3. The visual descriptions and technical fields should be in ${uiLang === 'vi' ? 'Vietnamese' : 'English'} for the creator to understand.
4. Return a JSON object matching the exact structure below. Make sure the 'script' array contains exactly ${roundSceneCount} elements starting with scene_number: ${startSceneNum} and ending with scene_number: ${endSceneNum}.
5. GENERATE JSON OBJECT.`;

        let json: any = null;
        let retries = 3;
        while (retries > 0) {
          try {
            json = await callAI(prompt, SYSTEM_PROMPT_SCRIPT_WRITER);
            break;
          } catch (err: any) {
            retries--;
            if (retries === 0) throw err;
            if (abortRef.current) break;
            setProgress({ percent: progress.percent, text: uiLang === 'vi' ? `⚠️ Đang thử lại (${3-retries}/3)...` : `⚠️ Retrying (${3-retries}/3)...` });
            showToast(uiLang === 'vi' ? `⚠️ Đợt ${round} bị nghẽn API. Đang thử lại (${3-retries}/3)...` : `⚠️ Round ${round} API overloaded. Retrying (${3-retries}/3)...`, 'warning');
            await new Promise(res => setTimeout(res, 10000));
          }
        }
        
        clearInterval(simInterval);
        
        if (abortRef.current) break;

        let roundSegs = json?.script || (Array.isArray(json) ? json : []);
        if (round === 1 && json) {
          if (json.suggested_style) finalSuggestedStyle = json.suggested_style;
          if (json.character_lock_prompt) finalCharacterLock = json.character_lock_prompt;
          if (json.coppa_disclaimer) coppaText = json.coppa_disclaimer;
          if (json.suggested_watermark) suggestedWatermark = json.suggested_watermark;
        }

        // Standardize output structure
        roundSegs = roundSegs.map((s: any, idx: number) => {
          const calculatedNum = startSceneNum + idx;
          const min = Math.floor(((calculatedNum - 1) * secPerSceneNum) / 60);
          const secStart = ((calculatedNum - 1) * secPerSceneNum) % 60;
          const secEnd = (calculatedNum * secPerSceneNum) % 60;
          const minEnd = Math.floor((calculatedNum * secPerSceneNum) / 60);
          
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
        
        // Progressive Rendering
        const completedPercent = Math.floor((round / totalRounds) * 100);
        setProgress({ percent: completedPercent, text: uiLang === 'vi' ? `Hoàn thành đợt ${round}/${totalRounds}` : `Completed round ${round}/${totalRounds}` });
        setSegments([...allSegments]);
        
        // Auto-save partial progress
        const partialJson = {
          mode_detected: targetDuration < 3 ? "Quick Dharma" : targetDuration <= 10 ? "Story Weaver" : "Epic Teaching",
          suggested_style: finalSuggestedStyle,
          suggested_watermark: suggestedWatermark,
          character_lock_prompt: finalCharacterLock,
          script: allSegments,
          coppa_disclaimer: coppaText || "Video này chứa triết lý sâu sắc, có thể không phù hợp cho trẻ em tự nhận thức."
        };
        localStorage.setItem('dharmaP_autosave_script', JSON.stringify({
          topic: topic,
          scriptData: partialJson,
          segments: allSegments
        }));

        // Sleep to cooldown API
        if (round < totalRounds && !abortRef.current) {
          await new Promise(res => setTimeout(res, 8000));
        }
      }

      if (abortRef.current) {
        setLoading(false);
        return;
      }

      // 4. Merge all segments into a master storyboard
      const finalJson = {
        mode_detected: targetDuration < 3 ? "Quick Dharma" : targetDuration <= 10 ? "Story Weaver" : "Epic Teaching",
        suggested_style: finalSuggestedStyle,
        suggested_watermark: suggestedWatermark,
        character_lock_prompt: finalCharacterLock,
        script: allSegments,
        coppa_disclaimer: coppaText || "Video này chứa triết lý sâu sắc, có thể không phù hợp cho trẻ em tự nhận thức."
      };

      setScriptData(finalJson);
      setSegments(allSegments);
      
      
      setProgress({ percent: 100, text: uiLang === 'vi' ? 'Hoàn tất kịch bản!' : 'Script complete!' });
      
      // Auto-save to localStorage
      localStorage.setItem('dharmaP_autosave_script', JSON.stringify({
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
      setTimeout(() => {
        setLoading(false); 
        setProgress({ percent: 0, text: '' });
      }, 1000);
    }
  };

  const copyAll = () => {
    const text = segments.map(s => s.chapter_voice_block || s.voice_text).join('\n\n');
    navigator.clipboard.writeText(text);
    showToast(t.common.copied, 'success');
  };

  const exportMasterJson = () => {
    if (!scriptData) return;
    const masterPackage = {
      project_name: topic,
      export_version: 'V16.0',
      market,
      duration_minutes: durationNum,
      seconds_per_scene: secPerSceneNum,
      timestamp: new Date().toISOString(),
      scriptData,
      segments
    };
    const blob = new Blob([JSON.stringify(masterPackage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VKT_Master_${topic.replace(/\s+/g, '_').substring(0, 20)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(uiLang === 'vi' ? '📦 Đã xuất Master JSON Toàn Tập!' : '📦 Master JSON Exported!', 'success');
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
    setRefiningProgress(2);
    const progressInterval = setInterval(() => {
      setRefiningProgress(prev => (prev < 90 ? prev + 1 : prev));
    }, 200);

    try {
      const payload = segments.map(s => ({
        scene_number: s.scene_number,
        voice_text: s.voice_text || s.chapter_voice_block || '',
        visual_context: s.visual_desc_vi || s.visual_desc || '',
        section: s.section || '',
        character: s.character || '',
        time: s.time || ''
      }));
      const refinedInstructions = speakerMode === 'asmr'
        ? `\n[SPEAKER MODE: PURE ASMR ACTIVE]
- This script is in PURE ASMR mode. There must be NO voice_text or dialogues.
- Ensure 'voice_text' remains an empty string ("") for all scenes, and dialogues/speakers are empty or null.
- Focus entirely on refining 'sfx_music_suggestion' or dynamic pacing cues (in visual_context if needed) for rich ASMR experiences.`
        : speakerMode === 'single'
        ? `\n[SPEAKER MODE: SINGLE SPEAKER MONOLOGUE ACTIVE]
- This script is in SINGLE SPEAKER mode (only 1 narrator/voice speaks throughout).
- You MUST maintain the EXACT same character name ('speaker') and voice profile for all scenes. Do NOT introduce multiple characters, do NOT have different characters speaking in different scenes.
- Ensure 'voice_profile.speaker' is identical for every refined scene (e.g. all 'Trưởng lão' or all 'Người dẫn chuyện').`
        : `\n[SPEAKER MODE: MULTI-CHARACTER DIALOGUE ACTIVE]
- This script is in MULTI-CHARACTER mode.
- Maintain the alternating characters as specified in the original input.`;

      const prompt = `KỊCH BẢN GỐC (${payload.length} scenes):\n${JSON.stringify(payload, null, 2)}\n\nTINH CHỈNH THANH ÂM CHO TẤT CẢ ${payload.length} SCENES.${refinedInstructions}\nRESPOND IN ${uiLang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.`;
      const res = await callAI(prompt, SYSTEM_PROMPT_AUDIO_REENGINEERING);
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
        localStorage.setItem('dharmaP_autosave_script', JSON.stringify({
          topic: topic,
          scriptData: currentData,
          segments: newSegments
        }));

        if (onAudioRefined) onAudioRefined(newSegments, topic);
        setAudioRefinedCount(prev => prev + 1);
        showToast(uiLang === 'vi' ? '🎙️ Thanh âm đã được tinh chỉnh thành công!' : '🎙️ Audio refined successfully!', 'success');
      }
    } catch (e: any) { showToast(`Audio Error: ${e.message}`); }
    finally { 
      clearInterval(progressInterval);
      setRefiningProgress(100);
      setTimeout(() => setRefiningAudio(false), 500);
    }
  };

  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.segments) {
          setTopic(data.project_name || data.topic || '');
          setSegments(data.segments);
          if (data.duration_minutes) setDuration(data.duration_minutes);
          if (data.seconds_per_scene) setSecondsPerScene(data.seconds_per_scene);
          if (data.market) setMarket(data.market);
          if (data.scriptData) setScriptData(data.scriptData);
          
          onScriptGenerated(data.segments, 'auto', data.project_name || data.topic || '');
          showToast(uiLang === 'vi' ? 'Đã khôi phục Kịch bản!' : 'Script Restored!', 'success');
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
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-5">
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
                    if (num > 180) {
                      showToast(uiLang === 'vi' 
                        ? '⚠️ Giới hạn thời lượng tối đa là 180 phút!' 
                        : '⚠️ Maximum duration limit is 180 minutes!', 'warning');
                      setDuration(180);
                    } else {
                      setDuration(num);
                    }
                  }}
                  onBlur={e => {
                    const num = parseFloat(e.target.value);
                    if (isNaN(num) || num < 0.5) {
                      setDuration(1);
                    } else if (num > 180) {
                      setDuration(180);
                    }
                  }}
                  className="w-20 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-2xl font-black text-white text-center outline-none" 
                />
                
                <div className="flex flex-col gap-1 w-24">
                  <label className="text-[10px] text-slate-400 font-bold">GIÂY/CẢNH:</label>
                  <input 
                    type="number" 
                    step={0.5}
                    value={secondsPerScene} 
                    onChange={e => {
                      const val = e.target.value;
                      if (val === '') setSecondsPerScene('');
                      else setSecondsPerScene(Math.max(0.5, parseFloat(val)));
                    }}
                    className="w-full bg-[#0a0e14] border border-slate-700/50 rounded p-1.5 text-sm font-bold text-teal-300 text-center outline-none" 
                  />
                </div>
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
          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <label className="text-xs font-bold text-teal-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-leaf text-teal-400" /> {uiLang === 'vi' ? 'CHỌN PHÂN PHÂN NGÁCH PHẬT PHÁP' : 'DHARMA SUB-TOPIC'}</label>
            <select value={dharmaTopic} onChange={e => setDharmaTopic(e.target.value)} className="w-full bg-[#0a0e14] border border-teal-500/50 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
              {DHARMA_TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>

          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <label className="text-xs font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2">
              <i className="fa-solid fa-microphone text-purple-400" /> {t.script.speakerMode}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                onClick={() => setSpeakerMode('multi')}
                className={`cursor-pointer p-3 rounded-xl border flex items-start gap-3 transition-all ${
                  speakerMode === 'multi' 
                    ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] text-white' 
                    : 'bg-[#0a0e14] border-slate-700/50 hover:border-slate-500 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${speakerMode === 'multi' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <i className="fa-solid fa-users text-sm"></i>
                </div>
                <div>
                  <div className="text-xs font-bold">{t.script.multiSpeaker}</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-tight">{t.script.multiSpeakerDesc}</div>
                </div>
              </div>

              <div 
                onClick={() => setSpeakerMode('single')}
                className={`cursor-pointer p-3 rounded-xl border flex items-start gap-3 transition-all ${
                  speakerMode === 'single' 
                    ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] text-white' 
                    : 'bg-[#0a0e14] border-slate-700/50 hover:border-slate-500 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${speakerMode === 'single' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <i className="fa-solid fa-user text-sm"></i>
                </div>
                <div>
                  <div className="text-xs font-bold">{t.script.singleSpeaker}</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-tight">{t.script.singleSpeakerDesc}</div>
                </div>
              </div>

              <div 
                onClick={() => setSpeakerMode('asmr')}
                className={`cursor-pointer p-3 rounded-xl border flex items-start gap-3 transition-all ${
                  speakerMode === 'asmr' 
                    ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] text-white' 
                    : 'bg-[#0a0e14] border-slate-700/50 hover:border-slate-500 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${speakerMode === 'asmr' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <i className="fa-solid fa-volume-xmark text-sm"></i>
                </div>
                <div>
                  <div className="text-xs font-bold">{t.script.pureAsmr}</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-tight">{t.script.pureAsmrDesc}</div>
                </div>
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

          <div className="flex gap-4">
            {loading ? (
              <ProgressBar 
                percent={progress.percent} 
                text={progress.text || loadingMessages[loadingMsgIdx]} 
                subText={uiLang === 'vi' ? 'Tiến trình kiến tạo Kịch Bản AI' : 'AI Script Generation Progress'}
                colorTheme="teal"
              />
            ) : (
              <button onClick={handleGenerate} disabled={refiningAudio}
                className="flex-1 py-4 bg-teal-900/50 hover:bg-teal-800/50 border border-teal-500/30 text-teal-100 font-bold rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.15)] flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                <i className="fa-solid fa-paper-plane" /> {uiLang === 'vi' ? 'KIẾN TẠO KỊCH BẢN CHỮA LÀNH' : 'GENERATE HEALING SCRIPT'}
              </button>
            )}
            
            {loading && (
              <button onClick={() => { 
                abortRef.current = true; 
                setLoading(false); 
                setSegments([]); 
                setScriptData(null); 
                setProgress({ percent: 0, text: '' });
                showToast(uiLang === 'vi' ? '🛑 Đã hủy dệt kịch bản.' : '🛑 Aborted.', 'warning'); 
              }} 
                className="px-6 py-4 bg-red-900/50 hover:bg-red-800/50 border border-red-500/50 text-red-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <i className="fa-solid fa-stop" /> {uiLang === 'vi' ? 'HỦY' : 'ABORT'}
              </button>
            )}
          </div>

          {segments.length > 0 && (
            refiningAudio ? (
              <ProgressBar 
                percent={refiningProgress} 
                text={uiLang === 'vi' ? 'Đang tinh chỉnh âm thanh...' : 'Refining audio...'} 
                subText={uiLang === 'vi' ? 'Sóng âm thanh học V16.0' : 'V16.0 Audio Frequencies'}
                colorTheme="purple"
              />
            ) : (
              <button onClick={handleAudioRefining} disabled={loading || refiningAudio}
                className="w-full py-3.5 bg-purple-900/30 hover:bg-purple-800/40 border border-purple-500/30 text-purple-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                <i className="fa-solid fa-headphones-simple" /> <span>{uiLang === 'vi' ? '🎙️ TINH CHỈNH THANH ÂM (V16.0)' : '🎙️ AUDIO RE-ENGINEERING (V16.0)'}</span><span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded font-black">+{audioRefinedCount}</span>
              </button>
            )
          )}
        </div>
      </div>

      {segments.length > 0 && (
        <div className="space-y-4 pb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#12161e] border border-slate-700/30 p-4 rounded-xl">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-500 font-bold">{uiLang === 'vi' ? `Đã tạo: ${segments.length} phân đoạn` : `Generated: ${segments.length} segments`}</span>
              {scriptData?.suggested_watermark && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
                  <i className="fa-solid fa-copyright text-teal-500" /> 
                  <span>Logo Emblem: <strong className="uppercase font-extrabold">{scriptData.suggested_watermark}</strong></span>
                </span>
              )}
              {scriptData?.coppa_disclaimer && (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1.5">
                  <i className="fa-solid fa-shield-halved text-amber-500" /> 
                  <span>{scriptData.coppa_disclaimer}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={exportMasterJson} className="text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(245,158,11,0.4)] shrink-0"><i className="fa-solid fa-file-zipper" /> {uiLang === 'vi' ? 'Xuất Bản Master JSON' : 'Export Master JSON'}</button>
              <button onClick={copyAll} className="text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 bg-white text-black hover:bg-slate-200 transition-colors shrink-0"><i className="fa-solid fa-copy" /> {uiLang === 'vi' ? 'Copy Voice Toàn Bộ' : 'Copy Voice All'}</button>
            </div>
          </div>
          {segments.map((seg, idx) => (
            <SceneCard key={idx} seg={seg} idx={idx} uiLang={uiLang} />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(ScriptModule);