export type CountTicketSaleParamType = {
  email: string;
  from: string;
  to: string;
  siteCode?: string;

};
export type CountTicketType = {
  ticketSale: number;
  ticketReund:number;
  total:number;
  refundCharge:number
}