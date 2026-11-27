export type CountTicketSaleParamType = {
  email: string;
  from: string;
  to: string;
  siteCode?: string;
};
export type CountTicketType = {
  ticketSale: number;
  ticketReund: number;
  total: number;
  refundCharge: number;
};

export type AffilateReportType = {
  currentPage: number;
  location?: string;
  from: string;
  to: string;
  email?: string;
  status?: string;
  siteCode?: string;
  third_party_number?: string;
};
