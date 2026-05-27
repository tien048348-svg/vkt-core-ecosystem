# 📝 NHẬT KÝ PHÁT TRIỂN & THAY ĐỔI TÍNH NĂNG (22/05/2026)
*Dự án: VKT PODCAST STUDIO*

Tài liệu này ghi nhận chi tiết toàn bộ các cập nhật, nâng cấp và sửa đổi tính năng đã được triển khai cho dự án VKT Podcast Studio để phục vụ ngách Podcast Deep Talk & Viral.

---

## 📂 Danh Sách File Đã Thay Đổi (Modified Files)
1. [`src/App.tsx`](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/App.tsx) — *Truyền prop liên kết kịch bản `scriptSegments` và `scriptTopic` từ tab Biên kịch sang tab SEO*
2. [`src/data/prompts.ts`](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/data/prompts.ts) — *Thiết lập "Bảng Chuẩn Hệ Thống" cho Trợ lý AI (nhúng 8 Visual Styles, 4 Vibes, 6 Quy chuẩn Viral VKT, sạch hoàn toàn placeholders và vá lỗi cú pháp)*
3. [`src/pages/ScriptModule.tsx`](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/pages/ScriptModule.tsx) — *Tích hợp công tắc KHÓA 8S, layout Grid 4 cột, bảng Quy Chuẩn Viral VKT độc lập, và vá lỗi cú pháp JSX*
4. [`src/pages/SeoModule.tsx`](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/pages/SeoModule.tsx) — *Giao diện tab liên kết kịch bản thành công, Tab Bar 3 Nền Tảng (YouTube | TikTok | FB Reels), Timeline Timestamps tự động và xuất file .txt tổng hợp*
5. [`src/data/constants.ts`](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/data/constants.ts) — *Làm sạch 100% tàn dư Phật pháp (Dharma), thay thế bằng phong cách & thị trường Podcast chuyên nghiệp*
6. [`src/data/nicheConfig.ts`](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/data/nicheConfig.ts) — *Đồng bộ hóa cấu hình ngách Podcast & Deep Talk Studio hoàn toàn sạch Dharma*

---

## 🛠️ Chi Tiết Các Tính Năng Đã Nâng Cấp

### 1. Dọn Dẹp Sạch Bóng 100% Phật Pháp & Podcast Hóa Hệ Thống
* **Mục tiêu**: Loại bỏ triệt để mọi tàn dư hiển thị và từ khóa liên quan đến Phật giáo (như Niết Bàn, Mandala, Pháp Luân, v.v. từ dự án Dharma cũ) sang ngách Podcast & Deep Talk chuyên nghiệp.
* **Chi tiết thay đổi**:
  * **TARGET_MARKETS**: Chuyển key `vn_dharma` thành `vn_podcast`, cập nhật nhãn hiển thị thành `"Việt Nam — Podcast & Deep Talk"`.
  * **VISUAL_STYLES**: Thay thế toàn bộ 8 phong cách nghệ thuật Phật pháp cũ bằng 8 phong cách điện ảnh phòng thu đỉnh cao (Studio Cận Cảnh, Neon Phòng Thu, Phòng Trà Gỗ Ấm, Scandinavian Minimalist, Đại Lộ Đêm Khuya, Mộc Bản Tri Thức, Trừu Tượng Tâm Tưởng, Cyberpunk).
  * **DHARMA_ENERGIES** & **SACRED_SYMBOLS**: Thay đổi ruột bên trong thành Podcast Vibe (Deep Talk, Inspiring, Chill, Intellectual) và biểu tượng studio chuyên nghiệp (Microphone, Soundwave, Headphones) để AI sinh kịch bản chuẩn xác, giữ nguyên tên biến để không gây lỗi biên dịch liên đới.

### 2. Công Tắc Khóa Phân Cảnh 8 Giây Tiêu Chuẩn Vàng (ScriptModule)
* **Mục tiêu**: Tối ưu hóa thời lượng giữ chân người dùng (Retention Rate) của video bằng cách cố định độ dài mỗi cảnh là 8 giây (mặc định), trong khi vẫn cho phép mở khóa tùy chỉnh linh hoạt khi cần.
* **Chi tiết thay đổi**:
  * Bổ sung state điều khiển `lockDuration` (mặc định là `true`).
  * Thiết kế công tắc Toggle gạt màu xanh ngọc **KHÓA 8S** cực đẹp cạnh ô giây cảnh.
  * Khi bật (mặc định): Vô hiệu hóa input nhập giây phân cảnh (disabled), hiển thị số 8 cố định. Tự động tính toán số lượng phân cảnh từ tổng số phút thời lượng của video.
  * Khi tắt: Kích hoạt lại input để người dùng nhập bất kỳ số giây mong muốn, tự động tính lại số lượng phân cảnh tương ứng theo thời gian thực.
  * Tích hợp tham số giây/cảnh động này trực tiếp vào prompt gửi lên AI để dệt kịch bản chính xác.

