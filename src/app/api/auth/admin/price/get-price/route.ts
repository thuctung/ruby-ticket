import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const { siteCode } = await request.json();
  const { data, error }: any = await supabaseAdmin
    .from(DB_TABLE_NAME.AGENT_PRICE)
    .select("*")
    .eq("site_code", siteCode);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
