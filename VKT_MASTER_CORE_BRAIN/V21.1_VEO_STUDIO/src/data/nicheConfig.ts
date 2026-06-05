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
  visualCharacterLock: "Một vị Thiền sư sống động có da thịt và cơ thể được cấu tạo HOÀN TOÀN TỪ ĐÁ CẨM THẠCH TRẮNG TINH KHIẾT (PRISTINE WHITE MARBLE) tuyệt đẹp, có điểm xuyết các đường vân vàng Kintsugi rực rỡ (COMPLETELY BALD, NO HAIR, SHAVED HEAD) toát lên vẻ từ bi. [LƯU Ý QUAN TRỌNG: BẮT BUỘC SỬ DỤNG CHẤT LIỆU 'PRISTINE WHITE MARBLE' (ĐÁ CẨM THẠCH TRẮNG) VÀ 'KINTSUGI GOLD VEINS' CHO CƠ THỂ NHÂN VẬT VÀ BỐI CẢNH. TUYỆT ĐỐI CẤM DÙNG DARK STONE, OBSIDIAN HAY GRANITE ĐEN]. [ANTI-DUPLICATE LOCK: BẮT BUỘC DÙNG TỪ 'SOLO 1 character ONLY, NO EXTRA PEOPLE' ĐỂ TRÁNH MÁY ẢO GIÁC ĐẺ RA 2 NHÂN VẬT]. [ABSOLUTE ANTI-CUTOFF LOCK: ĐÂY LÀ MỘT CON NGƯỜI SỐNG ĐỨNG THẲNG TRÊN SÀN (STANDING FULLY ON THE FLOOR, LEGS VISIBLE). BẮT BUỘC KHÔNG BỊ CẮT NỬA NGƯỜI HAY CHÌM XUỐNG SÀN. KHÔNG BÀN ĐÁ, KHÔNG BỤC GIẢNG. BẮT BUỘC PHẢI CÓ HÀNH ĐỘNG ĐỘNG (DYNAMIC ACTIONS): BƯỚC ĐI TỰ NHIÊN (WALKING FLUIDLY), VUNG TAY CHỈ DẠY (GESTURING). CẤM SỬ DỤNG CÁC TỪ 'STATUE', 'SCULPTURE', 'CARVED', 'BUST' TRONG PROMPT TIẾNG ANH. HÃY DÙNG 'LIVING MONK', 'SENTIENT BEING'.]",
  visualWorldLock: "[EPIC OPENING & DYNAMIC CAMERA LOCK]: CẤM DÙNG CHUNG MỘT GÓC MÁY TĨNH (STATIC SHOT) HAY LẶP LẠI MỘT HÀNH LANG HẸP. CẢNH 1 BẮT BUỘC PHẢI MỞ ĐẦU BẰNG GÓC SIÊU RỘNG NGOÀI TRỜI (EXTREME WIDE SHOT / DRONE SHOT) TẠI THIÊN NHIÊN KỲ VĨ (NÚI NON, THUNG LŨNG). Môi trường, kiến trúc, ánh sáng BẮT BUỘC phải KHỚP 100% VỚI 'VISUAL_STYLE' NHƯNG LUÔN GIỮ SỰ TƯƠI SÁNG (NO DARK CAVE, NO CREEPY SHADOWS). Không gian luôn mang đậm tính 8K Unreal Engine 5. [CRITICAL NATURE LOCK: CHỈ CÓ KIẾN TRÚC (TƯỜNG, CỘT, SÀN) LÀ LÀM BẰNG ĐÁ. TẤT CẢ CÂY CỐI, HOA LÁ, THIÊN NHIÊN (CÂY BỒ ĐỀ, RỪNG, RÊU) BẮT BUỘC PHẢI LÀ THỰC VẬT SỐNG THẬT 100%, XANH TƯƠI TỐT (LUSH GREEN LIVING TREES, REALISTIC NATURE). TUYỆT ĐỐI CẤM BIẾN CÂY THÀNH ĐÁ]. BẮT BUỘC SỬ DỤNG NHIỀU GÓC QUAY ĐIỆN ẢNH (TRACKING SHOT THEO BƯỚC CHÂN, PANNING, LOW ANGLE, WIDE SHOT). [CRITICAL: ĐỂ TRÁNH LỖI CẮT NGƯỜI, CẤM DÙNG 'CLOSE-UP' HAY 'MEDIUM SHOT' TRONG NHỮNG CẢNH DI CHUYỂN, BẮT BUỘC DÙNG 'FULL BODY SHOT' VÀ '(showing full body, legs walking on floor)'].",
  globalVisualMessage: "Dùng chuyển động vật lý đặc trưng của 'VISUAL_STYLE' được chọn để ẩn dụ sự Vô Thường. [UNIVERSAL VISUAL LANGUAGE]: HÌNH ẢNH PHẢI CÓ KHẢ NĂNG TỰ KỂ CHUYỆN (VISUAL STORYTELLING). SỰ BIẾN CHUYỂN CỦA BỐI CẢNH PHẢI ĐỦ SÂU SẮC ĐỂ MỘT NGƯỜI NƯỚC NGOÀI KHÔNG HIỂU TIẾNG VIỆT VẪN CẢM NHẬN ĐƯỢC THÔNG ĐIỆP.",
  signatureOutro: "Dừng lại giữa dòng để giữ cho mình một khoảng tĩnh lặng. Để mỗi lời nói là bước chân nhẹ nhàng đưa ta về thực tại. Hôm nay, hạt giống thiện lành nào sẽ được bạn gieo xuống?",
  signatureOutroInstructions: `Hướng dẫn cách đọc để chạm đến cảm xúc khán giả:
- Vế 1: "Dừng lại giữa dòng để giữ cho mình một khoảng tĩnh lặng." -> Đọc với giọng trầm, tốc độ vừa phải. Chữ "tĩnh lặng" đọc nhẹ và kéo dài hơi một chút, sau đó ngắt nghỉ khoảng 1.5 - 2 giây để người nghe thực sự cảm nhận được khoảng lặng đó.
- Vế 2: "Để mỗi lời nói là bước chân nhẹ nhàng đưa ta về thực tại." -> Nhịp điệu đều đặn, êm ái như một bước đi chậm. Chữ "thực tại" nhấn nhẹ để thức tỉnh người nghe quay về với giây phút hiện tại. Ngắt nghỉ khoảng 1 giây.
- Vế 3: "Hôm nay, hạt giống thiện lành nào sẽ được bạn gieo xuống?" -> Giọng đọc mang tính tâm tình, thủ thỉ, hơi hạ tông giọng ở cuối câu hỏi để tạo dư âm định hình sâu vào tâm trí họ sau khi video kết thúc.`,
  episodicMatrix: ZEN_EPISODIC_MATRIX
};
