import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { BOOKING_FORM_TYPE } from "@/components/GetTicketForm/constants";

export async function POST(request: Request) {
  const { formType } = await request.json();

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.SITES)
    .select("*")
    .order("order", { ascending: true });

  if (formType === BOOKING_FORM_TYPE.AFFILATE) {
    query.eq("status_affilate", true);
  }
  if (formType === BOOKING_FORM_TYPE.CUSTOMER) {
    query.eq("status", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
