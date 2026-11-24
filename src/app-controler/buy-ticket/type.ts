import { ProductSubmitType, TicketResultQRType } from "@/types/ticket";

export type FormDataType = {
  site_code: string;
  date_use: string;
};

export type CustomerInfoType = {
  fullname: string;
  email: string;
  phone: string;
};

export type TicketCategory = "adult" | "child" | "senior";

export const CATEGORY_STYLES: Record<
  TicketCategory,
  { badgeBg: string; badgeText: string; iconBg: string }
> = {
  adult: {
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
    iconBg: "bg-blue-500",
  },
  child: {
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-500",
    iconBg: "bg-orange-400",
  },
  senior: {
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-600",
    iconBg: "bg-purple-500",
  },
};

export type PayloadGetTicketSunType = {
  productSelected: ProductSubmitType[];
  orderCode: string;
  orderId: string;
  dateUse: string;
  customerEmail: string;
};
