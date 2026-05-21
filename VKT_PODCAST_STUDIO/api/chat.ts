import type { VercelRequest, VercelResponse } from '@vercel/node';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './_firebase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Thiết lập các header CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST' });
  }

  try {
    const secretsDoc = await getDoc(doc(db, 'settings', 'secrets'));
    const secrets = secretsDoc.exists() ? secretsDoc.data() : {};
    
    const apiKey = secrets.geminiApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY chưa được cấu hình. Vui lòng cập nhật trong phần Cài Đặt Hệ Thống.' 
      });
    }
    const { messages, apps = [], plans = [], siteConfig = {} } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Yêu cầu truyền mảng tin nhắn (messages)' });
    }

    // Lọc và chuyển đổi định dạng tin nhắn cho phù hợp với API Gemini
    // Định dạng Gemini: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const formattedContents = messages.map((m: any) => {
      const role = m.sender === 'user' ? 'user' : 'model';
      return {
        role: role,
        parts: [{ text: m.text }]
      };
    });

    // Tạo hướng dẫn hệ thống (System Instruction) nạp ngữ cảnh thời gian thực và Dữ liệu Đào Tạo (Knowledge Base)
    const activeAppsText = apps
      .map((app: any) => {
        let text = `- **${app.name}** (ID: ${app.id}): ${app.description}. Link app: ${app.url}`;
        if (app.aiKnowledge && app.aiKnowledge.trim() !== '') {
          text += `\n  <CHI_TIET_TRI_THUC>\n  ${app.aiKnowledge}\n  </CHI_TIET_TRI_THUC>`;
        }
        return text;
      })
      .join('\n\n');

    const activePlans = plans ? plans.filter((p: any) => p && p.isActive) : [];
    
    let activePlansText = '';
    let pricingRule = '';

    if (activePlans.length > 0) {
      activePlansText = activePlans
        .map((p: any) => `- **${p.name || 'Gói cước'}** (${p.durationDays || 30} ngày): Giá ${(p.price || 0).toLocaleString('vi-VN')} VND. Áp dụng cho app ID: ${p.appIds && p.appIds.length > 0 ? p.appIds.join(', ') : 'Tất cả ứng dụng'}`)
        .join('\n');
      pricingRule = `4. BÁO GIÁ & ĐĂNG KÝ: Nếu khách hàng muốn đăng ký hoặc hỏi về giá, hãy báo giá dựa trên BẢNG GIÁ ở trên và hướng dẫn họ bấm nút "Đăng ký ngay" ở phần "Bảng Giá Dịch Vụ" trên trang chủ để thanh toán tự động, hoặc nhắn qua Zalo/Hotline: ${siteConfig.hotline || ''} để Admin hỗ trợ.`;
    } else {
      activePlansText = 'Hiện tại chưa có bảng giá nào được công bố.';
      pricingRule = `4. ĐANG MIỄN PHÍ TRẢI NGHIỆM: Hiện tại chưa có gói cước nào được bật, nghĩa là hệ thống ĐANG MIỄN PHÍ hoàn toàn. Nếu khách hàng hỏi về giá cả, hãy trả lời một cách tự hào, thân thiện và hấp dẫn rằng: "Hiện tại hệ sinh thái VKT đang trong chương trình MIỄN PHÍ 100% để mọi người trải nghiệm mọi tính năng cao cấp! Bạn hãy thoải mái sử dụng nhé!"`;
    }

    const corePrompt = siteConfig.aiSystemPrompt || `Bạn là Trợ lý ảo AI thông minh và thân thiện của VKT Studio (VKT Ecosystem Hub).\nNhiệm vụ của bạn là giải đáp tất cả thắc mắc của khách hàng về hệ sinh thái VKT.`;

    const systemInstruction = `${corePrompt}

Dưới đây là DỮ LIỆU ĐÀO TẠO ĐỘC QUYỀN (KNOWLEDGE BASE) lấy từ hệ thống:
---
- Tên website: ${siteConfig.siteTitle || 'VKT.HUB'}
- Slogan: ${siteConfig.slogan || ''}
- Số Hotline/Zalo: ${siteConfig.hotline || '055 979 3678'}
- Địa chỉ: ${siteConfig.address || ''}
- Email: ${siteConfig.email || 'support@kiemtienvu.com'}

* DANH SÁCH ỨNG DỤNG VÀ TRI THỨC CHUYÊN SÂU TỪ FILE MD:
${activeAppsText || 'Không có ứng dụng nào hiển thị.'}

* DANH SÁCH GÓI DỊCH VỤ / BẢNG GIÁ:
${activePlansText || 'Không có bảng giá nào.'}
---

QUY TĂC PHẢN HỒI NGHIÊM NGẶT (STRICT CONSTRAINTS):
1. TUYỆT ĐỐI KHÔNG tự sáng tác, bịa đặt hoặc lấy kiến thức ngoài lề. BẠN CHỈ ĐƯỢC PHÉP trả lời dựa trên nội dung bên trong DỮ LIỆU ĐÀO TẠO ĐỘC QUYỀN ở trên.
2. KHI THIẾU THÔNG TIN: Nếu khách hàng hỏi những thông tin KHÔNG CÓ trong dữ liệu đào tạo (sản phẩm khác, tính năng chưa cập nhật, v.v.), TUYỆT ĐỐI KHÔNG BỊA ĐẶT. Hãy khéo léo trả lời rằng: "Hiện tại thông tin này chưa có sẵn trên hệ thống. Để được hỗ trợ chính xác nhất, bạn vui lòng liên hệ trực tiếp với Admin qua Zalo/Hotline: ${siteConfig.hotline || ''} hoặc Email: ${siteConfig.email || 'support@kiemtienvu.com'} nhé!"
3. Chú ý cách xưng hô đã được chỉ định ở phần chỉ thị cốt lõi.
${pricingRule}
5. ĐẶC BIỆT: Nếu khách hàng yêu cầu thiết kế/viết thêm phần mềm mới chưa có trên hệ thống, hoặc muốn nâng cấp/thêm tính năng đặc biệt, hãy trả lời thật chuyên nghiệp rằng: "Bên mình hoàn toàn có thể tùy chỉnh và phát triển phần mềm theo yêu cầu riêng của bạn. Để trao đổi chi tiết và nhận báo giá, bạn vui lòng liên hệ trực tiếp với Admin qua Zalo: ${siteConfig.hotline || ''} hoặc Email: ${siteConfig.email || 'support@kiemtienvu.com'} nhé!"
6. Giữ câu trả lời gọn gàng, chia đoạn rõ ràng bằng Markdown.
7. THÁI ĐỘ PHỤC VỤ: Luôn luôn giữ thái độ cực kỳ chuyên nghiệp, lịch sự, thân thiện và nhiệt tình trong mọi tình huống. Tuyệt đối không được cáu gắt, cộc lốc hay khó chịu. Phải làm cho khách hàng cảm thấy thoải mái, hứng thú và được tôn trọng tối đa. (Nhắc lại: LUÔN CHUYÊN NGHIỆP VÀ TUYỆT ĐỐI KHÔNG BỊA ĐẶT).`;

    // Gọi API Gemini 2.5 Flash
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: formattedContents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Lỗi phản hồi từ Gemini API:', errText);
      return res.status(geminiResponse.status).json({ 
        error: 'Lỗi khi gọi API xử lý từ Google Gemini', 
        details: errText 
      });
    }

    const resJson = await geminiResponse.json();
    const generatedText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, tôi chưa xử lý được câu trả lời này.';

    return res.status(200).json({ text: generatedText });

  } catch (error: any) {
    console.error('Lỗi xảy ra tại Handler Chat API:', error);
    return res.status(500).json({ 
      error: 'Không thể phản hồi tin nhắn do lỗi hệ thống cục bộ.', 
      details: error.message 
    });
  }
}
