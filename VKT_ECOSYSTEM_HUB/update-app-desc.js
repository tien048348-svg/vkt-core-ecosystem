import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4YT1SsITly6bfPBnUui19v6qJ4qv-SC8",
  authDomain: "vkt-ecosystem-hub.firebaseapp.com",
  projectId: "vkt-ecosystem-hub",
  storageBucket: "vkt-ecosystem-hub.firebasestorage.app",
  messagingSenderId: "581932748990",
  appId: "1:581932748990:web:34a2d256147c29d8800eef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanEcosystemDatabase() {
  console.log("⏳ Bắt đầu làm sạch cơ sở dữ liệu Firestore Live...");
  
  // 1. Làm sạch VKT Kids Cartoon Studio
  const kidsRef = doc(db, "apps", "kids-cartoon");
  try {
    await updateDoc(kidsRef, {
      name: "VKT Kids Cartoon Studio",
      description: "Ứng dụng sản xuất video hoạt hình 3D và giáo dục trực quan sinh động dành cho thiếu nhi. Hỗ trợ tự động biên soạn kịch bản song ngữ Anh-Việt theo 13 chủ đề học tập mẫu và tích hợp công nghệ đề xuất phong cách visual đặc thù (như 3D Pixar, Tranh màu nước, Đất nặn Claymation, Đồ chơi vải nỉ, Học tiếng Anh Mẹ & Bé...).",
      url: "https://vkt-kids.com"
    });
    console.log("✅ Làm sạch thành công app: kids-cartoon!");
  } catch (error) {
    console.error("❌ Lỗi khi làm sạch kids-cartoon:", error);
  }

  // 2. Làm sạch VKT Dharma Studio
  const dharmaRef = doc(db, "apps", "dharma-studio");
  try {
    await updateDoc(dharmaRef, {
      name: "VKT Dharma Studio",
      description: "Trạm phát sóng tinh thần. Nơi sản xuất nội dung Phật giáo và Đạo lý chuyên nghiệp với giọng đọc AI truyền cảm, hình ảnh thiền định và âm nhạc tĩnh tâm.",
      url: "https://vkt-dharma.com"
    });
    console.log("✅ Làm sạch thành công app: dharma-studio!");
  } catch (error) {
    console.error("❌ Lỗi khi làm sạch dharma-studio:", error);
  }

  // 3. Làm sạch VKT Recyclestyles
  const recycleRef = doc(db, "apps", "recyclestyles");
  try {
    await updateDoc(recycleRef, {
      name: "VKT Recyclestyles",
      description: "Nền tảng lan tỏa lối sống xanh. Hệ thống tự động biên dịch, ghép âm thanh và xuất bản các video hướng dẫn làm đồ handmade từ vật liệu tái chế.",
      url: "https://vkt-eco.com"
    });
    console.log("✅ Làm sạch thành công app: recyclestyles!");
  } catch (error) {
    console.error("❌ Lỗi khi làm sạch recyclestyles:", error);
  }

  console.log("🎉 TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC KHÔI PHỤC VỀ TRẠNG THÁI SẠCH HOÀN HẢO!");
}

cleanEcosystemDatabase();
