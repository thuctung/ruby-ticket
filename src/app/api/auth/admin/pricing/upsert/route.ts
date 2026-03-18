import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, product_key, ticket_option, pax_type, tier, base_price, promo_price, central_eligible } = body;

    if (!product_key || !pax_type || !tier) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload: any = {
      product_key,
      ticket_option,
      pax_type,
      tier,
      base_price,
      promo_price,
      central_eligible,
      updated_at: new Date().toISOString(),
    };

    if (id) {
        payload.id = id;
    }

    const { data, error } = await supabaseAdmin
      .from(DB_TABLE_NAME.PRICING)
      .upsert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      pricing: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
