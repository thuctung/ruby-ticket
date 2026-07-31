import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { APP_URL } from "@/commons/constant";

export async function POST(request: Request) {
  const { email } = await request.json();
  const { data, error }: any = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${APP_URL}/update-password`,
  });
  console.log("data", data);
  console.log("error", error);
  if (error) {
    return NextResponse.json(data, { status: 500 });
  }

  return NextResponse.json({ data: {} }, { status: 200 });
}
