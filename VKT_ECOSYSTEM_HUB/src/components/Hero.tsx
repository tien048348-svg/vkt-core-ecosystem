import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { 
  Zap, ShieldCheck, MonitorSmartphone,
  Trophy, Sparkles, Cpu,
  Brain, Database, Cloud,
  Leaf, Sprout, TrendingUp,
  Flame, Music, Radio
} from 'lucide-react';
import { formatDriveImage } from '../lib/utils';

// Bảng màu đầy đủ cho mỗi theme
const THEME_PALETTE: Record<string, {
  primary: string;   // Màu chính
  secondary: string; // Màu phụ
  glow: string;      // Màu glow nền (rgba)
  glowStrong: string; // Glow đậm hơn
  textClass: string;  // Tailwind text class
  gradientClass: string; // Tailwind gradient class
  cardBorder: string; // Border màu
  featureBg: string;  // Feature card icon bg gradient
}> = {
  gold: {
    primary: '#f59e0b',
    secondary: '#eab308',
    glow: 'rgba(245, 158, 11, 0.15)',
    glowStrong: 'rgba(245, 158, 11, 0.35)',
    textClass: 'text-yellow-400',
    gradientClass: 'from-amber-300 via-yellow-400 to-orange-500',
    cardBorder: 'rgba(245, 158, 11, 0.4)',
    featureBg: 'rgba(245, 158, 11, 0.12)',
  },
  indigo: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    glow: 'rgba(99, 102, 241, 0.15)',
    glowStrong: 'rgba(99, 102, 241, 0.35)',
    textClass: 'text-indigo-400',
    gradientClass: 'from-indigo-400 via-purple-400 to-pink-400',
    cardBorder: 'rgba(99, 102, 241, 0.4)',
    featureBg: 'rgba(99, 102, 241, 0.12)',
  },
  rose: {
    primary: '#f43f5e',
    secondary: '#ec4899',
    glow: 'rgba(244, 63, 94, 0.15)',
    glowStrong: 'rgba(244, 63, 94, 0.35)',
    textClass: 'text-rose-400',
    gradientClass: 'from-pink-400 via-rose-400 to-red-400',
    cardBorder: 'rgba(244, 63, 94, 0.4)',
    featureBg: 'rgba(244, 63, 94, 0.12)',
  },
  amber: {
    primary: '#f97316',
    secondary: '#ea580c',
    glow: 'rgba(249, 115, 22, 0.15)',
    glowStrong: 'rgba(249, 115, 22, 0.35)',
    textClass: 'text-amber-400',
    gradientClass: 'from-amber-400 via-orange-400 to-red-400',
    cardBorder: 'rgba(249, 115, 22, 0.4)',
    featureBg: 'rgba(249, 115, 22, 0.12)',
  },
  emerald: {
    primary: '#10b981',
    secondary: '#14b8a6',
    glow: 'rgba(16, 185, 129, 0.15)',
    glowStrong: 'rgba(16, 185, 129, 0.35)',
    textClass: 'text-emerald-400',
    gradientClass: 'from-emerald-400 via-teal-400 to-green-400',
    cardBorder: 'rgba(16, 185, 129, 0.4)',
    featureBg: 'rgba(16, 185, 129, 0.12)',
  },
  cyan: {
    primary: '#06b6d4',
    secondary: '#3b82f6',
    glow: 'rgba(6, 182, 212, 0.15)',
    glowStrong: 'rgba(6, 182, 212, 0.35)',
    textClass: 'text-cyan-400',
    gradientClass: 'from-cyan-400 via-blue-400 to-indigo-400',
    cardBorder: 'rgba(6, 182, 212, 0.4)',
    featureBg: 'rgba(6, 182, 212, 0.12)',
  },
};

// Định nghĩa bộ Icon động tương ứng với mỗi Theme Color
const THEME_ICONS: Record<string, [any, any, any]> = {
  gold: [Trophy, Sparkles, Cpu],
  indigo: [Brain, Database, Cloud],
  cyan: [Brain, Database, Zap],
  emerald: [Leaf, Sprout, TrendingUp],
  rose: [Flame, Music, Radio],
  amber: [Flame, Zap, MonitorSmartphone],
};

