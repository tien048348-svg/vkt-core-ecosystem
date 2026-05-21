# 🌟 VKT Ecosystem Hub

**VKT Ecosystem Hub** là nền tảng quản trị trung tâm cao cấp dành cho hệ sinh thái công nghệ VKT. Được xây dựng với giao diện người dùng (UI) siêu việt, mượt mà và một trang Quản trị (Admin Panel) mạnh mẽ, cho phép cấu hình 100% nội dung trang web theo thời gian thực (Real-time).

🔗 **Live:** https://www.kiemtienvu.com

---

## 🛠️ Công Nghệ Lõi (Tech Stack)

| Công nghệ | Chi tiết |
|---|---|
| **Framework** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS (Dark mode, Gradient, Glassmorphism) |
| **Database** | Firebase Firestore (Real-time sync) |
| **Storage** | Firebase Storage + Google Drive auto-format |
| **Animation** | Framer Motion |
| **Icons** | Lucide React + Custom SVG (Zalo) |
| **Email Service** | EmailJS (Professional delivery) |
| **Deployment** | Vercel (Production) |

---

## 🚀 Các Tính Năng Đã Triển Khai

### 1. Header Cao Cấp
- **Logo tròn** + **Tên thương hiệu** (cỡ chữ `2xl`) + **Slogan** hiển thị trên desktop.
- **Nav bar** trung tâm với 3 mục: Trang Chủ, Hệ Sinh Thái, Tính Năng (cỡ chữ `base`, `semibold`).
- **Nút Hotline/Zalo** gradient sáng nổi bật, bấm để gọi ngay.
- **Nút Admin** icon khóa nhỏ tinh tế để vào trang quản trị.
- **Hamburger menu** responsive cho mobile.

### 2. Hero Section
- Tiêu đề lớn gradient + Mô tả + Nút CTA "Khám Phá Ngay".
- Banner hình ảnh bên phải với hiệu ứng glow.

### 3. Feature Cards (3 Cột Tính Năng)
- Icon + Tiêu đề + Mô tả cho 3 điểm nhấn công nghệ.
- Toàn bộ nội dung dynamic, cấu hình từ Admin.

### 4. Hệ Thống Thẻ Ứng Dụng (App Cards)
- Thanh tìm kiếm ứng dụng.
- Click toàn diện dẫn đến trang đích.
- Nút YouTube mở Video Modal nội bộ (không mở tab mới).
- Nút MXH khác mở tab mới.
- Ảnh bìa + Badge màu gradient theo theme.

### 5. Footer 3 Cột Chuyên Nghiệp
- **Cột 1:** Logo + Tên thương hiệu (`xl`) + Mô tả hệ sinh thái (có fallback mặc định).
- **Cột 2:** "Ứng Dụng Nổi Bật" — liệt kê tối đa 4 app + link "Xem tất cả".
- **Cột 3:** "Liên Hệ & Hỗ Trợ":
  - 📱 **Zalo** — Icon Zalo + nhãn "ZALO" xanh + số điện thoại → link `zalo.me/`.
  - 📧 **Email** — Icon mail + địa chỉ email.
  - 📍 **Địa chỉ** — Icon pin + địa chỉ văn phòng.
- **Dòng đáy:** Bản quyền (`text-sm`) + Link Điều khoản / Bảo mật.

### 6. Thuật Toán Xử Lý Google Drive
- `formatDriveImage` → chuyển link Drive thành thumbnail phân giải cao.
- `formatDriveVideo` → chuyển link Drive thành link stream trực tiếp.
- `ensureHttps` → tự động thêm `https://` nếu thiếu protocol.

### 7. Quản Lý Vòng Đời Ứng Dụng (CRUD)
- **Thêm:** Nút "+ Thêm Ứng dụng" trong Admin.
- **Ẩn/Hiện:** Toggle tắt ứng dụng khỏi trang chủ mà không xóa dữ liệu.
- **Xóa:** Nút "Xóa ứng dụng" với hộp thoại xác nhận.

### 9. Quản Lý SaaS \& Tài Khoản (Phiên bản Mới)
- Đăng nhập bằng Google (Firebase Auth).
- Cơ chế **Free Trial** (Dùng thử) cho người dùng mới.
- Cơ chế **Default Access** (Mở khóa mặc định nội bộ).
- Quản lý gói cước (Plans): Gói lẻ (1 App) hoặc Combo (Nhiều Apps), số ngày truy cập.
- Tính năng **Khóa Tự Động**: Hết số ngày cấu hình, người dùng tự động bị khóa ứng dụng.

### 10. Khôi phục mật khẩu qua Email
- Tích hợp **EmailJS** để gửi mật khẩu hiện tại trực tiếp vào hòm thư Admin.
- Cơ chế xác thực: So khớp email nhập vào với **Email nhận mật khẩu** đã được cấu hình bí mật trong trang quản trị.

### 11. Theme System
- 6 màu chủ đạo: Gold, Indigo, Rose, Amber, Emerald, Cyan.
- Gradient tự động áp dụng cho: Header CTA, Hero glow, Card accents, Footer highlights.

---

## 🛡️ Trang Quản Trị (Admin Panel)

