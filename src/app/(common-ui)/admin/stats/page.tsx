"use client";

import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/lib/money";
import { listSales, type AffiliateSale } from "@/lib/affiliateStore";
import { getProduct, listProducts, type ProductKey } from "@/lib/products";
import { t } from "@/lib/i18n/t";
import { useLang } from "@/lib/useLang";

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

const daysAgoISO = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

type SellerType = "affiliate" | "customer";

export default function AdminStatsPage() {
  const lang = useLang();
  const products = listProducts();

  const [from, setFrom] = useState(daysAgoISO(7));
  const [to, setTo] = useState(todayISO());
  const [productKey, setProductKey] = useState<ProductKey | "all">("all");
  const [affiliateQuery, setAffiliateQuery] = useState("");

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onStorage = () => setTick((x) => x + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const sales = useMemo<AffiliateSale[]>(() => {
    // tick triggers recompute on localStorage updates
    void tick;
    return listSales();
  }, [tick]);

  const filtered = useMemo(() => {
    const q = affiliateQuery.trim().toLowerCase();
    return sales.filter((s) => {
      const soldDay = s.createdAt.slice(0, 10);
      if (soldDay < from || soldDay > to) return false;
      if (productKey !== "all" && s.productKey !== productKey) return false;
      if (q) {
        const seller = (s.affiliateEmail ?? "").toLowerCase();
        if (!seller.includes(q)) return false;
      }
      return true;
    });
  }, [sales, from, to, productKey, affiliateQuery]);

  const totals = useMemo(() => {
    const tickets = filtered.reduce(
      (acc, s) => acc + s.qtyAdult + s.qtySenior + s.qtyChild,
      0
    );
    const revenue = filtered.reduce((acc, s) => acc + s.total, 0);
    return { tickets, revenue };
  }, [filtered]);

  const rows = useMemo(() => {
    return filtered
      .slice()
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((s) => {
        const sellerType: SellerType = s.affiliateEmail ? "affiliate" : "customer";
        const seller = s.affiliateEmail ?? "Customer";
        const p = getProduct(s.productKey);
        return {
          ...s,
          sellerType,
          seller,
          productName: t(lang, p.nameKey),
        };
      });
  }, [filtered, lang]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Thống kê vé bán (mock)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Từ ngày (ngày bán)</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Đến ngày (ngày bán)</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Địa điểm</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={productKey}
              onChange={(e) => setProductKey(e.target.value as ProductKey | "all")}
            >
              <option value="all">Tất cả</option>
              {products.map((p) => (
                <option key={p.key} value={p.key}>
                  {t(lang, p.nameKey)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Tên/Email aff</Label>
            <Input
              placeholder="vd: affiliate@..."
              value={affiliateQuery}
              onChange={(e) => setAffiliateQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="text-sm text-muted-foreground">Tổng doanh thu</div>
            <div className="mt-1 text-xl font-semibold">{formatVND(totals.revenue)}</div>
          </div>
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="text-sm text-muted-foreground">Tổng vé</div>
            <div className="mt-1 text-xl font-semibold">{totals.tickets}</div>
          </div>
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="text-sm text-muted-foreground">Số giao dịch</div>
            <div className="mt-1 text-xl font-semibold">{rows.length}</div>
          </div>
        </div>

        <Separator />

        {/* Table */}
        <div className="overflow-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="p-3">Ngày bán</th>
                <th className="p-3">Địa điểm</th>
                <th className="p-3">Ngày đi</th>
                <th className="p-3">Số vé</th>
                <th className="p-3">Số tiền</th>
                <th className="p-3">Người bán</th>
                <th className="p-3">Loại</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={7}>
                    Chưa có dữ liệu
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const qty = r.qtyAdult + r.qtySenior + r.qtyChild;
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="p-3">{r.createdAt.slice(0, 10)}</td>
                      <td className="p-3 font-medium">{r.productName}</td>
                      <td className="p-3">{r.travelDate}</td>
                      <td className="p-3">{qty}</td>
                      <td className="p-3 font-semibold">{formatVND(r.total)}</td>
                      <td className="p-3">{r.seller}</td>
                      <td className="p-3">
                        <span className="rounded-full border px-2 py-1 text-xs">
                          {r.sellerType}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-muted-foreground">
          Hiện đang mock từ localStorage (affiliate issue). Khi nối Supabase, bảng này sẽ hiển thị cả customer orders + affiliate orders.
        </div>
      </CardContent>
    </Card>
  );
}
