import { NextResponse } from "next/server";


import { supabaseAdmin } from "@/lib/supabase/server";
import { ProfileUpdateStatusType, } from "@/types";

export async function POST(request: Request) {
  const {
    user_id,
    status
  }: ProfileUpdateStatusType = await request.json();

  const { error }: any = await supabaseAdmin
    .from("profiles")
    .update({ status })
    .eq("user_id", user_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: {} }, { status: 200 });
}