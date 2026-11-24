import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const { site_code, agent_code } = await request.json();

  let query = supabaseAdmin.from(DB_TABLE_NAME.AGENT_PRICE_DEFAULT).select("*");

  if (site_code) {
    query = query.eq("site_code", site_code);
  }

  if (agent_code) {
    query = query.eq("agent_code", agent_code);
  }
  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
  });
}
