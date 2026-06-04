import { ZEN_EPISODIC_MATRIX } from './dharmaMatrix';

export type VoiceProfile = {
  speaker: string;
  age: string;
  gender: string;
  accent: string;
  timbre: string;
  tone: string;
  pacing_speed: string; // Tốc độ đọc khuyến nghị
};

export type NicheConfig = {
  nicheName: string;
  targetAudience: string;
  toneAndVibe: string;
  specialRules: string[];
  characterVoiceProfile: VoiceProfile;
  visualCharacterLock: string;
  visualWorldLock: string;
  globalVisualMessage: string;
  signatureOutro?: string;
  signatureOutroInstructions?: string;
  episodicMatrix?: string;
};

export const CURRENT_NICHE: NicheConfig = {
  nicheName: "Dharma Studio - Phật Pháp & Chữa Lành",
  targetAudience: "Những người đang gặp khủng hoảng, căng thẳng, cần tìm sự bình yên, muốn hiểu về luật nhân quả, Phật pháp ứng dụng trong đời sống.",
  toneAndVibe: "Trang nghiêm, sâu lắng, tĩnh tại, từ bi, chữa lành, không phán xét.",
  specialRules: [
    "TUYỆT ĐỐI an toàn, không có yếu tố bạo lực, ma quỷ đáng sợ hay mê tín dị đoan.",
    "Giữ nguyên các thuật ngữ Phật giáo mộc mạc (Nhân quả, Vô thường, Chánh niệm) nhưng giải thích dễ hiểu.",
    "Luôn kết thúc bằng sự bao dung, ánh sáng và lối thoát hướng thiện.",
    "Âm thanh phải có tính thiền (tiếng chuông, mõ, nhạc cụ dân tộc nhẹ nhàng, ASMR mộc mạc)."
  ],
  characterVoiceProfile: {
    speaker: "Zen Master",
    age: "70",
    gender: "MALE",
    accent: "NORTHERN_VIETNAMESE",
    timbre: "Temple Reverb",
    tone: "Awakening, engaging, profound",
    pacing_speed: "1.25x" // Faster default base for short form
  },
  visualCharacterLock: "Một vị Thiền sư sống động có da thịt và cơ thể được cấu tạo từ vật liệu đặc biệt (COMPLETELY BALD, NO HAIR, SHAVED HEAD) toát lên vẻ từ bi. [LƯU Ý QUAN TRỌNG: MÀU SẮC, CHẤT LIỆU CƠ THỂ PHẢI TUÂN THỦ TUYỆT ĐỐI THEO 'VISUAL_STYLE' MÀ NGƯỜI DÙNG CHỌN BÊN DƯỚI]. [ABSOLUTE LOCK: ĐÂY LÀ MỘT CON NGƯỜI SỐNG, KHÔNG PHẢI BỨC TƯỢNG (NOT A STATUE). BẮT BUỘC PHẢI CÓ HÀNH ĐỘNG ĐỘNG (DYNAMIC ACTIONS): BƯỚC ĐI TỰ NHIÊN (WALKING FLUIDLY), VUNG TAY CHỈ DẠY (GESTURING), HOẶC TƯƠNG TÁC VỚI MÔI TRƯỜNG. CẤM SỬ DỤNG CÁC TỪ 'STATUE', 'SCULPTURE', 'CARVED' TRONG PROMPT TIẾNG ANH. HÃY DÙNG 'LIVING MONK', 'SENTIENT BEING'. KHẨU HÌNH MIỆNG CHUYỂN ĐỘNG KHỚP VỚI LỜI THOẠI.]",
  visualWorldLock: "[EPIC OPENING & DYNAMIC CAMERA LOCK]: CẤM DÙNG CHUNG MỘT GÓC MÁY TĨNH (STATIC SHOT) HAY LẶP LẠI MỘT HÀNH LANG HẸP. CẢNH 1 BẮT BUỘC PHẢI MỞ ĐẦU BẰNG GÓC SIÊU RỘNG NGOÀI TRỜI (EXTREME WIDE SHOT / DRONE SHOT) TẠI THIÊN NHIÊN KỲ VĨ (NÚI NON, THUNG LŨNG). Không gian sử thi kỳ vĩ (Epic Cinematic Scale). Môi trường, kiến trúc, ánh sáng BẮT BUỘC phải thay đổi linh hoạt và chuyển đổi qua từng cảnh để KHỚP 100% VỚI 'VISUAL_STYLE'. Không gian luôn mang đậm tính 8K Unreal Engine 5. BẮT BUỘC SỬ DỤNG NHIỀU GÓC QUAY ĐIỆN ẢNH KHÁC NHAU XUYÊN SUỐT CÁC CẢNH (TRACKING SHOT THEO BƯỚC CHÂN, PANNING, LOW ANGLE, HIGH ANGLE).",
  globalVisualMessage: "Dùng chuyển động vật lý đặc trưng của 'VISUAL_STYLE' được chọn (ví dụ: khói, cát, mực loang, vệt sáng...) để ẩn dụ sự Vô Thường và Luân Hồi một cách choáng ngợp nhất. [UNIVERSAL VISUAL LANGUAGE]: HÌNH ẢNH PHẢI CÓ KHẢ NĂNG TỰ KỂ CHUYỆN (VISUAL STORYTELLING). SỰ BIẾN CHUYỂN CỦA BỐI CẢNH (LÁ RỤNG, MƯA RƠI, ÁNH SÁNG THAY ĐỔI) VÀ HÀNH ĐỘNG CỦA NHÂN VẬT PHẢI ĐỦ SÂU SẮC ĐỂ MỘT NGƯỜI NƯỚC NGOÀI KHÔNG HIỂU TIẾNG VIỆT VẪN CẢM NHẬN ĐƯỢC THÔNG ĐIỆP. KHÔNG ĐƯỢC TỰ Ý THÊM VÀNG KINTSUGI NẾU VISUAL STYLE ĐÓ KHÔNG YÊU CẦU.",
  signatureOutro: "Dừng lại giữa dòng để giữ cho mình một khoảng tĩnh lặng. Để mỗi lời nói là bước chân nhẹ nhàng đưa ta về thực tại. Hôm nay, hạt giống thiện lành nào sẽ được bạn gieo xuống?",
  signatureOutroInstructions: `Hướng dẫn cách đọc để chạm đến cảm xúc khán giả:
- Vế 1: "Dừng lại giữa dòng để giữ cho mình một khoảng tĩnh lặng." -> Đọc với giọng trầm, tốc độ vừa phải. Chữ "tĩnh lặng" đọc nhẹ và kéo dài hơi một chút, sau đó ngắt nghỉ khoảng 1.5 - 2 giây để người nghe thực sự cảm nhận được khoảng lặng đó.
- Vế 2: "Để mỗi lời nói là bước chân nhẹ nhàng đưa ta về thực tại." -> Nhịp điệu đều đặn, êm ái như một bước đi chậm. Chữ "thực tại" nhấn nhẹ để thức tỉnh người nghe quay về với giây phút hiện tại. Ngắt nghỉ khoảng 1 giây.
- Vế 3: "Hôm nay, hạt giống thiện lành nào sẽ được bạn gieo xuống?" -> Giọng đọc mang tính tâm tình, thủ thỉ, hơi hạ tông giọng ở cuối câu hỏi để tạo dư âm định hình sâu vào tâm trí họ sau khi video kết thúc.`,
  episodicMatrix: ZEN_EPISODIC_MATRIX
};
