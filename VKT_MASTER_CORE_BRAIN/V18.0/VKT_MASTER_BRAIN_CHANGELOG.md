# 📚 SỔ NAM TÀO - LỊCH SỬ NÂNG CẤP & QUẢN TRỊ BỘ NÃO VKT

## 🚨 6 ĐẠO LUẬT TỐI THƯỢNG CỦA VKT ECOSYSTEM
1. **Đạo Luật Kế Thừa Phiên Bản (Backward-Reading Protocol):** AI BẮT BUỘC phải đọc file README của phiên bản liền kề trước đó (V[X-1]) để hiểu lõi hệ thống trước khi nâng cấp lên V[X].
2. **Đạo Luật Hệ Thống File Song Sinh (Dual-File System):** Mọi phiên bản sinh ra phải có 2 file: 1 file `.ts` (Code) và 1 file `.md` (Giải thích chi tiết cho AI và Con người).
3. **Đạo Luật Kiểm Thử Xuyên Tâm (Cross-Validation Lock):** Test Local thành công mới được Deploy. AI sinh kịch bản cũng phải tự Test Chéo (Self-Reflection) để chống lặp từ, lặp ý.
4. **Đạo Luật Đóng Gói Tự Trị (Zero-Loose-File Rule):** Toàn bộ file sinh ra cho một phiên bản (Code, README, Changelog) PHẢI ĐƯỢC NHÉT TẤT CẢ VÀO TRONG THƯ MỤC CỦA PHIÊN BẢN ĐÓ (`V18.0/`). TUYỆT ĐỐI CẤM để file nằm vương vãi ở thư mục gốc!
5. **Đạo Luật Truyền Thừa Lũy Kế (Full Accumulation):** Bản cập nhật sau không được phép bỏ rơi tính năng của bản trước. File `MASTER_PROMPTS.ts` phải được dùng phương pháp sao chép vật lý 100% nội dung đời cũ sang đời mới rồi mới viết thêm tính năng.
6. **Đạo Luật Minh Bạch Tuyệt Đối (Absolute Transparency Rule):** Nội dung file Code `.ts` (Cho máy đọc) và file Tài Liệu `.md` (Cho người đọc) phải MAPPING 1:1 VỚI NHAU VỀ MẶT CHI TIẾT. Tuyệt đối không được tóm tắt, ghi chung chung trong file `.md`. Các chỉ thị Prompt lõi phải được chép nguyên văn từ `.ts` sang `.md` để đảm bảo Con Người và AI có cùng một tầm nhìn và hiểu biết sâu sắc về hệ thống.

---

### 🟢 PHIÊN BẢN HIỆN TẠI ĐANG CHẠY: [V18.0 PRO MAX]
- **Thời gian áp dụng:** 23/05/2026
- **Người phê duyệt:** Kiến Trúc Sư Trưởng
- **Trạng thái:** ỔN ĐỊNH (Stable) - ÁP DỤNG TRUYỀN THỪA LŨY KẾ
- **Thư mục lưu trữ:** `V18.0/` (Chứa File Song Sinh: `MASTER_PROMPTS.ts`, `README_V18.md` & Sổ Nam Tào)
- **Các tính năng mới cốt lõi:**
  1. Kế thừa toàn vẹn 100% tài sản từ V15, V16, V17 (Dynamic Pacing, Syllable Lock, VEO3 Shield, Cross-Validation).
  2. Áp dụng Thuật toán **Smart Chunking (Đóng Gói Khối)**: AI tự sinh `chunk_summary` ở cuối mỗi đợt sinh kịch bản để tự nhớ cốt truyện, chống tràn bộ nhớ.
  3. Bổ sung nút **JSON PRO** và **CSV PRO** ẩn dưới công tắc `ENABLE_PRO_EXPORT = true`. Nút truyền thống được giữ nguyên.

---

### 🕒 LỊCH SỬ CÁC PHIÊN BẢN CŨ (ĐỂ ROLLBACK CỨU HỘ)

- **[VERSION 17.0]**: Nằm trong thư mục `V17.0/`. Bổ sung Cross-Validation Lock chống lặp nội dung.
- **[VERSION 16.0]**: Nằm trong thư mục `V16.0/`. Áp dụng Tỷ lệ Thời gian Thập phân, Khóa Âm Tiết Cuối.
- **[VERSION 15.0]**: Cố định 8s cứng nhắc. Đã đưa vào kho dự phòng.
