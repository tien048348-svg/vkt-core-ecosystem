import { useEffect, useState } from 'react';
import { Sparkles, Terminal, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const LiveActivityTicker = () => {
  const { apps, siteConfig } = useAppContext();
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const themeColor = siteConfig?.themeColor || 'gold';

  // Định nghĩa màu theo theme
  const getThemeColorClass = (color: string) => {
    switch (color) {
      case 'rose': return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
      case 'amber': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'emerald': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'cyan': return 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5';
      case 'gold': return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5';
      default: return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
    }
  };

  useEffect(() => {
    const defaultAppsList = apps.length > 0 ? apps : [
      { name: "Kids Cartoon Studio" },
      { name: "Dharma Studio" },
      { name: "Recyclestyles" }
    ];

    const generateTickerData = () => {
      const names = [
        "nguyen_v", "tran_anh", "le_minh", "hoang_dung", "pham_hieu", "vu_tien", 
        "thanh_binh", "quoc_bao", "viet_tung", "mai_huong", "dieu_linh", "phan_tuan"
      ];
      
      const actions = [
        "vừa truy cập sử dụng",
        "đang kết xuất video trên",
        "đang nhân bản giọng nói AI trong",
        "vừa tối ưu hóa nội dung bằng",
        "vừa đăng nhập vào hệ thống",
        "đang chạy tác vụ tự động trên"
      ];

      let simulatedItems: string[] = [];

      if (siteConfig?.systemTickerText) {
        simulatedItems = siteConfig.systemTickerText
          .split('|')
          .map(item => item.trim())
          .filter(Boolean);
      } else {
        simulatedItems = [
          "🟢 Hệ thống: Hoạt động ổn định 100% | Băng thông mạng: 3.2 Gbps | Ping phản hồi: 14ms",
          `⚡ Đám mây VKT: Đồng bộ thời gian thực thành công trên toàn bộ ${defaultAppsList.length} máy chủ ứng dụng`,
        ];
      }

      // Thêm hoạt động giả lập dựa trên danh sách app thực tế
      names.forEach((name, idx) => {
        const app = defaultAppsList[idx % defaultAppsList.length];
        const action = actions[idx % actions.length];
        const minAgo = idx * 2 + 1;
        simulatedItems.push(`🟢 Thành viên [***${name}] ${action} ${app.name} (${minAgo} phút trước)`);
      });

      // Thêm một số giao dịch thành công (VIP upgrade)
      simulatedItems.push("💎 Giao dịch thành công: Tài khoản [***dung] vừa kích hoạt Combo VIP 3 Tháng");
      simulatedItems.push("🔥 Chào mừng thành viên mới [***huong] gia nhập đại gia đình VKT Studio");
      simulatedItems.push("💎 Giao dịch thành công: Tài khoản [***tuan] vừa đăng ký Gói Nâng Cao");

      // Xáo trộn nhẹ để trông tự nhiên
      return simulatedItems;
    };

    setTickerItems(generateTickerData());
  }, [apps, siteConfig]);

  if (tickerItems.length === 0) return null;

  const colorClass = getThemeColorClass(themeColor);

  return (
    <div className={`relative w-full overflow-hidden py-3.5 border-y backdrop-blur-md z-30 ${colorClass}`}>
      {/* Lớp phủ mờ 2 bên viền tạo chiều sâu */}
      <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-slate-950 via-slate-950/30 to-transparent z-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-slate-950 via-slate-950/30 to-transparent z-40 pointer-events-none" />

      {/* Container chạy chữ */}
      <div className="flex whitespace-nowrap animate-ticker items-center">
        {/* Nhân đôi danh sách để tạo chuỗi chạy vô tận */}
        {[...tickerItems, ...tickerItems].map((text, idx) => {
          const isSystem = text.includes("Hệ thống:") || text.includes("Đám mây VKT:");
          const isVip = text.includes("Giao dịch thành công:") || text.includes("VIP");

          return (
            <div key={idx} className="flex items-center mx-8 text-xs sm:text-sm font-medium tracking-wide">
              {isSystem ? (
                <Terminal size={14} className="mr-2 text-indigo-400 animate-pulse flex-shrink-0" />
              ) : isVip ? (
                <Sparkles size={14} className="mr-2 text-yellow-400 animate-spin flex-shrink-0" style={{ animationDuration: '3s' }} />
              ) : (
                <Activity size={14} className="mr-2 text-emerald-400 animate-pulse flex-shrink-0" />
              )}
              
              <span className={isVip ? "text-yellow-300 font-bold" : isSystem ? "text-slate-300 font-semibold" : "text-slate-400"}>
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
