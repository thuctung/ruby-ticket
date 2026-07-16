import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME, END_DATE_GMT7, START_DATE_GMT7 } from "@/commons/constant";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { user_id, from, to } = body;

  let query = supabaseAdmin.from(DB_TABLE_NAME.VIEW_TICET_SALE).select("quantity, total_amount");

  if (from) {
    query = query.gte("sale_date", `${from}${START_DATE_GMT7}`);
  }

  if (to) {
    query = query.lte("sale_date", `${to}${END_DATE_GMT7}`);
  }

  const { data, error } = await query;
  if (error) {
    return Response.json({});
  }
  return Response.json({
    data,
  });
}
