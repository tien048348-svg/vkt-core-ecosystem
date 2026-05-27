import { useState } from 'react';
import { motion } from 'framer-motion';
import type { AppConfig } from '../data/apps';
import { ExternalLink, Play, Leaf, Sparkles, Video, Link as LinkIcon, MessageCircle, Users, Globe, Lock, Clock, AlertTriangle } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { formatDriveImage } from '../lib/utils';

interface Props {
  app: AppConfig;
  index: number;
  isLocked?: boolean;     // không có quyền hoặc hết hạn
  daysLeft?: number;      // số ngày còn lại (-1 = không quyền, 0 = hết hạn, >0 = còn dùng)
  onLockClick?: () => void; // callback khi click vào app bị khóa
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Play': return Play;
    case 'Leaf': return Leaf;
    case 'Sparkles': return Sparkles;
    default: return Play;
  }
};

const getLinkIcon = (type: string) => {
  switch (type) {
    case 'youtube': return Video;
    case 'facebook': return Users;
    case 'tiktok': return MessageCircle;
    case 'website': return Globe;
    default: return LinkIcon;
  }
};

const getLinkColor = (type: string) => {
  switch (type) {
    case 'youtube': return 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20';
    case 'facebook': return 'bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border-blue-500/20';
    case 'tiktok': return 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border-zinc-700';
    case 'website': return 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border-emerald-500/20';
    default: return 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700';
  }
};

/** Badge trạng thái ngày còn lại */
const DaysBadge = ({ daysLeft }: { daysLeft: number }) => {
  if (daysLeft < 0) return null; // không có quyền — không hiện badge ngày

  if (daysLeft >= 9999) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
        <Sparkles size={12} className="text-indigo-400" /> Quyền Admin (Vô thời hạn)
      </div>
    );
  }

  if (daysLeft === 0) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
        <Clock size={12} /> Đã hết hạn
      </div>
    );
  }

  if (daysLeft <= 7) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold animate-pulse">
        <AlertTriangle size={12} /> Còn {daysLeft} ngày
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
      <Clock size={12} /> Còn {daysLeft} ngày
    </div>
  );
};

const getAppGlowColor = (colorClass: string) => {
  if (!colorClass) return 'rgba(99, 102, 241, 0.15)';
  if (colorClass.includes('pink') || colorClass.includes('rose')) return 'rgba(244, 63, 94, 0.22)';
  if (colorClass.includes('blue') || colorClass.includes('indigo')) return 'rgba(99, 102, 241, 0.22)';
  if (colorClass.includes('emerald') || colorClass.includes('teal') || colorClass.includes('green')) return 'rgba(16, 185, 129, 0.22)';
  if (colorClass.includes('yellow') || colorClass.includes('amber') || colorClass.includes('gold')) return 'rgba(245, 158, 11, 0.22)';
  return 'rgba(99, 102, 241, 0.18)';
};

