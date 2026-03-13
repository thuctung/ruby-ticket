"use client";

import type { ProductKey } from "@/lib/products";

export type TicketOption = "cap" | "combo";

export type AffiliateSale = {
  id: string;
  createdAt: string; // ISO
  affiliateEmail?: string;
  travelDate: string; // YYYY-MM-DD
  productKey: ProductKey;
  ticketOption?: TicketOption;
  qtyAdult: number;
  qtySenior: number;
  qtyChild: number;
  email: string;
  phone: string;
  subtotal: number;
  discount: number;
  total: number;
};

const KEY_WALLET = "dnt.affiliate.wallet";
const KEY_SALES = "dnt.affiliate.sales";

type WalletState = { balance: number };

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("storage"));
}

export function getWallet(): WalletState {
  return readJson<WalletState>(KEY_WALLET, { balance: 0 });
}

export function setWallet(next: WalletState) {
  writeJson(KEY_WALLET, next);
}

export function topup(amount: number) {
  const w = getWallet();
  setWallet({ balance: w.balance + amount });
}

export function listSales(): AffiliateSale[] {
  return readJson<AffiliateSale[]>(KEY_SALES, []);
}

export function addSale(sale: AffiliateSale) {
  const s = listSales();
  s.unshift(sale);
  writeJson(KEY_SALES, s);
}

function uid(prefix = "S") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

type Pricing = {
  adult: number;
  senior: number;
  child: number;
  centralDiscount: number; // 0..1
};

const PRICING: Record<ProductKey, Pricing | Record<TicketOption, Pricing>> = {
  bana: {
    cap: { adult: 1200000, senior: 1050000, child: 800000, centralDiscount: 0.1 },
    combo: { adult: 1450000, senior: 1300000, child: 980000, centralDiscount: 0.1 },
  },
  vinpearl: { adult: 1100000, senior: 980000, child: 760000, centralDiscount: 0.08 },
  "hoian-memories": { adult: 600000, senior: 0, child: 450000, centralDiscount: 0 },
  "nui-than-tai": { adult: 700000, senior: 620000, child: 520000, centralDiscount: 0.1 },
  cruise: { adult: 450000, senior: 0, child: 320000, centralDiscount: 0 },
};

export function calcTotal(params: {
  productKey: ProductKey;
  ticketOption?: TicketOption;
  isCentralRegion?: boolean;
  qtyAdult: number;
  qtySenior: number;
  qtyChild: number;
}) {
  const { productKey, ticketOption, isCentralRegion, qtyAdult, qtySenior, qtyChild } =
    params;

  const pricing = (() => {
    const p = PRICING[productKey];
    if (productKey === "bana") {
      const byOpt = p as Record<TicketOption, Pricing>;
      const opt: TicketOption = ticketOption ?? "cap";
      return byOpt[opt] ?? byOpt.cap;
    }
    return p as Pricing;
  })();

  const subtotal =
    qtyAdult * pricing.adult + qtySenior * pricing.senior + qtyChild * pricing.child;
  const discount = isCentralRegion ? Math.round(subtotal * pricing.centralDiscount) : 0;
  const total = Math.max(0, subtotal - discount);

  return { subtotal, discount, total };
}

export function issueTicketFromWallet(input: {
  affiliateEmail?: string;
  travelDate: string;
  productKey: ProductKey;
  ticketOption?: TicketOption;
  isCentralRegion?: boolean;
  qtyAdult: number;
  qtySenior: number;
  qtyChild: number;
  email: string;
  phone: string;
}) {
  const totals = calcTotal(input);

  const w = getWallet();
  if (w.balance < totals.total) {
    throw new Error("Số dư ví không đủ");
  }

  setWallet({ balance: w.balance - totals.total });

  const sale: AffiliateSale = {
    id: uid("SALE"),
    createdAt: new Date().toISOString(),
    affiliateEmail: input.affiliateEmail,
    travelDate: input.travelDate,
    productKey: input.productKey,
    ticketOption: input.ticketOption,
    qtyAdult: input.qtyAdult,
    qtySenior: input.qtySenior,
    qtyChild: input.qtyChild,
    email: input.email,
    phone: input.phone,
    ...totals,
  };

  addSale(sale);

  return sale;
}

export function sumByDay(sales: AffiliateSale[]) {
  const map = new Map<string, { day: string; count: number; revenue: number }>();
  for (const s of sales) {
    const day = s.createdAt.slice(0, 10);
    const cur = map.get(day) ?? { day, count: 0, revenue: 0 };
    cur.count += s.qtyAdult + s.qtySenior + s.qtyChild;
    cur.revenue += s.total;
    map.set(day, cur);
  }
  return Array.from(map.values()).sort((a, b) => (a.day < b.day ? 1 : -1));
}

export function sumByProduct(sales: AffiliateSale[]) {
  const map = new Map<string, { productKey: string; count: number; revenue: number }>();
  for (const s of sales) {
    const key = s.productKey;
    const cur = map.get(key) ?? { productKey: key, count: 0, revenue: 0 };
    cur.count += s.qtyAdult + s.qtySenior + s.qtyChild;
    cur.revenue += s.total;
    map.set(key, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}
