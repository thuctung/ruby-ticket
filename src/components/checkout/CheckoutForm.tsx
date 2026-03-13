"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatVND } from "@/lib/money";
import type { ProductKey } from "@/lib/products";
import { getProduct } from "@/lib/products";
import { t } from "@/lib/i18n/t";
import { useLang } from "@/lib/useLang";

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

export const checkoutSchema = z
  .object({
    travelDate: z
      .string()
      .min(10, "Bạn chưa chọn ngày đi")
      .refine((v) => v >= todayISO(), "Ngày đi phải từ hôm nay trở đi"),

    productKey: z.enum([
      "bana",
      "vinpearl",
      "hoian-memories",
      "nui-than-tai",
      "cruise",
    ]),

    // optional unless the selected product requires it (e.g. Bà Nà: vé cáp/combo)
    ticketOption: z.string().optional(),

    isCentralRegion: z.boolean().default(false),

    qtyAdult: z.coerce.number().int().min(0).max(99),
    qtySenior: z.coerce.number().int().min(0).max(99),
    qtyChild: z.coerce.number().int().min(0).max(99),

    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .trim()
      .min(8, "SĐT quá ngắn")
      .max(15, "SĐT quá dài")
      .regex(/^[0-9+ ]+$/, "SĐT chỉ nên gồm số, dấu + và khoảng trắng"),

    note: z.string().max(500).optional().or(z.literal("")),
  })
  .superRefine((v, ctx) => {
    const totalQty = v.qtyAdult + v.qtySenior + v.qtyChild;
    if (totalQty <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bạn cần chọn ít nhất 1 vé",
        path: ["qtyAdult"],
      });
    }

    const product = getProduct(v.productKey as ProductKey);

    // Ticket option required when product declares ticketOptions
    if (product.ticketOptions?.length) {
      const ok = Boolean(
        v.ticketOption &&
          product.ticketOptions.some((o) => o.key === v.ticketOption)
      );
      if (!ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bạn chưa chọn loại vé",
          path: ["ticketOption"],
        });
      }
    }

    // If a product doesn't support a pax type, its quantity must be 0.
    if (!product.paxTypes.includes("adult") && v.qtyAdult !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sản phẩm này không áp dụng vé Người lớn",
        path: ["qtyAdult"],
      });
    }
    if (!product.paxTypes.includes("senior") && v.qtySenior !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sản phẩm này không áp dụng vé Người già",
        path: ["qtySenior"],
      });
    }
    if (!product.paxTypes.includes("child") && v.qtyChild !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sản phẩm này không áp dụng vé Trẻ em",
        path: ["qtyChild"],
      });
    }

    // Central-region checkbox only allowed when product supports it
    if (!product.showCentralRegionCheckbox && v.isCentralRegion) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sản phẩm này không áp dụng ưu đãi miền Trung",
        path: ["isCentralRegion"],
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type Pricing = {
  adult: number;
  senior: number;
  child: number;
  centralDiscount: number; // percentage 0..1
};

// Mock pricing per product for UI preview. Later: load from Supabase pricing rules.
// Bà Nà has ticketOptions, so we model pricing by option.
const PRICING: Record<ProductKey, Pricing | Record<string, Pricing>> = {
  bana: {
    cap: { adult: 1200000, senior: 1050000, child: 800000, centralDiscount: 0.1 },
    combo: { adult: 1450000, senior: 1300000, child: 980000, centralDiscount: 0.1 },
  },
  vinpearl: { adult: 1100000, senior: 980000, child: 760000, centralDiscount: 0.08 },
  "hoian-memories": { adult: 600000, senior: 0, child: 450000, centralDiscount: 0 },
  "nui-than-tai": { adult: 700000, senior: 620000, child: 520000, centralDiscount: 0.1 },
  cruise: { adult: 450000, senior: 0, child: 320000, centralDiscount: 0 },
};

