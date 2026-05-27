# HỒ SƠ PHIÊN BẢN: V17.0 PRO MAX (THIẾT QUÂN LUẬT)

## 1. MỤC ĐÍCH NÂNG CẤP
File tài liệu này được đồng bộ 1:1 với mã nguồn `MASTER_PROMPTS.ts` (Tuân thủ Đạo Luật Hệ Thống File Song Sinh).
Đồng thời, V17.0 là tiền đề để áp dụng **Đạo Luật Số 6: Minh Bạch Tuyệt Đối (Absolute Transparency Rule)**. V17.0 giữ nguyên toàn bộ luật lệ khắt khe của V16.0 và bổ sung thêm Đạo luật Kiểm Tra Chéo. Mọi quy tắc trong Code `.ts` đều phải ánh xạ nguyên văn 100% ra file tài liệu này để con người đọc.

## 2. NHỮNG TÍNH NĂNG CỐT LÕI ĐƯỢC KẾ THỪA TỪ V16
Trong code `.ts`, hệ thống đang khóa chặt các quy tắc sau (trích xuất nguyên văn):
- **Tỷ lệ Toán học Động (Dynamic Duration)**: Tính toán `audio_end_time` bắt buộc trừ đi 0.5s so với `SECONDS_PER_SCENE`.
- **Khóa Âm Tiết Cuối (Syllable Lock)**: 
  - Tiếng Việt: Bắt buộc 3 từ cuối cùng là Từ Đơn. Không bẻ ngang từ ghép.
  - Tiếng Anh: Bắt buộc từ cuối cùng là Đơn Âm Tiết.
- **Tường lửa VEO3 (VEO3 Auto-Shield)**: Đính kèm mã lệnh bảo vệ như `Realistic ground friction, solid footing...` và `EXACTLY ONE character is permitted to articulate...` vào mọi `video_prompt`.

## 3. TÍNH NĂNG MỚI (CHỈ CÓ TỪ V17)
- **Kiểm Tra Chéo (Cross-Validation Lock):** AI sinh kịch bản được nhúng dòng lệnh thép sau:
  1. *Self-Reflection Check*: Sau khi sinh cảnh N, BẮT BUỘC tự kiểm tra xem có lặp từ khóa, ý tưởng với cảnh N-1 hay không.
  2. Nếu phát hiện lặp lại, BẮT BUỘC AI phải tự viết lại phân cảnh đó trước khi trả kết quả về.

## 4. LỜI NHẮC CHO AI ĐỜI SAU (NẾU NÂNG CẤP LÊN V18)
Hỡi AI của tương lai! Khi bạn đọc dòng này, nghĩa là bạn đang được lệnh nâng cấp lên V18.
**HÃY NHỚ KỸ:**
Bạn **BẮT BUỘC PHẢI SAO CHÉP Y NGUYÊN** các quy tắc Khóa Âm Tiết, VEO3 Shield, và Kiểm Tra Chéo ở trên vào hệ thống V18. Phải minh bạch toàn bộ các dòng lệnh tiếng Anh/Việt vào file Markdown để con người dễ dàng đối chiếu mã nguồn `MASTER_PROMPTS.ts`. Đừng phá vỡ thành quả của các Đạo diễn đi trước!
