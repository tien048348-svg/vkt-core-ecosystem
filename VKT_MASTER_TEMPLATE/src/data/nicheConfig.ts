// ==================================================================================
// UNIVERSAL NICHE ADAPTER — VKT MASTER TEMPLATE
// File cấu hình duy nhất để "nhập hồn" cho Trợ lý AI và Hệ thống.
// Khi Clone dự án cho ngách mới, CHỈ CẦN THAY ĐỔI FILE NÀY.
// ==================================================================================

export interface NicheConfig {
  /** Tên ngách hiện tại (VD: "Phật pháp chữa lành", "Kids Cartoon", "Tài chính MMO") */
  nicheName: string;
  /** Tệp khán giả mục tiêu (Độ tuổi, tâm lý, nỗi đau) */
  targetAudience: string;
  /** Cảm xúc và Giọng điệu chủ đạo của nội dung */
  toneAndVibe: string;
  /** Các nguyên tắc đặc thù tuyệt đối không được vi phạm trong ngách này */
  specialRules: string[];
}

export const CURRENT_NICHE: NicheConfig = {
  nicheName: "Hoạt Hình Trẻ Em (Kids Cartoon & Education)",
  targetAudience: "Trẻ em từ 2-8 tuổi và các bậc phụ huynh tìm kiếm nội dung giáo dục, an toàn, vui nhộn cho con cái.",
  toneAndVibe: "Vui vẻ, nhí nhảnh, năng động, trong sáng. Hình ảnh đầy màu sắc rực rỡ, âm thanh dễ thương.",
  specialRules: [
    "Tuyệt đối tuân thủ đạo luật COPPA (Child Online Privacy Protection Act): Không chứa nội dung bạo lực, rùng rợn, ngôn từ độc hại.",
    "Nội dung phải mang tính giáo dục (học màu sắc, con vật, từ vựng, bài học đạo đức đơn giản).",
    "Kết thúc luôn là một bài học tích cực hoặc lời khen ngợi khích lệ trẻ em."
  ]
};
