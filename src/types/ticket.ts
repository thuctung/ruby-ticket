import { number } from "zod";

export interface LocationType {
  name: string;
  code: string;
}

export type TicketType = {
  id: string;
  ticket_type_code: string;
  catogory: string;
};

export type TicketByLocationType = {
  name: string;
  code: string;
};

export type ProductType = {
  id: string;
  ticket_type_code: string;
  price: number;
  stock: number;
  ticket_name: string;
  category: string;
  category_code: string;
  category_name: string;
  code: string;
};

export interface PersonType extends LocationType {}

export type ItemSelectType = {
  name: string;
  total: number;
  quantity: number;
  code: string;
  id: string;
};

export type ResultTicketSlectedType = {
  listItemSelect: ItemSelectType[];
  total: number;
};

export type TicketResultQRType = {
  ticket_variant_code: string;
  ticket_code: string;
  ticket_name: string;
};

export type PromotionType = {
  promo_name: string;
  status: string;
  promo_value: number;
  type: string;
  code: string;
};

export type PriceCustomerType = {
  ticket_variant_code: string;
  price: number;
};

export type ResumSlectedType = {
  base_price: number;
  finalprice: number;
  totalPriceTicket: number;
  ticketName: string;
  numerTicet: number;
  ticket_variant_code: string;
};

export type DataFormTicketSubmit = {
  total_amount: number;
  listTicket: ResumSlectedType[];
  formData?: any;
  locationNameSelected: string;
};
