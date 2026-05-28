// ==================================================================================
// CONFIGURATION & CONSTANTS — Dharma Studio
// Kịch bản chữa lành, triết lý nhân sinh, nhân quả Phật giáo
// ==================================================================================

export const MODELS = {
  text: "gemini-2.5-flash",
  image: "imagen-3.0-generate-002",
  openrouter_default: "google/gemini-2.0-flash-exp:free",
};

export const GOOGLE_LABS_URLS = {
  video: "https://aitestkitchen.withgoogle.com/tools/video-fx",
  image: "https://aitestkitchen.withgoogle.com/tools/image-fx",
};

export interface TargetMarket {
  id: string;
  name: string;
  flag: string;
  voice_lang: string;
  currency: string;
  culture?: string;
}

export const TARGET_MARKETS: Record<string, TargetMarket> = {
  vn_dharma: { id: 'vn_dharma', name: 'Việt Nam — Phật Pháp & Chữa Lành', flag: '🇻🇳', voice_lang: 'Vietnamese', currency: 'VND', culture: 'Triết lý nhân sinh, luật nhân quả, thiền định, an trú hiện tại, chữa lành tâm hồn theo phong cách người Việt.' },
  us_mindfulness: { id: 'us_mindfulness', name: 'USA — Modern Mindfulness', flag: '🇺🇸', voice_lang: 'English (US)', currency: 'USD', culture: 'Practical mindfulness, stress reduction, success through inner peace, direct and actionable advice, modern urban lifestyle integration.' },
  jp_zen: { id: 'jp_zen', name: 'Japan — Zen Philosophy', flag: '🇯🇵', voice_lang: 'Japanese', currency: 'JPY', culture: 'Wabi-sabi aesthetics, deep Zen poetry, extreme minimalism, silence and space (Ma), traditional Shinto-Buddhist fusion.' },
  th_theravada: { id: 'th_theravada', name: 'Thailand — Devotional Wisdom', flag: '🇹🇭', voice_lang: 'Thai', currency: 'THB', culture: 'Emotional storytelling, traditional Theravada devotion, merit-making, deep respect for temple culture and monks.' },
  cn_traditional: { id: 'cn_traditional', name: 'China — Classical Wisdom', flag: '🇨🇳', voice_lang: 'Mandarin', currency: 'CNY', culture: 'Classical Chinese philosophy (Confucian-Taoist-Buddhist), majestic traditional aesthetics, family karma, ancient wisdom for modern life.' },
  in_vedic: { id: 'in_vedic', name: 'India — Vedic Dharma', flag: '🇮🇳', voice_lang: 'Hindi', currency: 'INR', culture: 'Vibrant spiritual energy, Vedic roots, Karma and Rebirth, high-frequency chanting, wisdom of the Great Gurus.' },
  kr_seon: { id: 'kr_seon', name: 'Korea — Aesthetic Seon', flag: '🇰🇷', voice_lang: 'Korean', currency: 'KRW', culture: 'Modern Seon (Zen) practice, aesthetic minimalism, emotional healing, soft and poetic expression, "Healing" (Hilling) culture.' },
  tibet_vajrayana: { id: 'tibet_vajrayana', name: 'Tibet — Esoteric Energy', flag: '🏔️', voice_lang: 'Tibetan/English', currency: 'USD', culture: 'High-altitude spiritualism, Vajrayana mysticism, powerful chanting, bell and bowl resonance, profound compassion (Bodhicitta).' },
  fr_mindfulness: { id: 'fr_mindfulness', name: 'France — Intellectual Zen', flag: '🇫🇷', voice_lang: 'French', currency: 'EUR', culture: 'Intellectual mindfulness, artistic and poetic flow, philosophical depth, sophisticated and gentle approach to mental health.' },
  de_meditation: { id: 'de_meditation', name: 'Germany — Structured Calm', flag: '🇩🇪', voice_lang: 'German', currency: 'EUR', culture: 'Psychological depth, structured meditation, naturalistic settings, profound and serious tone, focus on mental resilience.' },
  uk_sophisticated: { id: 'uk_sophisticated', name: 'UK — Sophisticated Peace', flag: '🇬🇧', voice_lang: 'English (UK)', currency: 'GBP', culture: 'Sophisticated and calm approach, traditional yet modern mindfulness, focus on well-being and natural elements, eloquent and steady pacing.' },
};

