# HỒ SƠ PHIÊN BẢN: V18.0 PRO MAX (TRUYỀN THỪA LŨY KẾ 100%)

## 1. MỤC ĐÍCH NÂNG CẤP
File tài liệu này được đồng bộ 1:1 với mã nguồn `MASTER_PROMPTS.ts` (Tuân thủ Đạo Luật Hệ Thống File Song Sinh). 
Đồng thời, V18.0 áp dụng **Đạo Luật Số 6: Minh Bạch Tuyệt Đối (Absolute Transparency Rule)**. Dưới đây là chi tiết toàn bộ các Đạo luật, Tường lửa và Thuật toán cốt lõi đã được nhúng vào hệ thống AI, trích xuất nguyên văn từ Code để Con người và AI có cùng một tầm nhìn sâu sắc nhất.

## 2. NHỮNG TÍNH NĂNG CỐT LÕI (LŨY KẾ 100% TỪ V15, V16, V17)

### A. TỶ LỆ TOÁN HỌC ĐỘNG VÀ KHÓA ÂM TIẾT (Kế thừa từ V16)
Trong code `.ts`, AI bị ép tuân thủ các block sau (trích xuất nguyên văn từ `MASTER_PROMPTS.ts`):
- **Khoảng Lặng Kỹ Thuật**: Bắt buộc trừ hao 0.5s ở cuối mỗi cảnh (VD: Nếu cảnh 5s thì âm thanh tối đa 4.5s).
- **Nguyên tắc Tiếng Việt (VIETNAMESE MODE)**: 
  - Khóa lõi từ ghép: **3 từ cuối cùng của cảnh BẮT BUỘC là Từ Đơn**. Không bẻ ngang từ ghép.
  - Breath Control: Chèn dấu phẩy hoặc thẻ break sau mỗi 12-15 từ.
- **Nguyên tắc Tiếng Anh (GLOBAL ENGLISH MODE)**:
  - Khóa âm tiết: **Từ cuối cùng BẮT BUỘC phải là Từ Đơn Âm Tiết** (Syllable Lock: vd now, root, life). 

### B. TƯỜNG LỬA VEO3 AUTO-SHIELD (Kế thừa từ V16)
Chống lỗi render của VEO 3 bằng chuỗi lệnh đính kèm tự động vào mỗi `video_prompt`:
- Chống trượt chân: `Realistic ground friction, solid footing, zero sliding, no moonwalking.`
- Chống lỗi tay/chi: `Perfect limb separation, clean physical contact without clipping or hand fusion...`
- Khóa khẩu hình miệng: `EXACTLY ONE character is permitted to articulate; ALL others MUST remain silent...`

### C. ĐẠO LUẬT KIỂM TRA CHÉO (CROSS-VALIDATION LOCK - Kế thừa từ V17)
Được định nghĩa trong prompt để chống lặp ý tưởng:
1. **Self-Reflection Check**: Sau khi sinh kịch bản cảnh N, AI PHẢI tự đối chiếu xem có lặp từ khóa, nội dung với cảnh N-1 không.
2. Nếu có sự lặp lại, AI BẮT BUỘC phải tự viết lại trước khi trả kết quả JSON về cho hệ thống.

## 3. TÍNH NĂNG MỚI ĐỘC QUYỀN (CHỈ CÓ TỪ V18)

### D. MEMORY RELAY PROTOCOL (SMART CHUNKING CHỐNG TRÀN RAM)
Khi sinh kịch bản dài (hàng trăm cảnh), AI rất dễ quên cốt truyện ở những cảnh đầu. V18 giải quyết triệt để bằng lệnh sau trong `MASTER_PROMPTS.ts`:
1. **Chunk Memory Generation**: AI BẮT BUỘC phải tóm tắt lại TẤT CẢ các nội dung vừa sinh ra trong trường `chunk_summary` (2-3 câu ngắn gọn) ở cuối file JSON.
2. Đoạn `chunk_summary` này sẽ được hệ thống truyền lại cho đợt sinh kế tiếp (trong biến `previous_memory`). Dựa vào đó, AI viết tiếp câu chuyện từ điểm kết thúc của khối trước, TUYỆT ĐỐI KHÔNG lặp lại nội dung đã có.
3. Khi bấm tải **JSON PRO** hoặc **CSV PRO**, hệ thống sẽ tự chia nhỏ mỗi 25 cảnh thành 1 "CHUNK" với bộ nhớ nối kết liền mạch.

## 4. LỜI NHẮC CHO AI ĐỜI SAU (NẾU NÂNG CẤP LÊN V19)
Hỡi AI của tương lai! 
Theo **Đạo Luật Số 5**, khi bạn viết file `MASTER_PROMPTS.ts` cho V19, bạn **BẮT BUỘC PHẢI COPY 100%** toàn bộ mã lệnh của phần 2 (A, B, C) và phần 3 (D) ở trên vào hệ thống V19. Bạn phải copy nguyên văn từng block lệnh tiếng Anh/Việt. Tuyệt đối không được phép nói "kế thừa V18" một cách chung chung!
