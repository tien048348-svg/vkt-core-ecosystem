import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { SiteConfig } from '../data/apps';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppAccessEntry {
  enabled: boolean;
  startDate: string;      // "YYYY-MM-DD"
  durationDays: number;
  expiryDate: string;     // "YYYY-MM-DD" — tự tính
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: any;
  lastLogin: any;
  appAccess: Record<string, AppAccessEntry>;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Kiểm tra user có quyền vào app và còn trong hạn không */
  hasAccess: (appId: string) => boolean;
  /** Số ngày còn lại (-1 = không có quyền, 0 = hết hạn) */
  daysRemaining: (appId: string) => number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Tính ngày hết hạn từ ngày bắt đầu + số ngày */
export function calcExpiryDate(startDate: string, durationDays: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + durationDays);
  return d.toISOString().split('T')[0];
}

/** Số ngày còn lại từ hôm nay đến ngày hết hạn */
export function calcDaysRemaining(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('support@kiemtienvu.com');
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  // Lắng nghe cấu hình hệ thống để lấy adminEmail và siteConfig
  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as SiteConfig;
        setSiteConfig(data);
        if (data.adminEmail) {
          setAdminEmail(data.adminEmail);
        }
      }
    }, (err) => {
      console.error("Settings listen error in AuthContext:", err);
    });
    return () => unsubSettings();
  }, []);

  // Lắng nghe trạng thái đăng nhập
  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      // Clean up previous profile listener if any
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);

        // Lắng nghe Realtime Profile ngay lập tức
        unsubscribeProfile = onSnapshot(userRef, (profileSnap) => {
          try {
            if (!profileSnap.exists()) {
              // ─── TẠO MỚI USER BẤT ĐỒNG BỘ TRONG NỀN (KHÔNG BLOCK UI) ───
              // Cung cấp profile tạm và tắt loading ngay lập tức để trang tải tức thì
              const tempProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
                photoURL: firebaseUser.photoURL || '',
                createdAt: new Date(),
                lastLogin: new Date(),
                appAccess: {},
              };
              setUserProfile(tempProfile);
              setAuthLoading(false);

              // Khởi tạo tài khoản thực tế trên đám mây chạy ngầm
              (async () => {
                try {
                  const newProfile: UserProfile = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    displayName: firebaseUser.displayName || '',
                    photoURL: firebaseUser.photoURL || '',
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp(),
                    appAccess: {},
                  };

                  await setDoc(userRef, newProfile);
                  console.log(`[AuthContext] Đã ghi nhận thành công user mới: ${firebaseUser.uid} (${firebaseUser.email})`);
                } catch (e) {
                  console.error("Async user creation or merge error:", e);
                }
              })();
            } else {
              // --- CHỐT CHẶN VÒNG LẶP VÔ HẠN QUAN TRỌNG NHẤT ---
              // Lệnh này loại bỏ 100% tình trạng "Ghi rác" làm ngốn 20.000 Quota của Firebase.
              // Nếu snapshot này được tạo ra từ Cache của trình duyệt (chưa lên Server), bỏ qua nó!
              if (profileSnap.metadata.hasPendingWrites) {
                return;
              }

              const data = profileSnap.data() as UserProfile;
              // Set dữ liệu profile và tắt trạng thái loading ngay lập tức để giao diện hiển thị tức thì (<10ms)
              setUserProfile(data);
              setAuthLoading(false);

              // ─── CƠ CHẾ TỰ VÁ LỖI (SELF-HEALING MECHANISM) ───
              // Tự động kiểm tra và ghi bổ sung nếu tài khoản bị thiếu các trường quan trọng do lỗi trước đây
              const missingFields: Partial<UserProfile> = {};
              if (!data.createdAt) {
                missingFields.createdAt = serverTimestamp() as any;
              }
              if (!data.email && firebaseUser.email) {
                missingFields.email = firebaseUser.email;
              }
              if (!data.displayName && firebaseUser.displayName) {
                missingFields.displayName = firebaseUser.displayName;
              }
              if (!data.photoURL && firebaseUser.photoURL) {
                missingFields.photoURL = firebaseUser.photoURL;
              }

              if (Object.keys(missingFields).length > 0) {
                console.log(`[Self-Healing] Vá dữ liệu cho user ${firebaseUser.uid}:`, Object.keys(missingFields));
                setDoc(userRef, missingFields, { merge: true }).catch(console.error);
              }

              // Cập nhật lastLogin bất đồng bộ một lần duy nhất, tránh ghi đè liên tục.
              // Tăng thời gian giãn cách lên 1 GIỜ (thay vì 5 phút) để tối đa hóa tiết kiệm dung lượng Firestore.
              let lastLoginTime = 0;
              if (data.lastLogin) {
                if (typeof data.lastLogin.toDate === 'function') {
                  lastLoginTime = data.lastLogin.toDate().getTime();
                } else if (data.lastLogin.seconds) {
                  lastLoginTime = data.lastLogin.seconds * 1000;
                } else if (typeof data.lastLogin === 'number') {
                  lastLoginTime = data.lastLogin;
                } else {
                  lastLoginTime = new Date(data.lastLogin).getTime();
                }
              }

              const now = Date.now();
              if (now - lastLoginTime > 60 * 60 * 1000) {
                setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true }).catch(console.error);
              }
            }
          } catch (error) {
            console.error("Profile listen processing error:", error);
            setAuthLoading(false);
          }
        }, (err) => {
          console.error("Profile listen error:", err);
          setAuthLoading(false);
        });
      } else {
        setUserProfile(null);
        setAuthLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Lỗi signInWithGoogle:", error);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
  };

  // Helper an toàn để chuyển đổi các kiểu định dạng ngày của Firebase/JS thành Date object
  const parseCreatedDate = (createdAt: any): Date => {
    if (!createdAt) return new Date();
    if (typeof createdAt.toDate === 'function') {
      return createdAt.toDate();
    }
    if (createdAt instanceof Date) {
      return createdAt;
    }
    if (typeof createdAt === 'object' && createdAt.seconds) {
      return new Date(createdAt.seconds * 1000);
    }
    return new Date(createdAt);
  };

  // Helper tính toán số ngày dùng thử/mặc định động từ thời điểm tạo tài khoản
  const getDynamicRemainingDays = (userCreatedDate: Date, durationDays: number): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiry = new Date(userCreatedDate.getTime());
    expiry.setDate(expiry.getDate() + durationDays);
    expiry.setHours(0, 0, 0, 0);
    
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  /** Có quyền = enabled + còn trong hạn (Admin luôn luôn có quyền) */
  const hasAccess = (appId: string): boolean => {
    // 1. Kiểm tra Admin (Quyền cao nhất)
    if (user?.email && (user.email.toLowerCase() === adminEmail.toLowerCase() || user.email.toLowerCase() === 'tien048348@gmail.com')) {
      return true;
    }
    
    if (!userProfile || !siteConfig) return false;

    // 2. Quyền thủ công (Manual Override): Nếu Admin chủ động cấu hình riêng cho app này
    const manualEntry = userProfile.appAccess?.[appId];
    if (manualEntry) {
      if (manualEntry.enabled) {
        const daysLeft = calcDaysRemaining(manualEntry.expiryDate);
        if (daysLeft > 0) return true;
      } else {
        // Bị Admin khóa thủ công -> Chặn tuyệt đối
        return false;
      }
    }

    // 3. Gói dịch vụ đang hoạt động (Active Plan)
    const activePlan = (userProfile as any).activePlan;
    if (activePlan) {
      const planDays = calcDaysRemaining(activePlan.expiryDate);
      if (planDays > 0) {
        const isAllApps = !activePlan.appIds || activePlan.appIds.length === 0;
        if (isAllApps || activePlan.appIds.includes(appId)) {
          return true;
        }
      }
    }

    // 4. Quyền mặc định hệ thống (Default Access)
    if (siteConfig.defaultAccessEnabled) {
      const isTarget = !siteConfig.defaultAccessAppIds || 
                       siteConfig.defaultAccessAppIds.length === 0 || 
                       siteConfig.defaultAccessAppIds.includes(appId);
      if (isTarget) {
        const userCreated = parseCreatedDate(userProfile.createdAt);
        const daysLeft = getDynamicRemainingDays(userCreated, siteConfig.defaultAccessDays || 30);
        if (daysLeft > 0) return true;
      }
    }

    // 5. Gói dùng thử miễn phí (Trial Access)
    if (siteConfig.trialEnabled) {
      const isTarget = !siteConfig.trialAppIds || 
                       siteConfig.trialAppIds.length === 0 || 
                       siteConfig.trialAppIds.includes(appId);
      if (isTarget) {
        const userCreated = parseCreatedDate(userProfile.createdAt);
        const daysLeft = getDynamicRemainingDays(userCreated, siteConfig.trialDays || 3);
        if (daysLeft > 0) return true;
      }
    }

    return false;
  };

  /** Số ngày còn lại, -1 nếu không có quyền, 9999 nếu là Admin */
  const daysRemaining = (appId: string): number => {
    // 1. Quyền Admin trọn đời
    if (user?.email && (user.email.toLowerCase() === adminEmail.toLowerCase() || user.email.toLowerCase() === 'tien048348@gmail.com')) {
      return 9999;
    }

    if (!userProfile || !siteConfig) return -1;

    let maxDays = -1;

    // 2. Quyền thủ công (Manual Override)
    const manualEntry = userProfile.appAccess?.[appId];
    if (manualEntry) {
      if (manualEntry.enabled) {
        const days = calcDaysRemaining(manualEntry.expiryDate);
        if (days > maxDays) maxDays = days;
      } else {
        // Bị Admin khóa thủ công
        return -1;
      }
    }

    // 3. Gói dịch vụ đang hoạt động (Active Plan)
    const activePlan = (userProfile as any).activePlan;
    if (activePlan) {
      const planDays = calcDaysRemaining(activePlan.expiryDate);
      if (planDays > 0) {
        const isAllApps = !activePlan.appIds || activePlan.appIds.length === 0;
        if (isAllApps || activePlan.appIds.includes(appId)) {
          if (planDays > maxDays) maxDays = planDays;
        }
      }
    }

    // 4. Quyền mặc định hệ thống (Default Access)
    if (siteConfig.defaultAccessEnabled) {
      const isTarget = !siteConfig.defaultAccessAppIds || 
                       siteConfig.defaultAccessAppIds.length === 0 || 
                       siteConfig.defaultAccessAppIds.includes(appId);
      if (isTarget) {
        const userCreated = parseCreatedDate(userProfile.createdAt);
        const daysLeft = getDynamicRemainingDays(userCreated, siteConfig.defaultAccessDays || 30);
        if (daysLeft > 0 && daysLeft > maxDays) {
          maxDays = daysLeft;
        }
      }
    }

    // 5. Gói dùng thử miễn phí (Trial Access)
    if (siteConfig.trialEnabled) {
      const isTarget = !siteConfig.trialAppIds || 
                       siteConfig.trialAppIds.length === 0 || 
                       siteConfig.trialAppIds.includes(appId);
      if (isTarget) {
        const userCreated = parseCreatedDate(userProfile.createdAt);
        const daysLeft = getDynamicRemainingDays(userCreated, siteConfig.trialDays || 3);
        if (daysLeft > 0 && daysLeft > maxDays) {
          maxDays = daysLeft;
        }
      }
    }

    return maxDays;
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      authLoading,
      signInWithGoogle,
      signOut,
      hasAccess,
      daysRemaining,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
