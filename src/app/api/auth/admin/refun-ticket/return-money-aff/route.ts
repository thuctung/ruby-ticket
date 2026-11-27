import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { UpdateBlanceHistorySubmit } from "@/app-controler/admin/sun-world-booking/type";

export async function POST(req: Request) {
  const { user_id, id, amount, total_fee, price_agent, surcharge }: UpdateBlanceHistorySubmit = await req.json();

  const { data, error } = await supabaseAdmin.rpc('complete_refund', {
     p_id_history:id,
    p_user_id: user_id,
    p_amount :amount,
    p_surcharge:surcharge,
    p_total_fee:total_fee ,
    p_price_agent:price_agent,
  });

  if (error) {
    return Response.json(error, { status: 500 });
  }
  return Response.json({
    data,
  });
}
