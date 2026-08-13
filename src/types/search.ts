export interface SearchTableType<T = object> {
  currentPage: number;
  searchValue: T;
  user_id?: string;
  status?: string;
}

export interface SearchAffiType {
  status?: string;
  username?: string;
  email?: string;
}

export interface SearchTraction {
  type?: string;
  from: string;
  to: string;
}

export interface SearchDateRangePayload {
  from: string;
  to: string;
}

export interface SearchTractionPayload extends SearchTraction {
  user_id: string;
  currentPage: number;
}

export interface SearchTicketSale {
  location?: string;
  from: string;
  to: string;
  status?: string;
  email?: string;
  siteCode?: string;
  third_party_number?: string;
  currentPage?: number;
}

export interface SearchTicketSalePayload extends SearchTicketSale {
  user_id: string | undefined;
  currentPage: number;
  type?: string;
}

export interface AdminSearchReport {
  location?: string;
  from: string;
  to: string;
  email?: string;
  status?: string;
  payment_method?: string;
  full_name?: string;
  siteCode?: string;
  third_party_number?: string;
  currentPage?: number;
}