### 3. Panel Quy Chuẩn Viral VKT Trực Quan (ScriptModule)
* **Mục tiêu**: Giúp người viết kịch bản luôn đối chiếu trực tiếp với các tiêu chuẩn vàng lên xu hướng của VKT khi biên soạn.
* **Chi tiết thay đổi**:
  * Tái cấu trúc giao diện biên soạn kịch bản từ 1 cột sang layout Grid 4 cột chuyên nghiệp trên màn hình lớn.
  * Dành riêng cột bên phải (1/4 chiều rộng màn hình) để hiển thị **Bảng Quy Chuẩn Viral VKT** song ngữ.
  * Panel hiển thị lấp lánh với tông màu Teal/Amber nguyên bản cực kỳ sang trọng, gồm 6 quy chuẩn: *Hook 3s Đầu*, *Drama Kịch Tính*, *ASMR Sóng Não/Tiếng Động*, *1 Cảnh 1 Người Nói*, *Vật Lý Chân Thực*, và *COPPA An Toàn*.
  * Sử dụng class CSS `sticky top-6` để bảng quy chuẩn luôn cố định khi cuộn trang, nâng cao trải nghiệm người dùng.

### 4. Liên Kết Kịch Bản & Đồng Bộ Phân Cảnh Sang SEO (App & SeoModule)
* **Mục tiêu**: Kết nối dữ liệu kịch bản vừa viết sang tab SEO, tự động bóc tách thông tin không cần người dùng nhập tay lại.
* **Chi tiết thay đổi**:
  * Tại [App.tsx](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/App.tsx), thêm cơ chế truyền dữ liệu kịch bản `scriptSegments` và `scriptTopic` làm props cho `<SeoModule />`.
  * Tại [SeoModule.tsx](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/pages/SeoModule.tsx), bổ sung nhãn nổi bật nhấp nháy: `✨ LIÊN KẾT KỊCH BẢN THÀNH CÔNG...` khi phát hiện kịch bản đã được nạp từ tab viết kịch bản.

### 5. Bóc Tách SEO Chuyên Biệt Cho 3 Nền Tảng (prompts & SeoModule)
* **Mục tiêu**: Giúp nhà sáng tạo tối ưu hóa nội dung đa nền tảng chỉ sau một cú click.
* **Chi tiết thay đổi**:
  * Nâng cấp prompt `SYSTEM_PROMPT_SEO_MASTER` để AI trả về cấu trúc dữ liệu JSON bóc tách cho cả 3 nền tảng: YouTube SEO (kèm Timeline/Timestamps tự động), TikTok Viral, và Facebook Reels.
  * Thiết kế **Tab Bar 3 Nền Tảng** tuyệt đẹp trong giao diện hiển thị kết quả SEO với nút **Copy nhanh** độc lập cho mỗi phần.
  * Tải file SEO tích hợp: Nút xuất file `.txt` tải xuống toàn bộ dữ liệu 3-trong-1 (Keywords, YouTube, TikTok, Facebook Reels, Thumbnail Ideas, Engagement Comments).

### 6. Thiết Lập "Bảng Chuẩn Hệ Thống" Cho Trợ Lý AI (prompts.ts)
* **Mục tiêu**: Đồng bộ hóa tri thức và nguyên tắc của hệ thống Podcast & Deep Talk vào AI để AI có khả năng tự nhận biết, tự gợi ý chuẩn xác 100% các phong cách visual và vibe của ứng dụng mà không sinh lỗi.
* **Chi tiết thay đổi**:
  * Thay thế triệt để 100% các nhãn đại diện cũ (`[NICHE_THEME]`, `[NICHE_VIBE]`, `[NICHE_VISUAL_HINTS]`, `[WATERMARK]`) trong tệp prompts bằng thông tin chuẩn ngách **Podcast & Deep Talk Studio**.
  * Nhúng trực tiếp mô tả chi tiết của **8 Phong cách nghệ thuật Podcast (Visual Styles)** bao gồm cả các `prompt_enforce` đặc thù để AI tự động chèn vào prompt sinh ảnh/video.
  * Nhúng trực tiếp **4 Vibe giọng điệu chủ đạo (Podcast Vibes / Dharma Energies)** vào prompt làm các Energy States chuẩn.
  * Nhúng trực tiếp **6 Quy chuẩn Viral VKT (Checklist)** (Hook 3s, Single Speaker, Khóa 8s, Chống nuốt chữ, ASMR & SFX, Organic Watermark) để AI tự động chấm điểm và điều phối nội dung.
  * Vá lỗi cú pháp vỡ chuỗi do ký tự backtick thô của `image_prompt`/`video_prompt` tại dòng 151, đảm bảo biên dịch thành công 100%.

---

## 🚀 Nhật Ký Deploy Production Lên Vercel
* **Ngày deploy:** 22/05/2026
* **Phương thức**: Build cục bộ thành công (`npm run build`) và đẩy trực tiếp bằng Vercel CLI (`npx vercel --prod`)
* **Kết quả**: Thành công rực rỡ, trạng thái dự án **READY** 100%. Đã aliased thành công sang tên miền chính thức của người dùng.
* **Đường dẫn web trực tuyến**: [https://vkt-podcast-studio.vercel.app](https://vkt-podcast-studio.vercel.app)
* **Xác minh trực tuyến**: Đã dọn dẹp sạch bóng Phật Pháp, hiển thị đúng 8 phong cách điện ảnh Podcast, dropdown thị trường mục tiêu Podcast, đồng bộ Bảng Chuẩn AI Prompts 100% không lỗi cú pháp.

---
*Nhật ký được lập bởi Trợ lý Antigravity — Hệ thống hoạt động hoàn hảo và sẵn sàng.*
