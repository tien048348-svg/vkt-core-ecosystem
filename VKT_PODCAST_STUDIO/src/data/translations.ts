// ==================================================================================
// TRANSLATIONS — VKT MASTER TEMPLATE
// File dịch thuật song ngữ VI/EN cho toàn bộ giao diện Studio
// ⚠️ KHI CLONE: Thay "PODCAST STUDIO" bằng tên studio của ngách mới
// ==================================================================================

export const translations = {
  vi: {
    header: {
      support: 'Hỗ trợ',
      config: 'Cài đặt API',
      langToggle: 'Tiếng Anh',
    },
    sidebar: {
      spy: 'Phân tích đối thủ',
      script: 'Viết kịch bản',
      studio: 'Studio',
      seo: 'SEO & Tiêu đề',
    },
    common: {
      generate: 'Tạo ngay',
      loading: 'Đang xử lý...',
      copy: 'Sao chép',
      copied: 'Đã sao chép!',
      error: 'Có lỗi xảy ra. Vui lòng thử lại.',
      save: 'Lưu',
      reset: 'Làm mới',
      close: 'Đóng',
    },
  },
  en: {
    header: {
      support: 'Support',
      config: 'API Settings',
      langToggle: 'Vietnamese',
    },
    sidebar: {
      spy: 'Competitor Analysis',
      script: 'Script Writer',
      studio: 'Studio',
      seo: 'SEO & Titles',
    },
    common: {
      generate: 'Generate',
      loading: 'Processing...',
      copy: 'Copy',
      copied: 'Copied!',
      error: 'An error occurred. Please try again.',
      save: 'Save',
      reset: 'Reset',
      close: 'Close',
    },
  },
};

export type Lang = keyof typeof translations;
