import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { user_id, from, to } = body;

  let query = supabaseAdmin.from(DB_TABLE_NAME.VIEW_TICET_SALE).select("quantity, total");

  if (user_id) {
    query = query.eq("user_id", user_id);
  }
  if (from) {
    query = query.gte("created_at", `${from}T00:00:00`);
  }

  if (to) {
    query = query.lte("created_at", `${to}T23:59:59`);
  }

  const { data, error } = await query;
  if (error) {
    return Response.json({});
  }
  return Response.json({
    data,
  });
}
