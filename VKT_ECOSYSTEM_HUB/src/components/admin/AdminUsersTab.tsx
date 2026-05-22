import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, AlertTriangle, Clock, CheckCircle2, XCircle, Loader2, Trash2, RefreshCw, Download } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAppContext } from '../../context/AppContext';
import { calcExpiryDate, calcDaysRemaining, type UserProfile } from '../../context/AuthContext';

type TabType = 'all' | 'active' | 'expiring' | 'expired' | 'pending';

// ─── COMPONENT CON DÒNG NGƯỜI DÙNG TỐI ƯU HÓA (REACT.MEMO) ────────────────────────
interface UserRowProps {
  user: UserProfile & {
    enrichedStatus: TabType;
    enrichedLowestDays: number | null;
    enrichedActiveAppsCount: number;
    daysRemainingMap: Record<string, number>;
  };
  apps: any[];
  plans: any[];
  isExpanded: boolean;
  onToggleExpand: (userId: string | null) => void;
  onApplyPlan: (userId: string) => Promise<void>;
  onManualOverride: (userId: string, appId: string, enabled: boolean, startDate: string, durationDays: number) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  selectedPlanId: string;
  setSelectedPlanId: (val: string) => void;
  planStartDate: string;
  setPlanStartDate: (val: string) => void;
  savingUser: string | null;
}

