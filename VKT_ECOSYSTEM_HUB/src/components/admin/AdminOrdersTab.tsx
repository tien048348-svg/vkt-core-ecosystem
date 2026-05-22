import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Copy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  QrCode, 
  DollarSign,
  AlertCircle,
  Download
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { calcExpiryDate } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

type OrderStatus = 'pending_manual' | 'success' | 'cancelled' | 'all';

interface OrderDocument {
  orderCode: number;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  planId: string;
  planName: string;
  planDurationDays: number;
  planAppIds: string[];
  price: number;
  startDate: string;
  status: 'pending_manual' | 'success' | 'cancelled';
  createdAt: string;
  completedAt: string | null;
}

export const AdminOrdersTab: React.FC = () => {
  const { apps, siteConfig } = useAppContext();
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('pending_manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showQrForOrder, setShowQrForOrder] = useState<number | null>(null);

  // Sync orders in real-time
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: OrderDocument[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as OrderDocument);
      });
      setOrders(list);
      setLoading(false);
    }, (error) => {
      console.error("Lỗi khi tải đơn hàng từ Firestore:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Duyệt đơn hàng
  const handleApproveOrder = async (order: OrderDocument) => {
    if (!confirm(`Bạn có chắc chắn muốn DUYỆT & KÍCH HOẠT đơn hàng mã ${order.orderCode}?\nHành động này sẽ mở quyền truy cập ứng dụng cho khách hàng.`)) {
      return;
    }

    setActionLoading(`approve_${order.orderCode}`);
    try {
      const today = new Date().toISOString().split('T')[0];
      const expiryDate = calcExpiryDate(today, order.planDurationDays);

      // 1. Đọc data user hiện tại để gộp quyền truy cập
      const userRef = doc(db, 'users', order.userId);
      const userSnap = await getDoc(userRef);
      let existingAppAccess = {};
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        existingAppAccess = userData.appAccess || {};
      }

      // Gộp quyền mới
      const newAppAccess = { ...existingAppAccess } as any;
      const targetApps = order.planAppIds.length === 0 ? apps.map(a => a.id) : order.planAppIds;

      targetApps.forEach(appId => {
        newAppAccess[appId] = {
          enabled: true,
          startDate: today,
          durationDays: order.planDurationDays,
          expiryDate: expiryDate,
        };
      });

      const updatedActivePlan = {
        planId: order.planId,
        planName: order.planName,
        startDate: today,
        durationDays: order.planDurationDays,
        expiryDate: expiryDate,
        appIds: order.planAppIds,
      };

      // 2. Cập nhật quyền người dùng trên Firestore
      // Lưu ở document của user: dùng updateDoc để merge
      await updateDoc(userRef, {
        appAccess: newAppAccess,
        assignedPlan: order.planName,
        activePlan: updatedActivePlan
      });

      // 3. Cập nhật trạng thái đơn hàng thành success
      const orderRef = doc(db, 'orders', order.orderCode.toString());
      await updateDoc(orderRef, {
        status: 'success',
        completedAt: new Date().toISOString()
      });

      alert(`✅ Duyệt và kích hoạt thành công đơn hàng ${order.orderCode}!`);
    } catch (e: any) {
      console.error("Lỗi khi duyệt đơn hàng:", e);
      alert(`❌ Lỗi khi duyệt đơn hàng: ${e.message || 'Lỗi kết nối'}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Từ chối/hủy đơn hàng
  const handleCancelOrder = async (order: OrderDocument) => {
    if (!confirm(`Bạn có chắc chắn muốn TỪ CHỐI / HỦY đơn hàng mã ${order.orderCode}?`)) {
      return;
    }

    setActionLoading(`cancel_${order.orderCode}`);
    try {
      const orderRef = doc(db, 'orders', order.orderCode.toString());
      await updateDoc(orderRef, {
        status: 'cancelled',
        completedAt: new Date().toISOString()
      });
      alert(`❌ Đã từ chối đơn hàng ${order.orderCode}!`);
    } catch (e: any) {
      console.error("Lỗi khi hủy đơn hàng:", e);
      alert(`❌ Lỗi khi hủy đơn hàng: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Lọc danh sách đơn hàng
  const filteredOrders = useMemo(() => {
    const queryStr = searchQuery.toLowerCase().trim();
    return orders.filter(o => {
      // Lọc trạng thái
      if (statusFilter !== 'all' && o.status !== statusFilter) {
        return false;
      }
      
      // Lọc từ khóa tìm kiếm
      const matchesSearch = !queryStr || 
        (o.orderCode?.toString() || '').includes(queryStr) ||
        (o.userEmail || '').toLowerCase().includes(queryStr) ||
        (o.userDisplayName && o.userDisplayName.toLowerCase().includes(queryStr)) ||
        (o.planName || '').toLowerCase().includes(queryStr);
        
      return matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const exportToCSV = () => {
    try {
      const headers = ["Mã đơn hàng", "Email người mua", "Tên người mua", "Tên gói gia hạn", "Số ngày", "Giá tiền (VND)", "Trạng thái", "Ngày tạo đơn", "Ngày hoàn thành"];
      
      const rows = filteredOrders.map(o => {
        const createdDate = new Date(o.createdAt);
        const formattedCreatedDate = createdDate.toLocaleDateString('vi-VN') + ' ' + createdDate.toLocaleTimeString('vi-VN');
        const formattedCompletedDate = o.completedAt ? new Date(o.completedAt).toLocaleString('vi-VN') : 'Chưa duyệt';
        
        let statusText = 'Chờ duyệt';
        if (o.status === 'success') statusText = 'Thành công';
        else if (o.status === 'cancelled') statusText = 'Đã hủy';
        
        return [
          o.orderCode.toString(),
          o.userEmail || '',
          o.userDisplayName || 'Khách hàng ẩn danh',
          o.planName || '',
          o.planDurationDays,
          o.price,
          statusText,
          formattedCreatedDate,
          formattedCompletedDate
        ];
      });
      
      const csvContent = "\uFEFF" + [
        headers.join(","),
        ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `VKT_ORDERS_EXPORT_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Lỗi khi xuất file đơn hàng CSV:", err);
      alert("Có lỗi xảy ra khi xuất dữ liệu!");
    }
  };

  // Sinh QR giống với QR khách hàng đã thấy để Admin có thể xem trực tiếp hoặc quét kiểm tra
  const getQrForOrder = (order: OrderDocument) => {
    const bankId = siteConfig?.bankId || 'MB';
    const bankAccount = siteConfig?.bankAccount || '0559793678';
    const bankName = siteConfig?.bankName || 'VU KHAC TIEN';
    
    // Tên gói không dấu
    const cleanPlanName = (order.planName || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .substring(0, 15)
      .toUpperCase();
      
    const transferContent = `VKT ${order.orderCode} ${cleanPlanName}`.replace(/\s+/g, ' ').trim().substring(0, 25).toUpperCase();
    
    return `https://img.vietqr.io/image/${bankId}-${bankAccount}-compact2.png?amount=${order.price}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankName)}`;
  };

  const getCleanPlanDescription = (planName: string, orderCode: number) => {
    const cleanPlanName = (planName || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .substring(0, 15)
      .toUpperCase();
    return `VKT ${orderCode} ${cleanPlanName}`.replace(/\s+/g, ' ').trim().substring(0, 25).toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <p className="text-slate-400 text-sm">Đang tải danh sách đơn hàng chuyển khoản từ Firestore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Status Filter Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 w-full md:w-auto overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setStatusFilter('pending_manual')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${statusFilter === 'pending_manual' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Clock size={14} /> Chờ duyệt
            {orders.filter(o => o.status === 'pending_manual').length > 0 && (
              <span className="ml-1 bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full font-bold text-[10px] animate-pulse">
                {orders.filter(o => o.status === 'pending_manual').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setStatusFilter('success')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${statusFilter === 'success' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <CheckCircle2 size={14} /> Thành công
          </button>
          <button 
            onClick={() => setStatusFilter('cancelled')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${statusFilter === 'cancelled' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <XCircle size={14} /> Đã hủy
          </button>
          <button 
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Tất cả
          </button>
        </div>

        {/* Search Bar & Export */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Tìm theo Mã đơn, Email, Gói..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
          </div>
          <button 
            onClick={exportToCSV}
            className="px-3 py-2 bg-emerald-600/10 border border-emerald-500/30 hover:bg-emerald-600/20 text-emerald-400 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 flex-shrink-0"
            title="Xuất lịch sử đơn hàng ra Excel (CSV)"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Orders Grid / List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <AlertCircle className="text-slate-500 mx-auto mb-3" size={32} />
            <p className="text-slate-400 text-sm">Không tìm thấy đơn hàng nào khớp với bộ lọc.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.orderCode} 
              className={`bg-slate-900 border transition-all duration-200 rounded-2xl overflow-hidden ${
                order.status === 'pending_manual' ? 'border-amber-500/20 hover:border-amber-500/40 shadow-sm' : 'border-slate-800'
              }`}
            >
              <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                
                {/* Order Meta & Buyer */}
                <div className="space-y-3 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-slate-950 border border-slate-850 rounded-xl text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <CreditCard size={12} className="text-indigo-400" />
                      Mã: {order.orderCode}
                      <button 
                        onClick={() => handleCopyText(order.orderCode.toString(), `code_${order.orderCode}`)}
                        className="text-slate-500 hover:text-white p-0.5"
                        title="Copy mã đơn hàng"
                      >
                        {copiedCode === `code_${order.orderCode}` ? (
                          <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                        ) : (
                          <Copy size={10} />
                        )}
                      </button>
                    </span>

                    {/* Status Badge */}
                    {order.status === 'pending_manual' && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                        <Clock size={10} /> Chờ duyệt chuyển khoản
                      </span>
                    )}
                    {order.status === 'success' && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={10} /> Thành công
                      </span>
                    )}
                    {order.status === 'cancelled' && (
                      <span className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <XCircle size={10} /> Đã hủy
                      </span>
                    )}

                    <span className="text-[10px] text-slate-500 ml-auto sm:ml-0">
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  {/* Buyer Profile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Người mua hàng</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-xs flex-shrink-0">
                          {order.userDisplayName ? order.userDisplayName[0].toUpperCase() : 'U'}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                            <User size={11} className="text-slate-400" />
                            {order.userDisplayName || 'Khách hàng ẩn danh'}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate flex items-center gap-1.5">
                            <Mail size={11} className="text-slate-400" />
                            {order.userEmail}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-800 md:pl-4 pt-3 md:pt-0">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Gói gia hạn</p>
                      <div>
                        <p className="text-xs font-extrabold text-white flex items-center gap-1.5">
                          <DollarSign size={11} className="text-indigo-400" />
                          {order.planName}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar size={11} className="text-slate-400" />
                          Thời gian cấp: {order.planDurationDays} ngày ({order.planAppIds.length === 0 ? 'Tất cả ứng dụng' : `Chỉ định ${order.planAppIds.length} app`})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Details Badge */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Nội dung cú pháp chuẩn:</span>
                      <span className="text-amber-400 font-mono font-bold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/25 uppercase">
                        {getCleanPlanDescription(order.planName, order.orderCode)}
                      </span>
                      <button 
                        onClick={() => handleCopyText(getCleanPlanDescription(order.planName, order.orderCode), `content_${order.orderCode}`)}
                        className="text-slate-500 hover:text-white p-0.5"
                        title="Sao chép nội dung chuyển khoản"
                      >
                        {copiedCode === `content_${order.orderCode}` ? (
                          <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                        ) : (
                          <Copy size={10} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Số tiền cần khớp:</span>
                      <span className="text-emerald-400 font-extrabold font-mono text-sm bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                        {order.price.toLocaleString('vi-VN')} VND
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Actions & QR Preview */}
                <div className="flex flex-col gap-2 w-full lg:w-44 flex-shrink-0">
                  <button 
                    onClick={() => setShowQrForOrder(showQrForOrder === order.orderCode ? null : order.orderCode)}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <QrCode size={13} className="text-indigo-400" />
                    {showQrForOrder === order.orderCode ? 'Ẩn mã QR' : 'Xem mã QR'}
                  </button>

                  {order.status === 'pending_manual' && (
                    <>
                      <button 
                        onClick={() => handleApproveOrder(order)}
                        disabled={actionLoading !== null}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {actionLoading === `approve_${order.orderCode}` ? (
                          <Loader2 className="animate-spin" size={13} />
                        ) : (
                          'Duyệt & Kích Hoạt ✅'
                        )}
                      </button>
                      
                      <button 
                        onClick={() => handleCancelOrder(order)}
                        disabled={actionLoading !== null}
                        className="w-full py-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        {actionLoading === `cancel_${order.orderCode}` ? (
                          <Loader2 className="animate-spin" size={13} />
                        ) : (
                          'Từ Chối Lệnh ❌'
                        )}
                      </button>
                    </>
                  )}

                  {order.completedAt && (
                    <div className="text-[10px] text-slate-500 text-center mt-1">
                      <span className="block font-medium">Hoàn thành lúc:</span>
                      {new Date(order.completedAt).toLocaleString('vi-VN')}
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible QR Preview */}
              {showQrForOrder === order.orderCode && (
                <div className="bg-slate-950/80 border-t border-slate-850 p-6 flex flex-col items-center gap-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="bg-white p-3 rounded-2xl shadow-2xl border border-slate-700">
                    <img 
                      src={getQrForOrder(order)} 
                      alt="VietQR code matching exact price" 
                      className="w-44 h-44 object-contain" 
                    />
                  </div>
                  <div className="text-center space-y-1 max-w-sm">
                    <p className="text-xs text-white font-bold">Mã QR đối chứng chuyển khoản</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Đây là hình ảnh chuẩn xác 100% người dùng đã quét trên thiết bị của họ. Bạn có thể tự quét hoặc đối soát số dư trong tài khoản ngân hàng của bạn.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
