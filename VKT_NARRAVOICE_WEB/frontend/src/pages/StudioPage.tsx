import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CLOUD_URL = "https://vkt-audio-backend.onrender.com";
const MAX_CHARS = 60000;
const WARN_CHARS = 45000;
const VERSION = "v1.9.21";

const STYLES: Record<string, { name: string; rate: number; pitch: number; reverb: number; echo: number; bass: number }> = {
  'podcast':    { name: '🎙️ Podcast / Bản tin (Chuẩn)',      rate: 0,   pitch: 0,  reverb: 5,  echo: 0,  bass: 15 },
  'story':      { name: '📚 Kể chuyện / Tâm sự đêm khuya',   rate: -15, pitch: -5, reverb: 20, echo: 5,  bass: 10 },
  'news':       { name: '📰 Thời sự / Tin tức trang trọng',   rate: 10,  pitch: -2, reverb: 0,  echo: 0,  bass: 5  },
  'commercial': { name: '🚀 Quảng cáo / Khuyến mãi',          rate: 25,  pitch: 10, reverb: 10, echo: 0,  bass: 25 },
  'review':     { name: '🍿 Review phim siêu tốc',             rate: 40,  pitch: 5,  reverb: 0,  echo: 0,  bass: 10 },
  'drama':      { name: '🎭 Hồi hộp / Drama bí ẩn',           rate: -10, pitch:-10, reverb: 40, echo: 15, bass: 30 },
  'documentary':{ name: '📺 Phóng sự Khoa học / Tài liệu',    rate: -10, pitch: -5, reverb: 20, echo: 0,  bass: 25 },
  'kids':       { name: '👼 Kể chuyện Cổ tích / Thiếu nhi',  rate: 0,   pitch: 15, reverb: 10, echo: 0,  bass: 5  },
  'loudspeaker':{ name: '📢 Loa Phát Thanh / Hiện trường',    rate: 0,   pitch: 5,  reverb: 40, echo: 40, bass: 10 },
  'audiobook':  { name: '🎧 Đọc Sách Nói / Thiền định',       rate: -5,  pitch: -2, reverb: 10, echo: 0,  bass: 20 },
};

interface JobHistoryItem {
  jobId: string;
  scriptSnippet: string;
  voiceName: string;
  timestamp: number;
}

