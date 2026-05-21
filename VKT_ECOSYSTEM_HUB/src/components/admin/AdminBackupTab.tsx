import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  Download, 
  Upload, 
  AlertTriangle, 
  Database, 
  CheckCircle, 
  ShieldAlert, 
  Loader2, 
  RefreshCw, 
  FileJson,
  Info
} from 'lucide-react';

interface BackupData {
  version: string;
  timestamp: string;
  settings: any;
  apps: any[];
  plans: any[];
  users: any[];
  orders: any[];
}

export const AdminBackupTab: React.FC = () => {
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [exportStats, setExportStats] = useState<{
    users: number;
    orders: number;
    plans: number;
    apps: number;
  } | null>(null);

  // Import State
  const [parsedData, setParsedData] = useState<BackupData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');

  // ─── HÀM XUẤT SAO LƯU (BACKUP EXPORT) ──────────────────────────────────────────
  const handleExportBackup = async () => {
    setExportLoading(true);
    setExportStats(null);
    try {
      // 1. Tải cấu hình hệ thống
      const settingsSnap = await getDoc(doc(db, 'settings', 'main'));
      const settingsData = settingsSnap.exists() ? settingsSnap.data() : null;

      // 2. Tải danh sách Apps
      const appsSnap = await getDocs(collection(db, 'apps'));
      const appsList = appsSnap.docs.map(d => d.data());

      // 3. Tải danh sách Plans
      const plansSnap = await getDocs(collection(db, 'plans'));
      const plansList = plansSnap.docs.map(d => d.data());

      // 4. Tải danh sách Users
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersList = usersSnap.docs.map(d => d.data());

      // 5. Tải danh sách Orders
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const ordersList = ordersSnap.docs.map(d => d.data());

      // 6. Gộp dữ liệu thành đối tượng Backup hoàn chỉnh
      const backupObj: BackupData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        settings: settingsData,
        apps: appsList,
        plans: plansList,
        users: usersList,
        orders: ordersList
      };

      // 7. Tạo tệp JSON để tải xuống
      const jsonString = JSON.stringify(backupObj, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      // Đặt tên tệp theo ngày giờ hiện tại
      const localDate = new Date().toISOString().split('T')[0];
      const localTime = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      
      link.setAttribute("href", url);
      link.setAttribute("download", `VKT_DATABASE_BACKUP_${localDate}_${localTime}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Lưu thống kê
      setExportStats({
        apps: appsList.length,
        plans: plansList.length,
        users: usersList.length,
        orders: ordersList.length
      });
    } catch (error: any) {
      console.error("Lỗi xuất sao lưu:", error);
      alert("Đã xảy ra sự cố khi tải dữ liệu sao lưu: " + error.message);
    } finally {
      setExportLoading(false);
    }
  };

  // ─── HÀM ĐỌC VÀ PARSE FILE SAO LƯU (PARSE BACKUP FILE) ─────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setParsedData(null);
    setRestoreSuccess(false);
    setConfirmText('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Kiểm tra định dạng cấu trúc tệp sao lưu xem có hợp lệ không
        if (!parsed.version || !parsed.timestamp || !Array.isArray(parsed.users) || !Array.isArray(parsed.orders)) {
          throw new Error("Định dạng tệp sao lưu không hợp lệ! Tệp phải được tải về từ hệ thống Admin VKT.");
        }

        setParsedData(parsed as BackupData);
      } catch (err: any) {
        console.error("Lỗi parse tệp sao lưu:", err);
        setImportError(err.message || "Tệp JSON bị lỗi cú pháp hoặc sai cấu trúc.");
      }
    };
    reader.readAsText(file);
  };

  // ─── HÀM KHÔI PHỤC DỮ LIỆU LÊN FIRESTORE (IMPORT RESTORE) ──────────────────────
  const handleRestoreDatabase = async () => {
    if (!parsedData) return;
    if (confirmText.trim().toUpperCase() !== 'KHOIPHUC') {
      alert("Vui lòng nhập đúng chữ 'KHOIPHUC' để xác nhận khôi phục!");
      return;
    }

    setImportLoading(true);
    setProgressMessage("Đang chuẩn bị dữ liệu...");
    try {
      // 1. Khôi phục Settings chính
      if (parsedData.settings) {
        setProgressMessage("Đang khôi phục cài đặt hệ thống...");
        await setDoc(doc(db, 'settings', 'main'), parsedData.settings);
      }

      // 2. Khôi phục danh sách ứng dụng (apps)
      if (parsedData.apps && parsedData.apps.length > 0) {
        setProgressMessage(`Đang khôi phục ${parsedData.apps.length} ứng dụng...`);
        for (const app of parsedData.apps) {
          if (app.id) {
            await setDoc(doc(db, 'apps', app.id), app);
          }
        }
      }

      // 3. Khôi phục danh sách gói cước (plans)
      if (parsedData.plans && parsedData.plans.length > 0) {
        setProgressMessage(`Đang khôi phục ${parsedData.plans.length} gói cước...`);
        for (const plan of parsedData.plans) {
          if (plan.id) {
            await setDoc(doc(db, 'plans', plan.id), plan);
          }
        }
      }

      // 4. Khôi phục danh sách đơn hàng (orders)
      if (parsedData.orders && parsedData.orders.length > 0) {
        let count = 0;
        for (const order of parsedData.orders) {
          if (order.orderCode) {
            count++;
            if (count % 10 === 0 || count === parsedData.orders.length) {
              setProgressMessage(`Đang khôi phục đơn hàng (${count}/${parsedData.orders.length})...`);
            }
            await setDoc(doc(db, 'orders', order.orderCode.toString()), order);
          }
        }
      }

      // 5. Khôi phục danh sách người dùng (users)
      if (parsedData.users && parsedData.users.length > 0) {
        let count = 0;
        for (const user of parsedData.users) {
          if (user.uid) {
            count++;
            if (count % 10 === 0 || count === parsedData.users.length) {
              setProgressMessage(`Đang khôi phục người dùng (${count}/${parsedData.users.length})...`);
            }
            await setDoc(doc(db, 'users', user.uid), user);
          }
        }
      }

      // Khôi phục thành công!
      setProgressMessage('');
      setRestoreSuccess(true);
      setParsedData(null);
      setConfirmText('');
      alert("🎉 KHÔI PHỤC CƠ SỞ DỮ LIỆU THÀNH CÔNG RỰC RỠ!\nTất cả người dùng, gói cước và đơn hàng đã được tái thiết lập đồng bộ.");
    } catch (error: any) {
      console.error("Lỗi khi khôi phục cơ sở dữ liệu:", error);
      alert("Đã xảy ra sự cố trong quá trình khôi phục: " + error.message + "\nHãy thử lại với tập tin sao lưu hợp lệ khác.");
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Giới thiệu tổng quan */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-5 shadow-xl shadow-black/20">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
          <Database size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Hệ Thống Sao Lưu & Khôi Phục Dữ Liệu An Toàn
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mt-1">
            Tính năng cao cấp cho phép bạn tải về toàn bộ cơ sở dữ liệu hiện có trên Cloud Firestore (Danh sách tài khoản khách hàng, Gói hạn dùng đã cấp, Lịch sử chuyển tiền, Cài đặt website) thành tệp tin lưu trữ dạng JSON. Bạn có thể khôi phục lại bất kỳ lúc nào để đưa hệ thống về trạng thái sao lưu trước đó.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* KHU VỰC SAO LƯU (BACKUP / EXPORT) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl shadow-black/20">
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-indigo-400 flex items-center gap-2">
              <Download size={16} /> 1. Tạo Bản Sao Lưu Mới (Backup)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nhấp vào nút bên dưới để đóng gói toàn bộ trạng thái dữ liệu hiện tại. Hệ thống sẽ kết nối trực tiếp đến Google Firestore, tổng hợp tất cả tài liệu thực tế và tải về một tệp tin bảo mật trên máy tính của bạn. Bạn nên thực hiện hành động này cuối mỗi ngày.
            </p>

            {exportStats && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-2.5 animate-in zoom-in-95 duration-200">
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle size={14} /> Sao lưu hoàn tất! Đã tải về tệp lưu trữ thành công.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850">
                    👥 Người dùng: <strong className="text-white font-mono">{exportStats.users}</strong>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850">
                    💳 Đơn hàng: <strong className="text-white font-mono">{exportStats.orders}</strong>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850">
                    📦 Gói dịch vụ: <strong className="text-white font-mono">{exportStats.plans}</strong>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850">
                    📱 Ứng dụng: <strong className="text-white font-mono">{exportStats.apps}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleExportBackup}
            disabled={exportLoading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {exportLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Đang kết nối Firestore & Đóng gói...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Tải Bản Sao Lưu Về Máy (.JSON)</span>
              </>
            )}
          </button>
        </div>

        {/* KHU VỰC KHÔI PHỤC (RESTORE / IMPORT) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl shadow-black/20">
          <h3 className="text-sm uppercase tracking-wider font-extrabold text-indigo-400 flex items-center gap-2">
            <Upload size={16} /> 2. Khôi Phục Dữ Liệu (Restore)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Chọn tệp tin sao lưu định dạng `.json` đã tải về trước đó từ máy tính của bạn để tải ngược dữ liệu vào hệ thống Firestore trên Cloud.
          </p>

          {/* Chọn File upload */}
          <div className="relative border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-colors text-center cursor-pointer bg-slate-950/40">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
              <FileJson size={32} className="text-slate-500" />
              <span className="text-xs text-slate-400 font-medium">Nhấn vào đây để chọn tệp sao lưu (.json)</span>
              <span className="text-[10px] text-slate-600">Hệ thống chỉ chấp nhận tệp sao lưu VKT chuẩn</span>
            </div>
          </div>

          {/* Hiển thị lỗi file */}
          {importError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-2.5 items-start">
              <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-xs font-bold text-red-400">Tập tin không tương thích</p>
                <p className="text-[11px] text-red-300 mt-0.5 leading-relaxed">{importError}</p>
              </div>
            </div>
          )}

          {/* Khôi phục thành công */}
          {restoreSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-2.5 items-start animate-in zoom-in-95 duration-200">
              <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-xs font-bold text-emerald-400">Khôi phục hoàn tất!</p>
                <p className="text-[11px] text-emerald-300 mt-0.5 leading-relaxed">
                  Cơ sở dữ liệu đám mây đã được phục hồi hoàn hảo về điểm sao lưu. Vui lòng tải lại trang (F5) để các bảng cập nhật ngay lập tức.
                </p>
              </div>
            </div>
          )}

          {/* Dữ liệu tệp hợp lệ - Hiển thị xác nhận */}
          {parsedData && (
            <div className="space-y-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex gap-2 items-start text-xs border-b border-slate-850 pb-3">
                <Info className="text-indigo-400 flex-shrink-0" size={15} />
                <div>
                  <p className="font-bold text-white">Xác nhận tập tin sao lưu</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Thời gian tạo sao lưu: {new Date(parsedData.timestamp).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Thông số tập tin khôi phục */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div>👥 Khách hàng: <strong className="text-white font-mono">{parsedData.users.length}</strong></div>
                <div>💳 Đơn hàng: <strong className="text-white font-mono">{parsedData.orders.length}</strong></div>
                <div>📦 Gói cước: <strong className="text-white font-mono">{parsedData.plans.length}</strong></div>
                <div>📱 Apps: <strong className="text-white font-mono">{parsedData.apps.length}</strong></div>
              </div>

              {/* Hộp thoại cảnh báo bảo mật */}
              <div className="bg-red-500/10 border border-red-500/25 rounded-lg p-3 space-y-2">
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert size={12} /> Cảnh báo bảo mật quan trọng
                </p>
                <p className="text-[10px] text-red-300 leading-relaxed">
                  Lưu ý: Thao tác này sẽ cập nhật, sửa đổi, bổ sung và có thể ghi đè toàn bộ bản ghi dữ liệu hiện thời trên Firestore bằng dữ liệu từ tệp này.
                </p>
              </div>

              {/* Input gõ xác nhận */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-400 font-bold">
                  Gõ từ khóa <span className="text-red-400 font-mono">KHOIPHUC</span> để xác nhận:
                </label>
                <input 
                  type="text" 
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  placeholder="KHOIPHUC"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 uppercase font-mono tracking-wider placeholder-slate-700"
                />
              </div>

              {/* Nút kích hoạt */}
              <button
                onClick={handleRestoreDatabase}
                disabled={confirmText.trim().toUpperCase() !== 'KHOIPHUC' || importLoading}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:hover:bg-red-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/10"
              >
                {importLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{progressMessage}</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    <span>Tiến Hành Khôi Phục Dữ Liệu</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
