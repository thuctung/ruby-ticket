
import { NextResponse } from "next/server";


import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(req: Request) {
  const { ticket_type_code } = await req.json()

  const { data, error }: any = await supabaseAdmin
    .from(DB_TABLE_NAME.VIEW_TICET_VARIANTS_AND_CATEGORY)
    .select('*')
    .eq('ticket_type_code',ticket_type_code)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}