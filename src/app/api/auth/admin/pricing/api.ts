import api from "@/axios";
import { CREATE_ORDER_TICKET } from "@/commons/apiURL";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { ParamCreateTicketAgentType } from "@/types/ticket";

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
    const { data, error } = await clientSupbase
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
      .eq("code", location);
    console.log("data", data);
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};
