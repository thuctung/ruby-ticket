import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { SearchAffiType, SearchTableType } from "@/types";
import { DB_TABLE_NAME, LIMIT_TABLE } from "@/commons/constant";

export async function POST(request: Request) {
  const body:any = await request.json();

  const { orderCode } = body;

  const {data, error} = await supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .select('user_email')
    .eq('order_code', orderCode)
    .maybeSingle()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
