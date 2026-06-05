# BẢN CẬP NHẬT V21.6.0 - THE ULTIMATE CINEMATIC SCRIPT UPGRADE

## 1. Mở Đầu Kỳ Vĩ (Epic Opening Rule)
- Cảnh 1 (Hook) BẮT BUỘC là không gian ngoài trời hùng vĩ (đỉnh núi, thung lũng).
- BẮT BUỘC sử dụng góc siêu rộng (Extreme Wide Angle, Drone Shot).

## 2. Kể Truyện Ngụ Ngôn (Story-In-Story Protocol)
- Ép AI lồng ghép một câu chuyện ngụ ngôn hoặc ví dụ cụ thể thay vì giảng lý thuyết suông.

## 3. Đa Dạng Hóa Góc Máy (Dynamic Camera Engine)
- Chống lặp tuyệt đối. Bắt buộc xoay vòng các góc: Tracking shot, Panning, Low/High Angle.
- Bối cảnh phải liên tục chuyển đổi không gian.

## 4. Nhân Vật Động (Dynamic Character Lock)
- Phá bỏ hình tượng bức tượng đứng im.
- Thiền sư BẮT BUỘC phải bước đi (walking), vung tay (gesturing) và tương tác vật lý với môi trường.

## 5. Khóa Slogan 38 Từ (Absolute Override Rule)
- Cảnh cuối cùng BẮT BUỘC chốt đủ nguyên văn 38 từ slogan: Dừng lại giữa dòng để giữ cho mình một khoảng tĩnh lặng...

## 6. Ngôn Ngữ Hình Ảnh Toàn Cầu (Universal Visual Language)
- Chuyển động vật lý và biến đổi môi trường phải mang tính tự kể chuyện (Visual Storytelling).
- Đảm bảo người nước ngoài không hiểu tiếng Việt vẫn cảm nhận được thông điệp qua diễn biến hình ảnh.
## [V21.6.5] - Cải tiến Auto-Tagging Tên Dự Án
- [Quản lý File] Tối ưu hóa tính năng gắn mác tên dự án: Chuyển đổi tên gốc sang Tiếng Việt không dấu (loại bỏ lỗi Encoding khi di chuyển file giữa các HĐH) và bổ sung thêm Giờ/Phút/Giây vào mốc thời gian để tránh trùng lặp thư mục khi xuất nhiều video trong cùng một ngày. Định dạng mới: 【 3 PHUT - 04-06-2026_09h28m15s 】 Dung ngay viec than van...

## [V21.6.4] - Tính năng Tự động Gắn mác Tên Dự án (Auto-Tagging)
- [Quản lý File] Tự động hóa việc gắn Tag nhận diện vào Tên Dự án (Project Name) khi Xuất file JSON (hoặc đẩy qua Extension). Mác sẽ có định dạng: 【 [Thời lượng] PHÚT - [Ngày/Tháng/Năm] 】 [Tên Kịch Bản]. Ví dụ: 【 3 PHÚT - 04/06/2026 】 Dừng ngay việc than vãn.... Tính năng này giúp dễ dàng quản lý hàng trăm thư mục dự án trên ổ cứng mà không cần mở file ra xem.

## [V21.6.3] - Tối ưu hóa Luật Chống Che Khuất (Anti-Foreground Blocking)
- [AI Prompt] Nhận thấy lỗi thiết lập cứng nhắc ở luật chống che khuất (bắt buộc dùng '(unobstructed full body view...)' hoặc '(unobstructed close-up portrait view...)') vẫn gây mâu thuẫn cho kịch bản Video Dài 3 phút có luân chuyển góc máy. Đã tiến hành gỡ bỏ hoàn toàn việc chỉ định cứng góc máy trong luật này, đổi thành '(unobstructed view, standing freely in open space, NO tables, NO podiums, NO foreground objects blocking the body)' để đảm bảo tính phổ quát cho 100% các loại kịch bản, độ dài và các góc quay khác nhau.

## [V21.6.2] - Khẩn cấp: Fix lỗi CSS & Ảo giác góc máy Video 0.5p
- [Giao Diện] Fix triệt để lỗi CSS Dropdown bị tàng hình (chữ trắng trên nền trắng), hiển thị đầy đủ tỉ lệ khung hình (16:9, 9:16) và các model VEO 3.
- [AI Prompt] Fix xung đột nghiêm trọng: Hủy lệnh ép buộc Vẽ toàn thân (Full Body) đối với Video Ngắn (0.5p) để AI tập trung 100% vào Cận cảnh (Close-up).
- [Tái Chế] Nâng cấp Tái cấu trúc hồn (Audio Re-engineering): Cho phép giữ nguyên các góc máy điện ảnh hùng vĩ đối với Video Dài thay vì khóa cứng một góc chính diện như cũ.

## [V21.6.1] - Cập nhật lúc 04/06/2026
- [UI Cấu Hình] Cập nhật UI VEO 3: Hỗ trợ chọn Model (Veo 3.1 - Quality / Omni Flash) và Thời lượng (x1-x4).
- [Sửa Lỗi] Fix triệt để màn hình đen do sót biến cũ trong UI.
- [AI Prompt] Khắc phục lỗi video 0.5 phút mất tập trung khuôn mặt. Cài đặt luật khóa Cận Cảnh (Close-up) và chống lặp 0.5 phút.
