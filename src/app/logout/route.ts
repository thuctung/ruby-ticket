import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

export async function POST() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", process.env.APP_URL ?? "http://localhost:3000"), {
    status: 302,
  });
}
