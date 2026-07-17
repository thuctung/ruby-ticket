import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME, ERROR_MESSAGE } from "@/commons/constant";
import { KEY_MODIFY_DATA } from "@/app-controler/affi/stats/contants";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { order_id } = body;

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .update({
      status: KEY_MODIFY_DATA.ERROR,
      description: ERROR_MESSAGE.SUN_WORLD_TICKET,
    })
    .eq("id", order_id);
  if (error) {
    return Response.json({ error });
  }
  return Response.json({
    data,
  });
}
