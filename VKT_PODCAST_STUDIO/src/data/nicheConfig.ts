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
  nicheName: "Podcast & Deep Talk Studio",
  targetAudience: "Những người trưởng thành tìm kiếm chiều sâu tri thức, câu chuyện cảm hứng, chữa lành tâm hồn hoặc các cuộc phỏng vấn chuyên gia sâu sắc.",
  toneAndVibe: "Trưởng thành, sâu lắng, chuyên nghiệp, chân thực. Âm thanh rõ nét (Studio-quality), hình ảnh tĩnh lặng (Minimalist) giúp người xem tập trung 100% vào lời nói.",
  specialRules: [
    "Kịch bản PHẢI luôn tuân thủ nguyên tắc [SPEAKER & LIP-SYNC LOCK]: Chỉ 1 người nói và nhép môi tại một thời điểm, những người khác phải im lặng.",
    "Tuyệt đối không dùng nhạc nền quá to át tiếng nhân vật. Sử dụng hiệu ứng âm thanh (SFX) tinh tế (tiếng uống nước, tiếng thở, tiếng lật giấy).",
    "Góc quay máy quay (Camera Shot) thường tĩnh, lặp lại góc nhìn (VD: Máy quay số 1 góc cận mặt, máy quay số 2 góc toàn cảnh studio)."
  ]
};
