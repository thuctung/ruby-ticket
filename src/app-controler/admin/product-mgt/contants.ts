import { ROLES } from "@/commons/constant";
import { formatVND } from "@/lib/money";
import { SiteType } from "@/types/ticket";
import { randomBytes } from "crypto";

export const fieldStyle =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

const cacheData = new Map();

export const getSideItem = (siteCode: string, siteList: SiteType[]): SiteType | null => {
  let siteItem = cacheData.get(siteCode);

  if (siteItem) {
    return siteItem;
  }
  siteItem = siteList.find((item) => item.code === siteCode);
  if (siteItem) {
    cacheData.set(siteCode, siteItem);
    return siteItem;
  }
  return null;
};

export const DISCOUNT_TYPE_PRICE = {
  ADD_PRICE: "ADD_PRICE",
  SUBT_PRICE: "SUBT_PRICE",
  ADD_PERCENT: "ADD_PERCENT",
  SUBT_PERCENT: "SUBT_PERCENT",
};

export const LIST_OPTION_DISCOUNT = [
  { code: DISCOUNT_TYPE_PRICE.ADD_PRICE, name: "Tăng theo giá" },
  { code: DISCOUNT_TYPE_PRICE.SUBT_PRICE, name: "Giảm theo giá" },
  { code: DISCOUNT_TYPE_PRICE.ADD_PERCENT, name: "Tăng theo phần trăm" },
  { code: DISCOUNT_TYPE_PRICE.SUBT_PERCENT, name: "Giảm theo phần trăm" },
];

const getTextByAgentCode = (agentCode: string) => {
  if (agentCode === ROLES.CUSTOMER || agentCode === ROLES.REGISTER) {
    return " vào giá công bố";
  }
  return " vào giá gốc";
};

export const getNoteTextDiscount = (agentCode: string, value: number, typeDiscount: string) => {
  const prexText = getTextByAgentCode(agentCode);
  let subText = "";
  switch (typeDiscount) {
    case DISCOUNT_TYPE_PRICE.ADD_PRICE: {
      subText = formatVND(value);
      break;
    }
    case DISCOUNT_TYPE_PRICE.SUBT_PRICE: {
      subText = `- ${formatVND(value)}`;
      break;
    }
    case DISCOUNT_TYPE_PRICE.ADD_PERCENT: {
      subText = `${value}%`;
      break;
    }
    case DISCOUNT_TYPE_PRICE.SUBT_PERCENT: {
      subText = `- ${value}%`;
      break;
    }
  }

  return `${subText} ${prexText}`;
};

export const getNoteTextDiscountDefault = (agentCode: string, value: number) => {
  if (agentCode === ROLES.CUSTOMER || agentCode === ROLES.REGISTER) {
    return `Giảm ${value}% vào giá công bố`;
  }
  return `Thêm ${formatVND(value)} vào  giá gốc`;
};

export const PRODUCT_DIALOG = {
  DEFAULT_PRICE: "DEFAULT_PRICE",
  AGENT_PRICE: "AGENT_PRICE",
  PRODUC_DETAIL: "PRODUC_DETAIL",
};

export const generatProductCode = (siteCode: string) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = randomBytes(10);
  return `${siteCode}-${Array.from(bytes, (byte) => chars[byte % chars.length]).join("")}`;
};