export interface VisualStyle {
  id: string;
  name: string;
  desc: string;
  prompt_enforce: string;
}

export const VISUAL_STYLES: VisualStyle[] = [
  { id: 'pixar_3d', name: '🎨 Hoạt hình 3D Pixar', desc: 'Nhân vật 3D siêu nét, màu sắc tươi sáng, ánh sáng rực rỡ.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, 3D Pixar Animation Studio style, Unreal Engine 5 render. Visual Style: Hyper-detailed 3D cartoon, soft volumetric lighting, vibrant saturated colors, highly expressive cute characters, smooth glossy textures. [SCENE DYNAMICS LOCK]: Bouncy cheerful movements, bright sunny atmosphere, clear blue skies. [COLOR CONTRAST SHIELD]: Vivid primary colors, absolute no dark or scary shadows. [AUDIO LOCK]: Upbeat playful background music, cute sound effects (pops, boings), cheerful ambient sounds.' },
  { id: 'claymation', name: '🧸 Đất nặn Stop-motion (Claymation)', desc: 'Thế giới bằng đất nặn, chuyển động dễ thương, đầy màu sắc.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Masterful Claymation Stop-motion style. Visual Style: Everything made of brightly colored modeling clay, visible thumbprints on clay textures, miniature crafted world feel, highly tactile. [SCENE DYNAMICS LOCK]: Stop-motion animated feel, charming slightly jerky physics, soft studio macro lighting. [COLOR CONTRAST SHIELD]: Warm cheerful pastel and vibrant clay colors. [AUDIO LOCK]: Squishy clay ASMR sounds, soft xylophone music, happy giggles.' },
  { id: 'papercut_art', name: '✂️ Cắt dán giấy nghệ thuật (Papercut)', desc: 'Các lớp giấy cắt dán thủ công, tạo chiều sâu 3D mộc mạc.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Layered Papercut Craft style. Visual Style: Scenes constructed entirely from intricately cut layers of colored construction paper, 3D diorama feel, visible paper textures and shadows between layers. [SCENE DYNAMICS LOCK]: Cardboard theater feel, sliding paper animations, warm spotlighting. [COLOR CONTRAST SHIELD]: Bold contrasting paper colors, clean distinct edges. [AUDIO LOCK]: Paper rustling ASMR, acoustic guitar or ukulele melodies, soft chimes.' },
  { id: 'popup_book', name: '📖 Sách tranh nổi 3D (Pop-up Book)', desc: 'Thế giới mở ra từ trang sách, phép màu diệu kỳ.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Magical 3D Pop-up Book style. Visual Style: A magical storybook opening up with 3D paper engineering popping out, highly detailed illustrations coming to life, golden magical sparkles. [SCENE DYNAMICS LOCK]: Pages turning, paper structures unfolding and bouncing into place, glowing magical dust. [COLOR CONTRAST SHIELD]: Watercolor illustration colors, warm glowing magical light. [AUDIO LOCK]: Heavy book pages turning ASMR, magical sparkling glissando, cheerful orchestral music.' },
  { id: 'english_learning_duo', name: '📚 Dạy Tiếng Anh Mẹ & Bé', desc: 'Học tiếng Anh qua tình huống tương tác 2 nhân vật.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Educational Kids Show style. Visual Style: Clean, bright, and colorful educational setting with large clear subjects. [SCENE DYNAMICS LOCK]: Slow gentle movements, clear object presentation. [COLOR CONTRAST SHIELD]: Vibrant cheerful colors. [AUDIO LOCK]: Upbeat playful background music, clear pronunciation ASMR.' }
];

