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
  productName: string;
  productCode: string;
  siteCode: string;
  unitPrice: string;
  productGroup: string;
  isFaceIdRequired: string;

  ticketNumber: string;
  validDateFrom: string;
  validDateTo: string;
  status: string;
  verifyCode: string;
  orderCode: string;
  orderId: string;
  date_use: string;
  pnr: string;
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
  promoCode?: string;
};

export type TicketSubmitAgentType = {
  quantity: number;
  price: number;
  product_code: string;
  product_name: string;
};

export type ParamCreateTicketAgentType = {
  user_id: string;
  items: TicketSubmitAgentType[];
  total_amount: number;
  date_use: string;
  email: string;
  side_code: string;
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
  paymentCode: string;
  promoCode?: string;
};

export type SideSunGroupType = {
  address: string;
  code: string;
  description: string;
  name: string;
  id: number;
};

type PricePolicyType = {
  publicPrice: number;
  unitPrice: number;
  usageDate: string;
  validDateTo: string;
  validDateFrom: string;
};

type PerformancesType = {
  endDate: string;
  performanceId: string;
  startDate: string;
};

export type ResultListProductType = { personType: string; ticket: ProductBanaType[] };

export type ProductBanaType = {
  closeTime: string;
  code: string;
  id: number;
  name: string;
  personType: string;
  pricePolicy: PricePolicyType;
  restaurantName?: string;
  publicPrice: number;
  unitPrice: number;
  performances: PerformancesType;
  multiple: number;
};

export type ProductSubmitType = {
  productCode: string;
  siteCode: string;
  quantity: number;
  usageDate: string;
  usageDateTo: string;
  performanceId: string;
  productsName: string;
  unitPrice: number;
};

export type SubmitSelectTicket = {
  products: ProductSubmitType[];
  totalMoney: number;
  date_use: string;
  siteCode: string;
};

export type TicketInItemType = {
  status: string;
  ticketNumber: string;
  validDateFrom: string;
  validDateTo: string;
  verifyCode: string;
};

export type TicketItemReponseType = {
  isFaceIdRequired: number;
  productCode: string;
  productGroup: string;
  productName: string;
  siteCode: string;
  unitPrice: number;
  tickets: TicketInItemType[];
};

export type TicketReponseType = {
  totalTicket: number;
  thirdPartyNumber: string;
  referenceCode: string;
  orderStatus: string;
  orderCode: string;
  items: TicketItemReponseType[];
  pnr: string;
};
