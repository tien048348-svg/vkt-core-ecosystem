import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PayOS } from '@payos/node';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './_firebase.js';


export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS support
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
    const { userId, planId, planStartDate } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({ error: 'Thiếu thông tin userId hoặc planId' });
    }

    // 1. Lấy thông tin gói dịch vụ từ Firestore
    const planDoc = await getDoc(doc(db, 'plans', planId));
    if (!planDoc.exists()) {
      return res.status(404).json({ error: 'Không tìm thấy gói dịch vụ tương ứng' });
    }
    const plan = planDoc.data();

    // 1.5. Lấy cấu hình Secret API Keys
    const secretsDoc = await getDoc(doc(db, 'settings', 'secrets'));
    const secrets = secretsDoc.exists() ? secretsDoc.data() : {};
    
    const payOS = new PayOS({
      clientId: secrets.payosClientId || process.env.PAYOS_CLIENT_ID || 'dummy_client_id',
      apiKey: secrets.payosApiKey || process.env.PAYOS_API_KEY || 'dummy_api_key',
      checksumKey: secrets.payosChecksumKey || process.env.PAYOS_CHECKSUM_KEY || 'dummy_checksum_key'
    });


    if (!plan.isActive) {
      return res.status(400).json({ error: 'Gói dịch vụ này hiện đã ngừng kích hoạt' });
    }

    const price = plan.price || 0;
    if (price <= 0) {
      return res.status(400).json({ error: 'Gói dịch vụ này có giá bằng 0 hoặc miễn phí. Vui lòng liên hệ Admin.' });
    }

    // 2. Tạo mã giao dịch độc nhất (orderCode) bằng Epoch timestamp (10 chữ số)
    const orderCode = Math.floor(Date.now() / 1000);

    // 3. Chuẩn bị URL điều hướng sau khi thanh toán xong
    const origin = req.headers.origin || 'https://kiemtienvu.com';
    const returnUrl = `${origin}?paymentStatus=success&orderCode=${orderCode}`;
    const cancelUrl = `${origin}?paymentStatus=cancelled&orderCode=${orderCode}`;

    // 4. Định cấu hình description (Chỉ được phép dài tối đa 25 ký tự không dấu)
    const cleanPlanName = plan.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Khử dấu tiếng Việt
      .replace(/[^a-zA-Z0-9 ]/g, '')   // Loại bỏ ký tự đặc biệt
      .substring(0, 15);               // Cắt ngắn

    const description = `VKT ${cleanPlanName}`.substring(0, 25);

    // 5. Chuẩn bị tham số gửi lên PayOS
    const paymentData = {
      orderCode: orderCode,
      amount: price,
      description: description,
      cancelUrl: cancelUrl,
      returnUrl: returnUrl,
      items: [
        {
          name: plan.name,
          quantity: 1,
          price: price
        }
      ]
    };

    // 6. Gọi PayOS tạo Payment Link
    const paymentLinkData = await payOS.paymentRequests.create(paymentData);

    // 7. Ghi nhận giao dịch này vào collection "orders" trên Firestore
    await setDoc(doc(db, 'orders', orderCode.toString()), {
      orderCode: orderCode,
      userId: userId,
      planId: planId,
      planName: plan.name,
      planDurationDays: plan.durationDays,
      planAppIds: plan.appIds || [],
      price: price,
      startDate: planStartDate || new Date().toISOString().split('T')[0],
      status: 'pending',
      paymentUrl: paymentLinkData.checkoutUrl,
      createdAt: new Date().toISOString(),
      completedAt: null
    });

    return res.status(200).json({
      status: 'ok',
      orderCode: orderCode,
      price: price,
      paymentUrl: paymentLinkData.checkoutUrl,
      qrCode: paymentLinkData.qrCode || ''
    });

  } catch (error: any) {
    console.error('Lỗi khi tạo mã thanh toán PayOS:', error);
    return res.status(500).json({
      error: 'Không thể khởi tạo thanh toán tự động với PayOS.',
      details: error.message
    });
  }
}
