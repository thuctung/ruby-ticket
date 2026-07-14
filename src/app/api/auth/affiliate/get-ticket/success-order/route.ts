import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { ParamCreateTicketAgentType } from "@/types/ticket";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { orderCode, tickets, referenceCode, orderId } = body;

  console.log("body", body);

  const data = await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_COMPLETE_ORDER, {
    p_order_id: orderId,
    p_provider_order_code: orderCode,
    p_tickets: tickets,
    p_reference_code: referenceCode,
  });

  console.log("completeData", data);
  return NextResponse.json(data, { status: 200 });
}
