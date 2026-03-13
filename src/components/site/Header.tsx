"use client";

import Link from "next/link";
import {  useMemo,  } from "react";

import { useLang } from "@/lib/useLang";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGS, type LangKey, setLang } from "@/lib/i18n";
import { t } from "@/lib/i18n/t";
import { Languages } from "lucide-react";

import { useProfileStore } from "@/stores/useProfileStore";
import { ProfileType } from "@/types/profile";

import { ROLES } from "@/commons/constant";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const lang = useLang();

  const profile: ProfileType = useProfileStore((state: any) => state.profile);

  const { logout }: any = useProfileStore.getState();

  const langLabel = useMemo(() => {
    const map: Record<LangKey, string> = {
      vi: t(lang, "lang.vi"),
      en: t(lang, "lang.en"),
      zh: t(lang, "lang.zh"),
      ko: t(lang, "lang.ko"),
    };
    return map[lang] ?? t(lang, "lang.vi");
  }, [lang]);
  const displayName = profile ? profile.username : "User";

  const initials = (() => {
    const base = displayName ?? "U";
    const parts = base.trim().split(/\s+/).slice(0, 2);
    return parts.map((p: any) => p[0]?.toUpperCase()).join("");
  })();

  const handleLogout = () => {
    logout()
    router.push('/');
  }

  return (
    <header className="border-b bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600" />
          <div className="leading-tight">
            <div className="font-semibold">{t(lang, "brand.name")}</div>
            <div className="text-xs text-muted-foreground">
              {t(lang, "brand.tagline")}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a className="hover:text-foreground" href="#experiences">
            {t(lang, "nav.experiences")}
          </a>
          <a className="hover:text-foreground" href="#how">
            {t(lang, "nav.how")}
          </a>
          <a className="hover:text-foreground" href="#collaborator">
            {t(lang, "nav.affiliate")}
          </a>
          <a className="hover:text-foreground" href="#faq">
            {t(lang, "nav.faq")}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="#experiences">{t(lang, "cta.viewExperiences")}</Link>
          </Button>

          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">{langLabel}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>{t(lang, "lang.label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {LANGS.map((l) => (
                <DropdownMenuItem
                  key={l.key}
                  onSelect={() => {
                    setLang(l.key);
                  }}
                >
                  {l.key === "vi"
                    ? t(lang, "lang.vi")
                    : l.key === "en"
                      ? t(lang, "lang.en")
                      : l.key === "zh"
                        ? t(lang, "lang.zh")
                        : t(lang, "lang.ko")}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {!profile.user_id ? (
            <Button asChild>
              <Link href="/login">{t(lang, "auth.login")}</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border bg-background px-2 py-1 hover:bg-muted/30"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline">
                    {displayName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{profile.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {profile.role === ROLES.ADMIN
                        ? "Admin"
                        : profile.role === ROLES.AFFILIATE
                          ? "Affiliate"
                          : t(lang, "auth.user")}
                      {profile?.email ? ` • ${profile.email}` : ""}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profile.role === ROLES.ADMIN ? (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                ) : profile.role === ROLES.AFFILIATE ? (
                  <DropdownMenuItem asChild>
                    <Link href="/affiliate">Affiliate Dashboard</Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/checkout">{t(lang, "cta.buy")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="#collaborator">{t(lang, "nav.affiliate")}</a>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleLogout}
                >
                  {t(lang, "auth.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
