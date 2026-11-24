import { DB_TABLE_NAME, STATUS_COMMON_TYPE } from "@/commons/constant";
import { supabaseAdmin } from "@/lib/supabase/server";

export const updateOrderError = async (orderId: string, errorMessage: string, orderCode = null) => {
  return await supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .update({
      status: STATUS_COMMON_TYPE.ERROR,
      order_code: orderCode,
      description: errorMessage,
    })
    .eq("id", orderId);
};
