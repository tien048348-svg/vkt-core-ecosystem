# HỒ SƠ PHIÊN BẢN: V16.0

## 1. MỤC ĐÍCH NÂNG CẤP
File tài liệu này được tạo ra để hồi tố và tuân thủ **Đạo Luật Hệ Thống File Song Sinh** và **Đạo Luật Số 6: Minh Bạch Tuyệt Đối (Absolute Transparency Rule)**. V16.0 là phiên bản đặt nền móng cho các thuật toán lõi liên quan đến quản trị Thời gian, Âm thanh và Hình ảnh (VEO 3). Mọi quy tắc trong Code `.ts` đều được ánh xạ nguyên văn 100% ra file tài liệu này để con người đọc.

## 2. NHỮNG TÍNH NĂNG CỐT LÕI CỦA V16.0
Trong mã nguồn `MASTER_PROMPTS.ts`, hệ thống khóa chặt các quy tắc sau (trích xuất nguyên văn):

### A. TỶ LỆ TOÁN HỌC ĐỘNG (DYNAMIC DURATION)
Hệ thống loại bỏ thời gian cố định 8s của V15, và thay bằng biến `SECONDS_PER_SCENE`.
- **Khoảng Lặng Kỹ Thuật**: Thoại PHẢI dứt điểm hoàn toàn cách mốc cuối cùng ít nhất 0.5s. (Ví dụ SECONDS_PER_SCENE=5s -> audio_end_time tối đa là 4.5s).
- Bắt buộc tính toán và trả về chính xác trường `audio_end_time` và `word_count`.

### B. LANGUAGE ROUTING PROTOCOL (KHÓA ÂM TIẾT THEO NGÔN NGỮ)
- **Tiếng Việt (VIETNAMESE MODE)**:
  - Khóa Lõi Từ Ghép (Compound Word Lock): **3 từ cuối cùng của cảnh BẮT BUỘC là Từ Đơn**. Cấm bẻ ngang từ ghép khi ngắt âm.
  - Breath Control: Bắt buộc chèn thẻ [break] hoặc dấu phẩy sau mỗi 12-15 từ.
- **Tiếng Anh (GLOBAL ENGLISH MODE)**:
  - Word Morphing Lock: **Từ cuối cùng BẮT BUỘC phải là Từ Đơn Âm Tiết** (VD: now, root, life, done, care). Tuyệt đối cấm từ đa âm tiết ở đuôi câu.

### C. CHỮ KÝ THƯƠNG HIỆU HỮU CƠ (DIEGETIC WATERMARK)
- Tuyệt đối không dùng thủy ấn kỹ thuật số dạng đóng dấu hoặc đè chữ lên góc màn hình.
- Lồng ghép biểu tượng [WATERMARK] một cách hữu cơ: thêu, in tinh xảo lên trang phục, chạm khắc trên đồ vật.

### D. TƯỜNG LỬA VEO3 (VEO3 AUTO-SHIELD PROTOCOL)
Các câu lệnh bọc lót chống lỗi VEO 3 bắt buộc chèn vào `video_prompt`:
- Chống trượt: `Realistic ground friction, solid footing, zero sliding, no moonwalking.`
- Cấu trúc giải phẫu: `Perfect limb separation, clean physical contact without clipping or hand fusion, distinct anatomical boundaries.`
- Quản lý khuôn mặt: `Perfect facial symmetry, identical symmetric circular pupils, zero micro-facial twitching.`
- Khóa khẩu hình diễn viên (Chống nói nhép): `[SPEAKER & LIP-SYNC LOCK]: IF multiple figures exist, EXACTLY ONE character is permitted to articulate; ALL others MUST remain silent with closed mouths.`
- Chống văn bản tạp: `ABSOLUTELY ZERO TEXT, letters, watermarks, or graphic overlays.`

## 3. LỜI NHẮC CHO AI ĐỜI SAU (NẾU NÂNG CẤP LÊN V17)
Hỡi AI của tương lai! Khi bạn nâng cấp lên V17, bạn **BẮT BUỘC PHẢI SAO CHÉP Y NGUYÊN 100%** các quy tắc ở trên vào file `MASTER_PROMPTS.ts` mới. Sau đó, file `README_V17.md` cũng phải kế thừa nguyên văn các dòng giải thích này để con người kiểm tra. Tuyệt đối tuân thủ Đạo Luật Số 6!
