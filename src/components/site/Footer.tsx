"use client";

import { useLang } from "@/lib/useLang";
import { t } from "@/lib/i18n/t";

export default function Footer() {
  const lang = useLang();

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          © {new Date().getFullYear()} {t(lang, "brand.name")}
        </div>
        <div className="text-xs">{t(lang, "footer.powered")}</div>
      </div>
    </footer>
  );
}
