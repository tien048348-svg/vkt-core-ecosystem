# VKT ECOSYSTEM HUB - BỘ QUY TẮC CỐT LÕI DÀNH CHO TRỢ LÝ AI (AI CODING GUIDELINES)

> **LƯU Ý DÀNH CHO AI:** Bất kể bạn là phiên bản AI nào (Gemini, Claude Sonnet, ChatGPT...), khi làm việc với dự án này, bạn BẮT BUỘC phải đọc và tuân thủ tuyệt đối các nguyên tắc dưới đây trước khi viết bất kỳ dòng code nào.

## 1. TRIẾT LÝ "MẢNH GHÉP LEGO" (LEGO ARCHITECTURE)
- **Tính Toàn Vẹn:** Hệ thống hiện tại đang hoạt động hoàn hảo. Khi thêm tính năng mới hoặc nâng cấp ứng dụng, bạn phải xây dựng nó như một "mảnh ghép mới", TUYỆT ĐỐI KHÔNG làm vỡ, làm hỏng hay thay đổi bản chất của các tính năng cũ đang chạy tốt.
- **Tính Độc Lập:** Code mới phải được đóng gói thành các Component độc lập. Tránh viết code spaghetti dính chùm vào các module cốt lõi (như `AppContext`, `Admin.tsx`, v.v.) trừ khi thực sự cần thiết và đã được phân tích rủi ro kỹ lưỡng.
- **Bảo Toàn Logic Cũ:** Chỉ sửa đổi mã nguồn cũ khi phát hiện lỗi (bug) hoặc khi người dùng (Admin) yêu cầu thay đổi trực tiếp tính năng đó.

## 2. GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX)
- **Đồng Bộ Thương Hiệu:** Bất kỳ mảnh ghép/ứng dụng mới nào cũng phải kế thừa bảng màu, logo và phong cách thiết kế từ cấu hình toàn cục (`siteConfig` và `currentTheme`).
- **Chuyên Nghiệp & Tinh Tế:** Giao diện phải nổi bật, có hiệu ứng tương tác (hover, animation) mượt mà nhưng không được lòe loẹt. Luôn đặt trải nghiệm của người dùng lên hàng đầu.

## 3. QUY TRÌNH LÀM VIỆC (WORKFLOW)
1. **Phân Tích:** Trước khi code, phải phân tích xem tính năng mới sẽ lắp ghép vào đâu trong hệ thống.
2. **Báo Cáo:** Đưa ra kế hoạch triển khai (Implementation Plan) ngắn gọn cho Admin duyệt.
3. **Thực Thi:** Viết code cẩn thận, đảm bảo không có lỗi cú pháp.
4. **Kiểm Tra:** Tự rà soát lại xem mảnh ghép mới có gây xung đột với các thư viện hay Component cũ không.

---
*Bản quy tắc này là kim chỉ nam tối thượng cho hệ sinh thái VKT. Mọi quyết định lập trình đều phải dựa trên nền tảng bảo vệ sự an toàn và ổn định của toàn hệ thống.*
