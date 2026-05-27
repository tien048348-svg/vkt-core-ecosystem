# 🛑 THIẾT QUÂN LUẬT VKT: QUY TRÌNH ĐỒNG BỘ & NÂNG CẤP PHIÊN BẢN 🛑

Tài liệu này là cốt lõi của Hệ Sinh Thái VKT, quy định quy tắc bắt buộc khi nâng cấp mã nguồn (ví dụ: V19 -> V20 -> V21).
Vị trí lưu trữ: Root của VKT_ECOSYSTEM_CORE. AI bắt buộc phải đọc file này trước mỗi lần thực hiện cập nhật.

> [!CAUTION]
> AI **BẮT BUỘC** phải đọc và đánh dấu check `[x]` từng bước trong file `task.md` theo đúng trình tự dưới đây mỗi khi nhận lệnh nâng cấp một dự án. **TUYỆT ĐỐI KHÔNG ĐƯỢC NHẢY BƯỚC HOẶC BÁO CÁO HOÀN THÀNH KHI CHƯA CHẠY QUA BƯỚC QA (KIỂM THỬ).**

---

## BƯỚC 1: KHẢO SÁT & ĐỐI CHIẾU MÃ NGUỒN (CODEBASE AUDIT)
- Lấy dự án gốc (Master Template) làm hệ quy chiếu tuyệt đối. Ví dụ: Khi lên V20, hãy lấy Dharma Studio V20 làm chuẩn.
- Dùng công cụ `view_file` quét và đọc lại toàn bộ các file trọng yếu của dự án chuẩn: `App.tsx`, `Header.tsx`, `AdminModule.tsx`, `ScriptModule.tsx`, `StudioModule.tsx`, và các Components liên quan.
- Ghi chú lại tất cả các state, Feature Flags, local storage keys, và UI components mới.

## BƯỚC 2: TIẾN HÀNH ĐỒNG BỘ THEO LỚP (LAYER-BY-LAYER SYNC)
Quá trình đồng bộ phải đi từ vỏ ngoài vào trong lõi, không được chắp vá lộn xộn.

### 2.1. Lớp Nền Tảng (Core & Config)
- Đồng bộ `firebase.ts` (nếu có thay đổi kiến trúc DB).
- Đồng bộ `App.tsx`:
  - Cập nhật interface `GlobalSettings` đảm bảo không sót bất kỳ trường nào.
  - Cập nhật các state toàn cục (ví dụ: `showScrollTop`).
  - Kiểm tra logic mật khẩu / xác thực (Ví dụ: Password Admin `vkt` hoặc `admin`).
  - Đảm bảo các Module được truyền đầy đủ `props`.

### 2.2. Lớp Quản Trị (Admin Panel)
- Cập nhật `AdminModule.tsx`:
  - Đồng bộ khu vực Version Vault (Hiển thị đúng tên phiên bản lõi hiện tại, VD: V20.0, V21.0).
  - **BẮT BUỘC:** File tải về Rollback phải ghép kèm tên dự án (VD: `Tai_Che_V20.0_Rollback.zip`).
  - **BẮT BUỘC:** Phải có nút **Tải Mã Nguồn Lên (Restore)** và popup cảnh báo hướng dẫn người dùng giao file ZIP cho AI thông qua khung chat.
  - Khớp nối toàn bộ tính năng **Feature Flags** (Ví dụ: Smart Chunking PRO Export).
  - Đảm bảo các khóa `localStorage` khớp với hệ thống.

### 2.3. Lớp Xử Lý Dữ Liệu & UI (Main Modules)
- Cập nhật `ScriptModule.tsx` & `prompts.ts`:
  - Rà soát các block UI cũ và thay thế hoàn toàn bằng UI mới (Ví dụ: Omni-Progress Bar).
  - Đồng bộ logic xử lý luồng tạo dữ liệu và gọi API.
  - **BẮT BUỘC (LANGUAGE CONSTRAINT):** Trong file `prompts.ts`, phải kiểm tra xem có dòng khóa ngôn ngữ chưa. (Quy tắc: `voice_text`/`dialogues` = 100% TARGET_LANGUAGE. `character`/`sfx_music_suggestion`/`video_prompt`/`image_prompt` = 100% TIẾNG ANH).
- Cập nhật `StudioModule.tsx`:
  - Rà soát hệ thống xuất file.
  - Bắt buộc kiểm tra các chức năng ẩn/hiện dựa trên Feature Flags (Ví dụ: Các nút Tải PRO).
- Cập nhật `Header.tsx`:
  - Đảm bảo có nút Home (Trở về trang chủ Ecosystem).
  - Các thông tin Version tag hiển thị chính xác.

### 2.4. Lớp Thành Phần (Components)
- Copy toàn bộ các component phụ trợ từ dự án chuẩn sang (Ví dụ: `ProgressBar.tsx`, `Toast.tsx`...).

---

## BƯỚC 3: TỰ KIỂM THỬ XUYÊN MÔ ĐUN (CROSS-MODULE QA)
> [!IMPORTANT]
> Đây là bước sống còn. AI không được phép bàn giao nếu chưa tự đặt câu hỏi và kiểm tra chéo các file.

1. **Khớp nối Props**: Module A có truyền đúng props mà Module B cần không? (App -> Studio, Admin -> App).
2. **Khớp nối State/Storage**: Key lưu trong `localStorage` tại AdminModule đã được đọc đúng tên ở StudioModule chưa?
3. **Dọn rác**: Đã xóa triệt để các state và code thừa của phiên bản cũ chưa?

---

## BƯỚC 4: BIÊN DỊCH & TRIỂN KHAI (BUILD & DEPLOY)
1. Chạy lệnh `npm run build` cục bộ để đảm bảo không có bất kỳ lỗi cú pháp, thiếu biến, hay sai kiểu dữ liệu nào (TypeScript Errors).
2. Khi build thành công 100%, mới tiến hành chạy lệnh `npx vercel --prod --yes`.
3. Chờ tiến trình Deploy hoàn tất và lấy URL.

---

## BƯỚC 5: BÁO CÁO NGHIỆM THU
Viết báo cáo Liệt kê rõ ràng:
- Các module đã can thiệp.
- Các tính năng mới đã được đồng bộ.
- Kết quả chạy Build.
- Cung cấp Link dự án đã cập nhật.

> [!WARNING]
> Nếu AI bỏ sót bất kỳ bước nào trong Thiết Quân Luật này và để User phải tự đi tìm lỗi, đó được coi là sự thất bại nghiêm trọng. Bất kỳ lệnh "Nâng cấp" nào sau này cũng tự động kích hoạt và bắt buộc tuân theo tài liệu này.
