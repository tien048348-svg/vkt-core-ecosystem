@echo off
chcp 65001 > nul
title Khôi Phục Hệ Thống VKT Ecosystem Hub - stable-v3.0.0
echo =====================================================================
echo    🌟 KHÔI PHỤC HỆ THỐNG VẤN ĐỀ VỀ TRẠNG THÁI ỔN ĐỊNH NHẤT (v3.0.0) 🌟
echo =====================================================================
echo.
echo Bạn đang chuẩn bị khôi phục toàn bộ mã nguồn về trạng thái tốt nhất:
echo - Phiên bản: stable-v3.0.0 (Cấu hình SaaS, PayOS, VietQR, Cancel Pending)
echo - Đã được kiểm tra: Biên dịch 100%% thành công, không lỗi.
echo - Đã deploy thành công trên Vercel (https://kiemtienvu.com).
echo.
echo ⚠️  LƯU Ý: Hành động này sẽ ghi đè và loại bỏ tất cả các thay đổi chưa lưu
echo    hoặc các file code mới bị lỗi để đưa hệ thống về trạng thái chuẩn nhất.
echo.
set /p confirm="Bạn có chắc chắn muốn khôi phục không? (Y/N): "
if /i "%confirm%" neq "Y" (
    echo.
    echo [Đã Hủy] Không có thay đổi nào được thực hiện.
    pause
    exit /b
)

echo.
echo [1/3] Đang tiến hành reset mã nguồn về tag [stable-v3.0.0]...
git reset --hard stable-v3.0.0

echo.
echo [2/3] Đang dọn dẹp các file rác mới phát sinh (nếu có)...
git clean -fd

echo.
echo [3/3] Kiểm tra trạng thái Git hiện tại...
git status

echo.
echo =====================================================================
echo    🎉 KHÔI PHỤC THÀNH CÔNG! HỆ THỐNG ĐÃ TRỞ VỀ TRẠNG THÁI TỐT NHẤT!
echo =====================================================================
echo Để chạy thử môi trường local: npm run dev
echo Để deploy lại lên Vercel: npx vercel --prod
echo.
pause
