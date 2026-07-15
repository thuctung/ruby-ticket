import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { AgentPriceSubmitType } from "@/app-controler/admin/pricing/type";

export async function POST(request: Request) {
  const { site_code, agent_code, price }: AgentPriceSubmitType = await request.json();

  const { data: existed, error: checkError } = await supabaseAdmin
    .from(DB_TABLE_NAME.AGENT_PRICE)
    .select("id")
    .eq("site_code", site_code)
    .eq("agent_code", agent_code)
    .maybeSingle();

  if (checkError) {
    return NextResponse.json({ message: checkError.message }, { status: 500 });
  }

  if (existed) {
    return NextResponse.json({ message: "Cặp Khu vực và Level đã tồn tại" }, { status: 200 });
  }

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.AGENT_PRICE)
    .insert({
      site_code,
      agent_code,
      price,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
