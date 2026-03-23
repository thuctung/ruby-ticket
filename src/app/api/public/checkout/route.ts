import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const { user_email, total_amount, phone, description, listTicketSubmit , paymentCode, promoCode} = await request.json();
  console.log('promoCode',promoCode)
  const { data, error } = await supabaseAdmin.rpc(DB_TABLE_NAME.FUC_CUSTOMER_BUY_TICKET, {
    c_user_email: user_email,
    c_total_amount: total_amount,
    c_phone: phone,
    c_description: description,
    c_payment_code: paymentCode,
    c_promo_code:promoCode || '',
    list_ticket_submit: listTicketSubmit,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: true}, { status: 200 });
}
