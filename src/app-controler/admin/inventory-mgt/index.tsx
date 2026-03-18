"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type ProductKey } from "@/lib/products";
import { listSales } from "@/lib/affiliateStore";
import { getListInventory, upsertInventory } from "./apis";
import { InventoryForm } from "./components/inventory-form";
import { InventoryTable } from "./components/inventory-table";

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

export default function InventoryMgt() {
  const [rows, setRows] = useState<any[]>([]);
  const [productKey, setProductKey] = useState<ProductKey>("bana");
  const [date, setDate] = useState(todayISO());
  const [capacity, setCapacity] = useState(100);
  const [tick, setTick] = useState(0);

  const handleLoadData = useCallback(async () => {
    const data = await getListInventory();
    setRows(data);
    setTick((x) => x + 1);
  }, []);

  useEffect(() => {
    handleLoadData();

    const onStorage = () => {
      setTick((x) => x + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [handleLoadData]);

  const handleSave = async () => {
    const result = await upsertInventory({
      product_key: productKey,
      date,
      capacity,
    });
    if (result) {
      handleLoadData();
    }
  };

  const soldMap = useMemo(() => {
    const sales = listSales();
    const map = new Map<string, number>();
    for (const s of sales) {
      const daySold = s.createdAt.slice(0, 10);
      const qty = s.qtyLON + s.qtyGIA + s.qtyNHO + s.qtyChung + s.qtyCHILDANDAUL;
      const k = `${daySold}|${s.productKey}`;
      map.set(k, (map.get(k) ?? 0) + qty);
    }
    return map;
  }, [tick, rows]);

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
        <InventoryForm
          productKey={productKey}
          date={date}
          capacity={capacity}
          setProductKey={setProductKey}
          setDate={setDate}
          setCapacity={setCapacity}
          onSave={handleSave}
          selectedSold={selectedSold}
          selectedRemaining={selectedRemaining}
        />
        <Separator />
        <InventoryTable filtered={filtered} soldMap={soldMap} />
      </CardContent>
    </Card>
  );
}
