// Draft coupons. Khi có DB thì chuyển sang truy vấn server.
export const DRAFT_COUPONS: any[] = [
  { code: "MOON10", type: "percent", value: 10, label: "Giảm 10%" },
  { code: "GIAM50K", type: "fixed", value: 50000, label: "Giảm 50.000đ" },
];

export const findCoupon = (code?: string | null) =>
  code ? (DRAFT_COUPONS.find((c) => c.code === code.toUpperCase()) ?? null) : null;

export function calcTotals(items: Pick<any, "price" | "qty">[], coupon: any | null) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const raw = !coupon
    ? 0
    : coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
  const discount = Math.min(raw, subtotal);
  return { subtotal, discount, total: subtotal - discount };
}
