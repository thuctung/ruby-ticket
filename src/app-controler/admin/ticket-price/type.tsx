export type SearchProductType = {
  name: string;
  personType: string;
  siteCode: string;
};

export type SiteType = {
  code: string;
  id?: string;
  in_system: boolean;
  name: string;
  status: boolean;
};

export type ProductType = {
  code: string;
  id?: string;
  name: string;
  personType: string;
  publicPrice: number;
  unitPrice: number;
  site_code: string;
  description: string;
};

export type CategoryType = {
  code: string;
  name: string;
};
