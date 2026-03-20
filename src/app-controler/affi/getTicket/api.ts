import api from "@/axios";
import { CREATE_ORDER_TICKET, GET_QR_TOPUP } from "@/commons/apiURL";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { ItemSelectType, ParamCreateTicketAgentType } from "@/types/ticket";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();
const clientSupbase = createSupabaseBrowserClient();

export const getLocation = async () => {
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

export const createOrderTicket = async (params: ParamCreateTicketAgentType) => {
  try {
    setGlobalLoading(true);
    const { data, error }: any = await api.post(CREATE_ORDER_TICKET, params);
    if (!data.success) {
      setToastMessage(data?.message);
      return;
    }
    return data;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};
