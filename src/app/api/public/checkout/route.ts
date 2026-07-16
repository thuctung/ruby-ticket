import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const {
    userEmail,
    totalAmount,
    dateUse,
    phone,
    fullname,
    thirdPartyNum,
    listTicketSubmit,
    siteCode,
    paymentCode,
  } = await request.json();

  console.log("listTi", listTicketSubmit);
  console.log("totalAmount", totalAmount);

  const { data, error } = await supabaseAdmin.rpc(DB_TABLE_NAME.FUC_CUSTOMER_BUY_TICKET, {
    c_total_amount: totalAmount,
    c_user_email: userEmail,
    c_phone: phone,
    c_fullname: fullname,
    c_payment_code: paymentCode,
    c_site_code: siteCode,
    c_third_party_num: thirdPartyNum,
    c_date_use: dateUse,
    list_ticket_submit: listTicketSubmit,
  });

  console.log("data", data);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data }, { status: 200 });
}
