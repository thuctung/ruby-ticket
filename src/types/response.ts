import { ProfileType } from "./profile";

export type AdminAffiResponseType = {
  currentPage: number;
  profiles: ProfileType[];
  total: number;
  totalPages: number;
};

export type TopupHistoryResponseType = {
  amount: number;
  payment_code: string;
  status: string;
  created_at: string;
};

export type QRBankResponseType = {
  qr: string;
  code: string;
  amount: number;
  orderId?: string;
};

export interface TopupMgtResponseType extends ProfileType, TopupHistoryResponseType {
  created_at: string;
  topup_id: string;
}

export interface TractionResponseType {
  amount: number;
  created_at: string;
  description: string;
  type: string;
}

export interface TicketSalteResponseType {
  created_at: string;
  location_name: string;
  quantity: number;
  total: number;
  ticket_name: string;
}

export type CountTicketSaleResponse = {
  quantity: number;
  total: number;
};

export type CountReportResponse = {
  quantity: number;
  total_amount: number;
};

export type AgentType = {
  code: string;
  name: string;
};


export type AdminReportResponseType = {
  buy_by:string;
  date_use:string;
  location_name:string;
  user_email:string;
  order_id:string;
  phone:string;
  price:number;
  quantity:number;
  total_amount:number;
  subtotal:number;
  ticket_name:string;
  sale_date:string
  promo_name:string
}