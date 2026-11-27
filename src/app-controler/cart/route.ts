import { NextResponse } from "next/server";
import { calcTotals, findCoupon } from "./calc";
import { validateCustomer } from "./components/customer";
import type { PaymentMethodId } from "./types";

const METHODS: PaymentMethodId[] = ["qr", "card"];

// Mã duy nhất, chỉ gồm chữ + số (ngân hàng không nhận ký tự đặc biệt trong nội dung CK)
function genOrderCode() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MOON${t}${r}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const items: any[] = body?.items;
  const method: PaymentMethodId = body?.method;
  const couponCode: string | null = body?.couponCode ?? null;

  if (!Array.isArray(items) || items.length === 0 || !METHODS.includes(method)) {
    return NextResponse.json({ error: "Dữ liệu đơn hàng không hợp lệ." }, { status: 400 });
  }

  const customerErrors = validateCustomer(body?.customer);
  if (Object.keys(customerErrors).length > 0) {
    return NextResponse.json(
      { error: "Thông tin liên hệ không hợp lệ.", fields: customerErrors },
      { status: 400 }
    );
  }

  const customer = {
    name: String(body.customer.name).trim(),
    email: String(body.customer.email).trim().toLowerCase(),
    phone: String(body.customer.phone).replace(/[\s.-]/g, ""),
  };

  const coupon = findCoupon(couponCode);
  if (couponCode && !coupon) {
    return NextResponse.json({ error: "Mã giảm giá không hợp lệ." }, { status: 400 });
  }

  // TODO (bắt buộc khi lên production): lấy giá theo item.id từ DB,
  // KHÔNG tin price do client gửi lên.
  const { total } = calcTotals(items, coupon);
  const orderCode = genOrderCode();

  // TODO: gửi email vé tới customer.email sau khi webhook xác nhận đã thanh toán

  if (method === "qr") {
    return NextResponse.json({ orderCode, amount: total });
  }

  // card -> chuyển khách sang cổng thanh toán thẻ, đính kèm mã đơn
  const base = process.env.PAYMENT_GATEWAY_URL;
  if (!base) {
    return NextResponse.json({ error: "Chưa cấu hình PAYMENT_GATEWAY_URL." }, { status: 500 });
  }
  const origin = new URL(req.url).origin;
  const url = new URL(base);
  url.searchParams.set("orderCode", orderCode); // đổi tên tham số theo cổng (vd VNPay: vnp_TxnRef)
  url.searchParams.set("amount", String(total));
  url.searchParams.set("method", method);
  url.searchParams.set("returnUrl", `${origin}/cart/result?code=${orderCode}`);

  return NextResponse.json({ orderCode, amount: total, paymentUrl: url.toString() });
}
