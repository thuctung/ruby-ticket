export type ProductUpdatePriceType = {
  code: string;
  name: string;
  personType: string;
  site_code: string;
  publicPrice: number;
  unitPrice: number;
};

export type SearchProductType = {
  name: string;
  site_code: string;
};

export type AgentPriceAndTypeSubmit = {
  site_code: string;
  product_code: string;
  agent_code: string;
  price: number;
  type: string;
};

export type AgentPriceDefaultSubmit = {
  site_code: string;
  agent_code: string;
  price: number;
};
