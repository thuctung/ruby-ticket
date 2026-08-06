export type SearchSiteType = {
  status?: string;
  name: string;
  in_system?: string;
};

export type SiteType = {
  code: string;
  id?: string;
  in_system: boolean;
  name: string;
  status: boolean;
};
