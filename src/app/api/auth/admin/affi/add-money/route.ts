import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { ProfileUpdateStatusType } from "@/types";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const { user_id, amount, payment_code } = await request.json();

  const { error } = await supabaseAdmin.from(DB_TABLE_NAME.TOPUPS).insert({
    user_id,
    amount,
    payment_code,
    real_amount: amount,
  });

  await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_AFF_ADD_MONEY, {
    amount_to_add: amount,
    payment_code_transf: payment_code,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: {} }, { status: 200 });
}
