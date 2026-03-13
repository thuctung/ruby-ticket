"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listProducts, type ProductKey } from "@/lib/products";
import { t } from "@/lib/i18n/t";
import { useLang } from "@/lib/useLang";

export default function ProductSwitcher({
  value,
}: {
  value: ProductKey;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = useLang();

  const products = listProducts();

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{t(lang, "checkout.switcher.title")}</div>
      <Select
        value={value}
        onValueChange={(v) => {
          const params = new URLSearchParams(searchParams?.toString());
          params.set("product", v);
          router.replace(`/checkout?${params.toString()}`);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t(lang, "checkout.switcher.title")} />
        </SelectTrigger>
        <SelectContent>
          {products.map((p) => (
            <SelectItem key={p.key} value={p.key}>
              {t(lang, p.nameKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
