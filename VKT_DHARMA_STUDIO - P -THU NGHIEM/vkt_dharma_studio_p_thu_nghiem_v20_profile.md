# 📑 HỒ SƠ TÍNH NĂNG HỆ THỐNG — VKT_DHARMA_STUDIO - P -THU NGHIEM V20.0 PRO MAX
> **Mã Hồ Sơ**: `VKT-DHARMA-STUDIO-P-THU-NGHIEM-V20-SPEC`  
> **Tên Dự Án**: `VKT_DHARMA_STUDIO - P -THU NGHIEM`  
> **Phiên Bản**: `V20.0 (Dharma & Zen Healing Core Standard)`  
> **Ngày Đăng Ký**: `27/05/2026`  
> **Trạng Thái**: **ĐÃ NÂNG CẤP HOÀN TẤT & TRIỂN KHAI TRỰC TUYẾN**

Hồ sơ này cung cấp cấu trúc chi tiết về toàn bộ tính năng, sơ đồ giao diện, quy định nút bấm, bản đồ tệp tin và các logic thuật toán AI đã cấu hình trong phiên bản **V20.0 Pro Max** dành riêng cho dự án **VKT_DHARMA_STUDIO - P -THU NGHIEM** (Bản Thử Nghiệm Phật Pháp & Chữa Lành). Đây là bản thiết kế tối cao để tra cứu, đối chiếu hoặc sao chép (clone) sang bất kỳ dự án tâm linh/chữa lành mới nào trong tương lai.

---

## 🗺️ BẢN ĐỒ TẬP TIN HỆ THỐNG (FILE ARCHITECTURE)

| Đường Dẫn Tệp Tin | Vai Trò Kiến Trúc V20.0 |
| :--- | :--- |
| `src/data/constants.ts` | Khai báo danh mục Thị trường tâm linh (`vn_dharma`, `us_mindfulness`, `jp_zen`...), giây/cảnh, danh sách Phong cách nghệ thuật thiền kèm chuỗi `prompt_enforce`, và Ma trận đề xuất phong cách khuyên dùng theo thị trường (`MARKET_STYLE_RECOMMENDATIONS`). |
| `src/data/prompts.ts` | Lõi AI prompts (IQ160 Spy, Script Writer, Audio Re-engineering, SEO, Market). Nơi chứa Thiết quân luật nhất quán vật liệu tâm linh và Khóa cứng giọng kể chuyện Đạo sư thương hiệu. |
| `src/pages/ScriptModule.tsx` | Quản lý luồng UI/UX, giao diện nút bấm đổi màu phát sáng thông minh, thuật toán gọi API dệt kịch bản, và Hộp hổ phách an toàn COPPA dynamic. |

---

## ⚡ CHI TIẾT TÍNH NĂNG V20.0 (FEATURE REGISTRY)

### 1. Giao Thức Định Tuyến Thảo Mộc & Pháp Khí Bản Địa Động
* **Tính năng**: Tự động chuyển đổi các loài hoa cỏ địa lý, mõ tre, pháp khí thiền tương ứng với quốc gia được chọn nhằm đảm bảo tính chân thực và gần gũi văn hóa bản xứ.
* **Bản đồ Thổ nhưỡng (Geographic Routing)**:
  * 🇻🇳 **Việt Nam (`vn_dharma`)**: Sen hồng thiêng, lá bồ đề xanh tươi, gáo dừa khô, mõ tre cổ kính, tiếng chuông chùa đồng cổ vang vọng trầm ấm.
  * 🇺🇸 **Mỹ / Tây Âu (`us_mindfulness`)**: dried maple leaves (lá phong khô), oak acorns (hạt sồi), pinecones (quả thông), tiếng chuông bạc ngân nhẹ, tiếng mưa rơi êm dịu trên thảm lá.
  * 🇯🇵 **Nhật Bản (`jp_zen`)**: dried sakura leaves (lá anh đào khô), dried ginkgo leaves (lá rẻ quạt/ngân hạnh), sugi pine needles, tiếng sáo Shakuhachi, tiếng chuông đồng Zen tĩnh lặng.
  * 🇰🇷 **Hàn Quốc (`kr_seon`)**: dried maple leaves, dried ginkgo leaves, jujube seeds (hạt táo tàu khô), tiếng đàn Gayageum, chuông thiền Seon.
  * 🇮🇳 **Ấn Độ (`in_vedic`)**: Sandalwood beads (chuỗi hạt đàn hương), sacred Banyan leaves (lá đa cổ thụ), tiếng đàn Sitar thiêng liêng, chũm chọe đồng cổ.
  * 🏔️ **Tây Tạng (`tibet_vajrayana`)**: Vajra bell (chuông kim cang), brass singing bowls (chuông xoay Tây Tạng), khói trầm hương.
