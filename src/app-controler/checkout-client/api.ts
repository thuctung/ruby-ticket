import api from "@/axios";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { CLIENT_CREATE_ORDER_TICKET } from "@/commons/apiURL";
import { ClientOrderItem, CustomerOrderType } from "./type";
import sunApi from "@/axios/apiSun";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const customerCreateOrderTicket = async (params: ClientOrderItem) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(CLIENT_CREATE_ORDER_TICKET, params);
    return data;
  } catch {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const customerCreateOrder = async (params: CustomerOrderType) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await sunApi.post("/ota/booking/create", params);
    if (data?.error[0]) {
      setToastMessage(data?.error[0]);
    }
    return data.result;
  } catch {
    setToastMessage("Không thể đặt vé");
  } finally {
    setGlobalLoading(false);
  }
};
