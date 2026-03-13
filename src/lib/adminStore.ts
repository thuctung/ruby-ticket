"use client";

import type { ProductKey } from "@/lib/products";
import type { AffiliateSale } from "@/lib/affiliateStore";
import { listSales } from "@/lib/affiliateStore";

export type AffiliateStatus = "pending" | "approved" | "suspended";

export type AffiliateAccount = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: AffiliateStatus;
  createdAt: string; // ISO

  // mock password management (admin-only)
  tempPassword?: string;
  passwordUpdatedAt?: string; // ISO
};

export type PaxType = "adult" | "senior" | "child";

export type PriceTier = "customer" | "affiliate";

export type PriceRow = {
  id: string;
  productKey: ProductKey;
  ticketOption?: "cap" | "combo";
  paxType: PaxType;
  tier: PriceTier;
  basePrice: number;
  promoPrice?: number;
  centralEligible: boolean;
  updatedAt: string;
};

export type InventoryRow = {
  id: string;
  productKey: ProductKey;
  date: string; // YYYY-MM-DD
  capacity: number;
  updatedAt: string;
};

const KEY_AFF = "dnt.admin.affiliates";
const KEY_PRICE = "dnt.admin.pricing";
const KEY_INV = "dnt.admin.inventory";

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

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

export function listAffiliates(): AffiliateAccount[] {
  return readJson<AffiliateAccount[]>(KEY_AFF, []);
}

export function seedAffiliateIfMissing(email: string, name = "Affiliate") {
  const all = listAffiliates();
  if (all.some((a) => a.email === email)) return;
  all.unshift({
    id: uid("AFF"),
    name,
    email,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  writeJson(KEY_AFF, all);
}

export function upsertAffiliateApplication(input: {
  name: string;
  email: string;
  phone: string;
  address: string;
}) {
  const all = listAffiliates();
  const now = new Date().toISOString();

  const idx = all.findIndex((a) => a.email.toLowerCase() === input.email.toLowerCase());
  if (idx >= 0) {
    all[idx] = {
      ...all[idx],
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      // don't auto-approve; keep existing status
      status: all[idx].status ?? "pending",
    };
  } else {
    all.unshift({
      id: uid("AFF"),
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      status: "pending",
      createdAt: now,
    });
  }

  writeJson(KEY_AFF, all);
}

export function setAffiliateStatus(id: string, status: AffiliateStatus) {
  const all = listAffiliates();
  const idx = all.findIndex((a) => a.id === id);
  if (idx < 0) return;
  all[idx] = { ...all[idx], status };
  writeJson(KEY_AFF, all);
}

function generateTempPassword() {
  // simple human-readable temp password for demo
  const part = Math.random().toString(36).slice(2, 6).toUpperCase();
  const part2 = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DNT-${part}-${part2}`;
}

export function resetAffiliatePassword(id: string) {
  const all = listAffiliates();
  const idx = all.findIndex((a) => a.id === id);
  if (idx < 0) return null;

  const tempPassword = generateTempPassword();
  const now = new Date().toISOString();

  all[idx] = { ...all[idx], tempPassword, passwordUpdatedAt: now };
  writeJson(KEY_AFF, all);

  return { tempPassword, passwordUpdatedAt: now, affiliate: all[idx] };
}

export function listPricing(): PriceRow[] {
  return readJson<PriceRow[]>(KEY_PRICE, []);
}

export function upsertPrice(row: Omit<PriceRow, "id" | "updatedAt"> & { id?: string }) {
  const all = listPricing();
  const now = new Date().toISOString();
  if (row.id) {
    const idx = all.findIndex((r) => r.id === row.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...row, updatedAt: now } as PriceRow;
      writeJson(KEY_PRICE, all);
      return;
    }
  }
  all.unshift({
    id: uid("PRICE"),
    updatedAt: now,
    ...row,
  } as PriceRow);
  writeJson(KEY_PRICE, all);
}

export function listInventory(): InventoryRow[] {
  return readJson<InventoryRow[]>(KEY_INV, []);
}

export function upsertInventory(row: Omit<InventoryRow, "id" | "updatedAt"> & { id?: string }) {
  const all = listInventory();
  const now = new Date().toISOString();
  if (row.id) {
    const idx = all.findIndex((r) => r.id === row.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...row, updatedAt: now } as InventoryRow;
      writeJson(KEY_INV, all);
      return;
    }
  }
  all.unshift({
    id: uid("INV"),
    updatedAt: now,
    ...row,
  } as InventoryRow);
  writeJson(KEY_INV, all);
}

export function adminStats(params: { from: string; to: string }) {
  const sales: AffiliateSale[] = listSales();
  const filtered = sales.filter((s) => {
    const day = s.createdAt.slice(0, 10);
    return day >= params.from && day <= params.to;
  });

  const byProduct = new Map<string, { productKey: string; count: number; revenue: number }>();
  const byAffiliate = new Map<string, { email: string; count: number; revenue: number }>();
  const byDay = new Map<string, { day: string; count: number; revenue: number }>();

  for (const s of filtered) {
    const count = s.qtyAdult + s.qtySenior + s.qtyChild;

    const p = byProduct.get(s.productKey) ?? { productKey: s.productKey, count: 0, revenue: 0 };
    p.count += count;
    p.revenue += s.total;
    byProduct.set(s.productKey, p);

    const email = s.affiliateEmail ?? "unknown";
    const a = byAffiliate.get(email) ?? { email, count: 0, revenue: 0 };
    a.count += count;
    a.revenue += s.total;
    byAffiliate.set(email, a);

    const day = s.createdAt.slice(0, 10);
    const d = byDay.get(day) ?? { day, count: 0, revenue: 0 };
    d.count += count;
    d.revenue += s.total;
    byDay.set(day, d);
  }

  const totalTickets = filtered.reduce((acc, s) => acc + s.qtyAdult + s.qtySenior + s.qtyChild, 0);
  const totalRevenue = filtered.reduce((acc, s) => acc + s.total, 0);

  return {
    totalTickets,
    totalRevenue,
    byProduct: Array.from(byProduct.values()).sort((a, b) => b.revenue - a.revenue),
    byAffiliate: Array.from(byAffiliate.values()).sort((a, b) => b.revenue - a.revenue),
    byDay: Array.from(byDay.values()).sort((a, b) => (a.day < b.day ? 1 : -1)),
  };
}
