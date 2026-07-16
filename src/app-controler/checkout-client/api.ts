import api from "@/axios";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { CLIENT_CREATE_ORDER_TICKET } from "@/commons/apiURL";
import { ClientOrderItem } from "@/types/ticket";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

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
