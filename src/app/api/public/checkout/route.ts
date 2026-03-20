import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME, PAYMENT_STATUS, TYPE_TRANSFER } from "@/commons/constant";
import { getCodeTopup } from "@/helpers/genCode";

export async function POST(request: Request) {
  const { user_email, total_amount, phone, description } = await request.json();
  const payment_code = getCodeTopup(TYPE_TRANSFER.CUSTOMER);
  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .insert([
      {
        user_email,
        total_amount,
        phone,
        description,
        status: PAYMENT_STATUS.PENDING,
        payment_code,
      },
    ])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ orderId: data.id, paymentContent: payment_code }, { status: 200 });
}
