import { KEY_MODIFY_DATA } from "@/app-controler/affi/stats/contants";
import { DB_TABLE_NAME, TYPE_TRANSFER } from "@/commons/constant";
import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payment_content = body.content || "";
    const transferAmount = Number(body.transferAmount);
    const parts = payment_content.trim().split(/\s+/);

    const payment_code = parts[0];
    let resMessage = "";

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

        if (order && order.status === KEY_MODIFY_DATA.PENDING) {
          let status_payment = KEY_MODIFY_DATA.SUCCESS;
          let description = "";
          if (transferAmount < order.total_amount) {
            status_payment = KEY_MODIFY_DATA.ERROR;
            description = "Số tiền thanh toán không đúng";
            resMessage = "Số tiền thanh toán không đúng";
          }
          await supabaseAdmin
            .from(DB_TABLE_NAME.ORDERS)
            .update({
              status_payment,
              paid_at: new Date().toISOString(),
              description,
            })
            .eq("payment_code", payment_code);
        } else {
          resMessage = "Không tìm thấy order phù hợp";
        }
      }
    } else {
      resMessage = "Không tìm thấy mã thanh toán phù hợp";
    }
    if (resMessage) {
      return NextResponse.json({ error: resMessage }, { status: 200 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
