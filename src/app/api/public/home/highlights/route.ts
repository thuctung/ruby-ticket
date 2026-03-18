import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitRaw = url.searchParams.get("limit");
  const limit = Math.min(24, Math.max(1, Number(limitRaw ?? 9) || 9));

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.LOCATIONS)
    .select("*")
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || [] }, { status: 200 });
}
