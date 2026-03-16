"use client";

import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/lib/money";
import { listSales, sumByDay, sumByProduct } from "@/lib/affiliateStore";
import { useLang } from "@/lib/useLang";
import { t } from "@/lib/i18n/t";
import { getProduct } from "@/lib/products";
import type { ProductKey } from "@/lib/products";

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

export default function AffiliateStatsPage() {
  const lang = useLang();

  const [from, setFrom] = useState(daysAgoISO(7));
  const [to, setTo] = useState(todayISO());
  const [all, setAll] = useState(listSales());

  useEffect(() => {
    const load = () => setAll(listSales());
    load();

    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    return all.filter((s) => {
      const day = s.createdAt.slice(0, 10);
      return day >= from && day <= to;
    });
  }, [all, from, to]);

  const totals = useMemo(() => {
    const tickets = filtered.reduce(
      (acc, s) => acc + s.qtyAdult + s.qtySenior + s.qtyChild,
      0
    );
    const revenue = filtered.reduce((acc, s) => acc + s.total, 0);
    return { tickets, revenue };
  }, [filtered]);

  const byDay = useMemo(() => sumByDay(filtered), [filtered]);
  const byProduct = useMemo(() => sumByProduct(filtered), [filtered]);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Thống kê (mock)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="text-sm text-muted-foreground">Tổng doanh thu</div>
              <div className="mt-1 text-xl font-semibold">{formatVND(totals.revenue)}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Tổng vé: <span className="font-medium">{totals.tickets}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Theo ngày</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground">
                      <tr>
                        <th className="py-2">Ngày</th>
                        <th className="py-2">Số vé</th>
                        <th className="py-2">Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byDay.length === 0 ? (
                        <tr>
                          <td className="py-3 text-muted-foreground" colSpan={3}>
                            Chưa có dữ liệu
                          </td>
                        </tr>
                      ) : (
                        byDay.map((r) => (
                          <tr key={r.day} className="border-t">
                            <td className="py-2">{r.day}</td>
                            <td className="py-2">{r.count}</td>
                            <td className="py-2">{formatVND(r.revenue)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Theo địa điểm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground">
                      <tr>
                        <th className="py-2">Địa điểm</th>
                        <th className="py-2">Số vé</th>
                        <th className="py-2">Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byProduct.length === 0 ? (
                        <tr>
                          <td className="py-3 text-muted-foreground" colSpan={3}>
                            Chưa có dữ liệu
                          </td>
                        </tr>
                      ) : (
                        byProduct.map((r) => {
                          const p = getProduct(r.productKey as ProductKey);
                          return (
                            <tr key={r.productKey} className="border-t">
                              <td className="py-2">{t(lang, p.nameKey)}</td>
                              <td className="py-2">{r.count}</td>
                              <td className="py-2">{formatVND(r.revenue)}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-xs text-muted-foreground">
            Dữ liệu thống kê hiện đang lấy từ localStorage (mock). Khi nối Supabase, phần này sẽ query theo user affiliate.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
