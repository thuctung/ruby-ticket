import { ProductType, PromotionType, TicketTypeLocation } from "@/types/ticket";

type DataTicketByLoation = {
  code: string;
  ticket_types: TicketTypeLocation[];
};

type PromoLoactionType = {
  location_code:string;
  promotion_code:string;
  promotion: PromotionType
}

export const filterTicketByLoction = (data: DataTicketByLoation) => {
  let reasult: ProductType[] = [];
  if (data && data.ticket_types.length) {
    reasult = data.ticket_types.flatMap((type) => {
      return type.ticket_variants.map((item) => item);
    });
  }
  return reasult;
};


export const filterTicketAgentByLoction = (data: DataTicketByLoation) => {
  let reasult: ProductType[] = [];
  if (data && data.ticket_types.length) {
    data.ticket_types.forEach(ticketType => {
      ticketType.ticket_variants.forEach(ticketVariant => {
        if (ticketVariant.agent_prices && ticketVariant.agent_prices.length > 0) {
          const newItem:ProductType = {
            base_price :ticketVariant.price,
            ticket_name: ticketVariant.ticket_name,
            code:ticketVariant.code,
            agent_code: ticketVariant.agent_prices[0].agent_code,
            price: ticketVariant.agent_prices[0].price,
            ticket_type_code:ticketVariant.code,
            id: ticketVariant.code,
          }
          reasult.push(newItem);
        }
      })
    })
  }
  return reasult;
};


export const FilerTicketPromoByLocation = (rawData:any) => {

  const formattedData = rawData?.ticket_types?.flatMap((type:any) => 
  type.ticket_variants?.flatMap((variant:any) => 
    variant.promotion_price?.map((promo:any) => ({
      ticket_name: variant.ticket_name,
      base_price: variant.price,            
      price: promo.price,                 
      agent_level_code: promo.agent_level_code,
      ticket_variant_code: promo.ticket_variant_code,
      promo_code: promo.promo_code,
      code:  promo.ticket_variant_code
    })) || []
  ) || []
) || [];

return formattedData
}


export const filterPromotionByLocation = (data: PromoLoactionType[]) => {
  let reasult: PromotionType[] = [];
  if (data ) {
    reasult = data.map((item) => {
      return {
        code: item.promotion_code,
        location_code:item.location_code,
        promo_name: item.promotion.promo_name
      }
    });
  }
  return reasult;
};
