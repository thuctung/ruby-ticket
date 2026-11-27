import { NextRequest, NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";

import i18nConfig from "../i18nConfig";
import { createSupabaseServerClient } from "./lib/supabase/server-ssr";
import { DB_TABLE_NAME, ROLES } from "./commons/constant";

const isUnder = (path: string, base: string) => path === base || path.startsWith(`${base}/`);

export async function proxy(req: NextRequest) {
  const res = i18nRouter(req, i18nConfig);

  if (res.headers.get("location")) return res;

  const { pathname } = req.nextUrl;
  // Không xử lý API
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const hasLocale = i18nConfig.locales.includes(segments[1]);
  const locale = hasLocale ? segments[1] : i18nConfig.defaultLocale;
  const path = hasLocale ? "/" + segments.slice(2).join("/") : pathname;

  const isAdminPath = isUnder(path, "/admin");
  const isAffiliatePath = isUnder(path, "/affiliate");

  if (!isAdminPath && !isAffiliatePath) return res;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  const { data: profile } = await supabase
    .from(DB_TABLE_NAME.PROFILES)
    .select("role")
    .eq("user_id", user.id)
    .single();

  const role = profile?.role;

  if (role === ROLES.ADMIN && isAffiliatePath) {
    return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
  }

  if (role === ROLES.AFFILIATE && isAdminPath) {
    return NextResponse.redirect(new URL(`/${locale}/affiliate`, req.url));
  }

  return res;
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
