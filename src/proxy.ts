import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server-ssr";
import { DB_TABLE_NAME } from "./commons/constant";

export async function proxy(req: any) {
  const res = NextResponse.next();
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from(DB_TABLE_NAME.PROFILES)
    .select("role")
    .eq("user_id", user?.id)
    .single();
  const pathname = req.nextUrl.pathname;

  if (!user) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/affiliate")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return res;
  }
  const role = profile?.role;

  if (role === "admin" && pathname.startsWith("/affiliate")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (role === "affiliate" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/affiliate", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/affiliate/:path*"],
};
