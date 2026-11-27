import { BASIC_DATE_FORMAT } from "@/helpers/dateTime";
import { AgentPriceType, ProductBanaType, ResultListProductType, SiteType } from "@/types/ticket";
import dayjs from "dayjs";
import z from "zod";

export const BOOKING_FORM_TYPE = {
  ["AFFILATE"]: "AFFILATE",
  ["CUSTOMER"]: "CUSTOMER",
};

export const DISCOUNT_TYPE_PRICE = {
  ADD_PRICE: "ADD_PRICE",
  SUBT_PRICE: "SUBT_PRICE",
  ADD_PERCENT: "ADD_PERCENT",
  SUBT_PERCENT: "SUBT_PERCENT",
};

export type BookingFormProps = {
  siteCode: string;
  loading: boolean;
  listSite: SiteType[];
  formData: any;
  listProduct: ResultListProductType[];
  quantities: Record<string, number>;
  totalTickets: number;
  total: number;
  siteName: string;
  selectedLines: any[];
  formType: string;
  agentPrice: number;
  exportGuideTicket?: boolean;
  mapAgentPrice: Map<string, AgentPriceType>;
  currentSite?: SiteType;
  agentPriceDefault: number;
  setFieldFormData: (key: string, value: any, needCallData?: boolean) => void;
  setSiteCode: (value: string) => void;
  setQty: (code: string, value: number) => void;
  handleBuyTicket: () => void;
  setExportGuideTicket?: (value: boolean) => void;
};

export const CustomerInfoSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  fullname: z.string().trim(),
  phone: z
    .string()
    .trim()
    .min(8, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+ ]+$/, "SĐT chỉ nên gồm số"),
});

export const getPriceByType = (agentPriceItem: AgentPriceType, basePrice: number) => {
  const { type, price } = agentPriceItem;
  let result = 0;
  switch (type) {
    case DISCOUNT_TYPE_PRICE.ADD_PRICE: {
      result = basePrice + price;
      break;
    }
    case DISCOUNT_TYPE_PRICE.SUBT_PRICE: {
      result = basePrice - price;
      break;
    }
    case DISCOUNT_TYPE_PRICE.ADD_PERCENT: {
      result = basePrice + (basePrice * price) / 100;
      break;
    }
    case DISCOUNT_TYPE_PRICE.SUBT_PERCENT: {
      result = basePrice - (basePrice * price) / 100;
      break;
    }
  }

  return Math.max(0, result);
};

export const getPriceAgentAndMultiple = (
  ticket: ProductBanaType,
  agentCode: string,
  mapAgentPrice: Map<string, AgentPriceType>,
  agentPriceDefault: number
) => {
  let priceResult = 0;
  const isAffiliate = agentCode === BOOKING_FORM_TYPE.AFFILATE;
  const basePrice = isAffiliate ? ticket.unitPrice : ticket.publicPrice;

  const agentPriceItem = mapAgentPrice.get(ticket.code);

  if (agentPriceItem && agentPriceItem.price !== 0) {
    priceResult = getPriceByType(agentPriceItem, basePrice);
  } else if (isAffiliate) {
    priceResult = basePrice + agentPriceDefault;
  } else {
    priceResult = basePrice - (basePrice * agentPriceDefault) / 100;
  }
  priceResult = Math.max(0, priceResult);
  priceResult = ticket.multiple > 1 ? Math.ceil(priceResult / ticket.multiple) : priceResult;

  return Math.ceil(priceResult / 10) * 10;
};

export const PRODUCT_TYPE = {
  ["ADULT"]: "Người lớn",
  ["CHILD"]: "Trẻ em",
  ["ALL"]: "Chung",
  ["SENIORS"]: "Người cao tuổi",
  ["BEST_SELLER"]: "Bán chạy",
};

export const getPerSonTypeName = (typeCode: string) => {
  switch (typeCode) {
    case "ADULT":
      return "Người lớn/Adult";
    case "CHILD":
      return "Trẻ em/Child";
    case "ALL":
      return "Chung/All";
    default:
      return typeCode || "";
  }
};
export const toDate = dayjs(new Date()).format(BASIC_DATE_FORMAT);
