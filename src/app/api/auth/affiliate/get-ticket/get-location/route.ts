import { NextResponse } from "next/server";


import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function GET(req: Request) {

  const { data, error }: any = await supabaseAdmin
    .from(DB_TABLE_NAME.LOCATIONS)
    .select('*')
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}