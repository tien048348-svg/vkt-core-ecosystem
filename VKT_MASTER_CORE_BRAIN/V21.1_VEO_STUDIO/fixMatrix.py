import re

with open('E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_MASTER_CORE_BRAIN/V21.1_VEO_STUDIO/src/data/dharmaMatrix.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_block = '''- 1. Short Video 0.5 Phút (4 Cảnh x 8s) - Core Message Focus:
  [FOREGROUND LOCK]: Dù bối cảnh luân chuyển liên tục, CAMERA LUÔN KHÓA CHẶT VÀO KHUÔN MẶT/BÁN THÂN THIỀN SƯ (CLOSE-UP / MEDIUM SHOT). Tuyệt đối cấm các góc máy rộng (NO WIDE SHOTS).
  + Cảnh 1-2 (Hook & Đặt Vấn Đề: Phông nền luân chuyển Tầng 1 - Chánh Điện. Cận mặt thần thái Thiền sư. Nhịp điệu dồn dập, mật độ 35-38 từ/cảnh).
  + Cảnh 3 (Phân Tích & Giải Pháp Nhanh: Phông nền luân chuyển sang Tầng 3 - Hành Lang. VẪN KHÓA CẬN CẢNH, mật độ 32-35 từ/cảnh).
  + Cảnh 4 (Kết Thúc & Định Danh: Match-cut QUAY TRỞ VỀ nền Tầng 1 - Chánh Điện để tạo vòng lặp vô hạn. Đọc câu kết định danh, để dành 2.5s cuối cho tiếng chuông ngân. Mật độ 30-33 từ).
'''

content = content.replace('- 1.5. Video Ngắn 1 Phút', new_block + '- 1.5. Video Ngắn 1 Phút')

with open('E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_MASTER_CORE_BRAIN/V21.1_VEO_STUDIO/src/data/dharmaMatrix.ts', 'w', encoding='utf-8') as f:
    f.write(content)
