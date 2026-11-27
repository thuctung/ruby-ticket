"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/client";
import i18nConfig from "../../../i18nConfig";

type LangKey = "vi" | "en" | "zh" | "ko";

const LANG_META: Record<LangKey, { code: string; flag: string; native: string }> = {
  vi: { code: "vi", flag: "https://flagcdn.com/w40/vn.png", native: "Tiếng Việt" },
  en: { code: "en", flag: "https://flagcdn.com/w40/us.png", native: "English" },
  zh: { code: "zh", flag: "https://flagcdn.com/w40/cn.png", native: "中文" },
  ko: { code: "ko", flag: "https://flagcdn.com/w40/kr.png", native: "한국어" },
};

function Flag({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-full shadow-sm ring-1 ring-black/10">
      <img src={src} alt={alt} loading="lazy" className="h-full w-full scale-150 object-cover" />
    </span>
  );
}

export default function Languages() {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams<{ lng?: string }>();

  const lang = (
    i18nConfig.locales.includes(params?.lng ?? "") ? params.lng : i18nConfig.defaultLocale
  ) as LangKey;

  const { t } = useTranslation();

  const current = LANG_META[lang] ?? LANG_META.vi;

  const changeLang = (newLocale: LangKey) => {
    if (newLocale === lang) return;

    const expires = new Date(Date.now() + 30 * 864e5).toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/;SameSite=Lax`;

    const segments = pathname.split("/");
    if (i18nConfig.locales.includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const query = searchParams.toString();
    const newPath = segments.join("/") + (query ? `?${query}` : "");

    router.push(newPath);
    router.refresh();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={t("lang.label")}
          className="group h-9 gap-2 rounded-full border-slate-200 bg-white/80 px-2.5 shadow-sm backdrop-blur
                     transition-all hover:border-slate-300 hover:bg-white hover:shadow
                     focus-visible:ring-2 focus-visible:ring-blue-500/40
                     data-[state=open]:border-blue-300 data-[state=open]:bg-blue-50/50
                     dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-900"
        >
          <Flag src={current.flag} alt={current.native} />
          <span className="hidden text-sm font-semibold tracking-wide text-slate-700 sm:inline dark:text-slate-200 uppercase">
            {current.code}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-180 text-blue-500" : ""
            }`}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-2xl border border-slate-100 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl
                   dark:border-slate-800 dark:bg-slate-900/95"
      >
        <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 ">
          <Globe className="h-3.5 w-3.5" />
          {t("common.lang.label")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

        {i18nConfig.locales.map((key: any) => {
          const meta = LANG_META[key as LangKey];
          if (!meta) return null;
          const active = lang === key;

          return (
            <DropdownMenuItem
              key={key}
              onSelect={() => changeLang(key as LangKey)}
              className={`group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                  : "text-slate-700 hover:bg-slate-50 focus:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
              }`}
            >
              <Flag src={meta.flag} alt={meta.native} />

              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-sm font-semibold">{t(`common.lang.${key}`)}</span>
                <span className="truncate text-[11px] text-slate-400">{meta.native}</span>
              </div>

              {active && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