export const MARKET_STYLE_RECOMMENDATIONS: Record<string, string[]> = {
  vn_dharma: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book'],
  us_mindfulness: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book'],
  jp_zen: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book'],
  th_theravada: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book'],
  cn_traditional: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book'],
  in_vedic: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book'],
  kr_seon: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book'],
  tibet_vajrayana: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book'],
  fr_mindfulness: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book'],
  de_meditation: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book'],
  uk_sophisticated: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book']
};

export interface KidsEnergy {
  id: string;
  name: string;
  desc: string;
  enforce: string;
}

export const DHARMA_ENERGIES: KidsEnergy[] = [
  { id: 'joyful', name: '🎈 Vui Tươi (Joyful)', desc: 'Màu sắc sặc sỡ, ánh sáng rực rỡ, âm thanh vui nhộn.', enforce: '[ENERGY: JOYFUL] - Use bright saturated colors, high-key lighting, energetic and bouncy camera movements. Audio: Upbeat playful music, happy sound effects. Mood: Fun, energetic, and exciting for kids.' },
  { id: 'curious', name: '🔍 Tò Mò (Curious)', desc: 'Ánh sáng ma thuật, khám phá, âm thanh bí ẩn nhẹ nhàng.', enforce: '[ENERGY: CURIOUS] - Use warm magical lighting, close-up discovery shots, sparkling particles. Audio: Soft magical chimes, inquisitive playful melodies. Mood: Wonder, discovery, and educational.' },
];

export const SACRED_SYMBOLS = ['Star (Ngôi Sao)', 'Sun (Mặt Trời)', 'Rainbow (Cầu Vồng)', 'Balloon (Bong Bóng)', 'Book (Quyển Sách)'];

export const SEO_CHECKLIST_DATA: Record<string, { id: string; label: string }[]> = {
  "Phần 1: Nguyên Tắc Nền Tảng (BẮT BUỘC)": [
    { id: "kids_1", label: "An toàn cho trẻ em (Tuân thủ COPPA)" },
    { id: "kids_2", label: "Bài học rõ ràng, dễ hiểu" },
    { id: "kids_3", label: "Hình ảnh và ngôn từ trong sáng" },
  ],
  "Phần 2: Tối Ưu Phân Phối (Viral)": [
    { id: "seo_1", label: "Keyword: 'Học tiếng Anh', 'Trẻ em', 'Vui nhộn', 'Bài học'" },
    { id: "seo_2", label: "Thumbnail: Màu sắc rực rỡ, chữ to dễ đọc, hình ảnh ngộ nghĩnh" },
    { id: "seo_3", label: "Hook: Kích thích trí tò mò của bé ngay 3 giây đầu" },
  ],
  "Phần 3: Tương Tác & Gắn Kết": [
    { id: "com_1", label: "Câu hỏi: 'Bé thích bài học nào nhất hôm nay?'" },
    { id: "com_2", label: "CTA: Phụ huynh hãy đăng ký để bé học mỗi ngày nhé!" },
  ],
};

export const SECONDS_PER_SCENE = 8;

export type TabId = 'spy' | 'script' | 'studio' | 'seo' | 'market';

export const TAB_COLORS: Record<TabId, { bg: string; border: string; text: string; shadow: string }> = {
  spy: { bg: 'bg-[#1a1610]', border: 'border-amber-500/50', text: 'text-amber-400', shadow: 'shadow-[0_0_12px_rgba(245,166,35,0.1)]' },
  script: { bg: 'bg-[#1a1610]', border: 'border-amber-500/50', text: 'text-amber-400', shadow: 'shadow-[0_0_12px_rgba(245,166,35,0.1)]' },
  studio: { bg: 'bg-[#1a1610]', border: 'border-amber-500/50', text: 'text-amber-400', shadow: 'shadow-[0_0_12px_rgba(245,166,35,0.1)]' },
  seo: { bg: 'bg-[#1a1610]', border: 'border-amber-500/50', text: 'text-amber-400', shadow: 'shadow-[0_0_12px_rgba(245,166,35,0.1)]' },
  market: { bg: 'bg-[#1a1610]', border: 'border-amber-500/50', text: 'text-amber-400', shadow: 'shadow-[0_0_12px_rgba(245,166,35,0.1)]' },
};
