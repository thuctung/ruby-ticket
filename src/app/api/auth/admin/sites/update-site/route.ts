import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { SiteType } from "@/app-controler/admin/site/type";

export async function POST(request: Request) {
  const body: SiteType = await request.json();

  let payload = body;
  if (!payload.id) {
    delete payload.id;
  }

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.SITES)
    .upsert(payload)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
}
