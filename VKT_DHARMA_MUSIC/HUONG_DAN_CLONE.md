# 🚀 HƯỚNG DẪN CLONE NGÁCH MỚI TỪ VKT MASTER TEMPLATE
> **Phiên bản:** V16.0 Peak Audio & Flawless 8K  
> **Template gốc:** `e:\HMKT\VKT_MASTER_TEMPLATE\`  
> **Cập nhật:** 2026-05-17

---

## 🎯 TEMPLATE NÀY LÀ GÌ?

**VKT MASTER TEMPLATE** là bộ khung kỹ thuật chuẩn V16.0 dùng để tạo **AI Content Studio** cho bất kỳ ngách nội dung YouTube/Facebook nào. Chỉ cần copy và nạp nội dung ngách mới vào **2 file chính**, toàn bộ hệ thống AI sẽ hoạt động hoàn chỉnh.

**Những gì đã có sẵn (không cần làm lại):**
- ✅ Engine AI đa nhà cung cấp: Google Gemini → OpenRouter → OpenAI (fallback chain)
- ✅ Round-Robin nhiều API key (tránh hết quota)
- ✅ Autosave kịch bản vào localStorage (F5 không mất data)
- ✅ Cyber Console Stepper tiến trình thời gian thực
- ✅ Audio Re-Engineering V16.0 (nút Amber)
- ✅ Single Speaker 30-40 từ/cảnh (khóa chặt trong prompts)
- ✅ Failsafe chống chữ rác ảnh tĩnh vs video động
- ✅ Watermark `🚀 VKT STUDIO` che logo Veo 3
- ✅ Export CSV/TXT/JSON kịch bản
- ✅ 4 tab: Spy, Script, Studio, SEO

---

## ⚡ QUY TRÌNH 5 BƯỚC CLONE NGÁCH MỚI

### BƯỚC 1: COPY TEMPLATE
```powershell
# Thay TEN_NGACH_MOI bằng tên thư mục ngách (ví dụ: VKT_HORROR, VKT_DHARMA, VKT_KIDS)
xcopy "e:\HMKT\VKT_MASTER_TEMPLATE" "e:\HMKT\TEN_NGACH_MOI" /E /I /H
```

---

### BƯỚC 2: NẠP NỘI DUNG VÀO 2 FILE CHÍNH

#### 📄 File 1: `src/data/constants.ts` — Cấu hình styles và thị trường
Thay thế 3 phần sau:

**[2] TARGET_MARKETS** — Thêm thị trường phù hợp ngách:
```typescript
// Ví dụ ngách Dharma:
vn_dharma: {
  id: 'vn_dharma',
  name: 'Việt Nam — Phật Giáo & Thiền Định',
  flag: '🇻🇳', voice_lang: 'Vietnamese', currency: 'VND',
  culture: 'Phật giáo Bắc Tông, thiền Vipassana, triết học Tâm thức'
},
```

**[3] VISUAL_STYLES** — Thêm danh sách styles đặc trưng:
```typescript
// Ví dụ ngách Dharma:
{
  id: 'zen_ink',
  name: '🎋 Zen Ink Wash',
  desc: 'Tranh thủy mặc thiền tịnh, bút lông, mực tàu, giấy xuyến chỉ.',
  prompt_enforce: ', Visual Style: Authentic East Asian Zen ink wash painting aesthetic...'
},
```

**[4] SEO_CHECKLIST_DATA** — Thay checklist SEO phù hợp:
```typescript
"Phần 1: Nội Dung Tâm Linh (BẮT BUỘC)": [
  { id: "dharma_1", label: "Thông điệp Phật pháp rõ ràng" },
  { id: "dharma_2", label: "Ngôn từ trang nghiêm, đúng chánh pháp" },
],
```

**[5] TAB_COLORS** — Đổi màu accent:
```typescript
// Ngách Dharma → violet:
spy: { bg: 'bg-[#1a1029]', border: 'border-violet-500/50', text: 'text-violet-400', shadow: 'shadow-[0_0_12px_rgba(139,92,246,0.1)]' },
```

---

#### 📄 File 2: `src/data/prompts.ts` — Não AI của ứng dụng (QUAN TRỌNG NHẤT)

Thay thế **toàn bộ nội dung** 4 prompts theo ngách mới. File template đã có cấu trúc JSON output chuẩn — **chỉ cần thay phần text nội dung**, giữ nguyên các quy tắc vàng V16.0.

**Quy tắc vàng BẮT BUỘC giữ trong mọi ngách:**

| Quy tắc | Áp dụng ở |
|---------|-----------|
| Single Speaker: 1 nhân vật/cảnh | `SYSTEM_PROMPT_SCRIPT_WRITER` |
| 30-40 từ/lời thoại | `SYSTEM_PROMPT_SCRIPT_WRITER` |
| Đa nhân vật luân phiên | `SYSTEM_PROMPT_SCRIPT_WRITER` |
| Failsafe ảnh: `--no text, words...` | `SYSTEM_PROMPT_SCRIPT_WRITER` |
| Failsafe video: mô tả khẳng định | `SYSTEM_PROMPT_SCRIPT_WRITER` |
| Prompt dài 130-150 từ | `SYSTEM_PROMPT_SCRIPT_WRITER` |
| Kid-Safe COPPA | `SYSTEM_PROMPT_SCRIPT_WRITER` |
| Output JSON structure giữ nguyên | Cả 4 prompts |

---

### BƯỚC 3: ĐỔI TÊN APP (4 chỗ)

| File | Chỗ cần sửa | Thay bằng |
|------|-------------|-----------|
| `index.html` | `[TEN_NGACH]` trong title & meta | Tên ngách tiếng Anh |
| `index.html` | `[MO_TA_NGACH]` trong meta description | Mô tả ngắn |
| `src/components/Header.tsx` | `[TEN_NGACH] MASTER` | Tên ngách VIẾT HOA |
| `src/components/Header.tsx` | `[MO_TA_NGACH_HEADER]` | Subtitle nhỏ dưới tên |

---

### BƯỚC 4: ĐỔI PREFIX STORAGE KEY (2 chỗ)

> ⚠️ **QUAN TRỌNG**: Mỗi ngách PHẢI có prefix khác nhau để tránh xung đột dữ liệu giữa các app cùng domain/browser.

| File | Tìm | Thay bằng |
|------|-----|-----------|
| `src/services/aiService.ts` | `[NGACH]_` trong STORAGE_KEYS | `dharma_`, `horror_`, `kids_`, v.v. |
| `src/App.tsx` | `[NGACH]_autosave_script` | `dharma_autosave_script`, v.v. |

---

### BƯỚC 5: CẤU HÌNH FAVICON & SEO (MỚI)

Trong thư mục `public` của template này ĐÃ CÓ SẴN:
- File `logo.png` (Favicon chuẩn VKT 256x256).
- File `sitemap.xml` và `robots.txt` chuẩn SEO.

Khi clone ngách mới, bạn cần mở file `public/sitemap.xml` và `public/robots.txt` ra để thay chữ `https://[TEN_MIEN_CUA_BAN]/` thành tên miền thực tế của ngách đó (ví dụ: `https://kid.kiemtienvu.com/`).
Sau khi deploy, bạn vào Google Search Console để gửi sitemap (chỉ cần nhập `sitemap.xml` rồi gửi).

