import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const { id } = await request.json();
  const { data, error } = await supabaseAdmin.from(DB_TABLE_NAME.PRODUCTS).delete().eq("id", id);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json({ data: id }, { status: 200 });
}
