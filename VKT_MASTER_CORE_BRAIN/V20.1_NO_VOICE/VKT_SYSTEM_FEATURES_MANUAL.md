# CẨM NANG TÍNH NĂNG HỆ THỐNG VKT (VKT SYSTEM FEATURES MANUAL)
**Phiên bản hiện tại: V20.0 Pro Max**
*Tài liệu này là "Bách Khoa Toàn Thư" dành riêng cho Đạo Diễn, mô tả toàn bộ cấu trúc, tính năng và logic cốt lõi của hệ sinh thái VKT từ V16 đến V20.*

---

## 1.# BÁCH KHOA TOÀN THƯ & CẨM NANG VẬN HÀNH VKT ECOSYSTEM
*(Lưu trữ mọi tính năng, giao thức và Thiết Quân Luật)*

> [!CAUTION]
> **[CHỈ THỊ NHẬN THỨC TỐI CAO DÀNH CHO AI]**
> Bất cứ khi nào KI (AI) thực hiện một sửa đổi, vá lỗi, hoặc nâng cấp có tính hệ thống (ví dụ: sửa lỗi thuật toán, tinh chỉnh prompt, thêm tính năng UI), KI **BẮT BUỘC PHẢI TỰ ĐỘNG** mở file `VKT_SYSTEM_FEATURES_MANUAL.md` này ra và ghi chép lại sự thay đổi đó vào đây ngay lập tức. TUYỆT ĐỐI KHÔNG ĐƯỢC ĐỢI ĐẠO DIỄN NHẮC NHỞ! Tài liệu này là mỏ neo sống (Living Document). Mọi sửa đổi mà không được lưu vào đây đều bị coi là phá hoại hệ thống.

---

## 1. BỨC TRANH TOÀN CẢNH (SYSTEM OVERVIEW)
Hệ sinh thái VKT được thiết kế theo mô hình **Đa Ngách (Multi-Niche) chung một Lõi (Master Core)**.
- **VKT_MASTER_TEMPLATE:** Là hệ quy chiếu gốc. Nơi chứa bộ não AI, thuật toán xuất file và giao diện chuẩn. Không được phép code rác vào đây.
- **Các Ngách (Tái Chế, Thử Nghiệm, Kể Chuyện...):** Là các bản sao (Clone) từ Bản Lõi, được thay đổi biến môi trường (Ví dụ `CURRENT_NICHE` trong `nicheConfig.ts`) để phục vụ riêng cho một tệp khán giả cụ thể.

Mọi bản cập nhật tối ưu (như sửa lỗi hiển thị, sửa luật Prompt VEO 3) đều phải được cập nhật ở Bản Lõi trước, sau đó đồng bộ ngược sang các ngách.

---

## 2. DANH MỤC TÍNH NĂNG LÕI (CORE FEATURES)

### A. Hệ thống AI Đa Luồng (Multi-Provider AI Fallback)
Hệ thống không phụ thuộc vào 1 API duy nhất để chống sập (Downtime).
- **Google Gemini (Mặc định):** Sử dụng `gemini-1.5-pro-latest` chạy vòng lặp (Round-Robin) xoay tua qua một danh sách nhiều khóa API để lách luật giới hạn Rate-Limit (Quá tải).
- **OpenRouter & OpenAI (Dự phòng):** Nếu Google sập, hệ thống tự động nhảy sang OpenAI (gpt-4) hoặc OpenRouter mà không làm gián đoạn trải nghiệm người dùng.

### B. Kho Lưu Trữ Phiên Bản (The Vault)
Giao diện quản trị Admin (`AdminModule.tsx`) đóng vai trò như cỗ máy thời gian bảo vệ mã nguồn.
- **Tải Cấu Hình Xuống (Backup):** Cho phép Đạo diễn đóng gói toàn bộ trạng thái hệ thống thành file `.zip` tải về máy.
- **Tải Mã Nguồn Lên (Restore):** Phục hồi hệ thống bằng cách tải file `.zip` lên, ghi đè chính xác mọi thiết lập.

