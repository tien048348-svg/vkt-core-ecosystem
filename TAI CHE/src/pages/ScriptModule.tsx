import React, { useState } from 'react';
import { callAI } from '../services/aiService';
import { SYSTEM_PROMPT_SCRIPT_WRITER, SYSTEM_PROMPT_AUDIO_REENGINEERING } from '../data/prompts';
import { TARGET_MARKETS, VISUAL_STYLES, } from '../data/constants';
import { showToast } from '../components/Toast';
import ProgressBar from '../components/ProgressBar';
import type { GlobalSettings } from '../App';

interface ScriptModuleProps {
  segments: any[];
  setSegments: (segs: any[]) => void;
  scriptData: any;
  setScriptData: (data: any) => void;
  onScriptGenerated: (segs: any[], style: string, topic?: string) => void;
  onAudioRefined: (segs: any[], topic?: string) => void;
  initialTopic?: string;
  onNavigateToStudio: () => void;
  globalSettings: GlobalSettings;
  uiLang?: 'vi' | 'en';
  isAdmin?: boolean;
}

// ==================================================================================
// MARKET-STYLE RECOMMENDED MAPPING & VIETNAMESE STYLE SPECIFIER
// ==================================================================================
const MARKET_STYLE_RECOMMENDATIONS: Record<string, string[]> = {
  vn_recycle: ['hybrid_multimaterial', 'dong_ho_folk', 'water_puppet', 'stop_motion_papercraft', 'popup_cardboard', 'nature_debris', 'hybrid_folk_automata', 'fabric_collage', 'plastic_mosaic'],
  vn_kids: ['hybrid_multimaterial', 'stop_motion_papercraft', 'popup_cardboard', 'button_string', 'egg_carton_clay'],
  us_diy: ['hybrid_multimaterial', 'stop_motion_papercraft', 'popup_cardboard', 'nature_debris', 'metal_can_origami', 'driftwood_twig', 'cardboard_gears'],
  jp_craft: ['hybrid_multimaterial', 'metal_can_origami', 'egg_carton_clay', 'button_string', 'cardboard_gears', 'driftwood_twig'],
  kr_eco: ['hybrid_multimaterial', 'egg_carton_clay', 'fabric_collage', 'nature_debris', 'driftwood_twig'],
  global_eco: ['hybrid_multimaterial', 'stop_motion_papercraft', 'popup_cardboard', 'nature_debris', 'metal_can_origami']
};

const isVietnameseStyle = (id: string) => ['dong_ho_folk', 'water_puppet', 'hybrid_folk_automata'].includes(id);

// ==================================================================================
// STYLE RECOMMENDATION ENGINE — AI Brain Core
// ⚠️ KHI CLONE NGÁCH MỚI: Cập nhật danh sách styles bên dưới theo ngách của bạn
// Mapping: style_id → loại chủ đề phù hợp → ví dụ chủ đề cụ thể
// ==================================================================================
const STYLE_RECOMMENDATION_PROMPT = `
BẠN LÀ CHUYÊN GIA ĐỀ XUẤT PHONG CÁCH NGHỆ THUẬT TÁI CHẾ.

Dựa trên chủ đề được cung cấp, hãy phân tích và đề xuất phong cách visual phù hợp nhất.

CÁC PHONG CÁCH CÓ SẴN:
1. "stop_motion_papercraft" — Stop-Motion Papercraft: Phù hợp cảnh cung điện, chuyển động phức tạp. VD: Tấm Cám, Thạch Sanh.
2. "dong_ho_folk" — Đông Hồ Folk Art: Phù hợp chủ đề dân gian, nông thôn Việt Nam cổ xưa. VD: Trạng Quỳnh, Thánh Gióng.
3. "water_puppet" — Múa Rối Nước: Phù hợp sông ngòi, biển cả, thần thoại dưới nước. VD: Sự Tích Hồ Gươm, Sơn Tinh Thủy Tinh.
4. "plastic_mosaic" — Plastic Mosaic: Phù hợp sinh vật kỳ vĩ, thần thoại bằng nắp chai, mảnh nhựa màu. VD: Con Rồng Cháu Tiên, Lạc Long Quân.
5. "fabric_collage" — Fabric Collage: Phù hợp câu chuyện gia đình ấm áp, nhân văn, tình cảm. VD: Sự Tích Trầu Cau, Cây Vú Sữa.
6. "popup_cardboard" — Pop-up Cardboard: Phù hợp sách nổi 3D, kiến trúc hoành tráng. VD: Mai An Tiêm, Thạch Sanh dựng thành.
7. "nature_debris" — Lá Khô & Hạt: Phù hợp bối cảnh rừng núi nguyên sơ, thiên nhiên hoang dã. VD: Cây Tre Trăm Đốt.
8. "metal_can_origami" — Metal Can Origami: Phù hợp tạo hình giáp sắt, vũ khí, kim loại dập nổi từ vỏ lon nước ngọt. VD: Thánh Gióng mặc giáp sắt.
9. "egg_carton_clay" — Egg Carton Clay: Phù hợp tượng đất thô ráp, hang động cổ xưa, quái thú. VD: Thạch Sanh chém chằn tinh.
10. "driftwood_twig" — Driftwood & Twig: Phù hợp rừng sâu hoài cổ, nhà tranh mộc mạc từ củi khô. VD: Túp lều tranh của Thạch Sanh.
11. "button_string" — Button & String Art: Phù hợp tranh len đầy màu sắc, đan chỉ tươi vui. VD: Tranh thiếu nhi, các câu chuyện vui tươi sinh động.
12. "cardboard_gears" — Cardboard Gears: Phù hợp chuyển động cơ khí, cỗ máy gỗ, bánh răng 3D. VD: Nỏ thần An Dương Vương, cỗ xe ngựa cổ.
13. "hybrid_metal_clay" — Hồn Sét Xương Sắt (Hybrid): Đất sét thô phối giáp vỏ lon sáng bóng, thích hợp cho quái vật có giáp bảo vệ.
14. "hybrid_popup_wood" — Khung Nổi Gỗ Lũa (Hybrid): Kết hợp carton pop-up dựng hình và cành lũa thật tạo chiều sâu thiên nhiên kỳ vĩ.
15. "hybrid_fabric_plastic" — Sợi Mềm Mảnh Bóng (Hybrid): Vải thổ cẩm phối nắp chai nhựa màu sắc, thích hợp cho trang phục lễ hội dân gian sặc sỡ.
16. "hybrid_folk_automata" — Đông Hồ Automata (Hybrid): Tranh Đông Hồ giấy dó kết hợp chuyển động cơ học bánh răng, cực kỳ độc đáo.

OUTPUT JSON:
{
  "recommended_style": "style_id",
  "reason": "Giải thích ngắn gọn tại sao style này phù hợp với chủ đề",
  "alternative_style": "style_id thay thế",
  "alternative_reason": "Lý do thay thế"
}
`;

