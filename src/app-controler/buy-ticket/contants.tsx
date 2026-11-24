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
