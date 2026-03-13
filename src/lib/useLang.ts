"use client";

import { useEffect, useState } from "react";

import type { LangKey } from "@/lib/i18n";
import { getInitialLang } from "@/lib/i18n";

export function useLang() {
  const [lang, setLang] = useState<LangKey>("vi");

  useEffect(() => {
    const load = () => setLang(getInitialLang());
    load();

    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return lang;
}
