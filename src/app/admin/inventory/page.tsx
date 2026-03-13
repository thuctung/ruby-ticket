"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { listProducts, type ProductKey } from "@/lib/products";
import { listInventory, upsertInventory, type InventoryRow } from "@/lib/adminStore";
import { listSales } from "@/lib/affiliateStore";

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

export default function AdminInventoryPage() {
  const products = listProducts();

  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [productKey, setProductKey] = useState<ProductKey>("bana");
  const [date, setDate] = useState(todayISO());
  const [capacity, setCapacity] = useState(100);

  // Recompute on localStorage updates (affiliate sales & inventory)
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const load = () => {
      setRows(listInventory());
      setTick((x) => x + 1);
    };
    load();

    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const soldMap = useMemo(() => {
    // sold per (dateSold + productKey)
    void tick;
    const sales = listSales();
    const map = new Map<string, number>();
    for (const s of sales) {
      const daySold = s.createdAt.slice(0, 10);
      const qty = s.qtyAdult + s.qtySenior + s.qtyChild;
      const k = `${daySold}|${s.productKey}`;
      map.set(k, (map.get(k) ?? 0) + qty);
    }
    return map;
  }, [tick]);

  const filtered = useMemo(() => {
    return rows.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [rows]);

  const selectedSold = soldMap.get(`${date}|${productKey}`) ?? 0;
  const selectedRemaining = Math.max(0, capacity - selectedSold);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Nhập số lượng vé (inventory)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-2xl border p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            </div>
            <div className="space-y-2">
              <Label>Ngày</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Số lượng vé</Label>
              <Input
                type="number"
                min={0}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border bg-muted/20 p-3">
              <div className="text-xs text-muted-foreground">Đã bán (ngày bán)</div>
              <div className="text-lg font-semibold">{selectedSold}</div>
            </div>
            <div className="rounded-xl border bg-muted/20 p-3">
              <div className="text-xs text-muted-foreground">Còn lại</div>
              <div className="text-lg font-semibold">{selectedRemaining}</div>
            </div>
            <div className="rounded-xl border bg-muted/20 p-3">
              <div className="text-xs text-muted-foreground">Capacity</div>
              <div className="text-lg font-semibold">{capacity}</div>
            </div>
          </div>

          <Button
            onClick={() => {
              upsertInventory({ productKey, date, capacity });
              alert("Saved (mock)");
            }}
          >
            Lưu inventory
          </Button>

          <div className="text-xs text-muted-foreground">
            Mock localStorage. “Đã bán” lấy từ affiliate issue (localStorage) theo ngày bán + địa điểm.
          </div>
        </div>

        <Separator />

        <div className="overflow-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="p-3">Ngày (ngày bán)</th>
                <th className="p-3">Điểm đến</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Đã bán</th>
                <th className="p-3">Còn lại</th>
                <th className="p-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={6}>
                    Chưa có inventory
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const sold = soldMap.get(`${r.date}|${r.productKey}`) ?? 0;
                  const remaining = Math.max(0, r.capacity - sold);
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="p-3">{r.date}</td>
                      <td className="p-3">{r.productKey}</td>
                      <td className="p-3 font-medium">{r.capacity}</td>
                      <td className="p-3">{sold}</td>
                      <td className="p-3 font-semibold">{remaining}</td>
                      <td className="p-3">{r.updatedAt.slice(0, 10)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
