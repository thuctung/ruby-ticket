export type Side = "BUY" | "SELL";

export interface Product {
  code: string; // khóa dùng để đối chiếu giữa list A và list B
  name: string;
  side: Side;
  price: number;
  updatedAt: string;
}

export const SIDES: { value: Side; label: string }[] = [
  { value: "BUY", label: "Mua" },
  { value: "SELL", label: "Bán" },
];

// List A: dữ liệu cũ (đang lưu trong hệ thống)
// TODO: thay bằng dữ liệu từ API/DB
export const LIST_A: Product[] = [
  {
    code: "P001",
    name: "Áo thun cotton",
    side: "SELL",
    price: 150000,
    updatedAt: "2026-10-18 09:12",
  },
  {
    code: "P002",
    name: "Quần jean slim",
    side: "SELL",
    price: 420000,
    updatedAt: "2026-10-18 10:40",
  },
  { code: "P003", name: "Giày sneaker", side: "BUY", price: 650000, updatedAt: "2026-10-18 16:05" },
  { code: "P004", name: "Balo laptop", side: "BUY", price: 380000, updatedAt: "2026-10-18 08:30" },
  { code: "P005", name: "Mũ lưỡi trai", side: "SELL", price: 90000, updatedAt: "2026-10-18 14:22" },
  { code: "P006", name: "Áo khoác gió", side: "BUY", price: 520000, updatedAt: "2026-10-18 07:55" },
];

// List B: dữ liệu mới (nguồn cần đồng bộ), số lượng khác list A
// TODO: thay bằng dữ liệu từ API bên ngoài
export const LIST_B: Product[] = [
  {
    code: "P001",
    name: "Áo thun cotton",
    side: "SELL",
    price: 150000,
    updatedAt: "2026-10-21 08:00",
  },
  {
    code: "P002",
    name: "Quần jean slim",
    side: "SELL",
    price: 450000,
    updatedAt: "2026-10-21 08:00",
  },
  { code: "P003", name: "Giày sneaker", side: "BUY", price: 600000, updatedAt: "2026-10-21 08:00" },
  { code: "P004", name: "Balo laptop", side: "BUY", price: 380000, updatedAt: "2026-10-21 08:00" },
  {
    code: "P007",
    name: "Túi tote vải",
    side: "SELL",
    price: 120000,
    updatedAt: "2026-10-21 08:00",
  },
  { code: "P008", name: "Kính râm", side: "BUY", price: 310000, updatedAt: "2026-10-21 08:00" },
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

export function filterProducts<T extends { name: string; side: string }>(
  list: T[],
  f: { name: string; side: string }
) {
  const q = f.name.trim().toLowerCase();
  return list.filter(
    (p) => (!q || p.name.toLowerCase().includes(q)) && (!f.side || p.side === f.side)
  );
}
