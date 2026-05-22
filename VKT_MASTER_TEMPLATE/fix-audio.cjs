const fs = require('fs');
const path = 'e:/HMKT/VKT_ECOSYSTEM_CORE/VKT_MASTER_TEMPLATE/src/data/prompts.ts';
let content = fs.readFileSync(path, 'utf8');

// Clean up the mistakenly injected text above export const
content = content.replace(/# 2\. CHỈ THỊ THANH ÂM THIẾT QUÂN LUẬT[\s\S]*?BGM luôn giữ âm lượng ổn định ở mức tĩnh -20dB, không trồi sụt\.\s*/, '');

const audioProtocol = `
👑 2. CHỈ THỊ THANH ÂM THIẾT QUÂN LUẬT (HARDCODED AUDIO)
Chỉ thực hiện thay đổi nội dung của các thành phần thanh âm cốt lõi theo quy tắc thép:

Nguyên tắc Độc tôn (100% Single Voice):
* Trong 8 giây của mỗi phân cảnh, CHỈ DUY NHẤT 01 CHỦ THỂ ĐƯỢC PHÉP CẤT TIẾNG. Không hội thoại chồng lấn. Nhân vật phụ đóng miệng hoàn toàn.
* Cấm tuyệt đối hội thoại chồng lấn. Nếu kịch bản gốc có nhiều người nói, AI bắt buộc phải lọc lại để chỉ còn một tiếng nói duy nhất.

Tuổi Tuyệt Đối (Absolute Age Lock):
* Số tuổi (age) PHẢI LÀ SỐ TUYỆT ĐỐI CỤ THỂ (VD: 5, 7, 25, 30), KHÔNG ĐƯỢC ghi khoảng (VD: 4-6, 25-35).

Bản đồ Thanh âm Thích ứng (Adaptive Blueprint):
Mô tả giọng điệu phải khớp 100% với Ngữ cảnh/Ngách nội dung. Phải định danh rõ:
- Chất giọng (Timbre)
- Giọng điệu (Tone)
- Nhịp điệu (Pacing)
- Vị trí (State)

Lời thoại Nội lực (voice_text) & DYNAMIC SPEED MATRIX:
* CASE 1 (VIẾT TIẾNG VIỆT):
  - Viết lại lời thoại súc tích (30-40 từ). Cấm bẻ đôi từ ghép khi ngắt cảnh.
  - Tốc độ đọc (pacing_speed) PHẢI tuân theo tỷ lệ:
    + 30-33 từ: Speed 1.12x - 1.15x.
    + 34-37 từ: Speed 1.18x - 1.22x.
    + 38-40 từ: Speed 1.24x - 1.28x.
* CASE 2 (VIẾT TIẾNG ANH):
  - Viết lại lời thoại súc tích (25-33 từ). Tối đa 55 âm tiết.
  - Từ cuối câu trước giây 7.5 BẮT BUỘC là từ đơn âm tiết.
  - Tốc độ đọc (pacing_speed) PHẢI tuân theo tỷ lệ:
    + 25-28 từ: Speed 1.10x - 1.15x.
    + 29-33 từ: Speed 1.18x - 1.25x.
* Thoại dứt điểm ở giây 7.2 - 7.5 (audio_end_time), chừa 0.5s cuối im lặng kỹ thuật khóa chuyển động hình thể. Cấm nuốt chữ.

Giao thức Liền mạch Âm thanh (Audio Continuity):
* Bắt buộc ghi nhận rõ hiệu ứng vuốt âm lượng (Crossfade/Fade) ở đầu mô tả sfx_music_suggestion của cảnh tiếp theo (ví dụ: "The sound of BGM from the previous scene smoothly crossfades..."). BGM luôn giữ âm lượng ổn định ở mức tĩnh -20dB, không trồi sụt.
`;

content = content.replace(/👑 2\. CHỈ THỊ THANH ÂM THIẾT QUÂN LUẬT \(HARDCODED AUDIO\)[\s\S]*?Giao thức Liền mạch Âm thanh \(Audio Continuity\):[\s\S]*?-20dB\./, audioProtocol.trim());

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed audio prompt');
