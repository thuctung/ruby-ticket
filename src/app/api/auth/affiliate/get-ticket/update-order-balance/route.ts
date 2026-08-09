import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { PayloadUdateOrderBalanceType } from "@/app-controler/affi/getTicket/type";

export async function POST(req: Request) {
  const {
    order_id,
    user_id,
    balance,
    status,
    description,
    amount,
    orderCode,
  }: PayloadUdateOrderBalanceType = await req.json();
  const { data, error } = await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_UPDATE_ORDER_BALANCE, {
    p_order_id: order_id,
    p_user_id: user_id,
    p_balance: balance,
    p_amount: amount,
    p_status: status,
    p_description: description,
    p_ordercode: orderCode,
  });

  if (error) {
    return Response.json(
      {
        data: error,
      },
      { status: 500 }
    );
  }
  return Response.json(
    {
      data: true,
    },
    { status: 200 }
  );
}
