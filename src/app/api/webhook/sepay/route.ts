import { DB_TABLE_NAME, PAYMENT_STATUS } from "@/commons/constant";
import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payment_content = body.content || "";
    const transferAmount = Number(body.amount);
    const parts = payment_content.trim().split(/\s+/);

    const payment_code = parts[0];

    if (payment_code) {
      const { data: order, error: findError } = await supabaseAdmin
        .from(DB_TABLE_NAME.ORDERS)
        .select("*")
        .eq("payment_code", payment_code)
        .single();

      if (order && order.status === PAYMENT_STATUS.PENDING) {
        let status = PAYMENT_STATUS.COMPLETED;
        if (transferAmount < order.total_amount) {
          status = PAYMENT_STATUS.FAILED;
        }
        await supabaseAdmin
          .from(DB_TABLE_NAME.ORDERS)
          .update({
            status,
            paid_at: new Date().toISOString(),
          })
          .eq("payment_code", payment_code);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
