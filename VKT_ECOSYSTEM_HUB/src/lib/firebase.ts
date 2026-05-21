import { initializeApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4YT1SsITly6bfPBnUui19v6qJ4qv-SC8",
  authDomain: "vkt-ecosystem-hub.firebaseapp.com",
  projectId: "vkt-ecosystem-hub",
  storageBucket: "vkt-ecosystem-hub.firebasestorage.app",
  messagingSenderId: "581932748990",
  appId: "1:581932748990:web:34a2d256147c29d8800eef"
};

const app = initializeApp(firebaseConfig);

// ─── TẮT OFFLINE PERSISTENT CACHE ĐỂ TRÁNH TRÀN BỘ NHỚ TRÌNH DUYỆT ───
// Sử dụng bộ nhớ đệm trong RAM (Memory Cache) giúp giải quyết triệt để 100% lỗi QuotaExceededError
// khi trình duyệt ẩn danh, chặn lưu trữ hoặc ổ đĩa C của máy khách bị đầy hoàn toàn.
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
});

export const storage = getStorage(app);
export const auth = getAuth(app);
