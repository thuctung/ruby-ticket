export type SearchSiteType = {
  status?: string;
  name: string;
  in_system?: string;
  status_affilate?: string;
};

export type SiteType = {
  code: string;
  id?: string;
  in_system: boolean;
  name: string;
  status: boolean;
  order: number;
  status_affilate: boolean;
  pre_price: number;
  en: string;
  ko: string;
  zh: string;
  company_code: string;
  location_code: string;
  link_image_site?: string[];
  description_zh?: string;
  description_vi?: string;
  description_ko?: string;
  description_en?: string;
};
