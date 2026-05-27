// ==================================================================================
// CONFIGURATION & CONSTANTS — Recycle Styles Master
// Truyện cổ tích Việt Nam bằng vật liệu tái chế
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
  vn_recycle: { id: 'vn_recycle', name: 'Việt Nam — Truyện Cổ Tích Tái Chế', flag: '🇻🇳', voice_lang: 'Vietnamese', currency: 'VND', culture: 'Văn hóa dân gian Việt Nam, tinh thần bảo vệ môi trường, nghệ thuật tái chế truyền thống, giáo dục thiếu nhi qua hình ảnh' },
  vn_kids: { id: 'vn_kids', name: 'Việt Nam — Thiếu Nhi Sáng Tạo', flag: '🇻🇳', voice_lang: 'Vietnamese', currency: 'VND', culture: 'Nội dung giáo dục cho trẻ em, kết hợp vui chơi và học tập, DIY thủ công' },
  us_diy: { id: 'us_diy', name: 'USA (Recycled Folklore DIY)', flag: '🇺🇸', voice_lang: 'English', currency: 'USD', culture: 'Eco-conscious storytelling, upcycling art, stop-motion crafts' },
  jp_craft: { id: 'jp_craft', name: 'Japan (工芸リサイクル)', flag: '🇯🇵', voice_lang: 'Japanese', currency: 'JPY', culture: 'Japanese crafting culture, mottainai philosophy, origami recycling' },
  kr_eco: { id: 'kr_eco', name: 'Korea (에코 스토리텔링)', flag: '🇰🇷', voice_lang: 'Korean', currency: 'KRW', culture: 'K-eco art, recycled paper crafting, green storytelling' },
  global_eco: { id: 'global_eco', name: 'Global (Eco-Folklore)', flag: '🌍', voice_lang: 'English', currency: 'USD', culture: 'International eco-art movement, sustainable storytelling, environmental education through folk tales' },
};

export interface VisualStyle {
  id: string;
  name: string;
  desc: string;
  prompt_enforce: string;
}

