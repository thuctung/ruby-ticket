export type SaleSumaryType = {
  total_amount: number;
  total_tickets: string;
  user_email: string;
};

export type PriceSunWorldType = {
  activity: number;
  siteCode: string;
};

export type SearchSalteSumamryType = {
  from: string;
  to: string;
  email?: string;
  siteCode?: string;
  user_id?: string;
};

export type AllSaleType = {
  payment_method: string;
  total_amount: number;
  total_tickets: number;
};
