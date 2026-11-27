import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME, STATUS_COMMON_TYPE } from "@/commons/constant";

export async function POST(request: Request) {
  const { thirdPartyCode }: any = await request.json();
  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.VIEW_TICKET_SALE_SUMARY)
    .select("*")
    .eq("third_party_number", thirdPartyCode)
    .eq("status", STATUS_COMMON_TYPE.SUCCESS);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || [] }, { status: 200 });
}
