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

type AgentPriceType = {
  agent_code: string;
  price: number;
  ticket_variant_code: string;
};

export type ProductType = {
  id: string;
  ticket_type_code: string;
  price: number;
  stock?: number;
  ticket_name: string;
  category?: string;
  category_code?: string;
  category_name?: string;
  code: string;
  base_price?: number;
  agent_code?: string;
  agent_prices?: AgentPriceType[];
};

export interface PersonType extends LocationType {}

export type ItemSelectType = {
  name: string;
  total: number;
  quantity: number;
  code: string;
  id: string;
  price: number;
};

export type ResultTicketSlectedType = {
  listItemSelect: ItemSelectType[];
  total: number;
};

export type TicketResultQRType = {
  ticket_variant_code: string;
  ticket_code: string;
  ticket_name: string;
  dateUse: string;
};

export type PromotionType = {
  promo_name: string;
  status?: string;
  promo_value?: number;
  type?: string;
  code: string;
};

export type PriceCustomerType = {
  ticket_variant_code: string;
  price: number;
};

export type ResumSelectedType = {
  base_price: number;
  finalprice: number;
  totalPriceTicket: number;
  ticketName: string;
  numerTicet: number;
  ticket_variant_code: string;
  date_use: string;
};

export type DataFormTicketSubmit = {
  total_amount: number;
  listTicket: ResumSelectedType[];
  formData?: any;
  locationNameSelected: string;
  date_use: string;
  promoCode?:string
};

export type TicketSubmitAgentType = {
  ticket_variant_code: string;
  quantity: number;
  price: number;
};

export type ParamCreateTicketAgentType = {
  user_id: string;
  items: TicketSubmitAgentType[];
  total_amount: number;
  date_use: string;
  email: string;
};

export type TicketTypeLocation = {
  location_code: string;
  ticket_variants: ProductType[];
};

export type ClientBuyTicketType = {
  ticket_variant_code: string;
  quantity: number;
  price: number;
  date_use: string;
};

export type ClientOrderItem = {
  user_email: string;
  total_amount: number;
  phone: string;
  description: string;
  listTicketSubmit: ClientBuyTicketType[];
  paymentCode:string
  promoCode?:string
};