---

### BƯỚC 6: BUILD + DEPLOY
```powershell
cd e:\HMKT\TEN_NGACH_MOI
npm install
npm run build          # Kiểm tra 0 lỗi
npx vercel --prod --yes  # Deploy lên Vercel
```

---

## 📋 CHECKLIST ĐẦY ĐỦ KHI CLONE

```
[ ] Bước 1: xcopy template → thư mục ngách mới
[ ] Bước 2a: constants.ts → TARGET_MARKETS (thêm thị trường ngách)
[ ] Bước 2b: constants.ts → VISUAL_STYLES (thêm danh sách styles)
[ ] Bước 2c: constants.ts → SEO_CHECKLIST_DATA (thay checklist SEO)
[ ] Bước 2d: constants.ts → TAB_COLORS (đổi màu accent)
[ ] Bước 2e: prompts.ts → SYSTEM_PROMPT_IQ160_SPY (thay brain phân tích)
[ ] Bước 2f: prompts.ts → SYSTEM_PROMPT_SCRIPT_WRITER (thay brain kịch bản)
[ ] Bước 2g: prompts.ts → SYSTEM_PROMPT_SEO_MASTER (thay brain SEO)
[ ] Bước 2h: prompts.ts → SYSTEM_PROMPT_AUDIO_REENGINEERING (thay ví dụ SFX)
[ ] Bước 2i: ScriptModule.tsx → STYLE_RECOMMENDATION_PROMPT (cập nhật mapping styles)
[ ] Bước 3a: index.html → title + meta description
[ ] Bước 3b: Header.tsx → tên app + subtitle
[ ] Bước 4a: aiService.ts → STORAGE_KEYS prefix (thay [NGACH]_)
[ ] Bước 4b: App.tsx → autosave key (thay [NGACH]_autosave_script)
[ ] Bước 5a: public/sitemap.xml + robots.txt (thay tên miền thực tế)
[ ] Bước 6a: npm run build → kiểm tra 0 lỗi TypeScript
[ ] Bước 6b: npx vercel --prod --yes → deploy production
```

