import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { SearchTableType } from "@/types";
import { DB_TABLE_NAME, END_DATE_GMT7, LIMIT_TABLE, START_DATE_GMT7 } from "@/commons/constant";
import { SearchRefunType } from "@/app-controler/admin/sun-world-booking/type";

export async function POST(request: Request) {
  const body: SearchTableType<SearchRefunType> = await request.json();

  const { currentPage, searchValue }: any = body;

  const offset = (currentPage - 1) * LIMIT_TABLE;

  const { from, to, email, site_code, third_party_number }: SearchRefunType = searchValue;

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.REFUND_HISTORY)
    .select("*", { count: "exact" })
    .order("created_date", { ascending: false })
    .range(offset, offset + LIMIT_TABLE - 1);

  if (email?.trim()) {
    query = query.ilike("email_order", `%${email.trim()}%`);
  }

  if (third_party_number) {
    query = query.eq("third_party_number", third_party_number);
  }

  if (site_code) {
    query = query.eq("site_code", site_code);
  }

  if (from) {
    query = query.gte("created_date", `${from}${START_DATE_GMT7}`);
  }

  if (to) {
    query = query.lte("created_date", `${to}${END_DATE_GMT7}`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    listHistory: data || [],
    total: count || 0,
    currentPage,
    totalPages: count ? Math.ceil(count / LIMIT_TABLE) : 0,
  });
}
