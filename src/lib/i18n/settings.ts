export const fallbackLng = "vi";
export const languages = ["vi", "en", "zh", "ko"];
export const defaultNS = "translation";

export function getOptions(lng = fallbackLng) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    defaultNS,
    ns: [defaultNS],
    interpolation: { escapeValue: false },
  };
}
