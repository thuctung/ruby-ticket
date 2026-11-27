import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const { email } = await request.json();

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.PROFILES)
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data }, { status: 200 });
}
