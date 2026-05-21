import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PayOS } from '@payos/node';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './_firebase.js';

// Khởi tạo SDK PayOS với các biến môi trường
const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID || 'dummy_client_id',
  apiKey: process.env.PAYOS_API_KEY || 'dummy_api_key',
  checksumKey: process.env.PAYOS_CHECKSUM_KEY || 'dummy_checksum_key'
});

// Helper tính ngày hết hạn
function calcExpiryDate(startDate: string, durationDays: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + durationDays);
  return d.toISOString().split('T')[0];
}

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
    const body = req.body;

    // 1. Xác thực webhook an toàn bằng SDK PayOS
    // Điều này đảm bảo dữ liệu gửi đến là chuẩn từ PayOS và không bị chỉnh sửa (chống hack hoàn toàn)
    const verifiedData = await payOS.webhooks.verify(body);

    if (!verifiedData) {
      return res.status(400).json({ error: 'Dữ liệu Webhook không hợp lệ hoặc sai chữ ký' });
    }

    const { orderCode, amount } = verifiedData;

    // 2. Tìm đơn hàng tương ứng trong Firestore
    const orderRef = doc(db, 'orders', orderCode.toString());
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return res.status(404).json({ error: `Không tìm thấy đơn hàng mã ${orderCode} trên Firestore` });
    }

    const orderData = orderDoc.data();

    // 3. Kiểm tra nếu đơn hàng đang ở trạng thái pending thì tiến hành xử lý kích hoạt
    if (orderData.status === 'pending') {
      const { userId, planId, planName, planDurationDays, planAppIds, startDate } = orderData;

      // Tìm thông tin người dùng tương ứng trên Firestore
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error(`Không tìm thấy người dùng ${userId} để kích hoạt dịch vụ`);
        return res.status(404).json({ error: 'Không tìm thấy thông tin người dùng trên hệ thống' });
      }

      const userData = userDoc.data();

      // Tính ngày hết hạn dựa trên ngày bắt đầu và thời hạn của gói
      const expiryDate = calcExpiryDate(startDate, planDurationDays);

      // Cập nhật quyền hạn truy cập các app cho user
      const newAppAccess = userData.appAccess ? { ...userData.appAccess } : {};

      // Nếu planAppIds rỗng = tất cả app. Chúng ta sẽ lấy danh sách app hoặc mặc định các app chính.
      // Để chính xác, nếu rỗng chúng ta kích hoạt cho toàn bộ 3 app hiện tại: "kids-cartoon", "dharma-studio", "recyclestyles"
      const targetApps = (!planAppIds || planAppIds.length === 0) 
        ? ["kids-cartoon", "dharma-studio", "recyclestyles"] 
        : planAppIds;

      targetApps.forEach((appId: string) => {
        newAppAccess[appId] = {
          enabled: true,
          startDate: startDate,
          durationDays: planDurationDays,
          expiryDate: expiryDate
        };
      });

      // Tạo cấu trúc thông tin Gói đang hoạt động
      const updatedActivePlan = {
        planId: planId,
        planName: planName,
        startDate: startDate,
        durationDays: planDurationDays,
        expiryDate: expiryDate,
        appIds: planAppIds || []
      };

      // Thực hiện ghi đồng thời (Cập nhật quyền user và ghi nhận đơn hàng thành công)
      await setDoc(userRef, {
        appAccess: newAppAccess,
        assignedPlan: planName,
        activePlan: updatedActivePlan
      }, { merge: true });

      // Cập nhật trạng thái đơn hàng thành công
      await setDoc(orderRef, {
        status: 'success',
        completedAt: new Date().toISOString(),
        callbackRaw: verifiedData // lưu log đối soát của PayOS
      }, { merge: true });

      console.log(`[Thanh toán tự động] Kích hoạt thành công đơn hàng VKT ${orderCode} cho user ${userId}`);
    } else {
      console.log(`[Thanh toán tự động] Đơn hàng ${orderCode} đã được xử lý từ trước với trạng thái: ${orderData.status}`);
    }

    // Phản hồi thành công cho PayOS biết để không gửi lại webhook
    return res.status(200).json({
      status: 'ok',
      message: 'Giao dịch đã được xử lý thành công'
    });

  } catch (error: any) {
    console.error('Lỗi khi tiếp nhận Webhook PayOS:', error);
    return res.status(500).json({
      error: 'Lỗi hệ thống khi xử lý webhook thanh toán.',
      details: error.message
    });
  }
}
