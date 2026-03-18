import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/money";

interface PricingFormProps {
  products: any[];
  form: Record<string, { basePrice: number; promoPrice?: number; centralEligible: boolean }>;
  setForm: (form: any) => void;
  onSave: () => void;
}

export function PricingForm({ products, form, setForm, onSave }: PricingFormProps) {
  const updateField = (productCode: string, field: string, val: any) => {
    setForm((prev: any) => ({
      ...prev,
      [productCode]: { ...prev[productCode], [field]: val },
    }));
  };

  if (products.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground border rounded-2xl border-dashed">
        Vui lòng chọn Loại vé để cấu hình giá cho các sản phẩm liên quan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const productCode = product.code;
          const currentForm = form[productCode] || { basePrice: 0, promoPrice: undefined, centralEligible: true };
          
          return (
            <div key={productCode} className="space-y-4 rounded-2xl border p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <Label className="text-sm font-bold leading-tight">
                  {product.name}
                </Label>
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {productCode}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Giá gốc (Base)</Label>
                <Input
                  type="number"
                  value={currentForm.basePrice}
                  onChange={(e) => updateField(productCode, "basePrice", Number(e.target.value))}
                  placeholder="0"
                />
                <div className="text-[10px] text-muted-foreground font-medium">
                  {formatVND(currentForm.basePrice)}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Giá khuyến mãi (Promo)</Label>
                <Input
                  type="number"
                  placeholder="Trống nếu không có"
                  value={currentForm.promoPrice ?? ""}
                  onChange={(e) =>
                    updateField(
                      productCode,
                      "promoPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
                {currentForm.promoPrice !== undefined && (
                  <div className="text-[10px] text-green-600 font-medium">
                    {formatVND(currentForm.promoPrice!)}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id={`central-${productCode}`}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={currentForm.centralEligible}
                  onChange={(e) => updateField(productCode, "centralEligible", e.target.checked)}
                />
                <Label htmlFor={`central-${productCode}`} className="text-[11px] cursor-pointer">
                  Áp dụng giảm giá người Miền Trung
                </Label>
              </div>
            </div>
          );
        })}
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button size="lg" className="px-10 rounded-xl" onClick={onSave}>
          Lưu bảng giá cho {products.length} sản phẩm
        </Button>
      </div>
    </div>
  );
}
