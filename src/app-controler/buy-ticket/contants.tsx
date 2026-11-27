import { BASIC_DATE_FORMAT } from "@/helpers/dateTime";
import { AgentPriceType, CategorySubmitType, ProductBanaType } from "@/types/ticket";
import dayjs from "dayjs";
import { get } from "lodash";

export const toDate = dayjs(new Date()).format(BASIC_DATE_FORMAT);

let cacheCategory: any = {};
export const getCategaryItem = (
  categoryCode: string,
  listCategory: CategorySubmitType[]
): CategorySubmitType | null => {
  const cateItem = get(cacheCategory, categoryCode);
  if (cateItem) {
    return cateItem;
  }
  if (listCategory.length) {
    const fintCategoryItem = listCategory.find((item) => item.code === categoryCode);
    if (fintCategoryItem) {
      cacheCategory[fintCategoryItem.code] = fintCategoryItem;
      return fintCategoryItem;
    }
    return null;
  }
  return null;
};

export const BADGE_STYLES: Record<string, string> = {
  ADULT: "bg-gradient-to-br from-[#ff4d4d] to-[#e11d48] text-white",
  CHILD: "bg-gradient-to-br from-sky-500 to-sky-400 text-white",
  SENIOR: "bg-gradient-to-br from-violet-500 to-violet-400 text-white",
  DEFAULT: "bg-gradient-to-br from-yellow-500 to-yellow-400 text-white",
};

export const getImageProduct = (product: ProductBanaType) => {
  const { site_code } = product;
  if (product.restaurantName) {
    return `/${site_code}/buffet.jpg`;
  }
  return `/${site_code}/cap.jpg`;
};

export const mapAgentPriceByProductCode = (listAgentPrice: AgentPriceType[]) => {
  const mapAgentPrice = new Map<string, AgentPriceType>();
  if (listAgentPrice) {
    listAgentPrice.forEach((item) => {
      mapAgentPrice.set(item.product_code, item);
    });
  }

  return mapAgentPrice;
};

export const styleBtnAddCard = `flex h-11 min-w-0 flex-1 items-center justify-center gap-2
  whitespace-nowrap rounded-xl px-4
  bg-gradient-to-r from-[#ff3b3b] via-[#e5092e] to-[#c90032]
  text-sm font-bold text-white
  shadow-md shadow-red-500/25
  transition-all duration-300
  hover:brightness-110 hover:shadow-lg hover:shadow-red-500/35
  active:scale-[0.97]
  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300/50
  disabled:cursor-not-allowed disabled:bg-slate-300
  disabled:bg-none disabled:shadow-none disabled:active:scale-100`;

export const styleBtnPayment = ` w-full mt-5 rounded-xl
  bg-gradient-to-r from-[#ff3b3b] via-[#e5092e] to-[#c90032]
  px-3 py-3 font-semibold text-white
  shadow-md shadow-red-500/30
  transition-all duration-300
  hover:brightness-110 hover:shadow-lg hover:shadow-red-500/40
  active:scale-[0.98]
  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300/60
  disabled:cursor-not-allowed
  disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300
  disabled:text-white/80 disabled:shadow-none
  disabled:hover:brightness-100 disabled:active:scale-100`;