export const VISUAL_STYLES: VisualStyle[] = [
  { id: 'auto', name: '✨ AI Director Auto', desc: 'AI tự chọn phong cách phù hợp nhất với truyện.', prompt_enforce: '' },
  { id: 'hybrid_multimaterial', name: '♻️ Siêu Vật Liệu Tổng Hợp', desc: 'Kết hợp đa vật liệu: giấy thô, nhôm lon dập nổi, nhựa phế thải, lá khô quả hạt bản địa theo thị trường.', prompt_enforce: ', Visual Style: Masterpiece hyper-detailed hybrid multi-material upcycling art diorama, seamlessly combining raw textured handmade paper sheets, shiny embossed recycled soda can aluminum armor plates, corrugated cardboard layers, colorful discarded plastic mosaic elements, organic driftwood twigs, and regional plant foliage, extremely rich physical textures, dramatic studio lighting highlighting both matte cardboard and reflective metallic edges, cinematic macro photography' },
  { id: 'stop_motion_papercraft', name: '📦 Stop-Motion Papercraft', desc: 'Thế giới giấy thủ công, stop-motion chân thực, bìa carton, keo dán.', prompt_enforce: ', Visual Style: Hyper-detailed realistic physical stop-motion handcrafted paper universe, layered paper cutout animation, mechanical pop-up book engineering, diorama, corrugated cardboard, heavy cardstock, gold foil paper, visible paper fibers, subtle wrinkles, imperfect scissor cuts, macro cinematic photography, warm studio spotlights' },
  { id: 'dong_ho_folk', name: '🎨 Đông Hồ Folk Art', desc: 'Tranh Đông Hồ truyền thống, giấy dó, bột điệp, mộc bản.', prompt_enforce: ', Visual Style: Authentic Vietnamese Đông Hồ folk woodblock painting aesthetic, handmade dó paper coated with crushed seashell powder, mineral pigments, flattened folk perspective, simplified anatomy, symbolic composition, strong black woodblock outlines, limited traditional color palette vermilion red indigo yellow ochre leaf green, printed texture resembles manually pressed woodblock ink' },
  { id: 'water_puppet', name: '🎭 Múa Rối Nước', desc: 'Múa rối nước truyền thống, sân khấu nổi, chuyển động cơ học.', prompt_enforce: ', Visual Style: Authentic Vietnamese Water Puppetry aesthetic, hand-carved wooden puppets with glossy lacquer coating, visible artisan carving marks, traditional folk exaggeration, deep lacquer red aged gold moss green, warm fire-lit evening ambience, lantern reflections dancing across water, humid atmospheric diffusion' },
  { id: 'plastic_mosaic', name: '♻️ Plastic Mosaic', desc: 'Nắp chai, mảnh nhựa tái chế tạo hình linh vật thần thoại.', prompt_enforce: ', Visual Style: Vietnamese recycled plastic mosaic folk-art aesthetic, discarded bottle caps broken plastic shards translucent packaging fragments, mythological Vietnamese folk symbolism fused with urban recycling-art craftsmanship, faded red oxidized blue washed yellow cloudy white algae green, warm late-afternoon sunlight reflecting softly across glossy plastic surfaces' },
  { id: 'fabric_collage', name: '🧵 Fabric Collage', desc: 'Vải vụn, quần áo cũ, thêu tay tạo nhân vật dân gian.', prompt_enforce: ', Visual Style: Vietnamese fabric collage folk-art aesthetic, recycled cloth worn garments linen scraps faded cotton patched embroidery woven textures, faded indigo warm beige muted crimson dusty pink rice-paper white, soft diffused daylight illuminating cloth fibers and textile layering, gentle stop-motion textile feel' },
  { id: 'popup_cardboard', name: '📚 Pop-up Cardboard', desc: 'Sách nổi bìa carton, kỹ thuật pop-up, chiều sâu lớp lang.', prompt_enforce: ', Visual Style: Vietnamese pop-up cardboard diorama aesthetic, corrugated cardboard layered carton sheets folded paper-engineering structures, visible cut lines handmade glue seams exposed corrugation textures scoring marks, theatrical folk storytelling with tactile analog construction realism, warm directional lighting emphasizing cast shadows between cardboard layers' },
  { id: 'nature_debris', name: '🍂 Lá Khô & Hạt', desc: 'Lá khô, vỏ hạt, hạt đậu tạo bối cảnh rừng núi nguyên sơ.', prompt_enforce: ', Visual Style: Nature debris folk-art aesthetic, utilizing real dried leaves, sunflower seed shells, organic beans, whole grains, raw bark to construct ancient forest mountain landscapes, earthy brown, olive green, amber gold, dried red, natural organic textures, rustic handcrafted imperfections, visible leaf veins, soft warm natural daylight filtering through forest canopy, micro cinematic photography, tactile organic realism' },
  { id: 'metal_can_origami', name: '🥫 Metal Can Origami', desc: 'Vỏ lon bia, nước ngọt dập nổi, gấp nếp tạo giáp và hoa văn.', prompt_enforce: ', Visual Style: Recycled metal can origami art, physical folded aluminum sheets, embossed soda can patterns, cut and curled metallic edges, colorful printed tin lacquer, visible metal crimps, tiny rivet pins, highly reflective metallic surfaces, industrial upcycling aesthetic, dynamic studio lighting with bright silver reflections, copper highlights, brushed metal textures, macro sharp focus' },
  { id: 'egg_carton_clay', name: '🥚 Egg Carton Clay', desc: 'Đất sét vỉ trứng giấy, điêu khắc thô ráp, vân xơ giấy.', prompt_enforce: ', Visual Style: Textured egg carton paper-clay sculpture, rough hand-molded pulp clay, visible paper fibers, coarse organic surface, hand-carved textures, tactile dry clay cracks, earthy pastel pigments, charcoal wash shading, rustic folk sculpture realism, soft side-lit shadow depth, warm studio atmosphere' },
  { id: 'driftwood_twig', name: '🪵 Driftwood & Twig', desc: 'Cành củi khô, vỏ cây tạo bối cảnh cổ xưa, hoài cổ.', prompt_enforce: ', Visual Style: Handcrafted driftwood and twig art, rustic weathered tree branches, thin dry twigs, aged bark layers, natural forest floor debris, miniature wooden architecture, tactile raw timber grain, organic wood joints tied with hemp string, warm nostalgic late-afternoon sunbeams, soft cinematic shadows, ancient mystical forest vibe' },
  { id: 'button_string', name: '🧵 Button & String Art', desc: 'Cúc áo, len màu sặc sỡ, đan chỉ tạo hình sinh động.', prompt_enforce: ', Visual Style: Vibrant button and string-art collage, colorful recycled plastic buttons, tight embroidery thread patterns, woven colored yarn, metallic sewing pins, layered textile geometry, rich primary colors, tactile fabric base, warm soft overhead studio lighting, extreme close-up macro texture, sewing craft realism' },
  { id: 'cardboard_gears', name: '⚙️ Cardboard Gears', desc: 'Bánh răng carton 3D, cơ khí, chuyển động cơ học.', prompt_enforce: ', Visual Style: Intricate physical cardboard gears and machinery, layered corrugated carton wheels, sliding paper tracks, mechanical pulley systems, analog pop-up clockwork, exposed corrugation edges, tiny wooden dowel pins, raw kraft paper brown, dramatic industrial spotlights, high-contrast shadows emphasizing mechanical depth, tactile mechanical engineering realism' },
  { id: 'hybrid_metal_clay', name: '🌋 Hồn Sét Xương Sắt', desc: 'Vỉ trứng giấy thô ráp kết hợp giáp vỏ lon nhôm dập nổi.', prompt_enforce: ', Visual Style: Hybrid upcycling art, rough molded egg-carton clay body combined with sharp embossed soda can aluminum armor plates, raw rustic folk sculpture fused with shiny recycled metal scrap ornamentation, high-contrast textures, dramatic dual-source lighting highlighting matte clay and reflective metallic edges, cinematic macro photography' },
  { id: 'hybrid_popup_wood', name: '🌌 Khung Nổi Gỗ Lũa', desc: 'Nền carton pop-up kết hợp gỗ lũa tự nhiên 3D.', prompt_enforce: ', Visual Style: Hybrid physical diorama, layered corrugated cardboard pop-up architecture integrated with organic weathered driftwood branches and raw twigs, tactile paper-engineering meeting natural wooden shapes, volumetric morning mist, warm backlighting, dramatic cast shadows, dimensional artistic depth' },
  { id: 'hybrid_fabric_plastic', name: '🌺 Sợi Mềm Mảnh Bóng', desc: 'Vải thổ cẩm thêu tay kết hợp nắp chai nhựa màu sắc.', prompt_enforce: ', Visual Style: Hybrid textile and mosaic collage, rich colorful ethnic brocade embroidery and woven fabric patches combined with glossy recycled plastic bottle caps and colorful synthetic shards, high-contrast tactile surface, soft diffused daylight reflecting off plastic surfaces and woven thread fibers, cozy creative upcycling vibe' },
  { id: 'hybrid_folk_automata', name: '🎭 Đông Hồ Automata', desc: 'Tranh Đông Hồ giấy dó kết hợp bánh răng carton chuyển động.', prompt_enforce: ', Visual Style: Traditional Vietnamese Đông Hồ folk art print mounted on moving cardboard automata machinery, seashell-powder dó paper silhouettes connected to rotating corrugated carton gears and mechanical levers, flat traditional print aesthetic fused with physical kinetic theater realism, warm fire-lit festival ambience' }
];

