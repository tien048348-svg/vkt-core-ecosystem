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
  vn_kids: { id: 'vn_kids', name: 'Việt Nam — Thiếu Nhi & Học Tập', flag: '🇻🇳', voice_lang: 'Vietnamese', currency: 'VND', culture: 'Truyện cổ tích Việt Nam, học chữ cái, đạo đức cho bé, màu sắc tươi sáng, giọng đọc truyền cảm.' },
  us_preschool: { id: 'us_preschool', name: 'USA — Preschool Education', flag: '🇺🇸', voice_lang: 'English (US)', currency: 'USD', culture: 'Phonics, counting, vibrant colors, highly energetic, musical sing-alongs, positive reinforcement.' },
  jp_anime_kids: { id: 'jp_anime_kids', name: 'Japan — Anime Kids', flag: '🇯🇵', voice_lang: 'Japanese', currency: 'JPY', culture: 'Kawaii aesthetics, gentle life lessons, teamwork, soft pastels, Ghibli-inspired storytelling.' },
  kr_toddler: { id: 'kr_toddler', name: 'Korea — Toddler Rhythmic', flag: '🇰🇷', voice_lang: 'Korean', currency: 'KRW', culture: 'Catchy rhythmic songs (like Baby Shark), bright 3D characters, cute expressions, dance-along vibes.' }
};

export interface VisualStyle {
  id: string;
  name: string;
  desc: string;
  prompt_enforce: string;
}

export const VISUAL_STYLES: VisualStyle[] = [
  { id: '3d_pixar_disney', name: '🎈 3D Pixar/Disney', desc: 'Đồ họa 3D mềm mại, tươi sáng, nhân vật mắt to đáng yêu.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, 3D Render, Unreal Engine 5. Visual Style: Pixar and Disney animation style, extremely cute characters with large expressive eyes, soft global illumination, vibrant and saturated colors. [PHYSICAL ANCHOR LOCK]: Playful and bouncy physics. [SCENE DYNAMICS LOCK]: Smooth fluid motion, cinematic lighting with rim lights. [AUDIO LOCK]: Upbeat playful xylophone, cheerful orchestral strings.' },
  { id: 'watercolor_storybook', name: '📖 Tranh Màu Nước', desc: 'Nét vẽ màu nước bồng bềnh, như sách truyện cổ tích.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Classic Watercolor Illustration. Visual Style: Hand-drawn children storybook style, soft pastel watercolors bleeding into textured paper, gentle and dreamy atmosphere. [PHYSICAL ANCHOR LOCK]: Visible brush strokes and paper texture. [SCENE DYNAMICS LOCK]: Slow panning over the illustration, magical floating sparkles. [AUDIO LOCK]: Soft acoustic guitar, gentle lullaby melody, magical chimes.' },
  { id: 'claymation_playdoh', name: '🧶 Đất Nặn Claymation', desc: 'Nhân vật làm bằng đất sét tự chuyển động.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Stop-Motion Claymation. Visual Style: Everything made of colorful modeling clay (Play-Doh), visible fingerprints on the textures, chunky and round shapes. [PHYSICAL ANCHOR LOCK]: Distinct clay texture and miniature sets. [SCENE DYNAMICS LOCK]: Typical stop-motion frame rate feel, tactile interactions. [AUDIO LOCK]: Fun squishy sound effects, quirky pizzicato strings.' },
  { id: 'paper_cutout_craft', name: '✂️ Cắt Dán Giấy (Paper Cutout)', desc: 'Nghệ thuật cắt dán giấy lớp, tạo chiều sâu 3D.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, 3D Papercraft Diorama. Visual Style: Layered paper cutouts creating a sense of depth, colorful construction paper with slight drop shadows, handmade craft feel. [PHYSICAL ANCHOR LOCK]: Distinct paper edges and lighting creating shadows. [SCENE DYNAMICS LOCK]: Stop-motion style sliding paper elements. [AUDIO LOCK]: Rustling paper ASMR, upbeat toy piano.' },
  { id: 'ghibli_anime_soft', name: '🌱 Hoạt Hình Ghibli', desc: 'Phong cách Anime Nhật Bản, màu sắc thiên nhiên, mộc mạc.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Studio Ghibli Anime Style. Visual Style: Traditional 2D anime animation, lush green nature, puffy clouds, very wholesome and nostalgic, detailed hand-painted backgrounds. [PHYSICAL ANCHOR LOCK]: Soft wind blowing through grass or hair. [SCENE DYNAMICS LOCK]: Calm and peaceful pacing, natural sunlight. [AUDIO LOCK]: Beautiful Joe Hisaishi style piano, nature sounds, birds chirping.' },
  { id: 'chalkboard_doodle', name: '🖍️ Phấn Bảng Đen', desc: 'Nét vẽ phấn rực rỡ trên nền bảng đen, sinh động.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Chalk Doodle Animation. Visual Style: Vibrant neon chalk lines animating on a slightly dusty green or black chalkboard, highly expressive and exaggerated drawings. [PHYSICAL ANCHOR LOCK]: Chalk dust particles floating. [SCENE DYNAMICS LOCK]: Quick drawing animations, playful erasing and redrawing. [AUDIO LOCK]: Chalk writing ASMR, upbeat and fast-paced whistling tune.' },
  { id: 'felt_plushie_toy', name: '🧸 Đồ Chơi Vải Nỉ', desc: 'Thế giới làm từ len, vải nỉ và bông gòn ấm áp.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Felt and Plushie Art. Visual Style: Characters and environments made entirely of soft felt fabric, yarn, and cotton, cozy and tactile. [PHYSICAL ANCHOR LOCK]: Visible fabric fuzz and stitching details. [SCENE DYNAMICS LOCK]: Soft and cuddly movements, warm studio lighting. [AUDIO LOCK]: Soft muted percussion, cozy marimba.' },
  { id: 'colored_pencil_sketch', name: '✏️ Chì Màu Phác Thảo', desc: 'Nét vẽ bút chì màu thô ráp, sinh động như bé tự vẽ.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Colored Pencil Sketch. Visual Style: Scribbled colored pencil strokes on white paper, vibrant and slightly messy, capturing the raw imagination of a child. [PHYSICAL ANCHOR LOCK]: Visible pencil strokes filling in colors dynamically. [SCENE DYNAMICS LOCK]: Frame-by-frame hand-drawn jittery effect. [AUDIO LOCK]: Pencil scribbling sounds, playful kazoo or recorder music.' }
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
    { id: "seo_3", label: "Hook: Đánh vào nỗi đau tâm lý → Giải pháp từ bi" },
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
