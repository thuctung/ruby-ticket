import { ResultListProductType, SideSunGroupType } from "@/types/ticket";
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
  handleBuyTicket: () => void;
};

export const CustomerInfoSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  phone: z
    .string()
    .trim()
    .min(8, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+ ]+$/, "SĐT chỉ nên gồm số"),
});
