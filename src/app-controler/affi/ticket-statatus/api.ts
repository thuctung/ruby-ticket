import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { ParamStatusTicketType } from "./type";
import { SUN_TICKET_LISTING } from "@/commons/apiURL";
import api from "@/axios";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getStatusTicket = async (prams: ParamStatusTicketType) => {
  try {
    setGlobalLoading(true);
    const { data, error }: any = await api.post(SUN_TICKET_LISTING, prams);
    if (data.errors?.length) {
      setToastMessage(data.messages?.[0] || "");
      return;
    }
    return data.result;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};
