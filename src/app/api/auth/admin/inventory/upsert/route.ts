import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_key, date, capacity } = body;

    if (!product_key || !date || capacity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from(DB_TABLE_NAME.INVENTORY)
      .upsert(
        {
          product_key,
          date,
          capacity,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "product_key, date" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      inventory: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