export const SEO_CHECKLIST_DATA: Record<string, { id: string; label: string }[]> = {
  "Phần 1: Giáo Dục & Bảo Vệ Môi Trường (BẮT BUỘC)": [
    { id: "eco_1", label: "Thông điệp tái chế rõ ràng" },
    { id: "eco_2", label: "Giáo dục môi trường lồng ghép" },
    { id: "eco_3", label: "Hướng dẫn DIY khả thi tại nhà" },
    { id: "eco_4", label: "An toàn cho trẻ em (không vật liệu sắc nhọn)" },
  ],
  "Phần 2: SEO Truyện Cổ Tích Tái Chế": [
    { id: "seo_1", label: "Keyword: 'Truyện cổ tích', 'Tái chế', 'DIY', 'Thủ công'" },
    { id: "seo_2", label: "Thumbnail: Vật liệu tái chế → Tác phẩm nghệ thuật" },
    { id: "seo_3", label: "Hook: Đống rác → Kiệt tác cổ tích (Transformation)" },
    { id: "seo_4", label: "Mô tả: Hành trình sáng tạo + giá trị giáo dục" },
  ],
  "Phần 3: Cộng Đồng Eco-Art": [
    { id: "com_1", label: "Hỏi: 'Bạn muốn xem truyện nào được tái chế?'" },
    { id: "com_2", label: "CTA: Tặng Ebook hướng dẫn làm đồ chơi tái chế" },
  ],
};

export const SECONDS_PER_SCENE = 8;

export type TabId = 'spy' | 'script' | 'studio' | 'seo' | 'market' | 'admin';

export const TAB_COLORS: Record<TabId, { bg: string; border: string; text: string; shadow: string }> = {
  spy: { bg: 'bg-[#0a1f15]', border: 'border-emerald-500/50', text: 'text-emerald-400', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
  script: { bg: 'bg-[#1a1e2e]', border: 'border-teal-500/50', text: 'text-teal-300', shadow: 'shadow-[0_0_15px_rgba(20,184,166,0.15)]' },
  studio: { bg: 'bg-[#1f1a0f]', border: 'border-amber-500/50', text: 'text-amber-300', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' },
  seo: { bg: 'bg-[#0f1f20]', border: 'border-cyan-500/50', text: 'text-cyan-300', shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]' },
  market: { bg: 'bg-[#1f0f1a]', border: 'border-pink-500/50', text: 'text-pink-300', shadow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)]' },
  admin: { bg: 'bg-[#1a0f12]', border: 'border-red-500/50', text: 'text-red-300', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]' },
};
