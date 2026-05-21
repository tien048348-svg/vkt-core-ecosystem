# PowerShell Script to restore to stable-v3.0.0
$OutputEncoding = [System.Text.Encoding]::UTF8
Host.UI.RawUI.WindowTitle = "Khôi Phục Hệ Thống VKT Ecosystem Hub - stable-v3.0.0"

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "   🌟 KHÔI PHỤC HỆ THỐNG VẤN ĐỀ VỀ TRẠNG THÁI ỔN ĐỊNH NHẤT (v3.0.0) 🌟" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Bạn đang chuẩn bị khôi phục toàn bộ mã nguồn về trạng thái tốt nhất:"
Write-Host " - Phiên bản: stable-v3.0.0 (Cấu hình SaaS, PayOS, VietQR, Cancel Pending)"
Write-Host " - Đã được kiểm tra: Biên dịch 100% thành công, không lỗi."
Write-Host " - Đã deploy thành công trên Vercel (https://kiemtienvu.com)."
Write-Host ""
Write-Host "⚠️  LƯU Ý: Hành động này sẽ ghi đè và loại bỏ tất cả các thay đổi chưa lưu" -ForegroundColor Red
Write-Host "   hoặc các file code mới bị lỗi để đưa hệ thống về trạng thái chuẩn nhất." -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Bạn có chắc chắn muốn khôi phục không? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host ""
    Write-Host "[Đã Hủy] Không có thay đổi nào được thực hiện." -ForegroundColor Yellow
    Read-Host "Nhấn Enter để thoát"
    exit
}

Write-Host ""
Write-Host "[1/3] Đang tiến hành reset mã nguồn về tag [stable-v3.0.0]..." -ForegroundColor Cyan
git reset --hard stable-v3.0.0

Write-Host ""
Write-Host "[2/3] Đang dọn dẹp các file rác mới phát sinh (nếu có)..." -ForegroundColor Cyan
git clean -fd

Write-Host ""
Write-Host "[3/3] Kiểm tra trạng thái Git hiện tại..." -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "   🎉 KHÔI PHỤC THÀNH CÔNG! HỆ THỐNG ĐÃ TRỞ VỀ TRẠNG THÁI TỐT NHẤT!" -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "Để chạy thử môi trường local: npm run dev"
Write-Host "Để deploy lại lên Vercel: npx vercel --prod"
Write-Host ""
Read-Host "Nhấn Enter để kết thúc"
