import { ProductBanaType, ResultListProductType, SideSunGroupType } from "@/types/ticket";
import z from "zod";

export const SUN_BOOKING_FORM_TYPE = {
  ["AFFILATE"]: "AFFILATE",
  ["CUSTOMER"]: "CUSTOMER",
};

export type BookingFormProps = {
  siteSunCode: string;
  setSideSunCode: (value: string) => void;
  listSideSunGroup: SideSunGroupType[];
  formData: any;
  setFieldFormData: (key: string, value: any) => void;
  listProductSun: ResultListProductType[];
  setQty: (code: string, value: number) => void;
  quantities: Record<string, number>;
  totalTickets: number;
  total: number;
  sideName: string;
  selectedLines: any[];
  agentPrice: number;
  formType: string;
  handleBuyTicket: () => void;
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

export const getPriceAgentAndMultiple = (
  ticket: ProductBanaType,
  agentCode: string,
  agentPrice: number
) => {
  let price =
    agentCode === SUN_BOOKING_FORM_TYPE.AFFILATE
      ? ticket.unitPrice
      : ticket.publicPrice - ticket.publicPrice * (agentPrice / 100);

  price = ticket.multiple > 1 ? price / ticket.multiple : price;

  return agentCode === SUN_BOOKING_FORM_TYPE.AFFILATE ? price + agentPrice : price;
};

export const PRODUCT_TYPE = {
  ["ADULT"]: "Người lớn",
  ["CHILD"]: "Trẻ em",
};