* **Quy tắc ngôn ngữ**: Hiển thị tiếng Việt thuần việt trên UI cho Creator dễ hiểu, nhưng tự động dịch sang thuật ngữ tiếng Anh chuẩn trong `image_prompt`/`video_prompt` để các công cụ AI vẽ chính xác.

### 2. Thiết Quân Luật Nhất Quán Vật Liệu Tâm Linh (Material Consistency Lock)
* **Tính năng**: Ngăn chặn AI tự động trộn lẫn bừa bãi chất liệu (hallucination), ép kịch bản phải tuân thủ tuyệt đối phong cách thiền định đã lựa chọn.
* **Biến đổi địa lý thông minh**: Cây cỏ bản địa khi áp dụng vào các phong cách điêu khắc hay trừu tượng **phải biến đổi để hòa nhập vào chất liệu chính của phong cách đó**.
  * *Ví dụ*: Nếu chọn phong cách **Thánh Tích Khắc Đá (ancient_stone_relic)**:
    * 🇻🇳 Chọn VN: AI sẽ mô tả chạm khắc nổi hoa sen hoặc lá bồ đề *trên chính thớ đá cẩm thạch của hang động*. Tuyệt đối không để lá tre tươi/giấy vụn nằm lộn xộn phá hỏng bối cảnh thâm nghiêm.
    * 🇺🇸 Chọn Mỹ: AI chạm khắc gân lá phong/quả thông tinh xảo *chìm vào bề mặt khối đá cẩm thạch*.
  * *Ví dụ*: Nếu chọn **Niết Bàn Vàng Ròng (molten_gold_nirvana)**: Các đường vân lá phong/bồ đề được đúc hoàn toàn từ vàng ròng lỏng rực sáng.

### 3. Khóa Cứng Giọng Kể Chuyện Thương Hiệu (Narrator Voice Lock)
* **Tính năng**: Đảm bảo tất cả các tập video đều dùng duy nhất một giọng kể chuyện đạo đồng bộ, tăng nhận diện thương hiệu.
* **Cấu hình giọng đọc cố định**:
  * 🇻🇳 **Việt Nam**: `speaker: "Người kể chuyện"`, `gender: "MALE"`, `age: "70"`, `accent: "NORTHERN_VIETNAMESE"` (Giọng đạo sư thiền định, trầm ấm, chậm rãi mang hơi thở hiền triết cổ kính).
  * 🌍 **Quốc Tế**: `speaker: "Narrator"`, `gender: "MALE"`, `age: "70"`, accent bản xứ trầm ấm, hiền triết.
* **Off-screen Lock**: Khóa trạng thái `state` luôn là `OFF-SCREEN` (cấm miêu tả người kể chuyện xuất hiện lộ mặt trong video/hình ảnh).

### 4. Hộp Khuyến Nghị An Toàn Hổ Phách (Amber Compliance Shield)
* **Tính năng**: Thẻ cảnh báo an toàn COPPA hiển thị động thông minh.
* **Giao diện**: Nền và viền vàng cam hổ phách thâm trầm, quý phái (`bg-amber-950/20`, `border-amber-500/20`, `text-amber-300`).
* **Hành vi động**: Chỉ xuất hiện khi kịch bản chứa các hành động chế tác thủ công có sử dụng kéo sắc, lửa thiêng cần cha mẹ giám sát. Ẩn hoàn toàn (không chừa khoảng trống) nếu kịch bản an toàn tuyệt đối, giữ UI tinh gọn.

---

## 🎨 SƠ ĐỒ GIAO DIỆN & QUY ĐỊNH NÚT BẤM (INTERACTION SYSTEM)

