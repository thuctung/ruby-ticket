import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { SearchTableType } from "@/types";
import { DB_TABLE_NAME, LIMIT_TABLE } from "@/commons/constant";
import { SearchProductType } from "@/app-controler/admin/product-mgt/type";

export async function POST(request: Request) {
  const body: SearchTableType<SearchProductType> = await request.json();

  const { currentPage, searchValue }: any = body;

  const offset = (currentPage - 1) * LIMIT_TABLE;

  const { name, site_code }: SearchProductType = searchValue;

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.PRODUCTS)
    .select("*", { count: "exact" })
    .order("order", { ascending: false })
    .range(offset, offset + LIMIT_TABLE - 1);

  if (name?.trim()) {
    query = query.ilike("name", `%${name.trim()}%`);
  }

  if (site_code) {
    query = query.eq("site_code", site_code);
  }
  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    listProduct: data || [],
    total: count || 0,
    currentPage,
    totalPages: count ? Math.ceil(count / LIMIT_TABLE) : 0,
  });
}
