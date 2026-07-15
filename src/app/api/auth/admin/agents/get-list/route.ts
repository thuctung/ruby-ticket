import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { SearchAffiType, SearchTableType } from "@/types";
import { DB_TABLE_NAME, LIMIT_TABLE } from "@/commons/constant";

export async function POST(request: Request) {
  const body: SearchTableType = await request.json();

  const { currentPage } = body;

  const offset = (currentPage - 1) * LIMIT_TABLE;

  const { data, error, count } = await supabaseAdmin
    .from(DB_TABLE_NAME.AGENTS)
    .select("*", { count: "exact" })
    .range(offset, offset + LIMIT_TABLE - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    currentPage,
    totalPages: count ? Math.ceil(count / LIMIT_TABLE) : 0,
  });
}
