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
  { id: 'ancient_stone_relic', name: '🗿 Thánh Tích Khắc Đá (Hybrid)', desc: 'Đá cẩm thạch khổng lồ, viền vàng Kintsugi, tia sáng God rays & âm thanh 432Hz.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, 3D Unreal Engine 5 + Macro Cinematography. Visual Style: Hyper-realistic highly polished pristine white marble sculpture with brilliant natural white surface and bright mirror-like reflection, accented with glowing radiant 24k Kintsugi gold veins that gleam brilliantly, set against a lush emerald green moss and natural pebble background. [COLOR CONTRAST SHIELD]: Absolute pure white marble surface (NO grey, NO dull, NO dark cave ambiance), vivid warm golden veins with max luminosity, bright volumetric studio god rays streaming from above, sharp high-contrast shadows. [PHYSICAL ANCHOR LOCK]: A massive brilliant white stone Lotus relief in the center with golden Kintsugi trim. [SCENE DYNAMICS LOCK]: Volumetric warm golden god rays piercing through canopy and illuminating the pristine white surface, extremely slow-motion glowing golden dust motes. [AUDIO LOCK]: VERY POWERFUL Great Temple Bell echoing, slow rhythmic wooden fish block (mõ) tapping, profound 432Hz healing hum.' },
  { id: 'molten_gold_nirvana', name: '🪷 Niết Bàn Vàng Ròng (Hybrid)', desc: 'Vàng lỏng 24k lấp đầy vết nứt tượng Phật, kết hợp hiệu ứng kính vạn hoa ánh sáng.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Kintsugi Art + Galactic Sci-Fi Lighting. Visual Style: Liquid 24k gold slowly flowing and filling the deep cracks of an ancient stone Buddha statue floating in a subtle starry void. [PHYSICAL ANCHOR LOCK]: Golden flow shaping into a Lotus. [SCENE DYNAMICS LOCK]: Radiant golden glow dispelling deep shadows, kaleidoscopic light refractions from the gold. [AUDIO LOCK]: Strong heartbeat-like wooden block tapping, delicate Tingsha bells ringing as gold fills cracks, echoing temple flute.' },
  { id: 'galactic_dharma_wheel', name: '🌌 Pháp Luân Thiên Hà (Hybrid)', desc: 'Bánh Xe Pháp Luân quay giữa vũ trụ, kết hợp sương mù thiền định và chuông đồng.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Cinematic Sci-Fi + Zen Mysticism. Visual Style: A gigantic glowing Dharma Wheel rotating slowly in the middle of a starry galaxy nebula, surrounded by mystical Zen incense smoke. [PHYSICAL ANCHOR LOCK]: The Wheel core is a crystal Lotus. [SCENE DYNAMICS LOCK]: Stardust and nebula clouds swirling around the wheel, cosmic karma representation, macro focus on star particles. [AUDIO LOCK]: 432Hz deep cosmic healing frequency, continuous MAJESTIC temple bell resonance, powerful wooden fish beats.' },
  { id: 'gigantic_bodhi_leaf', name: '🍃 Kinh Diệp Lục (Hybrid)', desc: 'Cận cảnh gân lá bồ đề phát sáng, kết hợp ánh sáng sương mai và nhịp thở tĩnh tại.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Super Macro Nature + Ethereal Glow. Visual Style: A gigantic Bodhi leaf surface where the leaf veins transform into glowing emerald green Sanskrit calligraphy, covered in hyper-realistic morning dew. [PHYSICAL ANCHOR LOCK]: A glowing Lotus-shaped dewdrop. [SCENE DYNAMICS LOCK]: Soft pulsating green neon light from the text, highly detailed organic texture breathing rhythmically. [AUDIO LOCK]: Peaceful bamboo flute (sáo trúc), deep and warm wooden percussion beats, giant temple bell fading in the wind.' },
  { id: 'ice_fire_lotus', name: '🧊 Băng Hỏa Liên Hoa (Hybrid)', desc: 'Hoa sen băng tuyết ngậm lửa thiêng, kết hợp khói trầm 3D Unreal.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, High-Contrast Fantasy + Zen Smoke Art. Visual Style: A pristine Lotus made of crystal clear ice enclosing an eternal glowing orange fire at its core, surrounded by slow-motion incense smoke. [PHYSICAL ANCHOR LOCK]: The eternal fire forms a mini Buddha silhouette. [SCENE DYNAMICS LOCK]: Extreme contrast between cyan ice and warm orange fire, ice not melting, volumetric smoke lighting. [AUDIO LOCK]: Warm fire crackling ASMR mixed with sharp ice cracking sounds, STRONG decisive wooden block hits, resonant Tibetan singing bowl.' },
  { id: 'zen_tea_incense', name: '🍵 Trà Đạo Khói Trầm (Hybrid)', desc: 'Khói trầm tụ thành đóa sen lơ lửng, kết hợp ánh trăng và âm thanh róc rách.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Slow-Motion Zen + Moonlit Atmosphere. Visual Style: Incense smoke elegantly condensing into the shape of a floating Lotus flower above a steaming rustic ceramic tea cup, illuminated by a cool cyan moon glow. [PHYSICAL ANCHOR LOCK]: The tea cup rests on an ancient carved stone with gold veins. [SCENE DYNAMICS LOCK]: Soft backlighting on smoke, extremely slow and graceful motion. [AUDIO LOCK]: Crisp water pouring ASMR, rhythmic wooden block tapping, gentle bamboo flute, deep temple bell.' },
  { id: 'kaleidoscopic_pure_land', name: '🔮 Kính Vạn Hoa Thiên Thai (Hybrid)', desc: 'Mandala kính màu quay chậm, kết hợp tia God rays và sương mù.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Hypnotic Geometry + Natural Zen Lighting. Visual Style: A massive rotating Mandala pattern made of stained glass and jade, acting as a giant kaleidoscope, placed in a foggy ancient forest. [PHYSICAL ANCHOR LOCK]: The center of the Mandala is a glowing golden Lotus. [SCENE DYNAMICS LOCK]: Shimmering refracted light rays mixing with organic forest God rays, mesmerizing symmetrical rotation. [AUDIO LOCK]: Harmonious Tibetan Singing Bowls resonance mixed with distant peaceful bamboo flute and powerful temple bell.' },
  { id: 'moonlit_crystal_lotus', name: '💧 Hồ Sen Trăng Ngọc (Hybrid)', desc: 'Nụ sen pha lê bung nở đêm trăng, kết hợp bụi sao lấp lánh và sóng âm 432Hz.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Dark Moody Cinematography + Celestial Magic. Visual Style: A crystal clear Lotus bud slowly blooming on a pitch-black mirror-like lake under a full moon, releasing floating golden stardust particles. [PHYSICAL ANCHOR LOCK]: The blooming Lotus reveals a glowing 24k gold core. [SCENE DYNAMICS LOCK]: Ethereal cyan moon glow, water ripples from falling stardust, macro depth of field. [AUDIO LOCK]: Binaural water drop ASMR, gentle bamboo flute, single STRONG wooden block tap every 8 seconds, 432Hz hum.' },
  { id: 'breathing_terracotta', name: '🏺 Tượng Đất Nung Thở (Hybrid)', desc: 'Stop-motion đất nung tự nhào nặn, kết hợp hiệu ứng nứt Kintsugi vàng rực.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Masterful Claymation + Kintsugi Gold. Visual Style: Raw terracotta clay continuously morphing and sculpting itself into an enlightened monk, with dynamic Kintsugi golden cracks forming and glowing. [PHYSICAL ANCHOR LOCK]: The monk holding a golden Lotus. [SCENE DYNAMICS LOCK]: Warm golden light rays leaking out from the cracks of the clay chest with every simulated breath, cinematic studio lighting. [AUDIO LOCK]: Clay rubbing and sculpting friction sounds, multi-layered deep Om chanting chorus, powerful wooden fish tapping.' },
  { id: 'shadow_puppet_karma', name: '📜 Vũ Điệu Bóng Râm (Hybrid)', desc: 'Rối bóng 3D, màn giấy cổ, hiệu ứng ngọn lửa thực và chuông đồng.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, 3D Shadow Puppetry + Realistic Pyrotechnics. Visual Style: Highly detailed shadow puppets acting out a karma story behind an ancient textured rice paper screen, illuminated by real flickering firelight. [PHYSICAL ANCHOR LOCK]: A Lotus shadow that remains perfectly still while other shadows move. [SCENE DYNAMICS LOCK]: Warm turmeric-yellow backlighting, sharp crisp shadows blending with real smoke wisps. [AUDIO LOCK]: Intense traditional temple drum beats transitioning to a peaceful and pure brass bell chime and slow resonant wooden block.' },
  { id: 'contemporary_ink_wash', name: '🖌️ Thủy Mặc Đương Đại (Hybrid)', desc: 'Mực loang trên giấy Tuyên, chỉ vàng bay bổng và chuông xoay Tây Tạng.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Contemporary Chinese Ink Wash Art + Golden Kintsugi accents. Visual Style: Ethereal flowing black ink wash gradients spreading on ancient textured Xuan paper, contrasted with floating delicate golden silk threads drifting in 3D space. [PHYSICAL ANCHOR LOCK]: A minimalist golden Lotus motif brushed in the corner. [SCENE DYNAMICS LOCK]: Extremely slow ink diffusion, tiny shimmering gold dust particles, macro depth of field. [AUDIO LOCK]: Warm resonant Tibetan singing bowls, peaceful bamboo flute, slow rhythmic wooden block tapping, deep 432Hz healing sound.' },
  { id: 'royal_hue_lacquer', name: '🏮 Sơn Mài Hoàng Tộc (Hybrid)', desc: 'Đỏ son, đen bóng, khảm xà cừ cổ truyền Việt Nam dát vàng lá.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Traditional Vietnamese Lacquer Painting (Sơn Mài) + Premium Studio Lighting. Visual Style: Deep polished cinnabar-red and piano-black lacquer surface reflecting soft light, meticulously inlaid with iridescent mother-of-pearl (xà cừ) details and delicate 24k gold leaf flakes. [PHYSICAL ANCHOR LOCK]: A gorgeous golden Lotus pattern inlaid at the center. [SCENE DYNAMICS LOCK]: Soft atmospheric studio reflection, light drifting over the polished lacquer surface. [AUDIO LOCK]: Traditional wooden fish block (mõ) tapping, majestic resonance of a large temple bronze bell, slow meditative temple drums.' },
  { id: 'sand_mandala', name: '⏳ Sa Bàn Mandala (Hybrid)', desc: 'Cát mịn tự chuyển động tạo đồ hình Mandala, lấp lánh như bụi kim cương.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Macro Sand Art + Holy Geometry. Visual Style: Millions of vibrant, highly-detailed colored sand particles slowly shifting and self-arranging into a sacred symmetrical Tibetan Mandala on a dark stone pedestal, shimmering like diamond dust. [PHYSICAL ANCHOR LOCK]: The center of the Mandala is a golden Lotus bud. [SCENE DYNAMICS LOCK]: Dynamic sand flowing motion, extreme close-up showing individual sand grain textures, divine light rays. [AUDIO LOCK]: Peaceful sand shifting ASMR, ringing Tingsha chimes, continuous 528Hz cosmic transformation frequency, wooden block beat.' },
  { id: 'aura_of_enlightenment', name: '🔮 Hào Quang Giác Ngộ (Hybrid)', desc: 'Hào quang neon loang tỏa qua kính mờ huyền ảo, nhạc thiền 432Hz.', prompt_enforce: ', [HYBRID CORE]: 8K Resolution, Ethereal Glassmorphism + Holy Rainbow Glow. Visual Style: Soft, pulsating pastel neon aura of rainbow colors flowing and diffusing behind layered sheets of frosted textured glass, creating a serene modern mystical atmosphere. [PHYSICAL ANCHOR LOCK]: A simple glowing golden Lotus outline in the center glass layer. [SCENE DYNAMICS LOCK]: Gentle light waves expanding outward, floating dust particles, soothing volumetric glow. [AUDIO LOCK]: Clean wind chimes swaying in a gentle breeze, soft breathing ASMR, continuous 432Hz deep relaxation humming.' }
];

