import { DB_TABLE_NAME } from "@/commons/constant";
import { supabaseAdmin } from "@/lib/supabase/server";
import axios from "axios";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { orderCode: internalOrderId, totalPayment } = await req.json();

  const amount = totalPayment;

  const partnerCode = process.env.MOMO_PARTNER_CODE!;
  const accessKey = process.env.MOMO_ACCESS_KEY!;
  const secretKey = process.env.MOMO_SECRET_KEY!;

  const requestId = `${partnerCode}${Date.now()}`;
  const orderId = `${internalOrderId}_${Date.now()}`; // orderId gửi MoMo phải duy nhất
  const orderInfo = `Thanh toan ve ${internalOrderId}`;
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/payment/result`;
  const ipnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/momo/ipn`;
  const requestType = "payWithMethod";
  const extraData = "";

  // Thứ tự các trường phải đúng theo bảng chữ cái
  const rawSignature =
    `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
    `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
    `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
    `&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

  const { data } = await axios.post(process.env.MOMO_ENDPOINT!, {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: "vi",
    orderExpireTime: 10,
  });

  if (data.resultCode !== 0) {
    return NextResponse.json({ message: data.message }, { status: 400 });
  }
  // Lưu orderId/requestId của MoMo vào đơn hàng để đối soát ở IPN
  await supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .update({
      momo_payment_id: orderInfo,
    })
    .eq("order_code", internalOrderId);
  return NextResponse.json({ payUrl: data.payUrl });
}
