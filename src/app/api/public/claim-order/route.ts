import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const { orderCode } = await request.json();

  const { data, error } = await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_CUSTOMER_CLAIM_TICKET, {
    p_order_code: orderCode,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ claimed: data === true }, { status: 200 });
}
