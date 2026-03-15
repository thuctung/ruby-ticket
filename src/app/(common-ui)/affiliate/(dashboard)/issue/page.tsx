"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatVND } from "@/lib/money";
import { getWallet, issueTicketFromWallet, calcTotal } from "@/lib/affiliateStore";
import { getSessionUser } from "@/lib/sessionUser";
import type { ProductKey } from "@/lib/products";
import { listProducts, getProduct } from "@/lib/products";
import { useLang } from "@/lib/useLang";
import { t } from "@/lib/i18n/t";

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

export default function AffiliateIssuePage() {
  const lang = useLang();
  const products = listProducts();

  const [balance, setBalance] = useState(0);

  const [productKey, setProductKey] = useState<ProductKey>("bana");
  const product = getProduct(productKey);

  const [ticketOption, setTicketOption] = useState<string>("cap");

  const [travelDate, setTravelDate] = useState(todayISO());
  const [isCentralRegion, setIsCentralRegion] = useState(false);

  const [qtyAdult, setQtyAdult] = useState(1);
  const [qtySenior, setQtySenior] = useState(0);
  const [qtyChild, setQtyChild] = useState(0);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const load = () => setBalance(getWallet().balance);
    load();

    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // sync fields when switching product
  useEffect(() => {
    const p = getProduct(productKey);
    if (!p.showCentralRegionCheckbox) setIsCentralRegion(false);

    if (!p.paxTypes.includes("adult")) setQtyAdult(0);
    if (!p.paxTypes.includes("senior")) setQtySenior(0);
    if (!p.paxTypes.includes("child")) setQtyChild(0);

    if (p.ticketOptions?.length) {
      const first = p.ticketOptions[0]?.key;
      setTicketOption((prev) => {
        if (prev === "combo" || prev === "cap") return prev;
        return first === "combo" || first === "cap" ? first : "cap";
      });
    }

    // ensure at least 1
    setTimeout(() => {
      const totalQty =
        (p.paxTypes.includes("adult") ? qtyAdult : 0) +
        (p.paxTypes.includes("senior") ? qtySenior : 0) +
        (p.paxTypes.includes("child") ? qtyChild : 0);
      if (totalQty === 0) {
        if (p.paxTypes.includes("adult")) setQtyAdult(1);
        else if (p.paxTypes.includes("child")) setQtyChild(1);
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productKey]);

  const totals = useMemo(() => {
    return calcTotal({
      productKey,
      ticketOption: productKey === "bana" ? ticketOption : undefined,
      isCentralRegion,
      qtyAdult,
      qtySenior,
      qtyChild,
    });
  }, [productKey, ticketOption, isCentralRegion, qtyAdult, qtySenior, qtyChild]);

  const canIssue = useMemo(() => {
    const totalQty = qtyAdult + qtySenior + qtyChild;
    return travelDate >= todayISO() && totalQty > 0 && email.includes("@");
  }, [travelDate, qtyAdult, qtySenior, qtyChild, email]);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Rút vé / Xuất vé (trừ tiền ví)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Số dư ví</div>
            <div className="text-lg font-semibold">{formatVND(balance)}</div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Điểm đến</Label>
              <Select
                value={productKey}
                onValueChange={(v) => setProductKey(v as ProductKey)}
              >
                <SelectTrigger>
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
              <p className="text-xs text-muted-foreground">{t(lang, product.taglineKey)}</p>
            </div>

            <div className="space-y-2">
              <Label>{t(lang, "checkout.form.date")}</Label>
              <Input
                type="date"
                min={todayISO()}
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
              />
            </div>
          </div>

          {product.ticketOptions?.length ? (
            <div className="space-y-2">
              <Label>{t(lang, "checkout.form.ticketType")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {product.ticketOptions.map((opt) => (
                  <Button
                    key={opt.key}
                    type="button"
                    variant={ticketOption === opt.key ? "default" : "outline"}
                    onClick={() => {
                      if (opt.key === "cap" || opt.key === "combo") {
                        setTicketOption(opt.key);
                      }
                    }}
                  >
                    {t(lang, opt.labelKey)}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {product.showCentralRegionCheckbox ? (
            <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
              <div>
                <div className="font-medium">{t(lang, "checkout.form.centralTitle")}</div>
                <div className="text-sm text-muted-foreground">
                  {t(lang, "checkout.form.centralDesc")}
                </div>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={isCentralRegion}
                onChange={(e) => setIsCentralRegion(e.target.checked)}
              />
            </div>
          ) : null}

          <div className="space-y-3">
            <div>
              <div className="font-medium">{t(lang, "checkout.form.qtyTitle")}</div>
              <div className="text-sm text-muted-foreground">{t(lang, "checkout.form.qtyDesc")}</div>
            </div>

            <div className={`grid grid-cols-1 gap-4 ${product.paxTypes.length >= 3 ? "sm:grid-cols-3" : product.paxTypes.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
              {product.paxTypes.includes("adult") ? (
                <div className="space-y-2">
                  <Label>{t(lang, "checkout.form.pax.adult")}</Label>
                  <Input type="number" min={0} max={99} value={qtyAdult} onChange={(e) => setQtyAdult(Number(e.target.value))} />
                </div>
              ) : null}
              {product.paxTypes.includes("senior") ? (
                <div className="space-y-2">
                  <Label>{t(lang, "checkout.form.pax.senior")}</Label>
                  <Input type="number" min={0} max={99} value={qtySenior} onChange={(e) => setQtySenior(Number(e.target.value))} />
                </div>
              ) : null}
              {product.paxTypes.includes("child") ? (
                <div className="space-y-2">
                  <Label>{t(lang, "checkout.form.pax.child")}</Label>
                  <Input type="number" min={0} max={99} value={qtyChild} onChange={(e) => setQtyChild(Number(e.target.value))} />
                </div>
              ) : null}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t(lang, "checkout.form.email")}</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com" />
            </div>
            <div className="space-y-2">
              <Label>{t(lang, "checkout.form.phone")}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t(lang, "checkout.form.note")}</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={t(lang, "checkout.form.notePlaceholder")} />
          </div>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Tóm tắt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="font-medium">{formatVND(totals.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Khuyến mãi</span>
                <span className="font-medium">-{formatVND(totals.discount)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-semibold">Tổng</span>
                <span className="font-semibold">{formatVND(totals.total)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              disabled={!canIssue}
              onClick={() => {
                try {
                  const me = getSessionUser();
                  const sale = issueTicketFromWallet({
                    affiliateEmail: me?.email,
                    travelDate,
                    productKey,
                    ticketOption: productKey === "bana" ? ticketOption : undefined,
                    isCentralRegion,
                    qtyAdult,
                    qtySenior,
                    qtyChild,
                    email,
                    phone,
                  });
                  alert(`OK (mock) — đã trừ ví: ${formatVND(sale.total)}`);
                  setNote("");
                } catch (e) {
                  const err = e as { message?: string };
                  alert(err?.message ?? "Có lỗi");
                }
              }}
            >
              Xuất vé (trừ ví)
            </Button>
            <div className="text-xs text-muted-foreground">
              Nếu ví không đủ tiền sẽ báo lỗi.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
