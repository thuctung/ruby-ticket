"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType } from "@/types";

import { MENUS } from "@/commons/constant";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import Image from "next/image";
import { sv_getCurrentProfile } from "@/app-controler/login/api";
import { UserPopup } from "./PopupUser";
import { HeaderMobile } from "./HeaderMobile";
import Languages from "./Languages";
import { ShoppingCart, User } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";
import { useCartStore } from "@/stores/useCartStore";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const supabase = createSupabaseBrowserClient();

  const cartCount = useCartStore((s) => {
    let total = 0;
    for (const item of s.items.values()) total += item.quantity;
    return total;
  });
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

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className=" flex  items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Ruby Travel"
                width={48}
                height={48}
                className="object-contain mix-blend-multiply"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
            <div className="hidden md:block leading-tight">
              <div className="font-bold text-lg  text-red-500">Ruby Travel</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
            {MENUS.map((item, idx) => (
              <Link
                key={idx}
                onClick={(e) => {
                  if (item.link === "/#experiences")
                    if (pathname === "/") {
                      e.preventDefault();
                      const el = document.getElementById("experiences");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }
                }}
                href={item.link}
                className={`relative pb-1 text-[15px] font-[600] transition-colors ${
                  item.link === pathname ? "text-[#1c5b41]" : "text-[#1c5b41] hover:text-[#fe9614]"
                }`}
              >
                {t(`common.${item.name}`)}
                {item.link === pathname && (
                  <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 rounded-full bg-[#fe9614]" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <Languages />
            <Link
              href="/cart"
              aria-label="Giỏ hàng"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-[#1c5b41] transition-colors hover:bg-slate-100 hover:text-[#fe9614]"
            >
              <ShoppingCart className="h-5 w-5" color="#fba307" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#fe9614] px-1 text-[10px] font-bold leading-none text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            {!profile.user_id ? (
              <Link href="/login">
                <User color="#fba307" />
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2  px-2 py-1 hover:bg-muted/30"
                    aria-label="User menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback color="">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:inline text-[##fba307]">
                      {displayName}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <UserPopup profile={profile} handleLogout={handleLogout} />
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu */}
            <HeaderMobile pathname={pathname} t={t} />
          </div>
        </div>
      </header>
    </>
  );
}
