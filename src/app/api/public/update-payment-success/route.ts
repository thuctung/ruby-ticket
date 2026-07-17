import { KEY_MODIFY_DATA } from "@/app-controler/affi/stats/contants";
import { DB_TABLE_NAME, PAYMENT_STATUS, TYPE_TRANSFER } from "@/commons/constant";
import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { paymentCode } = await req.json();

    if (paymentCode) {
      const { data: order, error: findError } = await supabaseAdmin
        .from(DB_TABLE_NAME.ORDERS)
        .select("*")
        .eq("payment_code", paymentCode)
        .single();
      if (order && order.status_payment === KEY_MODIFY_DATA.PENDING) {
        await supabaseAdmin
          .from(DB_TABLE_NAME.ORDERS)
          .update({
            status_payment: KEY_MODIFY_DATA.SUCCESSS,
            paid_at: new Date().toISOString(),
          })
          .eq("payment_code", paymentCode);
      }
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