export const Hero = () => {
  const { siteConfig } = useAppContext();

  const titleLines = siteConfig?.heroTitle?.split('\n') || ["Hệ Sinh Thái", "Công Nghệ VKT"];
  const themeName = siteConfig?.themeColor || 'gold';
  const theme = THEME_PALETTE[themeName] || THEME_PALETTE.gold;
  const icons = THEME_ICONS[themeName] || [Zap, ShieldCheck, MonitorSmartphone];

  const scrollToApps = () => {
    const appsSection = document.getElementById('apps-section');
    if (appsSection) {
      appsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-10 pb-10">
      {/* Ambient Glow Background — thay đổi mạnh theo theme */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] -z-10 pointer-events-none transition-all duration-1000 animate-pulse"
        style={{ 
          background: `radial-gradient(ellipse at center, ${theme.glowStrong} 0%, ${theme.glow} 50%, transparent 80%)`,
          animationDuration: '8s'
        }}
      />

      {/* SaaS Hero Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-left text-center lg:text-left"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.2] md:leading-[1.1]">
            {titleLines[0]}
            <br />
            {titleLines[1] && (
              <span
                className="text-transparent bg-clip-text break-words transition-all duration-700 pb-2"
                style={{ backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.secondary}, ${theme.primary})` }}
              >
                {titleLines[1]}
              </span>
            )}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
            {siteConfig?.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button
              onClick={scrollToApps}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 text-sm sm:text-base border border-white/10"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                boxShadow: `0 8px 32px ${theme.glow}`
              }}
            >
              Khám Phá Ngay
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {siteConfig?.heroImageUrl ? (
            <div
              className="relative rounded-2xl overflow-hidden border shadow-2xl aspect-[4/3] group transition-all duration-700 hover:scale-[1.01]"
              style={{ borderColor: theme.cardBorder }}
            >
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity z-10 mix-blend-overlay"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              />
              <img src={formatDriveImage(siteConfig.heroImageUrl)} alt="Hero Banner" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="relative rounded-2xl border border-slate-800 shadow-2xl aspect-[4/3] bg-slate-900 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
              <div className="text-center z-10 p-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 mb-4 flex items-center justify-center border border-slate-700 shadow-lg">
                  <div
                    className="w-10 h-10 rounded-full animate-pulse"
                    style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                  />
                </div>
                <p className="text-slate-500 font-medium">Khu vực hiển thị Banner/Mockup<br/>(Cập nhật link ảnh trong Admin)</p>
              </div>
            </div>
          )}
          {/* Decorative glow behind image */}
          <div
            className="absolute -inset-4 blur-2xl -z-10 rounded-full transition-all duration-700 animate-pulse"
            style={{ 
              background: `radial-gradient(ellipse at center, ${theme.glowStrong} 0%, transparent 70%)`,
              animationDuration: '6s'
            }}
          />
          
          {/* Ambient Tech Widget floating decorations around the hero image */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl flex items-center justify-center shadow-lg text-yellow-400 animate-float-subtle">
            <Sparkles size={20} />
          </div>
          <div className="absolute -bottom-6 -right-6 w-14 h-14 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl flex items-center justify-center shadow-lg text-indigo-400 animate-float-subtle" style={{ animationDelay: '2s' }}>
            <Cpu size={24} />
          </div>
        </motion.div>
      </div>

      {/* 3 Columns Features Section with Staggered Viewport Reveals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { icon: icons[0], title: siteConfig?.feature1Title || "Tính Năng 1", desc: siteConfig?.feature1Desc || "Mô tả tính năng", delay: 0.1 },
          { icon: icons[1], title: siteConfig?.feature2Title || "Tính Năng 2", desc: siteConfig?.feature2Desc || "Mô tả tính năng", delay: 0.2 },
          { icon: icons[2], title: siteConfig?.feature3Title || "Tính Năng 3", desc: siteConfig?.feature3Desc || "Mô tả tính năng", delay: 0.3 },
        ].map(({ icon: Icon, title, desc, delay }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            className="group relative backdrop-blur-sm p-8 rounded-2xl shadow-lg cursor-default overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 shimmer-border"
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: `0 0 0 0 ${theme.glow}`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${theme.glow}`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 ${theme.glow}`;
            }}
          >
            {/* Glow ở góc */}
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: theme.glowStrong }}
            />
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md"
              style={{ background: theme.featureBg, color: theme.primary, border: `1px solid ${theme.cardBorder}` }}
            >
              <Icon size={28} className="transition-transform group-hover:rotate-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

