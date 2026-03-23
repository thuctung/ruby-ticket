export const AGENT_TYPE = {
  WEBSITE: "website",
  LEVEL_2: "level_2",
  LEVEL_1: "level_1",
  CUSTOMER: "customer",
};


export const PRICE_TYPE = {
  WEBSITE:'website',
  PROMOTION:'promotion',
  NORMAL:'normal',
}

export const LIST_PRICE_TYPE = [
  {
    name:'Giá Công bố', code:PRICE_TYPE.WEBSITE
  },
  {
    name:'Giá thường', code:PRICE_TYPE.NORMAL
  },
  {
    name:'Giá khuyến mãi', code:PRICE_TYPE.PROMOTION
  }
]