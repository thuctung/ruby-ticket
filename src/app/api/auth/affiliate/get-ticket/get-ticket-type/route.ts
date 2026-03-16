import { NextResponse } from "next/server";


import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(req: Request) {
  const { loaction } = await req.json()

  const { data, error }: any = await supabaseAdmin
    .from(DB_TABLE_NAME.TICKET_TYPES)
    .select('*')
    .eq('location_code', loaction)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}