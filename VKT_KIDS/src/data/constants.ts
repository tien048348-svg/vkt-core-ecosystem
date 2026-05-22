// ==================================================================================
// CONFIGURATION & CONSTANTS - Dharma Studio
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
  vn_kids: { id: 'vn_kids', name: 'Việt Nam - Thiếu Nhi & Học Tập', flag: '🇻🇳', voice_lang: 'Vietnamese', currency: 'VND', culture: 'Truyện cổ tích Việt Nam, học chữ cái, đạo đức cho bé, màu sắc tươi sáng, giọng đọc truyền cảm.' },
  us_preschool: { id: 'us_preschool', name: 'USA - Preschool Education', flag: '🇺🇸', voice_lang: 'English (US)', currency: 'USD', culture: 'Phonics, counting, vibrant colors, highly energetic, musical sing-alongs, positive reinforcement.' },
  jp_anime_kids: { id: 'jp_anime_kids', name: 'Japan - Anime Kids', flag: '🇯🇵', voice_lang: 'Japanese', currency: 'JPY', culture: 'Kawaii aesthetics, gentle life lessons, teamwork, soft pastels, Ghibli-inspired storytelling.' },
  kr_toddler: { id: 'kr_toddler', name: 'Korea - Toddler Rhythmic', flag: '🇰🇷', voice_lang: 'Korean', currency: 'KRW', culture: 'Catchy rhythmic songs (like Baby Shark), bright 3D characters, cute expressions, dance-along vibes.' }
};

export interface VisualStyle {
  id: string;
  name: string;
  desc: string;
  prompt_enforce: string;
}

