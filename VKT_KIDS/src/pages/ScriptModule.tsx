import React, { useState } from 'react';
import { callAI } from '../services/aiService';
import { SYSTEM_PROMPT_SCRIPT_WRITER, SYSTEM_PROMPT_AUDIO_REENGINEERING } from '../data/prompts';
import { TARGET_MARKETS, VISUAL_STYLES, } from '../data/constants';
import { showToast } from '../components/Toast';

export const ENGLISH_TOPICS = [
  { id: 'fruits', label: '🍎 Fruits & Veggies (Trái cây & Rau củ)' },
  { id: 'numbers', label: '🔢 Numbers 1-10 (Số đếm 1-10)' },
  { id: 'colors', label: '🎨 Colors (Màu sắc)' },
  { id: 'animals', label: '🐶 Animals & Sounds (Động vật)' },
  { id: 'body', label: '👃 Body Parts (Bộ phận cơ thể)' },
  { id: 'vehicles', label: '🚗 Vehicles (Giao thông)' },
  { id: 'alphabet', label: '🔤 Alphabet (Bảng chữ cái)' },
  { id: 'shapes', label: '🔺 Shapes (Hình khối)' },
  { id: 'family', label: '👨‍👩‍👧‍👦 Family (Gia đình)' },
  { id: 'routines', label: '☀️ Daily Routines (Sinh hoạt)' },
  { id: 'emotions', label: '😊 Emotions & Feelings (Cảm xúc)' },
  { id: 'jobs', label: '👮 Jobs & Occupations (Nghề nghiệp)' },
  { id: 'weather', label: '🌦️ Weather & Seasons (Thời tiết & Mùa)' },
  { id: 'clothes', label: '👕 Clothes & Accessories (Quần áo)' },
  { id: 'food', label: '🍔 Food & Drinks (Đồ ăn & Thức uống)' },
  { id: 'action_verbs', label: '🏃 Action Verbs (Động từ hành động)' },
  { id: 'nature', label: '🌳 Nature & Outdoors (Thiên nhiên)' },
  { id: 'school', label: '🎒 School Supplies (Đồ dùng học tập)' },
  { id: 'toys', label: '🧸 Toys & Games (Đồ chơi)' },
  { id: 'opposites', label: '🔄 Opposite Words (Từ trái nghĩa)' },
  { id: 'prepositions', label: '📦 Prepositions (Giới từ in/on/under)' },
  { id: 'house', label: '🏠 My House (Ngôi nhà của tôi)' }
];

const MICRO_CONTEXTS: Record<string, string[]> = {
  'fruits': [
    'Tai sieu thi rau cu qua', 'Trong khu vuon nong trai luc thu hoach',
    'Bua an nha buoi chieu trong bep', 'Di da ngoai picnic o cong vien',
    'Lam sinh to trai cay nhiet doi', 'Choi tro bat mat doan ten trai cay'
  ],
  'numbers': [
    'Dem vat nuoi choi trong phong ngu', 'Dem cac con vat o So Thu',
    'Choi nhay la ca dem so ngoai san', 'Dem nhung chiec o to tren duong pho',
    'Gio hoc toan voi bang den o truong', 'Chia keo cho cac ban gau bong'
  ],
  'colors': [
    'Dang ve tranh bang mau nuoc', 'Lua chon quan ao trong tu',
    'Ngam cau vong sau con mua', 'Choi xep hinh khoi Lego da sac',
    'Trang tri banh sinh nhat nhieu mau', 'Tron dat set tao ra mau moi'
  ],
  'body_parts': [
    'Choi Simon Says voi cac bo phan co the', 'Tap yoga thieu nhi theo huong dan',
    'Nhanh long may bong (Blink Eyes Game)', 'Nghe nhac va lay theo nhip'
  ],
  'vehicles': [
    'Choi sa ban giao thong tren tham', 'Ngam xe co to tu ban cong nha',
    'Tham quan tram cuu hoa canh sat', 'Lai xe do choi dieu khien tu xa',
    'Xay dung duong ray tau hoa bang go', 'Xep thuyen giay tha vao bon tam'
  ],
  'alphabet': [
    'Hat bai hat ABC cung dan guitar', 'Choi ghep chu cai nam cham tren tu lanh',
    'Lam banh bich quy hinh chu cai', 'Tim kho bau chu cai giau trong cat',
    'To mau sach chu cai khong lo', 'Dung co the uon thanh hinh chu cai'
  ],
  'shapes': [
    'Xep hinh tu cac mieu go hinh hoc', 'Tim hinh tron, vuong, tam giac quanh nha',
    'Phan loai khuon lam banh nuong', 'Cat dan giay theo hinh hoc',
    'Xay thanh pho to khoi Duplo', 'Tro choi nhet khoi nhua vao dung lo'
  ],
  'family': [
    'Xem album anh gia dinh', 'Cung chuan bi bua toi',
    'Khieu vu cung gia dinh trong phong khach', 'Cung ong ba lam banh trung thu',
    'Goi dien thoai video cho ong ba', 'Ve cay gia pha (Family Tree) tren bang'
  ],
  'routines': [
    'Quy trinh thuc day buoi sang', 'Chuan bi cap sach di hoc',
    'Don dep do choi sau khi choi', 'Quy trinh rua tay sat khuan',
    'Doc truyen truoc khi di ngu', 'Quy trinh danh rang voi ban chai ngon nghinh'
  ],
  'emotions': [
    'Lam mat xau truoc guong', 'Xem mot bo phim hoat hinh cam dong',
    'Ba lam hong do choi va xin loi', 'Me tang ba mot mon qua bat ngo',
    'Choi tro choi thua va thang', 'Cung ban giai quyet mau thuan'
  ],
  'jobs': [
    'Choi dong vai bac si kham benh', 'Bep truong nho nhan vien nau an',
    'Phi cong dieu khien may bay giay', 'Tho xay dung toa nha Lego',
    'Co giao day lop cho cac gau bong', 'Nong dan thu hoach rau trong vuon'
  ],
  'weather': [
    'Ngam mua tu cua so am ap', 'Choi tuyet gia tao tu bong tram',
    'Mac ao mua di dao trong vuon', 'Theo doi du bao thoi tiet tren TV',
    'Nghi he o bien voi kem chong nang', 'Lam chong phong gio tu vai'
  ],
  'action_verbs': [
    'Vuot chuong ngai vat trong phong khach', 'Tap yoga thieu nhi theo huong dan',
    'Choi tro San nha la nham thach', 'Thi nhay la ca va chay toi dich',
    'Bat chuoc cac van dong vien the thao'
  ],
  'nature': [
    'Trong hat giong vao chau dat nho', 'Suu tam la cay kho ep vao so',
    'Tim hieu ve vong doi cua buom', 'Quan sat kien tha moi bang kinh lap',
    'Nghe am thanh chim hot buoi sang', 'Cham soc ca vang trong be'
  ],
  'school': [
    'Sap xep ba lo di hoc', 'Cham chu viet bai trong lop',
    'Phan loai tay, thuoc, keo vao dung ngan'
  ],
  'toys': [
    'Trao doi do choi voi ban be ao', 'Kham pha hop do choi bi an (Mystery box)',
    'Lap rap mot con robot lon tu Lego', 'Keo xe do choi bang day thung',
    'Ru em be bup be ngu'
  ],
  'opposites': [
    'Thi nghiem vat chim va noi trong thau nuoc', 'Mo va dong hop qua (Open/Close)',
    'Choi keo co bang khan (Pull/Push)', 'Xep thap cao va thap thap',
    'Do chieu cao cua cac con gau bong (Tall/Short)'
  ],
  'prepositions': [
    'Choi tro tron tim giau qua bong', 'Tao duong ham bang chan va chui qua',
    'Dat chu cho bong len cac do vat khac nhau', 'Xep thap coc va luan tay qua',
    'Dieu khien xe o to do choi chui qua chan ban'
  ],
  'house': [
    'Kham pha phong khach va tim do vat', 'Vao bep tim xem co nhung dung cu gi',
    'Don dep phong ngu cua be', 'Sap xep phong tam cho gon gang',
    'Choi nha lau bang vai trong goc phong'
  ]
};

