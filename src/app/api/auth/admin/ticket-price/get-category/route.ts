import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function GET(request: Request) {
  const { data, error } = await supabaseAdmin.from(DB_TABLE_NAME.PRODUCT_CATEGORY).select("*");

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
