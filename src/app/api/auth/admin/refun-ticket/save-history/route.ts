import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { RefundHistorySubmit } from "@/app-controler/admin/sun-world-booking/type";

export async function POST(request: Request) {
  const refundHistorys: RefundHistorySubmit = await request.json();

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.REFUND_HISTORY)
    .insert(refundHistorys)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data }, { status: 200 });
}
