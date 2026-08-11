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
  status_affilate: boolean;
};
