import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME, END_DATE_GMT7, LIMIT_TABLE, START_DATE_GMT7 } from "@/commons/constant";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { currentPage, user_id, from, to, location } = body;

  const fromIdx = (currentPage - 1) * LIMIT_TABLE;
  const toIdx = fromIdx + LIMIT_TABLE - 1;

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(fromIdx, toIdx);

  if (user_id) {
    query = query.eq("user_id", user_id);
  }
  if (location) {
    query = query.eq("location_code", location);
  }

  if (from) {
    query = query.gte("created_at", `${from}${START_DATE_GMT7}`);
  }

  if (to) {
    query = query.lte("created_at", `${to}${END_DATE_GMT7}`);
  }

  const { data, count, error } = await query;

  return Response.json({
    data,
    totalPages: Math.ceil((count || 0) / LIMIT_TABLE),
    currentPage,
  });
}
