import { z } from "zod";

export const productKeySchema = z.enum([
  "bana",
  "vinpearl",
  "hoian-memories",
  "nui-than-tai",
  "cruise",
]);

export type ProductKey = z.infer<typeof productKeySchema>;

export type ProductConfig = {
  key: ProductKey;
  // i18n keys
  nameKey: "product.bana.name" | "product.vinpearl.name" | "product.hoian.name" | "product.nuiThanTai.name" | "product.cruise.name";
  taglineKey:
    | "product.bana.tagline"
    | "product.vinpearl.tagline"
    | "product.hoian.tagline"
    | "product.nuiThanTai.tagline"
    | "product.cruise.tagline";
  badgeKey:
    | "product.bana.badge"
    | "product.vinpearl.badge"
    | "product.hoian.badge"
    | "product.nuiThanTai.badge"
    | "product.cruise.badge";

  // UI/logic toggles
  showCentralRegionCheckbox: boolean;
  paxTypes: ("adult" | "senior" | "child")[];

  // Some products (e.g. Bà Nà) have sub-types like "vé cáp" or "combo"
  ticketOptions?: { key: string; labelKey: "product.bana.ticket.cap" | "product.bana.ticket.combo" }[];
};

export const PRODUCTS: Record<ProductKey, ProductConfig> = {
  bana: {
    key: "bana",
    nameKey: "product.bana.name",
    taglineKey: "product.bana.tagline",
    badgeKey: "product.bana.badge",
    showCentralRegionCheckbox: true,
    paxTypes: ["adult", "senior", "child"],
    ticketOptions: [
      { key: "cap", labelKey: "product.bana.ticket.cap" },
      { key: "combo", labelKey: "product.bana.ticket.combo" },
    ],
  },
  vinpearl: {
    key: "vinpearl",
    nameKey: "product.vinpearl.name",
    taglineKey: "product.vinpearl.tagline",
    badgeKey: "product.vinpearl.badge",
    showCentralRegionCheckbox: true,
    paxTypes: ["adult", "senior", "child"],
  },
  "hoian-memories": {
    key: "hoian-memories",
    nameKey: "product.hoian.name",
    taglineKey: "product.hoian.tagline",
    badgeKey: "product.hoian.badge",
    showCentralRegionCheckbox: false,
    paxTypes: ["adult", "child"],
  },
  "nui-than-tai": {
    key: "nui-than-tai",
    nameKey: "product.nuiThanTai.name",
    taglineKey: "product.nuiThanTai.tagline",
    badgeKey: "product.nuiThanTai.badge",
    showCentralRegionCheckbox: true,
    paxTypes: ["adult", "senior", "child"],
  },
  cruise: {
    key: "cruise",
    nameKey: "product.cruise.name",
    taglineKey: "product.cruise.tagline",
    badgeKey: "product.cruise.badge",
    showCentralRegionCheckbox: false,
    paxTypes: ["adult", "child"],
  },
};

export function getProduct(key: ProductKey) {
  return PRODUCTS[key];
}

export function listProducts() {
  return Object.values(PRODUCTS);
}
