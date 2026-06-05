import React, { useState, useRef } from 'react';
import { callAI } from '../services/aiService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { 
   
  TARGET_MARKETS, 
  VISUAL_STYLES,
  MARKET_STYLE_RECOMMENDATIONS 
} from '../data/constants';
import { 
  buildScriptWriterPrompt,
  buildAudioReengineeringPrompt,
  getStyleRecPrompt
} from '../data/prompts';
import { showToast } from '../components/Toast';
import ProgressBar from '../components/ProgressBar';
import { CURRENT_NICHE } from '../data/nicheConfig';

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

const SceneCard = React.memo(({ seg, idx, uiLang, videoState, onGenerateVideo, secPerSceneNum = 8, durationNum = 1, minSpeedOverride = null, maxSpeedOverride = null }: { seg: any, idx: number, uiLang: 'vi' | 'en', videoState?: { status: string, url?: string, error?: string }, onGenerateVideo?: (idx: number, prompt: string) => void, secPerSceneNum?: number, durationNum?: number, minSpeedOverride?: number | null, maxSpeedOverride?: number | null }) => {
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

          <div className="mt-4 pt-3 border-t border-slate-700/50 flex flex-col gap-2">
            {videoState?.status === 'done' && videoState.url ? (
              <div className="relative rounded-lg overflow-hidden border border-teal-500/30 group">
                <video src={videoState.url} controls className="w-full h-auto aspect-video bg-black object-cover" />
                <div className="absolute top-2 right-2 bg-teal-900/80 text-teal-300 text-[9px] font-bold px-2 py-1 rounded">VEO 3 GENERATED</div>
                <button 
                  onClick={() => onGenerateVideo && onGenerateVideo(idx, seg.video_prompt)}
                  className="absolute bottom-2 right-2 bg-black/60 hover:bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fa-solid fa-rotate-right" /> Render Lại
                </button>
              </div>
            ) : videoState?.status === 'error' ? (
              <div className="bg-red-900/20 border border-red-500/30 p-2 rounded flex flex-col gap-2">
                <div className="text-red-400 text-[10px] font-bold flex items-center gap-1"><i className="fa-solid fa-triangle-exclamation" /> {videoState.error || 'Lỗi API'}</div>
                <button 
                  onClick={() => onGenerateVideo && onGenerateVideo(idx, seg.video_prompt)}
                  className="w-full py-1.5 bg-red-900/50 hover:bg-red-800 border border-red-500/50 text-red-200 font-bold rounded text-[10px] flex items-center justify-center gap-2 transition-all">
                  <i className="fa-solid fa-rotate-right" /> Thử Lại (Retry)
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onGenerateVideo && onGenerateVideo(idx, seg.video_prompt)}
                disabled={videoState?.status === 'loading'}
                className="w-full py-2 bg-teal-900/30 hover:bg-teal-800/40 border border-teal-500/40 text-teal-300 font-bold rounded-lg text-[11px] flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                {videoState?.status === 'loading' ? <><i className="fa-solid fa-spinner animate-spin" /> Đang render (Veo 3)...</> : <><i className="fa-solid fa-film" /> Tạo Video Cảnh Này</>}
              </button>
            )}
          </div>
        </div>
        <div className="bg-[#10141c]/50 p-3 rounded border border-slate-700/30">
          <div className="flex justify-between items-center mb-1">
            <div className="text-[10px] text-teal-400 font-bold flex items-center gap-1"><i className="fa-solid fa-microphone-alt" /> VOICE & DIALOGUE</div>
            <button onClick={() => { 
              const textToCopy = seg.dialogues ? seg.dialogues.map((d: any) => {
                const isNarrator = d.character_name.toLowerCase().includes('dẫn chuyện') || d.character_name.toLowerCase().includes('narrator');
                return isNarrator ? d.line : `[${d.character_name}] ${d.line}`;
              }).join('\n') : (seg.voice_text || '');
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
                  <div className="text-[9px] text-slate-300">
                    {getDynamicSpeed(seg.word_count || seg.voice_text, secPerSceneNum, durationNum, minSpeedOverride, maxSpeedOverride)}
                  </div>
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
                      <span className="text-purple-200 font-mono">{seg.audio_end_time}s</span>
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

export const getDynamicSpeed = (
    textOrCount: string | number | undefined, 
    secPerSceneNum: number = 8,
    durationNum: number = 1,
    minSpeedLimit: number | null = null,
    maxSpeedLimit: number | null = null
  ): string => {
    // Sếp muốn cứng tốc độ theo ý sếp. Nếu sếp nhập MAX, chốt luôn MAX!
    if (maxSpeedLimit !== null && maxSpeedLimit > 0) {
      // Đảm bảo trả về đúng định dạng có x, ví dụ 1.85x, 2.00x
      // Nhưng nếu số nguyên thì bỏ .00 cho gọn (ví dụ 2x)
      return maxSpeedLimit % 1 === 0 ? `${maxSpeedLimit}x` : `${maxSpeedLimit}x`; 
    }

    // Nếu sếp không nhập gì, quay về hệ thống cứng cũ
    if (durationNum < 1) return "1.85x";
    if (durationNum < 3) return "1.75x";
    if (durationNum <= 10) return "1.45x";
    return "1.25x";
  };

interface Props {
  referenceLink?: string;
  segments: any[];
  setSegments: (segs: any[]) => void;
  scriptData: any;
  setScriptData: (data: any) => void;
  onScriptGenerated: (segments: any[], style: string, topic?: string) => void;
  onAudioRefined?: (segments: any[], topic?: string) => void;
  initialTopic?: string;
  uiLang: 'vi' | 'en';
  onNavigateToStudio?: () => void;
  isAdmin: boolean;
  globalSettings: GlobalSettings;
}

export const getDynamicAudioEndTime = (
  textOrCount: string | number | undefined, 
  secPerSceneNum: number = 8,
  durationNum: number = 1,
  minSpeedLimit: number | null = null,
  maxSpeedLimit: number | null = null
): number => {
  let wc = 0;
  if (typeof textOrCount === 'number') {
    wc = textOrCount;
  } else if (typeof textOrCount === 'string') {
    wc = textOrCount.trim().split(/\s+/).filter(w => w.length > 0).length;
  }
  if (!wc) return 6.0;
  
  let speedStr = getDynamicSpeed(wc, secPerSceneNum, durationNum, minSpeedLimit, maxSpeedLimit);
  let speedVal = parseFloat(speedStr.replace('x', ''));
  let baseDuration = wc / 2.8;
  let finalTime = baseDuration / speedVal;
  
  let maxAllowed = secPerSceneNum - 0.5;
  if (finalTime > maxAllowed) finalTime = maxAllowed;
  if (finalTime < 2.0) finalTime = 2.0;
  return Number(finalTime.toFixed(1));
};

const ScriptModule: React.FC<Props> = ({ referenceLink = '', segments, setSegments, scriptData, setScriptData, onScriptGenerated, onAudioRefined, initialTopic = '', uiLang, onNavigateToStudio, isAdmin, globalSettings }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [duration, setDuration] = useState<number | string>(1);
  const [secondsPerScene, setSecondsPerScene] = useState<number | string>(8);
  const [market, setMarket] = useState('vn_dharma');
  const [style, setStyle] = useState('auto');
  const [dharmaTopic, setDharmaTopic] = useState('karma');
  const [loading, setLoading] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftOutline, setDraftOutline] = useState('');
  const [showDraftSection, setShowDraftSection] = useState(true);
  const [adminMinInput, setAdminMinInput] = useState<string>('');
  const [adminMaxInput, setAdminMaxInput] = useState<string>('');
  const [suggestedStyle, setSuggestedStyle] = useState<any>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [refiningAudio, setRefiningAudio] = useState(false);
  const [refiningProgress, setRefiningProgress] = useState(0);
  const [audioRefinedCount, setAudioRefinedCount] = useState(0);
  const [speakerMode, setSpeakerMode] = useState<'multi' | 'single' | 'asmr'>('single');
  const [progress, setProgress] = useState({ percent: 0, text: '' });
  
  // Video Generation States
  const [videoStatus, setVideoStatus] = useState<Record<number, { status: 'idle'|'loading'|'done'|'error', url?: string, error?: string }>>({});
  const [isAutoPilotActive, setIsAutoPilotActive] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState('16:9');
  const [videoModel, setVideoModel] = useState('Veo 3.1 - Quality');
  const [videoDuration, setVideoDuration] = useState('x2');
  const [isStitching, setIsStitching] = useState(false);
  const [stitchedVideoUrl, setStitchedVideoUrl] = useState<string | null>(null);

  const abortRef = useRef(false);

  const t = translations[uiLang];
  const loadingMessages = uiLang === 'vi' ? 
    ["Đang phân tích triết lý...", "Đang thiết lập bộ lọc tôn nghiêm...", "Đang dệt hội thoại tĩnh tại...", "Đang tinh chỉnh nhịp độ (Pacing)..."] :
    ["Analyzing philosophy...", "Setting solemn filters...", "Weaving peaceful dialogues...", "Refining pacing..."];

  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const videoStatusRef = useRef<Record<number, { status: 'idle'|'loading'|'done'|'error', url?: string, error?: string }>>({});

  React.useEffect(() => {
    videoStatusRef.current = videoStatus;
  }, [videoStatus]);

  React.useEffect(() => {
    const handleExtensionMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      const data = event.data;
      if (data?.source === 'VKT_EXTENSION') {
        if (data.action === 'TASK_DONE' && data.videoUrl) {
          setVideoStatus(prev => {
            const keys = Object.keys(prev).map(Number).sort((a, b) => a - b);
            const pendingIdx = keys.find(k => prev[k]?.status === 'loading' && !prev[k]?.url);
            if (pendingIdx !== undefined) {
              return { ...prev, [pendingIdx]: { status: 'done', url: data.videoUrl } };
            }
            return prev;
          });
          showToast(`Đã nhận 1 Video mới từ Extension!`, 'success');
        } else if (data.action === 'TASK_ERROR') {
          setVideoStatus(prev => {
            const keys = Object.keys(prev).map(Number).sort((a, b) => a - b);
            const pendingIdx = keys.find(k => prev[k]?.status === 'loading' && !prev[k]?.url);
            if (pendingIdx !== undefined) {
              return { ...prev, [pendingIdx]: { status: 'error', error: data.error } };
            }
            return prev;
          });
        }
      }
    };
    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, []);

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
  
  let defaultMin = 1.15;
  let defaultMax = 1.70;
  let currentTier: 'tier1' | 'tier2' | 'tier3' | 'tier4' = 'tier4';
  let currentTierName = '> 10 phút';

  if (durationNum < 1) { 
    defaultMin = 1.25; defaultMax = 2.00; 
    currentTier = 'tier1'; currentTierName = '< 1 phút';
  }
  else if (durationNum < 3) { 
    defaultMin = 1.15; defaultMax = 1.85; 
    currentTier = 'tier2'; currentTierName = '1 - 3 phút';
  }
  else if (durationNum <= 10) { 
    defaultMin = 1.10; defaultMax = 1.70; 
    currentTier = 'tier3'; currentTierName = '3 - 10 phút';
  }

  const parsedMin = globalSettings.speedOverrides?.[currentTier]?.min ?? null;
  const parsedMax = globalSettings.speedOverrides?.[currentTier]?.max ?? null;

  const displayMin = adminMinInput || (parsedMin !== null ? String(parsedMin) : String(defaultMin));
  const displayMax = adminMaxInput || (parsedMax !== null ? String(parsedMax) : String(defaultMax));
  
  const currentMinSpeedToUse = parseFloat(displayMin) || defaultMin;
  const currentMaxSpeedToUse = parseFloat(displayMax) || defaultMax;
  const mode = durationNum < 3 ? { name: '🟢 QUICK CRAFT (<3m)', wpm: 260 } : durationNum <= 10 ? { name: '🔵 STORY WEAVER (3-10m)', wpm: 250 } : { name: '🟣 EPIC FOLKLORE (>10m)', wpm: 240 };
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

  
  const handleGenerateDraft = async () => {
    if (!topic) return showToast(uiLang === 'vi' ? 'Vui lòng nhập chủ đề!' : 'Please enter a topic!');
    const { hasAnyApiKey } = await import('../services/aiService');
    if (!hasAnyApiKey()) {
      showToast(uiLang === 'vi' ? 'Chưa cấu hình API Key!' : 'No API Key configured!', 'error');
      return;
    }
    setIsDrafting(true);
    try {
      const { SYSTEM_PROMPT_DRAFT_WRITER } = await import('../data/prompts');
      const mk = TARGET_MARKETS[market] || TARGET_MARKETS['vn_dharma'];
      const randomSeed = Math.floor(Math.random() * 100000);
      let prompt = `TOPIC: "${topic}"\nDURATION: ${duration} minutes\nSCENES: ${Math.ceil((Math.max(0.1, durationNum) * 60) / secPerSceneNum)} scenes\nTARGET_MARKET: ${mk.name} (${mk.voice_lang})\nRANDOM_SEED: ${randomSeed} (Ensure this output is completely unique)\n`;
      if (duration <= 1) {
        prompt += `\nCRITICAL RULE FOR SHORT VIDEO (<= 1 min): Cảnh cuối cùng BẮT BUỘC phải viết tóm tắt nội dung nối tiếp thành MỘT VÒNG LẶP VÔ HẠN ghép khít 100% với Cảnh 1.`;
      } else {
        prompt += `\nCRITICAL RULE FOR LONG VIDEO (> 1 min): Cảnh cuối cùng BẮT BUỘC phải dành để đúc kết và Tóm tắt cho câu chốt 38 từ của thương hiệu ("Dừng lại giữa dòng để giữ cho mình một khoảng tĩnh lặng... Hôm nay hạt giống thiện lành nào sẽ được bạn gieo xuống?").`;
      }
      if (referenceLink) {
        prompt += `\nREFERENCE_LINK: ${referenceLink} (Adapt the core concepts/hooks of this link into our niche)`;
      }
      const draftResult = await callAI(prompt, SYSTEM_PROMPT_DRAFT_WRITER);
      setDraftOutline(draftResult.draft || draftResult.text || (typeof draftResult === 'string' ? draftResult : JSON.stringify(draftResult, null, 2)));
      showToast(uiLang === 'vi' ? 'Đã tạo xong kịch bản thô!' : 'Rough draft generated!', 'success');
    } catch (e: any) {
      if (e.rawText) {
        setDraftOutline(e.rawText);
        showToast(uiLang === 'vi' ? 'Đã tạo xong kịch bản thô!' : 'Rough draft generated!', 'success');
      } else {
        showToast(`Lỗi: ${e.message}`, 'error');
      }
    } finally {
      setIsDrafting(false);
    }
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

    // UX Hard Limit: Apply maxDuration from globalSettings
    let targetDuration = duration;
    const maxAllowed = globalSettings.maxDuration;
    
    if (targetDuration > maxAllowed) {
      targetDuration = maxAllowed;
      setDuration(maxAllowed);
      showToast(uiLang === 'vi' 
        ? `⚠️ Hệ thống giới hạn tối đa ${maxAllowed} phút cho tài khoản của bạn!`
        : `⚠️ System locked to ${maxAllowed} minutes maximum for your account!`, 'warning');
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
      if (styleObj?.prompt_enforce) {
        styleContext += ` (CRITICAL VISUAL/MATERIAL RULES: ${styleObj.prompt_enforce})`;
      } else if (styleObj?.desc) {
        styleContext += ` (Material/Visual Requirements: ${styleObj.desc})`;
      }
      const topicObj = DHARMA_TOPICS.find(t => t.id === dharmaTopic);
      const contexts = MICRO_CONTEXTS[dharmaTopic] || ['Trong chánh niệm'];
      const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
      styleContext += ` - DHARMA TOPIC: ${topicObj?.label}. MICRO-CONTEXT (CRITICAL): ${randomContext}.`;

      // 1. Calculate the total requested scenes
      const totalScenes = Math.ceil((Math.max(0.1, targetDuration) * 60) / secPerSceneNum);
      
      // 2. Define safe chunk size: 25 scenes per API call
      const chunkSize = 10;
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
${JSON.stringify(lastFew.map(s => ({ scene_number: s.scene_number, voice_text: s.voice_text, visual_desc_vi: s.visual_desc_vi })))}
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
- The main and ONLY character/narrator MUST be "${CURRENT_NICHE.characterVoiceProfile.speaker}".
- The entire video script MUST be written for only ONE single character/narrator from the first scene to the last scene.
- The 'character' name and 'voice_profile.speaker' MUST be "${CURRENT_NICHE.characterVoiceProfile.speaker}" across all scenes. Do NOT introduce multiple characters.
- OVERRIDE the rule that says "Tuyệt đối cấm chỉ để 1 narrator nói suốt từ đầu đến cuối" or "ĐA NHÂN VẬT THAY PHIÊN" in the system prompt. Instead, keep a single voice speaking from beginning to end.`
          : `\n[SPEAKER MODE - MULTI-CHARACTER DIALOGUE ACTIVE]:
- The main character MUST be "${CURRENT_NICHE.characterVoiceProfile.speaker}".
- The script MUST feature AT LEAST 3 DIFFERENT CHARACTERS (e.g., The Main Character, a secondary character, a guest) taking turns speaking across different scenes to create a rich dialogue or alternating storytelling.
- Ensure different scenes use appropriate characters from the story. NEVER stick to just 1 or 2 characters. OVERRIDE any tendency to write a monologue.`;

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
            json = await callAI(prompt, buildScriptWriterPrompt(undefined, targetDuration, secPerSceneNum, totalScenes, parseFloat(displayMax)));
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
          if (styleObj?.id === 'auto' && json.suggested_style) {
            finalSuggestedStyle = json.suggested_style;
          }
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
          
          if (s.voice_text) s.voice_text = s.voice_text.replace(/[\n\r]+/g, ' ').trim();
          if (s.dialogues) {
            s.dialogues = s.dialogues.map((d: any) => ({
              ...d,
              line: d.line ? d.line.replace(/[\n\r]+/g, ' ').trim() : ''
            }));
          }

          const textToCount = s.voice_text || (s.dialogues && s.dialogues[0] ? s.dialogues[0].line : '');
          const realWc = textToCount ? textToCount.trim().split(/\s+/).filter((w: string) => w.length > 0).length : 1;
          s.word_count = realWc;
          s.audio_end_time = getDynamicAudioEndTime(realWc, secPerSceneNum, durationNum, currentMinSpeedToUse, currentMaxSpeedToUse);
          if (s.voice_profile) {
            s.voice_profile.pacing_speed = getDynamicSpeed(realWc, secPerSceneNum, durationNum, currentMinSpeedToUse, currentMaxSpeedToUse);
          }
          
          return {
            ...s,
            scene_number: s.scene_number || calculatedNum,
            time: s.time || `${formatTime(min, secStart)} - ${formatTime(minEnd, secEnd)}`,
          };
        });
        // Apply visual style prompt enforce
        let enforce = '';
        if (styleObj && styleObj.id !== 'auto') enforce = styleObj.prompt_enforce;

        const NEGATIVE_PROMPT = "--no DECAPITATED, MUTATED, EXTRA LIMBS, TEXT, WATERMARK --ar 9:16";

        if (enforce) {
          roundSegs = roundSegs.map((s: any) => {
            const processPrompt = (prompt: string | undefined) => {
              if (!prompt) return '';
              if (prompt.includes('Visual Style:')) return prompt;
              
              let clean = prompt;
              let params = '';
              const match = prompt.match(/(--(?:no|ar|v|style|stylize)\s+.*)/i);
              if (match) {
                params = match[0];
                clean = prompt.substring(0, match.index).trim();
              }
              clean = clean.replace(/,+$/, '').trim();
              
              return `${clean} ${enforce} ${params} ${NEGATIVE_PROMPT}`.trim();
            };
            return {
              ...s,
              video_prompt: processPrompt(s.video_prompt),
              image_prompt: processPrompt(s.image_prompt),
            };
          });
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
    const removeVietnameseTones = (str: string) => {
      return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    };
    const cleanTopic = topic.replace(/^【.*?】\s*/, '').trim();
    const cleanTopicNoTones = removeVietnameseTones(cleanTopic);
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}_${today.getHours().toString().padStart(2, '0')}h${today.getMinutes().toString().padStart(2, '0')}m${today.getSeconds().toString().padStart(2, '0')}s`;
    const prefix = `【 ${durationNum} PHUT - ${dateStr} 】`;
    const finalTopic = `${prefix} ${cleanTopicNoTones}`;
    
    const masterPackage = {
      project_name: finalTopic,
      export_version: 'V16.0',
      market,
      duration_minutes: durationNum,
      seconds_per_scene: secPerSceneNum,
      timestamp: new Date().toISOString(),
      scriptData,
      segments: segments.map((seg, idx) => ({
        ...seg,
        voice_profile: seg.voice_profile ? {
          ...seg.voice_profile,
          pacing_speed: getDynamicSpeed(seg.word_count || seg.voice_text, secPerSceneNum, durationNum, currentMinSpeedToUse, currentMaxSpeedToUse)
        } : seg.voice_profile,
        generated_video_url: videoStatus[idx]?.status === 'done' ? videoStatus[idx].url : null
      }))
    };
    const blob = new Blob([JSON.stringify(masterPackage)], { type: 'application/json' });
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

      const chunkSize = 10;
      const totalRounds = Math.ceil(payload.length / chunkSize);
      let allRefinedSegments: any[] = [];
      
      for (let round = 1; round <= totalRounds; round++) {
        const startIdx = (round - 1) * chunkSize;
        const endIdx = Math.min(round * chunkSize, payload.length);
        const chunkPayload = payload.slice(startIdx, endIdx);
        
        const prompt = `KỊCH BẢN GỐC (Đợt ${round}/${totalRounds} - ${chunkPayload.length} scenes):\n${JSON.stringify(chunkPayload)}\n\nTINH CHỈNH THANH ÂM CHO ĐỢT ${round} CỦA KỊCH BẢN NÀY.${refinedInstructions}\nRESPOND IN ${uiLang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.`;
        
        let res: any = null;
        let retries = 3;
        while (retries > 0) {
          try {
            res = await callAI(prompt, buildAudioReengineeringPrompt(undefined, durationNum));
            break;
          } catch (err: any) {
            retries--;
            if (retries === 0) throw err;
            await new Promise(r => setTimeout(r, 5000));
          }
        }

        if (res?.refined_scenes) {
          allRefinedSegments = [...allRefinedSegments, ...res.refined_scenes];
        } else if (Array.isArray(res)) {
          allRefinedSegments = [...allRefinedSegments, ...res];
        } else {
          throw new Error('Invalid AI Response Structure');
        }
        
        if (round < totalRounds) {
          await new Promise(r => setTimeout(r, 5000));
        }
      }

      if (allRefinedSegments.length > 0) {
        // Enforce math calculation for pacing_speed in reengineered json
        allRefinedSegments = allRefinedSegments.map((s: any) => {
          if (s.voice_profile) {
            s.voice_profile.pacing_speed = getDynamicSpeed(s.word_count || s.voice_text, secPerSceneNum, durationNum, currentMinSpeedToUse, currentMaxSpeedToUse);
          }
          return s;
        });

        const newSegments = segments.map((original, idx) => {
          const refined = allRefinedSegments.find((r: any) => r.scene_number === original.scene_number) || allRefinedSegments[idx];
          if (!refined) return original;
          const finalVoiceText = refined.voice_text || original.voice_text;
          const finalWordCount = finalVoiceText ? finalVoiceText.trim().split(/\s+/).filter((w: string) => w.length > 0).length : original.word_count;
          const finalVoiceProfile = refined.voice_profile || original.voice_profile;
          if (finalVoiceProfile) {
            finalVoiceProfile.pacing_speed = getDynamicSpeed(finalWordCount, secPerSceneNum, durationNum, currentMinSpeedToUse, currentMaxSpeedToUse);
          }
          return { 
            ...original, 
            voice_text: finalVoiceText, 
            word_count: finalWordCount,
            voice_profile: finalVoiceProfile, 
            dialogues: refined.dialogues || original.dialogues, 
            sfx_music_suggestion: refined.sfx_music_suggestion || original.sfx_music_suggestion 
          };
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
    } catch (e: any) { showToast(`Audio Error: ${e.message}`, 'error'); }
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
        let importedSegments = null;
        if (data.segments) {
          importedSegments = data.segments;
        } else if (data.chunks && Array.isArray(data.chunks)) {
          importedSegments = data.chunks.flatMap((chunk: any) => chunk.data || []);
        }

        if (importedSegments && importedSegments.length > 0) {
          setTopic(data.project_name || data.topic || '');
          setSegments(importedSegments);
          if (data.duration_minutes) setDuration(data.duration_minutes);
          if (data.seconds_per_scene) setSecondsPerScene(data.seconds_per_scene);
          if (data.market) setMarket(data.market);
          if (data.scriptData) setScriptData(data.scriptData);
          
          onScriptGenerated(importedSegments, 'auto', data.project_name || data.topic || '');
          showToast(uiLang === 'vi' ? 'Đã khôi phục Kịch bản!' : 'Script Restored!', 'success');
        } else {
          showToast(uiLang === 'vi' ? 'File JSON không hợp lệ!' : 'Invalid JSON format!', 'error');
        }
      } catch (err) { showToast('Error reading file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleGenerateVideo = async (idx: number, prompt: string) => {
    try {
      setVideoStatus(prev => ({ ...prev, [idx]: { status: 'loading' } }));
      
      const { generateVideo } = await import('../services/aiService');
      const url = await generateVideo(prompt, videoAspectRatio, videoModel, videoDuration, idx);
      
      setVideoStatus(prev => ({ ...prev, [idx]: { status: 'done', url } }));
      showToast(`Đã tạo xong Video cho Cảnh ${idx + 1}`, 'success');
    } catch (e: any) {
      setVideoStatus(prev => ({ ...prev, [idx]: { status: 'error', error: e.message } }));
      showToast(`Lỗi tạo Video cảnh ${idx + 1}: ${e.message}`, 'error');
    }
  };

  const handleAutoPilot = async () => {
    if (segments.length === 0) return;
    setIsAutoPilotActive(true);
    showToast('🚀 Đang đóng gói kịch bản gửi sang VKT Extension...', 'success');
    
    // Set all pending to loading
    const newStatus: any = { ...videoStatus };
    segments.forEach((_, i) => {
      if (newStatus[i]?.status !== 'done') {
        newStatus[i] = { status: 'loading' };
      }
    });
    setVideoStatus(newStatus);

    const prompts = segments.filter((_, i) => newStatus[i]?.status !== 'done')
                            .map(seg => seg.video_prompt || seg.visual_desc || 'Buddhist story scene');
    
    window.postMessage({
      source: 'VKT_STUDIO',
      action: 'SEND_PROMPTS',
      payload: {
        prompts,
        config: {
          videoModel,
          videoAspectRatio,
          videoDuration,
          minDelay: 10,
          maxDelay: 20
        }
      }
    }, '*');
    
    const confirmHandler = (event: MessageEvent) => {
      if (event.source !== window) return;
      if (event.data?.source === 'VKT_EXTENSION' && event.data?.action === 'PROMPTS_RECEIVED') {
        if (event.data.status === 'success') {
          showToast('✅ Đã gửi kịch bản thành công! Extension đang chạy ngầm.', 'success');
        } else {
          showToast('❌ Gửi kịch bản thất bại.', 'error');
          setIsAutoPilotActive(false);
        }
        window.removeEventListener('message', confirmHandler);
      }
    };
    window.addEventListener('message', confirmHandler);
    
    setTimeout(() => {
      window.removeEventListener('message', confirmHandler);
      setIsAutoPilotActive(false);
    }, 5000);
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
                  setDraftOutline('');
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
                    const maxAllowed = globalSettings.maxDuration;
                    
                    if (num > maxAllowed) {
                      showToast(uiLang === 'vi' 
                        ? `⚠️ Giới hạn thời lượng cho tài khoản này là ${maxAllowed} phút!` 
                        : `⚠️ Maximum duration for this account is ${maxAllowed} minutes!`, 'warning');
                      setDuration(maxAllowed);
                    } else {
                      setDuration(num);
                    }
                  }}
                  onBlur={e => {
                    const num = parseFloat(e.target.value);
                    const maxAllowed = globalSettings.maxDuration;
                    if (isNaN(num) || num < 0.5) {
                      setDuration(1);
                    } else if (num > maxAllowed) {
                      setDuration(maxAllowed);
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
                {isAdmin && globalSettings.enableAdminSpeedOverride && (
                  <div className="flex flex-col gap-1 ml-2 bg-pink-900/10 p-2 rounded border border-pink-700/30">
                    <div className="text-[9px] text-pink-400 font-bold uppercase mb-1">
                      Ngăn: {currentTierName} | Mặc định: {defaultMin}x - {defaultMax}x
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex flex-col gap-1 w-16">
                        <label className="text-[9px] text-pink-400 font-bold">MIN SPD:</label>
                        <input 
                          type="number" step={0.05} value={displayMin} onChange={e => setAdminMinInput(e.target.value)}
                          className="w-full bg-[#0a0e14] border border-pink-700/50 rounded p-1 text-xs font-bold text-pink-300 text-center outline-none" 
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-16">
                        <label className="text-[9px] text-pink-400 font-bold">MAX SPD:</label>
                        <input 
                          type="number" step={0.05} value={displayMax} onChange={e => setAdminMaxInput(e.target.value)}
                          className="w-full bg-[#0a0e14] border border-pink-700/50 rounded p-1 text-xs font-bold text-pink-300 text-center outline-none" 
                        />
                      </div>
                      <div className="flex flex-col gap-1 ml-1">
                        <button 
                          onClick={async () => {
                            let min = adminMinInput ? parseFloat(adminMinInput) : defaultMin;
                            let max = adminMaxInput ? parseFloat(adminMaxInput) : defaultMax;
                            if (min < 0.8) min = 0.8;
                            if (max > 2.5) max = 2.5;
                            if (min > max) { const temp = min; min = max; max = temp; }
                            
                            const newOverrides = { ...(globalSettings.speedOverrides || {
                              tier1: { min: null, max: null },
                              tier2: { min: null, max: null },
                              tier3: { min: null, max: null },
                              tier4: { min: null, max: null }
                            }) };
                            
                            newOverrides[currentTier] = { min, max };
                            
                            const newSettings = { ...globalSettings, speedOverrides: newOverrides };
                            await setDoc(doc(db, 'dharma_settings', 'global_config'), newSettings);
                            setAdminMinInput('');
                            setAdminMaxInput('');
                            showToast(`Đã ép tốc độ cho Ngăn ${currentTierName}!`, 'success');
                          }}
                          className="px-2 py-1 bg-pink-600/20 hover:bg-pink-600/40 text-pink-400 rounded text-[10px] font-bold transition-colors"
                        >
                          <i className="fa-solid fa-cloud-arrow-up"></i> Lưu
                        </button>
                        <button 
                          onClick={async () => {
                            const newOverrides = { ...(globalSettings.speedOverrides || {
                              tier1: { min: null, max: null },
                              tier2: { min: null, max: null },
                              tier3: { min: null, max: null },
                              tier4: { min: null, max: null }
                            }) };
                            
                            newOverrides[currentTier] = { min: null, max: null };
                            
                            const newSettings = { ...globalSettings, speedOverrides: newOverrides };
                            await setDoc(doc(db, 'dharma_settings', 'global_config'), newSettings);
                            setAdminMinInput('');
                            setAdminMaxInput('');
                            showToast(`Đã khôi phục tốc độ Auto cho Ngăn ${currentTierName}!`, 'success');
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded text-[10px] font-bold transition-colors mt-1"
                        >
                          <i className="fa-solid fa-rotate-left"></i> Xả
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
              {VISUAL_STYLES.filter(s => globalSettings.allowedStyles.includes(s.id)).map(s => {
                const isRecommended = MARKET_STYLE_RECOMMENDATIONS[market]?.includes(s.id);
                return (
                  <div 
                    key={s.id} 
                    onClick={() => setStyle(s.id)}
                    className={`relative cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      style === s.id 
                        ? 'bg-pink-900/40 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)] text-white' 
                        : isRecommended
                          ? 'bg-[#1a1610] border-amber-500/50 hover:border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,166,35,0.1)]'
                          : 'bg-[#0a0e14] border-slate-700/50 hover:border-slate-500 text-slate-500 opacity-60'
                    }`}
                    title={s.desc}
                  >
                    {isRecommended && style !== s.id && (
                      <div className="absolute -top-2 text-[9px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded shadow-lg">⭐ Đề Xuất</div>
                    )}
                    <div className="text-xs font-bold leading-tight">{s.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

                    {showDraftSection && (
            <div className="bg-[#0a0e14]/50 rounded-xl p-5 border border-amber-500/30 mb-6">
              <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2 uppercase">
                <i className="fa-solid fa-wand-magic-sparkles" /> BƯỚC 1: Dàn Ý Thô (Slot Machine)
              </h3>
              
              {referenceLink && (
                <div className="mb-4 bg-teal-900/20 p-3 rounded-lg border border-teal-500/30 text-xs text-teal-300">
                  <i className="fa-solid fa-link" /> <span className="font-bold">Đã nhận Link đối thủ:</span> Sườn thô sẽ được xào nấu lại từ nội dung gốc.
                </div>
              )}

              <button 
                onClick={handleGenerateDraft} 
                disabled={isDrafting}
                className="w-full py-4 mb-4 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50"
              >
                {isDrafting ? <><i className="fa-solid fa-sync animate-spin" /> ĐANG QUAY LÔ TÔ...</> : <><i className="fa-solid fa-dice" /> QUAY LÔ TÔ (GỢI Ý KỊCH BẢN MỚI)</>}
              </button>

              {draftOutline && (
                <div className="space-y-3 animate-[fadeIn_0.3s_ease-out]">
                  <label className="text-xs font-bold text-slate-300">Bạn có thể sửa sườn thô dưới đây trước khi Xuất Kịch Bản:</label>
                  <textarea 
                    value={draftOutline}
                    onChange={e => setDraftOutline(e.target.value)}
                    className="w-full h-48 bg-[#12161e] border border-amber-500/30 rounded-xl p-4 text-sm text-slate-200 outline-none focus:border-amber-500/60 leading-relaxed"
                  />
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(draftOutline);
                        showToast(uiLang === 'vi' ? 'Đã copy sườn thô!' : 'Draft copied!', 'success');
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-600 transition-colors flex items-center gap-1"
                    >
                      <i className="fa-regular fa-copy" /> COPY
                    </button>
                    <button 
                      onClick={() => {
                        const blob = new Blob([draftOutline], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `VKT_Draft_${topic.replace(/\s+/g, '_').substring(0, 20)}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                        showToast(uiLang === 'vi' ? 'Đã tải sườn thô (.txt)' : 'Draft downloaded!', 'success');
                      }}
                      className="px-3 py-1.5 bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 text-xs font-bold rounded-lg border border-blue-500/30 transition-colors flex items-center gap-1"
                    >
                      <i className="fa-solid fa-download" /> TẢI XUỐNG
                    </button>
                    <label className="px-3 py-1.5 bg-amber-900/40 hover:bg-amber-800/60 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/30 transition-colors cursor-pointer flex items-center gap-1">
                      <i className="fa-solid fa-upload" /> TẢI LÊN LẠI (.TXT)
                      <input 
                        type="file" 
                        accept=".txt" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setDraftOutline(event.target?.result as string);
                            showToast(uiLang === 'vi' ? 'Đã khôi phục sườn thô!' : 'Draft restored!', 'success');
                          };
                          reader.readAsText(file);
                          e.target.value = '';
                        }} 
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700/50 mb-4">
            <h3 className="text-sm font-bold text-teal-400 uppercase">
              <i className="fa-solid fa-film" /> BƯỚC 2: SẢN XUẤT CHI TIẾT
            </h3>
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

          {segments.length > 0 && globalSettings.enableAudioRefinement !== false && (
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
          </div>
          {segments.map((seg, idx) => (
            <SceneCard 
              key={idx} 
              seg={seg} 
              idx={idx} 
              uiLang={uiLang} 
              videoState={videoStatus[idx]} 
              onGenerateVideo={handleGenerateVideo}
              secPerSceneNum={secPerSceneNum}
              durationNum={durationNum}
              minSpeedOverride={currentMinSpeedToUse}
              maxSpeedOverride={currentMaxSpeedToUse}
            />
          ))}
        </div>
      )}
      
      {/* AutoPilot & FFmpeg Controls */}
      {segments.length > 0 && (
        <div className="bg-[#12161e] border border-teal-500/50 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(20,184,166,0.15)] space-y-4">
          <div className="flex items-center gap-2 text-teal-400 font-bold uppercase mb-2"><i className="fa-solid fa-sliders" /> CẤU HÌNH RENDER (VEO 3)</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-[#0a0e14] border border-slate-700/50 p-3 rounded-lg">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">TỈ LỆ KHUNG HÌNH (ASPECT RATIO)</label>
              <select value={videoAspectRatio} onChange={(e) => setVideoAspectRatio(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none">
                <option className="bg-slate-800 text-white" value="16:9">16:9 (Video Dài / Youtube Ngang)</option>
                <option className="bg-slate-800 text-white" value="9:16">9:16 (Shorts / Tiktok / Reels)</option>
                <option className="bg-slate-800 text-white" value="1:1">1:1 (Video Vuông / Facebook)</option>
              </select>
            </div>
            <div className="bg-[#0a0e14] border border-slate-700/50 p-3 rounded-lg">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">MODEL VEO 3</label>
              <select value={videoModel} onChange={(e) => setVideoModel(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none">
                <option className="bg-slate-800 text-white" value="Veo 3.1 - Quality">Veo 3.1 - Quality</option>
                <option className="bg-slate-800 text-white" value="Omni Flash">Omni Flash</option>
              </select>
            </div>
            <div className="bg-[#0a0e14] border border-slate-700/50 p-3 rounded-lg">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">THỜI LƯỢNG (DURATION)</label>
              <select value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none">
                <option className="bg-slate-800 text-white" value="x1">x1 (Tiêu chuẩn)</option>
                <option className="bg-slate-800 text-white" value="x2">x2 (Dài hơn)</option>
                <option className="bg-slate-800 text-white" value="x3">x3 (Siêu dài)</option>
                <option className="bg-slate-800 text-white" value="x4">x4 (Kéo dài tối đa)</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 pt-2 border-t border-teal-900/50">
            <button 
              onClick={handleAutoPilot}
              disabled={isAutoPilotActive || isStitching}
              className="flex-1 py-4 bg-teal-900/50 hover:bg-teal-800/60 border border-teal-500 text-teal-100 font-bold rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50">
              {isAutoPilotActive ? (
                <><i className="fa-solid fa-rocket animate-bounce" /> ĐANG TỰ ĐỘNG SẢN XUẤT VIDEO...</>
              ) : (
                <><i className="fa-solid fa-rocket" /> 🚀 TỰ ĐỘNG SẢN XUẤT TOÀN BỘ VIDEO (VEO 3)</>
              )}
            </button>
            <button 
              onClick={() => { /* FFmpeg Stitching placeholder */ }}
              disabled={isAutoPilotActive || isStitching}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-500 hover:opacity-90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              {isStitching ? <><i className="fa-solid fa-spinner animate-spin" /> Đang Ghép...</> : <><i className="fa-solid fa-film" /> 🎞️ XUẤT VIDEO TỔNG</>}
            </button>
          </div>
          {stitchedVideoUrl && (
             <div className="mt-4 p-4 bg-black rounded-xl border border-amber-500/30">
               <div className="text-amber-400 font-bold text-sm mb-2 text-center"><i className="fa-solid fa-circle-check" /> VIDEO HOÀN CHỈNH ĐÃ SẴN SÀNG!</div>
               <video src={stitchedVideoUrl} controls className="w-full max-w-2xl mx-auto rounded border border-slate-700" />
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(ScriptModule);