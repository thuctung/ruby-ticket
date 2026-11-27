import { ProductBanaType } from "@/types/ticket";
import { Product } from "./products";

export type DiffType = "new" | "changed" | "unchanged" | "only_a";

export interface DiffRow extends ProductBanaType {
  type: DiffType;
  newPublicPrice: number | null; // giá ở A (null nếu sản phẩm mới)
  oldPublicPrice: number | null; // giá ở B (null nếu chỉ có ở A)
  newUnitPrice: number | null; // giá ở B (null nếu chỉ có ở A)
  oldUnitPrice: number | null; // giá ở B (null nếu chỉ có ở A)
}

/** So sánh A (cũ) với B (mới) theo product code. */
export function computeDiff(oldList: ProductBanaType[], newList: ProductBanaType[]): DiffRow[] {
  const mapOld = new Map(oldList.map((product) => [product.code, product]));
  const mapNew = new Map(newList.map((product) => [product.code, product]));
  const rows: DiffRow[] = [];

  for (const newProduct of newList) {
    const oldProduct = mapOld.get(newProduct.code);
    if (!oldProduct) {
      rows.push({
        ...newProduct,
        type: "new",
        oldPublicPrice: null,
        newPublicPrice: newProduct.publicPrice,
        oldUnitPrice: null,
        newUnitPrice: newProduct.unitPrice,
      });
    } else {
      rows.push({
        ...newProduct,
        type:
          oldProduct.unitPrice !== newProduct.unitPrice ||
          oldProduct.publicPrice !== newProduct.publicPrice
            ? "changed"
            : "unchanged",
        oldPublicPrice: oldProduct.publicPrice,
        newPublicPrice: newProduct.publicPrice,
        oldUnitPrice: oldProduct.unitPrice,
        newUnitPrice: newProduct.unitPrice,
      });
    }
  }

  // Sản phẩm chỉ có ở A: giữ nguyên, không xóa
  for (const oldProduct of oldList) {
    if (!mapNew.has(oldProduct.code)) {
      rows.push({
        ...oldProduct,
        type: "only_a",
        oldPublicPrice: oldProduct.publicPrice,
        newPublicPrice: null,
        oldUnitPrice: oldProduct.publicPrice,
        newUnitPrice: null,
      });
    }
  }
  return rows;
}

/** Trả về list A mới: cập nhật giá theo B, thêm sản phẩm mới từ B. */
export function applySync(a: Product[], b: Product[], now: string): Product[] {
  const mapB = new Map(b.map((p) => [p.code, p]));
  const updated = a.map((pa) => {
    const pb = mapB.get(pa.code);
    return pb && pb.price !== pa.price ? { ...pa, price: pb.price, updatedAt: now } : pa;
  });
  const existing = new Set(a.map((p) => p.code));
  const added = b.filter((pb) => !existing.has(pb.code)).map((pb) => ({ ...pb, updatedAt: now }));
  return [...updated, ...added];
}

export function summarize(rows: DiffRow[]) {
  return {
    new: rows.filter((r) => r.type === "new").length,
    changed: rows.filter((r) => r.type === "changed").length,
    unchanged: rows.filter((r) => r.type === "unchanged").length,
    only_a: rows.filter((r) => r.type === "only_a").length,
  };
}
