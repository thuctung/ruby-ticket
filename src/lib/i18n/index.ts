import { createInstance } from "i18next";
import { resources } from "@/locales";
import { getOptions } from "./settings";

export async function getTranslation(lng: string, options: { keyPrefix?: string } = {}) {
  const i18n = createInstance();
  await i18n.init({ ...getOptions(lng), resources });
  return {
    t: i18n.getFixedT(lng, null, options.keyPrefix),
    i18n,
  };
}
