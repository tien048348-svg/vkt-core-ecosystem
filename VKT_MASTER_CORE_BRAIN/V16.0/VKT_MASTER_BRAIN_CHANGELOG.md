# 🧠 VKT MASTER BRAIN - SỔ TAY QUẢN TRỊ PHIÊN BẢN (CHANGELOG & ROLLBACK)

> **MỤC ĐÍCH:** Theo dõi chính xác ngày/giờ cập nhật Bộ não AI (Prompts). Cung cấp khả năng "Quay ngược thời gian" (Rollback) nếu phiên bản mới bị lỗi hoặc làm hỏng chất lượng kịch bản.

---

## 🟢 PHIÊN BẢN HIỆN TẠI ĐANG CHẠY: [V16.0]

### 📦 [VERSION 16.0 - KỶ NGUYÊN TÙY BIẾN ĐỘNG]
- **Thời gian áp dụng:** 23/05/2026 - 11:15 AM
- **Người phê duyệt:** Kiến Trúc Sư Trưởng
- **Trạng thái:** ỔN ĐỊNH (Stable)
- **File Lõi chứa mã nguồn:** `V16.0/MASTER_PROMPTS.ts`
- **Các tính năng mới cốt lõi:**
  1. Thay thế thời lượng 8s cứng nhắc thành biến [SECONDS_PER_SCENE] động. Tự động tính toán mốc `audio_end_time = SECONDS_PER_SCENE - 0.5s`.
  2. Bổ sung khóa ngôn ngữ đa chiều: Ép 3 từ cuối tiếng Việt là Từ Đơn; Ép từ cuối tiếng Anh là Đơn Âm Tiết (Syllable Lock).
  3. Bổ sung Auto-Shield VEO3: Khóa hướng gió, khóa 6 ngón tay, cấm bôi kem lên áo.
  4. Chống lặp (Anti-Repetition): Áp dụng Random Seed buộc AI đổi góc nhìn camera 100 lần khác biệt.
  5. Định danh nhân vật (Global Character Seed): Khởi tạo profile cảnh 1 và dán đè xuyên suốt toàn bộ video.

---

## 🕒 LỊCH SỬ CÁC PHIÊN BẢN CŨ (ĐỂ ROLLBACK)

### 📦 [VERSION 15.0 - PHIÊN BẢN GỐC]
- **Thời gian áp dụng:** Trước ngày 23/05/2026
- **Trạng thái:** ĐÃ CẤT KHO (Archived)
- **Mô tả:** Bản thiết kế tĩnh. Cố định 8s/cảnh. Chưa có hệ thống đếm âm tiết tiếng Anh và chưa có tường lửa chống lỗi 6 ngón tay VEO3.
- **Hướng dẫn Rollback:** Nếu V16.0 bị lỗi, Admin copy file `prompts.v15.backup.ts` đè ngược lại vào `prompts.ts` để hệ thống chạy lại bản cũ.

---

## 🚀 HƯỚNG DẪN QUY TRÌNH NÂNG CẤP TƯƠNG LAI (VD: LÊN V17.0)
1. **Bước 1:** Sao chép toàn bộ code hiện tại trong `prompts.ts` cất đi (đặt tên là `prompts.v16.backup.ts`).
2. **Bước 2:** Bắt đầu thảo luận và viết bộ luật mới (V17.0). Nhúng luật mới vào `prompts.ts`.
3. **Bước 3:** Vào sổ tay này, tạo thêm một thẻ `[VERSION 17.0]` ghi rõ ngày giờ và Tóm tắt những thay đổi.
4. **Bước 4:** Nếu chạy ngon -> Giữ nguyên. Nếu chạy lỗi -> Dùng file backup V16.0 dán ngược lại để cứu hệ thống trong 1 giây!
