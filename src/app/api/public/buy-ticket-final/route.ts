import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { KEY_MODIFY_DATA } from "@/app-controler/affi/stats/contants";
import { CustomerBuyFilnalType } from "@/app-controler/checkout-client/type";

export async function POST(req: Request) {
  const {
    orderCode,
    tickets,
    referenceCode,
    orderId,
    isError,
    description,
  }: CustomerBuyFilnalType = await req.json();

  if (isError) {
    const { data, error } = await supabaseAdmin
      .from(DB_TABLE_NAME.ORDERS)
      .update({
        status: KEY_MODIFY_DATA.ERROR,
        description,
      })
      .eq("id", orderId);
    if (error) return NextResponse.json(error, { status: 500 });
    return NextResponse.json(data, { status: 200 });
  } else {
    const { data, error } = await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_COMPLETE_ORDER_CUSTOMER, {
      p_order_id: orderId,
      p_provider_order_code: orderCode,
      p_tickets: tickets,
      p_reference_code: referenceCode,
    });
    if (error) return NextResponse.json(error, { status: 500 });
    return NextResponse.json(data, { status: 200 });
  }
}
