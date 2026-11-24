import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { UpdatePaymentStatusType } from "@/types";

export async function POST(request: Request) {
  const { orderCode, status, message }: UpdatePaymentStatusType = await request.json();

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .update({
      status_payment: status,
      description: message,
    })
    .eq("order_code", orderCode);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}
