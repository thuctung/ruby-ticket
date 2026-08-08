import api from "@/axios";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import {
  CLIENT_BUY_TICKET_FINAL,
  CLIENT_CREATE_ORDER_TICKET,
  CLIENT_SEND_TICET_TO_MAIL,
  CLIENT_UPDATE_STATUS_ORDER_ERROR,
  SUN_BOOKING_CANCLE,
  SUN_BOOKING_CONFIRM,
  SUN_BOOKING_CREATE,
} from "@/commons/apiURL";
import {
  ClientOrderItem,
  CustomerBuyFilnalType,
  CustomerOrderType,
  SendTicketMailType,
  UpdateOrderType,
} from "./type";
import { get } from "lodash";
import dayjs from "dayjs";
import { FULL_DATE_FORMAT } from "@/helpers/dateTime";

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
    setToastMessage(data?.messages[0]);
    return;
  } catch {
    setToastMessage("Lỗi khi đặt vé, Liên hệ để được hỗ trợ");
  } finally {
    setGlobalLoading(false);
  }
};

export const getTicketSunWorld = async (orderCode: string) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(SUN_BOOKING_CONFIRM, { orderCode });
    if (data.errors[0]) {
      setToastMessage(data.messages[0]);
    }
    return data.result;
  } catch {
    setToastMessage("Lỗi khi xuất vé, Liên hệ để được hỗ trợ");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateStatusGetTicketFinal = async (payload: CustomerBuyFilnalType) => {
  try {
    const { data }: any = await api.post(CLIENT_BUY_TICKET_FINAL, payload);
    return data;
  } catch {}
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

export const senTicketToMail = async (payload: SendTicketMailType) => {
  try {
    await api.post(CLIENT_SEND_TICET_TO_MAIL, payload);
  } catch (e) {
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