export const AppCard = ({ app, index, isLocked = false, daysLeft = -1, onLockClick }: Props) => {
  const Icon = getIcon(app.iconName);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [showLockedMsg, setShowLockedMsg] = useState(false);

  const formatUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const handleCardClick = () => {
    if (isLocked) {
      if (onLockClick) {
        onLockClick();
      } else {
        setShowLockedMsg(true);
        setTimeout(() => setShowLockedMsg(false), 3000);
      }
      return;
    }
    window.open(formatUrl(app.url), '_blank');
  };

  const handleLinkClick = (e: React.MouseEvent, link: any) => {
    e.stopPropagation();
    if (isLocked) return;
    if (link.type === 'youtube' && link.url) {
      e.preventDefault();
      setCurrentVideoUrl(link.url);
      setIsVideoOpen(true);
    }
  };

  const handleLegacyVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) return;
    if (app.videoUrl) {
      setCurrentVideoUrl(app.videoUrl);
      setIsVideoOpen(true);
    }
  };

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        whileHover={isLocked ? {} : { 
          y: -8, 
          scale: 1.015,
          boxShadow: `0 20px 45px ${getAppGlowColor(app.color)}`,
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20,
          opacity: { duration: 0.5, delay: index * 0.08 } 
        }}
        className={`relative group rounded-2xl bg-slate-900 border overflow-hidden transition-all flex flex-col h-full shimmer-border ${
          isLocked
            ? 'border-slate-800/80 cursor-not-allowed opacity-70'
            : 'border-slate-800 cursor-pointer hover:border-slate-700/80'
        }`}
        style={{
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
        }}
      >

        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isLocked ? 'from-slate-600 to-slate-700' : app.color} z-20`} />

        {/* Overlay khóa - Chỉ che một phần hoặc hiện badge */}
        {isLocked && (
          <div className="absolute top-4 right-4 z-40 bg-slate-900/90 border border-slate-700 backdrop-blur-md rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl">
            <Lock size={16} className="text-red-400" />
            <span className="text-red-400 text-xs font-semibold">
              {daysLeft === 0 ? 'Đã hết hạn' : 'Chưa cấp quyền'}
            </span>
          </div>
        )}

        {/* Thông báo nhắc khi click */}
        {showLockedMsg && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-2xl whitespace-nowrap"
          >
            🔒 Bạn chưa có quyền truy cập ứng dụng này
          </motion.div>
        )}

        {/* Cover Image */}
        {app.coverImage && (
          <div className="w-full h-48 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
            <img
              src={formatDriveImage(app.coverImage)}
              alt={app.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className={`absolute bottom-4 left-6 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md text-slate-200 z-20 shadow-xl border border-slate-700/50`}>
              <Icon size={24} />
            </div>
            {!isLocked && (
              <div className={`absolute top-4 right-4 z-20`}>
                <a href={formatUrl(app.url)} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:bg-indigo-500 transition-colors shadow-lg border border-slate-700/50 flex items-center justify-center">
                  <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
        )}

        <div className={`p-6 flex flex-col flex-1 ${app.coverImage ? 'pt-4' : ''}`}>
          {!app.coverImage && (
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-xl bg-slate-800/50 text-slate-300 group-hover:text-white transition-colors`}>
                <Icon size={32} />
              </div>
              {!isLocked && (
                <a href={formatUrl(app.url)} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors">
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-2 relative z-10">{app.name}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4 relative z-10 flex-1">
            {app.description}
          </p>

          {/* Badge ngày còn lại */}
          <div className="relative z-10 mb-4 flex items-center justify-between gap-2">
            <DaysBadge daysLeft={daysLeft} />
            {onLockClick && !isLocked && daysLeft > 0 && daysLeft < 9999 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLockClick();
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1 bg-slate-950/40 hover:bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800/80 hover:border-slate-700"
              >
                Gia hạn
              </button>
            )}
          </div>

          {/* Action Buttons — Luôn hiện kể cả khi khóa, để user xem video/link */}
          <div className="flex flex-wrap gap-2 mt-auto relative z-40">
            {app.videoUrl && (
              <button onClick={handleLegacyVideoClick}
                className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-500 font-medium flex items-center justify-center gap-2 transition-colors text-sm">
                <Video size={16} /> Xem Video
              </button>
            )}
            {(app.extraLinks || []).map(link => {
              const LinkIconComponent = getLinkIcon(link.type);
              const colorClass = getLinkColor(link.type);
              if (link.type === 'youtube') {
                return (
                  <button key={link.id} onClick={(e) => handleLinkClick(e, link)}
                    className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-all text-sm ${colorClass}`}>
                    <LinkIconComponent size={16} /> {link.label}
                  </button>
                );
              }
              return (
                <a key={link.id} href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isLocked) {
                      e.preventDefault();
                      handleCardClick();
                    }
                  }}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-all text-sm ${colorClass}`}>
                  <LinkIconComponent size={16} /> {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </motion.div>

      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} videoUrl={currentVideoUrl} appName={app.name} />
    </>
  );
};
