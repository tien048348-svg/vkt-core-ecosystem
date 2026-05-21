# VKT DHARMA STUDIO — TÀI LIỆU QUẢN TRỊ KỸ THUẬT V16.1

## 🚀 CHANGELOG: V16.5.6 (Dharma - 2026-05-21)

- **Copyright Firewall Integration:** Cập nhật Bức tường lửa bản quyền (Copyright Firewall) trong `src/data/prompts.ts` và hệ thống GEM INSTRUCTIONS. Chặn nghiêm ngặt việc nhắc đến tên người thật, người nổi tiếng hoặc nhân vật có bản quyền trong `video_prompt` và `image_prompt` để khắc phục hoàn toàn lỗi vi phạm chính sách của nền tảng AI (DALL-E 3/Imagen/Veo3).
- **Production Live Deploy Sync:** Deploy phiên bản hoàn thiện lên Vercel chính thức `phatphap.kiemtienvu.com`.
## 🚀 CHANGELOG: V16.5.5 (Dharma - 2026-05-20)

- **Character Option Customization (1 NV vs 2 NV):** Tích hợp tính năng lựa chọn số lượng nhân vật cho kịch bản. Bổ sung tùy chọn gói nhân vật: chế độ 1 nhân vật xuyên suốt (đồng bộ tên nhân vật và thuộc tính `voice_profile` ở mọi phân cảnh) hoặc giữ nguyên cơ chế luân phiên 2 nhân vật mặc định.
- **Production Live Deploy Sync:** Deploy phiên bản hoàn thiện lên Vercel chính thức `phatphap.kiemtienvu.com`.

## 🚀 CHANGELOG: V16.5.4 (Dharma - 2026-05-19)

- **Excel CSV V2 Export Integration:** Tích hợp tính năng tải file kịch bản phiên bản thứ hai (CSV2) với định dạng gộp nhãn tiêu đề trực tiếp vào đầu mỗi ô (không dòng tiêu đề đầu, gộp cột Time & Section, chèn dòng trống phân cách giữa các phân cảnh), giữ nguyên tệp CSV cũ hoạt động bình thường.
- **Production Live Deploy Sync:** Deploy phiên bản hoàn thiện lên Vercel chính thức `phatphap.kiemtienvu.com`.

## 🚀 CHANGELOG: V16.5.3 (Dharma - 2026-05-19)

- **CSV Export Blank Row Separation:** Nâng cấp chức năng xuất file Excel CSV kịch bản, tự động chèn 1 dòng trống hoàn toàn giữa các cảnh để phân tách dữ liệu trực quan trên Excel theo chuẩn yêu cầu mới.
- **Production Live Deploy Sync:** Deploy phiên bản hoàn thiện lên Vercel chính thức `phatphap.kiemtienvu.com`.

## 🚀 CHANGELOG: V16.5.2 (Dharma - 2026-05-19)

- **Voice Profile UI Optimization (5-Column Grid):** Thiết kế lại bảng hiển thị thông tin Voice Profile nâng cao từ 3 cột lẻ thành 5 cột ngang cân đối (`AGE & DETAILS`, `ACCENT`, `TIMBRE`, `TONE`, `SPEED`), giữ giao diện đồng nhất tuyệt đối với hệ sinh thái VKT.
- **Production Live Deploy Sync:** Deploy phiên bản hoàn thiện lên Vercel chính thức `phatphap.kiemtienvu.com`.

## 🚀 CHANGELOG: V16.5.1 (Dharma - 2026-05-19)

- **Duration Input Live Clamp:** Tích hợp bộ gạt tự động thời lượng tối đa về 10 phút ngay trong lúc gõ hoặc bấm thay đổi giá trị nhập liệu, tự động hiển thị Toast cảnh báo chi tiết theo ngôn ngữ thị trường (vi/en), ngăn chặn việc sinh kịch bản quá dài gây treo trình duyệt.
- **Production Live Deploy Sync:** Deploy bản dựng hoàn hảo, tối ưu hóa tuyệt đối lên máy chủ Vercel chính thức `phatphap.kiemtienvu.com`.