### C. Thanh Tiến Trình Toàn Năng (Omni-Progress Bar)
Giao diện tải (Loading) mượt mà với hiệu ứng làm mờ nền (Blur backdrop), chạy tỷ lệ phần trăm tiến độ kèm các thông điệp trấn an tâm lý (VD: "Đang kết nối vệ tinh AI...", "Đang rà soát từ khóa..."). Tuyệt đối không còn hiện tượng Màn Hình Đen (White Screen of Death).

### D. Hệ Thống Xuất Kịch Bản Thông Minh (Export Engine)
Tự động toán học hóa thời lượng video:
- Chia số giây do đạo diễn nhập thành các phân cảnh 8 giây (Chuẩn Retention).
- Xuất file `.csv` và `.json` chuyên dụng để bỏ vào công cụ AI Render tự động.

---

## 3. BÍ MẬT PROMPTING (THIẾT QUÂN LUẬT AI VKT)

### A. Giao Thức VEO3 All-In-One Hybrid Protocol (Thiết Quân Luật V20.0)
AI sinh kịch bản bị khóa chặt trong Cấu trúc "Tất Cả Trong Một" (Giới hạn ~500 ký tự). Câu lệnh là sự kết hợp lai giữa Tiếng Anh (Cho AI hình ảnh) và Ngôn ngữ Đích (Cho AI khẩu hình Lip-sync):
1. **[ENGLISH VISUAL BLOCK]:** (100% Tiếng Anh) Mô tả Góc Máy + Hành Động Chính + Bối Cảnh.
2. **[STRICT AUDIO PROFILE]:** (100% Tiếng Anh) Thông tin nhân vật nói. BẮT BUỘC CÓ: Giới tính, **Độ tuổi là một con số chính xác duy nhất (Cấm dùng khoảng tuổi)**, Vùng miền, Giọng điệu, và Tốc độ đọc.
3. **[NATIVE DIALOGUE BLOCK]:** Lời thoại BẮT BUỘC giữ nguyên bằng **Ngôn ngữ bản xứ theo thị trường đích**, đặt trong ngoặc kép "". (Đóng vai trò nguyên liệu cho AI Lip-sync).
4. **[VEO-SHIELD]:** (100% Tiếng Anh) Cụm từ rào lỗi nén: *"textless, flawless anatomy, coherent biophysics, sharp motion"*.
**Kết quả:** Video Prompt xuất ra chứa đủ hình ảnh, thông tin nhân vật, và lời thoại bản xứ để Đạo diễn chỉ cần copy 1 lần duy nhất nạp thẳng vào AI Video.

### B. Cơ Chế Đa Ngôn Ngữ Tự Thích Ứng (Language Routing Protocol)
- Lời thoại (Voice Text & Dialogues): Buộc AI viết bằng Ngôn ngữ đích (Ví dụ Tiếng Việt nếu đánh thị trường VN) để làm kịch bản lồng tiếng.
- Lệnh Hình Ảnh (Image/Video Prompt): Bắt buộc tự dịch sang **100% Tiếng Anh chuẩn điện ảnh** để cho máy tính (Runway, VEO, Midjourney) đọc hiểu.
- 4. Khóa Lõi Lời Thoại: `voice_text` chỉ là một câu chắt lọc siêu ngắn (<40 từ) cho Voiceover AI, trong khi `dialogues` chứa mảng đa nhân vật.

### C. Giao Thức Bơm Style Gốc (Visual Style Injection Protocol)
Trong file `ScriptModule.tsx`, tuyệt đối tuân thủ nguyên tắc bơm Style như sau để không phá vỡ cấu trúc All-In-One:
1. **Tra cứu Chế độ Auto:** Khi người dùng chọn Style `Auto`, KI bắt buộc phải dùng ID của `suggested_style` trả về từ LLM để **tra cứu ngược lại mảng `VISUAL_STYLES` trong `constants.ts`**, qua đó lấy được đoạn `prompt_enforce` khổng lồ. CẤM chỉ nối thẳng ID (ví dụ cấm nối `Visual Style: dong_ho_folk`).
2. **Vị trí Chèn (Injection Point):** Đoạn `prompt_enforce` BẮT BUỘC phải được chèn vào `video_prompt` ở vị trí **TRƯỚC thẻ `[AUDIO:` hoặc TRƯỚC thẻ `textless,`**. TUYỆT ĐỐI CẤM chèn thẳng vào đuôi của `video_prompt` (vì đuôi phải luôn luôn là VEO-SHIELD).