export const MARKET_STYLE_RECOMMENDATIONS: Record<string, string[]> = {
  vn_dharma: ['royal_hue_lacquer', 'shadow_puppet_karma', 'ancient_stone_relic', 'gigantic_bodhi_leaf', 'moonlit_crystal_lotus'],
  us_mindfulness: ['ancient_stone_relic', 'galactic_dharma_wheel', 'moonlit_crystal_lotus', 'aura_of_enlightenment', 'sand_mandala'],
  jp_zen: ['contemporary_ink_wash', 'ancient_stone_relic', 'zen_tea_incense', 'moonlit_crystal_lotus'],
  th_theravada: ['molten_gold_nirvana', 'ancient_stone_relic', 'sand_mandala', 'galactic_dharma_wheel'],
  cn_traditional: ['contemporary_ink_wash', 'molten_gold_nirvana', 'shadow_puppet_karma', 'royal_hue_lacquer'],
  in_vedic: ['galactic_dharma_wheel', 'sand_mandala', 'ancient_stone_relic', 'aura_of_enlightenment'],
  kr_seon: ['contemporary_ink_wash', 'moonlit_crystal_lotus', 'zen_tea_incense', 'aura_of_enlightenment'],
  tibet_vajrayana: ['sand_mandala', 'galactic_dharma_wheel', 'ancient_stone_relic', 'molten_gold_nirvana'],
  fr_mindfulness: ['contemporary_ink_wash', 'moonlit_crystal_lotus', 'aura_of_enlightenment'],
  de_meditation: ['ancient_stone_relic', 'contemporary_ink_wash', 'zen_tea_incense'],
  uk_sophisticated: ['moonlit_crystal_lotus', 'zen_tea_incense', 'ancient_stone_relic']
};

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
