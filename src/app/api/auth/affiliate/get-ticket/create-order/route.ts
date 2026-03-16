
import { NextResponse } from "next/server";


import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(req: Request) {
  const { user_id, items } = await req.json()

  const { data, error } = await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_BY_TICKET, {
    listticketsubmit: items,
    user_id,
  })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}