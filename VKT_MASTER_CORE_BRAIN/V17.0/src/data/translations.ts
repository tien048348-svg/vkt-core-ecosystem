export const translations = {
  vi: {
    sidebar: {
      spy: '1. Chiến Lược Thị Trường',
      script: '2. Biên Kịch Storyboard',
      studio: '3. Xưởng Sản Xuất Video',
      seo: '4. Tối Ưu Viral & SEO',
    },
    header: {
      support: 'Hỗ trợ 24/7',
      config: 'Cấu hình',
    },
    footer: {
      rights: 'Bảo lưu mọi quyền.',
    },
    common: {
      loading: 'Đang xử lý...',
      copy: 'Sao chép',
      copied: 'Đã sao chép!',
      save: 'Lưu lại',
      delete: 'Xóa',
      generate: 'Tạo nội dung',
      placeholder: 'Nhập nội dung...',
    },
    spy: {
      title: 'Phân Tích & Định Hướng Thị Trường',
      desc: 'Tìm kiếm ngách, phân tích đối thủ và lập kế hoạch nội dung viral.',
    },
    script: {
      title: 'Biên Kịch & Xây Dựng Storyboard',
      desc: 'Tự động tạo kịch bản chi tiết từ ý tưởng hoặc chủ đề của bạn.',
    },
    studio: {
      title: 'Xưởng Sản Xuất Video AI',
      desc: 'Tạo prompt hình ảnh/video chuyên nghiệp dựa trên kịch bản đã biên soạn.',
    },
    seo: {
      title: 'Tối Ưu Viral & Quản Trị SEO',
      desc: 'Hoàn thiện metadata, hashtag và checklist viral trước khi đăng tải.',
    },
    apiModal: {
      title: 'Gemini API Key',
      subtitle: 'Nhập key để sử dụng AI',
      getLink: '🔑 Lấy API tại đây',
      addKey: 'Thêm Key (Gmail khác)',
      warning: 'Cần ít nhất 1 API Key bắt đầu bằng "AIza..."',
      submit: 'NHẬP API KEY ĐỂ TIẾP TỤC',
      securityNote: '🔒 Keys lưu an toàn trong trình duyệt',
    }
  },
  en: {
    sidebar: {
      spy: '1. Market Strategy',
      script: '2. Script & Storyboard',
      studio: '3. AI Video Studio',
      seo: '4. Viral & SEO Optimization',
    },
    header: {
      support: 'Support 24/7',
      config: 'Config',
    },
    footer: {
      rights: 'All rights reserved.',
    },
    common: {
      loading: 'Processing...',
      copy: 'Copy',
      copied: 'Copied!',
      save: 'Save',
      delete: 'Delete',
      generate: 'Generate Content',
      placeholder: 'Enter content...',
    },
    spy: {
      title: 'Market Analysis & Direction',
      desc: 'Find niches, analyze competitors and plan viral content.',
    },
    script: {
      title: 'Scripting & Storyboard Building',
      desc: 'Automatically create detailed scripts from your ideas or topics.',
    },
    studio: {
      title: 'AI Video Production Studio',
      desc: 'Create professional image/video prompts based on compiled scripts.',
    },
    seo: {
      title: 'Viral Optimization & SEO Management',
      desc: 'Complete metadata, hashtags and viral checklist before posting.',
    },
    apiModal: {
      title: 'Gemini API Key',
      subtitle: 'Enter key to use AI',
      getLink: '🔑 Get API Key here',
      addKey: 'Add Key (Other Gmail)',
      warning: 'Need at least 1 API Key starting with "AIza..."',
      submit: 'SUBMIT API KEY TO CONTINUE',
      securityNote: '🔒 Keys are stored securely in browser',
    }
  }
};

export type TranslationType = typeof translations.vi;
