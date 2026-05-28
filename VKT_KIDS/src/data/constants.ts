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
  vn_kids: { id: 'vn_kids', name: 'Việt Nam — Học Tiếng Anh (Song ngữ Việt-Anh)', flag: '🇻🇳', voice_lang: 'Vietnamese', currency: 'VND', culture: 'Giảng dạy bằng tiếng Việt, thân thiện, gần gũi, sử dụng các hình ảnh quen thuộc với trẻ em Việt Nam. Dạy từ vựng tiếng Anh.' },
  us_kids: { id: 'us_kids', name: 'USA — Early Education (100% English)', flag: '🇺🇸', voice_lang: 'English (US)', currency: 'USD', culture: '100% English. Fun, high-energy, confident, encouraging. Focus on phonics, active engagement, and western preschool standards.' },
  jp_kids: { id: 'jp_kids', name: 'Japan — Học Tiếng Anh (Song ngữ Nhật-Anh)', flag: '🇯🇵', voice_lang: 'Japanese', currency: 'JPY', culture: 'Kawaii (cute) aesthetics, polite and gentle tone, highly structured, teaching English through Japanese.' },
  kr_kids: { id: 'kr_kids', name: 'Korea — Học Tiếng Anh (Song ngữ Hàn-Anh)', flag: '🇰🇷', voice_lang: 'Korean', currency: 'KRW', culture: 'Trendy, energetic, K-pop style upbeat rhythms, highly engaging visuals, teaching English through Korean.' },
  cn_kids: { id: 'cn_kids', name: 'China — Học Tiếng Anh (Song ngữ Trung-Anh)', flag: '🇨🇳', voice_lang: 'Mandarin', currency: 'CNY', culture: 'Focus on early cognitive development, structured learning, family-oriented values, teaching English through Mandarin.' },
  in_kids: { id: 'in_kids', name: 'India — Early Learning (Hindi-English)', flag: '🇮🇳', voice_lang: 'Hindi', currency: 'INR', culture: 'Vibrant, musical, highly interactive, teaching English through Hindi and culturally relatable scenarios.' },
  uk_kids: { id: 'uk_kids', name: 'UK — Nursery Rhymes (100% English)', flag: '🇬🇧', voice_lang: 'English (UK)', currency: 'GBP', culture: '100% British English. Gentle, sophisticated storytelling, classic nursery rhyme aesthetics, polite and calm pacing.' },
  th_kids: { id: 'th_kids', name: 'Thailand — Học Tiếng Anh (Song ngữ Thái-Anh)', flag: '🇹🇭', voice_lang: 'Thai', currency: 'THB', culture: 'Extremely playful, colorful, expressive, teaching English through Thai with lots of giggles and fun.' },
  es_kids: { id: 'es_kids', name: 'Spain/LatAm — Học Tiếng Anh (Song ngữ TBN-Anh)', flag: '🇪🇸', voice_lang: 'Spanish', currency: 'EUR', culture: 'Warm, passionate, rhythmic, very musical and family-oriented, teaching English through Spanish.' },
  fr_kids: { id: 'fr_kids', name: 'France — Học Tiếng Anh (Song ngữ Pháp-Anh)', flag: '🇫🇷', voice_lang: 'French', currency: 'EUR', culture: 'Artistic, gentle, slightly more quiet and focused, teaching English through French.' }
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
  vn_kids: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book', 'english_learning_duo'],
  us_kids: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book', 'english_learning_duo'],
  jp_kids: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book', 'english_learning_duo'],
  kr_kids: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book', 'english_learning_duo'],
  cn_kids: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book', 'english_learning_duo'],
  in_kids: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book', 'english_learning_duo'],
  uk_kids: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book', 'english_learning_duo'],
  th_kids: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book', 'english_learning_duo'],
  es_kids: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book', 'english_learning_duo'],
  fr_kids: ['pixar_3d', 'claymation', 'papercut_art', 'popup_book', 'english_learning_duo']
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