export function CheckoutForm({
  productKey,
  defaultValues,
  onSubmit,
}: {
  productKey: ProductKey;
  defaultValues?: Partial<CheckoutFormValues>;
  onSubmit?: (values: CheckoutFormValues) => Promise<void> | void;
}) {
  const lang = useLang();
  const product = getProduct(productKey);

  const [values, setValues] = useState<CheckoutFormValues>({
    travelDate: defaultValues?.travelDate ?? todayISO(),
    productKey: defaultValues?.productKey ?? productKey,
    isCentralRegion: defaultValues?.isCentralRegion ?? false,
    ticketOption:
      defaultValues?.ticketOption ?? product.ticketOptions?.[0]?.key,
    qtyAdult:
      defaultValues?.qtyAdult ?? (product.paxTypes.includes("adult") ? 1 : 0),
    qtySenior: defaultValues?.qtySenior ?? 0,
    qtyChild: defaultValues?.qtyChild ?? 0,
    email: defaultValues?.email ?? "",
    phone: defaultValues?.phone ?? "",
    note: defaultValues?.note ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Keep form state in sync when switching product (dropdown or link from homepage)
  useEffect(() => {
    const p = getProduct(productKey);

    setValues((prev) => {
      const next: CheckoutFormValues = {
        ...prev,
        productKey,
        ticketOption: p.ticketOptions?.some((o) => o.key === prev.ticketOption)
          ? prev.ticketOption
          : p.ticketOptions?.[0]?.key,
        // reset checkbox if not supported
        isCentralRegion: p.showCentralRegionCheckbox ? prev.isCentralRegion : false,
        // zero-out unsupported pax types
        qtyAdult: p.paxTypes.includes("adult") ? prev.qtyAdult : 0,
        qtySenior: p.paxTypes.includes("senior") ? prev.qtySenior : 0,
        qtyChild: p.paxTypes.includes("child") ? prev.qtyChild : 0,
      };

      // if all quantities become 0 after switching, set a sensible default
      if (next.qtyAdult + next.qtySenior + next.qtyChild === 0) {
        if (p.paxTypes.includes("adult")) next.qtyAdult = 1;
        else if (p.paxTypes.includes("child")) next.qtyChild = 1;
      }

      return next;
    });

    setErrors({});
  }, [productKey]);

  const pricing = (() => {
    const p = PRICING[values.productKey];
    if (values.productKey === "bana") {
      const byOption = p as Record<string, Pricing>;
      const opt = values.ticketOption ?? "cap";
      return byOption[opt] ?? byOption.cap;
    }
    return p as Pricing;
  })();

  const calc = useMemo(() => {
    const subtotal =
      values.qtyAdult * pricing.adult +
      values.qtySenior * pricing.senior +
      values.qtyChild * pricing.child;

    const discount = values.isCentralRegion
      ? Math.round(subtotal * pricing.centralDiscount)
      : 0;

    const total = Math.max(0, subtotal - discount);

    return { subtotal, discount, total };
  }, [pricing, values.isCentralRegion, values.qtyAdult, values.qtyChild, values.qtySenior]);

  const setField = <K extends keyof CheckoutFormValues>(
    key: K,
    val: CheckoutFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const validate = (v: CheckoutFormValues) => {
    const parsed = checkoutSchema.safeParse(v);
    if (parsed.success) return { ok: true as const, data: parsed.data };

    const map: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] ? String(issue.path[0]) : "form";
      if (!map[k]) map[k] = issue.message;
    }
    return { ok: false as const, errors: map };
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = validate(values);
      if (!res.ok) {
        setErrors(res.errors);
        return;
      }

      setErrors({});
      await onSubmit?.(res.data);

      // Placeholder action
      alert(
        `OK (mock) — sẽ tích hợp VNPAY sau\n\nĐiểm đến: ${t(lang, product.nameKey)}\nTổng: ${formatVND(calc.total)}\nNgày đi: ${res.data.travelDate}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>{t(lang, "checkout.form.title")}</CardTitle>
            <Badge variant="outline">{t(lang, "checkout.form.vnpay")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date + product */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="travelDate">{t(lang, "checkout.form.date")}</Label>
              <Input
                id="travelDate"
                type="date"
                value={values.travelDate}
                min={todayISO()}
                onChange={(e) => setField("travelDate", e.target.value)}
              />
              {errors.travelDate && (
                <p className="text-sm text-destructive">{errors.travelDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t(lang, "checkout.form.destination")}</Label>
              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="text-sm font-medium">{t(lang, product.nameKey)}</div>
                <div className="text-xs text-muted-foreground">
                  {t(lang, product.taglineKey)}
                </div>
              </div>
              <input type="hidden" value={values.productKey} readOnly />
            </div>
          </div>

          {/* Ticket option (only for products that have it, e.g. Bà Nà) */}
          {product.ticketOptions?.length ? (
            <div className="space-y-2">
              <Label>{t(lang, "checkout.form.ticketType")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {product.ticketOptions.map((opt) => (
                  <Button
                    key={opt.key}
                    type="button"
                    variant={
                      values.ticketOption === opt.key ? "default" : "outline"
                    }
                    onClick={() => setField("ticketOption", opt.key)}
                  >
                    {t(lang, opt.labelKey)}
                  </Button>
                ))}
              </div>
              {errors.ticketOption && (
                <p className="text-sm text-destructive">{errors.ticketOption}</p>
              )}
            </div>
          ) : null}

          {/* Quantities */}
          <div className="space-y-3">
            <div>
              <div className="font-medium">{t(lang, "checkout.form.qtyTitle")}</div>
              <div className="text-sm text-muted-foreground">
                {t(lang, "checkout.form.qtyDesc")}
              </div>
            </div>

            <div
              className={`grid grid-cols-1 gap-4 ${
                product.paxTypes.length >= 3
                  ? "sm:grid-cols-3"
                  : product.paxTypes.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-1"
              }`}
            >
              {product.paxTypes.includes("adult") && (
                <div className="space-y-2">
                  <Label htmlFor="qtyAdult">{t(lang, "checkout.form.pax.adult")}</Label>
                  <Input
                    id="qtyAdult"
                    inputMode="numeric"
                    type="number"
                    min={0}
                    max={99}
                    value={values.qtyAdult}
                    onChange={(e) =>
                      setField("qtyAdult", Number(e.target.value))
                    }
                  />
                </div>
              )}

              {product.paxTypes.includes("senior") && (
                <div className="space-y-2">
                  <Label htmlFor="qtySenior">{t(lang, "checkout.form.pax.senior")}</Label>
                  <Input
                    id="qtySenior"
                    inputMode="numeric"
                    type="number"
                    min={0}
                    max={99}
                    value={values.qtySenior}
                    onChange={(e) =>
                      setField("qtySenior", Number(e.target.value))
                    }
                  />
                </div>
              )}

              {product.paxTypes.includes("child") && (
                <div className="space-y-2">
                  <Label htmlFor="qtyChild">{t(lang, "checkout.form.pax.child")}</Label>
                  <Input
                    id="qtyChild"
                    inputMode="numeric"
                    type="number"
                    min={0}
                    max={99}
                    value={values.qtyChild}
                    onChange={(e) =>
                      setField("qtyChild", Number(e.target.value))
                    }
                  />
                </div>
              )}
            </div>

            {(errors.qtyAdult || errors.qtySenior || errors.qtyChild) && (
              <p className="text-sm text-destructive">
                {errors.qtyAdult || errors.qtySenior || errors.qtyChild}
              </p>
            )}
          </div>

          {/* Central region */}
          {product.showCentralRegionCheckbox && (
            <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
              <div>
                <div className="font-medium">{t(lang, "checkout.form.centralTitle")}</div>
                <div className="text-sm text-muted-foreground">
                  {t(lang, "checkout.form.centralDesc")}
                </div>
              </div>
              <input
                aria-label="isCentralRegion"
                type="checkbox"
                className="h-5 w-5"
                checked={values.isCentralRegion}
                onChange={(e) =>
                  setField("isCentralRegion", e.target.checked)
                }
              />
            </div>
          )}

          {errors.isCentralRegion && (
            <p className="text-sm text-destructive">{errors.isCentralRegion}</p>
          )}

          <Separator />

          {/* Contact */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">{t(lang, "checkout.form.email")}</Label>
              <Input
                id="email"
                placeholder="email@domain.com"
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t(lang, "checkout.form.phone")}</Label>
              <Input
                id="phone"
                placeholder="09xxxxxxxx"
                value={values.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">{t(lang, "checkout.form.note")}</Label>
            <Textarea
              id="note"
              placeholder={t(lang, "checkout.form.notePlaceholder")}
              value={values.note ?? ""}
              onChange={(e) => setField("note", e.target.value)}
            />
          </div>

          <Button
            type="button"
            className="w-full"
            size="lg"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? "..." : t(lang, "checkout.form.pay")}
          </Button>

          {errors.form && (
            <p className="text-sm text-destructive">{errors.form}</p>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t(lang, "checkout.summary.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {t(lang, "checkout.summary.destination")}
            </span>
            <span className="font-medium">{t(lang, product.nameKey)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {t(lang, "checkout.summary.date")}
            </span>
            <span className="font-medium">{values.travelDate}</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {t(lang, "checkout.summary.subtotal")}
            </span>
            <span className="font-medium">{formatVND(calc.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {t(lang, "checkout.summary.discount")}
            </span>
            <span className="font-medium">-{formatVND(calc.discount)}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold">{t(lang, "checkout.summary.total")}</span>
            <span className="text-base font-semibold">{formatVND(calc.total)}</span>
          </div>

          <div className="pt-3 text-xs text-muted-foreground">
            Lưu ý: giá đang là mock để test UI + validate. Khi nối Supabase,
            hệ thống sẽ tính theo pricing rules của admin.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
