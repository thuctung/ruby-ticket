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
