import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { AdminSearchReport, SearchTableType } from "@/types";
import { DB_TABLE_NAME, END_DATE_GMT7, LIMIT_TABLE, START_DATE_GMT7 } from "@/commons/constant";

export async function POST(request: Request) {
  const body: SearchTableType = await request.json();

  const { currentPage, searchValue }: any = body;

  const offset = (currentPage - 1) * LIMIT_TABLE;

  const { from, to, email, payment_method }: AdminSearchReport = searchValue;

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.VIEW_TICET_SALE)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + LIMIT_TABLE - 1);

  if (email?.trim()) {
    query = query.ilike("user_email", `%${email.trim()}%`);
  }

  if (payment_method) {
    query = query.eq("payment_method", payment_method);
  }

  if (from) {
    query = query.gte("created_at", `${from}${START_DATE_GMT7}`);
  }

  if (to) {
    query = query.lte("created_at", `${to}${END_DATE_GMT7}`);
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
