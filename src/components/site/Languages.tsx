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
import { LANGS, type LangKey, setLang } from "@/lib/i18n";
import { t } from "@/lib/i18n/t";
import { Check } from "lucide-react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";

const FLAGS: Record<LangKey, string> = {
  vi: "https://flagcdn.com/w40/vn.png",
  en: "https://flagcdn.com/w40/us.png",
  zh: "https://flagcdn.com/w40/cn.png",
  ko: "https://flagcdn.com/w40/kr.png",
};

export default function Languages() {
  const params = useParams();
  const lang = params.locale as LangKey;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: LangKey) => {
    const segments = pathname.split("/");
    segments[1] = next; // thay locale segment đầu tiên
    router.push(segments.join("/"));
    document.cookie = `app-lang=${next}; path=/; max-age=31536000`;
  };

  const options = useMemo(
    () =>
      LANGS.map((l) => ({
        key: l.key as LangKey,
        label: t(lang, `common.lang.${l.key}` as const),
        flag: FLAGS[l.key as LangKey],
      })),
    [lang]
  );

  const current = options.find((o) => o.key === lang) ?? options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2  px-3  hover:bg-slate-50 transition-colors"
        >
          <img
            src={current.flag}
            alt=""
            className="h-3.5 w-5 rounded-[3px] object-cover ring-1 ring-black/5"
          />
          <span className="hidden sm:inline text-sm font-medium text-slate-700">
            {current.label}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 p-1.5 rounded-2xl border-slate-100 shadow-lg shadow-slate-200/50"
      >
        <DropdownMenuLabel className="px-2.5 pt-1.5 pb-1 text-[11px] font-semibold text-slate-400 tracking-wide">
          {t(lang, "common.lang.label")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-100" />

        {options.map((o) => {
          const active = o.key === lang;
          return (
            <DropdownMenuItem
              key={o.key}
              onSelect={() => switchLocale(o.key)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer transition-colors ${
                active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <img
                src={o.flag}
                alt=""
                className="h-3.5 w-5 rounded-[3px] object-cover ring-1 ring-black/5"
              />
              <span className="text-sm font-medium">{o.label}</span>
              {active && <Check className="ml-auto h-4 w-4 text-blue-600" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
