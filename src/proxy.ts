import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server-ssr";
import { DB_TABLE_NAME } from "./commons/constant";
import { LANGS } from "./lib/i18n";

const locales = LANGS.map((l) => l.key);
const defaultLocale = "vi";

const isMissingLocale = (pathname: string) => {
  return locales.every(
    (locale) => pathname !== `/${locale}` && !pathname.startsWith(`/${locale}/`)
  );
};

const stripLocale = (pathname: string) => {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (locales.includes(maybeLocale as any)) {
    return { locale: maybeLocale, rest: "/" + segments.slice(2).join("/") };
  }
  return { locale: defaultLocale, rest: pathname };
};

export async function proxy(req: any) {
  const pathname = req.nextUrl.pathname;

  if (isMissingLocale(pathname)) {
    const cookieLang = req.cookies.get("app-lang")?.value;
    const locale = locales.includes(cookieLang) ? cookieLang : defaultLocale;

    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }
  const { locale, rest } = stripLocale(pathname);
  const isProtected = rest.startsWith("/admin") || rest.startsWith("/affiliate");

  if (!isProtected) {
    return NextResponse.next();
  }

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
  if (!user) {
    if (rest.startsWith("/admin") || rest.startsWith("/affiliate")) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }
  const role = profile?.role;

  if (role === "admin" && rest.startsWith("/affiliate")) {
    return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
  }

  if (role === "affiliate" && rest.startsWith("/admin")) {
    console.log("redirect to affiliate");
    return NextResponse.redirect(new URL(`/${locale}/affiliate`, req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
