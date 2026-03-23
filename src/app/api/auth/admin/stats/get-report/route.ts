import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import {  AdminSearchReport, SearchTableType } from "@/types";
import { DB_TABLE_NAME, LIMIT_TABLE } from "@/commons/constant";

export async function POST(request: Request) {
  const body: SearchTableType = await request.json();

  const { currentPage, searchValue } :any= body;

  const offset = (currentPage - 1) * LIMIT_TABLE;

  const { location, from, to, email }: AdminSearchReport = searchValue;

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.VIEW_ADMIN_REPORT)
    .select("*", { count: "exact" })
    .order("sale_date", { ascending: false })
    .range(offset, offset + LIMIT_TABLE - 1);

  if (email?.trim()) {
    query = query.ilike("user_email", `%${email.trim()}%`);
  }

  if (location?.trim()) {
    query = query.eq("location_code", location.trim());
  }

    if (from) {
    query = query.gte("sale_date", `${from}T00:00:00`);
  }

  if (to) {
    query = query.lte("sale_date", `${to}T23:59:59`);
  }


  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    listOrder: data || [],
    total: count || 0,
    currentPage,
    totalPages: count ? Math.ceil(count / LIMIT_TABLE) : 0,
  });
}
