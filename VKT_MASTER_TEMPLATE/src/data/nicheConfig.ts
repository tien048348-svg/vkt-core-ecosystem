// ==================================================================================
// UNIVERSAL NICHE ADAPTER — VKT MASTER TEMPLATE
// File cấu hình duy nhất để "nhập hồn" cho Trợ lý AI và Hệ thống.
// Khi Clone dự án cho ngách mới, CHỈ CẦN THAY ĐỔI FILE NÀY.
// ==================================================================================

export interface TargetMarket {
  id: string;
  name: string;
  flag: string;
  voice_lang: string;
  currency: string;
  culture?: string;
}

export interface NicheConfig {
  /** Tên ngách hiện tại (VD: "Phật pháp chữa lành", "Kids Cartoon", "Tài chính MMO") */
  nicheName: string;
  /** Tệp khán giả mục tiêu (Độ tuổi, tâm lý, nỗi đau) */
  targetAudience: string;
  /** Cảm xúc và Giọng điệu chủ đạo của nội dung */
  toneAndVibe: string;
  /** Các nguyên tắc đặc thù tuyệt đối không được vi phạm trong ngách này */
  specialRules: string[];
  /** Danh sách thị trường mục tiêu */
  targetMarkets: Record<string, TargetMarket>;
  /** Danh sách các chủ đề con (Sub-topics) của ngách này */
  topics: { id: string; label: string }[];
}

export const CURRENT_NICHE: NicheConfig = {
  nicheName: "Hoạt Hình Trẻ Em (Kids Cartoon & Education)",
  targetAudience: "Trẻ em từ 2-8 tuổi và các bậc phụ huynh tìm kiếm nội dung giáo dục, an toàn, vui nhộn cho con cái.",
  toneAndVibe: "Vui vẻ, nhí nhảnh, năng động, trong sáng. Hình ảnh đầy màu sắc rực rỡ, âm thanh dễ thương.",
  specialRules: [
    "Tuyệt đối tuân thủ đạo luật COPPA (Child Online Privacy Protection Act): Không chứa nội dung bạo lực, rùng rợn, ngôn từ độc hại.",
    "Nội dung phải mang tính giáo dục (học màu sắc, con vật, từ vựng, bài học đạo đức đơn giản).",
    "Kết thúc luôn là một bài học tích cực hoặc lời khen ngợi khích lệ trẻ em."
  ],
  targetMarkets: {
    vn_kids: { id: 'vn_kids', name: 'Việt Nam - Thiếu Nhi & Học Tập', flag: '🇻🇳', voice_lang: 'Vietnamese', currency: 'VND', culture: 'Truyện cổ tích Việt Nam, học chữ cái, đạo đức cho bé, màu sắc tươi sáng, giọng đọc truyền cảm.' },
    us_preschool: { id: 'us_preschool', name: 'USA - Preschool Education', flag: '🇺🇸', voice_lang: 'English (US)', currency: 'USD', culture: 'Phonics, counting, vibrant colors, highly energetic, musical sing-alongs, positive reinforcement.' },
    jp_anime_kids: { id: 'jp_anime_kids', name: 'Japan - Anime Kids', flag: '🇯🇵', voice_lang: 'Japanese', currency: 'JPY', culture: 'Kawaii aesthetics, gentle life lessons, teamwork, soft pastels, Ghibli-inspired storytelling.' },
    kr_toddler: { id: 'kr_toddler', name: 'Korea - Toddler Rhythmic', flag: '🇰🇷', voice_lang: 'Korean', currency: 'KRW', culture: 'Catchy rhythmic songs (like Baby Shark), bright 3D characters, cute expressions, dance-along vibes.' }
  },
  topics: [
    { id: 'fruits', label: '🍎 Fruits & Veggies (Trái cây & Rau củ)' },
    { id: 'numbers', label: '🔢 Numbers 1-10 (Đếm số 1-10)' },
    { id: 'colors', label: '🎨 Colors (Màu sắc)' },
    { id: 'animals', label: '🐶 Animals & Sounds (Động vật)' },
    { id: 'body', label: '👂 Body Parts (Bộ phận cơ thể)' },
    { id: 'vehicles', label: '🚗 Vehicles (Giao thông)' }
  ]
};
