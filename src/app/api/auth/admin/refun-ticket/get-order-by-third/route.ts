import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const { thirdPartyCode } = await request.json();

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .select("*")
    .eq("third_party_number", thirdPartyCode)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data }, { status: 200 });
}
