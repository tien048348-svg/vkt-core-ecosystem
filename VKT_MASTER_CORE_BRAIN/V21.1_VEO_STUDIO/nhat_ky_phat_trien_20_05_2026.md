# 📝 NHẬT KÝ PHÁT TRIỂN & THAY ĐỔI TÍNH NĂNG (20/05/2026)
*Dự án: VKT DHARMA STUDIO*

Tài liệu này ghi nhận chi tiết toàn bộ các cập nhật, nâng cấp và sửa đổi tính năng đã được triển khai từ sáng đến giờ cho dự án VKT Dharma Studio.

---

## 📂 Danh Sách File Đã Thay Đổi (Modified Files)
1. [`src/components/Header.tsx`](file:///e:/HMKT/VKT_DHARMA_STUDIO%20-%201%20NV/src/components/Header.tsx) — *Giao diện cảnh báo API Key*
2. [`src/data/constants.ts`](file:///e:/HMKT/VKT_DHARMA_STUDIO%20-%201%20NV/src/data/constants.ts) — *Các phong cách nghệ thuật nghệ thuật mới*
3. [`src/data/prompts.ts`](file:///e:/HMKT/VKT_DHARMA_STUDIO%20-%201%20NV/src/data/prompts.ts) — *Prompt kỹ thuật âm thanh, chữ ký bản quyền và Speaker Mode*
4. [`src/pages/ScriptModule.tsx`](file:///e:/HMKT/VKT_DHARMA_STUDIO%20-%201%20NV/src/pages/ScriptModule.tsx) — *Thuật toán dệt phân đoạn kịch bản, giới hạn thời lượng, chế độ giọng đọc*
5. [`src/pages/StudioModule.tsx`](file:///e:/HMKT/VKT_DHARMA_STUDIO%20-%201%20NV/src/pages/StudioModule.tsx) — *Chức năng xuất CSV Kịch Bản V2 & Lưới hiển thị Voice Profile 5 cột*
6. [`src/services/aiService.ts`](file:///e:/HMKT/VKT_DHARMA_STUDIO%20-%201%20NV/src/services/aiService.ts) — *Bẫy lỗi tiếng Việt thông minh cho Gemini API*
7. [`huongdan.md`](file:///e:/HMKT/VKT_DHARMA_STUDIO%20-%201%20NV/huongdan.md) — *Cập nhật đường dẫn deploy tự động cục bộ*

---

## 🛠️ Chi Tiết Các Tính Năng Đã Nâng Cấp

### 1. Cảnh Báo An Toàn API Key (Header)
* **Mục tiêu**: Giúp người dùng dễ dàng phát hiện khi hệ thống chưa được cấu hình API Key, tránh lỗi gọi API thất bại.
* **Chi tiết thay đổi**:
  - Khi số lượng key trong hệ thống bằng 0 (`keyCount === 0`), nút **Cấu hình (Config)** sẽ đổi sang màu đỏ sẫm nhấp nháy (hiệu ứng `animate-pulse`), viền đỏ nổi bật.
  - Biểu tượng chìa khóa quay liên tục (`animate-spin`) và số lượng key (số 0) có hiệu ứng nảy (`animate-bounce`) đi kèm đổ bóng phát sáng màu đỏ.
  - Khi có ít nhất 1 Key, nút quay trở lại giao diện Slate chuyên nghiệp truyền thống.

### 2. Bổ Sung 4 Chủ Đề Phật Pháp & Chữa Lành Mới (ScriptModule)
Thêm các chủ đề vào mảng `DHARMA_TOPICS` cùng với bộ dữ liệu bối cảnh vi mô tương ứng (`MICRO_CONTEXTS`):
* 🌸 **Lòng Biết Ơn & Hiếu Đạo (Gratitude & Filial Piety)**: Nhớ ơn đấng sinh thành, trân quý hạnh phúc giản đơn đang hiện hữu.
* ⛰️ **Vượt Qua Nghịch Cảnh (Patience & Fortitude)**: Vững chãi trước thị phi phiền não, tâm bất biến giữa dòng đời vạn biến.
* 💫 **Trí Tuệ & Giác Ngộ (Wisdom & Enlightenment)**: Bản chất tánh Không, buông bỏ bám chấp thế giới hình tướng.
* 🪴 **Chữa Lành Đứa Trẻ Bên Trong (Spiritual Healing)**: Xoa dịu tổn thương tâm hồn quá khứ, tha thứ cho bản thân.

### 3. Bổ Sung 4 Phong Cách Nghệ Thuật Hybrid Mới (Constants)
Thêm 4 phong cách thiết kế cao cấp và chuyên biệt vào hệ thống tạo ảnh/video:
* 🖌️ **Thủy Mặc Đương Đại (contemporary_ink_wash)**: Mực loang trên giấy Tuyên kết hợp chỉ vàng bay bổng và chuông xoay Tây Tạng.
* 🏮 **Sơn Mài Hoàng Tộc (royal_hue_lacquer)**: Tông màu đỏ son, đen bóng phản chiếu khảm xà cừ cổ truyền Việt Nam dát vàng lá.
* ⏳ **Sa Bàn Mandala (sand_mandala)**: Cát mịn chuyển động tự sắp đặt đồ hình Mandala đối xứng, lấp lánh như bụi kim cương.
* 🔮 **Hào Quang Giác Ngộ (aura_of_enlightenment)**: Hào quang neon chuyển sắc loang tỏa qua kính mờ huyền ảo, nhạc thiền 432Hz.

### 4. Cơ Chế 3 Chế Độ Giọng Đọc (Speaker Mode)
Cung cấp lựa chọn linh hoạt cho người dùng trước khi dệt kịch bản:
* 👥 **Đa nhân vật (Multi-Character)**: Các nhân vật đối thoại/phát biểu luân phiên qua từng cảnh.
* 👤 **Một nhân vật duy nhất (Single Character)**: Ép AI giữ đúng duy nhất một tên nhân vật và một giọng đọc từ đầu đến cuối kịch bản (không đổi giọng).
* 🔇 **Tĩnh lặng tuyệt đối (Pure ASMR)**: Khóa toàn bộ lời thoại (`voice_text` luôn rỗng `""`), tập trung toàn lực vào mô tả hiệu ứng âm thanh ASMR thiền định và nhạc sóng não tần số cao (432Hz/528Hz).

### 5. Thuật Toán Dệt Phân Đoạn Kịch Bản Không Giới Hạn (Incremental Rounds)
* **Vấn đề trước đây**: Khi người dùng yêu cầu kịch bản dài (>3 phút), số lượng cảnh sinh ra quá lớn dẫn đến việc gọi AI bị cắt cụt giữa chừng hoặc lỗi quá tải Context.
* **Giải pháp mới**:
  - Tự động chia nhỏ số cảnh cần tạo thành từng đợt (mỗi đợt tối đa 25 cảnh).
  - Tự động lưu trữ và nhúng ngữ cảnh lịch sử của 3 cảnh gần nhất ở đợt trước vào đợt kế tiếp dưới dạng `[CONTINUITY CONTEXT]`.
  - Giúp câu chuyện tiếp nối mạch lạc, không bị trùng lặp nội dung, tự động tạo timeline chính xác cho toàn bộ video kịch bản.
  - Giới hạn cứng thời lượng tối đa là 10 phút để đảm bảo hiệu năng trình duyệt không bị treo.

### 6. Nâng Cấp Audio Continuity & Thủy Ấn Bản Quyền Thích Ứng (Dynamic Watermark)
* **Âm thanh liền mạch**: Sửa prompt hướng dẫn AI bổ sung chỉ thị crossfade 2 giây giữa các phân cảnh đối với nhạc nền và môi trường nền để âm thanh video liền mạch, giữ âm lượng đồng đều ở mức -20dB. Cảnh đầu tiên bắt buộc phải có VKT Signature Intro.
* **Speaker Metadata**: Thêm trường `age` (độ tuổi nhân vật) vào cấu trúc giọng đọc của AI để tối ưu hóa giọng đọc truyền cảm.
* **Thủy ấn bản quyền hữu cơ (Organic/Diegetic Watermark)**: 
  - Hệ thống loại bỏ việc đóng dấu đè logo lên góc màn hình. Thay vào đó, AI tự chọn biểu tượng dựa trên phân ngách kịch bản (như "enso circle" cho Thiền Định, "bodhi leaf" cho Trí Tuệ, "glowing sprout" cho Chữa Lành...) và lồng ghép hữu cơ vào cảnh.
  - Nếu cảnh có nhân vật: Thêu hoặc in chìm tinh tế lên trang phục nhân vật (`a subtle embroidered [WATERMARK] pattern on the character's robe`).
  - Nếu cảnh là phong cảnh: Chạm khắc hoặc vẽ chìm lên bối cảnh (`carved on the temple door`, `engraved on the bronze bell`, vẽ trên bình trà...).
  - Giao diện hiển thị biểu tượng watermark được gợi ý ở thanh thông tin Storyboard.

### 7. Lưới Hiển Thị 5 Cột & Xuất Bản Kịch Bản V2 (Studio Module)
* **Giao diện Voice Profile**: Thiết kế lại lưới thông tin giọng đọc từ 3 cột đơn giản thành 5 cột ngang gồm: `AGE & DETAILS`, `ACCENT` (giọng miền Bắc/Nam/Mỹ/Anh), `TIMBRE`, `TONE`, `SPEED`.
* **Xuất kịch bản V2**:
  - Gộp nhãn trực tiếp vào đầu mỗi ô (ví dụ: `Scene: 1`, `Time: 00:00 - 00:08`, `Voice: ...`).
  - Tự động bỏ dòng tiêu đề và chèn 1 dòng trống phân cách rõ ràng giữa mỗi cảnh để tiện cho biên tập viên đọc trên Excel.
  - Giữ nguyên bản xuất V1 cũ chạy song song.

### 8. Hệ Thống Báo Lỗi Tiếng Việt Độc Quyền (aiService)
* Bẫy mã lỗi HTTP và chuyển dịch thành thông báo chi tiết bằng tiếng Việt gửi tới màn hình qua Toast:
  - **429 (Quota Exceeded)**: Hướng dẫn người dùng hết lượt miễn phí và khuyên đổi Key hoặc sử dụng OpenRouter.
  - **400 (Invalid Key)**: Cảnh báo API Key không hợp lệ hoặc đã bị Google khóa.
  - **403 (Forbidden)**: Cảnh báo chưa bật Google AI Studio cho tài khoản.

### 9. Đồng Bộ Đổi Tên Dự Án
* Đổi tên dự án trên Vercel thành công sang hậu tố `-p` (`vkt-dharma-studio-p`).
* Đồng bộ cập nhật file nội bộ `.vercel/project.json` để kết nối trực tiếp với dự án mới.
* Cập nhật quy trình chạy deploy tự động trong file `huongdan.md` theo đường dẫn thư mục mới.

---
*Nhật ký được lập bởi Trợ lý Antigravity — Hệ thống đã sẵn sàng cho các nâng cấp tiếp theo.*
