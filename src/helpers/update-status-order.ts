import { KEY_MODIFY_DATA } from "@/app-controler/affi/stats/contants";
import { DB_TABLE_NAME } from "@/commons/constant";
import { supabaseAdmin } from "@/lib/supabase/server";

export const updateOrderError = async (orderId: string, errorMessage: string, orderCode = null) => {
  return await supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .update({
      status: KEY_MODIFY_DATA.ERROR,
      order_code: orderCode,
      description: errorMessage,
    })
    .eq("id", orderId);
};
