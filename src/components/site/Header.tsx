"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";

import { useLang } from "@/lib/useLang";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { t } from "@/lib/i18n/t";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useProfileStore } from "@/stores/useProfileStore";
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
  const supabase = createSupabaseBrowserClient();

  const { logout }: any = useProfileStore.getState();
  const { setGlobalLoading, setToastMessage }: CommonType | any = useCommonStore.getState();

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
    router.push("/");
  };

  const loadUser = async () => {
    try {
      setGlobalLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const user = session.user;
        const { error }: any = await sv_getCurrentProfile(user.id);
        if (error) {
          setToastMessage(error);
          return;
        }
      }
    } catch (e) {
      setToastMessage("Có lỗi xảy ra");
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const menus = [
    {
      link: "/#experiences",
      name: "Trải nghiệm",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      link: "/checkout",
      name: "Mua vé tham quan",
      icon: "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z",
    },
    {
      link: "/thanh-tuu",
      name: "Thành tựu",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000 4h2a2 2 0 000-4H9z",
    },

    {
      link: "/faq",
      name: "Hỏi đáp (FAQ)",
      icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
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
            {menus.map((item, idx) => (
              <Link
                key={idx}
                onClick={(e) => {
                  if (item.link === "/")
                    if (pathname === "/") {
                      e.preventDefault();
                      const el = document.getElementById("experiences");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }
                }}
                href={item.link}
                className="hover:text-blue-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language */}
            {/* <Languages /> */}

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
                    <span className="hidden text-sm font-medium md:inline">{displayName}</span>
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
                  <DropdownMenuItem onSelect={handleLogout}>
                    {t(lang, "auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[280px]">
                {/* 2. Nội dung Sidebar */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-blue-900 leading-none">
                      Ruby Travel
                    </span>
                  </div>
                </div>

                {/* List Menu Item */}
                <nav className="flex-1 overflow-y-auto py-4">
                  <ul className="space-y-1">
                    {menus.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          onClick={(e) => {
                            if (item.link === "/")
                              if (pathname === "/") {
                                e.preventDefault();
                                const el = document.getElementById("experiences");
                                if (el) {
                                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                                }
                              }
                          }}
                          href={item.link}
                          className="hover:text-blue-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
                        >
                          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-100 transition">
                            <svg
                              className="w-5 h-5 text-gray-500 group-hover:text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={item.icon}
                              />
                            </svg>
                            <span className="font-semibold">{item.name}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
