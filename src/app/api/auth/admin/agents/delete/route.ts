import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { AgentType } from "@/types";
import { DB_TABLE_NAME, LIMIT_TABLE } from "@/commons/constant";

export async function POST(request: Request) {
  const body: AgentType = await request.json();

  const { id } = body;
  if (id) {
    const { data, error } = await supabaseAdmin
      .from(DB_TABLE_NAME.AGENTS)
      .delete()
      .eq("id", id)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 200 });
    return NextResponse.json({ message: "success" });
  }
  return NextResponse.json({ error: "Fail to delete" }, { status: 500 });
}
