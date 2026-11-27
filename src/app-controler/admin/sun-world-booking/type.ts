export type ParamStatusTicketType = {
  orderCode: string;
  siteCode: string;
};

export type TicketStatusType = {
  productName: string;
  siteCode: string;
  status: string;
  ticketNumber: string;
  usageStatus: string;
  productCode: string;
  validDateTo: string;
  validDateFrom: string;
};

export type ItemRefundType = {
  siteCode: string;
  ticketNumber: string;
};

export type CheckChargeRefundType = {
  thirdPartyNumber: string;
  returnDate: string;
  items: ItemRefundType[];
};

export type TicketRunfundType = {
  email: string;
  fullname: string;
  referenceThirdPartyNumber: string;
  tickets: ItemRefundType[];
};

export type RefuncTicketSubmitType = {
  thirdPartyNumber: string;
  returnReason: string;
  referenceOrders: TicketRunfundType[];
};

export type RefundItem = {
  productId: string;
  ticketNumber: string;
  returnRate: number;
  numberReturnDate: number;
  usageDateFrom: string;
  usageDateTo: string;
  unitPrice: number;
  returnCharge: number;
};

export type RefundInfo = {
  thirdPartyNumber: string;
  sapThirdPartyNumber: string;
  returnDate: string;
  totalReturnCharge: number;
  items: RefundItem[];
};

export type CheckStatusTicketType = {
  siteCode: string;
  ticketNumbers: string[];
};

export type StatusTicketListType = {
  siteCode: string;
  usageStatus: string;
  status: string;
  productName: string;
  firstUsageDateTime: string;
  validDateTo: string;
  ticketNumber: string;
};

export type RefundItemResponeType = {
  productId: string;
  quantity: number;
  returnCharge: number;
  returnRate: number;
  totalPrice: number;
  unitPrice: number;
  usageDate: string;
};

export type RefundResponeType = {
  referenceThirdPartyNumber: string;
  thirdPartyNumber: string;
  items: RefundItemResponeType[];
};

export type RefundHistorySubmit = {
  third_party_number: string;
  product_code: string;
  quantity: number;
  return_rate: number;
  return_charge: number;
  total_price: number;
  unit_price: number;
  email_order: string;
  site_code: string;
  product_name: string;
  created_date?: string;
  status?: string;
  id?: string;
  price_agent?:number;
  surcharge?:number;
  total_fee?:number;
  real_amount?:number;
};

export type OrderType = {
  id: string;
  user_id: string;
  user_email: string;
  third_party_number: string;
  site_code: string;
};

export type SearchRefunType = {
  email: string;
  from: string;
  to: string;
  third_party_number: string;
  site_code: string;
};

export type UpdateBlanceHistorySubmit = {
  user_id: string;
  id: string;
  amount: number;
  surcharge:number;
  price_agent:number;
  total_fee:number;
};

export type UpdateOrderItemCancelSubmit = {
  product_code: string;
  quantity: number;
  third_party_number: string;
};
