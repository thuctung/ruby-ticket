import vi from "@/locales/vi/common.json";
import en from "@/locales/en/common.json";
import zh from "@/locales/zh/common.json";
import ko from "@/locales/ko/common.json";

import type { LangKey } from "@/lib/i18n";

const DICTS = { vi, en, zh, ko } as const;

export type Dict = typeof vi;

type Json = Record<string, unknown>;

function getByPath(obj: unknown, path: string): string | undefined {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (typeof acc !== "object" || acc === null) return undefined;
    return (acc as Json)[key];
  }, obj) as string | undefined;
}

import type { I18nKey } from "@/lib/i18n/keys";

export function t(lang: LangKey, keyPath: I18nKey): string {
  const dict = DICTS[lang] ?? DICTS.vi;
  return (
    getByPath(dict, keyPath) ??
    getByPath(DICTS.vi, keyPath) ??
    // show keyPath as last resort to avoid blank UI
    keyPath
  );
}
