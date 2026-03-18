import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function GET() {
  const { data: pricing, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.PRICING)
    .select("*")
    .order("product_key", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    pricing: pricing || [],
  });
}
