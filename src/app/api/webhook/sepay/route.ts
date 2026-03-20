import { DB_TABLE_NAME, PAYMENT_STATUS, TYPE_TRANSFER } from "@/commons/constant";
import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payment_content = body.content || "";
    const transferAmount = Number(body.transferAmount);
    const parts = payment_content.trim().split(/\s+/);

    const payment_code = parts[0];

    if (payment_code) {
      const typeTransfer = payment_code.slice(0, 3);

      if (typeTransfer === TYPE_TRANSFER.AFF) {
        // aff nạp tiền
        await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_AFF_ADD_MONEY, {
          amount_to_add: transferAmount,
          payment_code_transf: payment_code,
        });
      } else {
        // customer by ticket
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
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