// RANDOM GENERATORS FOR ULTIMATE UNIQUENESS
const RANDOM_PROPS = [
  'Do phap thuat do choi lap lanh', 'Kinh lap sieu to', 'Mu ao thuat gia mau den',
  'Bon tam do choi tre em', 'Chiec ruong kho bau bang giay', 'Ong nhom lam tu loi giay ve sinh',
  'Tam tham bay ma thuat (tham trai san)', 'Dong ho dem nguoc bang cat', 'Microphone nhua do choi co den',
  'Bang viet tu xoa', 'Chiec tui than ky cua Doraemon', 'Cai chuong lac leng keng'
];

const RANDOM_MOODS = [
  'Cuc ky phan khich va nang luong', 'To mo, bi an nhu tham tu', 'Nhe nhang, tinh cam',
  'Hai huoc, lam lanh, hay treu dua', 'Ngac nhien che O', 'Hoi hau dau va vung vo nhung yeu'
];

const RANDOM_INTERACTIONS = [
  'Dap tay (High-five) an mung', 'Nhay dieu nhay chien thang', 'Co lat nhau cuoi khuc khich',
  'Cham mui eskimo', 'Tao dang sieu nhan', 'Lam mat xau trau nhau', 'Keo dai chu khi phat am (vi du: b-a-n-a-n-aaaaaa)'
];
// ==================================================================================
// STYLE RECOMMENDATION ENGINE �?AI Brain Core (Kids Edition)
// ==================================================================================
const STYLE_RECOMMENDATION_PROMPT = `
BẠN LÀ CHUYÊN GIA ĐỀ XUẤT PHONG CÁCH NGH�?THUẬT HOẠT HÌNH THIẾU NHI.

Dựa trên ch�?đ�?câu chuyện thiếu nhi được cung cấp, hãy đ�?xuất phong cách th�?công phù hợp nhất.

CÁC PHONG CÁCH CÓ SẴN:
1. "clay_animation" �?Đất Sét Plasticine: Phù hợp nhân vật tròn mũm mĩm, cảnh biến hình k�?diệu, câu chuyện phép màu. VD: Th�?Bông học chia s�? Gấu Nâu dũng cảm.
2. "felt_puppet" �?Búp Bê Vải N�? Phù hợp cảnh ấm cúng, gia đình, tình bạn, cảm xúc sâu sắc. VD: Mèo Con nh�?m�? Bạn bè giúp nhau.
3. "foam_eva" �?Xốp Màu EVA: Phù hợp cảnh vui nhộn, màu sắc rực r�? nhân vật hình học đơn giản. VD: Học màu sắc, Học hình dạng.
4. "crayon_world" �?Th�?Giới Sáp Màu: Phù hợp cảnh tưởng tượng bay bổng, th�?giới mơ ước. VD: Bé v�?tranh biết đi, Giấc mơ k�?diệu.
5. "sock_puppet" �?Rối Tất Chân: Phù hợp cảnh hài hước, nhân vật quirky độc đáo. VD: Cặp đôi tất vui nhộn.
6. "origami_animal" �?Gấp Giấy Động Vật: Phù hợp cảnh thiên nhiên, rừng núi, bài học yêu môi trường. VD: Sếu giấy biết bay, Rừng origami.
7. "sand_art" �?Tranh Cát Màu: Phù hợp cảnh chuyển đổi k�?diệu, cảnh thiên nhiên đẹp. VD: Biển cát thần k�?
8. "cookie_dough" �?Bột Nặn PlayDoh: Phù hợp cảnh nấu ăn, làm bánh, sáng tạo th�?công. VD: Bé làm bánh cùng m�?
9. "cardboard_toy" �?Đ�?Chơi Carton DIY: Phù hợp cảnh sáng tạo, xây dựng, khám phá. VD: Xây nhà bìa carton.
10. "bubble_art" �?Ngh�?Thuật Bong Bóng: Phù hợp cảnh k�?ảo, mùa hè, nước. VD: Bong bóng xà phòng thần k�?
11. "english_learning_duo" �?Dạy Tiếng Anh M�?& Bé: Phù hợp kịch bản học tập, th�?t�?vựng (flashcards), s�?đếm, trái cây, CH�?CÓ M�?và Bé tương tác.

OUTPUT JSON:
{
  "recommended_style": "style_id",
  "reason": "Giải thích tại sao phong cách này phù hợp với câu chuyện thiếu nhi này",
  "alternative_style": "style_id thay th�?,
  "alternative_reason": "Lý do phong cách thay th�?
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
              <div className="text-[9px] text-slate-400 italic flex-1">{seg.pacing_warning || "Nhịp đ�?ổn định"}</div>
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
              showToast('�?Copied!', 'success'); 
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
  const [secondsPerScene, setSecondsPerScene] = useState(8);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [style, setStyle] = useState('auto');
  const [market, setMarket] = useState('vn_kids');
  const [englishTopic, setEnglishTopic] = useState('fruits');
  const [loading, setLoading] = useState(false);
  const [suggestedStyle, setSuggestedStyle] = useState<any>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  // Audio Re-Engineering V16.0
  const [refiningAudio, setRefiningAudio] = useState(false);
  const [audioRefinedCount, setAudioRefinedCount] = useState(0);

  // Dynamic Loading V16.0 - Cyber Console Stepper
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

  // === AUTO-SYNC SUBTOPIC FOR ENGLISH LEARNING DUO ===
  React.useEffect(() => {
    if (style === 'english_learning_duo') {
      const selected = ENGLISH_TOPICS.find(t => t.id === englishTopic);
      if (selected) {
        // Strip out any emojis or English/Vietnamese tags to feed a clean theme keyword to the generator
        const cleanName = selected.label.replace(/[^\w\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẮẰẲẴẶẶ)-]/g, '').trim();
        setTopic(`Học Tiếng Anh: ${cleanName}`);
      }
    }
  }, [style, englishTopic]);

  const durationNum = parseFloat(duration as string) || 0;
  const scenes = Math.ceil((Math.max(0.1, durationNum) * 60) / secondsPerScene);
  const mode = durationNum < 3 ? { name: '🟢 QUICK CRAFT (<3m)', wpm: 260 } : durationNum <= 10 ? { name: '🔵 STORY WEAVER (3-10m)', wpm: 260 } : { name: '🟣 EPIC FOLKLORE (>10m)', wpm: 260 };
  const words = scenes * 35; // Đúng nguyên tắc cốt lõi: 30-40 từ cho một cảnh 8 giây (Trung bình 35 từ)
  const modeColor = durationNum < 3 ? 'text-green-400 border-green-500/50 bg-green-900/10' : durationNum <= 10 ? 'text-teal-400 border-teal-500/50 bg-teal-900/10' : 'text-purple-400 border-purple-500/50 bg-purple-900/10';

  // === AI STYLE SUGGESTION - Brain Core ===
  const handleSuggestStyle = async () => {
    if (!topic) return showToast('Nhập chủ đề trước!');
    setLoadingSuggestion(true);
    try {
      const prompt = `CHỦ ĐỀ: "${topic}"\n\nHãy đề xuất phong cách visual phù hợp nhất.`;
      const result = await callAI(prompt, STYLE_RECOMMENDATION_PROMPT);
      setSuggestedStyle(result);
      if (result.recommended_style) {
        setStyle(result.recommended_style);
        showToast(`✅ AI đề xuất: ${VISUAL_STYLES.find(s => s.id === result.recommended_style)?.name || result.recommended_style}`, 'success');
      }
    } catch (e: any) { showToast(e.message); }
    finally { setLoadingSuggestion(false); }
  };

  const handleGenerate = async () => {
    if (!topic) return showToast('Vui lòng nhập chủ đề');
    
    // Pre-flight check: ensure we have at least 1 valid API key in storage
    const { hasAnyApiKey } = await import('../services/aiService');
    if (!hasAnyApiKey()) {
      showToast('⚠️ Cảnh báo: Chưa cấu hình API Key! Vui lòng mở biểu tượng Config (chìa khóa) ở góc trên bên phải để nhập API Key hoạt động.', 'error');
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

    addLog('🔥 Khởi tạo động cơ Giả Kim Thuật Trí tuệ Nhân tạo V16.5...');

    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 3) + 2; // Tăng mượt 2-4% mỗi lần
      if (percent > 98) percent = 98;
      setLoadingPercent(percent);

      // Định tuyến các bước
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

      // Đẩy log kỹ thuật ngẫu nhiên theo tiến độ để gây ấn tượng mạnh với người dùng
      if (percent >= 10 && logsList.length === 1) {
        addLog(`📝 Đã nhận dạng chủ đề kịch bản: "${topic}"`);
      }
      if (percent >= 20 && logsList.length === 2) {
        addLog(`Lua chon vat lieu: ${VISUAL_STYLES.find(s => s.id === style)?.name || 'Auto de xuat style'}`);
      }
      if (percent >= 30 && logsList.length === 3) {
        addLog(`🔄 Phân tích mâu thuẫn Drama để "bẻ lái" cốt truyện sang ngách Hoạt Hình...`);
      }
      if (percent >= 40 && logsList.length === 4) {
        addLog(`🎙️ THIẾT QUÂN LUẬT: Giới hạn tối đa 01 người nói (Single Speaker) trong mỗi phân cảnh.`);
      }
      if (percent >= 50 && logsList.length === 5) {
        addLog(`🎭 Phân vai đa nhân vật thay phiên cất tiếng qua các cảnh để đảm bảo sinh động...`);
      }
      if (percent >= 60 && logsList.length === 6) {
        addLog(`📸 Đang biên soạn câu lệnh về ảnh (image_prompt) 8K siêu thực...`);
      }
      if (percent >= 70 && logsList.length === 7) {
        addLog(`🎬 Đang thiết kế chuyển động video Stop-Motion mượt mà và vật lý chân thực...`);
      }
      if (percent >= 78 && logsList.length === 8) {
        addLog(`🔊 Tổng hợp bản đồ âm thanh tương tác vật lý & tiếng động cơ học ASMR...`);
      }
      if (percent >= 84 && logsList.length === 9) {
        addLog(`🛡️ Phân tích vật liệu để tự động kích hoạt bộ lọc Silent COPPA (Cảnh báo an toàn câm)...`);
      }
      if (percent >= 90 && logsList.length === 10) {
        addLog(`📦 Đang đóng gói cấu trúc JSON phân cảnh đạt chuẩn V16.5 Failsafe...`);
      }
      if (percent >= 95 && logsList.length === 11) {
        addLog(`📡 Đang chờ kết quả phản hồi gói tin kịch bản từ Máy chủ AI...`);
      }
    }, 350);

    try {
      const styleObj = VISUAL_STYLES.find(s => s.id === style);
      const mk = TARGET_MARKETS[market] || TARGET_MARKETS['vn_kids_young'];
      
      let styleContext = styleObj?.name || 'Auto';
      if (style === 'english_learning_duo') {
        const topicObj = ENGLISH_TOPICS.find(t => t.id === englishTopic);
        const contexts = MICRO_CONTEXTS[englishTopic] || ['Trong phòng học'];
        const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
        const randomProp = RANDOM_PROPS[Math.floor(Math.random() * RANDOM_PROPS.length)];
        const randomMood = RANDOM_MOODS[Math.floor(Math.random() * RANDOM_MOODS.length)];
        const randomAction = RANDOM_INTERACTIONS[Math.floor(Math.random() * RANDOM_INTERACTIONS.length)];
        
        styleContext += `
