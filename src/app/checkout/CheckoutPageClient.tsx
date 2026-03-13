"use client";

import ProductSwitcher from "@/components/checkout/ProductSwitcher";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import type { ProductKey } from "@/lib/products";
import { t } from "@/lib/i18n/t";
import { useLang } from "@/lib/useLang";

import Link from "next/link";

import Header from "@/components/site/Header";
import { Button } from "@/components/ui/button";

export default function CheckoutPageClient({
  productKey,
}: {
  productKey: ProductKey;
}) {
  const lang = useLang();

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <div className="mx-auto max-w-6xl flex-1 space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{t(lang, "checkout.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t(lang, "checkout.subtitle")}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">{t(lang, "cta.backHome")}</Link>
          </Button>
        </div>

        <div className="max-w-lg">
          <ProductSwitcher value={productKey} />
        </div>

        <CheckoutForm productKey={productKey} />
      </div>

      <footer className="mt-auto border-t bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {t(lang, "brand.name")}
          </div>
          <div className="text-xs">{t(lang, "footer.powered")}</div>
        </div>
      </footer>
    </main>
  );
}
