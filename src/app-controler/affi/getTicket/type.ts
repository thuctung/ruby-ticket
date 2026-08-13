import { ProductSubmitType, TicketResultQRType } from "@/types/ticket";

export type TicketInSystem = {
  name: string;
  quantity: number;
};

export type SendTicketInSystemMailType = {
  orderCode: string;
  phone: string;
  dateUse: string;
  listTicket: TicketInSystem[];
  email: string;
  paymentCode?: string;
  siteName?: string;
  fullName?: string;
};

export type PayloadUdateOrderBalanceType = {
  order_id: string;
  user_id: string;
  balance: number;
  status: string;
  description: string;
  amount: number;
  orderCode: string;
};

export type UpdateSuccessOrderParam = {
  orderCode: string;
  tickets: TicketResultQRType[];
  referenceCode: string;
  orderId: string;
};

export type CreateOrderSunGroupPayload = {
  thirdPartyNumber: string;
  products: ProductSubmitType[];
  email: string;
  phone: string;
  fullname: string;
};
