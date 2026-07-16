import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { AGENT, DB_TABLE_NAME } from "@/commons/constant";
import { ParamCreateTicketAgentType } from "@/types/ticket";

export async function POST(req: Request) {
  const body: ParamCreateTicketAgentType = await req.json();
  const { user_id, items, total_amount, date_use, email, side_code, thirdPartyNum } = body;

  const { data, error } = await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_CREATE_ORDER_PENDING, {
    p_user_id: user_id,
    p_list_ticket_submit: items,
    p_total_amount: total_amount,
    p_user_email: email,
    p_date_use: date_use,
    p_order_des: "Rút vé",
    p_payment_method: AGENT,
    p_side_code: side_code,
    p_third_party_num: thirdPartyNum,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const orderId = data.order_id;

  return NextResponse.json({ order_id: orderId }, { status: 200 });
}
