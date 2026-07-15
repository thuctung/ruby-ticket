import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME, LIMIT_TABLE } from "@/commons/constant";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { order_id } = body;

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS_ITEMS)
    .select("*", { count: "exact" })
    .eq("order_id", order_id);

  const { data } = await query;

  return Response.json({
    data,
  });
}
