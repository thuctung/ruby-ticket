import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { SearchTableType } from "@/types";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const body: SearchTableType = await request.json();

  const { status, in_system }: any = body;

  let query = supabaseAdmin.from(DB_TABLE_NAME.SITES).select("*");
  if (typeof status === "boolean") {
    query.eq("status", status);
  }
  if (typeof in_system === "boolean") {
    query.eq("in_system", in_system);
  }
  const { data, error } = await query;

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
