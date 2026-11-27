import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { UpdateOrderItemCancelSubmit } from "@/app-controler/admin/sun-world-booking/type";

export async function POST(req: Request) {
  const { third_party_number, quantity, product_code }: UpdateOrderItemCancelSubmit =
    await req.json();

  const { data, error } = await supabaseAdmin.rpc(DB_TABLE_NAME.RF_UPDATE_ORDER_ITEM_CANCEL, {
    p_third_party_number: third_party_number,
    p_quantity: quantity,
    p_product_code: product_code,
  });

  if (error) {
    return Response.json(error, { status: 500 });
  }
  return Response.json({
    data,
  });
}
