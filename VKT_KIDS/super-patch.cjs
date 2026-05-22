const fs = require('fs');
const path = 'e:/HMKT/VKT_ECOSYSTEM_CORE/VKT_KIDS/src/data/prompts.ts';
let content = fs.readFileSync(path, 'utf8');

// --- 1. SEO PROMPT UPDATE ---
const newSeoPrompt = `export const SYSTEM_PROMPT_SEO_MASTER = \`You are a Global Content Strategist and Multi-Platform SEO Expert specializing in [NICHE_THEME].

MISSION: Create a COMPLETE, highly-optimized SEO package tailored specifically for YouTube, TikTok, and Facebook based on the provided script context.

REQUIRED JSON OUTPUT:
{
  "keywords": {
    "primary": ["Keyword 1", "Keyword 2"],
    "secondary": ["Keyword 3", "Keyword 4"],
    "long_tail": ["Long tail keyword string"]
  },
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"],
  "youtube": {
    "viral_titles": ["Title 1 (Capitalized hook)", "Title 2"],
    "video_description": {
      "hook": "First 2-3 lines that grab attention with emotional promise",
      "full_description": "Complete detailed description (300-500 words) emphasizing the core message.",
      "timestamps": [{"time": "0:00", "label": "Introduction"}]
    }
  },
  "tiktok": {
    "viral_titles": ["Short punchy title 1", "Short title 2"],
    "caption": "Engaging caption with questions and emojis, max 150 words."
  },
  "facebook": {
    "viral_titles": ["Engaging status title 1", "Story-driven title 2"],
    "status_post": "A conversational, story-driven post formatted with paragraphs, emojis, and a strong call-to-comment."
  },
  "thumbnail_suggestions": [
    {
      "concept_name": "Concept name",
      "visual_concept": "Visual description...",
      "text_on_image": "TEXT ON IMAGE (3-5 words, capitalized)",
      "color_psychology": "Main color tone...",
      "ai_image_prompt": "Detailed English prompt for Midjourney/DALL-E"
    }
  ],
  "engagement_comments": {
    "pinned_comment": "Pin this to top - ask an engaging question",
    "discussion_starters": ["Discussion question 1?"]
  }
}

BE SPECIFIC. PROVIDE ACTIONABLE CONTENT BASED EXACTLY ON THE PROVIDED SCRIPT.\`;`;

content = content.replace(/export const SYSTEM_PROMPT_SEO_MASTER = `[\s\S]*?PROVIDE ACTIONABLE CONTENT\.`;/, newSeoPrompt);

// --- 2. AUDIO PROMPT UPDATE ---
const audioProtocol = `
👑 2. CHỈ THỊ THANH ÂM THIẾT QUÂN LUẬT (HARDCODED AUDIO)
Chỉ thực hiện thay đổi nội dung của các thành phần thanh âm cốt lõi theo quy tắc thép:

Nguyên tắc Độc tôn & Đối thoại luân phiên (Single Voice & Alternating Dialogue):
* BẮT BUỘC có sự đối thoại qua lại giữa các nhân vật (VD: Mẹ và Bé) ĐỂ HỌC TIẾNG ANH.
* TUY NHIÊN, TRONG 8 GIÂY CỦA MỖI PHÂN CẢNH, CHỈ DUY NHẤT 01 CHỦ THỂ ĐƯỢC PHÉP CẤT TIẾNG. 
* Nghĩa là: Cảnh 1 (Mẹ nói), Cảnh 2 (Bé trả lời), Cảnh 3 (Mẹ nói tiếp). Cấm tuyệt đối 2 người cùng nói trong 1 cảnh. Nhân vật phụ đóng miệng hoàn toàn.

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
* Bắt buộc ghi nhận rõ hiệu ứng vuốt âm lượng (Crossfade/Fade) ở đầu mô tả sfx_music_suggestion của cảnh tiếp theo. BGM luôn giữ âm lượng ổn định ở mức tĩnh -20dB.
`;

const audioRegex = /.*2\.\s*CH[^\n]*TH[^\n]*THANH[^\n]*M THI[^\n]*T QU[^\n]*N LU[^\n]*T\s*\(HARDCODED AUDIO\)[\s\S]*?-20dB\./;
content = content.replace(audioRegex, audioProtocol.trim());

fs.writeFileSync(path, content, 'utf8');
console.log('Super patch applied');