const SearchableSelect = ({ options, value, onChange, placeholder }: { options: {id:string,name:string}[], value: string, onChange: (v:string)=>void, placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedItem = options.find(o => o.id === value);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) { setIsOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = options.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div ref={wrapperRef} className="relative w-full">
      <input type="text"
        className="w-full bg-gray-800 border border-gray-600 rounded-md pl-3 pr-8 py-2 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm focus:outline-none cursor-text"
        placeholder={isOpen ? "Nhập để tìm..." : placeholder}
        value={isOpen ? search : (selectedItem?.name || '')}
        onChange={e => { if (!isOpen) setIsOpen(true); setSearch(e.target.value); }}
        onClick={() => { setIsOpen(true); setSearch(''); }}
      />
      <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none text-xs">▼</div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
          {filtered.length > 0 ? filtered.map(opt => (
            <div key={opt.id}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${opt.id === value ? 'bg-blue-600 text-white font-medium' : 'text-gray-200 hover:bg-gray-700'}`}
              onClick={() => { onChange(opt.id); setIsOpen(false); setSearch(''); }}>
              {opt.name}
            </div>
          )) : <div className="px-3 py-2 text-sm text-gray-500 italic">Không tìm thấy kết quả...</div>}
        </div>
      )}
    </div>
  );
};

const LONG_GREETINGS: Record<string, string> = {
  "vi": `Chào mừng bạn đến với hệ thống thu âm tự động VKT.
Đây là một nền tảng tiên tiến sử dụng công nghệ AI để tạo ra những giọng đọc truyền cảm và tự nhiên nhất.
Bạn có thể tùy chỉnh tốc độ, cao độ, tiếng vang và nhiều thông số khác để phù hợp với nhu cầu của mình.
Hãy thử gõ một đoạn văn bản vào đây và nhấn nút "Nghe thử" hoặc "Bắt đầu tạo Audio" nhé.
Chúc bạn có những trải nghiệm tuyệt vời cùng VKT Ecosystem!`,
  "en": `Welcome to the VKT automated voice recording system.
This is an advanced platform using AI technology to generate the most expressive and natural voices.
You can customize the speed, pitch, echo, and many other parameters to fit your needs.
Try typing a paragraph here and click the "Preview" or "Start Creating Audio" button.
We wish you a wonderful experience with the VKT Ecosystem!`,
  "zh": `欢迎来到 VKT 自动语音合成系统。
这是一个利用人工智能技术生成最具表现力和自然语音的先进平台。
您可以自定义语速、音高、回声以及许多其他参数，以满足您的需求。
请在这里输入一段文本，然后点击“试听”或“开始生成音频”按钮。
祝您在 VKT 生态系统中拥有美妙的体验！`,
  "ja": `VKTの自動音声合成システムへようこそ。
これはAI技術を利用して、最も表現豊かで自然な音声を生成する高度なプラットフォームです。
ニーズに合わせて、話す速度、ピッチ、エコーなど多くのパラメータをカスタマイズできます。
ここにテキストを入力し、「プレビュー」または「オーディオ作成開始」ボタンをクリックしてみてください。
VKTエコシステムで素晴らしい体験をお楽しみください！`,
  "ko": `VKT 자동 음성 합성 시스템에 오신 것을 환영합니다.
이것은 AI 기술을 활용하여 가장 풍부하고 자연스러운 음성을 생성하는 첨단 플랫폼입니다.
사용자의 필요에 맞게 속도, 피치, 에코 및 기타 여러 매개변수를 편집할 수 있습니다.
여기에 텍스트를 입력하고 '미리듣기' 또는 '오디오 생성 시작' 버튼을 클릭해 보세요.
VKT 생태계와 함께 멋진 경험을 하시길 바랍니다!`,
  "hi": `VKT स्वचालित वॉयस रिकॉर्डिंग सिस्टम में आपका स्वागत है।
यह एक उन्नत मंच है जो सबसे अभिव्यंजक और प्राकृतिक आवाज़ें उत्पन्न करने के लिए AI तकनीक का उपयोग करता है।
आप अपनी आवश्यकताओं के अनुसार गति, पिच, गूंज और कई अन्य मापदंडों को अनुकूलित कर सकते हैं।
यहां एक पैराग्राफ टाइप करने का प्रयास करें और "पूर्वावलोकन" या "ऑडियो बनाना शुरू करें" बटन पर क्लिक करें।
हम कामना करते हैं कि VKT इकोसिस्टम के साथ आपका अनुभव शानदार हो!`,
  "fr": `Bienvenue dans le système d'enregistrement vocal automatisé VKT.
Il s'agit d'une plateforme avancée utilisant la technologie IA pour générer les voix les plus expressives et naturelles.
Vous pouvez personnaliser la vitesse, la hauteur, l'écho et de nombreux autres paramètres pour répondre à vos besoins.
Essayez de taper un paragraphe ici et cliquez sur le bouton "Aperçu" ou "Commencer à créer l'audio".
Nous vous souhaitons une merveilleuse expérience avec l'écosystème VKT !`,
  "es": `Bienvenido al sistema de grabación de voz automatizado VKT.
Esta es una plataforma avanzada que utiliza tecnología de IA para generar las voces más expresivas y naturales.
Puede personalizar la velocidad, el tono, el eco y muchos otros parámetros para satisfacer sus necesidades.
Intente escribir un párrafo aquí y haga clic en el botón "Vista previa" o "Comenzar a crear audio".
¡Le deseamos una experiencia maravillosa con el ecosistema VKT!`,
  "de": `Willkommen beim automatisierten Sprachaufzeichnungssystem von VKT.
Dies ist eine fortschrittliche Plattform, die KI-Technologie nutzt, um die ausdrucksstärksten und natürlichsten Stimmen zu generieren.
Sie können Geschwindigkeit, Tonhöhe, Echo und viele andere Parameter an Ihre Bedürfnisse anpassen.
Versuchen Sie hier, einen Absatz einzutippen, und klicken Sie auf die Schaltfläche "Vorschau" oder "Audioerstellung starten".
Wir wünschen Ihnen ein wunderbares Erlebnis mit dem VKT-Ökosystem!`,
  "ru": `Добро пожаловать в автоматизированную систему записи голоса VKT.
Это передовая платформа, использующая технологию ИИ для создания самых выразительных и естественных голосов.
Вы можете настроить скорость, высоту тона, эхо и многие другие параметры в соответствии с вашими потребностями.
Попробуйте ввести здесь абзац и нажмите кнопку «Предварительный просмотр» или «Начать создание аудио».
Желаем вам прекрасного опыта работы с экосистемой VKT!`,
  "ar": `مرحبًا بك في نظام تسجيل الصوت الآلي VKT.
هذه منصة متقدمة تستخدم تقنية الذكاء الاصطناعي لإنشاء الأصوات الأكثر تعبيرًا وطبيعية.
يمكنك تخصيص السرعة وطبقة الصوت والصدى والعديد من المعلمات الأخرى لتناسب احتياجاتك.
حاول كتابة فقرة هنا وانقر على زر "معاينة" أو "بدء إنشاء الصوت".
نتمنى لك تجربة رائعة مع نظام VKT البيئي!`,
  "pt": `Bem-vindo ao sistema automatizado de gravação de voz VKT.
Esta é uma plataforma avançada que usa tecnologia de IA para gerar as vozes mais expressivas e naturais.
Você pode personalizar a velocidade, o tom, o eco e muitos outros parâmetros para atender às suas necessidades.
Tente digitar um parágrafo aqui e clique no botão "Visualizar" ou "Começar a criar áudio".
Desejamos a você uma experiência maravilhosa com o ecossistema VKT!`,
  "id": `Selamat datang di sistem perekaman suara otomatis VKT.
Ini adalah platform canggih yang menggunakan teknologi AI untuk menghasilkan suara yang paling ekspresif dan alami.
Anda dapat menyesuaikan kecepatan, nada, gema, dan banyak parameter lainnya agar sesuai dengan kebutuhan Anda.
Coba ketik paragraf di sini dan klik tombol "Pratinjau" atau "Mulai Membuat Audio".
Kami berharap Anda mendapatkan pengalaman yang luar biasa dengan Ekosistem VKT!`,
  "th": `ยินดีต้อนรับสู่ระบบบันทึกเสียงอัตโนมัติ VKT
นี่คือแพลตฟอร์มขั้นสูงที่ใช้เทคโนโลยี AI เพื่อสร้างเสียงที่แสดงออกและเป็นธรรมชาติที่สุด
คุณสามารถปรับแต่งความเร็ว ระดับเสียง เสียงสะท้อน และพารามิเตอร์อื่นๆ อีกมากมายให้เหมาะกับความต้องการของคุณได้
ลองพิมพ์ย่อหน้าตรงนี้แล้วคลิกปุ่ม "ดูตัวอย่าง" หรือ "เริ่มสร้างเสียง"
เราขอให้คุณได้รับประสบการณ์ที่ยอดเยี่ยมกับระบบนิเวศ VKT!`,
  "ta": `VKT தானியங்கி குரல் பதிவு முறைக்கு உங்களை வரவேற்கிறோம்.
இது செயற்கை நுண்ணறிவு தொழில்நுட்பத்தைப் பயன்படுத்தி மிகவும் இயல்பான குரல்களை உருவாக்கும் ஒரு மேம்பட்ட தளமாகும்.
உங்கள் தேவைகளுக்கு ஏற்ப வேகம், சுருதி, எதிரொலி மற்றும் பல அளவுருக்களை நீங்கள் தனிப்பயனாக்கலாம்.
இங்கே ஒரு பத்தியைத் தட்டச்சு செய்து, "முன்னோட்டம்" அல்லது "ஆடியோவை உருவாக்கத் தொடங்கு" பொத்தானைக் கிளிக் செய்யவும்.
VKT சுற்றுச்சூழல் அமைப்புடன் உங்களுக்கு ஒரு அற்புதமான அனுபவம் கிடைக்க வாழ்த்துகிறோம்!`,
  "bn": `VKT স্বয়ংক্রিয় ভয়েস রেকর্ডিং সিস্টেমে স্বাগতম।
এটি একটি উন্নত প্ল্যাটফর্ম যা সবচেয়ে অভিব্যক্তিপূর্ণ এবং প্রাকৃতিক ভয়েস তৈরি করতে এআই প্রযুক্তি ব্যবহার করে।
আপনি আপনার প্রয়োজন অনুসারে গতি, পিচ, ইকো এবং আরও অনেক প্যারামিটার কাস্টমাইজ করতে পারেন।
এখানে একটি অনুচ্ছেদ টাইপ করার চেষ্টা করুন এবং "প্রিভিউ" বা "অডিও তৈরি শুরু করুন" বোতামে ক্লিক করুন।
আমরা আশা করি VKT ইকোসিস্টেমের সাথে আপনার একটি চমৎকার অভিজ্ঞতা হবে!`
};

export default function StudioPage() {
  const navigate = useNavigate();

  // === STATE ===
  const [script, setScript] = useState(() => localStorage.getItem('vkt_script') || LONG_GREETINGS['vi']);
  const [voiceGroups, setVoiceGroups] = useState<Record<string, {id:string,name:string}[]>>({});
  const [selectedMarket, setSelectedMarket] = useState(() => localStorage.getItem('vkt_market') || '🇻🇳 Tiếng Việt (Việt Nam)');
  const [selectedVoice, setSelectedVoice] = useState(() => localStorage.getItem('vkt_voice') || 'vi-VN-HoaiMyNeural');
  const [selectedStyle, setSelectedStyle] = useState(() => localStorage.getItem('vkt_style') || 'podcast');
  const [autoParams, setAutoParams] = useState({ rate: 0, pitch: 0, volume: 0, reverb: 5, echo: 0, bass: 15 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [showDictModal, setShowDictModal] = useState(false);
  const [customDict, setCustomDict] = useState<Record<string,string>>(() => {
    try { return JSON.parse(localStorage.getItem('vkt_dict') || '{}'); } catch { return {}; }
  });

  // === AUDIO REFS & ABORT CONTROLLER ===
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAbortCtrl = useRef<AbortController | null>(null);

  const [priorityToken, setPriorityToken] = useState<string>(() => localStorage.getItem('vkt_priority_token') || '');
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);


  const [history, setHistory] = useState<JobHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('vkt_audio_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);

    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false); // CHỈ HIỆN KHI MÁY HỖ TRỢ CÀI TỰ ĐỘNG

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };


  const handleLogoClick = () => {
    setLogoClicks(prev => prev + 1);
    if (logoClicks + 1 >= 3) {
      setShowAdmin(true);
      setLogoClicks(0);
    }
  };

  useEffect(() => {
    if (logoClicks > 0) {
      const timer = setTimeout(() => setLogoClicks(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [logoClicks]);

  // === LOAD VOICES ===
  useEffect(() => {
    fetch(`${CLOUD_URL}/api/voices?t=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        setVoiceGroups(data);
        const vnKey = Object.keys(data).find(k => k.includes('Tiếng Việt'));
        if (vnKey) setSelectedMarket(vnKey);
      })
      .catch(() => console.error("Không tải được danh sách giọng"));
  }, []);

  // === SYNC STYLE → PARAMS ===
  useEffect(() => {
    const s = STYLES[selectedStyle];
    if (s) setAutoParams({ rate: s.rate, pitch: s.pitch, volume: 0, reverb: s.reverb, echo: s.echo, bass: s.bass });
  }, [selectedStyle]);

  // === SYNC MARKET → VOICE ===
  useEffect(() => {
    const voices = voiceGroups[selectedMarket];
    if (voices && voices.length > 0) setSelectedVoice(voices[0].id);
  }, [selectedMarket, voiceGroups]);

  // === AUTO-TRANSLATE GREETING ===
  useEffect(() => {
    const prefix = selectedVoice.split('-')[0];
    const newGreeting = LONG_GREETINGS[prefix] || LONG_GREETINGS['en'];
    if (!script.trim() || Object.values(LONG_GREETINGS).includes(script)) {
      setScript(newGreeting);
    }
  }, [selectedVoice]);

  // === AUTO-STOP AUDIO WHEN CHANGING VOICE/MARKET ===
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.pause();
      if (previewAbortCtrl.current) previewAbortCtrl.current.abort();
      setIsPlaying(false);
    }
  }, [selectedVoice, selectedMarket]);

  // === AUTO-STOP AUDIO WHEN UNMOUNTING ===
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (previewAbortCtrl.current) {
        previewAbortCtrl.current.abort();
      }
    };
  }, []);

  // === PERSIST ===
  useEffect(() => { localStorage.setItem('vkt_script', script); }, [script]);
  useEffect(() => { localStorage.setItem('vkt_dict', JSON.stringify(customDict)); }, [customDict]);
  useEffect(() => { localStorage.setItem('vkt_market', selectedMarket); }, [selectedMarket]);
  useEffect(() => { localStorage.setItem('vkt_voice', selectedVoice); }, [selectedVoice]);
  useEffect(() => { localStorage.setItem('vkt_style', selectedStyle); }, [selectedStyle]);

  // === PREVIEW VOICE ===
  const handlePreview = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      if (previewAbortCtrl.current) previewAbortCtrl.current.abort();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    previewAbortCtrl.current = new AbortController();
    try {
      const previewText = script.trim().slice(0, 500) || LONG_GREETINGS[selectedVoice.split('-')[0]] || LONG_GREETINGS['vi'];
      
      const res = await fetch(`${CLOUD_URL}/api/preview`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice: selectedVoice, text: previewText, custom_dict: customDict, ...autoParams }),
        signal: previewAbortCtrl.current.signal
      });
      if (!res.ok) throw new Error('Lỗi API Preview');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };
      audio.play();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Ignored, user cancelled or changed voice
        return;
      }
      alert(`Lỗi khi nghe thử: ${err}`);
      setIsPlaying(false);
    }
  };

  // === RENDER ===
  const handleStartRender = async () => {
    if (!script.trim()) { alert("Vui lòng nhập kịch bản trước khi tạo audio!"); return; }
    if (script.length > MAX_CHARS) { alert(`Kịch bản quá dài (${script.length.toLocaleString()} ký tự). Tối đa ${MAX_CHARS.toLocaleString()} ký tự.`); return; }
    setIsRendering(true);
    try {
      const res = await fetch(`${CLOUD_URL}/api/render`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          script, 
          voice: selectedVoice, 
          env: 'none', 
          use_bgm: false, 
          custom_dict: customDict, 
          priority_token: priorityToken,
          ...autoParams 
        })
      });
      const data = await res.json();
      if (res.ok && data.job_id) {
        const newHistory = {
           jobId: data.job_id,
           scriptSnippet: script.trim().substring(0, 50) + '...',
           voiceName: selectedVoice,
           timestamp: Date.now()
        };
        const updatedHistory = [newHistory, ...history].slice(0, 20); // Lưu 20 job gần nhất
        setHistory(updatedHistory);
        localStorage.setItem('vkt_audio_history', JSON.stringify(updatedHistory));

        navigate(`/job/${data.job_id}`);
      } else {
        throw new Error(data.detail || 'Không nhận được Job ID');
      }
    } catch (err) {
      alert(`Lỗi: ${err}`);
      setIsRendering(false);
    }
  };

  // === AUTO-DETECT LANGUAGE ===
  const detectAndSetLanguage = (text: string) => {
    if (!text || text.length < 10) return;
    const sample = text.slice(0, 1000);
    
    const viRegex = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;
    const zhRegex = /[一-龥]/;
    const koRegex = /[가-힣]/;
    const jaRegex = /[぀-ヿ゠-ヿ]/;
    const ruRegex = /[Ѐ-ӿ]/;
    const thRegex = /[฀-๿]/;
    
    let detectedLang = 'Tiếng Anh';
    if (viRegex.test(sample)) detectedLang = 'Tiếng Việt';
    else if (zhRegex.test(sample)) detectedLang = 'Tiếng Trung';
    else if (koRegex.test(sample)) detectedLang = 'Tiếng Hàn';
    else if (jaRegex.test(sample)) detectedLang = 'Tiếng Nhật';
    else if (ruRegex.test(sample)) detectedLang = 'Tiếng Nga';
    else if (thRegex.test(sample)) detectedLang = 'Tiếng Thái';
    
    const matchingMarket = Object.keys(voiceGroups).find(k => k.includes(detectedLang));
    if (matchingMarket && matchingMarket !== selectedMarket) {
       setSelectedMarket(matchingMarket);
       const voices = voiceGroups[matchingMarket];
       if (voices && voices.length > 0) {
         setSelectedVoice(voices[0].id);
       }
    }
  };

  // === FILE UPLOAD ===
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
        alert("Vui lòng chỉ chọn file định dạng Text (.txt) để đảm bảo không bị lỗi font chữ!");
        return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string || '';
      setScript(content);
      detectAndSetLanguage(content);
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handleClearScript = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ kịch bản?")) setScript('');
  };

  // === COMPUTED ===
  const marketOptions = Object.keys(voiceGroups).map(k => ({ id: k, name: k }));
  const voiceOptions = (voiceGroups[selectedMarket] || []);
  const allowedStyles = priorityToken ? Object.keys(STYLES) : ['podcast', 'story', 'news'];
  const styleOptions = allowedStyles.map(id => ({ id, name: STYLES[id].name }));
  const charCount = script.length;
  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0;
  const charPct = Math.min((charCount / MAX_CHARS) * 100, 100);
  const isOverLimit = charCount > MAX_CHARS;
  const isWarning = charCount > WARN_CHARS;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0B0F19] text-gray-200 font-sans">
      {/* VIP ADMIN PANEL MODAL */}
      {showAdmin && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-gray-800 border border-blue-500/30 rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-all">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-blue-500">👑</span> Đặc Quyền Hệ Thống
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => { setPriorityToken('VKT_S1'); localStorage.setItem('vkt_priority_token', 'VKT_S1'); setShowAdmin(false); }}
                className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all ${priorityToken === 'VKT_S1' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-700/30 border-transparent text-gray-300 hover:bg-gray-700/60'} font-semibold`}
              >
                <div className="flex items-center gap-3">
                  <span>🚀</span> Hạng 1 (Tối Cao)
                </div>
                {priorityToken === 'VKT_S1' && <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>}
              </button>
              
              <button 
                onClick={() => { setPriorityToken('VKT_S2'); localStorage.setItem('vkt_priority_token', 'VKT_S2'); setShowAdmin(false); }}
                className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all ${priorityToken === 'VKT_S2' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-gray-700/30 border-transparent text-gray-300 hover:bg-gray-700/60'} font-semibold`}
              >
                <div className="flex items-center gap-3">
                  <span>⚡</span> Hạng 2 (Trợ Lý)
                </div>
                {priorityToken === 'VKT_S2' && <div className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></div>}
              </button>

              <button 
                onClick={() => { setPriorityToken(''); localStorage.removeItem('vkt_priority_token'); setShowAdmin(false); }}
                className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all ${priorityToken === '' ? 'bg-gray-600/30 border-gray-400 text-white' : 'bg-gray-700/30 border-transparent text-gray-400 hover:bg-gray-700/60'} font-semibold`}
              >
                <div className="flex items-center gap-3">
                  <span>👤</span> Khách Thường
                </div>
                {priorityToken === '' && <div className="w-3 h-3 bg-gray-400 rounded-full"></div>}
              </button>
            </div>

            <button 
              onClick={() => setShowAdmin(false)}
              className="mt-6 w-full p-3 rounded-xl font-bold text-gray-400 hover:text-white bg-gray-900 hover:bg-black transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {/* HEADER */}
      <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-gray-800 bg-gray-900/80 shrink-0 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-2 md:gap-3">
          <h1 
            onClick={handleLogoClick}
            className="text-lg md:text-xl font-extrabold text-white tracking-tight flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="text-blue-500">🎙️</span>
            <span className="hidden md:inline">NarraVoice Studio</span>
          </h1>
          <span className="px-2 py-0.5 rounded text-[10px] md:text-xs bg-blue-900/50 text-blue-400 font-mono border border-blue-800/50">{VERSION}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium border bg-blue-900/50 text-blue-400 border-blue-800/50">☁️ Đám mây</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-[10px] md:text-sm font-medium text-gray-400 hidden sm:block">Dán kịch bản ➔ Tinh chỉnh ➔ Nhận Audio</span>
          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-1.5 text-xs bg-blue-900/60 hover:bg-blue-800 text-blue-300 hover:text-white px-3 py-1.5 rounded-lg border border-blue-700/50 transition-colors shadow-sm"
          >
            <span>🕒</span>
            <span className="hidden sm:inline">Tủ Audio</span>
          </button>
          <button
            onClick={() => {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
              }
              caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
              setTimeout(() => { window.location.href = window.location.pathname + '?v=' + Date.now(); }, 300);
            }}
            title="Làm mới trang (cập nhật phiên bản mới)"
            className="flex items-center gap-1.5 text-xs bg-gray-700 hover:bg-gray-600 active:bg-gray-500 px-3 py-1.5 rounded-lg border border-gray-600 transition-colors text-gray-300 hover:text-white"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Làm mới</span>
          </button>
          <label className="cursor-pointer text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded border border-gray-600 transition-colors text-gray-300 hover:text-white">
            📂 Tải file lên
            <input type="file" accept=".txt,.md" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </header>

      {/* HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[9999] flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border-l border-gray-800 shadow-2xl w-full max-w-md h-full flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🕒</span> Tủ Audio Của Tôi
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-white text-3xl leading-none px-2">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <div className="text-4xl mb-3">👻</div>
                  <p>Bạn chưa tạo Audio nào trên máy này.</p>
                </div>
              ) : (
                history.map((h, i) => (
                  <div key={i} onClick={() => navigate(`/job/${h.jobId}`)} className="bg-gray-800 border border-gray-700 rounded-xl p-3 cursor-pointer hover:bg-gray-700 transition group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">{h.jobId}</span>
                      <span className="text-[10px] text-gray-500">{new Date(h.timestamp).toLocaleString('vi-VN')}</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2 mb-2 leading-relaxed">"{h.scriptSnippet}"</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span>🎙️</span> <span>{h.voiceName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {history.length > 0 && (
              <div className="p-4 border-t border-gray-800">
                <button 
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trên máy này?')) {
                      setHistory([]);
                      localStorage.removeItem('vkt_audio_history');
                    }
                  }}
                  className="w-full py-2.5 rounded-lg text-sm text-red-400 border border-red-900/50 hover:bg-red-900/20 transition"
                >
                  🗑️ Xóa toàn bộ lịch sử
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BODY */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-6 overflow-hidden md:overflow-visible">

        {/* CỘT TRÁI — SOẠN THẢO */}
        <div className="w-full md:flex-1 flex flex-col bg-gray-800 rounded-xl shadow-2xl border border-gray-700 min-h-[400px] md:h-[calc(100vh-100px)]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700 bg-gray-800/80 shrink-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="bg-blue-500 w-1.5 h-4 rounded-sm"></span> KỊCH BẢN
            </span>
          </div>
          <textarea
            className="flex-1 w-full bg-transparent resize-none p-4 text-gray-200 text-sm leading-relaxed focus:outline-none custom-scrollbar"
            placeholder="Dán hoặc gõ kịch bản vào đây..."
            value={script}
            onChange={e => setScript(e.target.value)}
            onPaste={e => {
              const pastedText = e.clipboardData.getData('text');
              detectAndSetLanguage(pastedText);
            }}
          />
          <div className="px-4 pt-2 shrink-0">
            <div className="flex justify-between text-xs mb-1">
              <span className={isOverLimit ? 'text-red-400 font-bold' : isWarning ? 'text-yellow-400' : 'text-gray-500'}>
                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} ký tự
                {isOverLimit && ' ⛔ QUÁ GIỚI HẠN'}
                {!isOverLimit && isWarning && ' ⚠️ Gần đến giới hạn'}
              </span>
              <span className="text-gray-500">~{Math.round(charCount / 150)} phút audio</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
              <div className={`h-1.5 rounded-full transition-all ${isOverLimit ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${charPct}%` }} />
            </div>
          </div>
          <div className="bg-gray-800/80 border-t border-gray-700/50 px-4 py-2 flex items-center justify-between text-xs text-gray-400 shrink-0">
            <div className="flex gap-4">
              <span><b className="text-gray-200">{wordCount.toLocaleString()}</b> Từ</span>
              <span><b className={isOverLimit ? 'text-red-400' : 'text-gray-200'}>{charCount.toLocaleString()}</b> Ký tự</span>
            </div>
            <div className="flex gap-4 items-center">
                            <label className="cursor-pointer hover:text-green-400 transition-colors flex items-center gap-1 font-medium px-2 py-1">
                📁 Tải file (.txt)
                <input type="file" accept=".txt,.md" className="hidden" onChange={handleFileUpload} />
              </label>
<button onClick={() => setShowDictModal(true)} className="hover:text-blue-400 bg-gray-700/50 hover:bg-gray-700 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors font-medium border border-gray-600/50">
                📖 Từ Điển
              </button>
              <button onClick={handleClearScript} className="hover:text-red-400 transition-colors flex items-center gap-1 font-medium px-2 py-1">
                🗑 Xoá
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI — THIẾT LẬP */}
        <div className="w-full md:w-[420px] flex flex-col bg-gray-800 rounded-xl shadow-2xl border border-gray-700 shrink-0 md:h-[calc(100vh-100px)]">
          <div className="flex-1 md:overflow-y-auto p-5 space-y-6 md:custom-scrollbar">

            {/* GIỌNG ĐỌC */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="bg-blue-500 w-1.5 h-4 rounded-sm"></span> LỰA CHỌN GIỌNG ĐỌC
              </h3>
              <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Thị trường / Ngôn ngữ</label>
                  <SearchableSelect options={marketOptions} value={selectedMarket} onChange={setSelectedMarket} placeholder="Tìm quốc gia (VD: Việt)" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Người đọc (Nam/Nữ)</label>
                  <div className="flex gap-2">
                    <div className="flex-1 min-w-0">
                      <SearchableSelect options={voiceOptions} value={selectedVoice} onChange={setSelectedVoice} placeholder="Tìm giọng đọc..." />
                    </div>
                    <button onClick={handlePreview}
                      className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 rounded-lg text-sm font-medium border transition-all ${isPlaying ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/50' : 'bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-gray-600 text-gray-200'}`}>
                      {isPlaying ? '⏹ Dừng' : '▶ Nghe'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CẢM XÚC KỊCH BẢN */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="bg-purple-500 w-1.5 h-4 rounded-sm"></span> CẢM XÚC KỊCH BẢN
              </h3>
              <SearchableSelect options={styleOptions} value={selectedStyle} onChange={setSelectedStyle} placeholder="Tìm phong cách..." />
            </div>

            {/* THÔNG SỐ */}
            <div className="space-y-4 pt-4 border-t border-gray-700/50">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="bg-green-500 w-1.5 h-4 rounded-sm"></span> THÔNG SỐ ĐẦU RA
                </h3>
                <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-800/50">Đã tự động Set</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 bg-gray-900/30 p-4 rounded-lg border border-gray-800">
                {[
                  { label: 'Tốc độ',     key: 'rate',   unit: '%',  min: -50, max: 50,  color: 'accent-blue-500' },
                  { label: 'Cao độ',     key: 'pitch',  unit: 'Hz', min: -50, max: 50,  color: 'accent-blue-500' },
                  { label: 'Âm lượng',   key: 'volume', unit: '%',  min: -50, max: 50,  color: 'accent-blue-500' },
                  { label: 'Tiếng Vang', key: 'reverb', unit: '%',  min: 0,   max: 100, color: 'accent-purple-500' },
                  { label: 'Tiếng Vọng', key: 'echo',   unit: '%',  min: 0,   max: 100, color: 'accent-purple-500' },
                  { label: 'Bass',       key: 'bass',   unit: '%',  min: 0,   max: 100, color: 'accent-purple-500' },
                ].map(({ label, key, unit, min, max, color }) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{label}</span>
                      <span className="font-mono text-gray-300">{(autoParams as any)[key]}{unit}</span>
                    </div>
                    <input type="range" min={min} max={max}
                      value={(autoParams as any)[key]}
                      onChange={e => setAutoParams({ ...autoParams, [key]: Number(e.target.value) })}
                      className={`w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer ${color}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NÚT TẠO AUDIO */}
          <div className="p-4 bg-gray-900 border-t border-gray-700">
            <button onClick={handleStartRender} disabled={isRendering || isOverLimit}
              className={`w-full py-4 flex items-center justify-center gap-2 text-white rounded-xl font-bold text-lg shadow-lg transition-all border focus:outline-none ${
                isOverLimit   ? 'bg-red-900/50 border-red-700 cursor-not-allowed opacity-80' :
                isRendering   ? 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-80' :
                'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-blue-400/20 shadow-blue-900/40 transform hover:-translate-y-0.5'
              }`}>
              {isOverLimit  ? <><span>⛔ Kịch bản quá dài</span></> :
               isRendering  ? <><span className="animate-spin">⏳</span><span>Đang xử lý...</span></> :
               <><span>🎙️</span><span>Bắt đầu tạo Audio</span></>}
            </button>
            {!isRendering && !isOverLimit && (
              <p className="text-center text-xs text-gray-600 mt-2">
                {charCount > 0 ? `Ước tính ~${Math.round(charCount / 150)} phút audio` : 'Dán kịch bản để bắt đầu'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* MODAL TỪ ĐIỂN */}
      {showDictModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">📖 Từ Điển Phát Âm</h2>
              <button onClick={() => setShowDictModal(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <p className="text-xs text-gray-400">Thêm từ → cách đọc để hệ thống phát âm đúng hơn.</p>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {Object.entries(customDict).map(([word, reading]) => (
                <div key={word} className="flex items-center gap-2 bg-gray-900/50 rounded p-2">
                  <span className="flex-1 text-sm text-gray-200">{word}</span>
                  <span className="text-gray-500">→</span>
                  <span className="flex-1 text-sm text-blue-300">{reading}</span>
                  <button onClick={() => { const d = { ...customDict }; delete d[word]; setCustomDict(d); }} className="text-red-400 hover:text-red-300 text-xs px-2">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input id="dict-word" className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-gray-200" placeholder="Từ gốc (VD: AI)" />
              <input id="dict-reading" className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-gray-200" placeholder="Cách đọc (VD: A.I.)" />
              <button onClick={() => {
                const w = (document.getElementById('dict-word') as HTMLInputElement)?.value.trim();
                const r = (document.getElementById('dict-reading') as HTMLInputElement)?.value.trim();
                if (w && r) { setCustomDict({ ...customDict, [w]: r }); (document.getElementById('dict-word') as HTMLInputElement).value = ''; (document.getElementById('dict-reading') as HTMLInputElement).value = ''; }
              }} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium">Thêm</button>
            </div>
          </div>
        </div>
      )}
    
      {/* PWA INSTALL BUTTON */}
      {isInstallable && (
        <button 
          onClick={handleInstallClick}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-[0_10px_40px_rgba(79,70,229,0.5)] flex items-center gap-2 animate-bounce border-2 border-indigo-400/50 z-50 transition-transform hover:scale-105"
        >
          📱 Cài Đặt Ứng Dụng Nhanh
        </button>
      )}
    </div>

  );
}
