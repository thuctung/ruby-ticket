export interface AgentPriceSubmitType {
  site_code: string;
  agent_code: string;
  price: number;
}

export interface AgentPriceType extends AgentPriceSubmitType {
  id: string;
}
