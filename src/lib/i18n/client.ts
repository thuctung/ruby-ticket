"use client";

import { useMemo } from "react";
import i18next from "i18next";
import { useParams } from "next/navigation";
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import { resources } from "@/locales";
import { getOptions, languages, fallbackLng } from "./settings";

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    ...getOptions(),
    resources,
  });
}

export function useCurrentLang(): string {
  const params = useParams<{ lng?: string }>();
  const lng = params?.lng;
  return lng && languages.includes(lng) ? lng : fallbackLng;
}

export function useTranslation(options: { keyPrefix?: string; lng?: string } = {}) {
  const currentLng = useCurrentLang();
  const lng = options.lng ?? currentLng;

  const { i18n } = useTranslationOrg();
  const t = useMemo(
    () => i18n.getFixedT(lng, null, options.keyPrefix),
    [i18n, lng, options.keyPrefix]
  );

  return { t, i18n, lng };
}
