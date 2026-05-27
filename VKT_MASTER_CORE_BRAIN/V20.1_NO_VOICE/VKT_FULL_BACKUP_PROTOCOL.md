# ĐẠO LUẬT SAO LƯU TOÀN VẸN (VKT FULL BACKUP PROTOCOL)

**Ngày ban hành:** 23/05/2026
**Mức độ:** TỐI CAO (CRITICAL)

## 1. NGUYÊN TẮC CỐT LÕI
Từ nay về sau, đối với TẤT CẢ các bản cập nhật phiên bản mới (V20, V21, V22...), quá trình sao lưu phải tuân thủ nguyên tắc **"ĐẦY ĐỦ THẬT LÀ CHI TIẾT - KHÔNG GHI VẮN TẮT"**. 

**TUYỆT ĐỐI KHÔNG ĐƯỢC:**
- Chỉ lưu mỗi file `MASTER_PROMPTS.ts`.
- Chỉ lưu mỗi file `README.md` hay `CHANGELOG.md`.
- Chia nhỏ hay bỏ bớt các file giao diện (`.tsx`, `.css`) với lý do "tiết kiệm dung lượng" hoặc "chỉ cần lưu lõi não".

## 2. YÊU CẦU THỰC THI (CHO CÁC AI ASSISTANT)
Khi nhận lệnh "Lưu phiên bản mới", AI phải thực hiện thao tác Copy TOÀN BỘ CẤU TRÚC DỰ ÁN (FULL SOURCE CODE) bao gồm:
1. Toàn bộ mã nguồn React (`/src/*`, components, hooks, services, pages).
2. Các file cấu hình (`package.json`, `tailwind.config.js`, `vite.config.ts`, `tsconfig.json`).
3. Toàn bộ các tài liệu hướng dẫn, Lõi Não (Brain) và Đạo luật hiện hành.

> "Luôn luôn là phải đầy đủ chứ không có ghi vắn tắt, để hôm sau đưa cho hệ thống một cái file, hệ thống vẫn phải hiểu và chạy được ngay lập tức." - *Trích lời Founder*

## 3. CHẾ TÀI
Mọi phiên bản AI Assistant làm việc trên dự án này nếu vi phạm Đạo luật này (tạo ra các thư mục Version rỗng tuếch hoặc vắn tắt) sẽ bị coi là không hoàn thành nhiệm vụ và đi ngược lại với Tầm nhìn cốt lõi của VKT Studio.
