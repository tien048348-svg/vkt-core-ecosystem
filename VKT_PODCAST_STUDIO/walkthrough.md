# Hướng Dẫn Kiểm Tra & Xác Minh Hệ Thống Kịch Bản & SEO 3 Nền Tảng (Dự án Podcast - `VKT_PODCAST_STUDIO`)

Dạ anh/chị, toàn bộ hệ thống kịch bản Podcast Deep Talk và tối ưu hóa SEO chuyên biệt cho 3 nền tảng đã được dọn dẹp **sạch bóng 100% tàn dư Phật pháp**, thay thế hoàn toàn bằng các phong cách & thị trường Podcast chuyên nghiệp thực thụ. 

Dự án đã được build thành công cục bộ và deploy trực tiếp thành công lên Vercel Production (`https://vkt-podcast-studio.vercel.app`). Dưới đây là mô tả chi tiết các phần đã cập nhật và hướng dẫn kiểm thử chi tiết ạ.

---

## 1. Các Thay Đổi Thực Tế Đã Triển Khai

### A. Loại Bỏ Triệt Để 100% Tàn Dư Phật Pháp (Dharma)
* **Tệp sửa đổi:** [constants.ts](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/data/constants.ts) & [nicheConfig.ts](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/data/nicheConfig.ts)
* **Chi tiết loại bỏ và thay thế:**
  * **Thị trường mục tiêu (TARGET_MARKETS):** Loại bỏ hoàn toàn thị trường *"Việt Nam — Phật Pháp & Chữa Lành"* (key `vn_dharma` cũ). Thay thế bằng thị trường chuẩn Podcast: **`Việt Nam — Podcast & Deep Talk`** (key `vn_podcast`). Cùng với đó là các thị trường quốc tế chuyên nghiệp khác (USA, Japan, UK, China, Korea).
  * **Phong cách nghệ thuật (VISUAL_STYLES):** Xóa sạch 100% các phong cách Phật pháp cũ (như *Thánh Tích Khắc Đá, Niết Bàn Vàng Ròng, Pháp Luân Thiên Hà, Sa Bàn Mandala, Kinh Vạn Hoa Thiên Thai, Hồ Sen Trăng Ngọc, Hào Quang Giác Ngộ...*). Thay thế bằng **8 phong cách nghệ thuật Deep Talk & Phỏng vấn điện ảnh đỉnh cao**:
    1. **Studio Cận Cảnh (Cinematic)** — Micro Shure SM7B chuyên nghiệp, phông nền mờ ảo bokeh ấm.
    2. **Neon Phòng Thu (Moody Neon)** — Led neon xanh ngọc & tím cực chill, không gian trò chuyện lúc nửa đêm.
    3. **Phòng Trà Gỗ Ấm (Cozy Hearth)** — Tường gỗ sồi, lò sưởi bập bùng, sofa da cổ điển.
    4. **Không Gian Tối Giản (Scandinavian)** — Tông xám trắng tĩnh lặng Bắc Âu, cây xanh dịu mát.
    5. **Đại Lộ Đêm Khuya (Midnight View)** — Cửa sổ kính lớn ngắm nhìn thành phố rực rỡ đèn đêm bokeh.
    6. **Mộc Bản Tri Thức (Vintage Library)** — Giá sách gỗ khổng lồ, đèn đọc sách màu vàng ấm.
    7. **Trừu Tượng Tâm Tưởng (Ethereal)** — Nền tối sâu lắng, hiệu ứng sóng âm neon lan tỏa.
    8. **Phóng Viên Tương Lai (Cyberpunk)** — Studio hiện đại với bảng sáng holographic, cybernetic grid.
  * **Vibe Podcast & Ký Hiệu:** Chuyển đổi toàn bộ `DHARMA_ENERGIES` và `SACRED_SYMBOLS` Phật pháp cũ sang các Vibe Podcast chuẩn (Deep Talk, Inspiring, Chill & Healing, Intellectual) và biểu tượng âm thanh (Microphone, Soundwave, Studio Headphones...) giúp AI dệt kịch bản đúng ngách 100%.

### B. Công Tắc Khóa Cố Định 8 Giây Phân Cảnh (Scene Duration Lock Switch)
* **Tệp sửa đổi:** [ScriptModule.tsx](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/pages/ScriptModule.tsx)
* **Tính năng:**
  * Thêm công tắc Toggle **KHÓA 8S** màu xanh ngọc (Teal) / vàng hổ phách (Amber) đồng bộ.
  * Mặc định luôn **BẬT** (Lock): Khóa cứng số giây/cảnh là **8 giây** (tiêu chuẩn vàng của hệ thống VKT). Ô nhập số giây bị vô hiệu hóa (disabled), hiển thị màu xám mờ chuyên nghiệp. Số cảnh tự động tính toán động bằng `(số phút * 60) / 8`.
  * Khi **TẮT** (Unlock): Ô nhập giây mở khóa, hiển thị màu xanh ngọc sáng, cho phép sửa thành con số bất kỳ và tính toán động lại số cảnh tương ứng.

