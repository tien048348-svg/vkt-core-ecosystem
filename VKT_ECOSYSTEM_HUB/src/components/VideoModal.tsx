import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDriveVideo } from '../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  appName: string;
}

export const VideoModal = ({ isOpen, onClose, videoUrl, appName }: Props) => {
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('youtube.com/watch?v=', 'youtube.com/embed/').split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return formatDriveVideo(url);
  };

  const isDirectVideo = (url: string) => {
    if (!url) return false;
    // Bật thẻ <video> native cho đuôi mp4, webm, firebase và cả link stream trực tiếp của Google Drive
    return url.includes('.mp4') || url.includes('.webm') || url.includes('firebasestorage') || url.includes('drive.google.com/uc');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 z-10"
          >
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-20 pointer-events-none">
              <h3 className="text-white font-bold drop-shadow-md">{appName} - Video Giới Thiệu</h3>
              <button 
                onClick={onClose}
                className="pointer-events-auto p-2 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {isDirectVideo(videoUrl) ? (
              <video
                src={isDirectVideo(videoUrl) && videoUrl.includes('drive.google.com') ? getEmbedUrl(videoUrl) : videoUrl}
                className="w-full h-full object-contain bg-black rounded-b-2xl"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <iframe
                src={getEmbedUrl(videoUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
