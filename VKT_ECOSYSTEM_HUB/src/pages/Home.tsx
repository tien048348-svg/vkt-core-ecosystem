import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Phone, Mail, MapPin, Lock, ChevronRight, Sparkles, Menu, X, LogOut, Loader2, ChevronDown } from 'lucide-react';
import { Hero } from '../components/Hero';
import { AppCard } from '../components/AppCard';
import { PaymentModal } from '../components/PaymentModal';
import { formatDriveImage, ensureHttps } from '../lib/utils';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LiveActivityTicker } from '../components/LiveActivityTicker';
import { AIAssistant } from '../components/AIAssistant';

// SVG Icon Zalo
const ZaloIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4C12.95 4 4 12.95 4 24C4 28.3 5.35 32.28 7.63 35.54L4.18 43.37L12.44 40.07C15.55 42.01 19.15 43.13 23 43.13C34.05 43.13 43 34.18 43 23.13C43 12.08 34.05 3.13 23 3.13C23 3.13 23.33 4 24 4ZM16.5 19H28L16.5 31H28M32 19V31" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none"/>
    <path d="M12 24C12 24 12.5 16 19.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

// ─── Google Logo SVG ──────────────────────────────────────────────────────────
const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.2 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.2 6.5 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C37 39.1 44 34 44 24c0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
);

