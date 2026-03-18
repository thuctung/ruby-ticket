import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listProducts, type ProductKey } from "@/lib/products";

interface InventoryFormProps {
  productKey: ProductKey;
  date: string;
  capacity: number;
  setProductKey: (key: ProductKey) => void;
  setDate: (date: string) => void;
  setCapacity: (cap: number) => void;
  onSave: () => void;
  selectedSold: number;
  selectedRemaining: number;
}

export function InventoryForm({
  productKey,
  date,
  capacity,
  setProductKey,
  setDate,
  setCapacity,
  onSave,
  selectedSold,
  selectedRemaining,
}: InventoryFormProps) {
  const products = listProducts();

  return (
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

      <Button onClick={onSave}>
        Lưu inventory
      </Button>

      <div className="text-xs text-muted-foreground">
        Dữ liệu được lưu trữ trên hệ thống Supabase.
      </div>
    </div>
  );
}
