import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const { listProducts } = await request.json();
  const { data, error } = await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_SYNC_PRODUCT_PRICE, {
    items: listProducts,
  });

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
