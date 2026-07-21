import { supabaseAdmin } from "@/lib/supabase/server";
import { AGENT, DB_TABLE_NAME, END_DATE_GMT7, START_DATE_GMT7 } from "@/commons/constant";
import { KEY_MODIFY_DATA } from "@/app-controler/affi/stats/contants";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { user_id, from, to } = body;

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.VIEW_TICET_SALE)
    .select("quantity, total")
    .eq("status", KEY_MODIFY_DATA.SUCCESS)
    .eq("payment_method", AGENT);

  if (user_id) {
    query = query.eq("user_id", user_id);
  }
  if (from) {
    query = query.gte("created_at", `${from}${START_DATE_GMT7}`);
  }

  if (to) {
    query = query.lte("created_at", `${to}${END_DATE_GMT7}`);
  }
  const { data, error } = await query;

  if (error) {
    return Response.json({});
  }
  return Response.json({
    data,
  });
}