## 🔔 LỊCH SỬ CẬP NHẬT GẦN NHẤT
**Bản cập nhật V16.1 (Hybrid Elite & Anti-Repetition) - Ngày cập nhật: Hiện tại**
- **Thiết kế 10 Phong Cách Độc Tôn (Hybrid Styles):** Kết hợp Unreal Engine 5, Kintsugi, Mandala kính vạn hoa, và hiệu ứng khói trầm 3D vào hệ thống Visual Styles.
- **Tích Hợp 10 Phân Ngách Phật Pháp & Triết Lý Sâu Sắc:**
  1. Karma & Cause-Effect (Nhân Quả & Luân Hồi)
  2. Mindfulness & Healing (Tỉnh Thức & Chữa Lành)
  3. Filial Piety (Đạo Hiếu & Công Ơn Cha Mẹ)
  4. Compassion & Letting Go (Từ Bi & Buông Bỏ)
  5. Impermanence (Vô Thường & Sinh Lão Bệnh Tử)
  6. Generosity & Giving (Bố Thí & Tích Đức)
  7. Buddha's Life Stories (Điển Tích Cuộc Đời Đức Phật)
  8. Zen & Simplicity (Thiền Định & Sống Tối Giản)
  9. Speech Karma (Khẩu Nghiệp & Lời Nói Từ Bi)
  10. Destiny & Meeting (Nhân Duyên & Gặp Gỡ)
- **Thuật Toán Tráo Bối Cảnh Vi Mô (Dharma Micro-Contexts Matrix):** Tự động chọn ngẫu nhiên bối cảnh yên bình sâu lắng (hiên chùa rêu phong, góc thiền trà khói trầm, rừng trúc xào xạc...) để kịch bản không bị rập khuôn.
- **Hạt Giống Chống Lặp Kịch Bản (Random Seed Mutation):** Truyền hạt ngẫu nhiên cực lớn để phá vỡ cấu trúc AI cũ, cam kết độc bản cho mỗi kịch bản tạo ra.
- **Khóa 8K Resolution:** Ép hệ thống AI xuất hình ảnh sắc nét chuẩn 8K Ultra HD.
- **Khóa Âm Thanh Uy Lực (Audio Lock):** Chỉ thị hệ thống chèn mạnh mẽ các âm thanh "Chuông Đại Hồng Chung", "Sáo trúc", "Gõ mõ" và Tần số 432Hz vào prompt.
- **Hiển thị Giao diện UI:** Mở khóa khung chọn `VISUAL_STYLES` trong Story Weaver.
- **Tự động Deploy:** Đã thiết lập chuẩn tự động Commit GitHub và đẩy lên Vercel (`phatphap.kiemtienvu.com`) mỗi khi có cập nhật cốt lõi.

---

## 🎯 TỔNG QUAN HỆ THỐNG
- **Ngách:** Phật Pháp, Chữa Lành, Triết Lý Nhân Sinh (Dharma & Healing).
- **Thị trường mục tiêu (Market):** `vn_dharma` (Việt Nam) và 10 thị trường toàn cầu.
- **Visual Theme:** Dharma Zen (Tông màu trầm ấm, Vàng Gold, Trầm Hương).
- **Kiến trúc App:** Cấu trúc 4 Module (Trend Scout, Story Weaver, Dharma Studio, Viral SEO) giữ phiên không mất dữ liệu.
- **AI Brain:** `gemini-1.5-pro`
- **Trạng thái:** Đã Deploy Vercel.

---

## 🚀 QUY TRÌNH DEPLOY VERCEL
Hệ thống AI (Antigravity) được cấu hình để tự động chạy các lệnh sau mỗi khi có thay đổi:
```powershell
cd e:\HMKT\VKT_DHARMA_STUDIO
npm run build
git add -A
git commit -m "Auto-update"
npx -y vercel --prod --yes
```
URL Live: `https://phatphap.kiemtienvu.com`

---

**© VKT — 055.979.3678**
