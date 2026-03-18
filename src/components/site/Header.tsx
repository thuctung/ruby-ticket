"use client";

import Link from "next/link";
import { useEffect, useMemo, } from "react";

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
import { t } from "@/lib/i18n/t";
import {  Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import {  useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType } from "@/types";

import { ROLES } from "@/commons/constant";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import Image from "next/image";
import { sv_getCurrentProfile } from "@/app-controler/login/api";
import Languages from "./Languages";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = useLang();

  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const supabase = createSupabaseBrowserClient()

  const { logout,  }: any = useProfileStore.getState();
  const { setGlobalLoading , setToastMessage}: CommonType | any = useCommonStore.getState();

  const displayName = profile ? profile.username : "User";

  const initials = (() => {
    const base = displayName ?? "U";
    const parts = base.trim().split(/\s+/).slice(0, 2);
    return parts.map((p: any) => p[0]?.toUpperCase()).join("");
  })();

  const handleLogout = () => {
    logout();
    sessionStorage.clear();
    supabase.auth.signOut();
    router.push('/');
  }

  const loadUser = async () => {
    try {
      setGlobalLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const user = session.user;
        const { error}: any = await sv_getCurrentProfile(user.id);
        if(error){
        setToastMessage(error);
        return;
        }
      }
    } catch (e) {
      setToastMessage('Có lỗi xảy ra')
    } finally {
      setGlobalLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <>
     <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
         
        >
          <div className="relative transition-transform group-hover:scale-105">
            <Image
              src="/logo1.png"
              alt="Ruby Travel"
              width={48}
              height={48}
              className="object-contain mix-blend-multiply"
            />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-lg text-slate-900">Ruby Travel</div>
            <div className="hidden text-[10px] font-bold text-blue-600 uppercase tracking-widest sm:block">
              Đà Nẵng Tickets
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
          <Link  onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              const el = document.getElementById("experiences");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }
          }} href="/#experiences" className="hover:text-blue-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full">
            Trải nghiệm
          </Link>

          <Link href="/thanh-tuu" className="hover:text-blue-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full">
            Thành tựu
          </Link>

          <Link href="/checkout" className="hover:text-blue-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full">
            Đặt vé
          </Link>

          <Link href="/faq" className="hover:text-blue-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full">
            FAQ
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Language */}
          {/* <Languages /> */}

          {/* User menu */}
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

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[280px]">
              <nav className="mt-8 flex flex-col gap-6 text-lg">
                <Link href="#experiences">
                  Trải nghiệm
                </Link>
                <Link href="#how">
                  Cách hoạt động
                </Link>
                <Link href="#collaborator">
                  Cộng tác viên
                </Link>
                <Link href="#faq">
                  FAQ
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
