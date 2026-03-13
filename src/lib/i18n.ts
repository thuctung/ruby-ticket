export const LANGS = [
  { key: "vi", label: "Tiếng Việt" },
  { key: "en", label: "English" },
  { key: "zh", label: "中文" },
  { key: "ko", label: "한국어" },
] as const;

export type LangKey = (typeof LANGS)[number]["key"];

const STORAGE_KEY = "dnt.lang";

export function getInitialLang(): LangKey {
  if (typeof window === "undefined") return "vi";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "vi" || raw === "en" || raw === "zh" || raw === "ko") return raw;
  return "vi";
}

export function setLang(lang: LangKey) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, lang);
  window.dispatchEvent(new Event("storage"));
}
