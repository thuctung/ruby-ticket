import { KEY_MODIFY_DATA } from "@/app-controler/affi/stats/contants";
import { DB_TABLE_NAME, PAYMENT_STATUS, TYPE_TRANSFER } from "@/commons/constant";
import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId, status, description, status_payment = null } = await req.json();

    await supabaseAdmin
      .from(DB_TABLE_NAME.ORDERS)
      .update({
        status,
        description,
        status_payment,
      })
      .eq("id", orderId);
    return NextResponse.json({ data: orderId }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