const SceneCard = React.memo(({ seg, idx }: { seg: any, idx: number }) => {
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
                    <div className="text-[9px] text-slate-500 font-bold mb-1 uppercase">Dẫn truyện:</div>
                    <p className="text-xs text-slate-400 italic leading-relaxed text-justify">{seg.voice_text}</p>
                 </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-amber-100 font-medium italic leading-relaxed text-justify">"{seg.chapter_voice_block || seg.voice_text || '(Đọc tiếp...)'}"</p>
          )}
          {seg.voice_profile && (
            <div className="mt-2 p-2.5 bg-purple-950/20 rounded-lg border border-purple-500/20 space-y-1.5">
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
                  <div className="text-[9px] text-slate-300 font-medium">{seg.voice_profile.accent || 'Giọng Bắc chuẩn'}</div>
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
  globalSettings: GlobalSettings;
  uiLang?: 'vi' | 'en';
  isAdmin?: boolean;
}

const ScriptModule: React.FC<ScriptModuleProps> = ({ 
  segments, 
  setSegments, 
  scriptData, 
  setScriptData, 
  onScriptGenerated, 
  onAudioRefined, 
  initialTopic = '',
  onNavigateToStudio,
  globalSettings,
  uiLang = 'vi',
  isAdmin = false
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [duration, setDuration] = useState<number | string>(1);
  const [secondsPerScene, setSecondsPerScene] = useState(8);
  const [lockDuration, setLockDuration] = useState(true); // Bật mặc định (Khóa 8 giây)
  const [market, setMarket] = useState('vn_recycle');
  const [style, setStyle] = useState('auto');
  const [speakerMode, setSpeakerMode] = useState<'multi' | 'single' | 'asmr'>('single');
  const [loading, setLoading] = useState(false);
  const [suggestedStyle, setSuggestedStyle] = useState<any>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  // Audio Re-Engineering
  const [refiningAudio, setRefiningAudio] = useState(false);
  const [audioRefinedCount, setAudioRefinedCount] = useState(0);
  const [refiningProgress, setRefiningProgress] = useState(0);

  // Omni-Progress Bar
  const [progress, setProgress] = useState({ percent: 0, text: '' });
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const abortRef = React.useRef(false);
  
  const loadingMessages = [
    "Đang phân tích cấu trúc kịch bản...",
    "Đang lựa chọn vật liệu tái chế phù hợp...",
    "Đang dệt hội thoại đa nhân vật...",
    "Đang tinh chỉnh nhịp độ (Pacing)...",
    "Đang hoàn thiện âm học và COPPA..."
  ];

  React.useEffect(() => { 
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  const durationNum = parseFloat(duration as string) || 0;
  const activeSecondsPerScene = lockDuration ? 8 : secondsPerScene;
  const scenes = Math.ceil((Math.max(0.1, durationNum) * 60) / activeSecondsPerScene);
  const mode = durationNum < 3 ? { name: '🟢 QUICK CRAFT (<3m)', wpm: 260 } : durationNum <= 10 ? { name: '🔵 STORY WEAVER (3-10m)', wpm: 260 } : { name: '🟣 EPIC FOLKLORE (>10m)', wpm: 260 };
  const words = scenes * 35; // Đúng nguyên tắc cốt lõi: 30-40 từ cho một cảnh 8 giây (Trung bình 35 từ)
  const modeColor = durationNum < 3 ? 'text-green-400 border-green-500/50 bg-green-900/10' : durationNum <= 10 ? 'text-teal-400 border-teal-500/50 bg-teal-900/10' : 'text-purple-400 border-purple-500/50 bg-purple-900/10';

  // === AI STYLE SUGGESTION — Brain Core ===
  const handleSuggestStyle = async () => {
    if (!topic) return showToast('Nhập chủ đề trước!');
    setLoadingSuggestion(true);
    try {
      const prompt = `CHỦ ĐỀ: "${topic}"\n\nHãy đề xuất phong cách visual phù hợp nhất.`;
      const result = await callAI(prompt, STYLE_RECOMMENDATION_PROMPT);
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
    
    // Auto-clear old data when starting a new generation
    setSegments([]);
    setScriptData(null);
    setSuggestedStyle(null);
    setAudioRefinedCount(0);
    setLoading(true);
    abortRef.current = false;
    setProgress({ percent: 2, text: loadingMessages[0] });

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (abortRef.current) return prev;
        const newP = prev.percent < 95 ? prev.percent + 1 : prev.percent;
        const msgIdx = Math.floor(newP / 25);
        if (msgIdx !== loadingMsgIdx && msgIdx < loadingMessages.length) setLoadingMsgIdx(msgIdx);
        return { percent: newP, text: loadingMessages[msgIdx] || loadingMessages[0] };
      });
    }, 400);

    try {
      const styleObj = VISUAL_STYLES.find(s => s.id === style);
      const mk = TARGET_MARKETS[market] || TARGET_MARKETS['vn_recycle'];
      
      const chunkSize = 25;
      const totalRounds = Math.ceil(scenes / chunkSize);
      let allSegments: any[] = [];
      let finalJson: any = null;

      for (let round = 1; round <= totalRounds; round++) {
        const startSceneNum = (round - 1) * chunkSize + 1;
        const endSceneNum = Math.min(round * chunkSize, scenes);
        const roundSceneCount = endSceneNum - startSceneNum + 1;
        
        let continuityContext = '';
        if (allSegments.length > 0) {
          const lastFew = allSegments.slice(-3);
          continuityContext = `\n[CONTINUITY CONTEXT]: The story has already progressed through the first ${allSegments.length} scenes. Here are the last 3 scenes for context:
${JSON.stringify(lastFew.map(s => ({ scene_number: s.scene_number, voice_text: s.voice_text, visual_desc_vi: s.visual_desc_vi })), null, 2)}
CRITICAL: You MUST write the next scenes continuing this exact storyline seamlessly starting at Scene ${startSceneNum}. Do NOT repeat these scene contents, move the story forward.`;
        }

        const modeInstruction = speakerMode === 'multi' 
          ? 'MULTI-SPEAKER MODE: Create dynamic dialogues between multiple characters. Include distinct voice profiles.' 
          : speakerMode === 'single'
          ? 'SINGLE-SPEAKER MODE: Write as a single narrator/storyteller reading the entire script. No dialogue between multiple characters.'
          : 'ASMR NO-VOICE MODE: Do NOT write any voice_text or dialogue. Focus entirely on detailed ASMR sounds, environmental audio, and visual actions. Make "voice_text" empty and "sfx_music_suggestion" extremely detailed.';

        const prompt = `TOPIC: "${topic}"\nDURATION: ${durationNum}m\nROUND_GENERATING: Round ${round} of ${totalRounds} (Generating scenes ${startSceneNum} to ${endSceneNum})\nROUND_SCENE_COUNT: ${roundSceneCount}\nTARGET_LANGUAGE: ${mk.voice_lang}\nTARGET_MARKET: ${mk.name}\nVISUAL_STYLE: ${styleObj?.name || 'Auto'}\nVISUAL_STYLE_MATERIAL_GUIDELINES: ${styleObj?.desc || ''}. ${styleObj?.prompt_enforce || ''}\n\nCRITICAL MATERIAL CONSISTENCY LOCK:\n- Bạn BẮT BUỘC phải viết toàn bộ nhân vật và bối cảnh ở trường 'character', 'visual_desc_vi', 'image_prompt', 'video_prompt' bằng ĐÚNG chất liệu của phong cách nghệ thuật được chọn là "${styleObj?.name}".\n- Tuyệt đối KHÔNG ĐƯỢC trộn lẫn chất liệu từ phong cách khác (Ví dụ: Đã chọn phong cách "Lá Khô & Hạt" thì nhân vật Cáo hay Cổng Trời phải làm từ lá tre khô, gáo dừa, cành củi khô, hạt đỗ... Tuyệt đối KHÔNG được tả làm bằng "bìa carton" hay "nhựa"). Sự không nhất quán chất liệu là lỗi cực kỳ nặng và sẽ bị phạt nặng.\n\nSPEAKER_MODE_INSTRUCTION: ${modeInstruction}${continuityContext}\n\nLANGUAGE ENFORCEMENT RULES (CRITICAL):\n1. RESPOND ONLY the spoken fields (voice_text, dialogues, visual_desc_vi, chunk_summary) in Vietnamese.\n2. ALL visual generator prompts and technical fields (video_prompt, image_prompt, character, character_lock_prompt, sfx_music_suggestion) MUST BE 100% IN ENGLISH. Zero Vietnamese words allowed here under any circumstances (translate terms like "ông lão" to "old man", "lá tre" to "bamboo leaves", "Cóc" to "Toad", etc.).\n\nCRITICAL: Return exactly ${roundSceneCount} scenes starting at scene_number ${startSceneNum}.\nGENERATE JSON OBJECT.`;
        
        let json: any = null;
        let retries = 3;
        while (retries > 0) {
          try {
            json = await callAI(prompt, SYSTEM_PROMPT_SCRIPT_WRITER);
            break;
          } catch (err: any) {
            retries--;
            if (retries === 0) throw err;
            await new Promise(r => setTimeout(r, 8000));
          }
        }
        
        if (round === 1) finalJson = json;

        let segs: any[] = [];
        if (json) {
          if (Array.isArray(json)) segs = json;
          else if (json.script && Array.isArray(json.script)) segs = json.script;
          else if (json.scenes && Array.isArray(json.scenes)) segs = json.scenes;
          else if (json.refined_scenes && Array.isArray(json.refined_scenes)) segs = json.refined_scenes;
          else {
            const arrayKey = Object.keys(json).find(k => Array.isArray(json[k]));
            if (arrayKey) segs = json[arrayKey];
          }
        }

        let enforce = '';
        if (styleObj && styleObj.id !== 'auto') {
          enforce = styleObj.prompt_enforce;
        } else if (finalJson && finalJson.suggested_style) {
          const autoStyle = VISUAL_STYLES.find(s => s.id === finalJson.suggested_style);
          if (autoStyle) enforce = autoStyle.prompt_enforce;
          else enforce = `, Visual Style: ${finalJson.suggested_style}`;
        }
        
        // VEO 3: Insert aesthetic style correctly without breaking the All-In-One format.
        if (enforce) {
          segs = segs.map((s: any) => {
            let vp = s.video_prompt || '';
            let ip = s.image_prompt || '';
            if (vp && !vp.includes('Visual Style:')) {
              if (vp.includes('[AUDIO:')) vp = vp.replace('[AUDIO:', enforce + ' [AUDIO:');
              else if (vp.includes('textless,')) vp = vp.replace('textless,', enforce + ' textless,');
              else vp += enforce;
            }
            if (ip && !ip.includes('Visual Style:')) {
              ip += enforce;
            }
            return { ...s, video_prompt: vp, image_prompt: ip };
          });
        }

        segs = segs.map((s: any) => ({
          ...s,
          scene_number: s.scene_number || (startSceneNum + segs.indexOf(s)),
        }));

        allSegments = [...allSegments, ...segs];
        setSegments([...allSegments]);
        
        if (round < totalRounds) {
          await new Promise(r => setTimeout(r, 6000));
        }
      }

      // Hoàn tất thành công
      clearInterval(progressInterval);
      setProgress({ percent: 100, text: '✨ Giả Kim Thuật hoàn tất! Kịch bản đã được dệt thành công.' });
      await new Promise(r => setTimeout(r, 600));

      setScriptData(finalJson);
      setSegments(allSegments);
      localStorage.setItem('recycle_autosave_script', JSON.stringify({ segments: allSegments, scriptData: finalJson, topic }));
      onScriptGenerated(allSegments, (finalJson && finalJson.suggested_style) || '', topic);
    } catch (e: any) { 
      clearInterval(progressInterval);
      showToast(e.message); 
    }
    finally { 
      clearInterval(progressInterval);
      setLoading(false); 
      setProgress({ percent: 0, text: '' });
    }
  };

  const copyAll = () => {
    const text = segments.map(s => s.chapter_voice_block || s.voice_text).join('\n\n');
    navigator.clipboard.writeText(text);
    showToast('✅ Đã copy voice toàn bộ!', 'success');
  };

  // === MASTER COMMAND V16.0: AUDIO RE-ENGINEERING ===
  const handleAudioReengineering = async () => {
    if (segments.length === 0) return showToast('Chưa có kịch bản để tinh chỉnh!');
    
    setRefiningAudio(true);
    setRefiningProgress(2);
    const audioInterval = setInterval(() => {
      setRefiningProgress(prev => (prev < 90 ? prev + 1 : prev));
    }, 200);

    try {
      const payload = segments.map(s => ({
        scene_number: s.scene_number,
        dialogues: s.dialogues || [],
        voice_text: s.voice_text || s.chapter_voice_block || '',
        visual_context: s.visual_desc_vi || s.visual_desc || '',
        section: s.section || '',
        character: s.character || '',
        time: s.time || '',
        sfx_music_suggestion: s.sfx_music_suggestion || ''
      }));
      
      const chunkSize = 25;
      const totalRounds = Math.ceil(payload.length / chunkSize);
      let refinedList: any[] = [];
      
      for (let round = 1; round <= totalRounds; round++) {
        const startIdx = (round - 1) * chunkSize;
        const endIdx = Math.min(round * chunkSize, payload.length);
        const chunkPayload = payload.slice(startIdx, endIdx);
        
        const prompt = `KỊCH BẢN GỐC TÁI CHẾ (Đợt ${round}/${totalRounds} - ${chunkPayload.length} scenes):\n${JSON.stringify(chunkPayload, null, 2)}\n\nTINH CHỈNH THANH ÂM, LỜI THOẠI ĐA NHÂN VẬT VÀ HIỆU ỨNG ÂM THANH BÙNG NỔ CHO ĐỢT ${round} CỦA KỊCH BẢN NÀY. OUTPUT JSON.`;
        
        let res: any = null;
        let retries = 3;
        while (retries > 0) {
          try {
            res = await callAI(prompt, SYSTEM_PROMPT_AUDIO_REENGINEERING);
            break;
          } catch (err: any) {
            retries--;
            if (retries === 0) throw err;
            await new Promise(r => setTimeout(r, 5000));
          }
        }
        
        if (res) {
          if (Array.isArray(res)) refinedList = [...refinedList, ...res];
          else if (res.refined_scenes && Array.isArray(res.refined_scenes)) refinedList = [...refinedList, ...res.refined_scenes];
          else if (res.script && Array.isArray(res.script)) refinedList = [...refinedList, ...res.script];
          else if (res.scenes && Array.isArray(res.scenes)) refinedList = [...refinedList, ...res.scenes];
          else {
            const arrayKey = Object.keys(res).find(k => Array.isArray(res[k]));
            if (arrayKey) refinedList = [...refinedList, ...res[arrayKey]];
          }
        }
        
        if (round < totalRounds) {
          await new Promise(r => setTimeout(r, 6000));
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

        // Hoàn tất thành công
        clearInterval(audioInterval);
        setRefiningProgress(100);
        await new Promise(r => setTimeout(r, 600));

        setSegments(newSegments);
        localStorage.setItem('recycle_autosave_script', JSON.stringify({ segments: newSegments, scriptData, topic }));
        if (onAudioRefined) onAudioRefined(newSegments, topic);
        else onScriptGenerated(newSegments, '', topic);
        setAudioRefinedCount(prev => prev + 1);
        showToast('🎙️ Kịch bản âm thanh & hội thoại đã được nâng cấp đỉnh cao!', 'success');
      } else {
        throw new Error('AI không trả về dữ liệu thanh âm đúng cấu trúc.');
      }
    } catch (e: any) { 
      clearInterval(audioInterval);
      showToast(`Audio Error: ${e.message}`); 
    }
    finally { 
      clearInterval(audioInterval);
      setRefiningAudio(false); 
      setRefiningProgress(0);
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
          localStorage.setItem('recycle_autosave_script', JSON.stringify({ segments: data.segments, scriptData: { suggested_style: 'auto' }, topic: data.topic }));
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
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 animate-[slideIn_0.4s_ease-out]">
      {/* Cột Trái: Trình biên soạn kịch bản */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2"><i className="fa-solid fa-scroll text-teal-500" /> Soạn Kịch Bản Truyện Cổ Tích Tái Chế</span>
          <label className="cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-900/20 text-amber-300 border border-amber-500/30 hover:bg-amber-900/40 transition-all flex items-center gap-2">
            <i className="fa-solid fa-folder-open" /> Mở Dự Án (.json)
            <input type="file" accept=".json" className="hidden" onChange={handleImportProject} />
          </label>
        </h2>
        <div className="space-y-4">
          <div className="relative mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Chủ Đề Truyện</label>
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
                placeholder="VD: Tấm Cám, Thạch Sanh, Sơn Tinh Thủy Tinh..." 
              />
              <button onClick={handleSuggestStyle} disabled={loadingSuggestion || !topic}
                className="px-4 py-2 bg-amber-900/30 hover:bg-amber-800/40 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
                title="AI đề xuất phong cách phù hợp">
                {loadingSuggestion ? <><i className="fa-solid fa-sync animate-spin" /> Đang phân tích...</> : <><i className="fa-solid fa-wand-magic-sparkles" /> AI Đề Xuất Style</>}
              </button>
            </div>
          </div>

          {/* AI Style Suggestion Card */}
          {suggestedStyle && (
            <div className="bg-gradient-to-r from-amber-900/15 to-teal-900/15 border border-amber-500/30 rounded-xl p-4 animate-[slideIn_0.3s_ease-out]">
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-wand-magic-sparkles text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase">AI Đề Xuất Phong Cách</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#0a0e14]/30 p-3 rounded-lg border border-amber-500/20">
                  <div className="text-[10px] text-amber-300 mb-1 font-bold">🏆 ĐỀ XUẤT CHÍNH</div>
                  <div className="text-sm font-bold text-white mb-1">{VISUAL_STYLES.find(s => s.id === suggestedStyle.recommended_style)?.name || suggestedStyle.recommended_style}</div>
                  <div className="text-[10px] text-slate-400">{suggestedStyle.reason}</div>
                </div>
                {suggestedStyle.alternative_style && (
                  <div className="bg-[#0a0e14]/30 p-3 rounded-lg border border-teal-500/20">
                    <div className="text-[10px] text-teal-300 mb-1 font-bold">🔄 THAY THẾ</div>
                    <div className="text-sm font-bold text-white mb-1">{VISUAL_STYLES.find(s => s.id === suggestedStyle.alternative_style)?.name || suggestedStyle.alternative_style}</div>
                    <div className="text-[10px] text-slate-400">{suggestedStyle.alternative_reason}</div>
                    <button onClick={() => { setStyle(suggestedStyle.alternative_style); showToast('Đã chọn style thay thế!', 'info'); }}
                      className="mt-2 text-[10px] text-teal-400 hover:underline flex items-center gap-1">
                      <i className="fa-solid fa-arrow-right" /> Dùng style này
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/50" />
              <label className="text-xs font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2"><i className="fa-solid fa-clock text-teal-400" /> THỜI LƯỢNG (PHÚT)</label>
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
                    if (num > globalSettings.maxDuration) {
                      showToast(`⚠️ Giới hạn thời lượng tối đa là ${globalSettings.maxDuration} phút!`, 'warning');
                      setDuration(globalSettings.maxDuration);
                    } else {
                      setDuration(val);
                    }
                  }}
                  onBlur={e => {
                    const num = parseFloat(e.target.value);
                    if (isNaN(num) || num < 0.5) {
                      setDuration(1);
                    } else if (num > globalSettings.maxDuration) {
                      setDuration(globalSettings.maxDuration);
                    }
                  }}
                  className="w-20 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-2xl font-black text-white text-center outline-none" 
                />
                
                <div className="flex flex-col gap-1 w-36 bg-[#0a0e14]/40 p-2 rounded-lg border border-slate-700/20">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label className="text-[10px] text-slate-400 font-bold tracking-wider">KHÓA 8S:</label>
                    <button 
                      type="button"
                      onClick={() => setLockDuration(!lockDuration)}
                      className={`w-9 h-5 rounded-full transition-all duration-200 focus:outline-none flex items-center p-0.5 ${lockDuration ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-slate-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${lockDuration ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      value={activeSecondsPerScene} 
                      disabled={lockDuration}
                      onChange={e => setSecondsPerScene(Math.max(1, parseInt(e.target.value) || 8))}
                      className={`w-full bg-[#0a0e14] border rounded p-1 text-xs font-bold text-center outline-none transition-all ${lockDuration ? 'border-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'border-amber-500/50 text-amber-400'}`} 
                    />
                    <span className="text-[9px] text-slate-500 font-bold">GIÂY</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div><span className="text-slate-500">Số cảnh:</span> <span className="font-bold text-amber-400 text-base">~{scenes} Cảnh</span></div>
                  <div><span className="text-slate-500">Voice:</span> <span className="font-bold text-amber-400 text-base">~{words} từ</span></div>
                </div>
              </div>
            </div>
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-globe text-amber-400" /> THỊ TRƯỜNG</label>
              <select value={market} onChange={e => setMarket(e.target.value)} className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none cursor-pointer mb-4">
                {Object.values(TARGET_MARKETS).map(m => <option key={m.id} value={m.id}>{m.flag} {m.name}</option>)}
              </select>

              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-microphone-lines text-teal-400" /> TÙY CHỌN GIỌNG ĐỌC</label>
              <div className="flex bg-[#0a0e14] rounded-lg p-1 border border-slate-700/50">
                <button 
                  onClick={() => setSpeakerMode('multi')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${speakerMode === 'multi' ? 'bg-teal-900/40 text-teal-300 shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Đa Nhân Vật
                </button>
                <button 
                  onClick={() => setSpeakerMode('single')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${speakerMode === 'single' ? 'bg-teal-900/40 text-teal-300 shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Độc Thoại
                </button>
                <button 
                  onClick={() => setSpeakerMode('asmr')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${speakerMode === 'asmr' ? 'bg-teal-900/40 text-teal-300 shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  ASMR (No Voice)
                </button>
              </div>
            </div>
          </div>
          <div className={`border rounded-xl p-4 transition-all ${modeColor}`}>
            <div className="font-bold">{mode.name}</div>
          </div>
          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase block flex items-center gap-2">
                <i className="fa-solid fa-palette text-amber-400" /> PHONG CÁCH VẬT LIỆU TÁI CHẾ
              </label>
              <span className="text-[9px] text-slate-500 font-bold">
                * Khung viền đổi màu tự động theo Thị Trường
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {VISUAL_STYLES.filter(s => globalSettings.allowedStyles.length === 0 || globalSettings.allowedStyles.includes(s.id)).map(s => {
                const isRecommended = MARKET_STYLE_RECOMMENDATIONS[market]?.includes(s.id);
                const isSelected = style === s.id;
                const isVN = isVietnameseStyle(s.id);

                let btnClass = "text-[10px] p-2 rounded border text-left transition-all duration-200 flex flex-col justify-between h-full ";
                
                if (isSelected) {
                  if (market === 'vn_recycle' || market === 'vn_kids') {
                    btnClass += "bg-emerald-950/40 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/20";
                  } else if (market === 'us_diy') {
                    btnClass += "bg-blue-950/40 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/20";
                  } else if (market === 'jp_craft') {
                    btnClass += "bg-rose-950/40 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/20";
                  } else if (market === 'kr_eco') {
                    btnClass += "bg-purple-950/40 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-500/20";
                  } else {
                    btnClass += "bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/20";
                  }
                } else if (isRecommended) {
                  if (market === 'vn_recycle' || market === 'vn_kids') {
                    btnClass += "bg-emerald-950/10 border-emerald-800/40 text-emerald-400 hover:bg-emerald-950/20 hover:border-emerald-700/60";
                  } else if (market === 'us_diy') {
                    btnClass += "bg-blue-950/10 border-blue-800/40 text-blue-400 hover:bg-blue-950/20 hover:border-blue-700/60";
                  } else if (market === 'jp_craft') {
                    btnClass += "bg-rose-950/10 border-rose-800/40 text-rose-400 hover:bg-rose-950/20 hover:border-rose-700/60";
                  } else if (market === 'kr_eco') {
                    btnClass += "bg-purple-950/10 border-purple-800/40 text-purple-400 hover:bg-purple-950/20 hover:border-purple-700/60";
                  } else {
                    btnClass += "bg-cyan-950/10 border-cyan-800/40 text-cyan-400 hover:bg-cyan-950/20 hover:border-cyan-700/60";
                  }
                } else {
                  btnClass += "bg-[#12161e] border-slate-800/50 text-slate-500 opacity-50 hover:opacity-80 hover:bg-[#1e2230]";
                }

                const isHybrid = s.id === 'hybrid_multimaterial';

                return (
                  <button key={s.id} onClick={() => setStyle(s.id)} className={btnClass}>
                    <div className="w-full">
                      <div className={`font-bold mb-0.5 flex items-center justify-between gap-1 
                        ${isVN ? 'text-amber-300 font-extrabold text-[10.5px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : ''} 
                        ${isHybrid ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-300 to-amber-300 font-extrabold text-[10.5px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : ''}`}>
                        <span>{s.name}</span>
                        {isVN && <span className="text-[8px] bg-red-800/80 px-1 py-0.5 rounded text-red-100 border border-red-500/30 scale-90 flex items-center gap-0.5 font-normal">🇻🇳 Dân Gian</span>}
                        {isHybrid && <span className="text-[8px] bg-purple-900/80 px-1 py-0.5 rounded text-purple-100 border border-purple-500/30 scale-90 flex items-center gap-0.5 font-bold">👑 Đặc Biệt</span>}
                      </div>
                      <div className="text-[9px] opacity-70 truncate">{s.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {/* ACTION AREA - OMNI PROGRESS BAR LAYOUT */}
          <div className="flex gap-4">
            {loading ? (
              <ProgressBar 
                percent={progress.percent} 
                text={progress.text || loadingMessages[loadingMsgIdx]} 
                subText="Tiến trình kiến tạo Kịch Bản AI"
                colorTheme="teal"
              />
            ) : (
              <button onClick={handleGenerate} disabled={refiningAudio}
                className="flex-1 py-4 bg-teal-900/50 hover:bg-teal-800/50 border border-teal-500/30 text-teal-100 font-bold rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.15)] flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                <i className="fa-solid fa-paper-plane" /> KIẾN TẠO KỊCH BẢN CỔ TÍCH
              </button>
            )}
            
            {loading && (
              <button onClick={() => { 
                abortRef.current = true; 
                setLoading(false); 
                setSegments([]); 
                setScriptData(null); 
                setProgress({ percent: 0, text: '' });
                showToast('🛑 Đã hủy dệt kịch bản.', 'warning'); 
              }} 
                className="px-6 py-4 bg-red-900/50 hover:bg-red-800/50 border border-red-500/50 text-red-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <i className="fa-solid fa-stop" /> HỦY
              </button>
            )}
          </div>

          {/* === MASTER COMMAND V16.0: AUDIO RE-ENGINEERING BUTTON === */}
          {globalSettings.enableAudioRefinement !== false && segments.length > 0 && (
            refiningAudio ? (
              <ProgressBar 
                percent={refiningProgress} 
                text="Đang tinh chỉnh âm thanh..." 
                subText="Sóng âm thanh học V20.0"
                colorTheme="purple"
              />
            ) : (
              <button onClick={handleAudioReengineering} disabled={loading || refiningAudio}
                className="w-full py-3.5 bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-purple-900/50 hover:from-purple-800/50 hover:to-purple-800/50 border border-purple-500/30 text-purple-200 font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.15)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <><i className="fa-solid fa-headphones-simple" /> 🎙️ TINH CHỈNH THANH ÂM (V20.0){audioRefinedCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-600 text-[9px] font-bold">×{audioRefinedCount}</span>}</>
              </button>
            )
          )}
        </div>
      </div>

      {/* Script Results */}
      {segments.length > 0 && (
        <div className="space-y-4 pb-10">
          {scriptData?.coppa_disclaimer && scriptData.coppa_disclaimer !== "null" && scriptData.coppa_disclaimer !== "None" && scriptData.coppa_disclaimer !== "" && (
            <div className="bg-amber-950/20 border border-amber-500/20 p-3.5 rounded-xl flex items-start gap-3 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
              <i className="fa-solid fa-circle-info text-amber-400 mt-0.5 text-lg" />
              <div>
                <div className="text-xs font-bold text-amber-300 mb-1 uppercase tracking-wide flex items-center gap-1.5">
                  🛡️ KHUYẾN NGHỊ AN TOÀN & TUÂN THỦ (SAFETY & COMPLIANCE)
                </div>
                <div className="text-xs text-amber-200/80 leading-relaxed font-medium">{scriptData.coppa_disclaimer}</div>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center px-2">
            <div className="text-xs text-slate-500 font-bold">Đã tạo: {segments.length} Phân Cảnh Thủ Công</div>
            <button onClick={copyAll} className="text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 bg-white text-black hover:bg-slate-200"><i className="fa-solid fa-copy" /> Copy Voice Toàn Bộ</button>
          </div>
          {segments.map((seg, idx) => (
            <SceneCard key={idx} seg={seg} idx={idx} />
          ))}

          {/* CHUYỂN SANG BƯỚC CHẾ TÁC VIDEO (CRAFT STUDIO) */}
          {onNavigateToStudio && (
            <div className="pt-6 flex justify-center animate-bounce">
              <button 
                onClick={onNavigateToStudio}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-black text-sm rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-3 transition-all hover:scale-105 border-2 border-white/20 uppercase tracking-wider"
              >
                <span>Chuyển Sang Studio Chế Tác Video (Bước 3)</span>
                <i className="fa-solid fa-arrow-right text-lg" />
              </button>
            </div>
          )}
        </div>
      )}
      </div> {/* Đóng cột trái lg:col-span-3 */}

      {/* Cột Phải: Bảng Quy Chuẩn Viral VKT */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] sticky top-6">
          <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider mb-4 pb-2 border-b border-amber-500/20 flex items-center gap-2">
            <i className="fa-solid fa-fire text-amber-500 animate-pulse" />
            Quy Chuẩn Viral VKT
          </h3>
          <div className="space-y-4">
            {/* Quy chuẩn 1 */}
            <div className="p-3 rounded-lg bg-[#0a0e14]/60 border border-slate-700/30 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-500/20">1</span>
                <span className="text-xs font-bold text-white uppercase tracking-wide">Hook 3 Giây Đầu</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-7">
                Bắt buộc xuất hiện biến đổi thị giác kỳ diệu từ phế liệu thô sơ sang tác phẩm nghệ thuật để giữ chân người xem ngay tức khắc.
              </p>
            </div>

            {/* Quy chuẩn 2 */}
            <div className="p-3 rounded-lg bg-[#0a0e14]/60 border border-slate-700/30 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-500/20">2</span>
                <span className="text-xs font-bold text-white uppercase tracking-wide">Drama Kịch Tính</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-7">
                Cốt truyện luôn có điểm nút thắt bẻ lái bất ngờ, kết thúc nhân văn cảm hóa thay vì bạo lực, lồng ghép thông điệp xanh tinh tế.
              </p>
            </div>

            {/* Quy chuẩn 3 */}
            <div className="p-3 rounded-lg bg-[#0a0e14]/60 border border-slate-700/30 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-500/20">3</span>
                <span className="text-xs font-bold text-white uppercase tracking-wide">ASMR Vật Liệu</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-7">
                Gia tăng trải nghiệm thính giác bằng tiếng kéo cắt giấy, tiếng gõ nắp chai, tiếng nặn đất sét hoặc xé vải chân thực.
              </p>
            </div>

            {/* Quy chuẩn 4 */}
            <div className="p-3 rounded-lg bg-[#0a0e14]/60 border border-slate-700/30 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-500/20">4</span>
                <span className="text-xs font-bold text-white uppercase tracking-wide">1 Cảnh 1 Người Nói</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-7">
                Mỗi phân cảnh 8 giây chỉ cho phép tối đa 01 người nói (độc thoại/dẫn chuyện) để bảo toàn nhịp độ thoại rõ ràng.
              </p>
            </div>

            {/* Quy chuẩn 5 */}
            <div className="p-3 rounded-lg bg-[#0a0e14]/60 border border-slate-700/30 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-500/20">5</span>
                <span className="text-xs font-bold text-white uppercase tracking-wide">Vật Lý Chân Thực</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-7">
                Mô tả chính xác đặc tính vật liệu tái chế (lá khô giòn vụn, giấy gấp nếp) và quy luật trọng lực tự nhiên trong kịch bản.
              </p>
            </div>

            {/* Quy chuẩn 6 */}
            <div className="p-3 rounded-lg bg-[#0a0e14]/60 border border-slate-700/30 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-500/20">6</span>
                <span className="text-xs font-bold text-white uppercase tracking-wide">Silent COPPA</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-7">
                Bắt buộc đính kèm cảnh báo an toàn cho các hoạt động thủ công sử dụng dao rọc giấy, súng bắn keo hay nhiệt độ cao.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptModule;