import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatDriveImage } from '../lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const AIAssistant = () => {
  const { apps, plans, siteConfig } = useAppContext();
  const { hasAccess } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const themeColor = siteConfig?.themeColor || 'gold';

  // Bộ gợi ý câu hỏi nhanh (Quick Suggestion Chips)
  const quickSuggestions = [
    { label: "VKT Kids Cartoon là gì?", query: "VKT Kids Cartoon Studio dùng để làm gì và có những tính năng nào nổi bật vậy?" },
    { label: "VKT Dharma Studio là gì?", query: "VKT Dharma Studio dùng để làm gì và hoạt động ra sao?" },
    { label: "Bảng giá gói cước VIP?", query: "Hệ sinh thái có những gói cước nào, giá bao nhiêu và gia hạn ra sao?" },
    { label: "Hotline hỗ trợ Zalo?", query: "Số hotline Zalo và thông tin liên hệ hỗ trợ kích hoạt của VKT Studio là gì?" }
  ];

  // Khởi tạo tin nhắn chào mừng
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: `Xin chào! 😊 Tôi là trợ lý ảo thông minh của **VKT Studio**. Tôi hiểu rất sâu sắc về toàn bộ ứng dụng AI, bảng giá gói cước và dịch vụ hỗ trợ của hệ sinh thái VKT. 

Bạn muốn tôi tư vấn hoặc giải đáp thông tin nào dưới đây?`,
        timestamp: new Date()
      }
    ]);
  }, []);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getThemeColors = (color: string) => {
    switch (color) {
      case 'rose': return { primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.25)', bg: 'bg-rose-600 hover:bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/30' };
      case 'amber': return { primary: '#f97316', glow: 'rgba(249, 115, 22, 0.25)', bg: 'bg-amber-600 hover:bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'emerald': return { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.25)', bg: 'bg-emerald-600 hover:bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      case 'cyan': return { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.25)', bg: 'bg-cyan-600 hover:bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/30' };
      case 'gold': return { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.25)', bg: 'bg-yellow-600 hover:bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500/30' };
      default: return { primary: '#6366f1', glow: 'rgba(99, 102, 241, 0.25)', bg: 'bg-indigo-600 hover:bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/30' };
    }
  };

  const currentTheme = getThemeColors(themeColor);

  // Phân tích từ khóa trả lời thông minh offline (Smart Local Fallback)
  const getSmartLocalResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    // 1. Phân tích tìm kiếm các ứng dụng động từ database
    const matchedApp = apps.find(app => {
      const nameLower = app.name.toLowerCase();
      const idLower = app.id.toLowerCase();
      const descLower = app.description ? app.description.toLowerCase() : '';
      const knowledgeLower = app.aiKnowledge ? app.aiKnowledge.toLowerCase() : '';
      
      // Tạo danh sách từ khóa phụ đặc trưng cho các app tiêu chuẩn để fallback thông minh
      const keywords: string[] = [];
      if (idLower.includes('kids') || idLower.includes('cartoon') || nameLower.includes('cartoon') || nameLower.includes('hoạt hình')) {
        keywords.push('kids', 'cartoon', 'hoạt hình', 'trẻ em', 'thiếu nhi', '3d pixar', 'đất nặn', 'song ngữ');
      }
      if (idLower.includes('dharma') || nameLower.includes('dharma') || nameLower.includes('phật') || nameLower.includes('tâm linh')) {
        keywords.push('dharma', 'phật', 'đạo lý', 'thiền', 'tâm linh', 'pháp thoại', 'tĩnh tâm', 'nhạc thiền');
      }
      if (idLower.includes('recycle') || nameLower.includes('recycle') || nameLower.includes('tái chế') || nameLower.includes('handmade')) {
        keywords.push('recycle', 'tái chế', 'handmade', 'xanh', 'eco', 'môi trường', 'vật liệu');
      }

      // Kiểm tra khớp từ khóa
      return (
        q.includes(idLower) ||
        q.includes(nameLower) ||
        nameLower.includes(q) ||
        descLower.includes(q) ||
        knowledgeLower.includes(q) ||
        keywords.some(kw => q.includes(kw))
      );
    });

    if (matchedApp) {
      let response = `Dạ, em xin phép giới thiệu đến Anh/Chị thông tin chính thức của ứng dụng **${matchedApp.name}** thuộc hệ sinh thái VKT bên em ạ:

✨ **Mô tả ứng dụng:** ${matchedApp.description || 'Ứng dụng thông minh hỗ trợ sản xuất nội dung tự động đỉnh cao.'}
`;

      // Tích hợp dữ liệu tri thức huấn luyện chuyên sâu (aiKnowledge) nếu có
      if (matchedApp.aiKnowledge && matchedApp.aiKnowledge.trim() !== '') {
        response += `\n📖 **Tri thức huấn luyện chuyên sâu:**\n${matchedApp.aiKnowledge}\n`;
      }

      response += `
🚀 **Trạng thái:** Đang hoạt động cực kỳ ổn định.
🔗 **Đường dẫn trải nghiệm:** [Click vào đây để trải nghiệm ngay](${matchedApp.url || '#'}) ạ!

`;

      // Tùy biến phản hồi theo cờ siteConfig.paymentEnabled
      if (siteConfig?.paymentEnabled) {
        response += `Dạ, hiện tại ứng dụng đang có các gói VIP hỗ trợ nhiều tính năng đặc biệt hơn. Anh/Chị có thể tham khảo bảng giá phía dưới hoặc nhấp nút "Đăng ký ngay" ở phần "Bảng Giá Dịch Vụ" trên trang chủ để tự động nâng cấp nhé ạ!`;
      } else {
        response += `🎁 **Món quà đặc biệt dành cho Anh/Chị:** Hiện tại, ứng dụng **${matchedApp.name}** đang nằm trong chương trình **MIỄN PHÍ TRẢI NGHIỆM 100%** tất cả tính năng VIP của bên em ạ! Anh/Chị hãy thoải mái trải nghiệm mọi công nghệ tối tân nhất mà không cần lo lắng về chi phí nhé ạ!`;
      }

      return response;
    }

    // 2. Giá cả, gói cước, mua, thanh toán, nâng cấp, gia hạn
    if (q.includes('giá') || q.includes('gói') || q.includes('vip') || q.includes('combo') || q.includes('thanh toán') || q.includes('nâng cấp') || q.includes('mua') || q.includes('gia hạn') || q.includes('đơn giá') || q.includes('phí')) {
      
      // Xử lý logic cờ paymentEnabled
      if (!siteConfig?.paymentEnabled) {
        return `Dạ, em xin phép được chia sẻ một thông tin vô cùng tự hào và hiếu khách gửi tới Anh/Chị ạ! 😍

Hiện tại, hệ thống thanh toán tự động đang được đóng lại vì **toàn bộ hệ sinh thái ứng dụng của VKT Studio đang được mở MIỄN PHÍ TRẢI NGHIỆM 100%** toàn bộ các tính năng cao cấp (VIP) dành cho tất cả thành viên ạ!

Anh/Chị không cần trả bất kỳ khoản phí nào, cũng không cần nâng cấp hay đăng ký gói cước nào đâu ạ. Hãy thoải mái đăng nhập và sử dụng toàn bộ sức mạnh công nghệ AI tuyệt vời của bên em nhé ạ! 

Dạ, nếu sau này có bất kỳ chương trình thay đổi hoặc nâng cấp tính năng mới nào khác, bên em sẽ gửi thông tin chính thức đến Anh/Chị sau ạ. Em chúc Anh/Chị có những trải nghiệm thật thú vị và tuyệt vời cùng VKT nhé ạ!`;
      }

      // Trường hợp bật cổng thanh toán
      const activePlans = plans ? plans.filter(p => p.isActive) : [];
      if (activePlans.length === 0) {
        return `Dạ, hiện tại cổng thanh toán tự động và các gói cước VIP đang được bộ phận kỹ thuật bảo trì và tối ưu hóa hệ thống để mang lại trải nghiệm mượt mà nhất cho Anh/Chị ạ.
        
Để nhận báo giá ưu đãi cực kỳ đặc biệt và kích hoạt tài khoản thủ công siêu tốc chỉ trong 30 giây, Anh/Chị vui lòng liên hệ trực tiếp với Admin qua Zalo/Hotline: **${siteConfig?.hotline || '055 979 3678'}** để được hỗ trợ chu đáo nhất nhé ạ! Em xin chân thành cảm ơn Anh/Chị ạ!`;
      }
      
      const plansList = activePlans.map(p => {
        const appsCovered = (!p.appIds || p.appIds.length === 0) 
          ? "Tất cả ứng dụng hệ sinh thái VKT" 
          : p.appIds.map(id => apps.find(a => a.id === id)?.name || id).join(', ');
        return `- **${p.name}** (${p.durationDays} ngày): **${(p.price || 0).toLocaleString('vi-VN')} VND**\n  *Ứng dụng mở khóa: ${appsCovered}*`;
      }).join('\n\n');

      return `Dạ, em xin phép gửi đến Anh/Chị bảng giá các gói cước dịch vụ VIP của hệ sinh thái **VKT Studio** đang áp dụng chính thức ạ:

${plansList}

---
💡 **Cách thức đăng ký / Gia hạn cực kỳ nhanh chóng ạ:**
1. Anh/Chị vui lòng nhấp chọn nút **"Đăng ký ngay"** tại gói cước mong muốn ở phần **Bảng Giá Dịch Vụ** trên giao diện chính của trang chủ ạ.
2. Quét mã QR VietQR hiển thị trên màn hình hoặc chuyển khoản đúng số tiền kèm nội dung chuyển khoản tự động được cung cấp. Hệ thống bên em sẽ tự động kích hoạt tài khoản VIP cho Anh/Chị ngay lập tức sau vài giây ạ!
3. Ngoài ra, Anh/Chị cũng có thể liên hệ trực tiếp qua Zalo/Hotline: **${siteConfig?.hotline || '055 979 3678'}** để được Admin hỗ trợ kích hoạt trực tiếp chu đáo nhất nhé ạ!`;
    }

    // 3. Liên hệ, hotline, sđt, hỗ trợ, zalo, địa chỉ, email, admin
    if (q.includes('hotline') || q.includes('zalo') || q.includes('liên hệ') || q.includes('sđt') || q.includes('điện thoại') || q.includes('hỗ trợ') || q.includes('địa chỉ') || q.includes('email') || q.includes('admin')) {
      return `Dạ, em xin phép gửi đến Anh/Chị thông tin liên hệ hỗ trợ kỹ thuật và chăm sóc khách hàng 24/7 chính thức của **VKT Studio** bên em ạ:

- **Số Hotline / Zalo hỗ trợ:** **${siteConfig?.hotline || '055 979 3678'}**
- **Email Hỗ Trợ:** **${siteConfig?.email || 'support@kiemtienvu.com'}**
- **Địa Chỉ Văn Phòng:** **${siteConfig?.address || 'Hà Nội, Vietnam'}**

*💡 Mẹo nhỏ dành cho Anh/Chị:* Nếu đơn hàng chuyển khoản của Anh/Chị chưa được kích hoạt tự động sau 1 phút, Anh/Chị chỉ cần chụp ảnh biên lai giao dịch gửi vào Zalo Hotline ở trên. Đội ngũ kỹ thuật viên của bên em sẽ kiểm tra và duyệt kích hoạt thủ công siêu tốc lập tức cho Anh/Chị nhé ạ!`;
    }

    // Mặc định chào mừng / Không tìm thấy thông tin cụ thể
    return `Dạ, hiện tại thông tin chi tiết về câu hỏi này chưa có sẵn trên hệ thống dữ liệu offline của em ạ. 
    
Để được hỗ trợ chính xác, nhanh chóng và chu đáo nhất, Anh/Chị vui lòng liên hệ trực tiếp với Admin qua Zalo/Hotline: **${siteConfig?.hotline || '055 979 3678'}** hoặc gửi thư tới Email: **${siteConfig?.email || 'support@kiemtienvu.com'}** để được em và đội ngũ admin hỗ trợ tận tình nhất cho Anh/Chị nhé ạ! Em xin chân thành cảm ơn Anh/Chị ạ!`;
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Chuẩn bị toàn bộ lịch sử nhắn tin để gửi lên API
      const history = [...messages, userMsg].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      // Gọi serverless API Vercel an toàn bảo mật
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          apps: apps,
          plans: plans,
          siteConfig: siteConfig
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error, falling back to Local Smart Analyzer.');
      }

      const data = await response.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.text || 'Xin lỗi, tôi gặp chút trục trặc khi kết nối.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.warn("Chuyển sang chế độ Local Fallback Smart Agent:", error);
      // Chế độ Local Fallback Smart Agent quét từ khóa cực kỳ thông minh
      setTimeout(() => {
        const fallbackText = getSmartLocalResponse(textToSend);
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: fallbackText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      }, 700); // Tạo độ trễ tự nhiên
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (query: string) => {
    handleSendMessage(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Tìm app tương ứng với link
    const targetApp = apps.find(app => href.includes(app.url) && app.url.length > 5);
    if (targetApp) {
      if (!hasAccess(targetApp.id)) {
        e.preventDefault();
        alert(`Dạ, ứng dụng "${targetApp.name}" đã hết hạn dùng thử hoặc chưa được mở khóa.\nAnh/Chị vui lòng nâng cấp gói cước để tiếp tục sử dụng nhé ạ!`);
      }
    }
  };

  // Hàm chuyển đổi liên kết Markdown thành thẻ HTML an toàn đơn giản
  const renderMessageText = (text: string) => {
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = mdLinkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const linkText = match[1];
      const linkUrl = match[2];
      const matchIndex = match.index;

      parts.push(
        <a 
          key={matchIndex} 
          href={linkUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={(e) => handleLinkClick(e, linkUrl)}
          className="text-indigo-400 hover:text-indigo-300 underline font-semibold transition-colors"
        >
          {linkText}
        </a>
      );
      lastIndex = mdLinkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="fixed bottom-10 right-8 md:bottom-12 md:right-10 z-[9999] font-sans flex items-end">
      {/* TOOLTIP GỢI Ý KHI CHƯA MỞ CHAT */}
      {!isOpen && (
        <div className="absolute right-full mr-4 bottom-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-2xl rounded-br-sm shadow-[0_0_20px_rgba(79,70,229,0.4)] whitespace-nowrap animate-bounce cursor-pointer" onClick={() => setIsOpen(true)}>
          Cần hỗ trợ? Chat ngay!
        </div>
      )}

      {/* NÚT BẤM BONG BÓNG CHAT NỔI */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer relative focus:outline-none overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.primary}, #1e293b)`,
          boxShadow: `0 8px 32px ${currentTheme.glow}`,
          border: `2px solid ${currentTheme.primary}60`
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {isOpen ? (
            <div className="transition-all duration-200 transform rotate-0 opacity-100 scale-100 flex items-center justify-center">
              <X size={28} />
            </div>
          ) : (
            <div className="relative transition-all duration-200 transform scale-100 opacity-100 flex items-center justify-center w-full h-full">
              {siteConfig?.logoUrl ? (
                <img src={formatDriveImage(siteConfig.logoUrl)} alt="Logo" className="w-full h-full object-cover rounded-full z-10" />
              ) : (
                <MessageSquare size={28} className="text-white z-10" />
              )}
              {/* Vòng sáng đập nhẹ */}
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
              {/* Dot xanh biểu thị online */}
              <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-[3px] border-slate-900 z-20" />
            </div>
          )}
        </div>
      </button>

      {/* HỘP HỘI THOẠI CHAT WIDGET */}
      {isOpen && (
        <div
          className="fixed bottom-24 left-4 right-4 sm:absolute sm:bottom-18 sm:right-0 sm:left-auto sm:w-[400px] h-[480px] sm:h-[550px] max-h-[75vh] sm:max-h-[600px] bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden origin-bottom-right animate-chat-widget-in"
        >
          {/* HEADER CHAT */}
          <div 
            className="p-5 flex items-center justify-between text-white border-b border-slate-800/80 relative"
            style={{ background: `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4))` }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center relative shadow-lg overflow-hidden bg-slate-900"
                style={{ background: `linear-gradient(135deg, ${currentTheme.primary}40, rgba(15, 23, 42, 0.8))` }}
              >
                {siteConfig?.logoUrl ? (
                  <img src={formatDriveImage(siteConfig.logoUrl)} alt="Logo" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <Bot size={20} style={{ color: currentTheme.primary }} />
                )}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Trợ lý ảo VKT <Sparkles size={12} className="text-yellow-400 animate-pulse" />
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  🟢 Trực tuyến hỗ trợ 24/7
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* BONG BÓNG LỊCH SỬ CHAT LOGS */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/40">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div key={m.id} className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md ${isBot ? 'bg-slate-900 border border-slate-800' : 'bg-slate-800'}`}>
                    {isBot ? (
                      siteConfig?.logoUrl ? (
                        <img src={formatDriveImage(siteConfig.logoUrl)} alt="Logo" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <Bot size={14} style={{ color: currentTheme.primary }} />
                      )
                    ) : (
                      <User size={14} className="text-slate-300" />
                    )}
                  </div>
                  {/* Bong bóng tin nhắn */}
                  <div className="flex flex-col max-w-[75%]">
                    <div 
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words border ${
                        isBot 
                          ? 'bg-slate-900/80 text-slate-200 border-slate-800/80 rounded-tl-none' 
                          : 'text-white rounded-tr-none'
                      }`}
                      style={isBot ? {} : { 
                        background: `linear-gradient(135deg, ${currentTheme.primary}ee, ${currentTheme.primary}aa)`,
                        borderColor: `${currentTheme.primary}40`
                      }}
                    >
                      {renderMessageText(m.text)}
                    </div>
                    <span className={`text-[9px] text-slate-600 mt-1 ${isBot ? 'text-left' : 'text-right'}`}>
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* HIỆU ỨNG ĐANG GÕ CHỮ (TYPING INDICATOR) */}
            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md">
                  {siteConfig?.logoUrl ? (
                    <img src={formatDriveImage(siteConfig.logoUrl)} alt="Logo" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <Bot size={14} style={{ color: currentTheme.primary }} />
                  )}
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-900/80 border border-slate-800/80 flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin text-slate-500 mr-1" />
                  <span className="text-xs text-slate-500 italic">Trợ lý đang bóc tách câu hỏi...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* CHIPS GỢI Ý CÂU HỎI NHANH */}
          {messages.length === 1 && (
            <div className="px-5 py-3 border-t border-slate-800/40 bg-slate-950/20">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <HelpCircle size={10} /> Câu hỏi thường gặp:
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {quickSuggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleQuickQuestion(s.query)}
                    className="text-[11px] bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors transition-transform active:scale-[0.98] text-left"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ô NHẬP TIN NHẮN CHAT INPUT */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              placeholder="Nhắn tin hỗ trợ hoặc hỏi trợ lý AI..."
              className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-750 focus:border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg"
              style={{
                background: inputValue.trim() ? `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.primary}dd)` : '#1e293b'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
