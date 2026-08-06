import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { SearchTableType } from "@/types";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const body: SearchTableType = await request.json();

  const { site_code }: any = body;

  const { data } = await supabaseAdmin
    .from(DB_TABLE_NAME.PRODUCTS)
    .select("*")
    .eq("site_code", site_code);
  return NextResponse.json(data);
}
