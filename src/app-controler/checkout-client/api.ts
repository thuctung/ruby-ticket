import api from "@/axios";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import {
  CLIENT_CREATE_ORDER_TICKET,
  CLIENT_UPDATE_STATUS_ORDER_ERROR,
  SEND_MAIL_TICKET_IN_SYSTEM,
  SUN_BOOKING_CANCLE,
  SUN_BOOKING_CONFIRM,
  SUN_BOOKING_CREATE,
} from "@/commons/apiURL";
import {
  ClientOrderItem,
  CustomerOrderType,
  PayloadGetTicketSunType,
  UpdateOrderType,
} from "./type";
import { get } from "lodash";
import { SendTicketInSystemMailType } from "../affi/getTicket/type";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();
export const customerCreateOrderTicket = async (params: ClientOrderItem) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(CLIENT_CREATE_ORDER_TICKET, params);
    const orderId = get(data, ["data", "order_id"]);
    if (orderId) {
      return orderId;
    }
    setToastMessage("Lỗi tạo đơn hàng");
    return;
  } catch {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const customerCreateOrder = async (params: CustomerOrderType) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(SUN_BOOKING_CREATE, params);
    if (data?.success) {
      return data.result;
    }
    setToastMessage("Vé không hợp lệ, vui lòng lựa chọn lại!");
    return;
  } catch {
    setToastMessage("Lỗi khi đặt vé, Liên hệ để được hỗ trợ");
  } finally {
    setGlobalLoading(false);
  }
};

export const getTicketSunWorld = async (payload: PayloadGetTicketSunType) => {
  try {
    setGlobalLoading(true);
    const { data: resData }: any = await api.post(SUN_BOOKING_CONFIRM, payload);
    const { data, messages } = resData;
    if (messages) {
      setToastMessage(messages);
    }
    return data;
  } catch {
    setToastMessage("Lỗi khi xuất vé, Liên hệ để được hỗ trợ");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateStatusOrder = async (payload: UpdateOrderType) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(CLIENT_UPDATE_STATUS_ORDER_ERROR, payload);
    return data;
  } catch {
    setToastMessage("Lỗi khi xuất vé, Liên hệ để được hỗ trợ");
  } finally {
    setGlobalLoading(false);
  }
};

export const cancleBooking = async (orderCode: string) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(SUN_BOOKING_CANCLE, { orderCode });
    if (data.errors[0]) {
      setToastMessage(data.messages[0]);
    }
    return data.result;
  } catch {
    setToastMessage("");
  } finally {
    setGlobalLoading(false);
  }
};

export const senMailOrderProductInSystem = async (payload: SendTicketInSystemMailType) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(SEND_MAIL_TICKET_IN_SYSTEM, payload);
    return data;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};
