import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { ProductType } from "@/types/ticket";

export async function POST(request: Request) {
  const body: ProductType = await request.json();

  let payload: any = body;
  if (!payload.id) {
    delete payload.id;
  }

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.PRODUCTS)
    .upsert(payload)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
  return NextResponse.json({ error: "Fail to delete" }, { status: 500 });
}
