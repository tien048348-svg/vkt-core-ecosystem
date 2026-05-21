export interface AppLink {
  id: string;
  type: 'youtube' | 'facebook' | 'tiktok' | 'website' | 'other';
  url: string;
  label: string;
}

export interface AppConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  color: string;
  iconName: string;
  coverImage?: string;
  extraLinks?: AppLink[];
  videoUrl?: string;
  isHidden?: boolean;
  aiKnowledge?: string; // Dữ liệu đào tạo AI cho dự án này
}

// ─── Gói dịch vụ ──────────────────────────────────────────────────────────────
export interface Plan {
  id: string;
  type: 'single' | 'bundle';   // lẻ hoặc combo
  name: string;
  description: string;
  appIds: string[];             // [] = tất cả app
  durationDays: number;
  price: number;                // ẩn khi paymentEnabled=false
  currency: 'VND';
  isActive: boolean;
  sortOrder: number;
}

export interface SiteConfig {
  logoUrl: string;
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  footerText: string;
  themeColor: 'gold' | 'indigo' | 'rose' | 'amber' | 'emerald' | 'cyan';
  slogan?: string;
  hotline?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  zaloUrl?: string;
  footerDescription?: string;
  termsUrl?: string;
  privacyUrl?: string;
  adminPassword?: string;
  adminEmail?: string;
  // ─── Cài đặt hệ thống ────────────────────────────────────────────────────────
  // Dùng thử (Trial)
  trialEnabled?: boolean;
  trialDays?: number;
  trialAppIds?: string[];       // [] = tất cả app
  // Cấp quyền mặc định (Default Access)
  defaultAccessEnabled?: boolean;
  defaultAccessDays?: number;
  defaultAccessAppIds?: string[]; // [] = tất cả app
  // Thanh toán (Payment)
  paymentEnabled?: boolean;
  bankId?: string;
  bankAccount?: string;
  bankName?: string;
  systemTickerText?: string;
  aiSystemPrompt?: string; // System prompt cho trợ lý AI
}

export const defaultSiteConfig: SiteConfig = {
  logoUrl: "",
  siteTitle: "VKT.HUB",
  heroTitle: "Hệ Sinh Thái\nCông Nghệ VKT",
  heroSubtitle: "Tuyệt tác công nghệ hội tụ. Khám phá vũ trụ giải pháp AI, sản xuất tự động và quản lý đám mây đỉnh cao nhất dành riêng cho doanh nghiệp của bạn.",
  heroImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
  feature1Title: "Siêu Trí Tuệ AI",
  feature1Desc: "Tích hợp lõi AI độc quyền, tự động hóa 100% quy trình sáng tạo và sản xuất nội dung.",
  feature2Title: "Đồng Bộ Thời Gian Thực",
  feature2Desc: "Công nghệ đám mây tối tân giúp mọi tương tác và dữ liệu được cập nhật ngay lập tức.",
  feature3Title: "Bảo Mật Tuyệt Đối",
  feature3Desc: "Hệ thống mã hóa đa lớp chuẩn Enterprise, bảo vệ an toàn mọi tài sản số của bạn.",
  footerText: "© 2026 VKT Studio. Khơi nguồn sáng tạo, kiến tạo tương lai.",
  themeColor: 'gold',
  slogan: "Khơi nguồn sáng tạo — Kiến tạo tương lai 🚀",
  hotline: "055 979 3678",
  email: "support@kiemtienvu.com",
  address: "Hà Nội, Vietnam",
  facebookUrl: "https://facebook.com/vktstudio",
  youtubeUrl: "https://youtube.com/@vktstudio",
  zaloUrl: "https://zalo.me/vktstudio",
  footerDescription: "Hệ sinh thái công nghệ VKT — Nơi hội tụ các giải pháp AI đột phá, tiên phong trong chuyển đổi số và tự động hóa sản xuất nội dung sáng tạo.",
  termsUrl: "",
  privacyUrl: "",
  adminPassword: "vktadmin2026",
  adminEmail: "support@kiemtienvu.com",
  // System defaults
  trialEnabled: false,
  trialDays: 3,
  trialAppIds: [],
  defaultAccessEnabled: false,
  defaultAccessDays: 30,
  defaultAccessAppIds: [],
  paymentEnabled: false,
  bankId: "MB",
  bankAccount: "0559793678",
  bankName: "VU KHAC TIEN",
  systemTickerText: "🟢 Hệ thống: Hoạt động ổn định 100% | Băng thông mạng: 3.2 Gbps | Ping phản hồi: 14ms | ⚡ Đám mây VKT: Đồng bộ thời gian thực thành công trên toàn bộ 3 máy chủ ứng dụng",
  aiSystemPrompt: "Bạn là Trợ lý ảo AI thông minh của VKT Ecosystem Hub.\nHãy phân tích cách người dùng xưng hô để chọn cách xưng hô lại cho phù hợp (Ví dụ: khách xưng 'anh/chị' thì mình xưng 'em/trợ lý', khách xưng 'mình/tôi' thì mình xưng 'mình/trợ lý'). Luôn giữ thái độ thân thiện, chuyên nghiệp.",
};

