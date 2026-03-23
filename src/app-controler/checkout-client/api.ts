import api from "@/axios";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { PROMOTION_STATUS } from "./contants";
import { CLIENT_CREATE_ORDER_TICKET } from "@/commons/apiURL";
import { ClientOrderItem } from "@/types/ticket";

const clientSupbase = createSupabaseBrowserClient();
const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getLocationClient = async () => {
  try {
    setGlobalLoading(true);
    const { data, error } = await clientSupbase.from(DB_TABLE_NAME.LOCATIONS).select("*");
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

export const getTicketType = async (location: string) => {
  try {
    setGlobalLoading(true);
    const { data, error } = await clientSupbase
      .from(DB_TABLE_NAME.TICKET_TYPES)
      .select("*")
      .eq("location_code", location);
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

export const getTicketVariant = async (ticketTypeCode: string) => {
  try {
    setGlobalLoading(true);
    const { data, error } = await clientSupbase
      .from(DB_TABLE_NAME.VIEW_TICET_VARIANTS_AND_CATEGORY)
      .select("*")
      .eq("ticket_type_code", ticketTypeCode);
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

export const getPromotionByLocation = async (location: string) => {
  try {
    const { data, error } = await clientSupbase
      .from(DB_TABLE_NAME.PROMOTION_LOCATION)
      .select("*")
      .eq("location_code", location);
    if (error) {
      setToastMessage(error.message);
    }
    const listPromoCode = data?.map((item: any) => item.promotion_code) || [];

    const { data: datPromo, error: errorPromo } = await clientSupbase
      .from(DB_TABLE_NAME.PROMOTION)
      .select("*")
      .in("code", listPromoCode)
      .eq("status", PROMOTION_STATUS.ACTIVE);

    if (errorPromo) {
      setToastMessage(errorPromo.message);
    }
    return datPromo;
  } catch {
    setToastMessage("Có lỗi xảy ra");
  }
};

export const getPriceCustomer = async (
  listTicketCode: string[],
  promoCode: string,
  agentCode = "customer"
) => {
  try {
    const tableName = Boolean(promoCode)
      ? DB_TABLE_NAME.PROMOTION_PRICE
      : DB_TABLE_NAME.AGENT_PRICE;
    const agentColumn = Boolean(promoCode) ? "agent_level_code" : "agent_code";
    const query: any = clientSupbase
      .from(tableName)
      .select("ticket_variant_code,price")
      .in("ticket_variant_code", listTicketCode)
      .eq(agentColumn, agentCode);
    if (Boolean(promoCode)) {
      query.eq("promo_code", promoCode);
    }
    const { data, error } = await query;
    if (error) {
      setToastMessage(error.message);
    }
    return data;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra");
  }
};


export const customerCreateOrderTicket = async (params: ClientOrderItem) => {
  try {
    setGlobalLoading(true);
    const data: any = await api.post(CLIENT_CREATE_ORDER_TICKET, params);
    return data;
  } catch {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};
