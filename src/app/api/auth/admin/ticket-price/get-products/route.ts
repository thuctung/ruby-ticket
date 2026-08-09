import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { SearchTableType } from "@/types";
import { DB_TABLE_NAME } from "@/commons/constant";
import { SearchProductType } from "@/app-controler/admin/ticket-price/type";

export async function POST(request: Request) {
  const body: SearchTableType<SearchProductType> = await request.json();

  const { searchValue } = body;

  const { name, personType, siteCode } = searchValue;
  let query = supabaseAdmin.from(DB_TABLE_NAME.PRODUCTS).select("*");
  if (name) {
    query.ilike("name", `%${name}%`);
  }
  if (personType) {
    query.eq("personType", personType);
  }
  if (siteCode) {
    query.eq("site_code", siteCode);
  }
  const { data, error } = await query;

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
