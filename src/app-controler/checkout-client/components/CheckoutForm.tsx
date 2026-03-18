"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationType, ProductType, TicketByLocationType, TicketType } from "@/types/ticket";


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
import { getTicketType, getTicketVariant } from "./api";

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

    qtyLON: z.coerce.number().int().min(0).max(99),
    qtyGIA: z.coerce.number().int().min(0).max(99),
    qtyNHO: z.coerce.number().int().min(0).max(99),
    qtyChung: z.coerce.number().int().min(0).max(99),
    qtyCHILDANDAUL: z.coerce.number().int().min(0).max(99),

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
    const totalQty = v.qtyLON + v.qtyGIA + v.qtyNHO + v.qtyChung + v.qtyCHILDANDAUL;
    if (totalQty <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bạn cần chọn ít nhất 1 vé",
        path: ["qtyLON"],
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
    if (!product.paxTypes.includes("LON") && v.qtyLON !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sản phẩm này không áp dụng vé Người lớn",
        path: ["qtyLON"],
      });
    }
    if (!product.paxTypes.includes("GIA") && v.qtyGIA !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sản phẩm này không áp dụng vé Người cao tuổi",
        path: ["qtyGIA"],
      });
    }
    if (!product.paxTypes.includes("NHO") && v.qtyNHO !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sản phẩm này không áp dụng vé Trẻ em",
        path: ["qtyNHO"],
      });
    }
    if (!product.paxTypes.includes("Chung") && v.qtyChung !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sản phẩm này không áp dụng loại vé Chung",
        path: ["qtyChung"],
      });
    }
    if (!product.paxTypes.includes("CHILDANDAUL") && v.qtyCHILDANDAUL !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sản phẩm này không áp dụng loại vé Người lớn & Trẻ em",
        path: ["qtyCHILDANDAUL"],
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
  LON: number;
  GIA: number;
  NHO: number;
  Chung: number;
  CHILDANDAUL: number;
  centralDiscount: number; // percentage 0..1
};

// Mock pricing per product for UI preview. Later: load from Supabase pricing rules.
// Bà Nà has ticketOptions, so we model pricing by option.
const PRICING: Record<ProductKey, Pricing | Record<string, Pricing>> = {
  bana: {
    cap: { LON: 1200000, GIA: 1050000, NHO: 800000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0.1 },
    combo: { LON: 1450000, GIA: 1300000, NHO: 980000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0.1 },
  },
  vinpearl: { LON: 1100000, GIA: 980000, NHO: 760000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0.08 },
  "hoian-memories": { LON: 600000, GIA: 0, NHO: 450000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0 },
  "nui-than-tai": { LON: 700000, GIA: 620000, NHO: 520000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0.1 },
  cruise: { LON: 450000, GIA: 0, NHO: 320000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0 },
};

export function CheckoutForm({
  productKey,
  onSubmit,
  onChangeLocation,
  location,
  locations
}: {
  productKey: string;
  location: string;
  locations: LocationType[],
  defaultValues?: Partial<CheckoutFormValues>;
  onChangeLocation: (value: string) => void;
  onSubmit?: (values: CheckoutFormValues) => Promise<void> | void;
}) {
  const lang = useLang();
  const product = getProduct('bana');


  const [values, setValues] = useState<any>({

  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [ticketTypes, setTicketTypes] = useState<TicketByLocationType[]>([]);
  const [ticketTypeCode, setTickeTypeCode] = useState('');

  const [ticketVariants, setTicketVariants] = useState<ProductType[]>([])

  const fetchTicketTypeByLocation = async () => {
    const data = await getTicketType(location)
    if (data) {
      setTicketTypes(data);
      setTickeTypeCode(data[0].code)
    }
  }

  const fetchTicketVariant = async () => {
    const data = await getTicketVariant(ticketTypeCode);
    if (data) {
      setTicketVariants(data);
    }
  }

  useEffect(() => {
    if (location) {
      fetchTicketTypeByLocation()
    }
  }, [location])

  useEffect(() => {
    if (ticketTypeCode) {
      fetchTicketVariant()
    }
  }, [ticketTypeCode]);



  const handleSubmit = async () => {
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3 rounded-2xl shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-xl font-extrabold">{t(lang, "checkout.form.title")}</CardTitle>
            <Badge variant="outline" className="rounded-full">{t(lang, "checkout.form.vnpay")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          {/* Date + product */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">{t(lang, "checkout.switcher.title")}</div>
                <Select
                  value={location}
                  onValueChange={(value) => onChangeLocation(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t(lang, "checkout.switcher.title")} />
                  </SelectTrigger>
                  <SelectContent >
                    {locations.map((p) => (
                      <SelectItem key={p.code} value={p.code}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="travelDate">{t(lang, "checkout.form.date")}</Label>
              <Input
                id="travelDate"
                type="date"
                value={values.travelDate}
                min={todayISO()}
              />
              {errors.travelDate && (
                <p className="text-sm text-destructive">{errors.travelDate}</p>
              )}
            </div>
          </div>

          {ticketTypes?.length ? (
            <div className="space-y-2">
              <Label>{t(lang, "checkout.form.ticketType")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {ticketTypes.map((opt) => (
                  <Button
                    key={opt.code}
                    type="button"
                    variant={ticketTypeCode === opt.code ? "default" : "outline"}
                    className="rounded-xl"
                    onClick={() =>setTickeTypeCode(opt.code)}
                  >
                    {opt.name}
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
              className={`grid grid-cols-1 gap-4 ${ticketVariants.length >= 3
                ? "sm:grid-cols-3"
                : ticketVariants.length === 2
                  ? "sm:grid-cols-2"
                  : "sm:grid-cols-1"
                }`}
            >
              
              {
                ticketVariants.map(item => (
                  <div className="space-y-2">
                  <Label htmlFor={item.code}>{item.category_name}</Label>
                  <Input
                    id={item.code}
                    inputMode="numeric"
                    type="number"
                    min={0}
                    max={99}
                    value={values.qtyLON}
                  />
                </div>
                ))
              }
            </div>
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
            />
          </div>

          <Button
            type="button"
            className="w-full rounded-xl"
            size="lg"
            disabled
            onClick={handleSubmit}
          >
            Comming soon...
          </Button>

          {errors.form && (
            <p className="text-sm text-destructive">{errors.form}</p>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="lg:col-span-2 lg:sticky lg:top-24 rounded-2xl shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-extrabold">{t(lang, "checkout.summary.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm pt-0">
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
            <span className="font-medium">{formatVND(0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {t(lang, "checkout.summary.discount")}
            </span>
            <span className="font-medium">-{formatVND(0)}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold">{t(lang, "checkout.summary.total")}</span>
            <span className="text-base font-semibold">{formatVND(0)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