**URL:** `/admin` | **Mật khẩu:** `vktadmin2026`

### Tab 1 — Cấu Hình Trang (Site Config):

| Trường | Mô tả |
|---|---|
| Tên thương hiệu | Tên hiển thị ở Header \& Footer (VD: VKT.HUB) |
| Slogan | Dòng chữ nhỏ dưới tên thương hiệu ở Header |
| Logo | Link ảnh hoặc upload từ máy |
| Hero Title / Subtitle / Banner | Thông tin khu vực Banner chính |
| 3 Cột tính năng | Tiêu đề + Mô tả cho 3 cột điểm nhấn |
| Theme Color | Màu chủ đạo toàn hệ thống (6 lựa chọn) |
| Hotline | Số Zalo (hiển thị ở Header \& Footer với icon Zalo) |
| Email | Email hỗ trợ (hiển thị ở Footer) |
| Địa chỉ | Địa chỉ văn phòng (hiển thị ở Footer) |
| Mô tả Footer | Đoạn mô tả ngắn dưới logo ở Footer |
| Bản quyền | Dòng Copyright ở đáy trang |
| Email nhận mật khẩu | Email dùng để xác minh & nhận mật khẩu khi bấm "Quên mật khẩu" |
| Điều khoản sử dụng | Link trang Điều khoản (bấm được ở Footer) |
| Chính sách bảo mật | Link trang Bảo mật (bấm được ở Footer) |
| Mật khẩu Admin mới | Đổi mật khẩu đăng nhập hệ thống |
| 🎁 Chế độ Dùng Thử | Bật/tắt Trial, thiết lập số ngày và app được dùng thử cho User mới |
| 🔓 Cấp Quyền Mặc Định | Mở khóa luôn các app được chọn cho toàn bộ người dùng (Nội bộ) |

### Tab 2 — Kho Ứng Dụng (App Config):
- Chỉnh sửa Tên, Mô tả, URL đích, Ảnh bìa.
- Thêm các nút liên kết phụ (YouTube, Facebook, TikTok, Website...).
- Nút **[ Mở App ]**: Mở nhanh URL trong trang quản trị.
- Công tắc: **Chỉ Admin Thấy (Ẩn)** hoặc **Công Khai (Trang chủ)**. Mọi app dù ẩn thì Admin vẫn truy cập bình thường bằng nút "Mở App".

### Tab 3 — Người Dùng (Smart Dashboard):
- Bảng quản lý tập trung toàn bộ người dùng đăng nhập bằng Google.
- Bộ lọc thông minh: Hoạt động, Sắp hết hạn (màu vàng cảnh báo), Hết hạn (màu đỏ), Chờ duyệt.
- Nút **Áp Dụng Gói**: Chọn gói và tự động tính ngày hết hạn cho người dùng.
- Tùy chỉnh thủ công: Mở khóa/Khóa từng app, nhập ngày bắt đầu và thời hạn tuỳ chỉnh.

### Tab 4 — Gói Dịch Vụ (Plans):
- Tạo các gói cước truy cập: Gói Cơ Bản (30 ngày, 1 app) / Gói Combo (90 ngày, nhiều app).
- Hỗ trợ công tắc bật tắt **Tính năng Thanh Toán** (hiển thị giá tiền trên app).

> **Lưu ý:** Tính năng Upload ảnh lên Firebase Storage yêu cầu gói **Blaze**. Nếu dùng gói Spark (miễn phí), hãy dán **Link Google Drive** — hệ thống sẽ tự động xử lý.

---

## 👨‍💻 Dành Cho Nhà Phát Triển

**Cấu trúc file cốt lõi:**

| File | Vai trò |
|---|---|
| `src/pages/Home.tsx` | Giao diện trang chủ (Header + Hero + Cards + Footer) |
| `src/pages/Admin.tsx` | Trung tâm điều khiển quản trị viên |
| `src/context/AppContext.tsx` | State toàn cục + Firebase read/write + `addApp()`, `deleteApp()` |
| `src/data/apps.ts` | Interface `AppConfig`, `SiteConfig` (schema dữ liệu) + default data |
| `src/lib/utils.ts` | `formatDriveImage`, `formatDriveVideo`, `ensureHttps` |
| `src/components/AppCard.tsx` | Thẻ ứng dụng với gradient, cover image, extra links |
| `src/components/Hero.tsx` | Hero section với CTA và banner |
| `src/components/VideoModal.tsx` | Modal phát video (hỗ trợ Drive + YouTube) |

**Quy trình thêm trường dữ liệu mới:**
1. Khai báo trong interface `SiteConfig` / `AppConfig` trong `src/data/apps.ts`.
2. Cập nhật giá trị mặc định trong `defaultSiteConfig` / `defaultApps`.
3. Thêm ô input vào `src/pages/Admin.tsx`.
4. Hiển thị trường đó trong `src/pages/Home.tsx` hoặc component liên quan.
5. Cập nhật file `README.md` này.

---

*Cập nhật lần cuối: 20/05/2026 — Phiên bản: v3.0 (SaaS Subscription, Auth, Admin Control, Smart Dashboard)*
