import { NextResponse } from "next/server";


import { supabaseAdmin } from "@/lib/supabase/server";
import { SearchAffiType, SearchTableType } from "@/types";
import { LIMIT_TABLE } from "@/commons/constant";

export async function POST(request: Request) {
   const body:SearchTableType = await request.json();

   const {
    currentPage,
    searchValue
  } = body;

  const offset = (currentPage - 1) * LIMIT_TABLE;
  const { status,username, email}:SearchAffiType = searchValue

 let query = supabaseAdmin
    .from('profiles')
    .select(
      `
      user_id,
      username,
      full_name,
      email,
      status,
      role,
      created_at
    `,
      { count: "exact" }
    )
    .neq("role", "admin")
    .order("updated_at", { ascending: false })
    .range(offset, offset + LIMIT_TABLE - 1);


const filters = [];

if (username?.trim()) {
  filters.push(`username.ilike.%${username.trim()}%`);
}
if (status?.trim()) {
  filters.push(`status.eq.${status.trim()}`);
}

if (email?.trim()) {
  filters.push(`email.ilike.%${email.trim()}%`);
}

if (filters.length) {
  query = query.or(filters.join(','));
}
  const { data: profiles, error, count } = await query;


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    profiles: profiles || [],
    total: count || 0,
    currentPage,
    totalPages: count ? Math.ceil(count / LIMIT_TABLE) : 0,
  });
}