export const VISUAL_STYLES: VisualStyle[] = [
  { id: 'auto', name: '✨ Đề Xuất Tự Động (AI Trí Tuệ)', desc: 'AI tự động phân tích kịch bản và đề xuất phong cách phù hợp nhất.', prompt_enforce: '' },
  { id: 'pixar_3d', name: '🧸 3D Pixar/Disney', desc: 'Sặc sỡ, 3D mềm mại, mắt to tròn, ánh sáng nhiệm mầu.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, 3D Pixar/Disney animation style. Visual Style: Character designs with large expressive eyes, soft rounded features, vibrant and saturated colors, magical rim lighting, volumetric fog. [PHYSICAL ANCHOR LOCK]: Distinct 3D textures like fur or glossy plastic. [SCENE DYNAMICS LOCK]: Smooth bouncy movements, energetic but clear framing. [AUDIO LOCK]: Bright orchestral music, magical chimes.' },
  { id: 'water_color', name: '🖌️ Tranh Màu Nước', desc: 'Nét vẽ màu nước trong trẻo, mộc mạc, nhẹ nhàng.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Watercolor Storybook Illustration. Visual Style: Hand-painted watercolor aesthetics, visible paper texture, soft pastel color palettes, pigment bleeding at the edges. [PHYSICAL ANCHOR LOCK]: Distinct watercolor brush strokes. [SCENE DYNAMICS LOCK]: Gentle and slow flowing movements. [AUDIO LOCK]: Soft acoustic guitar or harp, gentle wind chimes.' },
  { id: 'claymation_playdoh', name: '🧶 Đất Nặn Claymation', desc: 'Nhân vật làm bằng đất sét chuyển động.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Stop-Motion Claymation. Visual Style: Everything made of colorful modeling clay (Play-Doh), visible fingerprints on the textures, chunky and round shapes. [PHYSICAL ANCHOR LOCK]: Distinct clay texture and miniature sets. [SCENE DYNAMICS LOCK]: Typical stop-motion frame rate feel, tactile interactions. [AUDIO LOCK]: Fun squishy sound effects, quirky pizzicato strings.' },
  { id: 'paper_cutout_craft', name: '✂️ Cắt Dán Giấy (Paper Cutout)', desc: 'Nghệ thuật cắt dán giấy lớp, tạo chiều sâu 3D.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, 3D Papercraft Diorama. Visual Style: Layered paper cutouts creating a sense of depth, colorful construction paper with slight drop shadows, handmade craft feel. [PHYSICAL ANCHOR LOCK]: Distinct paper edges and lighting creating shadows. [SCENE DYNAMICS LOCK]: Stop-motion style sliding paper elements. [AUDIO LOCK]: Rustling paper ASMR, upbeat toy piano.' },
  { id: 'ghibli_anime_soft', name: '🌱 Hoạt Hình Ghibli', desc: 'Phong cách Anime Nhật Bản, màu sắc thiên nhiên, mộc mạc.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Studio Ghibli Anime Style. Visual Style: Traditional 2D anime animation, lush green nature, puffy clouds, very wholesome and nostalgic, detailed hand-painted backgrounds. [PHYSICAL ANCHOR LOCK]: Soft wind blowing through grass or hair. [SCENE DYNAMICS LOCK]: Calm and peaceful pacing, natural sunlight. [AUDIO LOCK]: Beautiful Joe Hisaishi style piano, nature sounds, birds chirping.' },
  { id: 'chalkboard_doodle', name: '🖍️ Phấn Bảng Đen', desc: 'Nét vẽ phấn rực rỡ trên nền bảng đen, sinh động.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Chalk Doodle Animation. Visual Style: Vibrant neon chalk lines animating on a slightly dusty green or black chalkboard, highly expressive and exaggerated drawings. [PHYSICAL ANCHOR LOCK]: Chalk dust particles floating. [SCENE DYNAMICS LOCK]: Quick drawing animations, playful erasing and redrawing. [AUDIO LOCK]: Chalk writing ASMR, upbeat and fast-paced whistling tune.' },
  { id: 'felt_plushie_toy', name: '🧸 Đồ Chơi Vải Nỉ', desc: 'Thế giới làm từ len, vải nỉ và bông gòn ấm áp.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Felt and Plushie Art. Visual Style: Characters and environments made entirely of soft felt fabric, yarn, and cotton, cozy and tactile. [PHYSICAL ANCHOR LOCK]: Visible fabric fuzz and stitching details. [SCENE DYNAMICS LOCK]: Soft and cuddly movements, warm studio lighting. [AUDIO LOCK]: Soft muted percussion, cozy marimba.' },
  { id: 'colored_pencil_sketch', name: '✏️ Chì Màu Phác Thảo', desc: 'Nét vẽ bút chì màu thô ráp, sinh động như bé tự vẽ', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Colored Pencil Sketch. Visual Style: Scribbled colored pencil strokes on white paper, vibrant and slightly messy, capturing the raw imagination of a child. [PHYSICAL ANCHOR LOCK]: Visible pencil strokes filling in colors dynamically. [SCENE DYNAMICS LOCK]: Frame-by-frame hand-drawn jittery effect. [AUDIO LOCK]: Pencil scribbling sounds, playful kazoo or recorder music.' },
  { id: 'english_learning_duo', name: '🗣️ Học Tiếng Anh Mẹ & Bé', desc: 'Song ngữ Anh-Việt, phát âm chuẩn xác, hình ảnh trực quan sinh động.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Educational Flashcard Style. Visual Style: Bright, high contrast, clean white background or soft pastel, central object perfectly isolated. [PHYSICAL ANCHOR LOCK]: Floating bold typography. [SCENE DYNAMICS LOCK]: Extremely slow, educational pacing. [AUDIO LOCK]: Clear and crisp ASMR object interaction sounds.' }
];

export interface DharmaEnergy {
  id: string;
  name: string;
  desc: string;
  enforce: string;
}

export const DHARMA_ENERGIES: DharmaEnergy[] = [
  { id: 'compassion', name: '🙏 Từ Bi (Compassion)', desc: 'Ánh sáng ấm, nhịp điệu mềm mại, âm thanh chữa lành.', enforce: '[ENERGY: COMPASSION] - Use warm golden hour lighting, soft focus edges, gentle camera drifts. Audio: High-frequency healing tones, soft water/nature sounds. Mood: Deep empathy and comfort.' },
  { id: 'wisdom', name: '🕯️ Trí Tuệ (Wisdom)', desc: 'Ánh sáng tinh khiết, sắc nét, hào quang rực rỡ.', enforce: '[ENERGY: WISDOM] - Use high-clarity 8K resolution, radiant divine light beams, pure white and gold palette. Audio: Clear resonance, singing bowls. Mood: Enlightenment and clarity.' },
  { id: 'solemn', name: '🗿 Uy Nghi (Solemn)', desc: 'Tông màu trầm, vững chãi, tiếng chuông đại hồng chung.', enforce: '[ENERGY: SOLEMN] - Use deep shadows, monolithic stone textures, low-angle powerful shots. Audio: Deep temple bell, low chanting vibrations. Mood: Respect, karma law, and ancient truth.' },
  { id: 'healing', name: '🌿 Chữa Lành (Healing)', desc: 'Tông màu xanh lá/ngọc, hơi sương, âm thanh thiên nhiên.', enforce: '[ENERGY: HEALING] - Use forest green and teal tones, morning mist, macro textures of dew and leaves. Audio: Birdsong, wind chimes, soft breathing. Mood: Stress relief and soul restoration.' },
];

export const SACRED_SYMBOLS = ['Lotus (Hoa Sen)', 'Bodhi Leaf (Lá Bồ Đề)', 'Dharma Wheel (Pháp Luân)', 'Endless Knot (Nút thắt vô tận)', 'Om Symbol (Chữ Om)'];

export const SEO_CHECKLIST_DATA: Record<string, { id: string; label: string }[]> = {
  "Phần 1: Nguyên Tắc Nền Tảng (BẮT BUỘC)": [
    { id: "dharma_1", label: "Tôn trọng tuyệt đối (Không xuyên tạc giáo lý)" },
    { id: "dharma_2", label: "Thông điệp Nhân quả / Chữa lành rõ ràng" },
    { id: "dharma_3", label: "An toàn nền tảng (Không hình ảnh rùng rợn khi nói về nhân quả)" },
  ],
  "Phần 2: Tối Ưu Phân Phối (Viral)": [
    { id: "seo_1", label: "Keyword: 'Chữa lành', 'Nhân quả', 'Lời Phật dạy', 'Bình yên'" },
    { id: "seo_2", label: "Thumbnail: Tĩnh lặng, ánh sáng vàng ấm, text truyền cảm hứng" },
    { id: "seo_3", label: "Hook: Đánh vào nỗi đau tâm lý -> Giải pháp từ bi" },
  ],
  "Phần 3: Tương Tác & Gắn Kết": [
    { id: "com_1", label: "Câu hỏi: 'Bạn có đang cảm thấy bình yên lúc này?'" },
    { id: "com_2", label: "CTA: Gõ 'Nam Mô A Di Đà Phật' / 'Hoan hỉ' để gieo duyên" },
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