---

## 🎨 BỘ MÀU GỢI Ý THEO NGÁCH

| Ngách | Màu chính | Tailwind class | RGB |
|-------|-----------|----------------|-----|
| Tái chế | Amber/Gold | `amber-400/500` | `245, 166, 35` |
| Dharma | Violet | `violet-400/500` | `139, 92, 246` |
| Horror | Crimson | `red-400/500` | `220, 38, 38` |
| Criminal | Emerald | `emerald-400/500` | `16, 185, 129` |
| Kids | Sky Blue | `sky-400/500` | `14, 165, 233` |
| Romance | Pink | `pink-400/500` | `236, 72, 153` |
| Finance | Teal | `teal-400/500` | `20, 184, 166` |
| Cooking | Orange | `orange-400/500` | `249, 115, 22` |

**Cách áp dụng màu:** Ctrl+F trong `constants.ts` (TAB_COLORS) và `index.css` — thay toàn bộ giá trị `245, 166, 35` bằng RGB màu mới.

---

## ⚠️ BẪY THƯỜNG GẶP KHI CLONE

| # | Lỗi | Hậu quả | Cách tránh |
|---|-----|---------|------------|
| 1 | Quên đổi prefix storage key | 2 ngách dùng chung data, ghi đè nhau | Đổi cả 2 file: aiService.ts + App.tsx |
| 2 | Quên cập nhật STYLE_RECOMMENDATION_PROMPT | AI đề xuất styles của ngách cũ | Sửa trong ScriptModule.tsx dòng 7-35 |
| 3 | Dùng `` ` `` escaped trong prompts.ts | Build fail: Unterminated template literal | Dùng `\`` hoặc tái cấu trúc chuỗi |
| 4 | Xóa quy tắc Single Speaker khỏi prompt | Kịch bản nhiều người nói cùng lúc | Giữ nguyên block `[CRITICAL - GIỮ NGUYÊN]` |
| 5 | Thêm `--no` vào video_prompt | AI video vẽ chữ ngược lên màn hình | Chỉ dùng mô tả khẳng định cho video |
| 6 | Quên đổi ANALYZE label trong SpyModule | AI phân tích sai ngách | Sửa SpyModule.tsx dòng 34 |

---

## 🏗️ KIẾN TRÚC FILE (KHÔNG THAY ĐỔI GÌ)

```
VKT_MASTER_TEMPLATE/
├── 📄 HUONG_DAN_CLONE.md          ← File này
├── 📄 index.html                  ← ⚠️ Đổi title (Bước 3)
├── 📄 package.json                ← ⚠️ Đổi "name"
├── 📄 vercel.json                 ← Giữ nguyên
├── 📄 vite.config.ts              ← Giữ nguyên
├── 📁 src/
│   ├── App.tsx                    ← ⚠️ Đổi autosave key (Bước 4)
│   ├── index.css                  ← ⚠️ Đổi màu RGB accent
│   ├── index.tsx                  ← Giữ nguyên
│   ├── 📁 components/
│   │   ├── Header.tsx             ← ⚠️ Đổi tên app (Bước 3)
│   │   ├── Sidebar.tsx            ← Giữ nguyên
│   │   ├── ApiKeyModal.tsx        ← Giữ nguyên
│   │   └── Toast.tsx              ← Giữ nguyên
│   ├── 📁 data/
│   │   ├── constants.ts           ← ⚠️ ĐÂY LÀ FILE CHÍNH #1 (Bước 2)
│   │   └── prompts.ts             ← ⚠️ ĐÂY LÀ FILE CHÍNH #2 (Bước 2)
│   ├── 📁 services/
│   │   └── aiService.ts           ← ⚠️ Đổi prefix keys (Bước 4)
│   └── 📁 pages/
│       ├── ScriptModule.tsx       ← ⚠️ Đổi STYLE_RECOMMENDATION_PROMPT
│       ├── SpyModule.tsx          ← ⚠️ Đổi labels (Bước 2 labels)
│       ├── StudioModule.tsx       ← Giữ nguyên (watermark, export)
│       ├── SeoModule.tsx          ← Giữ nguyên (cấu trúc SEO)
│       └── MarketModule.tsx       ← Giữ nguyên
```

---

## 📦 NGÁCH ĐÃ TRIỂN KHAI THÀNH CÔNG

| Ngách | URL | Thư mục |
|-------|-----|---------|
| Tái chế Folklore | https://taiche.kiemtienvu.com | `e:\HMKT\TAI CHE` |
| *(Thêm ngách mới vào đây)* | — | — |

---

**© VKT — 055.979.3678**  
*Template V16.0 Peak Audio & Flawless 8K — Dùng chung cho mọi ngách nội dung*
