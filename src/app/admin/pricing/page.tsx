"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatVND } from "@/lib/money";
import { listProducts, getProduct, type ProductKey } from "@/lib/products";
import {
  listPricing,
  upsertPrice,
  type PaxType,
  type PriceRow,
  type PriceTier,
} from "@/lib/adminStore";

const paxTypes: PaxType[] = ["adult", "senior", "child"];

export default function AdminPricingPage() {
  const products = listProducts();

  const [tier, setTier] = useState<PriceTier>("customer");
  const [productKey, setProductKey] = useState<ProductKey>("bana");
  const product = getProduct(productKey);

  const [ticketOption, setTicketOption] = useState<string>(
    product.ticketOptions?.[0]?.key ?? ""
  );

  const [rows, setRows] = useState<PriceRow[]>([]);

  useEffect(() => {
    const load = () => setRows(listPricing());
    load();
    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const p = getProduct(productKey);
    setTicketOption(p.ticketOptions?.[0]?.key ?? "");
  }, [productKey]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (r.productKey !== productKey) return false;
      if (r.tier !== tier) return false;
      const needOpt = Boolean(product.ticketOptions?.length);
      if (!needOpt) return !r.ticketOption;
      return r.ticketOption === ticketOption;
    });
  }, [rows, productKey, tier, product.ticketOptions?.length, ticketOption]);

  const getRow = (paxType: PaxType) => filtered.find((r) => r.paxType === paxType);

  const [form, setForm] = useState<
    Record<PaxType, { basePrice: number; promoPrice?: number; centralEligible: boolean }>
  >({
    adult: { basePrice: 0, promoPrice: undefined, centralEligible: true },
    senior: { basePrice: 0, promoPrice: undefined, centralEligible: true },
    child: { basePrice: 0, promoPrice: undefined, centralEligible: true },
  });

  useEffect(() => {
    setForm({
      adult: {
        basePrice: getRow("adult")?.basePrice ?? 0,
        promoPrice: getRow("adult")?.promoPrice,
        centralEligible: getRow("adult")?.centralEligible ?? true,
      },
      senior: {
        basePrice: getRow("senior")?.basePrice ?? 0,
        promoPrice: getRow("senior")?.promoPrice,
        centralEligible: getRow("senior")?.centralEligible ?? true,
      },
      child: {
        basePrice: getRow("child")?.basePrice ?? 0,
        promoPrice: getRow("child")?.promoPrice,
        centralEligible: getRow("child")?.centralEligible ?? true,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productKey, tier, ticketOption, rows.length]);

  const save = () => {
    for (const paxType of paxTypes) {
      const existing = getRow(paxType);
      upsertPrice({
        id: existing?.id,
        productKey,
        ticketOption: product.ticketOptions?.length ? ticketOption : undefined,
        paxType,
        tier,
        basePrice: Number(form[paxType].basePrice) || 0,
        promoPrice:
          form[paxType].promoPrice !== undefined && form[paxType].promoPrice !== null
            ? Number(form[paxType].promoPrice) || undefined
            : undefined,
        centralEligible: Boolean(form[paxType].centralEligible),
      });
    }
    alert("Saved (mock)");
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Quản lý giá vé</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={tier} onValueChange={(v) => setTier(v as PriceTier)}>
          <TabsList>
            <TabsTrigger value="customer">Giá khách</TabsTrigger>
            <TabsTrigger value="affiliate">Giá affiliate</TabsTrigger>
          </TabsList>

          <TabsContent value={tier} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Điểm đến</Label>
                <select
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={productKey}
                  onChange={(e) => setProductKey(e.target.value as ProductKey)}
                >
                  {products.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.key}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-muted-foreground">
                  {product.nameKey}
                </div>
              </div>

              {product.ticketOptions?.length ? (
                <div className="space-y-2">
                  <Label>Loại vé</Label>
                  <div className="flex flex-wrap gap-2">
                    {product.ticketOptions.map((opt) => (
                      <Button
                        key={opt.key}
                        type="button"
                        variant={ticketOption === opt.key ? "default" : "outline"}
                        onClick={() => setTicketOption(opt.key)}
                      >
                        {opt.key}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <Separator />

            <div className="space-y-4">
              {paxTypes.map((pax) => (
                <div key={pax} className="rounded-2xl border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{pax}</div>
                    <Badge variant="outline">{tier}</Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Giá chính</Label>
                      <Input
                        type="number"
                        value={form[pax].basePrice}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [pax]: { ...prev[pax], basePrice: Number(e.target.value) },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Giá khuyến mãi</Label>
                      <Input
                        type="number"
                        value={form[pax].promoPrice ?? ""}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [pax]: {
                              ...prev[pax],
                              promoPrice:
                                e.target.value === "" ? undefined : Number(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <input
                        type="checkbox"
                        checked={form[pax].centralEligible}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [pax]: { ...prev[pax], centralEligible: e.target.checked },
                          }))
                        }
                      />
                      <span className="text-sm">Áp dụng miền Trung</span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-muted-foreground">
                    Preview: {formatVND(form[pax].promoPrice ?? form[pax].basePrice)}
                  </div>
                </div>
              ))}

              <Button onClick={save}>Lưu giá</Button>

              <div className="text-xs text-muted-foreground">
                Hiện đang mock bằng localStorage. Khi nối Supabase: bảng pricing_rules sẽ tách giá customer vs affiliate (chiết khấu).
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
