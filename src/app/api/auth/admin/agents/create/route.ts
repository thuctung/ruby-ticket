import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { AgentType } from "@/types";
import { DB_TABLE_NAME, LIMIT_TABLE } from "@/commons/constant";

export async function POST(request: Request) {
  const body: AgentType = await request.json();

  const { id, name, code } = body;

  if (id) {
    const { data, error } = await supabaseAdmin
      .from(DB_TABLE_NAME.AGENTS)
      .update({
        name,
        code,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 200 });
    return NextResponse.json(data);
  } else {
    const { data } = await supabaseAdmin
      .from(DB_TABLE_NAME.AGENTS)
      .select("id")
      .eq("code", code)
      .maybeSingle();
    if (data) {
      return NextResponse.json({ error: "Mã đã tồn tại" });
    } else {
      const { data, error } = await supabaseAdmin
        .from(DB_TABLE_NAME.AGENTS)
        .insert({
          name,
          code,
        })
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data });
    }
  }
}