- FOCUSED ENGLISH TOPIC: ${topicObj?.label}.
- MICRO-CONTEXT (CRITICAL): ${randomContext}.
- UNIQUE PROP (CỐT YẾU ĐỂ KHÁC BIỆT): Sử dụng đồ vật "${randomProp}" để tương tác.
- TONE & MOOD: ${randomMood}.
- ĐIỂM NHẤN TƯƠNG TÁC (CUỐI VIDEO): Hai mẹ con thực hiện hành động "${randomAction}".

[NARRATIVE & DIALOGUE ENFORCEMENT - LỆNH THÉP CHO HỘI THOẠI MẸ & CON]:
1. LUÂN PHIÊN NHÂN VẬT: Mẹ nói ở Cảnh lẻ (1, 3, 5...), Con nói ở Cảnh chẵn (2, 4, 6...). Tuyệt đối không cho 2 người cùng nói trong 1 cảnh.
2. TÍNH CÁCH CON (BIN/BO/BÉ...): Phải lém lỉnh, biểu cảm sống động, thích hành động và có tư duy liên hệ thực tế không phải robot nhại lại.
3. NGÔN NGỮ: Mẹ sử dụng Song Ngữ (tiếng Việt để gợi ý, pha một chút tiếng Anh tự nhiên). Con phát âm tiếng Anh, thỉnh thoảng có phản xạ sai đáng yêu rồi tự sửa.
4. CỐT TRUYỆN 3 HỒI:
   - Mở đầu (The Hook): Mẹ đưa ra đạo cụ hoặc tình huống gây tò mò.
   - Phát triển: Mẹ dạy từ vựng, con tương tác và lặp lại kết hợp hành động cơ thể.
   - Kết thúc: Mẹ và con thực hiện hành động tương tác (High-five/High-ten...) và Mẹ có 1 câu CTA tương tác nhẹ nhàng tới khán giả (ví dụ "Các bạn thấy [Tên con] có giỏi không?").`;
      }

      // 1. Calculate the total requested scenes
      const totalScenes = Math.ceil((Math.max(0.1, targetDuration) * 60) / secondsPerScene);

      // 2. Define safe chunk size: 25 scenes per round
      const chunkSize = 25;
      const totalRounds = Math.ceil(totalScenes / chunkSize);

      let allSegments: any[] = [];
      let finalSuggestedStyle = styleObj?.id || 'auto';
      let finalCharacterLock = '';
      let coppaText = '';

      // 3. Process incrementally in rounds to guarantee system memory and API stability
      for (let round = 1; round <= totalRounds; round++) {
        const startSceneNum = (round - 1) * chunkSize + 1;
        const endSceneNum = Math.min(round * chunkSize, totalScenes);
        const roundSceneCount = endSceneNum - startSceneNum + 1;

        addLog(`🚀 [Đợt ${round}/${totalRounds}] Đang tiến hành kết tạo phân cảnh ${startSceneNum} đến ${endSceneNum}...`);

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
TARGET_LANGUAGE: ${mk.voice_lang}
TARGET_MARKET: ${mk.name}
VISUAL_STYLE: ${styleContext}
[ANTI-REPETITION SEED]: ${randomSeed}${continuityContext}
CRITICAL LANGUAGE RULES:
1. SYSTEM/UI LANGUAGE: Write all director notes, visual descriptions (visual_desc_vi), and JSON keys in Vietnamese.
2. SCRIPT NATIVE LANGUAGE: The actual spoken dialogue ("voice_text" field) MUST be written entirely in the TARGET_LANGUAGE (${mk.voice_lang}) with natural phrasing for the ${mk.name} market.
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
          if (json.character_lock_prompt) finalCharacterLock = json.character_lock_prompt;
          if (json.coppa_disclaimer) coppaText = json.coppa_disclaimer;
        }

        // Standardize output structure
        roundSegs = roundSegs.map((s: any, idx: number) => {
          const calculatedNum = startSceneNum + idx;
          const min = Math.floor(((calculatedNum - 1) * secondsPerScene) / 60);
          const secStart = ((calculatedNum - 1) * secondsPerScene) % 60;
          const secEnd = (calculatedNum * secondsPerScene) % 60;
          const minEnd = Math.floor((calculatedNum * secondsPerScene) / 60);
          
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
            video_prompt: s.video_prompt?.includes('Visual Style:') ? s.video_prompt : `${s.video_prompt} ${enforce}`,
            image_prompt: s.image_prompt?.includes('Visual Style:') ? s.image_prompt : `${s.image_prompt} ${enforce}`,
          }));
        }

        // === REALITY ANCHOR FAILSAFE (ANTI-TEXT, ANTI-GHOSTING & PERFECT CRAFT) ===
        const imageAnatomyFailsafe = "8k resolution, highly detailed, sharp focus, masterpiece, raw photo of physical miniature model, clean textless image, blank background, pure craft showcase, (perfect human anatomy:1.2), exactly two arms, exactly two legs, perfect hands, --no text, words, letters, watermark, font, writing, typography, subtitles, burned-in text, captions, lyrics, lower thirds, signature, logo, banner, signs, labels, floating head, creepy face in background, double exposure, phantom face, blurry person, extra faces, mutated limbs, bad anatomy, poster, book cover, movie poster";
        // VEO3 AUTO-SHIELD PROTOCOL - Comprehensive video render failsafe
        const videoAnatomyFailsafe = "8k resolution, highly detailed, sharp focus, masterpiece, raw physical stop-motion miniature craft, clean textless footage, blank background, pure craft showcase, perfect human anatomy, exactly two arms, exactly two legs, perfect hands, smooth physical movement, cinematic studio lighting, ABSOLUTE TEMPORAL COHERENCE, slow and deliberate movements, sharp object borders, clear anatomical structure, anti-ghosting, high-fidelity motion vector, no motion blur, static directional lighting, shadow coordinates locked, no ambient flickering, permanently static background props, locked arrangement of objects, realistic ground friction, solid footing, zero sliding, no moonwalking, perfect limb separation, no clipping or hand fusion, no cinematic vignettes, uncropped full-frame lens, strict frame-to-frame clothing consistency, wardrobe locked across all scenes, perfect facial symmetry, identical symmetric circular pupils, unified wind vector physics, strict character count persistence, no ghost characters generated, ABSOLUTELY ZERO TEXT letters watermarks graphic overlays, strictly FULL FRAME no black bars";
        
        roundSegs = roundSegs.map((s: any) => ({
          ...s,
          video_prompt: s.video_prompt?.includes('perfect human anatomy') ? s.video_prompt : `${s.video_prompt}, ${videoAnatomyFailsafe}`,
          image_prompt: s.image_prompt?.includes('perfect human anatomy') ? s.image_prompt : `${s.image_prompt}, ${imageAnatomyFailsafe}`,
        }));

        allSegments = [...allSegments, ...roundSegs];
      }

      // 4. Merge all rounds
      const finalJson = {
        mode_detected: targetDuration < 3 ? "Quick Craft" : targetDuration <= 10 ? "Story Weaver" : "Epic Folklore",
        suggested_style: finalSuggestedStyle,
        character_lock_prompt: finalCharacterLock,
        script: allSegments,
        coppa_disclaimer: coppaText || "Video này chứa tính chất sáng tạo DIY nghệ thuật cao."
      };

      // Hoàn tất thành công
      clearInterval(interval);
      setLoadingPercent(100);
      setLoadingStep(5);
      addLog(`✨ Giả Kim Thuật hoàn tất! Kịch bản đã được dệt thành công với tổng số ${allSegments.length} phân cảnh.`);
      await new Promise(r => setTimeout(r, 600));

      setScriptData(finalJson);
      setSegments(allSegments);
      localStorage.setItem('recycle_autosave_script', JSON.stringify({ segments: allSegments, scriptData: finalJson, topic }));
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
    const text = segments.map(s => s.chapter_voice_block || s.voice_text).join('\n\n');
    navigator.clipboard.writeText(text);
    showToast('✅ Đã copy voice toàn bộ', 'success');
  };

  // === MASTER COMMAND V16.0: AUDIO RE-ENGINEERING ===
  const handleAudioReengineering = async () => {
    if (segments.length === 0) return showToast('Chưa có kịch bản để tinh chỉnh!');
    
    setRefiningAudio(true);
    setLoading(true); // Kích hoạt overlay console tiến trình
    setLoadingType('audio');
    setLoadingStep(1);
    setLoadingPercent(0);
    setLoadingLogs([]);

    // Khởi động mô phỏng tiến trình phân tích âm thanh thời gian thực
    let percent = 0;
    const logsList: string[] = [];
    const addLog = (msg: string) => {
      logsList.push(msg);
      setLoadingLogs([...logsList]);
    };

    addLog('🎙️ Khởi động hệ thống Tái Cấu Trúc Thanh Âm V16.0...');

    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 4) + 3; // Tăng mượt 3-6% mỗi lần
      if (percent > 98) percent = 98;
      setLoadingPercent(percent);

      // Định tuyến các bước âm thanh
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

      // Đẩy log âm học ngẫu nhiên theo tiến đ�?
      if (percent >= 10 && logsList.length === 1) {
        addLog(`📂 Đã tải thành công danh sách ${segments.length} phân cảnh đầu vào.`);
      }
      if (percent >= 22 && logsList.length === 2) {
        addLog(`🎭 Đang phân vai giọng nói gốc & tối ưu hóa biểu cảm tiếng Việt...`);
      }
      if (percent >= 32 && logsList.length === 3) {
        addLog(`🎙�?THIẾT QUÂN LUẬT: Kiểm chứng tối đa 01 người nói (Single Speaker) trên 8 giây thoại.`);
      }
      if (percent >= 45 && logsList.length === 4) {
        addLog(`🗣�?Thiết lập cơ ch�?xoay tua đa nhân vật thay phiên cất tiếng nói sinh động...`);
      }
      if (percent >= 58 && logsList.length === 5) {
        addLog(`🔊 Đang tạo dải tần âm học (voice_profile) và phân biệt ON-SCREEN / OFF-SCREEN...`);
      }
      if (percent >= 70 && logsList.length === 6) {
        addLog(`�?Cấu trúc âm thanh tương tác vật lý ASMR ph�?liệu thích ứng chất liệu...`);
      }
      if (percent >= 80 && logsList.length === 7) {
        addLog(`💥 Tích hợp hiệu ứng âm thanh tiếng động bùng n�?(sfx_music_suggestion) sắc nét...`);
      }
      if (percent >= 88 && logsList.length === 8) {
        addLog(`🛡�?Áp dụng cơ ch�?Silent Disclaimer cho cảnh báo an toàn tr�?em (COPPA)...`);
      }
      if (percent >= 94 && logsList.length === 9) {
        addLog(`📡 Đang truyền tải gói tin kết qu�?âm học JSON refined_scenes v�?client...`);
      }
    }, 280);

    try {
      const payload = segments.map(s => ({
        scene_number: s.scene_number,
        dialogues: s.dialogues || [],
        voice_text: s.voice_text || s.chapter_voice_block || '',
        voice_profile: s.voice_profile || null,
        visual_context: s.visual_desc_vi || s.visual_desc || '',
        section: s.section || '',
        character: s.character || '',
        time: s.time || '',
        sfx_music_suggestion: s.sfx_music_suggestion || ''
      }));
      const prompt = `KICH BAN GOC (${payload.length} scenes):\n${JSON.stringify(payload, null, 2)}\n\nTINH CHINH THANH AM, LOI THOAI DA NHAN VAT. \n\nCRITICAL LANGUAGE RULES:\n1. SYSTEM LANGUAGE: Write all director notes and "sfx_music_suggestion" in Vietnamese.\n2. SCRIPT NATIVE LANGUAGE: The "voice_text" MUST be written entirely in the TARGET_LANGUAGE (${TARGET_MARKETS[market].voice_lang}) to match the local market. OUTPUT JSON.`;
      const res = await callAI(prompt, SYSTEM_PROMPT_AUDIO_REENGINEERING);
      
      // --- HIGHLY RESILIENT AUDIO JSON PARSER V16.0 ---
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

        // Hoàn tất thành công
        clearInterval(interval);
        setLoadingPercent(100);
        setLoadingStep(5);
        addLog(`�?Tinh chỉnh thanh âm hoàn tất! Toàn b�?phân cảnh đã được nâng cấp bùng n�?`);
        await new Promise(r => setTimeout(r, 600));

        setSegments(newSegments);
        if (onAudioRefined) onAudioRefined(newSegments, topic);
        else onScriptGenerated(newSegments, '', topic);
        setAudioRefinedCount(prev => prev + 1);
        showToast('🎙�?Kịch bản âm thanh & hội thoại đã được nâng cấp đỉnh cao!', 'success');
      } else {
        throw new Error('AI không tr�?v�?d�?liệu thanh âm đúng cấu trúc.');
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
          localStorage.setItem('recycle_autosave_script', JSON.stringify({ segments: data.segments, scriptData: { suggested_style: 'auto' }, topic: data.topic }));
          showToast('�?Đã khôi phục d�?án thành công!', 'success');
        } else {
          showToast('File d�?án không hợp l�?');
        }
      } catch (err) {
        showToast('Lỗi đọc file JSON d�?án!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2"><i className="fa-solid fa-scroll text-teal-500" /> Soan Kich Ban Truyen Co - Kids Cartoon &amp; Education</span>
          <label className="cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-900/20 text-amber-300 border border-amber-500/30 hover:bg-amber-900/40 transition-all flex items-center gap-2">
            <i className={"fa-solid fa-folder-open"} /> Mo Du An (.json)
            <input type="file" accept=".json" className="hidden" onChange={handleImportProject} />
          </label>
        </h2>
        <div className="space-y-4">
          <div className="relative mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Chu De Truyen</label>
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
                title="AI đ�?xuất phong cách phù hợp">
                {loadingSuggestion ? <><i className={"fa-solid fa-sync animate-spin"} /> Dang phan tich...</> : <><i className={"fa-solid fa-magic"} /> Goi Y Phong Cach (AI)</>}
              </button>
            </div>
          </div>

          {/* AI Style Suggestion Card */}
          {suggestedStyle && (
            <div className="bg-gradient-to-r from-amber-900/15 to-teal-900/15 border border-amber-500/30 rounded-xl p-4 animate-[slideIn_0.3s_ease-out]">
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-wand-magic-sparkles text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase">AI De Xuat Phong Cach</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#0a0e14]/30 p-3 rounded-lg border border-amber-500/20">
                  <div className="text-[10px] text-amber-300 mb-1 font-bold">🏆 ĐỀ XUẤT CHÍNH</div>
                  <div className="text-sm font-bold text-white mb-1">{VISUAL_STYLES.find(s => s.id === suggestedStyle.recommended_style)?.name || suggestedStyle.recommended_style}</div>
                  <div className="text-[10px] text-slate-400">{suggestedStyle.reason}</div>
                </div>
                {suggestedStyle.alternative_style && (
                  <div className="bg-[#0a0e14]/30 p-3 rounded-lg border border-teal-500/20">
                    <div className="text-[10px] text-teal-300 mb-1 font-bold">THAY THE STYLE</div>
                    <div className="text-sm font-bold text-white mb-1">{VISUAL_STYLES.find(s => s.id === suggestedStyle.alternative_style)?.name || suggestedStyle.alternative_style}</div>
                    <div className="text-[10px] text-slate-400">{suggestedStyle.alternative_reason}</div>
                    <button onClick={() => { setStyle(suggestedStyle.alternative_style); showToast('Da chon style thay the', 'info'); }}
                      className="mt-2 text-[10px] text-teal-400 hover:underline flex items-center gap-1">
                      <i className={"fa-solid fa-arrow-right"} /> Dung style nay
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
                    if (num > 10) {
                      showToast('⚠️ Giới hạn thời lượng tối đa là 10 phút!', 'warning');
                      setDuration(10);
                    } else {
                      setDuration(val);
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
                
                <div className="flex flex-col gap-1.5 w-32">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GIAY/CANH</label>
                    <button 
                      onClick={() => { setIsCustomDuration(!isCustomDuration); if (isCustomDuration) setSecondsPerScene(8); }}
                      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${isCustomDuration ? "bg-teal-500" : "bg-slate-700"}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isCustomDuration ? "translate-x-4" : "translate-x-1"}`} />
                    </button>
                  </div>
                  {isCustomDuration ? (
                    <input 
                      type="number" 
                      value={secondsPerScene} 
                      onChange={e => setSecondsPerScene(Math.max(1, parseInt(e.target.value) || 8))}
                      className="w-full bg-[#0a0e14] border border-teal-500/50 rounded-lg p-1.5 text-sm font-bold text-teal-300 text-center outline-none focus:ring-1 focus:ring-teal-500" 
                    />
                  ) : (
                    <div className="w-full bg-[#0a0e14]/50 border border-slate-700/50 rounded-lg p-1.5 text-sm font-bold text-slate-500 text-center">
                      8
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div><span className="text-slate-500">So canh:</span> <span className="font-bold text-green-400 text-base">~{scenes} Canh</span></div>
                  <div><span className="text-slate-500">Voice:</span> <span className="font-bold text-teal-400 text-base">~{words} tu</span></div>
                </div>
              </div>
            </div>
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><i className={"fa-solid fa-globe text-amber-400"} /> THI TRUONG</label>
              <select value={market} onChange={e => setMarket(e.target.value)} className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
                {Object.values(TARGET_MARKETS).map(m => <option key={m.id} value={m.id}>{m.flag} {m.name}</option>)}
              </select>
            </div>
          </div>
          <div className={`border rounded-xl p-4 transition-all ${modeColor}`}>
            <div className="font-bold">{mode.name}</div>
          </div>
          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-palette text-amber-400" /> PHONG CACH VISUAL KIDS</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {VISUAL_STYLES.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  className={`text-[10px] p-2 rounded border text-left transition-all ${style === s.id ? 'bg-amber-900/30 border-amber-500/50 text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-[#12161e] border-slate-700/30 text-slate-400 hover:bg-[#1e2230]'}`}>
                  <div className="font-bold mb-0.5">{s.name}</div>
                  <div className="text-[9px] opacity-70 truncate">{s.desc}</div>
                </button>
              ))}
            </div>
            {style === 'english_learning_duo' && (
              <div className="mt-4 pt-4 border-t border-slate-700/50 animate-[slideIn_0.3s_ease-out]">
                <label className="text-xs font-bold text-teal-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-book-open text-teal-400" /> CHỌN NGÁCH HỌC TIẾNG ANH (SUB-TOPIC)</label>
                <select value={englishTopic} onChange={e => setEnglishTopic(e.target.value)} className="w-full bg-[#0a0e14] border border-teal-500/50 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
                  {ENGLISH_TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
            )}
          </div>
          {/* HIGH-TECH CYBERNETIC PROGRESS TERMINAL CONSOLE - BẢNG TIẾN TRÌNH TRỰC QUAN */}
          {loading && (
            <div className="bg-[#0a0e14] border border-teal-500/30 rounded-xl p-5 space-y-4 animate-[slideIn_0.3s_ease-out] shadow-[0_0_30px_rgba(20,184,166,0.1)] relative overflow-hidden">
              {/* Hiệu ứng đường quét laser chạy quét dọc */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-[scan_2s_linear_infinite]" />
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider font-mono">
                    {loadingType === 'script' ? 'REC-ALCHEMIST V16.0 SCRIPT PROCESSOR' : 'REC-ALCHEMIST V16.0 AUDIO RE-ENGINEER'}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-teal-400">{loadingPercent}%</div>
              </div>

              {/* Stepper Steps - Các bước chạy thực t�?*/}
              <div className="grid grid-cols-5 gap-2 text-center">
                {(loadingType === 'script'
                  ? [
                      { step: 1, label: 'Khởi Động' },
                      { step: 2, label: 'Drama Cốt Truyện' },
                      { step: 3, label: 'Visual & SFX' },
                      { step: 4, label: 'Lọc COPPA' },
                      { step: 5, label: 'Xuất JSON' }
                    ]
                  : [
                      { step: 1, label: 'Khởi Động' },
                      { step: 2, label: 'Thoại Phân Vai' },
                      { step: 3, label: 'ASMR Ph�?Liệu' },
                      { step: 4, label: 'Nhạc & Tiếng Động' },
                      { step: 5, label: 'Xuất Audio JSON' }
                    ]
                ).map((s) => {
                  const isActive = loadingStep === s.step;
                  const isDone = loadingStep > s.step;
                  return (
                    <div key={s.step} className="space-y-1">
                      <div className={`h-1.5 rounded-full transition-all duration-500 ${isDone ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]' : isActive ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-slate-800'}`} />
                      <div className={`text-[8px] sm:text-[9px] font-bold truncate ${isDone ? 'text-teal-400' : isActive ? 'text-amber-400' : 'text-slate-500'}`}>
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rolling Console logs - Dòng nhật ký Terminal trực quan */}
              <div className="bg-black/90 rounded-lg p-3 h-32 overflow-y-auto font-mono text-[10px] text-green-400/90 space-y-1 border border-slate-800/80 scrollbar-thin scrollbar-thumb-slate-800 select-none">
                {loadingLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed animate-[fadeIn_0.15s_ease-out]">
                    <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          )}

          {/* GENERATE BUTTON */}
          <button onClick={handleGenerate} disabled={loading || refiningAudio}
            className="w-full py-4 bg-teal-900/50 hover:bg-teal-800/50 border border-teal-500/30 text-teal-100 font-bold rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.15)] flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {loading && loadingType === 'script' ? (
              <>DANG BIEN SOAN KICH BAN CO TICH ({loadingPercent}%)...</>
            ) : (
              <>KIEN TAO KICH BAN CO TICH</>
            )}
          </button>

          {/* === MASTER COMMAND V16.0: AUDIO RE-ENGINEERING BUTTON === */}
          {segments.length > 0 && (
            <button onClick={handleAudioReengineering} disabled={loading || refiningAudio}
              className="w-full py-4 bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-purple-900/50 hover:from-purple-800/50 hover:to-purple-800/50 border border-purple-500/30 text-purple-100 font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.15)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading && loadingType === 'audio' ? (
                <><i className="fa-solid fa-sync animate-spin" /> 🎙�?ĐANG TÁI CẤU TRÚC THANH ÂM ({loadingPercent}%)...</>
              ) : (
                <><i className={"fa-solid fa-headphones"} /> TINH CHINH THANH AM (V16.0){audioRefinedCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-600 text-[9px] font-bold">x{audioRefinedCount}</span>}</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Script Results */}
      {segments.length > 0 && (
        <div className="space-y-4 pb-10">
          {scriptData?.coppa_disclaimer && (
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-xl flex items-start gap-3">
              <i className="fa-solid fa-shield-halved text-red-500 mt-0.5 text-lg" />
              <div>
                <div className="text-xs font-bold text-red-400 mb-1 uppercase">CANH BAO AN TOAN TRE EM (COPPA)</div>
                <div className="text-xs text-red-200/80">{scriptData.coppa_disclaimer}</div>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center px-2">
            <div className="text-xs text-slate-500 font-bold">Da tao: {segments.length} Phan Canh Thu Cong</div>
            <button onClick={copyAll} className="text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 bg-white text-black hover:bg-slate-200"><i className={"fa-solid fa-copy"} /> Copy Voice Toan Bo</button>
          </div>
          {segments.map((seg, idx) => (
            <SceneCard key={idx} seg={seg} idx={idx} />
          ))}

          {/* CHUYỂN SANG BƯỚC CH�?TÁC VIDEO (CRAFT STUDIO) */}
          {onNavigateToStudio && (
            <div className="pt-6 flex justify-center animate-bounce">
              <button 
                onClick={onNavigateToStudio}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-black text-sm rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-3 transition-all hover:scale-105 border-2 border-white/20 uppercase tracking-wider"
              >
                <span>Chuyen Sang Studio Che Tac Video (Buoc 3)</span>
                <i className="fa-solid fa-arrow-right text-lg" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScriptModule;