### D. Động Lực Học Âm Thanh & Lời Thoại (Dynamic Audio & Pacing Math)
Đây là quy tắc khắt khe nhất để bảo đảm video không bị "hát rap" hay nuốt chữ:
- **Nguyên Tắc Độc Tôn (1 Speaker Lock):** Trong 8 giây của mỗi phân cảnh, CHỈ DUY NHẤT 01 CHỦ THỂ được cất tiếng để tránh hội thoại chồng chéo.
- **Tốc Độ Đọc (Pacing Speed):** 
  - Tiếng Việt: Giới hạn 2.5 - 3 từ/giây. Với cảnh 8s, AI chỉ được viết khoảng 30-35 từ. Từ cuối cùng phải là từ đơn để không bị bẻ ngang nghĩa.
  - Tiếng Anh: Tính theo âm tiết (Syllables). Giới hạn 3-4 âm tiết/giây. Từ cuối cùng phải là từ đơn âm tiết (VD: now, life, done).
- **Khoảng Lặng Kỹ Thuật (Breath Control):** Lời thoại phải dứt điểm trước mốc kết thúc cảnh ít nhất 0.5s để tạo nhịp thở. Chèn dấu phẩy hoặc thẻ [break] sau mỗi 12-15 từ.
- **Tốc độ đọc động (Pacing Matrix):** Bắt buộc đối chiếu ma trận tốc độ 1.12x đến 1.24x. Nếu 30-33 từ -> 1.12x; Nếu 34-37 từ -> 1.18x; Nếu 38-40 từ -> 1.24x.

### D. Chữ Ký Thương Hiệu Tự Nhiên (Organic Watermark)
Thay vì đóng mộc logo một cách vô hồn, AI tự động nhúng Logo/Watermark vào thực thể trong cảnh (VD: Logo thêu trên áo, chạm khắc trên thân gỗ) để đóng dấu bản quyền nghệ thuật mà không làm mất đi tính chân thực (Diegetic Watermark).

---

## 4. LỊCH SỬ TIẾN HÓA (CHANGELOG V16.0 - V20.0)

Mỗi phiên bản là một bước nhảy vọt về nhận thức của hệ thống:

- **V16.0 (Kỷ nguyên Động lượng):** 
  - Đưa vào Toán học động phân bổ thời lượng (`SECONDS_PER_SCENE`).
  - Giao thức Chống lặp Tự động (Anti-Repetition Seed) ép AI phải thay đổi góc máy và từ khóa nếu sinh 100 lần.
- **V17.0 (Kỷ nguyên Xác thực):** 
  - Khóa Xác thực Chéo (Cross-validation lock): Ép AI tự phản tỉnh (Self-Reflection) đọc lại cảnh N-1 trước khi viết cảnh N để đảm bảo không sai lệch.
- **V18.0 (Kỷ nguyên Truyền thừa):** 
  - Ra mắt Cơ chế Bộ nhớ Khối (Chunk Memory / Memory Relay). AI tự tóm tắt 2-3 câu "ký ức" để truyền sang đợt sinh sau, giúp hệ thống có thể viết kịch bản dài cả ngàn phân cảnh mà không bị "tràn Ram" mất não.
- **V19.0 (Kỷ nguyên Trải nghiệm):** 
  - Chống sập UI với thanh Omni-Progress bar.
  - Hoàn thiện Giao diện Admin Vault quản trị File hệ thống.
- **V20.0 (Kỷ nguyên Thống nhất & VEO 3):** 
  - Rũ bỏ lớp rào chắn từ khóa rác lỗi thời của Runway Gen-2.
  - Nâng cấp Thiết Quân Luật lên mức Tối giản, tập trung 100% sức mạnh ngôn ngữ tự nhiên dành riêng cho siêu AI Google VEO 3. 
  - Đồng bộ hóa hoàn hảo (100% Sync) giữa nhánh Thử Nghiệm, nhánh Tái Chế và Bản Lõi Master.

---
*Tài liệu này được giám sát và cập nhật tự động dưới sự chỉ đạo trực tiếp của Đạo Diễn (User).*
