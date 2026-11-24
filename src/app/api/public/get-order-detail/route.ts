import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const { orderCode }: any = await request.json();
  console.log("orderCode", orderCode);
  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .select(`*,order_items:order_items (*)`)
    .eq("order_code", orderCode)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data || [] }, { status: 200 });
}
