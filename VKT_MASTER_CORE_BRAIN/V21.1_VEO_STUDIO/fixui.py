import sys

with open("src/pages/ScriptModule.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

old_ui = """            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-[#0a0e14] border border-slate-700/50 p-3 rounded-lg">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">TỈ LỆ KHUNG HÌNH (ASPECT RATIO)</label>
                <select value={videoAspectRatio} onChange={(e) => setVideoAspectRatio(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none">
                  <option value="16:9">16:9 (Video Dài / Youtube Ngang)</option>
                  <option value="9:16">9:16 (Shorts / Tiktok / Reels)</option>
                  <option value="1:1">1:1 (Video Vuông / Facebook)</option>
                </select>
              </div>
              <div className="bg-[#0a0e14] border border-slate-700/50 p-3 rounded-lg">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">CHẤT LƯỢNG (RESOLUTION/QUALITY)</label>
                <select value={videoQuality} onChange={(e) => setVideoQuality(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none">
                  <option value="720p">720p (Nhanh / Tiết kiệm API)</option>
                  <option value="1080p">1080p (Tiêu chuẩn Full HD)</option>
                  <option value="4k">4K (Siêu sắc nét / Ultra HD)</option>
                </select>
              </div>
              <div className="bg-[#0a0e14] border border-slate-700/50 p-3 rounded-lg">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">CHẾ ĐỘ RENDER (TIÊU HAO CREDIT)</label>
                <select value={videoBillingMode} onChange={(e) => setVideoBillingMode(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none">
                  <option value="premium">Premium (Tốn Credit - Nhanh, Nét Nhất)</option>
                  <option value="free">Free / Relaxed (Miễn phí - Chờ lâu, Giới hạn)</option>
                </select>
              </div>
            </div>"""

new_ui = """            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-[#0a0e14] border border-slate-700/50 p-3 rounded-lg">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">TỈ LỆ KHUNG HÌNH (ASPECT RATIO)</label>
                <select value={videoAspectRatio} onChange={(e) => setVideoAspectRatio(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none">
                  <option value="16:9">16:9 (Video Dài / Youtube Ngang)</option>
                  <option value="9:16">9:16 (Shorts / Tiktok / Reels)</option>
                  <option value="1:1">1:1 (Video Vuông / Facebook)</option>
                </select>
              </div>
              <div className="bg-[#0a0e14] border border-slate-700/50 p-3 rounded-lg">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">MODEL VEO 3</label>
                <select value={videoModel} onChange={(e) => setVideoModel(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none">
                  <option value="Veo 3.1 - Quality">Veo 3.1 - Quality</option>
                  <option value="Omni Flash">Omni Flash</option>
                </select>
              </div>
              <div className="bg-[#0a0e14] border border-slate-700/50 p-3 rounded-lg">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">THỜI LƯỢNG (DURATION)</label>
                <select value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none">
                  <option value="x1">x1 (Tiêu chuẩn)</option>
                  <option value="x2">x2 (Dài hơn)</option>
                  <option value="x3">x3 (Siêu dài)</option>
                  <option value="x4">x4 (Kéo dài tối đa)</option>
                </select>
              </div>
            </div>"""

# Replace keeping the rest intact
content = content.replace(old_ui, new_ui)

with open("src/pages/ScriptModule.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("UI updated successfully")
