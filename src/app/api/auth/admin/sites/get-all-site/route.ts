import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { SearchTableType } from "@/types";
import { DB_TABLE_NAME } from "@/commons/constant";
import { SearchSiteType } from "@/app-controler/admin/site/type";

export async function POST(request: Request) {
  const body: SearchTableType<SearchSiteType> = await request.json();

  const { searchValue } = body;

  const { name, status, in_system } = searchValue;
  let query = supabaseAdmin.from(DB_TABLE_NAME.SITES).select("*");
  if (name) {
    query.ilike("name", `%${name}%`);
  }
  if (in_system) {
    let value = in_system === "true" ? true : false;
    query.eq("in_system", value);
  }
  if (status) {
    let value = status === "true" ? true : false;
    query.eq("status", value);
  }
  const { data, error } = await query;

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
