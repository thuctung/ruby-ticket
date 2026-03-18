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
import { useLang } from "@/lib/useLang";
import { useMemo } from "react";

export default function Languages() {
  const lang = useLang();

  const langLabel = useMemo(() => {
    const map: Record<LangKey, { label: string; flag: string }> = {
      vi: { label: t(lang, "lang.vi"), flag: "https://flagcdn.com/w40/vn.png" },
      en: { label: t(lang, "lang.en"), flag: "https://flagcdn.com/w40/us.png" },
      zh: { label: t(lang, "lang.zh"), flag: "https://flagcdn.com/w40/cn.png" },
      ko: { label: t(lang, "lang.ko"), flag: "https://flagcdn.com/w40/kr.png" },
    };
    return map[lang] ?? map.vi;
  }, [lang]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full px-3 border-slate-200 hover:bg-slate-50 transition-all"
        >
          <img
            src={langLabel.flag}
            alt={langLabel.label}
            className="h-3 w-5 object-cover rounded-sm shadow-sm"
          />
          <span className="hidden sm:inline font-medium text-slate-700">
            {langLabel.label}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 p-1 rounded-2xl shadow-xl border-slate-100"
      >
        <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t(lang, "lang.label")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-50" />
        {LANGS.map((l) => {
          const config =
            {
              vi: { label: t(lang, "lang.vi"), flag: "https://flagcdn.com/w40/vn.png" },
              en: { label: t(lang, "lang.en"), flag: "https://flagcdn.com/w40/us.png" },
              zh: { label: t(lang, "lang.zh"), flag: "https://flagcdn.com/w40/cn.png" },
              ko: { label: t(lang, "lang.ko"), flag: "https://flagcdn.com/w40/kr.png" },
            }[l.key as LangKey] || { label: "", flag: "" };

          return (
            <DropdownMenuItem
              key={l.key}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                lang === l.key ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50"
              }`}
              onSelect={() => {
                setLang(l.key);
              }}
            >
              <img
                src={config.flag}
                alt={config.label}
                className="h-3 w-5 object-cover rounded-sm shadow-sm"
              />
              <span className="font-medium">{config.label}</span>
              {lang === l.key && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
