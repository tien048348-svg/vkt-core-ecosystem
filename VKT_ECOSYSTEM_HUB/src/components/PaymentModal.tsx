import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle, Copy, Clock, CreditCard, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { Plan } from '../data/apps';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';


interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  targetAppId?: string;
  plans: Plan[];
  initialPlanId?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  userId,
  targetAppId,
  plans,
  initialPlanId,
}) => {
  const { siteConfig } = useAppContext();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  // PayOS states
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [payOsQrCode, setPayOsQrCode] = useState<string>('');
  const [isPayOsActive, setIsPayOsActive] = useState<boolean>(false);
  
  // General payment states
  const [orderCode, setOrderCode] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'creating' | 'pending' | 'success' | 'error'>('idle');
  const [countdown, setCountdown] = useState<number>(600); // 10 minutes countdown
  const [copiedField, setCopiedField] = useState<string>('');
  
  // State for direct bank transfer order code
  const [directOrderCode, setDirectOrderCode] = useState(() => Math.floor(100000 + Math.random() * 900000));

  // Restore pending manual order if exists
  useEffect(() => {
    let active = true;
    if (isOpen && userId) {
      const checkPendingOrder = async () => {
        try {
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', userId)
          );
          const snap = await getDocs(q);
          if (!active) return;
          
          // Find any order that is 'pending_manual'
          const pendingOrder = snap.docs
            .map(d => d.data())
            .find(o => o.status === 'pending_manual');
            
          if (pendingOrder) {
            // Restore states!
            const plan = plans.find(p => p.id === pendingOrder.planId);
            if (plan) {
              setSelectedPlan(plan);
              setOrderCode(pendingOrder.orderCode);
              setDirectOrderCode(pendingOrder.orderCode); // Sync directOrderCode state
              setPaymentStatus('pending');
              setIsPayOsActive(false);
              // Calculate countdown remaining from createdAt
              const elapsedSeconds = Math.floor((Date.now() - new Date(pendingOrder.createdAt).getTime()) / 1000);
              const remaining = Math.max(0, 600 - elapsedSeconds);
              setCountdown(remaining);
            }
          }
        } catch (err) {
          console.error("Lỗi khi kiểm tra đơn hàng chờ duyệt:", err);
        }
      };
      
      checkPendingOrder();
    }
    return () => {
      active = false;
    };
  }, [isOpen, userId, plans]);


  // Filter plans based on targetAppId
  const availablePlans = plans.filter(p => {
    if (!p.isActive) return false;
    if ((p.price || 0) <= 0) return false; // Fee-based plans only
    if (!targetAppId) return true;
    return !p.appIds || p.appIds.length === 0 || p.appIds.includes(targetAppId);
  });

  // Automatically select the initial or first available plan
  useEffect(() => {
    if (isOpen) {
      if (initialPlanId) {
        const found = plans.find(p => p.id === initialPlanId);
        if (found) {
          setSelectedPlan(found);
          return;
        }
      }
      if (availablePlans.length > 0) {
        setSelectedPlan(availablePlans[0]);
      }
    }
  }, [isOpen, initialPlanId, availablePlans, plans]);

  // Countdown timer for pending transactions
  useEffect(() => {
    let timer: any;
    if (paymentStatus === 'pending' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && paymentStatus === 'pending') {
      setPaymentStatus('error');
    }
    return () => clearInterval(timer);
  }, [paymentStatus, countdown]);

  // REAL-TIME LISTENER FOR ORDER UPDATES IN FIRESTORE
  useEffect(() => {
    if (!orderCode || paymentStatus !== 'pending') return;

    // Listen to orders/{orderCode} document
    const unsub = onSnapshot(doc(db, 'orders', orderCode.toString()), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.status === 'success') {
          setPaymentStatus('success');
          // Automatically close modal after 3.5 seconds
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 3500);
        }
      }
    });

    return () => unsub();
  }, [orderCode, paymentStatus, onClose]);

  if (!isOpen) return null;

  // Generate PayOS payment link
  const handlePayOsPayment = async () => {
    if (!selectedPlan) return;
    setPaymentStatus('creating');
    setCountdown(600);
    setIsPayOsActive(true);

    try {
      const planStartDate = new Date().toISOString().split('T')[0];
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId: selectedPlan.id,
          planStartDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi tạo mã thanh toán PayOS');
      }

      setPaymentUrl(data.paymentUrl);
      setPayOsQrCode(data.qrCode);
      setOrderCode(data.orderCode);
      setPaymentStatus('pending');
    } catch (err: any) {
      console.error(err);
      setPaymentStatus('error');
    }
  };

  // Direct manual VietQR bank transfer confirmation
  const handleConfirmDirectTransfer = async () => {
    if (!selectedPlan) return;
    setPaymentStatus('pending');
    setCountdown(600);
    setOrderCode(directOrderCode);
    setIsPayOsActive(false);

    try {
      const planStartDate = new Date().toISOString().split('T')[0];
      // Create manual order on Firestore
      await setDoc(doc(db, 'orders', directOrderCode.toString()), {
        orderCode: directOrderCode,
        userId: userId,
        userEmail: user?.email || '',
        userDisplayName: user?.displayName || '',
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        planDurationDays: selectedPlan.durationDays,
        planAppIds: selectedPlan.appIds || [],
        price: selectedPlan.price,
        startDate: planStartDate,
        status: 'pending_manual', // manual review status
        createdAt: new Date().toISOString(),
        completedAt: null
      });
    } catch (e) {
      console.error('Lỗi khi ghi nhận chuyển khoản:', e);
    }
  };

  const handleCancelPendingOrder = async () => {
    if (!orderCode) return;
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy yêu cầu thanh toán này và quay lại chọn gói khác không?"
    );
    if (!confirmCancel) return;

    try {
      if (!isPayOsActive) {
        // Cập nhật trạng thái thành 'cancelled' trên Firestore để Admin thấy đồng bộ
        await setDoc(doc(db, 'orders', orderCode.toString()), {
          status: 'cancelled',
          completedAt: new Date().toISOString()
        }, { merge: true });
      }

      // Reset toàn bộ state
      setPaymentStatus('idle');
      setOrderCode(null);
      setDirectOrderCode(Math.floor(100000 + Math.random() * 900000));
      setIsPayOsActive(false);
      setPaymentUrl('');
      setPayOsQrCode('');
    } catch (e) {
      console.error("Lỗi khi hủy đơn hàng:", e);
      // Reset state local làm phương án dự phòng
      setPaymentStatus('idle');
      setOrderCode(null);
    }
  };

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Convert plain non-accented string for bank description
  const getCleanPlanDescription = (planName: string) => {
    return planName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .substring(0, 15)
      .toUpperCase();
  };

  // Bank transfer info
  const bankId = siteConfig?.bankId || 'MB';
  const bankAccount = siteConfig?.bankAccount || '0559793678';
  const bankName = siteConfig?.bankName || 'VU KHAC TIEN';
  const transferAmount = selectedPlan?.price || 0;
  const cleanPlanName = selectedPlan ? getCleanPlanDescription(selectedPlan.name) : '';
  const transferContent = `VKT ${directOrderCode} ${cleanPlanName}`.replace(/\s+/g, ' ').trim().substring(0, 25).toUpperCase();


  // Instant VietQR static generator URL
  const instantQrUrl = selectedPlan
    ? `https://img.vietqr.io/image/${bankId}-${bankAccount}-compact2.png?amount=${transferAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankName)}`
    : '';

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <CreditCard className="text-indigo-400" size={18} />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Gia Hạn & Nâng Cấp Quyền Hạn</h3>
              <p className="text-slate-500 text-xs">Mở khóa tính năng tức thì qua VietQR</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {paymentStatus === 'idle' || paymentStatus === 'creating' ? (
            <div className="space-y-5">
              
              {/* Chọn gói */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Chọn gói dịch vụ</label>
                {availablePlans.length === 0 ? (
                  <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl text-center text-slate-500 text-sm">
                    Hiện chưa có cấu hình gói dịch vụ nào cho app này. Vui lòng liên hệ Admin.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availablePlans.map(plan => (
                      <div 
                        key={plan.id} 
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedPlan?.id === plan.id 
                            ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                            : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white flex items-center gap-1.5">
                            {plan.type === 'bundle' && <Sparkles size={13} className="text-amber-400" />}
                            {plan.name}
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>
                          <p className="text-[10px] text-slate-500 font-medium">Hạn sử dụng: {plan.durationDays} ngày</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-indigo-400">
                            {(plan.price || 0).toLocaleString('vi-VN')} {plan.currency}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedPlan && (
                <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
                  <div className="text-center pb-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold">
                      📸 QUÉT MÃ QR THANH TOÁN NGAY
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* QR Code hiển thị trực tiếp */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-700 shadow-xl flex-shrink-0">
                      <img src={instantQrUrl} alt="VietQR" className="w-40 h-40 object-contain" />
                    </div>

                    {/* Chi tiết tài khoản ngân hàng */}
                    <div className="flex-1 w-full space-y-2.5 text-sm">
                      <div className="flex justify-between border-b border-slate-800 pb-1.5">
                        <span className="text-slate-500 text-xs">Ngân hàng:</span>
                        <span className="text-white font-bold text-xs flex items-center gap-1">
                          {bankId}
                        </span>
                      </div>
                      
                      <div className="flex justify-between border-b border-slate-800 pb-1.5">
                        <span className="text-slate-500 text-xs">Chủ tài khoản:</span>
                        <span className="text-white font-bold text-xs uppercase">{bankName}</span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800 pb-1.5 items-center">
                        <span className="text-slate-500 text-xs">Số tài khoản:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-mono font-bold text-xs">{bankAccount}</span>
                          <button onClick={() => handleCopyText(bankAccount, 'bankAccount')} className="text-slate-400 hover:text-white p-0.5" title="Copy">
                            {copiedField === 'bankAccount' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between border-b border-slate-800 pb-1.5 items-center">
                        <span className="text-slate-500 text-xs">Số tiền:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-extrabold text-xs">{transferAmount.toLocaleString('vi-VN')} VND</span>
                          <button onClick={() => handleCopyText(transferAmount.toString(), 'amount')} className="text-slate-400 hover:text-white p-0.5" title="Copy">
                            {copiedField === 'amount' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between border-b border-slate-800 pb-1.5 items-center">
                        <span className="text-slate-500 text-xs">Nội dung chuyển:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-400 font-mono font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{transferContent}</span>
                          <button onClick={() => handleCopyText(transferContent, 'content')} className="text-slate-400 hover:text-white p-0.5" title="Copy">
                            {copiedField === 'content' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 text-center leading-normal">
                    ⚠️ Quan trọng: Vui lòng nhập đúng **chính xác 100% nội dung chuyển khoản** ở trên để hệ thống ghi nhận.
                  </p>

                  <button
                    onClick={handleConfirmDirectTransfer}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-100 flex justify-center items-center gap-2"
                  >
                    <span>Tôi Đã Chuyển Tiền Thành Công ✅</span>
                  </button>
                </div>
              )}

              {/* PayOS Optional Switcher */}
              {selectedPlan && (
                <div className="text-center pt-2">
                  <button 
                    onClick={handlePayOsPayment}
                    disabled={paymentStatus === 'creating'}
                    className="text-xs text-slate-500 hover:text-indigo-400 underline transition-colors"
                  >
                    {paymentStatus === 'creating' ? 'Đang tạo liên kết...' : 'Hoặc thanh toán tự động qua Cổng PayOS (Thẻ ATM/QR Pay)'}
                  </button>
                </div>
              )}

            </div>
          ) : paymentStatus === 'pending' ? (
            <div className="flex flex-col items-center text-center space-y-5">
              <div className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mã đơn hàng</span>
                  <p className="text-white font-extrabold text-sm mt-0.5">VKT_{orderCode}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Số tiền</span>
                  <p className="text-emerald-400 font-black text-base mt-0.5">
                    {(selectedPlan?.price || 0).toLocaleString('vi-VN')} VND
                  </p>
                </div>
              </div>

              {/* QR Code hiển thị */}
              <div className="bg-white p-4 rounded-2xl border border-slate-700 shadow-xl relative inline-block animate-in zoom-in-95 duration-300">
                <img src={isPayOsActive ? payOsQrCode : instantQrUrl} alt="VietQR Pay" className="w-48 h-48 object-contain" />
              </div>

              <div className="space-y-1.5 max-w-sm">
                <div className="flex items-center justify-center gap-1.5 text-amber-500 font-bold text-xs">
                  <Clock size={14} className="animate-pulse" />
                  <span>Chờ xác nhận: {formatCountdown(countdown)}</span>
                </div>
                
                {isPayOsActive ? (
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Vui lòng mở ứng dụng ngân hàng và **quét mã QR** để chuyển khoản tự động qua cổng PayOS. Hệ thống sẽ tự động duyệt ngay khi hoàn thành.
                  </p>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left space-y-1">
                    <p className="text-xs text-indigo-400 font-bold flex items-center gap-1">
                      <AlertTriangle size={12} className="text-amber-500" />
                      Ghi nhận giao dịch thành công!
                    </p>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Yêu cầu kích hoạt thủ công của bạn đã được gửi lên hệ thống. Vui lòng liên hệ Hotline Zalo **{siteConfig?.hotline || '055 979 3678'}** để được duyệt kích hoạt tức thì.
                    </p>
                  </div>
                )}
              </div>

              {isPayOsActive && paymentUrl && (
                <div className="w-full border-t border-slate-800/80 my-2 pt-4 flex flex-col gap-2">
                  <div className="text-xs flex items-center justify-between text-slate-400">
                    <span>Hoặc thanh toán qua liên kết:</span>
                    <button 
                      onClick={() => handleCopyText(paymentUrl, 'payUrl')}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] font-medium"
                    >
                      {copiedField === 'payUrl' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      <span>{copiedField === 'payUrl' ? 'Đã sao chép' : 'Sao chép liên kết'}</span>
                    </button>
                  </div>
                  <a 
                    href={paymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors block text-center"
                  >
                    Mở trang thanh toán PayOS
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl w-full justify-center">
                <Loader2 size={12} className="animate-spin text-indigo-400 flex-shrink-0" />
                <span className="text-[10px] text-indigo-300 font-medium animate-pulse">
                  {isPayOsActive ? 'Đang chờ cổng thanh toán xác nhận giao dịch...' : 'Hệ thống đang chờ Admin duyệt lệnh kích hoạt của bạn...'}
                </span>
              </div>

              <button
                onClick={handleCancelPendingOrder}
                className="w-full py-2.5 bg-slate-850 hover:bg-red-500/10 text-slate-400 hover:text-red-400 font-semibold text-xs rounded-xl border border-slate-800 hover:border-red-500/20 transition-all mt-1 flex items-center justify-center gap-1.5"
              >
                <span>Hủy Yêu Cầu & Chọn Gói Khác ❌</span>
              </button>
            </div>
          ) : paymentStatus === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="text-emerald-400" size={36} />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-extrabold text-lg">Thanh Toán Thành Công!</h4>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Tuyệt vời! Gói dịch vụ **{selectedPlan?.name}** đã được kích hoạt thành công trên tài khoản của bạn.
                </p>
              </div>
              <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                Ứng dụng đã được mở khóa!
              </div>
              <p className="text-[10px] text-slate-500">Trình duyệt sẽ tự động cập nhật lại sau giây lát...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="text-red-400" size={36} />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-extrabold text-base">Thanh toán thất bại hoặc quá hạn</h4>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Đã xảy ra sự cố trong quá trình khởi tạo hoặc chờ thanh toán ngân hàng. Vui lòng thử lại.
                </p>
              </div>
              <button 
                onClick={() => setPaymentStatus('idle')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                Quay lại thử lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