### 1. Bảng Chọn Phong Cách Nghệ Thuật Động (Visual Style Selector)
* **Vị trí**: Nằm dưới mục lựa chọn Thị trường & Tùy chọn giọng đọc.
* **Nút bấm Style**:
  * Thiết kế bo góc hiện đại, chiều cao cố định `h-[80px]` để giữ lưới đều đặn.
  * **Highlight Bản Địa Dân Tộc**: Các style Việt Nam (`royal_hue_lacquer` - Sơn Mài Hoàng Tộc, `shadow_puppet_karma` - Vũ Điệu Bóng Râm, `ancient_stone_relic` - Thánh Tích Khắc Đá) được đính thêm tag màu xanh ngọc sang trọng: `🇻🇳 Bản Địa`.
  * **Highlight Siêu Style Đặc Biệt**: Style siêu đặc biệt (`molten_gold_nirvana` - Niết Bàn Vàng Ròng, `galactic_dharma_wheel` - Pháp Luân Thiên Hà, `sand_mandala` - Sa Bàn Mandala) được đính badge chuyển sắc gradient cầu vồng lung linh: `👑 Đặc Biệt`.
* **Logic đổi màu động theo Thị trường**:
  * Khi chọn Việt Nam ➔ Các style gợi ý phát sáng tông màu **Xanh Ngọc (Emerald)** (`bg-emerald-950/40 border-emerald-500 text-emerald-300`). Các style không khuyên dùng sẽ giảm độ mờ (`opacity-50`) để creator dễ nhận diện.
  * Khi chọn Mỹ ➔ Các style gợi ý phát sáng tông màu **Xanh Dương (Blue)**.
  * Khi chọn Nhật Bản ➔ Các style gợi ý phát sáng tông màu **Hồng Hoa Anh Đào (Rose)**.
  * Khi chọn Hàn Quốc ➔ Các style gợi ý phát sáng tông màu **Tím Huỳnh Quang (Purple)**.
  * *Lưu ý*: Nút bấm không bị vô hiệu hóa, người dùng vẫn có thể click chọn style mờ bất kỳ lúc nào theo ý muốn.

### 2. Hai Chế Độ Giọng Đọc Lego (Speaker Modes)
* **Chế độ một nhân vật (Single Speaker)**: Khóa cứng giọng nói dẫn chuyện của Đạo Sư 70 tuổi từ đầu đến cuối, nhưng visuals vẫn vẽ nhiều nhân vật tương tác (đệ tử lắng nghe) để khung hình sống động.
* **Chế độ nhiều nhân vật (Multi-Character)**: AI phân bổ tối thiểu 3 nhân vật đối thoại qua các phân cảnh, nhưng bảo đảm trong 8 giây của một cảnh chỉ duy nhất 1 giọng cất tiếng để âm thanh không chồng chéo.

---

## 🛠️ HƯỚNG DẪN NHÂN BẢN DỰ ÁN MỚI (CLONE BLUEPRINT)

Để nhân bản nguyên lý V20.0 này sang một dự án thiền định/chữa lành mới (ví dụ: tạo ứng dụng `VKT_TAROT_STUDIO` hay `VKT_YOGA_ZEN`):

1. **constants.ts**:
   * Thừa kế mảng `VISUAL_STYLES` và điều chỉnh `prompt_enforce` cho phù hợp ngách mới.
   * Khai báo ma trận khuyên dùng style theo quốc gia trong `MARKET_STYLE_RECOMMENDATIONS`.
2. **prompts.ts**:
   * Dán đè khối luật **[GEOGRAPHIC MATERIAL & SOUND ROUTING PROTOCOL]** định tuyến thực vật và nhạc cụ theo thổ nhưỡng.
   * Dán đè khối luật **[MATERIAL CONSISTENCY LOCK]** để khóa cứng nhất quán vật liệu.
   * Khóa cứng giọng thương hiệu Đạo sư / Chuyên gia `OFF-SCREEN`.
3. **ScriptModule.tsx**:
   * Copy toàn bộ logic render nút bấm phong cách phát sáng màu sắc linh động và hiển thị thẻ hổ phách **Amber Compliance Shield**.
