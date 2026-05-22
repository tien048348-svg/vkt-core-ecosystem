const fs = require('fs');
const path = 'e:/HMKT/VKT_ECOSYSTEM_CORE/VKT_KIDS/src/data/prompts.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Inject Audio Protocol
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

// Replace audio rules logic inside SYSTEM_PROMPT_AUDIO_REENGINEERING
content = content.replace(/# 2\. CHỈ THỊ THANH ÂM THIẾT QUÂN LUẬT[\s\S]*?Giao thức Liền mạch Âm thanh \(Audio Continuity\):[\s\S]*?-20dB\./, audioProtocol.trim());


// 2. Inject SEO Master Prompt
const newSeoPrompt = "export const SYSTEM_PROMPT_SEO_MASTER = `You are a Global Content Strategist and Multi-Platform SEO Expert specializing in [NICHE_THEME].\\n\\n" +
"MISSION: Create a COMPLETE, highly-optimized SEO package tailored specifically for YouTube, TikTok, and Facebook based on the provided script context.\\n\\n" +
"REQUIRED JSON OUTPUT:\\n" +
"{\\n" +
"  \\"keywords\\": {\\n" +
"    \\"primary\\": [\\"Keyword 1\\", \\"Keyword 2\\"],\\n" +
"    \\"secondary\\": [\\"Keyword 3\\", \\"Keyword 4\\"],\\n" +
"    \\"long_tail\\": [\\"Long tail keyword string\\"]\\n" +
"  },\\n" +
"  \\"hashtags\\": [\\"#Tag1\\", \\"#Tag2\\", \\"#Tag3\\", \\"#Tag4\\", \\"#Tag5\\"],\\n" +
"  \\"youtube\\": {\\n" +
"    \\"viral_titles\\": [\\"Title 1 (Capitalized hook)\\", \\"Title 2\\"],\\n" +
"    \\"video_description\\": {\\n" +
"      \\"hook\\": \\"First 2-3 lines that grab attention with emotional promise\\",\\n" +
"      \\"full_description\\": \\"Complete detailed description (300-500 words) emphasizing the core message.\\",\\n" +
"      \\"timestamps\\": [{\\"time\\": \\"0:00\\", \\"label\\": \\"Introduction\\"}]\\n" +
"    }\\n" +
"  },\\n" +
"  \\"tiktok\\": {\\n" +
"    \\"viral_titles\\": [\\"Short punchy title 1\\", \\"Short title 2\\"],\\n" +
"    \\"caption\\": \\"Engaging caption with questions and emojis, max 150 words.\\"\\n" +
"  },\\n" +
"  \\"facebook\\": {\\n" +
"    \\"viral_titles\\": [\\"Engaging status title 1\\", \\"Story-driven title 2\\"],\\n" +
"    \\"status_post\\": \\"A conversational, story-driven post formatted with paragraphs, emojis, and a strong call-to-comment.\\"\\n" +
"  },\\n" +
"  \\"thumbnail_suggestions\\": [\\n" +
"    {\\n" +
"      \\"concept_name\\": \\"Concept name\\",\\n" +
"      \\"visual_concept\\": \\"Visual description...\\",\\n" +
"      \\"text_on_image\\": \\"TEXT ON IMAGE (3-5 words, capitalized)\\",\\n" +
"      \\"color_psychology\\": \\"Main color tone...\\",\\n" +
"      \\"ai_image_prompt\\": \\"Detailed English prompt for Midjourney/DALL-E\\"\\n" +
"    }\\n" +
"  ],\\n" +
"  \\"engagement_comments\\": {\\n" +
"    \\"pinned_comment\\": \\"Pin this to top - ask an engaging question\\",\\n" +
"    \\"discussion_starters\\": [\\"Discussion question 1?\\"]\\n" +
"  }\\n" +
"}\\n\\n" +
"BE SPECIFIC. PROVIDE ACTIONABLE CONTENT BASED EXACTLY ON THE PROVIDED SCRIPT.`;";

content = content.replace(/export const SYSTEM_PROMPT_SEO_MASTER = `[\s\S]*?PROVIDE ACTIONABLE CONTENT\.`;/, newSeoPrompt);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed prompts in VKT_KIDS');
