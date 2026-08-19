import { ProductSubmitType, TicketResultQRType } from "@/types/ticket";

export type ClientOrderItem = {
  userEmail: string;
  totalAmount: number;
  dateUse: string;
  phone: string;
  fullname: string;
  thirdPartyNum: string;
  listTicketSubmit: ProductSubmitType[];
  siteCode: string;
  paymentCode: string;
  orderCode: string;
};

export type CustomerOrderType = {
  products: ProductSubmitType[];
  phone: string;
  fullname: string;
  email: string;
  thirdPartyNumber: string;
};

export type CustomerBuyFilnalType = {
  orderCode?: string;
  tickets?: TicketResultQRType[];
  referenceCode?: string;
  orderId?: string;
  isError: boolean;
  description?: string;
};

export type UpdateOrderType = {
  orderId: string;
  status: string;
  description: string;
  status_payment?: string;
};

export type SendTicketMailType = {
  orderCode: string;
  email: string;
  siteName: string;
  customerTickets: TicketResultQRType[];
  focTickets: TicketResultQRType[];
};

export type TicketCategory = "adult" | "child" | "senior";

export interface Ticket {
  id: string;
  name: string;
  category: TicketCategory;
  categoryLabel: string;
  price: number;
  description: string;
  image: string;
  features: string[];
  qty: number;
}

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

export type CustomerInfoType = {
  fullName: string;
  email: string;
  phone: string;
};

export interface CustomerInfoErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

export type PayloadGetTicketSunType = {
  productSelected: ProductSubmitType[];
  orderCode: string;
  orderId: string;
  dateUse: string;
  customerEmail: string;
};
