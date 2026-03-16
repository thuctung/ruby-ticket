import { NextResponse } from "next/server";


import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const {
    topup_id,
  } = await request.json();
  console.log('topup_id',topup_id)
  const { error }: any = await supabaseAdmin.rpc(DB_TABLE_NAME.FUC_UPADTE_STAUS_BALANCE,{
    topup_id: topup_id
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: {} }, { status: 200 });
}