import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

import { buildOnePayUrl, getOnePayConfig } from "@/lib/onepay";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ROLES, STATUS_COMMON_TYPE } from "@/commons/constant";

export const runtime = "nodejs";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");

  const ip = request.headers.get("cf-connecting-ip") || forwarded?.split(",")[0]?.trim() || "";

  // OnePay vpc_TicketNo accepts a maximum of 15 characters.
  const ipv4 = ip.match(/(?:\d{1,3}\.){3}\d{1,3}/)?.[0];

  return ipv4 || "0.0.0.0";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const orderCode = String(body.orderCode || "").trim();
    const paymentCode = String(body.paymentCode || "").trim();

    if (!orderCode || !paymentCode) {
      return NextResponse.json({ error: "Missing orderCode or paymentCode" }, { status: 400 });
    }

    // 1. Find existing customer order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(
        `
          id,
          order_code,
          total_amount,
          payment_code,
          status_payment,
          payment_method
        `
      )
      .eq("order_code", orderCode)
      .eq("payment_code", paymentCode)

      .maybeSingle();

    if (orderError) {
      throw orderError;
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or invalid payment code" },
        { status: 404 }
      );
    }

    // 2. Check payment status
    if (String(order.status_payment) === STATUS_COMMON_TYPE.SUCCESS) {
      return NextResponse.json({ error: "Order has already been paid" }, { status: 409 });
    }

    // 3. Validate amount
    const amount = Number(order.total_amount);

    if (!Number.isSafeInteger(amount) || amount <= 0 || amount * 100 > 999999999999) {
      return NextResponse.json({ error: "Invalid order amount" }, { status: 400 });
    }

    if (order.order_code.length > 34) {
      return NextResponse.json(
        { error: "Order code exceeds OnePay OrderInfo limit" },
        { status: 400 }
      );
    }

    // 4. Create unique transaction reference
    const merchTxnRef = `MP${Date.now()}${randomBytes(6).toString("hex")}`;

    // 5. Save payment attempt
    const amountVpc = amount * 100;

    // const { error: insertError } = await supabaseAdmin.from("onepay_transactions").insert({
    //   order_id: order.id,
    //   order_code: order.order_code,
    //   merch_txn_ref: merchTxnRef,
    //   amount_vpc: amountVpc,
    //   currency: "VND",
    //   status: "pending",
    // });

    // if (insertError) {
    //   throw insertError;
    // }

    // 6. Build OnePay request
    const config = getOnePayConfig();

    const params: Record<string, string> = {
      vpc_Version: "2",
      vpc_Currency: "VND",
      vpc_Command: "pay",

      vpc_Merchant: config.merchantId,
      vpc_AccessCode: config.accessCode,

      vpc_Locale: "en",

      vpc_MerchTxnRef: merchTxnRef,
      vpc_OrderInfo: order.order_code,
      vpc_Amount: String(amountVpc),

      vpc_TicketNo: getClientIp(request),

      vpc_CardList: "INTERNATIONAL",

      vpc_ReturnURL: config.returnUrl,
      vpc_CallbackURL: config.ipnUrl,

      AgainLink: process.env.NEXT_PUBLIC_SITE_URL!,
      Title: "MoonPrice - Payment",
    };

    // 7. Generate signed payment URL
    const paymentUrl = buildOnePayUrl(params);

    return NextResponse.json({
      success: true,
      payment_url: paymentUrl,
      merch_txn_ref: merchTxnRef,
    });
  } catch (error) {
    console.error("[OnePay Create Error]", error);

    return NextResponse.json({ error: "Unable to create OnePay payment" }, { status: 500 });
  }
}
