# 📑 HỒ SƠ TÍNH NĂNG HỆ THỐNG — VKT_MASTER_TEMPLATE V20.0 PRO MAX
> **Mã Hồ Sơ**: `VKT-MASTER-CORE-V20-SPEC`  
> **Tên Dự Án**: `VKT_MASTER_TEMPLATE`  
> **Phiên Bản**: `V20.0 (Ecosystem Master Core Standard)`  
> **Ngày Đăng Ký**: `27/05/2026`  
> **Trạng Thái**: **ĐÃ NÂNG CẤP HOÀN TẤT & LƯU TRỮ TRUYỀN THỪA**

Hồ sơ này cung cấp cấu trúc chi tiết về toàn bộ tính năng, sơ đồ giao diện, quy định nút bấm, bản đồ tệp tin và các logic thuật toán AI đã cấu hình trong phiên bản **V20.0 Pro Max** của **Lõi Chuẩn Hệ Sinh Thái VKT (VKT_MASTER_TEMPLATE)**. Đây là tài liệu quy chuẩn gốc để đối chiếu, đồng bộ hoặc nhân bản sang bất kỳ dự án mới nào trong tương lai.

---

## 🗺️ BẢN ĐỒ TẬP TIN HỆ THỐNG (FILE ARCHITECTURE)

| Đường Dẫn Tệp Tin | Vai Trò Kiến Trúc V20.0 |
| :--- | :--- |
| `src/data/constants.ts` | Khai báo danh mục Thị trường, giây/cảnh, danh sách Phong cách nghệ thuật diorama, và Ma trận đề xuất phong cách khuyên dùng theo thị trường (`MARKET_STYLE_RECOMMENDATIONS`). |
| `src/data/prompts.ts` | Lõi AI prompts gốc (IQ160 Spy, Script Writer, Audio Re-engineering, SEO, Market). Nơi chứa Quy chuẩn Nhất quán Vật liệu, Giao thức định tuyến thực vật bản xứ và Khóa giọng đọc thương hiệu. |
| `src/pages/ScriptModule.tsx` | Quản lý luồng UI/UX, giao diện chọn style động theo quốc gia chọn, thuật toán gọi API dệt kịch bản, và Hộp hổ phách an toàn COPPA dynamic. |

---

## ⚡ CHI TIẾT TÍNH NĂNG V20.0 (FEATURE REGISTRY)

### 1. Giao Thức Thực Vật Bản Địa Đa Quốc Gia (Geographic Material Routing Protocol)
* **Tính năng**: Tự động chuyển đổi các loài thực vật, lá khô, quả hạt làm thủ công bản xứ tương ứng với quốc gia được chọn nhằm đảm bảo sự chân thực văn hóa bản địa.
* **Bản đồ Thổ nhưỡng (Geographic Routing)**:
  * 🇻🇳 **Việt Nam (`vn_recycle`, `vn_kids`)**: xơ dừa bện, lá tre vàng rụng, gáo dừa khô, lá sen khô, vỏ trấu, tiếng mõ tre, chuông đồng cổ chùa Việt.
  * 🇺🇸 **Mỹ / Toàn Cầu (`us_diy`, `global_eco`)**: dried maple leaves (lá phong khô), oak acorns (hạt sồi), pinecones (quả thông), dried birch bark, tiếng chuông bạc ngân nhẹ, tiếng mưa rơi êm dịu trên thảm lá.
  * 🇯🇵 **Nhật Bản (`jp_craft`)**: dried sakura leaves (lá anh đào khô), dried ginkgo leaves (lá rẻ quạt/ngân hạnh), sugi pine needles, tiếng sáo Shakuhachi, tiếng chuông Zen.
  * 🇰🇷 **Hàn Quốc (`kr_eco`)**: dried maple leaves, dried ginkgo leaves, jujube seeds (hạt táo tàu khô), tiếng đàn Gayageum, chuông thiền Seon.

### 2. Khóa Cứng Nhất Quán Nhân Vật V20 (Character Consistency Locks)
* **CHARACTER VERBATIM INJECTION LOCK**: Khóa cứng mô tả nhân vật chính không đổi qua mọi phân cảnh để triệt tiêu lỗi lệch diện mạo khi sinh ảnh.
* **MULTI-CHARACTER LEDGER PROTOCOL** (Sổ Đăng Ký Đa Nhân Vật): Bắt buộc AI tạo một danh mục mô tả chi tiết, cố định cho từng nhân vật xuất hiện ở đầu câu chuyện (Cóc, Cọp, Gấu...). Sau đó sao chép đúng nguyên văn 100% mô tả của các nhân vật hoạt động trong cảnh bơm vào đầu `image_prompt`/`video_prompt` tương ứng, giải quyết triệt để vấn đề lệch nhân vật trong các kịch bản đa nhân vật phức tạp.
* **Khóa Nhất Quán Vật Liệu (Material Consistency Lock)**: Các yếu tố cây cỏ bản xứ phải biến đổi để hòa nhập vào chất liệu chính của phong cách đó (ví dụ: hoa sen đá nổi trên thớ cẩm thạch cho Thánh Tích Khắc Đá, đúc bằng vàng lỏng cho Niết Bàn Vàng Ròng).

### 3. Khóa Cứng Giọng Kể Chuyện Thương Hiệu (Narrator Voice Lock)
* **Tính năng**: Đảm bảo tất cả các tập video đều dùng duy nhất một giọng dẫn truyện đồng bộ để tăng nhận diện kênh.
* **Cấu hình giọng đọc cố định**:
  * 🇻🇳 **Việt Nam**: `speaker: "Người kể chuyện"`, `gender: "MALE"`, `age: "65-70"`, `accent: "NORTHERN_VIETNAMESE"` (giọng ông cụ ấm áp, kể chuyện cổ xưa cũ trầm ấm).
  * 🌍 **Quốc Tế**: Giọng ông lão bản xứ trầm ấm, hiền triết tương ứng với Accent của từng quốc gia chọn.
* **Off-screen Lock**: Khóa trạng thái `state` luôn là `OFF-SCREEN` (cấm miêu tả người kể chuyện xuất hiện lộ mặt trong video/hình ảnh).

### 4. Hộp Khuyến Nghị An Toàn Hổ Phách (Amber Compliance Shield)
* **Tính năng**: Thẻ cảnh báo an toàn COPPA hiển thị động thông minh.
* **Giao diện**: Nền và viền vàng cam hổ phách thâm trầm, quý phái (`bg-amber-950/20`, `border-amber-500/20`, `text-amber-300`).
* **Hành vi động**: Chỉ xuất hiện khi kịch bản chứa các hành động chế tác thủ công có sử dụng dụng cụ nguy hiểm cần cha mẹ giám sát. Ẩn hoàn toàn (không chừa khoảng trống) nếu kịch bản an toàn tuyệt đối.

---

## 🛠️ HƯỚNG DẪN ĐỒNG BỘ CHO DỰ ÁN MỚI
Mọi dự án mới khi khởi tạo từ Lõi Master V20 này đều được trang bị sẵn toàn bộ các mảnh ghép Lego thông minh trên. Chỉ cần điều chỉnh các hằng số phong cách trong `constants.ts` và chạy lệnh build là hệ thống tự động ăn khớp 100%.