// ─── Gói mặc định ─────────────────────────────────────────────────────────────
export const defaultPlans: Plan[] = [
  {
    id: 'trial-3d',
    type: 'single',
    name: 'Dùng thử 3 ngày',
    description: 'Trải nghiệm miễn phí toàn bộ tính năng trong 3 ngày',
    appIds: [],
    durationDays: 3,
    price: 0,
    currency: 'VND',
    isActive: true,
    sortOrder: 0,
  },
  {
    id: 'basic-30d',
    type: 'single',
    name: 'Gói Cơ Bản 1 tháng',
    description: 'Truy cập 1 ứng dụng trong 30 ngày',
    appIds: ['dharma-studio'],
    durationDays: 30,
    price: 299000,
    currency: 'VND',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'pro-90d',
    type: 'bundle',
    name: 'Gói Nâng Cao 3 tháng',
    description: 'Truy cập combo ứng dụng trong 90 ngày',
    appIds: ['dharma-studio', 'kids-cartoon'],
    durationDays: 90,
    price: 499000,
    currency: 'VND',
    isActive: true,
    sortOrder: 2,
  },
];

export const defaultApps: AppConfig[] = [
  {
    id: "kids-cartoon",
    name: "VKT Kids Cartoon Studio",
    description: "Cỗ máy sản xuất video hoạt hình 3D cho trẻ em. Tự động sinh kịch bản, nhân bản giọng nói (Voice Clone) và xuất bản video chất lượng 4K chỉ trong tích tắc.",
    iconName: "Play",
    color: "from-pink-500 to-rose-500",
    url: "https://vkt-kids.com",
    coverImage: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?q=80&w=1000&auto=format&fit=crop",
    extraLinks: [
      { id: "1", type: "youtube", label: "Xem Demo", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
    ]
  },
  {
    id: "dharma-studio",
    name: "VKT Dharma Studio",
    description: "Trạm phát sóng tinh thần. Nơi sản xuất nội dung Phật giáo và Đạo lý chuyên nghiệp với giọng đọc AI truyền cảm, hình ảnh thiền định và âm nhạc tĩnh tâm.",
    iconName: "Sparkles",
    color: "from-blue-500 to-indigo-500",
    url: "https://vkt-dharma.com",
    coverImage: "https://images.unsplash.com/photo-1519834785169-98be25ce3e52?q=80&w=1000&auto=format&fit=crop",
    extraLinks: [
      { id: "2", type: "youtube", label: "Pháp Thoại", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { id: "3", type: "facebook", label: "Cộng Đồng", url: "https://facebook.com" }
    ]
  },
  {
    id: "recyclestyles",
    name: "VKT Recyclestyles",
    description: "Nền tảng lan tỏa lối sống xanh. Hệ thống tự động biên dịch, ghép âm thanh và xuất bản các video hướng dẫn làm đồ handmade từ vật liệu tái chế.",
    iconName: "Leaf",
    color: "from-emerald-500 to-teal-500",
    url: "https://vkt-eco.com",
    coverImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop"
  }
];
