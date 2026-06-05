import re

with open('E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_MASTER_CORE_BRAIN/V21.1_VEO_STUDIO/src/data/prompts.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'\"script\": \[\s*\{[\s\S]*?\"time\": \"00:00 - 00:\$\{secPerSceneNum\}\",',
    '"script": [\n    {\n      "scene_number": 1,\n      "ai_self_correction_scratchpad": {\n        "1_word_count_check": "(Tự viết nháp lời thoại. Tự đếm chính xác số từ. Nếu vượt ${maxWords} từ -> Tự gọt ngắn lại. CẤM VƯỢT QUÁ 4 CÂU.)",\n        "2_camera_angle_check": "(Tự soi bản nháp hình ảnh. Nếu có chữ \'zoom out\', \'wide shot\', \'tracking shot\' -> TỰ ĐỘNG XÓA BỎ. Bắt buộc dùng \'Extreme close-up\' hoặc \'Slow zoom in\'.)",\n        "3_repetition_check": "(Tự soi xem có lặp từ khóa với cảnh trước không? Nếu có -> Sửa ngay.)",\n        "4_outro_lock_check": "(Nếu là cảnh cuối, đã chèn đúng 100% câu Slogan chưa?)",\n        "5_english_leak_check": "(Trong đoạn thoại tiếng Việt có dính chữ tiếng Anh nào không? Xóa sạch.)"\n      },\n      "time": "00:00 - 00:${secPerSceneNum}",',
    content
)

with open('E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_MASTER_CORE_BRAIN/V21.1_VEO_STUDIO/src/data/prompts.ts', 'w', encoding='utf-8') as f:
    f.write(content)
