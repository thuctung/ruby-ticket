import type { Metadata } from "next";
import i18nConfig from "../../i18nConfig";

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");

const HREFLANG: Record<string, string> = {
  vi: "vi",
  en: "en",
  zh: "zh-CN",
  ko: "ko",
};

function normalizePath(path = ""): string {
  const p = path.trim();
  if (!p || p === "/") return "";
  return ("/" + p.replace(/^\/+|\/+$/g, "")).replace(/\/{2,}/g, "/");
}

export function buildUrl(lng: string, path = ""): string {
  return `${SITE_URL}/${lng}${normalizePath(path)}`;
}

export function buildAlternates(lng: string, path = ""): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};

  for (const l of i18nConfig.locales) {
    languages[HREFLANG[l] ?? l] = buildUrl(l, path);
  }
  languages["x-default"] = buildUrl(i18nConfig.defaultLocale, path);

  return {
    canonical: buildUrl(lng, path),
    languages,
  };
}
