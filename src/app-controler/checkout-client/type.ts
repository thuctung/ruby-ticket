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
