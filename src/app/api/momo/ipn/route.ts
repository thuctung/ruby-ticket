import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature,
  } = body;

  const accessKey = process.env.MOMO_ACCESS_KEY!;
  const secretKey = process.env.MOMO_SECRET_KEY!;

  const raw =
    `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
    `&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}` +
    `&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}` +
    `&requestId=${requestId}&responseTime=${responseTime}` +
    `&resultCode=${resultCode}&transId=${transId}`;

  const expected = crypto.createHmac("sha256", secretKey).update(raw).digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  console.log("body", body);

  // TODO:
  // 1. Tìm đơn hàng theo orderId
  // 2. Kiểm tra amount khớp với đơn hàng
  // 3. Nếu đơn đã PAID rồi thì bỏ qua (IPN có thể bị gửi lại, phải idempotent)
  // 4. resultCode === 0 → PAID, ngược lại → FAILED

  // Trả 204 để MoMo biết bạn đã nhận
  return new NextResponse(null, { status: 204 });
}
