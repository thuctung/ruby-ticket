import api from "@/axios";
import { CREATE_ORDER_TICKET } from "@/commons/apiURL";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { ParamCreateTicketAgentType, ProductType } from "@/types/ticket";
import {
  FilerTicketPromoByLocation,
  filterPromotionByLocation,
  filterTicketAgentByLoction,
  filterTicketByLoction,
} from "./helper";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();
const clientSupbase = createSupabaseBrowserClient();

export const getAgentType = async () => {
  try {
    setGlobalLoading(true);
    const { data, error } = await clientSupbase.from(DB_TABLE_NAME.AGENTS).select("*");
    if (error) {
      setToastMessage(error.message);
    }
    return data;
  } catch {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getTicketPublic = async (location: string) => {
  try {
    setGlobalLoading(true);
    const { data, error }: any = await clientSupbase
      .from(DB_TABLE_NAME.LOCATIONS)
      .select(
        `
    code,
    ticket_types (
      location_code,
      ticket_variants (
        ticket_type_code,
        code,
        price,
        ticket_name
      )
    )
  `
      )
      .eq("code", location)
      .maybeSingle();
    return filterTicketByLoction(data);
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const getTicketAgent = async (location: string, agent: string) => {
  try {
    setGlobalLoading(true);
    const { data, error }: any = await clientSupbase
      .from(DB_TABLE_NAME.LOCATIONS)
      .select(
        `
    code,
    ticket_types (
      location_code,
      ticket_variants (
        ticket_type_code,
        code,
        price,
        ticket_name,
        agent_prices!inner(
        price,
        ticket_variant_code,
        agent_code
        )
      )
    )
  `
      )
      .eq("code", location)
      .eq("ticket_types.ticket_variants.agent_prices.agent_code", agent)
      .maybeSingle();
    return filterTicketAgentByLoction(data);
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const getTicketPromotion = async (
  location: string,
  agentLevel: string,
  promoCode: string
) => {
  try {
    setGlobalLoading(true);
    const { data } = await clientSupbase
      .from(DB_TABLE_NAME.LOCATIONS)
      .select(
        `
    code,
    ticket_types (
      location_code,
      ticket_variants (  
        code,
        ticket_type_code,
        ticket_name,
        price,
        promotion_price!inner (  
          price,
          promo_code,
          ticket_variant_code,
          agent_level_code
        )
      )
    )
  `
      )
      .eq("code", location)
      .eq("ticket_types.ticket_variants.promotion_price.agent_level_code", agentLevel)
      .eq("ticket_types.ticket_variants.promotion_price.promo_code", promoCode)
      .maybeSingle();
    return FilerTicketPromoByLocation(data);
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const updatePricePublic = async (listPrice: ProductType[]) => {
  try {
    setGlobalLoading(true);
    const { error }: any = await clientSupbase
      .from(DB_TABLE_NAME.TICKET_TICKET_VARIANT)
      .upsert(listPrice, { onConflict: "code" });
    if (error) {
      setToastMessage(error.message);
      return;
    }
    setToastMessage("Cập nhật thành công");
    return true;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const updatePriceAgent = async (listPrice: any[]) => {
  try {
    setGlobalLoading(true);
    const { error }: any = await clientSupbase
      .from(DB_TABLE_NAME.AGENT_PRICE)
      .upsert(listPrice, { onConflict: "ticket_variant_code,agent_code" });
    if (error) {
      setToastMessage(error.message);
      return;
    }
    setToastMessage("Cập nhật thành công");
    return true;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const getPromoByLocation = async (location: string) => {
  try {
    setGlobalLoading(true);
    const { data, error }: any = await clientSupbase
      .from(DB_TABLE_NAME.PROMOTION_LOCATION)
      .select(
        `
    promotion_code,
    location_code,
    promotion (
      promo_name,
      code
    )
  `
      )
      .eq("location_code", location);
    return filterPromotionByLocation(data);
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const updatePricePrmotion = async (listPrice: any[]) => {
  try {
    setGlobalLoading(true);
    const { error }: any = await clientSupbase
      .from(DB_TABLE_NAME.PROMOTION_PRICE)
      .upsert(listPrice, { onConflict: "promo_code, agent_level_code, ticket_variant_code" });
    if (error) {
      setToastMessage(error.message);
      return;
    }
    setToastMessage("Cập nhật thành công");
    return true;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};