const UserRow = React.memo(({
  user,
  apps,
  plans,
  isExpanded,
  onToggleExpand,
  onApplyPlan,
  onManualOverride,
  onDeleteUser,
  selectedPlanId,
  setSelectedPlanId,
  planStartDate,
  setPlanStartDate,
  savingUser
}: UserRowProps) => {
  const status = user.enrichedStatus;
  const lowestDays = user.enrichedLowestDays;
  const activeAppsCount = user.enrichedActiveAppsCount;

  return (
    <>
      <tr className={`hover:bg-slate-800/30 transition-colors ${status === 'expiring' ? 'bg-amber-500/5' : ''}`}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`} alt="" className="w-8 h-8 rounded-full border border-slate-700" />
            <div>
              <p className="text-sm font-medium text-white">{user.displayName || 'Người dùng mới'}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          {status === 'active' && <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Đang HĐ</span>}
          {status === 'expiring' && <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-medium"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Sắp hết</span>}
          {status === 'expired' && <span className="inline-flex items-center gap-1 text-red-400 text-xs font-medium"><span className="w-2 h-2 rounded-full bg-red-500"></span> Hết hạn</span>}
          {status === 'pending' && <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-medium"><span className="w-2 h-2 rounded-full bg-slate-500"></span> Chờ duyệt</span>}
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-col">
            <span className="text-sm text-slate-300">{(user as any).assignedPlan || 'Tùy chỉnh'}</span>
            <span className="text-xs text-slate-500">{activeAppsCount} apps</span>
          </div>
        </td>
        <td className="px-6 py-4">
          {lowestDays !== null && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
              lowestDays <= 0 ? 'bg-red-500/10 text-red-400' :
              lowestDays <= 7 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {lowestDays <= 0 ? 'Đã hết hạn' : lowestDays === 9999 ? 'Trọn đời (Admin)' : `Còn ${lowestDays} ngày`}
            </span>
          )}
          {lowestDays === null && <span className="text-xs text-slate-600">—</span>}
        </td>
        <td className="px-6 py-4 text-right">
          <button onClick={() => onToggleExpand(isExpanded ? null : user.uid)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              isExpanded ? 'bg-slate-800 text-white border-slate-700' : 
              status === 'expiring' || status === 'expired' ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent' : 
              'bg-transparent text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10'
            }`}>
            {status === 'pending' ? 'Cấp Quyền' : 'Chi tiết'}
          </button>
        </td>
      </tr>

      {/* Expanded View */}
      {isExpanded && (
        <tr>
          <td colSpan={5} className="bg-slate-950 border-b border-slate-800 p-0">
            <div className="p-6 border-l-2 border-indigo-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Cấp Gói Nhanh */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4">⚡ Cấp Gói Nhanh</h4>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Chọn gói dịch vụ</label>
                      <select value={selectedPlanId} onChange={e => setSelectedPlanId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                        <option value="">-- Chọn gói --</option>
                        {plans.map(p => <option key={p.id} value={p.id}>{p.name} ({p.durationDays} ngày)</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Ngày bắt đầu</label>
                      <input type="date" value={planStartDate} onChange={e => setPlanStartDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]" />
                    </div>
                    <button 
                      onClick={() => onApplyPlan(user.uid)}
                      disabled={!selectedPlanId || savingUser === user.uid}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex justify-center items-center gap-2">
                      {savingUser === user.uid ? <Loader2 size={16} className="animate-spin" /> : 'Áp Dụng Gói'}
                    </button>
                  </div>
                  <button onClick={() => onDeleteUser(user.uid)} className="mt-4 text-xs flex items-center gap-1 text-red-500 hover:text-red-400">
                    <Trash2 size={12} /> Xóa người dùng này
                  </button>
                </div>

                {/* Tùy chỉnh thủ công từng App */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4">🔧 Tùy Chỉnh Từng App (Ghi đè)</h4>
                  <div className="space-y-3">
                    {apps.map(app => {
                      const access = user.appAccess?.[app.id] || { enabled: false, startDate: new Date().toISOString().split('T')[0], durationDays: 30 };
                      const dynamicDays = user.daysRemainingMap[app.id];
                      return (
                        <div key={app.id} className={`flex items-center gap-3 bg-slate-900 border ${access.enabled ? 'border-slate-700' : 'border-slate-800'} rounded-xl p-3`}>
                          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input type="checkbox" className="sr-only peer" checked={access.enabled} 
                              onChange={(e) => onManualOverride(user.uid, app.id, e.target.checked, access.startDate, access.durationDays)} />
                            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                          
                          <div className="w-32 flex-shrink-0">
                            <p className={`text-sm truncate ${access.enabled ? 'text-white' : 'text-slate-500'}`}>{app.name}</p>
                          </div>

                          {access.enabled ? (
                            <div className="flex flex-1 items-center gap-2">
                              <input type="date" value={access.startDate} 
                                onChange={e => onManualOverride(user.uid, app.id, true, e.target.value, access.durationDays)}
                                className="w-28 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white [color-scheme:dark]" />
                              <span className="text-slate-500 text-xs">+</span>
                              <input type="number" value={access.durationDays} 
                                onChange={e => onManualOverride(user.uid, app.id, true, access.startDate, Number(e.target.value))}
                                className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                              <span className="text-slate-500 text-xs">ngày</span>
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center gap-2">
                              <span className="text-slate-600 text-xs italic">Không ghi đè</span>
                              {dynamicDays > 0 && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                                  Còn {dynamicDays} ngày (Dùng thử/Mặc định/Gói)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
});

UserRow.displayName = 'UserRow';

// ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────────
export const AdminUsersTab = () => {
  const { plans, apps, siteConfig } = useAppContext();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<TabType>('expiring');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [planStartDate, setPlanStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [savingUser, setSavingUser] = useState<string | null>(null);

  // Phân trang hiển thị phía Client để giữ DOM cực nhẹ và cuộn 60 FPS
  const [visibleCount, setVisibleCount] = useState(30);

  // ─── TẢI DỮ LIỆU MỘT LẦN (NON-REALTIME) ĐỂ TRÁNH QUÁ TẢI ────────────────────────
  const fetchUsersData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const loaded = snap.docs.map(d => d.data() as UserProfile);
      
      setUsers(loaded);
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách từ Firestore:", err);
      setError(err.message || "Không thể kết nối đến Firestore. Vui lòng kiểm tra Security Rules hoặc kết nối mạng.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const handleRefresh = () => {
    fetchUsersData(true);
  };

  const exportToCSV = () => {
    try {
      // Headers in Vietnamese
      const headers = ["Email", "Tên hiển thị", "UID", "Trạng thái", "Gói hiện tại", "Số App đã cấp", "Số ngày còn lại thấp nhất", "Ngày đăng ký"];
      
      // Rows
      const rows = enrichedUsers.map(u => {
        const createdDate = parseCreatedDate(u.createdAt);
        const formattedDate = createdDate.toLocaleDateString('vi-VN') + ' ' + createdDate.toLocaleTimeString('vi-VN');
        
        let statusText = 'Chờ duyệt';
        if (u.enrichedStatus === 'active') statusText = 'Hoạt động';
        else if (u.enrichedStatus === 'expiring') statusText = 'Sắp hết hạn';
        else if (u.enrichedStatus === 'expired') statusText = 'Hết hạn';
        
        return [
          u.email || '',
          u.displayName || 'Người dùng mới',
          u.uid || '',
          statusText,
          (u as any).assignedPlan || 'Tùy chỉnh',
          u.enrichedActiveAppsCount,
          u.enrichedLowestDays === 9999 ? 'Trọn đời (Admin)' : (u.enrichedLowestDays !== null ? `${u.enrichedLowestDays} ngày` : '0 ngày'),
          formattedDate
        ];
      });
      
      // Add UTF-8 BOM so Vietnamese characters display properly in Excel / Sheets
      const csvContent = "\uFEFF" + [
        headers.join(","),
        ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `VKT_USERS_EXPORT_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Lỗi khi xuất file CSV:", err);
      alert("Có lỗi xảy ra khi xuất dữ liệu!");
    }
  };

  // Reset phân trang hiển thị khi đổi Tab hoặc tìm kiếm
  useEffect(() => {
    setVisibleCount(30);
  }, [activeTab, searchQuery]);

  // ─── HELPERS TÍNH TOÁN NGÀY THÁNG AN TOÀN ───────────────────────────────────────
  const parseCreatedDate = useCallback((createdAt: any): Date => {
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
  }, []);

  const getDynamicRemainingDays = useCallback((userCreatedDate: Date, durationDays: number): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiry = new Date(userCreatedDate.getTime());
    expiry.setDate(expiry.getDate() + durationDays);
    expiry.setHours(0, 0, 0, 0);
    
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, []);

  const getDynamicDaysRemaining = useCallback((u: UserProfile, appId: string): number => {
    if (u.email && (u.email.toLowerCase() === siteConfig?.adminEmail?.toLowerCase() || u.email.toLowerCase() === 'tien048348@gmail.com')) {
      return 9999;
    }

    let maxDays = -1;

    const manualEntry = u.appAccess?.[appId];
    if (manualEntry) {
      if (manualEntry.enabled) {
        const days = calcDaysRemaining(manualEntry.expiryDate);
        if (days > maxDays) maxDays = days;
      } else {
        return -1;
      }
    }

    const activePlan = (u as any).activePlan;
    if (activePlan) {
      const planDays = calcDaysRemaining(activePlan.expiryDate);
      if (planDays > 0) {
        const isAllApps = !activePlan.appIds || activePlan.appIds.length === 0;
        if (isAllApps || activePlan.appIds.includes(appId)) {
          if (planDays > maxDays) maxDays = planDays;
        }
      }
    }

    if (siteConfig?.defaultAccessEnabled) {
      const isTarget = !siteConfig.defaultAccessAppIds || 
                       siteConfig.defaultAccessAppIds.length === 0 || 
                       siteConfig.defaultAccessAppIds.includes(appId);
      if (isTarget) {
        const userCreated = parseCreatedDate(u.createdAt);
        const daysLeft = getDynamicRemainingDays(userCreated, siteConfig.defaultAccessDays || 30);
        if (daysLeft > 0 && daysLeft > maxDays) {
          maxDays = daysLeft;
        }
      }
    }

    if (siteConfig?.trialEnabled) {
      const isTarget = !siteConfig.trialAppIds || 
                       siteConfig.trialAppIds.length === 0 || 
                       siteConfig.trialAppIds.includes(appId);
      if (isTarget) {
        const userCreated = parseCreatedDate(u.createdAt);
        const daysLeft = getDynamicRemainingDays(userCreated, siteConfig.trialDays || 3);
        if (daysLeft > 0 && daysLeft > maxDays) {
          maxDays = daysLeft;
        }
      }
    }

    return maxDays;
  }, [siteConfig, parseCreatedDate, getDynamicRemainingDays]);

  // ─── TỐI ƯU HÓA TÍNH TOÁN NẶNG BẰNG USEMEMO (ENRICHMENT PATTERN) ──────────────────
  const enrichedUsers = useMemo(() => {
    return users.map(u => {
      // 1. Tính số ngày còn lại của từng app
      const daysRemainingMap = apps.reduce((acc, app) => {
        acc[app.id] = getDynamicDaysRemaining(u, app.id);
        return acc;
      }, {} as Record<string, number>);

      // 2. Tính số ngày còn lại thấp nhất
      let lowestDays: number | null = null;
      const isAdminUser = u.email && (
        u.email.toLowerCase() === siteConfig?.adminEmail?.toLowerCase() || 
        u.email.toLowerCase() === 'tien048348@gmail.com'
      );

      if (isAdminUser) {
        lowestDays = 9999;
      } else {
        const activeAppDays = apps
          .filter(app => !app.isHidden)
          .map(app => daysRemainingMap[app.id])
          .filter(days => days > 0);
        if (activeAppDays.length > 0) {
          lowestDays = Math.min(...activeAppDays);
        }
      }

      // 3. Xác định trạng thái người dùng (status)
      let status: TabType = 'pending';
      if (isAdminUser) {
        status = 'active';
      } else {
        const activeAppsCount = apps.filter(app => !app.isHidden && daysRemainingMap[app.id] > 0).length;
        if (activeAppsCount === 0 || lowestDays === null) {
          status = 'pending';
        } else if (lowestDays <= 0) {
          status = 'expired';
        } else if (lowestDays <= 7) {
          status = 'expiring';
        } else {
          status = 'active';
        }
      }

      const activeAppsCount = apps.filter(app => !app.isHidden && daysRemainingMap[app.id] > 0).length;

      return {
        ...u,
        enrichedStatus: status,
        enrichedLowestDays: lowestDays,
        enrichedActiveAppsCount: activeAppsCount,
        daysRemainingMap
      };
    });
  }, [users, apps, siteConfig, getDynamicDaysRemaining]);

  // ─── THỐNG KÊ STATS SIÊU NHANH O(N) ─────────────────────────────────────────────
  const stats = useMemo(() => {
    const s = { all: enrichedUsers.length, active: 0, expiring: 0, expired: 0, pending: 0 };
    enrichedUsers.forEach(u => {
      if (u.enrichedStatus === 'active') s.active++;
      else if (u.enrichedStatus === 'expiring') s.expiring++;
      else if (u.enrichedStatus === 'expired') s.expired++;
      else if (u.enrichedStatus === 'pending') s.pending++;
    });
    return s;
  }, [enrichedUsers]);

  // ─── LỌC VÀ SẮP XẾP NGƯỜI DÙNG SIÊU MƯỢT ────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    const queryStr = searchQuery.toLowerCase().trim();
    return enrichedUsers
      .filter(u => {
        const searchMatch = !queryStr || 
          (u.email || '').toLowerCase().includes(queryStr) || 
          (u.displayName && u.displayName.toLowerCase().includes(queryStr));
        if (!searchMatch) return false;
        if (activeTab === 'all') return true;
        return u.enrichedStatus === activeTab;
      })
      .sort((a, b) => {
        if (activeTab === 'expiring') {
          const daysA = a.enrichedLowestDays ?? 9999;
          const daysB = b.enrichedLowestDays ?? 9999;
          return daysA - daysB;
        }
        return 0; // Giữ nguyên thứ tự createdAt
      });
  }, [enrichedUsers, searchQuery, activeTab]);

  // Giới hạn hiển thị thực tế (Pagination phía Client)
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(0, visibleCount);
  }, [filteredUsers, visibleCount]);

  const hasMoreToLoad = filteredUsers.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 30);
  };

  // ─── ACTIONS (CẬP NHẬT TRỰC TIẾP LOCAL STATE TRÁNH RE-FETCH LÃNG PHÍ) ────────────
  const handleApplyPlan = useCallback(async (userId: string) => {
    if (!selectedPlanId) return alert('Vui lòng chọn gói');
    
    const targetUser = users.find(u => u.uid === userId);
    if (!targetUser) return;

    const plan = plans.find(p => p.id === selectedPlanId);
    if (!plan) return;

    // Sao lưu dữ liệu cũ để phục vụ rollback khi xảy ra lỗi mạng
    const originalAppAccess = targetUser.appAccess ? { ...targetUser.appAccess } : {};
    const originalAssignedPlan = (targetUser as any).assignedPlan || null;
    const originalActivePlan = (targetUser as any).activePlan || null;

    const expiryDate = calcExpiryDate(planStartDate, plan.durationDays);
    const targetApps = plan.appIds.length === 0 ? apps.map(a => a.id) : plan.appIds;

    const newAppAccess = { ...targetUser.appAccess };
    
    targetApps.forEach(appId => {
      newAppAccess[appId] = {
        enabled: true,
        startDate: planStartDate,
        durationDays: plan.durationDays,
        expiryDate: expiryDate,
      };
    });

    const updatedActivePlan = {
      planId: plan.id,
      planName: plan.name,
      startDate: planStartDate,
      durationDays: plan.durationDays,
      expiryDate: expiryDate,
      appIds: plan.appIds,
    };

    // 1. CẬP NHẬT GIAO DIỆN LẠC QUAN NGAY LẬP TỨC (0ms)
    setUsers(prev => prev.map(u => {
      if (u.uid === userId) {
        return {
          ...u,
          appAccess: newAppAccess,
          assignedPlan: plan.name,
          activePlan: updatedActivePlan
        } as UserProfile;
      }
      return u;
    }));

    // 2. Thu nhỏ chi tiết người dùng lập tức để tạo phản hồi tức thì
    setExpandedUserId(null);

    // Kích hoạt trạng thái saving ngầm để bảo vệ (tránh click đúp)
    setSavingUser(userId);

    try {
      // 3. Ghi dữ liệu ngầm lên Firestore
      await setDoc(doc(db, 'users', userId), {
        appAccess: newAppAccess,
        assignedPlan: plan.name,
        activePlan: updatedActivePlan
      }, { merge: true });
      
    } catch (e: any) {
      console.error("Lỗi khi đồng bộ Firestore (Apply Plan):", e);
      
      // 4. ROLLBACK trạng thái cũ nếu ghi Firestore thất bại
      setUsers(prev => prev.map(u => {
        if (u.uid === userId) {
          return {
            ...u,
            appAccess: originalAppAccess,
            assignedPlan: originalAssignedPlan,
            activePlan: originalActivePlan
          } as UserProfile;
        }
        return u;
      }));
      
      // Mở lại khung chi tiết để người dùng kiểm tra và thử lại
      setExpandedUserId(userId);
      alert(`Không thể đồng bộ gói lên Firestore: ${e.message || 'Lỗi mạng hoặc phân quyền'}. Giao diện đã được khôi phục.`);
    } finally {
      setSavingUser(null);
    }
  }, [selectedPlanId, planStartDate, plans, apps, users]);

  const handleManualOverride = useCallback(async (userId: string, appId: string, enabled: boolean, startDate: string, durationDays: number) => {
    const targetUser = users.find(u => u.uid === userId);
    if (!targetUser) return;

    // Sao lưu trạng thái appAccess cũ để phục vụ rollback khi có lỗi mạng
    const originalAppAccess = targetUser.appAccess ? { ...targetUser.appAccess } : {};

    const expiryDate = calcExpiryDate(startDate, durationDays);
    const newAppAccess = { ...targetUser.appAccess };
    newAppAccess[appId] = { enabled, startDate, durationDays, expiryDate };

    // 1. CẬP NHẬT GIAO DIỆN LẠC QUAN NGAY LẬP TỨC (0ms)
    // Switch đổi màu tức thì ngay trước mắt Admin
    setUsers(prev => prev.map(u => {
      if (u.uid === userId) {
        return {
          ...u,
          appAccess: newAppAccess
        } as UserProfile;
      }
      return u;
    }));

    try {
      // 2. Ghi dữ liệu ngầm lên Firestore
      await setDoc(doc(db, 'users', userId), { appAccess: newAppAccess }, { merge: true });
    } catch (e: any) {
      console.error("Lỗi khi đồng bộ Firestore (Override Switch):", e);
      
      // 3. ROLLBACK trạng thái cũ của switch nếu ghi thất bại
      setUsers(prev => prev.map(u => {
        if (u.uid === userId) {
          return {
            ...u,
            appAccess: originalAppAccess
          } as UserProfile;
        }
        return u;
      }));
      alert(`Không thể lưu tùy chỉnh lên Firestore: ${e.message || 'Lỗi mạng hoặc phân quyền'}. Trạng thái switch đã được khôi phục.`);
    }
  }, [users]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    if (confirm('Bạn có chắc muốn xóa dữ liệu người dùng này?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        // Cập nhật local state cực nhanh
        setUsers(prev => prev.filter(u => u.uid !== userId));
      } catch (e) {
        console.error(e);
        alert('Lỗi xóa dữ liệu người dùng');
      }
    }
  }, []);

  const handleToggleExpand = useCallback((userId: string | null) => {
    setExpandedUserId(userId);
  }, []);

  // ─── GIAO DIỆN CHÍNH ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span className="text-slate-400 font-medium">Đang tải danh sách người dùng...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center max-w-lg mx-auto my-8">
        <AlertTriangle className="mx-auto text-red-500 mb-3" size={40} />
        <h3 className="text-white font-semibold text-lg mb-2">Đã xảy ra sự cố tải dữ liệu</h3>
        <p className="text-red-400 text-sm mb-4 leading-relaxed">{error}</p>
        <button onClick={() => fetchUsersData()} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-center shadow-lg shadow-black/20">
          <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Tổng người dùng</span>
          <span className="text-2xl font-bold text-white mt-1">{stats.all}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-center shadow-lg shadow-black/20">
          <span className="text-emerald-500 text-xs font-medium uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12}/> Hoạt động</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1">{stats.active}</span>
        </div>
        <div className={`rounded-xl p-4 flex flex-col justify-center shadow-lg transition-all ${activeTab === 'expiring' ? 'bg-amber-500/20 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-slate-900 border border-slate-800'}`}>
          <span className="text-amber-500 text-xs font-medium uppercase tracking-wider flex items-center gap-1"><AlertTriangle size={12}/> Sắp hết hạn</span>
          <span className="text-2xl font-bold text-amber-400 mt-1">{stats.expiring}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-center shadow-lg shadow-black/20">
          <span className="text-red-500 text-xs font-medium uppercase tracking-wider flex items-center gap-1"><XCircle size={12}/> Đã hết hạn</span>
          <span className="text-2xl font-bold text-red-400 mt-1">{stats.expired}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-center shadow-lg shadow-black/20">
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1"><Clock size={12}/> Chờ duyệt</span>
          <span className="text-2xl font-bold text-slate-300 mt-1">{stats.pending}</span>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-lg shadow-black/20">
        <div className="flex overflow-x-auto w-full md:w-auto hide-scrollbar gap-1 p-1">
          {(['all', 'active', 'expiring', 'expired', 'pending'] as TabType[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab ? (tab === 'expiring' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'bg-slate-800 text-white font-semibold') : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}>
              {tab === 'all' && `Tất cả (${stats.all})`}
              {tab === 'active' && `Hoạt động (${stats.active})`}
              {tab === 'expiring' && `Sắp hết hạn (${stats.expiring})`}
              {tab === 'expired' && `Hết hạn (${stats.expired})`}
              {tab === 'pending' && `Chờ duyệt (${stats.pending})`}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto px-2 pb-2 md:pb-0 md:pr-2">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Tìm email, tên..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-colors" />
          </div>
          <button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="p-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors flex-shrink-0 disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin text-indigo-400" : ""} />
          </button>
          <button 
            onClick={exportToCSV}
            className="px-3 py-2 bg-emerald-600/10 border border-emerald-500/30 hover:bg-emerald-600/20 text-emerald-400 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 flex-shrink-0"
            title="Xuất danh sách ra Excel (CSV)"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* 3. Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Người dùng</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Gói / Apps</th>
                <th className="px-6 py-4 font-medium">Gần hết hạn nhất</th>
                <th className="px-6 py-4 font-medium text-right text-right-important pr-8">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {paginatedUsers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Không tìm thấy người dùng nào</td></tr>
              ) : (
                paginatedUsers.map(user => (
                  <UserRow 
                    key={user.uid}
                    user={user}
                    apps={apps}
                    plans={plans}
                    isExpanded={expandedUserId === user.uid}
                    onToggleExpand={handleToggleExpand}
                    onApplyPlan={handleApplyPlan}
                    onManualOverride={handleManualOverride}
                    onDeleteUser={handleDeleteUser}
                    selectedPlanId={selectedPlanId}
                    setSelectedPlanId={setSelectedPlanId}
                    planStartDate={planStartDate}
                    setPlanStartDate={setPlanStartDate}
                    savingUser={savingUser}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Client-side Pagination Trigger (Load More) */}
      {hasMoreToLoad && (
        <div className="text-center pt-2">
          <button 
            onClick={handleLoadMore}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 text-sm font-medium transition-all shadow-md active:scale-95"
          >
            Xem thêm người dùng (+30)
          </button>
        </div>
      )}
    </div>
  );
};
