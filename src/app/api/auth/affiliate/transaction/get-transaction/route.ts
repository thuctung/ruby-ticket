import { NextResponse } from "next/server";


import { supabaseAdmin } from "@/lib/supabase/server";
import { SearchTableType } from "@/types";
import { DB_TABLE_NAME, LIMIT_TABLE } from "@/commons/constant";

export async function POST(req: Request) {
  const body:any  =  await req.json();
  const {
        currentPage,
        user_id,
        type,
        from,
        to,
    } = body;

  const fromIdx = (currentPage - 1) * LIMIT_TABLE
  const toIdx = fromIdx + LIMIT_TABLE - 1

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.WALLET_TRANSACTION)
    .select("*", { count: "exact" })
    .order('created_at',{ascending:false})

 // filter user
  if (user_id) {
    query = query.eq("user_id", user_id)
  }
 if (type) {
    query = query.eq("type", type)
  }

  // filter date
  if (from) {
    query = query.gte("created_at", `${from}T00:00:00`)
  }

  if (to) {
    query = query.lte("created_at", `${to}T23:59:59`)
  }

  // pagination
  query = query.range(fromIdx, toIdx)

  const { data, count, error } = await query

  return Response.json({
    data,
    totalPages: Math.ceil((count || 0) / LIMIT_TABLE),
    currentPage
  })
}


