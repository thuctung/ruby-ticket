import { dictionaries, Namespace } from "@/locales";

import type { LangKey } from "@/lib/i18n";

export function t(lang: LangKey, key: string): string {
  const [namespace, ...path] = key.split(".");
  const dict = dictionaries[lang]?.[namespace as Namespace];
  if (!dict) return key;

  const value = path.reduce<any>((acc, segment) => acc?.[segment], dict);

  return typeof value === "string" ? value : key;
}
