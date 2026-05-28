const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const MASTER_TEMPLATE = 'VKT_MASTER_TEMPLATE';

// Các dự án con cần được đồng bộ
const CHILD_PROJECTS = [
  'VKT_PODCAST_STUDIO',
  'VKT_DHARMA_MUSIC',
  'VKT_DHARMA_STUDIO - 2 NV',
  'VKT_DHARMA_STUDIO - P',
  'VKT_DHARMA_STUDIO - P -THU NGHIEM',
  'TAI CHE',
  'VKT_KIDS'
];

// Danh sách các file Lõi Lego cần đồng bộ (Core AI Files)
// Lưu ý: Không đồng bộ nicheConfig.ts để giữ nguyên bản sắc của từng ngách
const FILES_TO_SYNC = [
  'src/data/prompts.ts',
  'src/data/constants.ts',
  'src/services/aiService.ts'
];

console.log('🔄 BẮT ĐẦU CHƯƠNG TRÌNH ĐỒNG BỘ VKT LÕI LEGO...');
console.log(`📌 Nguồn (Source): ${MASTER_TEMPLATE}`);
console.log('----------------------------------------------------');

let successCount = 0;
let errorCount = 0;

CHILD_PROJECTS.forEach(project => {
  console.log(`\n🚀 Đang quét dự án: [${project}]`);
  const targetProjectDir = path.join(ROOT_DIR, project);
  
  if (!fs.existsSync(targetProjectDir)) {
    console.log(`❌ Bỏ qua: Thư mục ${project} không tồn tại.`);
    return;
  }

  FILES_TO_SYNC.forEach(file => {
    const sourcePath = path.join(ROOT_DIR, MASTER_TEMPLATE, file);
    const targetPath = path.join(targetProjectDir, file);

    if (fs.existsSync(sourcePath)) {
      try {
        // Đảm bảo thư mục đích tồn tại
        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        // Copy đè file
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`  ✅ Đã đồng bộ: ${file}`);
        successCount++;
      } catch (err) {
        console.log(`  ❌ Lỗi khi copy ${file}:`, err.message);
        errorCount++;
      }
    } else {
      console.log(`  ⚠️ Cảnh báo: File nguồn ${file} không tồn tại trong Master Template!`);
    }
  });
});

console.log('\n====================================================');
console.log(`🎉 HOÀN TẤT ĐỒNG BỘ!`);
console.log(`📊 Tổng số file đồng bộ thành công: ${successCount}`);
if (errorCount > 0) {
  console.log(`⚠️ Số lỗi gặp phải: ${errorCount}`);
}
console.log('====================================================');
console.log('💡 Hướng dẫn: Bất cứ khi nào bạn sửa tính năng trong VKT_MASTER_TEMPLATE, chỉ cần mở Terminal và chạy lệnh: "node vkt-sync.js" để tự động cập nhật mọi App!');
