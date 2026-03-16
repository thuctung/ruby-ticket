import { NextResponse } from "next/server";


import { supabaseAdmin } from "@/lib/supabase/server";
import { SearchAffiType, SearchTableType } from "@/types";
import { DB_TABLE_NAME, LIMIT_TABLE } from "@/commons/constant";

export async function POST(request: Request) {
   const body:SearchTableType = await request.json();

   const {
    currentPage,
    searchValue
  } = body;

  const offset = (currentPage - 1) * LIMIT_TABLE;
  const { status,username, email}:SearchAffiType = searchValue

 let query = supabaseAdmin
    .from(DB_TABLE_NAME.VIEW_PROFILE_TOPUP)
    .select('*',
      { count: "exact" }
    )
    .range(offset, offset + LIMIT_TABLE - 1);

if (username?.trim()) {
  query = query.ilike("username", `%${username.trim()}%`)
}

if (status?.trim()) {
  query = query.eq("status", status.trim())
}

if (email?.trim()) {
  query = query.ilike("email", `%${email.trim()}%`)
}
  const { data: listTopup, error, count } = await query;


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    listTopup: listTopup || [],
    total: count || 0,
    currentPage,
    totalPages: count ? Math.ceil(count / LIMIT_TABLE) : 0,
  });
}