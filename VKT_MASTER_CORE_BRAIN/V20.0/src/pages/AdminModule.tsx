import React, { useState, useEffect } from 'react';
import { showToast } from '../components/Toast';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { GlobalSettings } from '../App';
import { VISUAL_STYLES } from '../data/constants';

interface AdminModuleProps {
  uiLang: 'vi' | 'en';
  globalSettings: GlobalSettings;
}

const AdminModule: React.FC<AdminModuleProps> = ({ uiLang, globalSettings }) => {
  const [proExportEnabled, setProExportEnabled] = useState(false);
  const [durationInput, setDurationInput] = useState(globalSettings.maxDuration);

  useEffect(() => {
    const val = localStorage.getItem('dharma_enable_pro_export');
    setProExportEnabled(val === 'true');
  }, []);

  useEffect(() => {
    setDurationInput(globalSettings.maxDuration);
  }, [globalSettings.maxDuration]);

  const handleToggleProExport = () => {
    const newVal = !proExportEnabled;
    setProExportEnabled(newVal);
    localStorage.setItem('dharma_enable_pro_export', String(newVal));
    showToast(newVal ? 'Đã BẬT tính năng Tải PRO' : 'Đã TẮT tính năng Tải PRO', 'success');
  };

  const handleDownloadRollback = (version: string) => {
    const link = document.createElement('a');
    link.href = `/rollbacks/${version}_Rollback.zip`;
    link.download = `${version}_Rollback.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã tải về bản sao lưu ${version} thành công!`, 'success');
  };

  const handleToggleStyle = async (styleId: string) => {
    let newStyles = [...globalSettings.allowedStyles];
    if (newStyles.includes(styleId)) {
      newStyles = newStyles.filter(id => id !== styleId);
    } else {
      newStyles.push(styleId);
    }
    const newSettings = { ...globalSettings, allowedStyles: newStyles };
    await setDoc(doc(db, 'dharma_settings', 'global_config'), newSettings);
    showToast('Đã lưu cấu hình Style lên Cloud!', 'success');
  };

  const handleSaveDuration = async () => {
    const newSettings = { ...globalSettings, maxDuration: durationInput };
    await setDoc(doc(db, 'dharma_settings', 'global_config'), newSettings);
    showToast('Đã cập nhật Giới hạn Thời gian!', 'success');
  };

  const handleToggleAudioRefinement = async () => {
    const newSettings = { ...globalSettings, enableAudioRefinement: !globalSettings.enableAudioRefinement };
    await setDoc(doc(db, 'dharma_settings', 'global_config'), newSettings);
    showToast(newSettings.enableAudioRefinement ? 'Đã BẬT Tinh chỉnh âm thanh!' : 'Đã TẮT Tinh chỉnh âm thanh!', 'success');
  };

  return (
    <div className="flex flex-col h-full animate-[slideIn_0.4s_ease-out]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-server text-teal-500" /> Trạm Quản Trị Hệ Thống (Admin)
        </h2>
        <div className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-2">
          <i className="fa-solid fa-cloud" /> Cloud Sync Active
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        
        {/* PANEL: CLOUD CONFIG */}
        <div className="bg-amber-900/10 border border-amber-500/30 p-6 rounded-xl relative overflow-hidden">
          <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-cloud-arrow-up"></i> Cấu Hình Toàn Cầu (Global Settings)
          </h3>
          <p className="text-sm text-slate-400 mb-6">Các thay đổi tại đây sẽ được đồng bộ ngay lập tức cho TẤT CẢ người dùng.</p>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0a0e14]/50 border border-slate-700/50 p-4 rounded-lg flex flex-col justify-between">
                <label className="font-bold text-slate-200 block mb-3">Giới hạn thời lượng cho User thường (Phút)</label>
                <div className="flex items-center gap-3 mt-auto">
                  <input 
                    type="number" 
                    value={durationInput} 
                    onChange={e => setDurationInput(parseInt(e.target.value) || 0)}
                    className="w-24 bg-[#12161e] border border-slate-700 rounded p-2 text-white outline-none focus:border-amber-500"
                  />
                  <button 
                    onClick={handleSaveDuration}
                    className="px-4 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded font-bold transition-colors"
                  >
                    Lưu Lên Cloud
                  </button>
                </div>
              </div>

              <div className="bg-[#0a0e14]/50 border border-slate-700/50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <i className="fa-solid fa-wand-magic-sparkles text-purple-400"></i> Nút Tinh chỉnh âm thanh
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Bật/tắt tính năng tinh chỉnh âm thanh trên toàn bộ hệ thống User.</div>
                </div>
                <button 
                  onClick={handleToggleAudioRefinement}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                    globalSettings.enableAudioRefinement ? 'bg-amber-500' : 'bg-slate-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    globalSettings.enableAudioRefinement ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="bg-[#0a0e14]/50 border border-slate-700/50 p-4 rounded-lg">
              <div className="font-bold text-slate-200 mb-4">Quản lý Style Kịch Bản ({globalSettings.allowedStyles.length}/{VISUAL_STYLES.length} Đang Bật)</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {VISUAL_STYLES.map(style => {
                  const isEnabled = globalSettings.allowedStyles.includes(style.id);
                  return (
                    <div key={style.id} className="flex items-center justify-between bg-[#12161e] p-3 rounded border border-slate-800">
                      <span className="text-sm text-slate-300 font-medium truncate pr-2">{style.name}</span>
                      <button 
                        onClick={() => handleToggleStyle(style.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                          isEnabled ? 'bg-amber-500' : 'bg-slate-600'
                        }`}
                      >
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          isEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* PANEL: FEATURE FLAGS */}
        <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <i className="fa-solid fa-toggle-on text-8xl"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-sliders text-amber-500"></i> Quản Lý Công Tắc (Feature Flags)
          </h3>
          <p className="text-sm text-slate-400 mb-6">Bật hoặc tắt các tính năng thử nghiệm đang được phát triển. Tác động ngay lập tức không cần tải lại trang.</p>
          
          <div className="bg-[#0a0e14]/50 border border-slate-700/50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200 flex items-center gap-2">
                Nút Tải Dữ Liệu PRO (Smart Chunking)
                {proExportEnabled && <span className="px-2 py-0.5 rounded text-[10px] bg-green-900/50 text-green-400 border border-green-500/30">Đang bật</span>}
              </div>
              <div className="text-xs text-slate-500 mt-1">Sẽ hiển thị thêm các nút tải JSON PRO, CSV PRO phân mảnh theo 25 cảnh bên trang Studio.</div>
            </div>
            
            <button 
              onClick={handleToggleProExport}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#12161e] ${
                proExportEnabled ? 'bg-amber-500' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                proExportEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* PANEL: VERSION VAULT */}
        <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <i className="fa-solid fa-vault text-8xl"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-cyan-500"></i> Kho Lưu Trữ Phiên Bản (Version Vault)
          </h3>
          <p className="text-sm text-slate-400 mb-6">Nơi tải về mã nguồn của các phiên bản quá khứ để dự phòng (Rollback) khi hệ thống gặp lỗi lớn.</p>

          <div className="space-y-3">
            {/* V19 (Current) */}
            <div className="bg-[#0a0e14]/80 border border-teal-900/50 p-4 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-black text-teal-400 text-sm flex items-center gap-2">
                  V19.0 (Omni-Progress Bar) <span className="px-1.5 py-0.5 rounded bg-teal-900 text-[9px] text-white">HIỆN TẠI</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Tích hợp thanh Tiến Trình đồng bộ 100% hệ thống (Script, Audio, Studio, SEO, Spy).</div>
              </div>
              <button disabled className="px-4 py-2 bg-slate-800 text-slate-500 rounded text-xs font-bold cursor-not-allowed border border-slate-700">Đang chạy</button>
            </div>

            {/* V18 */}
            <div className="bg-[#0a0e14]/50 border border-slate-700/50 p-4 rounded-lg flex items-center justify-between group hover:border-amber-700/50 transition-colors">
              <div>
                <div className="font-bold text-slate-300 text-sm">V18.0 PRO MAX</div>
                <div className="text-xs text-slate-500 mt-1">Áp dụng thuật toán Smart Chunking và Đạo luật Minh bạch Tuyệt đối.</div>
              </div>
              <button 
                onClick={() => handleDownloadRollback('V18.0')}
                className="px-4 py-2 bg-[#161a22] hover:bg-amber-900/30 text-slate-300 hover:text-amber-400 rounded text-xs font-bold border border-slate-700 hover:border-amber-500/50 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-download"></i> Tải Mã Nguồn V18
              </button>
            </div>

            {/* V17 */}
            <div className="bg-[#0a0e14]/50 border border-slate-700/50 p-4 rounded-lg flex items-center justify-between group hover:border-amber-700/50 transition-colors">
              <div>
                <div className="font-bold text-slate-300 text-sm">V17.0 PRO MAX (Thiết Quân Luật)</div>
                <div className="text-xs text-slate-500 mt-1">Bổ sung Luật Kiểm tra chéo (Cross-Validation). Chống lặp từ, lặp ý tưởng.</div>
              </div>
              <button 
                onClick={() => handleDownloadRollback('V17.0')}
                className="px-4 py-2 bg-[#161a22] hover:bg-amber-900/30 text-slate-300 hover:text-amber-400 rounded text-xs font-bold border border-slate-700 hover:border-amber-500/50 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-download"></i> Tải Mã Nguồn V17
              </button>
            </div>

            {/* V16 */}
            <div className="bg-[#0a0e14]/50 border border-slate-700/50 p-4 rounded-lg flex items-center justify-between group hover:border-amber-700/50 transition-colors">
              <div>
                <div className="font-bold text-slate-300 text-sm">V16.0 (Quản Lý Thời Gian & Khóa Âm Tiết)</div>
                <div className="text-xs text-slate-500 mt-1">Tính năng Khóa 3 từ cuối là từ đơn, Breath Control, và Auto-Shield cho VEO3.</div>
              </div>
              <button 
                onClick={() => handleDownloadRollback('V16.0')}
                className="px-4 py-2 bg-[#161a22] hover:bg-amber-900/30 text-slate-300 hover:text-amber-400 rounded text-xs font-bold border border-slate-700 hover:border-amber-500/50 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-download"></i> Tải Mã Nguồn V16
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(AdminModule);
