# 📋 HƯỚNG DẪN TẠO DỰ ÁN RECYCLE STYLES MASTER

> **Brand: VKT / 055.979.3678**
> **API: Google Gemini (duy nhất)**
> **Template gốc:** `c:\Users\Vo Tung\Downloads\PSY\`
> **Phiên bản guide:** v4.0 (cập nhật 2026-05-19 — MASTER AGENT V16.0 Merge)
> **Đã deploy thành công:** Philosophy, Criminal, Dharma, Horror, **Recycle Styles**

---

## 🚀 CHANGELOG: V16.0 MASTER AGENT UPDATE (Tích hợp 3 Dự án: Master, Tái Chế, Kids)

- **VEO3 AUTO-SHIELD Protocol:** Tích hợp bộ khiên bảo vệ 10 lớp chặn lỗi nội dung video (không bóng ma, không chồng lấn, không có chữ, khóa độ phân giải góc máy).
- **Audio Truncation Shield (7.5s):** Đồng bộ hóa nhịp điệu (Pacing) để cắt lời chính xác từ 7.2s đến 7.5s (Chống nuốt chữ).
- **Dynamic Speed Matrix:** Tính toán Tốc Độ (Speed) động theo khối lượng từ vựng (Word count) để đảm bảo thời gian thoại chuẩn xác.
- **Enhanced UI Visibility:** Thêm thông số hiển thị `SPEED`, `WORDS`, và `END TIME` vào Voice Profile trên cả `ScriptModule.tsx` và `StudioModule.tsx` để người dùng kiểm soát chính xác.
- **Excel Export Fix:** Cập nhật hàm tải dữ liệu `.csv` (`exportCSV`) trong `StudioModule.tsx` để bao gồm 3 cột mới (Speed, Words, End Time) đồng bộ hoàn toàn với giao diện.
- **JSON Download Fix:** Khắc phục triệt để lỗi không lưu được file `.json` do bị trình duyệt chặn ẩn. Viết lại hàm `downloadFile` mạnh mẽ tích hợp cả thông báo UI (Toast).

## 🚀 CHANGELOG: V16.1 STATE RESET & AUTO-CLEAR UPDATE (Tái Chế, Kids, Dharma)

- **F5 Clear Logic (No Persistent Cache on Mount):** Gỡ bỏ hoàn toàn logic khôi phục kịch bản tự động từ `localStorage` khi người dùng tải lại trang (nhấn F5) hoặc bắt đầu dự án mới, đảm bảo khởi động một không gian làm việc sạch hoàn toàn.
- **Empty Topic Auto-Clear:** Khi ô nhập liệu chủ đề (Topic) bị xóa trắng, hệ thống ngay lập tức kích hoạt hàm dọn sạch kịch bản cũ, phân đoạn (segments) và cấu trúc dữ liệu cũ trong DOM hiển thị, ngăn chặn triệt để việc đọng lại dữ liệu của dự án trước.
- **Dharma Studio Compilation Fix:** Khắc phục triệt để import constants bằng cách khai báo cục bộ 10 phân ngách Phật Pháp cùng ma trận bối cảnh vi mô thiền định ngay trong component `ScriptModule.tsx` của VKT Dharma Studio.

## 🚀 CHANGELOG: V16.2 DETAILED N-CHARACTER VOICE & SFX EXPANSION (Tái Chế, Kids, Dharma)

- **Dynamic N-Character Alternating Voice:** Cải tiến prompt viết kịch bản và audio reengineering, loại bỏ hoàn toàn việc khóa cứng một giọng nói duy nhất suốt câu chuyện. Cho phép đa nhân vật (N-speakers) luân phiên thoại sinh động giữa các phân cảnh, nhưng tuyệt đối tuân thủ nguyên lý đơn chủ thể cất tiếng trong cùng 1 phân cảnh 8s của quy chuẩn V16.
- **Explicit Age, Gender & Accent Fields:** Bổ sung trường dữ liệu `age` (nhóm tuổi / số tuổi chi tiết) vào voice profile của JSON và tích hợp sâu rộng vào card hiển thị UI tại `ScriptModule.tsx`, `StudioModule.tsx` của cả 3 dự án (Tái Chế, Kids, Dharma) cùng với các cột xuất Excel chuyên dụng (`Age`, `Gender`, `Accent`).
- **Spiritual & Eco Physical Audio Elements:** Ép cấu trúc hệ thống AI và prompt trả về chi tiết các hiệu ứng thanh âm độc đáo của phật giáo (tiếng sáo trúc thiền định, chuông chùa đại hồng chung ngân vang, mõ gỗ gõ cốc cốc nhịp nhàng, nước chảy róc rách) và phế liệu tái chế trong trường gợi ý âm thanh `sfx_music_suggestion` của JSON.

## 🚀 CHANGELOG: V16.3 DYNAMIC ENGLISH VOCABULARY FOCUS & QUICK SUGGESTIONS (Kids)

- **Contextual Input Transformations:** Khi chọn phong cách `Học Tiếng Anh (Mẹ & Bé)`, giao diện ô nhập liệu trên cùng tự động biến chuyển nhãn thành *Từ khóa học tập tiếng Anh (English Vocabulary Focus)* và chuyển đổi placeholder để hướng dẫn cụ thể người dùng.
- **Dynamic Vocabulary Suggestions Menu (One-click Autofill):** Tích hợp từ điển ngách 10 chủ đề tiếng Anh học thuật đàm thoại mẫu (Trái cây, Màu sắc, Con số, Động vật, Phương tiện...) hiển thị ngay dưới ô nhập liệu dưới dạng các nút nhấn trực quan. Người dùng click chọn sẽ tự động điền (autofill) vào ô nhập liệu mà không cần phải tự suy nghĩ hay gõ thủ công.
- **COPPA Silent & Visual Context Safeguard:** Đồng bộ hóa các gợi ý đàm thoại đan xen chuẩn 3D Pixar, tạo ra không gian đàm thoại an toàn và tương tác thông minh nhất cho sự phát triển của trẻ.

## 🚀 CHANGELOG: V16.4 PROACTIVE API KEY PRE-FLIGHT & SMART ALARM SYSTEM (Tái Chế, Kids, Dharma)

- **Pre-flight Key Status Interceptor:** Tự động chặn và kiểm tra trạng thái API Key trước khi khởi chạy tiến trình Biên Kịch (`handleGenerate`) hay Tinh Chỉnh Thanh Âm (`handleAudioReengineering`). Tránh việc hệ thống chạy mô phỏng giả lập tiến trình rồi bị treo đứng do không có Key. Hiển thị thông báo Toast cảnh báo cụ thể.
- **Precise API Error Classifications:** Nhận diện chính xác và phân loại mã lỗi từ Google AI Studio (400 Invalid Key, 403 Forbidden Access, 429 Quota Exceeded). Đưa ra câu thông báo trực quan tương ứng thay vì chỉ ném ra mã lỗi chung chung như trước, giúp người dùng biết chính xác phải làm gì (kích hoạt AI Studio, nạp tiền hay đổi tài khoản).
- **Glowing Cybernetic Alarm Badges (Config Header):** Nâng cấp nút bấm Config tại thanh Header thành một thiết bị cảnh báo thông minh: Khi bể chứa API Key trống (`keyCount = 0`), nút bấm sẽ lập tức đổi màu sang đỏ hổ phách, tự động kích hoạt hiệu ứng nhấp nháy nhịp tim (`animate-pulse`), biểu tượng chìa khóa xoay tròn (`animate-spin`), và số lượng hiển thị nhấp nhô liên tục (`animate-bounce`) đi kèm hiệu ứng đổ bóng Neon (`shadow-[0_0_8px_rgba(239,68,68,0.7)]`). Tạo cảnh báo trực quan cực mạnh để người dùng chủ động nạp thêm API Key.

## 🚀 CHANGELOG: V16.5 RECURSIVE CHUNKED GENERATION & HARD-LIMIT (Tái Chế, Kids, Dharma)

- **Dynamic Rolling Progressive Chunking (Bàn Cờ Cuộn Lũy Tiến):** Tự động bóc tách kịch bản dài thành các đợt chạy tuần tự tối đa 25 cảnh mỗi round. Ngăn chặn triệt để tình trạng sập mảng JSON hoặc AI tự vệ trả về 1 cảnh duy nhất trên mô hình Gemini Flash.
- **Narrative Context Chain (Đoạn Xích Liền Mạch):** Truyền thông tin tóm tắt cốt truyện của 3 cảnh cuối đợt trước làm ngữ cảnh dẫn truyền cho đợt tiếp theo để duy trì tính liền mạch tự nhiên và nhất quán bối cảnh.
- **10-Minute Hard Limit (Giới Hạn 10 Phút):** Thiết lập giới hạn cứng tối đa 10 phút (~75 phân cảnh) cho mỗi kịch bản để tối ưu hóa sự ổn định bộ nhớ trình duyệt, tokens đầu ra và đảm bảo chất lượng nội dung cao cấp nhất.
- **Live Deploy Sync:** Đồng bộ toàn bộ logic sinh cảnh lũy tiến mới lên hạ tầng trực tuyến qua Vercel cho cả 3 phân hệ VKT Tái Chế (`taiche.kiemtienvu.com`), VKT Kids (`kids.kiemtienvu.com`), và VKT Dharma Studio (`phatphap.kiemtienvu.com`).

---

## 🎯 MỤC TIÊU DỰ ÁN

Tạo tool web app sản xuất prompt content YouTube/Facebook về **truyện cổ tích Việt Nam bằng vật liệu tái chế**.

### Ngách (Niche): Recycled Folklore Art
- Kết hợp hồn cốt dân tộc + tư duy bảo vệ môi trường
- Stop-motion, DIY thủ công từ vật liệu tái chế
- Giáo dục thiếu nhi + viral content

---

## 🆕 QUY TRÌNH TẠO APP MỚI TỪ STYLES + GEM INSTRUCTIONS

> ⚠️ **KHÁC VỚI QUY TRÌNH CŨ:** Dự án Recycle Styles không chỉ clone + đổi màu.
> Nó yêu cầu **nạp 2 file nguồn vào brain AI** để tạo content chuyên biệt.

### File nguồn đầu vào:

| File | Vai trò | Nội dung chính |
|------|---------|----------------|
| `recylestyles.txt` | 📦 Kho phong cách visual | 6 phong cách nghệ thuật tái chế chi tiết (Stop-Motion Papercraft, Đông Hồ, Múa Rối Nước, Plastic Mosaic, Fabric Collage, Pop-up Cardboard) |
| `GEM INSTRUCTIONS CREATIVE DIRECTOR.txt` | 🎭 Brain AI sáng tạo | Vai trò Creative Director, quy trình sản xuất kịch bản, công thức tiêu đề viral, checklist chất lượng |

### Quy trình 5 bước:

```
1. CLONE template PSY → folder mới
2. ĐỌC 2 file nguồn (styles + GEM instructions)
3. NẠP nội dung vào brain AI (prompts.ts + constants.ts)
4. TÙY CHỈNH 14 file theo ngách (màu sắc, labels, storage keys)
5. TÍCH HỢP tính năng AI đề xuất style tự động
```

---

## 🗂️ CẤU TRÚC DỰ ÁN

```
📁 recyclestyles/
├── index.html              ← Title: VKT RECYCLE STYLES MASTER
├── package.json            ← name: recyclestyles-master
├── vite.config.ts          ← Build config
├── vercel.json             ← Deploy config
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── .gitignore
├── recylestyles.txt        ← 📦 KHO PHONG CÁCH VISUAL (6 styles)
├── GEM INSTRUCTIONS...txt  ← 🎭 BRAIN AI CREATIVE DIRECTOR
├── huongdan.md             ← 📋 Tài liệu này
├── 📁 src/
│   ├── index.tsx           ← React entry
│   ├── index.css           ← CSS: Emerald Eco-Craft Theme
│   ├── App.tsx             ← Layout + 4 tabs (display:none) + footer
│   ├── 📁 data/
│   │   ├── constants.ts    ← ⭐ TARGET_MARKETS, VISUAL_STYLES (8 styles), TAB_COLORS
│   │   └── prompts.ts      ← ⭐ 4 AI System Prompts (Eco-Art brain)
│   ├── 📁 services/
│   │   └── aiService.ts    ← Gemini Engine + Storage Keys (recycle_*)
│   ├── 📁 components/
│   │   ├── Header.tsx      ← ♻️ Logo Recycle + Brand
│   │   ├── Sidebar.tsx     ← 4 Tab (Trend Scout, Story Weaver, Craft Studio, Eco SEO)
│   │   ├── Toast.tsx       ← Thông báo
│   │   └── ApiKeyModal.tsx ← Nhập Gemini key (emerald theme)
│   └── 📁 pages/
│       ├── SpyModule.tsx   ← Tab 1: Phân tích kênh Eco-Art
│       ├── ScriptModule.tsx← Tab 2: ⭐ Viết kịch bản + AI ĐỀ XUẤT STYLE
│       ├── StudioModule.tsx← Tab 3: Xưởng sáng tạo (ảnh/video)
│       └── SeoModule.tsx   ← Tab 4: SEO Eco-Art
```

---

## 🎨 BẢNG MÀU: EMERALD ECO-CRAFT

```
Body BG:       #050a08
Gradient:      rgba(5, 150, 105, 0.15)    /* emerald-600 */
Scrollbar:     track=#050a08  thumb=#1b4e3b  hover=#2d7a5d
Selection:     rgba(16, 185, 129, 0.3)    /* emerald-500 */
PulseGlow:     rgba(16, 185, 129, 0.4/0.8)
Header BG:     #050f0c  border: border-emerald-900/20
Logo gradient: from-emerald-900 to-slate-900
Text accent:   text-emerald-400, text-emerald-500
Hover inactive: text-emerald-500/50
Icon:          fa-recycle
```

---

## ⭐ TÍNH NĂNG ĐẶC BIỆT: AI ĐỀ XUẤT STYLE TỰ ĐỘNG

### Cách hoạt động:

1. User nhập chủ đề truyện cổ tích (VD: "Tấm Cám", "Sơn Tinh Thủy Tinh")
2. Nhấn nút **"🪄 AI Đề Xuất Style"**
3. AI phân tích chủ đề → đề xuất phong cách phù hợp nhất
4. Hiển thị card đề xuất: **Style chính** + **Style thay thế** + lý do

### Logic đề xuất (trong ScriptModule.tsx):

```typescript
// STYLE_RECOMMENDATION_PROMPT chứa mapping:
// stop_motion_papercraft → cảnh chuyển động, cung điện, lâu đài
// dong_ho_folk → cảnh tâm linh, lễ hội, sinh hoạt làng quê
// water_puppet → cảnh nước, sông, biển, thần thoại dưới nước
// plastic_mosaic → linh vật lớn, rồng phượng, quái vật
// fabric_collage → nhân vật mềm mại, cảm xúc, trang phục
// popup_cardboard → cảnh hoành tráng, kiến trúc
// nature_debris → rừng núi, thiên nhiên, mùa thu
```

### 18 Visual Styles có sẵn (constants.ts):

#### Phong cách đơn (7 gốc + 6 mở rộng):

| # | ID | Tên | Vật liệu | Phù hợp với |
|---|---|---|---|---|
| 1 | `auto` | ✨ AI Director Auto | AI tự chọn | Mọi chủ đề |
| 2 | `stop_motion_papercraft` | 📦 Stop-Motion Papercraft | Bìa carton, giấy, keo | Cung điện, chuyển động |
| 3 | `dong_ho_folk` | 🎨 Đông Hồ Folk Art | Giấy dó, bột điệp, mộc bản | Tâm linh, lễ hội |
| 4 | `water_puppet` | 🎭 Múa Rối Nước | Gỗ sơn mài, sân khấu nước | Sông, biển, thần thoại |
| 5 | `plastic_mosaic` | ♻️ Plastic Mosaic | Nắp chai, mảnh nhựa | Rồng Phượng, linh vật |
| 6 | `fabric_collage` | 🧵 Fabric Collage | Vải vụn, thêu tay | Nhân vật, cảm xúc |
| 7 | `popup_cardboard` | 📚 Pop-up Cardboard | Bìa carton pop-up | Kiến trúc, chiều sâu |
| 8 | `nature_debris` | 🍂 Lá Khô & Hạt | Lá, hạt, vỏ cây | Rừng núi, thiên nhiên |
| 9 | `metal_can_origami` | 🥫 Metal Can Origami | Vỏ lon bia/nước ngọt | Dập nổi, gấp nếp |
| 10 | `egg_carton_clay` | 🥚 Egg Carton Clay | Đất sét vỉ trứng giấy | Điêu khắc thô ráp |
| 11 | `driftwood_twig` | 🪵 Driftwood & Twig | Cành củi khô, vỏ cây | Rừng sâu, hoài cổ |
| 12 | `button_string` | 🧵 Button & String Art | Cúc áo + len màu | Đan chỉ, sắc sỡ |
| 13 | `cardboard_gears` | ⚙️ Cardboard Gears | Bánh răng carton 3D | Cơ khí, chuyển động |

#### Phong cách Hybrid (4 lai):

| # | ID | Tên | Đặc điểm |
|---|---|---|---|
| 14 | `hybrid_metal_clay` | 🌋 Hồn Sét Xương Sắt | Thân vỉ trứng + giáp vỏ lon |
| 15 | `hybrid_popup_wood` | 🌌 Khung Nổi Gỗ Lũa | Nền carton + gỗ lũa 3D |
| 16 | `hybrid_fabric_plastic` | 🌺 Sợi Mềm Mảnh Bóng | Vải thổ cẩm + nắp chai nhựa |
| 17 | `hybrid_folk_automata` | 🎭 Đông Hồ Automata | Nhân vật Đông Hồ + bánh răng carton |

---

## 📝 BRAIN AI — 4 PROMPTS CHÍNH

### 1. SYSTEM_PROMPT_IQ160_SPY (Tab 1: Trend Scout)
- YouTube Analytics Expert + Creative Director
- Phân tích kênh DIY/Eco-Art/Recycled Folklore
- Output: Revenue, Strengths, Weaknesses, Audio, Engagement, Hook Timeline

### 2. SYSTEM_PROMPT_SCRIPT_WRITER (Tab 2: Story Weaver) ⭐
- Creative Director for Recycled Folklore 🎭
- **Tích hợp GEM INSTRUCTIONS:** công thức tiêu đề "Triệu View", nguyên tắc thi công "Xanh"
- **Tích hợp Styles:** 18 phong cách visual (7 gốc + 6 mở rộng + 4 hybrid + 1 auto)
- **8 Bộ lọc an toàn AI:** Anti-Violence, COPPA, Toy Tools, Silent COPPA, Anti-Text, Anti-Ghosting, Anatomy, Physics/Material Science
- **Single Speaker Doctrine:** Mỗi cảnh 8s chỉ 1 người nói, đa nhân vật thay phiên
- **VEO3 AUTO-SHIELD:** Temporal coherence, clothing lock, wind physics, facial symmetry...
- **Language Routing:** Vietnamese (30-40 từ) + English (25-33 từ, max 55 syllables)
- **Audio Truncation Shield:** Thoại dứt ở 7.2-7.5s, chừa 0.5s im lặng
- Output: mode_detected, suggested_style, style_reason, script (scenes với voice_profile mở rộng)

### 3. SYSTEM_PROMPT_AUDIO_REENGINEERING (Phase 2 — Tinh chỉnh âm thanh) ⭐
- 👑 MASTER COMMAND V16.0: Universal Audio Re-Engineering
- **Nguyên tắc Phong tỏa:** Giữ nguyên 100% visual, chỉ nâng cấp audio
- **Tích hợp đầy đủ:** Audio Truncation Shield, Language Routing, Expanded voice_profile
- Output: refined_scenes[] (merge audio mới vào visual cũ)

### 4. SYSTEM_PROMPT_SEO_MASTER (Tab 4: Eco SEO)
- Eco-Art Content Strategist + YouTube SEO Expert
- Keywords, Hashtags, Viral Titles, Description, Thumbnail Strategy

### 5. SYSTEM_PROMPT_MARKET_ANALYST (Backup)
- Eco-Art Market Analyst + Product Sourcing Expert
- Customer Persona, Market Potential, Product Recommendations

---

## 👑 MASTER COMMAND V16.0 — CÁC NGUYÊN TẮC CỐT LÕI

> **Nguồn gốc:** Hợp nhất từ bản spec VKT SYSTEM MASTER AGENT V16.0 (2026-05-19)
> **Triết lý cốt lõi:** Logic vật lý > Nhất quán ID > Thẩm mỹ Cinematic

### 🎙️ Single Speaker Doctrine (Thiết Quân Luật Đơn Chủ Thể)

```
Mỗi cảnh 8 giây = CHỈ ĐÚNG 1 người nói
├── dialogues[] = EXACTLY 1 ITEM
├── Nhân vật nói → Narrator im lặng (và ngược lại)
├── Đa nhân vật THAY PHIÊN qua các cảnh (không cho 1 người nói suốt)
└── 30-40 từ tiếng Việt / 25-33 từ tiếng Anh
```

### 🔇 Audio Truncation Shield (Chống Nuốt Chữ)

```
Thoại PHẢI dứt ở giây 7.2 - 7.5
├── Chừa 0.5s cuối im lặng kỹ thuật
├── Cấm nuốt chữ, cấm nói dở dang
└── Trường output: "audio_end_time": "7.3s", "word_count": 35
```

### ⚡ Language Routing Protocol (Đa Ngôn Ngữ Thích Ứng)

| Ngôn ngữ | Giới hạn từ | Dynamic Speed Matrix | Đặc biệt |
|---|---|---|---|
| 🇻🇳 Vietnamese | 30-40 từ | 30-33→1.12x, 34-37→1.18x, 38-40→1.24x | Compound Word Lock (3 từ cuối = từ đơn), Breath Control (dấu phẩy sau 12-15 từ) |
| 🇺🇸 English | 25-33 từ (max 55 syllables) | 25-28→1.10x, 29-33→1.18x | Word Morphing Lock (từ cuối = đơn âm tiết), Accent Lock (EN-US/EN-UK) |

### 🛡️ VEO3 AUTO-SHIELD Protocol (Chống Lỗi Render Video)

Khi viết `video_prompt`, cấu trúc bắt buộc:
```
[[CAMERA SHOT], [1 PRIMARY ACTION + 2-3 SECONDARY ACTIONS]. {STYLE_KEYWORD}.
[AUTO-SHIELD]:
  ✅ ABSOLUTE TEMPORAL COHERENCE — chuyển động chậm, chính xác
  ✅ Static directional lighting — ánh sáng cố định, không nhấp nháy
  ✅ Permanently static background props — đạo cụ nền bất biến
  ✅ Realistic ground friction — ma sát thực, không trượt/moonwalk
  ✅ Perfect limb separation — tay chân không chồng lấn
  ✅ Strict clothing consistency — trang phục nhất quán giữa các frame
  ✅ Perfect facial symmetry — đồng tử tròn đối xứng
  ✅ Unified wind vector physics — gió nhất quán
  ✅ Strict character count persistence — số nhân vật cố định
  ✅ ABSOLUTELY ZERO TEXT — không chữ, watermark, overlay
  ✅ FULL FRAME — không black bars
```

### 🎭 Expanded Voice Profile (Bản Đồ Thanh Âm Mở Rộng)

```json
"voice_profile": {
  "speaker": "Chai Nhựa",
  "gender": "FEMALE",
  "accent": "NORTHERN_VIETNAMESE",
  "timbre": "Giọng trẻ em trong trẻo",
  "tone": "Hào hứng, nhiều năng lượng",
  "pacing": "Nhanh, dứt khoát",
  "pacing_speed": "1.18x",
  "state": "ON-SCREEN"
}
```

Các trường mới so với bản cũ: `gender`, `accent`, `pacing_speed`.
Các trường mới ở cấp scene: `word_count`, `audio_end_time`.

### 🔒 8 Bộ Lọc An Toàn AI (Safety Filters)

| # | Bộ lọc | Mô tả |
|---|---|---|
| 1 | **[ANTI-VIOLENCE]** | Cấm bạo lực, tự động "nhân văn hóa" bằng phép màu tái chế |
| 2 | **[COPPA WARNING]** | Định vị "nghệ thuật tái chế cho thanh thiếu niên" |
| 3 | **[STYLIZED TOY TOOLS]** | Cấm dao kéo thật → đồ chơi thích ứng chất liệu |
| 4 | **[SILENT COPPA]** | Cảnh báo chỉ ở metadata, CẤM đưa vào lời thoại |
| 5 | **[ANTI-TEXT]** | Image: `--no text...` / Video: `clean textless footage` |
| 6 | **[ANTI-GHOSTING]** | Cấm bóng ma, khuôn mặt mờ ảo hậu cảnh |
| 7 | **[ANATOMY]** | `(perfect human anatomy:1.2), exactly two arms...` |
| 8 | **[PHYSICS/MATERIAL]** | Tuân thủ vật lý + đặc tính vật liệu chính xác |

### 🔄 Pipeline 2 Giai Đoạn

```
Phase 1: KIẾN TẠO KỊCH BẢN
  User Input → AI (Script Writer Prompt) → JSON Script
  → Resilient Parser → Style Enforcement → VEO3 AUTO-SHIELD Failsafe
  → Auto-Save localStorage

Phase 2: TINH CHỈNH THANH ÂM V16.0 (tùy chọn, lặp nhiều lần)
  Existing Script → Trích xuất audio fields → AI (Audio Re-Engineering Prompt)
  → Merge: giữ nguyên visual + cập nhật audio
  → Auto-Save localStorage
```

---

## 🔧 CẤU HÌNH KỸ THUẬT

### Model API (Gemini):
```typescript
export const MODELS = {
  text: "gemini-2.5-flash",
  image: "imagen-3.0-generate-002",
};
```

### Storage Keys (tránh trùng với các ngách khác):
```typescript
const STORAGE_KEYS = {
  keyPool: 'recycle_key_pool',
  openRouterKey: 'recycle_openrouter_key',
  // ... tất cả prefix 'recycle_'
};
```

### Tab Names & Icons:
```
1. TREND SCOUT    (fa-magnifying-glass-chart) — Phân Tích Kênh Eco-Art
2. STORY WEAVER   (fa-scroll)                — Viết Kịch Bản Cổ Tích
3. CRAFT STUDIO   (fa-palette)               — Xưởng Sáng Tạo
4. ECO SEO        (fa-seedling)              — Tối Ưu Viral
```

### Mode Names (ScriptModule):
```
🟢 QUICK CRAFT (<3m)     — Video ngắn, thủ công nhanh
🔵 STORY WEAVER (3-10m)  — Truyện kể + DIY process
🟣 EPIC FOLKLORE (>10m)  — Truyện dài, nhiều phân cảnh
```

---

## ✅ CHECKLIST ĐẦY ĐỦ

```
[x] Clone template PSY
[x] npm install
[x] Sửa index.html (title: VKT RECYCLE STYLES MASTER)
[x] Sửa constants.ts (TARGET_MARKETS eco-art, 18 VISUAL_STYLES, SEO_CHECKLIST eco, TAB_COLORS emerald)
[x] Sửa prompts.ts (5 prompts eco-art + GEM INSTRUCTIONS brain + MASTER AGENT V16.0)
[x] Sửa Header.tsx (♻️ recycle icon + emerald gradient)
[x] Sửa Sidebar.tsx (Trend Scout, Story Weaver, Craft Studio, Eco SEO)
[x] Sửa index.css (emerald body bg + gradient + selection + pulseGlow)
[x] Sửa ApiKeyModal.tsx (emerald border + text + bg)
[x] Sửa aiService.ts (recycle_ storage keys + X-Title)
[x] Sửa SpyModule.tsx (eco-art labels + emerald colors + ⭐ Vietnamese response)
[x] Sửa ScriptModule.tsx (vn_recycle market + ⭐ mode names + ⭐ AI Style Suggestion + ⭐ VEO3 AUTO-SHIELD)
[x] Sửa SeoModule.tsx (vn_recycle default + fallback market)
[x] Sửa App.tsx (⭐ display:none giữ phiên)
[x] Sửa package.json (recyclestyles-master)
[x] npm run build → 0 errors ✅
[x] npm run dev → test visual ✅
[x] ⭐ Bước 7.1: RESPOND ALL TEXT FIELDS IN VIETNAMESE (SpyModule + SeoModule)
[x] ⭐ Bước 7.2: display:none thay switch/case (App.tsx)
[x] ⭐ BONUS: AI Style Recommendation Engine (ScriptModule)
[x] ⭐ V16.0: Audio Truncation Shield (7.2-7.5s cutoff)
[x] ⭐ V16.0: Dynamic Speed Matrix (Vietnamese + English)
[x] ⭐ V16.0: Compound Word Lock + Breath Control
[x] ⭐ V16.0: Global English Mode (25-33 từ, 55 syllables)
[x] ⭐ V16.0: VEO3 AUTO-SHIELD Protocol (code failsafe nâng cấp)
[x] ⭐ V16.0: Expanded voice_profile (gender, accent, pacing_speed)
[x] ⭐ V16.0: word_count + audio_end_time output fields
[ ] Xóa file .php gốc nếu có
[ ] git init → git add → git commit
[ ] npx vercel --prod --yes → deploy
```

---

## 🚀 DEPLOY

```powershell
cd c:\Users\Vo Tung\Downloads\recyclestyles
npm run build
npx -y vercel --prod --yes
```

→ URL: `https://recyclestyles.vercel.app`

---

## 🔄 QUY TRÌNH TẠO APP MỚI TỪ STYLES + GEM INSTRUCTIONS (TỔNG QUAN)

```
┌─────────────────────────────────────────────────────────────────┐
│  1. CHUẨN BỊ FILE NGUỒN                                       │
│     ├── [tên-ngách]-styles.txt   ← Kho phong cách visual       │
│     └── GEM INSTRUCTIONS.txt     ← Brain AI Creative Director  │
│                                                                 │
│  2. CLONE TEMPLATE PSY                                          │
│     Copy template gốc → folder mới                              │
│                                                                 │
│  3. NẠP VÀO BRAIN AI                                           │
│     ├── Đọc styles → tạo VISUAL_STYLES[] trong constants.ts    │
│     ├── Đọc GEM → tạo SYSTEM_PROMPT_SCRIPT_WRITER              │
│     └── Kết hợp cả 2 → STYLE_RECOMMENDATION_PROMPT             │
│                                                                 │
│  4. TÙY CHỈNH 14 FILE                                          │
│     ├── Màu sắc (emerald/teal/amber...)                         │
│     ├── Labels, icons, tab names                                │
│     ├── Storage keys prefix                                     │
│     └── Market targets                                          │
│                                                                 │
│  5. BUILD + TEST + DEPLOY                                       │
│     npm run build → npm run dev → vercel --prod                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚨 BẪY THƯỜNG GẶP

| # | Bẫy | Hậu quả | Cách tránh |
|---|---|---|---|
| 1 | Quên đổi `ANALYZE PSYCHOLOGY CONTENT` trong SpyModule | AI phân tích sai ngách | Search toàn bộ `PSYCHOLOGY\|CRIME\|tâm lý` |
| 2 | Quên đổi mode names `DAILY WISDOM` trong ScriptModule | UI hiện tên ngách cũ | Đổi thành QUICK CRAFT / STORY WEAVER / EPIC FOLKLORE |
| 3 | Dùng backtick escaped `\`` trong prompts.ts | Build fail: Invalid Unicode | Dùng backtick thường, tránh ký tự đặc biệt trong template literal |
| 4 | Giữ `renderPage()` switch/case trong App.tsx | Mất data khi chuyển tab | Đổi sang `display: none` |
| 5 | Quên thêm `RESPOND ALL TEXT FIELDS IN VIETNAMESE` | AI trả kết quả tiếng Anh | Thêm vào prompt SpyModule + SeoModule |
| 6 | Không nạp styles vào STYLE_RECOMMENDATION_PROMPT | AI không đề xuất đúng style | Copy 18 style mapping vào ScriptModule |
| 7 | Dùng `--no` trong video_prompt | Veo3/Kling/Runway vẽ ngược chữ | Dùng mô tả khẳng định: `clean textless footage` |
| 8 | Quên Audio Truncation Shield | Thoại bị nuốt chữ cuối cảnh | Đảm bảo dứt ở 7.2-7.5s, chừa 0.5s |
| 9 | dialogues[] có >1 item | Vi phạm Single Speaker | Kiểm tra mảng luôn = EXACTLY 1 ITEM |
| 10 | Dùng từ ghép ở cuối câu thoại | Bị cắt đôi khi chuyển cảnh | Compound Word Lock: 3 từ cuối = từ đơn |

---

## 📊 LỊCH SỬ NÂNG CẤP

| Phiên bản | Ngày | Nội dung |
|---|---|---|
| v1.0 | 2026-05-10 | Tạo dự án từ template PSY |
| v2.0 | 2026-05-11 | Thêm 7 visual styles + AI Style Recommendation |
| v3.0 | 2026-05-12 | Deploy taiche.kiemtienvu.com + MASTER COMMAND V16.0 Audio |
| **v4.0** | **2026-05-19** | **Hợp nhất VKT MASTER AGENT spec: +7 tính năng mới (Audio Truncation Shield, Dynamic Speed Matrix, Compound Word Lock, Breath Control, Global English Mode, VEO3 AUTO-SHIELD, Expanded Voice Profile). Mở rộng 8→18 visual styles. Nâng cấp code failsafe.** |
| **v4.1** | **2026-05-21** | **Cập nhật Bức tường lửa bản quyền (Copyright Firewall). Chặn nghiêm ngặt việc nhắc đến tên người thật, người nổi tiếng hoặc nhân vật có bản quyền trong video_prompt và image_prompt để khắc phục lỗi vi phạm chính sách của AI (DALL-E 3/Imagen/Veo3).** |

---

**© VKT — 055.979.3678**
