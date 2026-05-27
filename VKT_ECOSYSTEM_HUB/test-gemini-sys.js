import fetch from 'node-fetch';

const apiKey = 'AIzaSyAXG2F2P6NwJbsH-CfabbeoR0BVU859MTA';

async function testWithModel(modelName) {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  const systemInstruction = `Bạn là Trợ lý ảo AI thông minh của VKT Ecosystem Hub.
Nhiệm vụ cốt lõi của bạn là đóng vai một nhân viên hỗ trợ cực kỳ thân thiện và chuyên nghiệp.

Dưới đây là DỮ LIỆU ĐÀO TẠO ĐỘC QUYỀN (KNOWLEDGE BASE) lấy từ hệ thống:
---
- Tên website: VKT.HUB
- Slogan: Khơi nguồn sáng tạo — Kiến tạo tương lai 🚀
- Số Hotline/Zalo: 055 979 3678
- Địa chỉ: Hà Nội, Vietnam
- Email: support@kiemtienvu.com
---

QUY TẮC PHẢN HỒI NGHIÊM NGẶT (STRICT CONSTRAINTS):
1. Bạn phải xưng là "Trợ lý VKT" hoặc "Em" và gọi khách hàng là "Anh/Chị".
2. Báo giá: nếu hỏi giá hãy bảo họ liên hệ Hotline: 055 979 3678.`;

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Bạn là ai và có nhiệm vụ gì vậy?' }] }],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7
        }
      })
    });
    
    console.log(`Status for ${modelName}:`, response.status);
    const data = await response.json();
    if (response.ok) {
      console.log(`Text for ${modelName}:`, data.candidates?.[0]?.content?.parts?.[0]?.text);
    } else {
      console.error(`Error for ${modelName}:`, JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error(`Fetch error for ${modelName}:`, e.message);
  }
}

async function run() {
  await testWithModel('gemini-3.5-flash');
  await testWithModel('gemini-3.1-flash-lite');
}

run();
