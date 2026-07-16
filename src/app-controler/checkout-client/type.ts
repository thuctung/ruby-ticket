import { ProductSubmitType } from "@/types/ticket";

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
  ThirdPartyNumber: string;
};
