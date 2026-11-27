import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { AgentPriceAndTypeSubmit } from "@/app-controler/admin/product-mgt/type";

export async function POST(request: Request) {
  const litsPrice: AgentPriceAndTypeSubmit = await request.json();
  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.AGENT_PRICE)
    .upsert(litsPrice, { onConflict: "site_code,product_code,agent_code" });

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
