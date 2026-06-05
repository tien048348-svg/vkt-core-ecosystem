# 👑 HỒ SƠ PHIÊN BẢN: V21.0 PRO MAX (KỶ NGUYÊN MẢNH GHÉP ĐA NGÁCH)

> **MỤC ĐÍCH:** Tài liệu này là "Bản đồ gen" của phiên bản V21.0. Nó ghi chép lại chính xác những tính năng cốt lõi được kế thừa từ các đời trước và những đột phá kiến trúc của đời này. AI của các thế hệ tương lai BẮT BUỘC phải đọc tài liệu này trước khi nâng cấp lên V22.

---

## 1. DI SẢN KẾ THỪA LŨY KẾ (TỪ V16 ĐẾN V20)
V21.0 ôm trọn 100% sức mạnh của các thế hệ tiền nhiệm:
- **Từ V16:** Khóa âm tiết cuối (Tiếng Việt từ đơn, Tiếng Anh 1 âm tiết), Thuật toán `audio_end_time = SECONDS_PER_SCENE - 0.5s`, Random Seed chống lặp 100 lần, Global Character Seed.
- **Từ V17:** Khóa Kiểm Tra Chéo (Cross-Validation Lock). AI tự phản tỉnh so sánh cảnh N với cảnh N-1 để chống lặp ý.
- **Từ V18:** Smart Chunking (Bộ nhớ Khối). AI tự sinh `chunk_summary` ở cuối mỗi đợt để tự nhớ cốt truyện, chống tràn bộ nhớ ngữ cảnh. (Chìa khóa cốt lõi giúp hệ thống sinh kịch bản siêu dài lên đến 180 phút mà không đứt mạch).
- **Từ V19:** 
  - **Copyright Firewall (Tường lửa bản quyền):** Khóa cứng việc nhắc tên người thật, nhân vật bản quyền trong `video_prompt` và `image_prompt`.
  - **Excel CSV V2 & Voice Profile UI:** Xuất file kịch bản định dạng Excel gộp nhãn, cách dòng trống. Giao diện 5 cột Voice Profile.
  - **Duration Engine (Mở khóa 180 phút):** Loại bỏ giới hạn cứng, tận dụng tối đa năng lực Smart Chunking để cho phép viết kịch bản lên đến 180 phút mà vẫn an toàn. Cảnh báo quá tải chỉ nhắc nhở chứ không chặn.
- **Từ V20:** Màng lọc Tâm lý học (Micro-hooks, Pain-point, Evergreen SEO, Retention Score).
- **Từ V21:** Nâng cấp VEO3 Auto-Shield thành **Luật Vật Lý Tự Nhiên Phổ Quát (Universal Natural Physics Law)**:
  - Loại bỏ các quy tắc cấm cứng nhắc lẻ tẻ. Yêu cầu AI trang bị tư duy tự động suy luận logic không gian và vật lý thực tế cho MỌI vật thể (ví dụ: nước phải tuân theo trọng lực, tóc bay ngược chiều gió, bóng đổ khớp nguồn sáng, vật thể phải nằm đúng hướng ngón tay chỉ). Dùng một bộ luật phổ quát để quản vạn vật, ép AI tự đánh giá tính hợp lý trước khi xuất lệnh hình ảnh.

---

## 2. NHỮNG ĐỘT PHÁ CỐT LÕI CỦA V21.0 (CHỈ CÓ TỪ V21)

### ĐỘT PHÁ 1: KIẾN TRÚC MẢNH GHÉP LEGO ĐA NGÁCH (DYNAMIC MODULAR ARCHITECTURE)
Phá bỏ hoàn toàn sự cứng nhắc của V20 (bị khóa chết vào Lão sư 70 tuổi). V21 bóc tách mọi thông số tĩnh ra khỏi `prompts.ts` và đưa vào hộp Lego `nicheConfig.ts`:
- **`characterVoiceProfile`**: Chứa đủ `speaker`, `age`, `gender`, `accent`, `timbre`, `tone`.
- **`visualCharacterLock`**: Mảnh ghép ngoại hình nhân vật.
- **`visualWorldLock`**: Mảnh ghép môi trường bối cảnh.
- **`globalVisualMessage` (Thông Điệp Quốc Tế)**: Mảnh ghép ẩn dụ vật lý (Ví dụ: Khói, nước cho ngách Phật pháp; Biểu đồ vỡ vụn cho ngách Tài chính) để người nước ngoài xem hình vẫn hiểu 100% ý nghĩa mà không cần biết tiếng Việt.

### ĐỘT PHÁ 2: ĐỘNG CƠ TINH CHỈNH THỜI LƯỢNG KHÔNG GIỚI HẠN (LÊN ĐẾN 180 PHÚT)
- AI có khả năng kéo giãn hoặc nén kịch bản theo các mốc thời gian: 30 giây (Short), 3 phút, 10 phút, 60 phút, và thậm chí **180 phút (3 tiếng)**.
- Áp dụng triệt để Smart Chunking của V18 (Truyền tải ký ức qua `chunk_summary`) để giữ mạch truyện siêu dài 180 phút không bị đứt gãy, chống tràn RAM của AI.
- **Anti-Narrator Lock:** Khóa mõm Dẫn Truyện. Bắt buộc nhân vật chính phải độc thoại, không được phép đẻ ra người kể chuyện thứ ba.

### ĐỘT PHÁ 3: VÁ LỖ HỔNG BƠM ÂM THANH (AUDIO INJECTION PROTOCOL)
- Sửa hàm xuất Video Prompt trong `ScriptModule.tsx`.
- Chuỗi thông số Audio (chứa đủ Gender, Accent, Tone...) BẮT BUỘC được bơm vào **TRƯỚC** lá chắn `[AUTO-SHIELD]` của VEO3. 
- Tuyệt đối cấm chèn vào đuôi câu lệnh để bảo vệ giao thức render của AI sinh video.

---

## 3. LỜI NHẮC CHO AI ĐỜI SAU (NẾU NÂNG CẤP LÊN V22)
Hỡi AI của tương lai! Nếu bạn đang đọc dòng này để chuẩn bị làm V22, hãy khắc cốt ghi tâm:
**"TUYỆT ĐỐI KHÔNG HARDCODE"**. Bất kỳ tính năng hình ảnh, âm thanh nào phụ thuộc vào Ngách (Niche) đều phải được nhét vào file `nicheConfig.ts` như một mảnh ghép Lego. Đừng bao giờ dán chết tên nhân vật hay độ tuổi vào file Prompt gốc. Hãy giữ cho hệ thống luôn mềm dẻo và linh hoạt!