// ─── Màn hình đăng nhập ───────────────────────────────────────────────────────
const LoginScreen = ({ onLogin, isLoading, siteConfig }: {
  onLogin: () => void;
  isLoading: boolean;
  siteConfig: any;
}) => {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background effects */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo & Brand */}
        <div className="text-center mb-10">
          {siteConfig?.logoUrl && (
            <img src={formatDriveImage(siteConfig.logoUrl)} alt="Logo"
              className="w-16 h-16 object-cover rounded-full border-2 border-slate-700 mx-auto mb-4 shadow-2xl" />
          )}
          <h1 className="text-3xl font-black tracking-tighter text-white">
            {siteConfig?.siteTitle || 'VKT.HUB'}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {siteConfig?.heroSubtitle
              ? siteConfig.heroSubtitle.slice(0, 80) + '...'
              : 'Hệ sinh thái công nghệ VKT — Đăng nhập để trải nghiệm'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Lock size={18} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Đăng nhập để tiếp tục</h2>
              <p className="text-slate-500 text-xs">Chỉ tài khoản được cấp phép mới có thể truy cập</p>
            </div>
          </div>

          <button
            onClick={onLogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin text-gray-500" />
            ) : (
              <GoogleLogo />
            )}
            {isLoading ? 'Đang đăng nhập...' : 'Tiếp tục bằng Google'}
          </button>

          <p className="text-center text-slate-600 text-xs mt-6 leading-relaxed">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <span className="text-slate-500">Điều khoản sử dụng</span> của VKT
          </p>
        </div>

        {/* Features preview */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {['🔒 Bảo mật', '⚡ Nhanh chóng', '🎯 Chính xác'].map((f) => (
            <div key={f} className="bg-slate-900/40 border border-slate-800 rounded-xl py-3 px-2">
              <p className="text-slate-400 text-xs">{f}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};


// ─── Home chính ───────────────────────────────────────────────────────────────
export const Home = () => {
  const { apps, siteConfig, plans, loading } = useAppContext(); // Lấy thêm plans từ AppContext
  const { user, authLoading, signInWithGoogle, signOut, hasAccess, daysRemaining } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentTargetAppId, setPaymentTargetAppId] = useState<string | undefined>(undefined);
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(undefined);

  const isAdmin = user && siteConfig && (
    user.email?.toLowerCase() === siteConfig.adminEmail?.toLowerCase() || 
    user.email?.toLowerCase() === 'tien048348@gmail.com'
  );

  const activeAppsList = apps.filter(app => !app.isHidden && hasAccess(app.id));

  const handleLogin = async () => {
    setLoginLoading(true);
    try { await signInWithGoogle(); } catch (e) { console.error(e); }
    finally { setLoginLoading(false); }
  };

  // Loading auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center gap-3 text-indigo-400 font-semibold">
        <Loader2 className="animate-spin" size={24} />
        <span>Đang tải...</span>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!user) {
    return <LoginScreen onLogin={handleLogin} isLoading={loginLoading} siteConfig={siteConfig} />;
  }


  const getAccentGradient = (color: string) => {
    switch(color) {
      case 'rose': return 'from-rose-500 to-pink-600';
      case 'amber': return 'from-amber-400 to-orange-500';
      case 'emerald': return 'from-emerald-400 to-teal-500';
      case 'cyan': return 'from-cyan-400 to-blue-500';
      case 'gold': return 'from-yellow-400 to-amber-500';
      default: return 'from-indigo-500 to-violet-600';
    }
  };

  const getThemePrimary = (color: string) => {
    switch(color) {
      case 'rose': return '#f43f5e';
      case 'amber': return '#f97316';
      case 'emerald': return '#10b981';
      case 'cyan': return '#06b6d4';
      case 'gold': return '#f59e0b';
      default: return '#6366f1';
    }
  };

  const accentGradient = getAccentGradient(siteConfig?.themeColor || 'indigo');
  const themePrimary = getThemePrimary(siteConfig?.themeColor || 'indigo');
  const filteredApps = apps
    .filter(app => !app.isHidden)
    .filter(app =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const allVisibleApps = apps.filter(a => !a.isHidden);
  const visibleApps = allVisibleApps.slice(0, 4);
  const hasMoreApps = allVisibleApps.length > 4;
  const hasContact = !!(siteConfig?.hotline || siteConfig?.email || siteConfig?.address);
  const hasApps = visibleApps.length > 0;
  const colCount = 1 + (hasApps ? 1 : 0) + (hasContact ? 1 : 0);
  const gridClass = colCount === 1 ? 'grid-cols-1 max-w-md' : colCount === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3';

  const navItems = [
    { label: 'Trang Chủ', href: '#' },
    { label: 'Hệ Sinh Thái', href: '#apps-section', onClick: () => document.getElementById('apps-section')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Tính Năng', href: '#features', onClick: () => document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3')?.scrollIntoView({ behavior: 'smooth' }) },
    ...(siteConfig?.paymentEnabled ? [{ label: 'Bảng Giá', href: '#pricing-section', onClick: () => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' }) }] : []),
  ];

  const getThemeGlowColors = (color: string) => {
    switch (color) {
      case 'rose': return { orb1: 'rgba(244, 63, 94, 0.12)', orb2: 'rgba(251, 113, 133, 0.08)', orb3: 'rgba(225, 29, 72, 0.05)' };
      case 'amber': return { orb1: 'rgba(249, 115, 22, 0.12)', orb2: 'rgba(251, 146, 60, 0.08)', orb3: 'rgba(234, 88, 12, 0.05)' };
      case 'emerald': return { orb1: 'rgba(16, 185, 129, 0.12)', orb2: 'rgba(52, 211, 153, 0.08)', orb3: 'rgba(5, 150, 105, 0.05)' };
      case 'cyan': return { orb1: 'rgba(6, 182, 212, 0.12)', orb2: 'rgba(34, 211, 238, 0.08)', orb3: 'rgba(8, 145, 178, 0.05)' };
      case 'gold': return { orb1: 'rgba(245, 158, 11, 0.12)', orb2: 'rgba(253, 224, 71, 0.08)', orb3: 'rgba(217, 119, 6, 0.05)' };
      default: return { orb1: 'rgba(99, 102, 241, 0.12)', orb2: 'rgba(129, 140, 248, 0.08)', orb3: 'rgba(79, 70, 229, 0.05)' };
    }
  };

  const glows = getThemeGlowColors(siteConfig?.themeColor || 'gold');

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617] font-sans">
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Dynamic Ambient Floating Orbits */}
      <div 
        className="absolute top-1/4 left-10 w-[350px] h-[350px] rounded-full blur-[100px] -z-10 pointer-events-none animate-float-orbit transition-all duration-1000"
        style={{ background: glows.orb1, animationDuration: '32s' }}
      />
      <div 
        className="absolute top-2/3 right-10 w-[400px] h-[400px] rounded-full blur-[120px] -z-10 pointer-events-none animate-float-orbit transition-all duration-1000"
        style={{ background: glows.orb2, animationDuration: '40s', animationDelay: '3s' }}
      />
      <div 
        className="absolute bottom-10 left-1/3 w-[300px] h-[300px] rounded-full blur-[90px] -z-10 pointer-events-none animate-float-orbit transition-all duration-1000"
        style={{ background: glows.orb3, animationDuration: '25s', animationDelay: '5s' }}
      />

      {/* Stellar Dust Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
        {[...Array(24)].map((_, i) => {
          const top = `${(i * 137.5) % 100}%`;
          const left = `${(i * 72.3) % 100}%`;
          const delay = `${(i * 0.7) % 5}s`;
          const scale = 0.5 + (i % 3) * 0.3;
          return (
            <div 
              key={i} 
              className="absolute w-1 h-1 rounded-full bg-indigo-200/30 animate-twinkle" 
              style={{ top, left, animationDelay: delay, transform: `scale(${scale})` }}
            />
          );
        })}
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-0">

        {/* ===== HEADER ===== */}
        <header className="flex items-center justify-between mb-8 sm:mb-12 gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {siteConfig?.logoUrl ? (
              <img src={formatDriveImage(siteConfig.logoUrl)} alt="Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full shadow-lg border-2 border-slate-700 bg-slate-950" />
            ) : null}
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tighter text-white leading-none">
                {siteConfig?.siteTitle || "VKT.HUB"}
              </div>
              {(siteConfig as any)?.slogan && (
                <p className="text-[11px] sm:text-xs text-slate-400 tracking-wide hidden sm:block mt-0.5 max-w-[200px] truncate">
                  {(siteConfig as any).slogan}
                </p>
              )}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-full px-2 py-1.5">
            {navItems.map(item => (
              <a key={item.label} href={item.href}
                onClick={e => { if (item.onClick) { e.preventDefault(); item.onClick(); } }}
                className="px-4 py-2 rounded-full text-base font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* User Avatar + Tên + Dropdown Gói dịch vụ */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-full pl-1 pr-2 sm:pr-3 py-1 hover:border-slate-700 transition-all text-left"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-slate-700" />
                  ) : (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden xs:inline text-slate-300 text-xs sm:text-sm font-medium max-w-[80px] sm:max-w-[120px] truncate">
                    {user.displayName?.split(' ').pop() || user.email}
                  </span>
                  <ChevronDown size={12} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-85 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="border-b border-slate-800/80 pb-3 mb-3">
                      <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Tài khoản</p>
                      <p className="text-white font-semibold text-sm truncate mt-0.5">{user.displayName || user.email}</p>
                      <p className="text-slate-500 text-[10px] truncate">{user.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Gói đang sử dụng</p>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {activeAppsList.length > 0 ? (
                          activeAppsList.map(app => {
                            const daysLeft = daysRemaining(app.id);
                            const isInfinite = daysLeft >= 9999;
                            return (
                              <div key={app.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/50 hover:bg-slate-950/80 transition-colors">
                                <div className="flex items-center gap-2 truncate">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                  <span className="text-white text-xs font-semibold truncate">{app.name}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isInfinite ? 'bg-indigo-500/10 text-indigo-400' : daysLeft <= 7 ? 'bg-amber-500/10 text-amber-400 animate-pulse' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                  {isInfinite ? 'Vô thời hạn' : `Còn ${daysLeft} ngày`}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-slate-500 text-xs">Chưa đăng ký ứng dụng nào</p>
                            {siteConfig?.hotline && (
                              <a href={`https://zalo.me/${siteConfig.hotline.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                                className="inline-block mt-3 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors">
                                Liên hệ kích hoạt ngay
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hotline mobile */}
            {siteConfig?.hotline && (
              <a href={`tel:${siteConfig.hotline.replace(/\D/g, '')}`}
                className={`sm:hidden flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r ${accentGradient} text-white shadow-lg`}>
                <Phone size={14} />
              </a>
            )}

            {/* Admin */}
            {isAdmin && (
              <Link to="/admin"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-all"
                title="Quản trị viên">
                <Lock size={13} />
              </Link>
            )}

            {/* Đăng xuất */}
            <button onClick={signOut} title="Đăng xuất"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-all">
              <LogOut size={13} />
            </button>

            {/* Mobile Hamburger */}
            <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </header>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden mb-6 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-4 flex flex-col gap-1">
            {navItems.map(item => (
              <a key={item.label} href={item.href}
                onClick={e => { if (item.onClick) { e.preventDefault(); item.onClick(); } setMobileMenuOpen(false); }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                {item.label}
              </a>
            ))}
            {user && (
              <button onClick={signOut}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2 mt-1">
                <LogOut size={14} /> Đăng xuất
              </button>
            )}
          </div>
        )}

        <Hero />

        {/* Bảng Tin Hoạt Động Thời Gian Thực */}
        <div className="mt-8 mb-6 sm:mt-12 sm:mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <LiveActivityTicker />
        </div>

        {/* Thanh tìm kiếm với Scroll Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 sm:mt-12 max-w-xl mx-auto relative z-10 px-2 sm:px-0"
        >
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input type="text"
              className="block w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent backdrop-blur-sm transition-all shadow-xl text-sm sm:text-base"
              style={{ '--tw-ring-color': themePrimary } as React.CSSProperties}
              placeholder="Tìm kiếm ứng dụng, dịch vụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Lưới ứng dụng */}
        <div id="apps-section" className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredApps.length > 0 ? (
            filteredApps.map((app, index) => (
              <AppCard
                key={app.id}
                app={app}
                index={index}
                isLocked={!hasAccess(app.id)}
                daysLeft={daysRemaining(app.id)}
                onLockClick={siteConfig?.paymentEnabled ? () => {
                  setPaymentTargetAppId(app.id);
                  setIsPaymentOpen(true);
                } : undefined}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500">
              Không tìm thấy ứng dụng nào phù hợp với từ khóa "{searchQuery}"
            </div>
          )}
        </div>

        {/* ===== BẢNG GIÁ DỊCH VỤ ===== */}
        {siteConfig?.paymentEnabled && (
          <section id="pricing-section" className="mt-24 sm:mt-32 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-semibold mb-4"
              >
                <Sparkles size={12} /> Bảng Giá Dịch Vụ
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-black text-white tracking-tight"
              >
                Nâng Cấp Quyền Hạn Sử Dụng
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 mt-4 text-xs sm:text-sm leading-relaxed"
              >
                Chọn gói dịch vụ phù hợp nhất để gia hạn và mở khóa tất cả công cụ thông minh đỉnh cao trong hệ sinh thái VKT.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans
                .filter(p => p && p.isActive && (p.price || 0) > 0)
                .map((plan, pIdx) => {
                  const isBundle = plan.type === 'bundle';
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: pIdx * 0.1 }}
                      whileHover={{ y: -8 }}
                      className={`relative rounded-3xl p-8 flex flex-col h-full overflow-hidden border backdrop-blur-xl transition-all ${
                        isBundle
                          ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-400'
                          : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Highlight Badge */}
                      {isBundle && (
                        <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-indigo-500/20">
                          Combo Phổ Biến
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed min-h-[40px]">{plan.description}</p>
                      </div>

                      <div className="mb-6 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">
                          {(plan.price || 0).toLocaleString('vi-VN')}
                        </span>
                        <span className="text-slate-400 text-xs font-semibold">VND</span>
                        <span className="text-slate-500 text-xs font-medium ml-1">/ {plan.durationDays} ngày</span>
                      </div>

                      {/* Line divider */}
                      <div className="border-t border-slate-800/80 my-6" />

                      {/* App list */}
                      <div className="space-y-4 mb-8 flex-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ứng dụng áp dụng:</p>
                        {(!plan.appIds || plan.appIds.length === 0) ? (
                          <div className="flex items-center gap-2 text-slate-300 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                            <span className="font-semibold text-emerald-400">Tất cả ứng dụng hệ sinh thái</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {plan.appIds.map(appId => {
                              const appObj = apps.find(a => a.id === appId);
                              return (
                                <div key={appId} className="flex items-center gap-2 text-slate-300 text-xs">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                                  <span className="truncate">{appObj?.name || appId}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedPlanId(plan.id);
                          setPaymentTargetAppId((plan.appIds && plan.appIds.length === 1) ? plan.appIds[0] : undefined);
                          setIsPaymentOpen(true);
                        }}
                        className={`w-full py-3 px-6 rounded-2xl font-bold text-xs transition-all shadow-lg hover:shadow-xl active:scale-[0.98] ${
                          isBundle
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                        }`}
                      >
                        Đăng ký ngay
                      </button>
                    </motion.div>
                  );
                })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-slate-800/70 bg-gradient-to-b from-slate-950/0 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          <div className={`grid ${gridClass} gap-10 mb-10`}>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                {siteConfig?.logoUrl && (
                  <img src={formatDriveImage(siteConfig.logoUrl)} alt="Logo"
                    className="w-10 h-10 object-cover rounded-full border border-slate-700" />
                )}
                <span className="text-xl font-black tracking-tighter text-white">{siteConfig?.siteTitle || 'VKT.HUB'}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                {siteConfig?.footerDescription || 'Hệ sinh thái công nghệ VKT.'}
              </p>
            </div>

            {hasApps && (
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-400" /> Ứng Dụng Nổi Bật
                </h4>
                <ul className="space-y-2.5">
                  {visibleApps.map(app => (
                    <li key={app.id}>
                      <a href={ensureHttps(app.url)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors group">
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                        <span className="truncate">{app.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                {hasMoreApps && (
                  <a href="#apps-section"
                    onClick={e => { e.preventDefault(); document.getElementById('apps-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    <ChevronRight size={12} /> Xem tất cả {allVisibleApps.length} ứng dụng
                  </a>
                )}
              </div>
            )}

            {hasContact && (
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
                  <Phone size={14} className="text-indigo-400" /> Liên Hệ & Hỗ Trợ
                </h4>
                <ul className="space-y-3">
                  {siteConfig?.hotline && (
                    <li>
                      <a href={`https://zalo.me/${siteConfig.hotline.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-start gap-3 text-slate-400 hover:text-white text-sm transition-colors group">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500/20">
                          <ZaloIcon size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-blue-400 font-semibold uppercase tracking-wide">Zalo</span>
                          <span>{siteConfig.hotline}</span>
                        </div>
                      </a>
                    </li>
                  )}
                  {siteConfig?.email && (
                    <li>
                      <a href={`mailto:${siteConfig.email}`}
                        className="flex items-start gap-3 text-slate-400 hover:text-white text-sm transition-colors group">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-indigo-500/20">
                          <Mail size={13} className="text-indigo-400" />
                        </div>
                        <span className="break-all">{siteConfig.email}</span>
                      </a>
                    </li>
                  )}
                  {siteConfig?.address && (
                    <li>
                      <div className="flex items-start gap-3 text-slate-400 text-sm">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin size={13} className="text-indigo-400" />
                        </div>
                        <span>{siteConfig.address}</span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <p>{siteConfig?.footerText || `© ${new Date().getFullYear()} VKT Studio.`}</p>
            <div className="flex items-center gap-5">
              {(siteConfig as any)?.termsUrl ? (
                <a href={ensureHttps((siteConfig as any).termsUrl)} target="_blank" rel="noopener noreferrer"
                  className="hover:text-slate-300 transition-colors">Điều khoản sử dụng</a>
              ) : <span className="opacity-40 cursor-default">Điều khoản sử dụng</span>}
              {(siteConfig as any)?.privacyUrl ? (
                <a href={ensureHttps((siteConfig as any).privacyUrl)} target="_blank" rel="noopener noreferrer"
                  className="hover:text-slate-300 transition-colors">Chính sách bảo mật</a>
              ) : <span className="opacity-40 cursor-default">Chính sách bảo mật</span>}
            </div>
          </div>
        </div>
      </footer>

      {user && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => {
            setIsPaymentOpen(false);
            setSelectedPlanId(undefined);
          }}
          userId={user.uid}
          targetAppId={paymentTargetAppId}
          plans={plans}
          initialPlanId={selectedPlanId}
        />
      )}

      {/* Trợ lý ảo AI Widget Nổi */}
      <AIAssistant />
    </div>
  );
};
