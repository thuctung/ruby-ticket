import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { get } from "lodash";

export async function POST(request: Request) {
  const { thirpary, productCode } = await request.json();

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .select("*")
    .eq("third_party_number", thirpary)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data?.id) {
    const { data: dataOrderIem, error: errorOrderItem } = await supabaseAdmin
      .from(DB_TABLE_NAME.ORDERS_ITEMS)
      .select("*")
      .eq("order_id", data.id)
      .eq("product_code", productCode);

    if (errorOrderItem) {
      return NextResponse.json({ error: errorOrderItem.message }, { status: 500 });
    }

    const orderItemPrice = get(dataOrderIem, [0,'price']) ||0

    return NextResponse.json({ data: orderItemPrice }, { status: 200 });
  }
  return NextResponse.json({ data: {} }, { status: 200 });
}
