import { useState, useEffect } from 'react';

import { useAppContext } from '../context/AppContext';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, RotateCcw, Lock, Plus, Trash2, LayoutTemplate, LayoutGrid, UploadCloud, Loader2, Package, Users, ExternalLink, CreditCard, Database, Bot } from 'lucide-react';
import type { AppConfig, AppLink, SiteConfig } from '../data/apps';
import { AdminPlansTab } from '../components/admin/AdminPlansTab';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminBackupTab } from '../components/admin/AdminBackupTab';
import { storage, db } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { formatDriveImage } from '../lib/utils';

import { useAuth } from '../context/AuthContext';
export const Admin = () => {
  const { apps, siteConfig, updateApp, addApp, deleteApp, updateSiteConfig, resetToDefault, loading } = useAppContext();
  const { user, authLoading, signInWithGoogle, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<'site' | 'apps' | 'plans' | 'users' | 'orders' | 'backup'>('orders');

  // App State
  const [selectedId, setSelectedId] = useState<string>('');
  const [formData, setFormData] = useState<AppConfig | null>(null);

  // Site State
  const [siteData, setSiteData] = useState<SiteConfig | null>(null);

  // Secrets State
  const [secretsData, setSecretsData] = useState<{
    geminiApiKey?: string;
    payosClientId?: string;
    payosApiKey?: string;
    payosChecksumKey?: string;
  }>({});

  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);


  useEffect(() => {
    if (!loading && apps.length > 0 && !selectedId) {
      setSelectedId(editId || apps[0].id);
      if (editId) setActiveTab('apps');
    }
  }, [loading, apps, editId, selectedId]);

  useEffect(() => {
    if (!formData || formData.id !== selectedId) {
      const targetApp = apps.find(a => a.id === selectedId);
      if (targetApp) {
        setFormData(targetApp);
      }
    }
  }, [selectedId, apps, formData]);

  useEffect(() => {
    if (siteConfig) {
      setSiteData(siteConfig);
    }
  }, [siteConfig]);

  useEffect(() => {
    if (user && user.email) {
      const fetchSecrets = async () => {
        try {
          const docRef = doc(db, 'settings', 'secrets');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setSecretsData(docSnap.data());
          }
        } catch (err) {
          console.error("Lỗi lấy secrets", err);
        }
      };
      fetchSecrets();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!siteData) return;
    const { name, value } = e.target;
    setSiteData({ ...siteData, [name]: value });
  };

  const handleSecretsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecretsData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isSiteConfig: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      if (isSiteConfig && siteData) {
        setSiteData({ ...siteData, [fieldName]: downloadURL });
      } else if (!isSiteConfig && formData) {
        setFormData({ ...formData, [fieldName]: downloadURL });
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Lỗi tải file! Vui lòng kiểm tra quyền (Rules) Firebase Storage của bạn: " + error.message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleLinkUpload = async (e: React.ChangeEvent<HTMLInputElement>, linkId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(`link_${linkId}`);
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      if (formData) {
        const updatedLinks = (formData.extraLinks || []).map(link => 
          link.id === linkId ? { ...link, url: downloadURL } : link
        );
        setFormData({ ...formData, extraLinks: updatedLinks });
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Lỗi tải file! Vui lòng kiểm tra quyền (Rules) Firebase Storage của bạn: " + error.message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleAddLink = () => {
    if (!formData) return;
    const newLink: AppLink = {
      id: Date.now().toString(),
      type: 'youtube',
      label: 'Nút mới',
      url: ''
    };
    setFormData({
      ...formData,
      extraLinks: [...(formData.extraLinks || []), newLink]
    });
  };

  const handleLinkChange = (id: string, field: keyof AppLink, value: string) => {
    if (!formData) return;
    const updatedLinks = (formData.extraLinks || []).map(link => 
      link.id === id ? { ...link, [field]: value } : link
    );
    setFormData({ ...formData, extraLinks: updatedLinks });
  };

  const handleRemoveLink = (id: string) => {
    if (!formData) return;
    const updatedLinks = (formData.extraLinks || []).filter(link => link.id !== id);
    setFormData({ ...formData, extraLinks: updatedLinks });
  };

  const handleSaveApp = async () => {
    if (formData) {
      try {
        await updateApp(formData);
        showSaveStatus();
      } catch (err: any) {
        console.error("Lưu App lỗi:", err);
        alert("Cập nhật thất bại!\nLỗi từ máy chủ: " + err.message + "\n\nNguyên nhân thường gặp:\n1. Firebase Database Rules của bạn đã hết hạn (mặc định 30 ngày).\n2. Bạn chưa cấp quyền 'allow write: if true;' cho bảng 'apps'.\n\nCách xử lý: Vui lòng vào Firebase Console -> Firestore Database -> Rules để kiểm tra và cập nhật lại quyền.");
      }
    }
  };

  const handleSaveSite = async () => {
    if (siteData) {
      setIsSaving(true);
      
      // Kiểm tra Gemini API Key nếu có nhập
      if (secretsData.geminiApiKey) {
        try {
          const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${secretsData.geminiApiKey}`;
          const res = await fetch(testUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'hi' }] }] })
          });
          if (!res.ok) {
            // Nếu lỗi 503 (Hệ thống bận) hoặc 429 (Hết hạn mức nhưng key đúng), ta cảnh báo nhưng vẫn cho phép lưu
            if (res.status === 503 || res.status === 429) {
              console.warn("Hệ thống Gemini đang bận hoặc hết hạn mức (Status " + res.status + "), chấp nhận bỏ qua chặn lưu vì API Key đúng định dạng.");
            } else {
              const errData = await res.json();
              alert(`Lỗi: Gemini API Key KHÔNG HỢP LỆ hoặc đã hết hạn!\nChi tiết: ${errData.error?.message || 'Không xác định'}\n\nVui lòng kiểm tra lại Key.`);
              setIsSaving(false);
              return; // Dừng lại, không lưu
            }
          }
        } catch (err) {
          alert('Lỗi mạng khi kiểm tra Gemini API Key. Vui lòng thử lại.');
          setIsSaving(false);
          return;
        }
      }

      updateSiteConfig(siteData);
      try {
        await setDoc(doc(db, 'settings', 'secrets'), secretsData, { merge: true });
        alert('Lưu cấu hình hệ thống THÀNH CÔNG!');
      } catch (err) {
        console.error("Lỗi lưu secrets:", err);
        alert('Có lỗi xảy ra khi lưu trên máy chủ!');
      }
      setIsSaving(false);
      showSaveStatus();
    }
  };

  const showSaveStatus = () => {
    setSaveStatus('Đã lưu thành công!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleAddApp = async () => {
    try {
      const newId = await addApp();
      setSelectedId(newId);
      setFormData({
        id: newId,
        name: 'Ứng dụng mới',
        description: 'Mô tả ứng dụng mới',
        url: '',
        iconName: 'Sparkles',
        color: 'from-slate-500 to-slate-700',
        isHidden: false
      });
    } catch (err: any) {
      console.error("Thêm App lỗi:", err);
      alert("Không thể tạo ứng dụng mới!\nLỗi từ máy chủ: " + err.message + "\n\n=> Vui lòng vào Firebase Console -> Firestore Database -> Rules để cập nhật quyền 'allow write: if true;'");
    }
  };

  const handleDeleteApp = async () => {
    if (!formData) return;
    if (confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN ứng dụng "${formData.name}" không? Thao tác này không thể hoàn tác!`)) {
      try {
        await deleteApp(formData.id);
        const remainingApps = apps.filter(a => a.id !== formData.id);
        if (remainingApps.length > 0) {
          setSelectedId(remainingApps[0].id);
        } else {
          setSelectedId('');
          setFormData(null);
        }
      } catch (err: any) {
        console.error("Xóa App lỗi:", err);
        alert("Không thể xóa ứng dụng!\nLỗi từ máy chủ: " + err.message + "\n\n=> Vui lòng vào Firebase Console -> Firestore Database -> Rules để cập nhật quyền 'allow write: if true;'");
      }
    }
  };

  const handleReset = () => {
    if (confirm("Hành động này sẽ khôi phục toàn bộ nội dung về mặc định. Bạn có chắc không?")) {
      resetToDefault();
    }
  };

  const handleAdminLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        alert('Đăng nhập bị hủy hoặc trình duyệt của bạn đang chặn Popup.\n=> Vui lòng không đóng cửa sổ đăng nhập sớm, hoặc thử lại trên trình duyệt khác!');
      } else {
        alert('Lỗi đăng nhập: ' + err.message + '\n\nNếu bị lỗi lặp lại, hãy kiểm tra kết nối mạng hoặc thử lại.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const isAdmin = user && siteConfig && (user.email?.toLowerCase() === siteConfig.adminEmail?.toLowerCase() || user.email?.toLowerCase() === 'tien048348@gmail.com');

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center gap-3 text-indigo-400 font-semibold">
        <Loader2 className="animate-spin" size={24} />
        <span>Đang tải hệ thống...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Trang Quản Trị Hệ Thống</h2>
          
          {user ? (
            <div className="mt-6 text-center">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm leading-relaxed">
                <p className="font-semibold mb-1">Truy cập bị từ chối!</p>
                Tài khoản <span className="font-bold text-red-300">{user.email}</span> không có quyền quản trị hệ thống.
                <p className="mt-2 text-xs text-red-300/80">Bạn vui lòng Đăng xuất và sử dụng đúng Email Admin để vào trang này.</p>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={signOut} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-medium">
                  Đăng xuất
                </button>
                <Link to="/" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-medium shadow-lg shadow-indigo-500/20">
                  Về Trang Chủ
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center">
              <p className="text-slate-400 mb-6 text-sm">Chỉ dành riêng cho quản trị viên tối cao. Vui lòng đăng nhập bằng Gmail được cấp phép.</p>
              <button
                onClick={handleAdminLogin}
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? <Loader2 className="animate-spin text-gray-600" size={20} /> : (
                  <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                )}
                {isLoggingIn ? 'Đang xác thực...' : 'Tiếp tục bằng Google'}
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-800">
            <Link to="/" className="inline-block text-sm text-slate-500 hover:text-white transition-colors">
              Về trang chủ hệ sinh thái
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-indigo-500 font-bold text-xl">Đang tải dữ liệu từ Đám mây...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 sm:p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-slate-800 pb-4 sm:pb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors flex-shrink-0">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">VKT Admin Panel</h1>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto hide-scrollbar">
             <button 
               onClick={() => setActiveTab('orders')} 
               className={`flex-1 md:flex-none justify-center px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
             >
               <CreditCard size={16} /> Đơn Chờ Duyệt
             </button>
             <button 
               onClick={() => setActiveTab('users')} 
               className={`flex-1 md:flex-none justify-center px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
             >
               <Users size={16} /> Người Dùng
             </button>
             <button 
               onClick={() => setActiveTab('plans')} 
               className={`flex-1 md:flex-none justify-center px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'plans' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
             >
               <Package size={16} /> Gói Dịch Vụ
             </button>
             <button 
               onClick={() => setActiveTab('apps')} 
               className={`flex-1 md:flex-none justify-center px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'apps' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
             >
               <LayoutGrid size={16} /> Kho Ứng Dụng
             </button>
             <button 
                onClick={() => setActiveTab('site')} 
                className={`flex-1 md:flex-none justify-center px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'site' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <LayoutTemplate size={16} /> Cài Đặt Hệ Thống
              </button>
              <button 
                onClick={() => setActiveTab('backup')} 
                className={`flex-1 md:flex-none justify-center px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'backup' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <Database size={16} /> Sao Lưu & Khôi Phục
              </button>
          </div>
        </div>

        {/* Tab 1: Site Settings */}
        {activeTab === 'site' && siteData && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Cấu Hình Hiển Thị Chuẩn SaaS</h2>
            
            <div className="space-y-8">
              {/* Header Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-indigo-400 border-b border-slate-800 pb-2">1. Đầu trang (Header & Logo)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Tên Thương Hiệu (Ví dụ: VKT.HUB)</label>
                    <input 
                      type="text" name="siteTitle" value={siteData.siteTitle || ''} onChange={handleSiteChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">✨ Slogan (Hiển thị dưới tên thương hiệu)</label>
                    <input 
                      type="text" name="slogan" value={(siteData as any).slogan || ''} onChange={handleSiteChange}
                      placeholder="VD: Khơi nguồn sáng tạo — Kiến tạo tương lai 🚀"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Đường link Logo (Hoặc Tải lên)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" name="logoUrl" value={siteData.logoUrl || ''} onChange={handleSiteChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="https://..."
                      />
                      <label className="flex-shrink-0 cursor-pointer bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 transition-colors flex items-center justify-center text-slate-300" title="Tải ảnh từ máy tính">
                        {uploadingField === 'logoUrl' ? <Loader2 className="animate-spin text-indigo-400" size={20} /> : <UploadCloud size={20} />}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logoUrl', true)} disabled={uploadingField === 'logoUrl'} />
                      </label>
                    </div>
                    {siteData.logoUrl && (
                      <div className="mt-3 rounded-full overflow-hidden w-16 h-16 border-2 border-slate-800 bg-slate-950 flex items-center justify-center shadow-lg">
                        <img src={formatDriveImage(siteData.logoUrl)} alt="Logo Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-indigo-400 border-b border-slate-800 pb-2">2. Khu Vực Chính (Hero Banner)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Tiêu đề chính (Bên Trái)</label>
                      <textarea 
                        name="heroTitle" value={siteData.heroTitle || ''} onChange={handleSiteChange} rows={2}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Câu mô tả phụ (Subtitle)</label>
                      <textarea 
                        name="heroSubtitle" value={siteData.heroSubtitle || ''} onChange={handleSiteChange} rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Ảnh Banner (Bên Phải)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" name="heroImageUrl" value={siteData.heroImageUrl || ''} onChange={handleSiteChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="https://example.com/banner.png"
                      />
                      <label className="flex-shrink-0 cursor-pointer bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 transition-colors flex items-center justify-center text-slate-300" title="Tải ảnh từ máy tính">
                        {uploadingField === 'heroImageUrl' ? <Loader2 className="animate-spin text-indigo-400" size={20} /> : <UploadCloud size={20} />}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'heroImageUrl', true)} disabled={uploadingField === 'heroImageUrl'} />
                      </label>
                    </div>
                    {siteData.heroImageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden h-32 w-full border border-slate-800 bg-slate-950">
                        <img src={formatDriveImage(siteData.heroImageUrl)} alt="Hero Preview" className="w-full h-full object-cover opacity-80" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3 Columns Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-indigo-400 border-b border-slate-800 pb-2">3. Khu Vực Điểm Nhấn (3 Cột)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-slate-300 font-medium text-sm text-center bg-slate-900 py-1 rounded">Cột Trái</h4>
                    <input type="text" name="feature1Title" placeholder="Tiêu đề (VD: Công Nghệ AI)..." value={siteData.feature1Title || ''} onChange={handleSiteChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
                    <textarea name="feature1Desc" placeholder="Mô tả chi tiết..." value={siteData.feature1Desc || ''} onChange={handleSiteChange} rows={2} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-slate-300 font-medium text-sm text-center bg-slate-900 py-1 rounded">Cột Giữa</h4>
                    <input type="text" name="feature2Title" placeholder="Tiêu đề (VD: Bảo Mật)..." value={siteData.feature2Title || ''} onChange={handleSiteChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
                    <textarea name="feature2Desc" placeholder="Mô tả chi tiết..." value={siteData.feature2Desc || ''} onChange={handleSiteChange} rows={2} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-slate-300 font-medium text-sm text-center bg-slate-900 py-1 rounded">Cột Phải</h4>
                    <input type="text" name="feature3Title" placeholder="Tiêu đề (VD: Đa Nền Tảng)..." value={siteData.feature3Title || ''} onChange={handleSiteChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
                    <textarea name="feature3Desc" placeholder="Mô tả chi tiết..." value={siteData.feature3Desc || ''} onChange={handleSiteChange} rows={2} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
              </div>

              {/* Theme Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-indigo-400 border-b border-slate-800 pb-2">4. Màu Chủ Đạo (Theme Color)</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Đồng nhất tông màu cho toàn hệ thống:</label>
                  <div className="flex flex-wrap gap-4">
                    <button type="button" onClick={() => setSiteData({...siteData, themeColor: 'gold'})} className={`px-4 py-2.5 rounded-xl flex items-center gap-2 border transition-all ${siteData.themeColor === 'gold' || !siteData.themeColor ? 'border-amber-500 bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/20' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500"></div> Vàng Hoàng Gia (Gold)
                    </button>
                    <button type="button" onClick={() => setSiteData({...siteData, themeColor: 'indigo'})} className={`px-4 py-2.5 rounded-xl flex items-center gap-2 border transition-all ${siteData.themeColor === 'indigo' ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/20' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500"></div> Mặc định (Indigo)
                    </button>
                    <button type="button" onClick={() => setSiteData({...siteData, themeColor: 'emerald'})} className={`px-4 py-2.5 rounded-xl flex items-center gap-2 border transition-all ${siteData.themeColor === 'emerald' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"></div> Tái Chế (Emerald)
                    </button>
                    <button type="button" onClick={() => setSiteData({...siteData, themeColor: 'amber'})} className={`px-4 py-2.5 rounded-xl flex items-center gap-2 border transition-all ${siteData.themeColor === 'amber' ? 'border-amber-500 bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/20' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600"></div> Phật Pháp (Amber)
                    </button>
                    <button type="button" onClick={() => setSiteData({...siteData, themeColor: 'rose'})} className={`px-4 py-2.5 rounded-xl flex items-center gap-2 border transition-all ${siteData.themeColor === 'rose' ? 'border-rose-500 bg-rose-500/20 text-rose-400 shadow-lg shadow-rose-500/20' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-rose-500"></div> Trẻ Em (Rose)
                    </button>
                    <button type="button" onClick={() => setSiteData({...siteData, themeColor: 'cyan'})} className={`px-4 py-2.5 rounded-xl flex items-center gap-2 border transition-all ${siteData.themeColor === 'cyan' ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"></div> Công Nghệ (Cyan)
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer & Liên hệ Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-indigo-400 border-b border-slate-800 pb-2">5. Thông Tin Liên Hệ & Chân Trang</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">📞 Số điện thoại (Hotline)</label>
                    <input type="text" name="hotline" placeholder="VD: 098.xxx.xxxx" value={siteData.hotline || ''} onChange={handleSiteChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">📧 Email hỗ trợ</label>
                    <input type="text" name="email" placeholder="VD: support@vkt.com" value={siteData.email || ''} onChange={handleSiteChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">📍 Địa chỉ văn phòng</label>
                    <input type="text" name="address" placeholder="VD: Hà Nội, Việt Nam" value={siteData.address || ''} onChange={handleSiteChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">🔵 Link Facebook</label>
                    <input type="text" name="facebookUrl" placeholder="https://facebook.com/..." value={siteData.facebookUrl || ''} onChange={handleSiteChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">🔴 Link YouTube</label>
                    <input type="text" name="youtubeUrl" placeholder="https://youtube.com/@..." value={siteData.youtubeUrl || ''} onChange={handleSiteChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">💬 Link Zalo OA</label>
                    <input type="text" name="zaloUrl" placeholder="https://zalo.me/..." value={siteData.zaloUrl || ''} onChange={handleSiteChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">📝 Mô tả ngắn ở Footer</label>
                  <textarea name="footerDescription" rows={2} placeholder="Mô tả sứ mệnh, giá trị thương hiệu..." value={siteData.footerDescription || ''} onChange={handleSiteChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">©️ Văn bản bản quyền (Copyright)</label>
                  <input type="text" name="footerText" value={siteData.footerText || ''} onChange={handleSiteChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">📄 Link Điều khoản sử dụng</label>
                    <input type="text" name="termsUrl" placeholder="https://..." value={(siteData as any).termsUrl || ''} onChange={handleSiteChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">🔒 Link Chính sách bảo mật</label>
                    <input type="text" name="privacyUrl" placeholder="https://..." value={(siteData as any).privacyUrl || ''} onChange={handleSiteChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-red-400 border-b border-slate-800 pb-2">6. Bảo Mật Hệ Thống</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">📧 Email nhận mật khẩu khôi phục</label>
                    <input type="email" name="adminEmail" value={siteData.adminEmail || ''} onChange={handleSiteChange}
                      placeholder="VD: support@kiemtienvu.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
                    <p className="text-[10px] text-slate-500 mt-2">Đây là email dùng để xác minh khi bạn bấm "Quên mật khẩu".</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">🔑 Mật khẩu Admin mới</label>
                    <input type="text" name="adminPassword" value={siteData.adminPassword || ''} onChange={handleSiteChange}
                      placeholder="Mặc định: vktadmin2026"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
                    <p className="text-[10px] text-slate-500 mt-2">Thay đổi mật khẩu quản trị hệ thống.</p>
                  </div>
                </div>
                <p className="text-xs text-amber-400/80 bg-amber-400/5 p-3 rounded-lg border border-amber-400/10">
                  ⚠️ Lưu ý: Sau khi thay đổi Email hoặc Mật khẩu, hãy bấm "Lưu Cấu Hình Trang" để áp dụng thay đổi.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-emerald-400 border-b border-slate-800 pb-2">7. Cài Đặt Quyền Truy Cập (Hệ thống)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Trial Settings */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium flex items-center gap-2">🎁 Chế độ Dùng Thử (Trial)</h4>
                        <p className="text-xs text-slate-500">Tự động cấp quyền cho người dùng mới</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={!!siteData.trialEnabled} onChange={e => setSiteData({...siteData, trialEnabled: e.target.checked})} />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    {siteData.trialEnabled && (
                      <>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Thời hạn dùng thử (ngày)</label>
                          <input type="number" value={siteData.trialDays || 3} onChange={e => setSiteData({...siteData, trialDays: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Ứng dụng được dùng thử</label>
                          <select 
                            value={siteData.trialAppIds?.length === 0 ? 'all' : 'custom'} 
                            onChange={e => setSiteData({...siteData, trialAppIds: e.target.value === 'all' ? [] : [apps[0]?.id]})}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm mb-2"
                          >
                            <option value="all">Tất cả ứng dụng</option>
                            <option value="custom">Chỉ ứng dụng chỉ định...</option>
                          </select>
                          {siteData.trialAppIds && siteData.trialAppIds.length > 0 && (
                            <div className="space-y-2 mt-2">
                              {apps.map(app => (
                                <label key={app.id} className="flex items-center gap-2 text-sm text-slate-300">
                                  <input type="checkbox" 
                                    checked={siteData.trialAppIds?.includes(app.id)} 
                                    onChange={(e) => {
                                      const current = siteData.trialAppIds || [];
                                      const updated = e.target.checked ? [...current, app.id] : current.filter(id => id !== app.id);
                                      setSiteData({...siteData, trialAppIds: updated});
                                    }}
                                    className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800" />
                                  {app.name}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Default Access Settings */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium flex items-center gap-2">🔓 Cấp Quyền Mặc Định</h4>
                        <p className="text-xs text-slate-500">Mở khóa nội bộ (Không cần duyệt/mua)</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={!!siteData.defaultAccessEnabled} onChange={e => setSiteData({...siteData, defaultAccessEnabled: e.target.checked})} />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    {siteData.defaultAccessEnabled && (
                      <>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Thời hạn cấp mặc định (ngày)</label>
                          <input type="number" value={siteData.defaultAccessDays || 30} onChange={e => setSiteData({...siteData, defaultAccessDays: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm" />
                          <p className="text-[10px] text-slate-500 mt-1">Nhập 9999 cho quyền vĩnh viễn.</p>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Ứng dụng được cấp mặc định</label>
                          <select 
                            value={siteData.defaultAccessAppIds?.length === 0 ? 'all' : 'custom'} 
                            onChange={e => setSiteData({...siteData, defaultAccessAppIds: e.target.value === 'all' ? [] : [apps[0]?.id]})}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm mb-2"
                          >
                            <option value="all">Tất cả ứng dụng</option>
                            <option value="custom">Chỉ ứng dụng chỉ định...</option>
                          </select>
                          {siteData.defaultAccessAppIds && siteData.defaultAccessAppIds.length > 0 && (
                            <div className="space-y-2 mt-2">
                              {apps.map(app => (
                                <label key={app.id} className="flex items-center gap-2 text-sm text-slate-300">
                                  <input type="checkbox" 
                                    checked={siteData.defaultAccessAppIds?.includes(app.id)} 
                                    onChange={(e) => {
                                      const current = siteData.defaultAccessAppIds || [];
                                      const updated = e.target.checked ? [...current, app.id] : current.filter(id => id !== app.id);
                                      setSiteData({...siteData, defaultAccessAppIds: updated});
                                    }}
                                    className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800" />
                                  {app.name}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-indigo-400 border-b border-slate-800 pb-2">8. Tài Khoản Nhận Chuyển Khoản (Quét mã VietQR)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Mã ngân hàng (VD: MB, Vietcombank, Techcombank)</label>
                    <input 
                      type="text" name="bankId" value={siteData.bankId || ''} onChange={handleSiteChange}
                      placeholder="MB"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Số tài khoản nhận tiền</label>
                    <input 
                      type="text" name="bankAccount" value={siteData.bankAccount || ''} onChange={handleSiteChange}
                      placeholder="0559793678"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Tên chủ tài khoản (Viết hoa không dấu)</label>
                    <input 
                      type="text" name="bankName" value={siteData.bankName || ''} onChange={handleSiteChange}
                      placeholder="VU KHAC TIEN"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  💡 Thông tin này dùng để tự động sinh mã QR chuyển khoản VietQR chuẩn cho người dùng khi gia hạn.
                </p>

                {/* Live QR Code Preview Card */}
                {siteData.bankId && siteData.bankAccount && siteData.bankName && (
                  <div className="mt-4 bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
                    <div className="bg-white p-3 rounded-2xl border border-slate-700 shadow-xl flex-shrink-0">
                      <img 
                        src={`https://img.vietqr.io/image/${siteData.bankId}-${siteData.bankAccount}-compact2.png?amount=50000&addInfo=VKT%20TEST&accountName=${encodeURIComponent(siteData.bankName)}`} 
                        alt="VietQR Preview" 
                        className="w-32 h-32 object-contain" 
                      />
                    </div>
                    <div className="space-y-2 text-xs text-slate-400 w-full sm:w-auto">
                      <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Bản Xem Trước Mã VietQR Tự Động
                      </h4>
                      <p className="leading-relaxed">Đây là mã QR chuyển khoản thực tế hiển thị cho người dùng khi nâng cấp (giả định thanh toán thử gói 50.000đ).</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <div><span className="text-slate-500">Ngân hàng:</span></div>
                        <div className="text-white font-semibold">{siteData.bankId}</div>
                        <div><span className="text-slate-500">Số tài khoản:</span></div>
                        <div className="text-white font-semibold font-mono">{siteData.bankAccount}</div>
                        <div><span className="text-slate-500">Chủ tài khoản:</span></div>
                        <div className="text-white font-semibold uppercase">{siteData.bankName}</div>
                      </div>
                      <p className="text-amber-450/90 font-medium">💡 Vui lòng quét thử bằng ứng dụng ngân hàng để kiểm tra tính chính xác!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Assistant Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-cyan-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Bot size={20} /> 9. Trợ Lý Ảo AI & Mã Khóa Bí Mật (API Keys)
                </h3>
                
                {/* Dành cho quản lý mã khóa bí mật */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 mb-4">
                  <p className="text-sm font-semibold text-white border-b border-slate-800 pb-2">🔑 Mã Tích Hợp (API Keys & Secrets)</p>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Gemini API Key (Dành cho AI Chatbot)</label>
                    <input 
                      type="password" name="geminiApiKey" value={secretsData.geminiApiKey || ''} onChange={handleSecretsChange}
                      placeholder="AIzaSy..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1">PayOS Client ID</label>
                    <input 
                      type="password" name="payosClientId" value={secretsData.payosClientId || ''} onChange={handleSecretsChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">PayOS API Key</label>
                    <input 
                      type="password" name="payosApiKey" value={secretsData.payosApiKey || ''} onChange={handleSecretsChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">PayOS Checksum Key</label>
                    <input 
                      type="password" name="payosChecksumKey" value={secretsData.payosChecksumKey || ''} onChange={handleSecretsChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
                    />
                  </div>
                  <p className="text-xs text-slate-500 italic mt-2">Lưu ý: Bạn không cần lưu các mã này trên Vercel nữa. Tất cả sẽ được mã hóa và chỉ quản trị viên mới có thể thấy và thay đổi.</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Chỉ thị Cốt lõi (System Prompt)</label>
                    <textarea 
                      name="aiSystemPrompt" value={siteData.aiSystemPrompt || ''} onChange={handleSiteChange} rows={4}
                      placeholder="Hướng dẫn AI cách xưng hô, thái độ, nguyên tắc trả lời chung..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-xs"
                    />
                    <p className="text-[11px] text-slate-500 mt-2">
                      💡 Mẹo: Hướng dẫn AI linh hoạt xưng hô dựa vào câu hỏi (Ví dụ: "Nếu khách xưng 'anh', hãy xưng 'em'"). AI sẽ ưu tiên tuân thủ quy tắc này.
                    </p>
                  </div>
                </div>
              </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/60">
                  <h3 className="text-lg font-medium text-indigo-400 border-b border-slate-800 pb-2">10. Cấu Hình Ticker Chạy Chữ Hệ Thống (Live Ticker)</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Nội dung thông báo hệ thống (Phân cách các câu bằng dấu gạch đứng <code className="text-indigo-400">|</code>)
                    </label>
                    <textarea 
                      name="systemTickerText" 
                      value={siteData.systemTickerText || ''} 
                      onChange={handleSiteChange}
                      placeholder="🟢 Hệ thống: Hoạt động ổn định 100% | Băng thông mạng: 3.2 Gbps | Ping phản hồi: 14ms | ⚡ Đám mây VKT: Đồng bộ thời gian thực thành công"
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      💡 Các thông điệp này sẽ hiển thị xen kẽ trên thanh chạy tin ở trang chủ. Hãy dùng ký tự <code className="text-indigo-300">|</code> để phân tách giữa các câu thông báo khác nhau.
                    </p>
                  </div>
                </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-emerald-400 text-sm font-medium">{saveStatus}</span>
                <button 
                  onClick={handleSaveSite}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-6 py-2.5 font-medium rounded-lg transition-colors shadow-lg ${isSaving ? 'bg-indigo-500/50 text-white/70 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'}`}
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {isSaving ? 'Đang kiểm tra & Lưu...' : 'Lưu Cấu Hình Hệ Thống'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Orders */}
        {activeTab === 'orders' && <AdminOrdersTab />}

        {/* Tab 3: Users */}
        {activeTab === 'users' && <AdminUsersTab />}

        {/* Tab 4: Plans */}
        {activeTab === 'plans' && <AdminPlansTab />}

        {/* Tab 6: Backup & Restore */}
        {activeTab === 'backup' && <AdminBackupTab />}

        {/* Tab 2: Apps Settings */}
        {activeTab === 'apps' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Ứng dụng</h3>
              {apps.map(app => (
                <button
                  key={app.id}
                  onClick={() => setSelectedId(app.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                    selectedId === app.id ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{app.name}</span>
                  {app.isHidden && <span className="text-[10px] px-1.5 py-0.5 bg-slate-900 rounded text-slate-500 uppercase flex-shrink-0">Đã ẩn</span>}
                </button>
              ))}
              <button
                onClick={handleAddApp}
                className="w-full text-center px-4 py-3 rounded-lg transition-colors border border-dashed border-slate-700 text-slate-400 hover:text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500/10 flex items-center justify-center gap-2 mt-2"
              >
                <Plus size={16} /> Thêm Ứng dụng
              </button>
            </div>

            {/* Form hoặc Empty State */}
            <div className="md:col-span-3">
              {formData ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
                    <h2 className="text-xl font-semibold text-white truncate flex items-center gap-2">
                      <span>{formData.name}</span>
                      {formData.url && (
                        <a href={formData.url} target="_blank" rel="noopener noreferrer" 
                          className="text-xs bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40 px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
                          title="Mở ứng dụng trong tab mới">
                          <ExternalLink size={14} /> Mở App
                        </a>
                      )}
                    </h2>
                    <label className="flex items-center gap-2 text-sm font-normal cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex-shrink-0">
                      <span className={`${formData.isHidden ? 'text-amber-500' : 'text-emerald-400'}`}>
                        {formData.isHidden ? 'Chỉ Admin Thấy (Ẩn)' : 'Công Khai (Trang chủ)'}
                      </span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="isHidden" checked={!formData.isHidden} onChange={() => setFormData({ ...formData, isHidden: !formData.isHidden })} className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Tên ứng dụng</label>
                      <input 
                        type="text" name="name" value={formData.name || ''} onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Đường link URL đích</label>
                      <input 
                        type="text" name="url" value={formData.url || ''} onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="https://kids.vkt.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Ảnh bìa (Hoặc Tải Lên)</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" name="coverImage" value={formData.coverImage || ''} onChange={handleChange}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="https://example.com/image.jpg"
                        />
                        <label className="flex-shrink-0 cursor-pointer bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 transition-colors flex items-center justify-center text-slate-300" title="Tải ảnh từ máy tính">
                          {uploadingField === 'coverImage' ? <Loader2 className="animate-spin text-indigo-400" size={20} /> : <UploadCloud size={20} />}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'coverImage', false)} disabled={uploadingField === 'coverImage'} />
                        </label>
                      </div>
                      {formData.coverImage && (
                        <div className="mt-3 rounded-lg overflow-hidden h-32 w-full max-w-sm border border-slate-800">
                          <img src={formatDriveImage(formData.coverImage)} alt="Cover Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Mô tả ngắn</label>
                      <textarea 
                        name="description" value={formData.description || ''} onChange={handleChange} rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Extra Links Section */}
                    <div className="border-t border-slate-800 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-slate-400">Các nút liên kết phụ (Tùy chọn)</label>
                        <button onClick={handleAddLink} type="button" className="flex items-center gap-1 px-3 py-1.5 text-xs bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 rounded-lg transition-colors">
                          <Plus size={14} /> Thêm Nút
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {(formData.extraLinks || []).map(link => (
                          <div key={link.id} className="flex gap-2 items-start bg-slate-950 p-3 rounded-lg border border-slate-800">
                            <select 
                              value={link.type} 
                              onChange={(e) => handleLinkChange(link.id, 'type', e.target.value)}
                              className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 outline-none"
                            >
                              <option value="youtube">YouTube</option>
                              <option value="facebook">Facebook</option>
                              <option value="tiktok">TikTok</option>
                              <option value="website">Website</option>
                              <option value="other">Khác</option>
                            </select>
                            
                            <div className="flex-1 space-y-2">
                              <input 
                                type="text" placeholder="Tên Nút (VD: Xem Hướng Dẫn)" 
                                value={link.label} onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-2 outline-none text-sm"
                              />
                              <div className="flex items-center gap-2">
                                <input 
                                  type="text" placeholder="https://..." 
                                  value={link.url} onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                                  className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-2 outline-none text-sm"
                                />
                                <label className="flex-shrink-0 cursor-pointer bg-slate-800 hover:bg-slate-700 p-2 rounded-lg border border-slate-700 transition-colors flex items-center justify-center text-slate-300" title="Tải Video/File từ máy tính">
                                  {uploadingField === `link_${link.id}` ? <Loader2 className="animate-spin text-indigo-400" size={16} /> : <UploadCloud size={16} />}
                                  <input type="file" accept="video/*,audio/*,.pdf,.zip" className="hidden" onChange={(e) => handleLinkUpload(e, link.id)} disabled={uploadingField === `link_${link.id}`} />
                                </label>
                              </div>
                            </div>
                            
                            <button onClick={() => handleRemoveLink(link.id)} type="button" className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors mt-1">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                        {(!formData.extraLinks || formData.extraLinks.length === 0) && (
                          <p className="text-xs text-slate-600 italic">Chưa có liên kết nào. Bấm "Thêm Nút" để tạo mới.</p>
                        )}
                      </div>
                    </div>

                    {/* AI Knowledge Base Section for this App */}
                    <div className="border-t border-slate-800 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-cyan-400 flex items-center gap-2">
                          <Bot size={16} /> Dữ liệu đào tạo AI riêng cho dự án này (Knowledge Base)
                        </label>
                        <button 
                          type="button" 
                          onClick={() => {
                            const templateText = `[TÊN DỰ ÁN: ${formData.name}]\n\n1. Mô tả chi tiết:\n- ...\n\n2. Tính năng chính:\n- ...\n\n3. Quy định & Chính sách:\n- ...\n\n4. Câu hỏi thường gặp (Q&A):\nQ: Giá bao nhiêu?\nA: ...\n\n(Chỉ đạo AI: Hãy từ chối khéo nếu khách hỏi thông tin không có trong file này.)`;
                            const blob = new Blob([templateText], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `AI_Template_${formData.id}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg transition-colors"
                        >
                          Tải File Mẫu
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <textarea 
                          name="aiKnowledge" 
                          value={formData.aiKnowledge || ''} 
                          onChange={handleChange} 
                          rows={6}
                          placeholder="Dán nội dung văn bản (Markdown/Text) để dạy AI hiểu sâu về dự án này..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-emerald-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-xs"
                        />
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Bạn có thể viết trực tiếp vào đây hoặc tải lên file văn bản (.txt, .md).</span>
                          <label className="flex items-center gap-2 cursor-pointer text-cyan-400 hover:text-cyan-300 transition-colors">
                            <UploadCloud size={14} /> Upload file Text/MD
                            <input 
                              type="file" 
                              accept=".txt,.md" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (formData && event.target?.result) {
                                    setFormData({ ...formData, aiKnowledge: event.target.result as string });
                                  }
                                };
                                reader.readAsText(file);
                                e.target.value = ''; // reset input
                              }} 
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <button 
                        onClick={handleDeleteApp}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors text-sm"
                      >
                        <Trash2 size={16} /> Xóa ứng dụng
                      </button>
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-400 text-sm font-medium">{saveStatus}</span>
                        <button 
                          onClick={handleSaveApp}
                          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                        >
                          <Save size={18} /> Lưu ứng dụng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-indigo-400 mb-4 border border-slate-700/50 animate-pulse">
                    <Package size={28} />
                  </div>
                  <p className="text-slate-300 font-semibold text-lg">Không có ứng dụng nào trong hệ thống</p>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                    Kho ứng dụng của bạn hiện đang trống. Hãy nhấn nút <strong className="text-indigo-400">"Thêm Ứng dụng"</strong> ở cột bên trái để bắt đầu khởi tạo dự án mới!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Reset Button (Only show in extreme cases or keep it at the bottom) */}
        <div className="mt-12 text-center">
          <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/10">
            <RotateCcw size={16} /> Reset toàn bộ hệ thống về Mặc định
          </button>
        </div>
      </div>
    </div>
  );
};