### C. Bảng Quy Chuẩn Viral VKT Trực Quan
* **Tệp sửa đổi:** [ScriptModule.tsx](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/pages/ScriptModule.tsx)
* **Tính năng:**
  * Chuyển đổi giao diện tab Biên kịch sang layout Grid 4 cột sang trọng trên màn hình lớn.
  * Cột bên trái (3/4 chiều rộng) chứa toàn bộ form nhập liệu, trình console tiến trình và kết quả kịch bản hiện tại.
  * Cột bên phải (1/4 chiều rộng) bổ sung độc lập **Bảng Quy Chuẩn Viral VKT** sử dụng màu Slate/Teal nguyên bản của Podcast Studio.
  * Hiển thị trực quan 6 quy tắc vàng lên xu hướng: *Hook 3 Giây Đầu*, *Drama Kịch Tính*, *ASMR Vật Liệu*, *1 Cảnh 1 Người Nói (xoay tua)*, *Vật Lý Chân Thực* và *Silent COPPA An Toàn*.

### D. Liên Kết Kịch Bản & Tối Ưu SEO 3 Nền Tảng (YouTube | TikTok | FB Reels)
* **Tệp sửa đổi:** [SeoModule.tsx](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/pages/SeoModule.tsx)
* **Tính năng:**
  * Tiếp nhận props `scriptSegments` và `scriptTopic` từ tab Biên kịch truyền sang thông qua [App.tsx](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/App.tsx).
  * **Nhãn Liên Kết Thành Công:** Hiển thị nổi bật nhãn màu xanh ngọc (Teal) nhấp nháy báo đã liên kết kịch bản thành công và số cảnh đã nạp.
  * **Tích hợp Prompt SEO MASTER:** Tự động gửi cấu trúc kịch bản sang AI bóc tách chi tiết qua [prompts.ts](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/data/prompts.ts) giúp tạo SEO chuyên biệt cho cả YouTube, TikTok, và Facebook Reels.

### E. Thiết Lập "Bảng Chuẩn Hệ Thống" Đồng Bộ 100% Cho AI Prompt
* **Tệp sửa đổi:** [prompts.ts](file:///E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_PODCAST_STUDIO/src/data/prompts.ts)
* **Tính năng:**
  * **Đồng bộ hóa 100% Visual Styles**: Toàn bộ 8 phong cách nghệ thuật được nhúng cứng vào System Prompt kèm theo chuỗi `prompt_enforce` đặc thù. Khi AI tạo kịch bản, AI sẽ luôn chỉ chọn và trả về `suggested_style` khớp chính xác với `id` của giao diện (ví dụ: `cinematic_studio_closeup`, `moody_neon_studio`, etc.) mà không bao giờ tự ý tạo ra phong cách mới.
  * **Đồng bộ hóa Vibe giọng điệu**: Nhúng trực tiếp 4 vibe Podcast chuyên sâu (`deep_talk`, `inspiring`, `chill_relax`, `intellectual`) để AI dệt giọng chuẩn.
  * **Chốt chặn 6 Quy chuẩn Viral VKT**: Tích hợp trực tiếp 6 quy luật viral làm checklist bắt buộc AI tuân thủ tuyệt đối khi viết thoại và mô tả hình ảnh/âm thanh.

---

## 2. Hướng Dẫn Kiểm Thử & Xác Minh Trực Tuyến

Dạ anh/chị hãy truy cập trực tiếp vào liên kết Production vừa được đẩy mới nhất để kiểm tra thử ạ:
👉 **Liên kết chính thức:** [https://vkt-podcast-studio.vercel.app](https://vkt-podcast-studio.vercel.app)
*(Hoặc liên kết bản deployment vừa build: `https://vkt-podcast-studio-g8oamvz9e-tiens-projects-ee4bca2e.vercel.app`)*

### Bước 2.1: Xác minh làm sạch Phật pháp
1. Vào tab **2. SCRIPT WRITER**.
2. Ở dropdown **THỊ TRƯỜNG**, kiểm tra xem lựa chọn mặc định đầu tiên đã được cập nhật thành:
   * **`🇻🇳 Việt Nam — Podcast & Deep Talk`** (Hoàn toàn biến mất chữ *Phật Pháp & Chữa Lành* cũ).
3. Ở khung **PHONG CÁCH NGHỆ THUẬT (VISUAL STYLE)**:
   * Kiểm tra 8 nút phong cách: Đã chuyển hoàn toàn thành các nút chuyên nghiệp như **🎙️ Studio Cận Cảnh**, **💡 Neon Phòng Thu**, **🔥 Phòng Trà Gỗ Ấm**, **🏢 Không Gian Tối Giản**... 
   * Đảm bảo không còn bất kỳ nút Phật pháp cũ nào xuất hiện nữa.

### Bước 2.2: Kiểm thử Công Tắc Khóa 8 Giây & Số Cảnh Động
1. Vào tab **2. SCRIPT WRITER**.
2. Thử thay đổi **THỜI LƯỢNG (PHÚT)** thành `2` phút -> Quan sát số cảnh tự động tính là `~15 Cảnh` (tức 120 giây / 8). Ô giây/cảnh bị disable và hiển thị số 8 cố định do đang bật **KHÓA 8S** mặc định.
3. Thử **TẮT** công tắc **KHÓA 8S** -> Ô nhập giây mở khóa -> Thử nhập số giây mỗi cảnh thành `10` giây -> Quan sát số cảnh tự động tính lại thành `~12 Cảnh`.

---

## 3. Nhật Ký Cập Nhật Trực Tiếp Lên Vercel
* **Ngày cập nhật:** 22/05/2026
* **Hình thức:** Đẩy trực tiếp qua Vercel CLI (bypass GitHub)
* **Kết quả:** Đã deploy thành công rực rỡ!
  * **Official Production URL:** `https://vkt-podcast-studio.vercel.app`
  * **Deployment Unique URL:** `https://vkt-podcast-studio-g8oamvz9e-tiens-projects-ee4bca2e.vercel.app`
