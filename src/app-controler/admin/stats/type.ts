export type SaleSumaryType = {
  total_amount: number;
  total_tickets: string;
  user_email: string;
};

export type PriceSunWorldType = {
  availableCredit: number;
  siteCode: string;
};

export type SearchSalteSumamryType = {
  from: string;
  to: string;
  email?: string;
};

export type AllSaleType = {
  payment_method: string;
  total_amount: number;
  total_tickets: number;
};
