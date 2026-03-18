"use client";

import type { ProductKey } from "@/lib/products";

export type TicketOption =  string;

export type AffiliateSale = {
  id: string;
  createdAt: string; // ISO
  affiliateEmail?: string;
  travelDate: string; // YYYY-MM-DD
  productKey: ProductKey;
  ticketOption?: TicketOption;
  qtyLON: number;
  qtyGIA: number;
  qtyNHO: number;
  qtyChung: number;
  qtyCHILDANDAUL: number;
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
  LON: number;
  GIA: number;
  NHO: number;
  Chung: number;
  CHILDANDAUL: number;
  centralDiscount: number; // 0..1
};

const PRICING: Record<ProductKey, Pricing | Record<TicketOption, Pricing>> = {
  bana: {
    cap: { LON: 1200000, GIA: 1050000, NHO: 800000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0.1 },
    combo: { LON: 1450000, GIA: 1300000, NHO: 980000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0.1 },
  },
  vinpearl: { LON: 1100000, GIA: 980000, NHO: 760000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0.08 },
  "hoian-memories": { LON: 600000, GIA: 0, NHO: 450000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0 },
  "nui-than-tai": { LON: 700000, GIA: 620000, NHO: 520000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0.1 },
  cruise: { LON: 450000, GIA: 0, NHO: 320000, Chung: 0, CHILDANDAUL: 0, centralDiscount: 0 },
};

export function calcTotal(params: {
  productKey: ProductKey;
  ticketOption?: TicketOption;
  isCentralRegion?: boolean;
  qtyLON: number;
  qtyGIA: number;
  qtyNHO: number;
  qtyChung: number;
  qtyCHILDANDAUL: number;
}) {
  const { productKey, ticketOption, isCentralRegion, qtyLON, qtyGIA, qtyNHO, qtyChung, qtyCHILDANDAUL } =
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
    qtyLON * pricing.LON + qtyGIA * pricing.GIA + qtyNHO * pricing.NHO + qtyChung * pricing.Chung + qtyCHILDANDAUL * pricing.CHILDANDAUL;
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
  qtyLON: number;
  qtyGIA: number;
  qtyNHO: number;
  qtyChung: number;
  qtyCHILDANDAUL: number;
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
    qtyLON: input.qtyLON,
    qtyGIA: input.qtyGIA,
    qtyNHO: input.qtyNHO,
    qtyChung: input.qtyChung,
    qtyCHILDANDAUL: input.qtyCHILDANDAUL,
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
    cur.count += s.qtyLON + s.qtyGIA + s.qtyNHO + s.qtyChung + s.qtyCHILDANDAUL;
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
    cur.count += s.qtyLON + s.qtyGIA + s.qtyNHO + s.qtyChung + s.qtyCHILDANDAUL;
    cur.revenue += s.total;
    map.set(key, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}
