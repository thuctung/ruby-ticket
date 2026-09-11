import api from "@/axios";
import {
  AFF_GET_STATUS,
  CREATE_ORDER_TICKET,
  SEND_MAIL_TICKET_NUI_THAN_TAI,
  SUN_V2_CREATE_ORDER,
} from "@/commons/apiURL";

import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { ParamCreateTicketAgentType, ResTicketFormatType } from "@/types/ticket";
import { get } from "lodash";
import { CreateOrderSunGroupPayload, SendTicketInSystemMailType } from "./type";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const createOrderTicket = async (params: ParamCreateTicketAgentType) => {
  try {
    setGlobalLoading(true);
    const { data, error }: any = await api.post(CREATE_ORDER_TICKET, params);
    if (error) {
      setToastMessage(error.message);
      return;
    }
    return data?.order_id;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const getTicketFromSunGroup = async (payload: CreateOrderSunGroupPayload) => {
  try {
    setGlobalLoading(true);
    const { data: resData }: any = await api.post(SUN_V2_CREATE_ORDER, payload);
    const { data, messages } = resData;
    if (messages) {
      setToastMessage(messages || "Lỗi không tạo được vé!");
      return;
    }
    return data as unknown as ResTicketFormatType;
  } catch (e) {
    setToastMessage("Lỗi không tạo được vé!");
  } finally {
    setGlobalLoading(false);
  }
};

export const getStatusProfile = async (user_id: string) => {
  try {
    const { data, error }: any = await api.post(AFF_GET_STATUS, { user_id });
    if (error) {
      setToastMessage(error.message);
      return;
    }
    const status = get(data, ["data", "status"]);
    return status;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
  }
};

export const createTemplateTicketThanTaiMountain = async (payload: SendTicketInSystemMailType) => {
  try {
    setGlobalLoading(true);
    const res: any = await api.post(SEND_MAIL_TICKET_NUI_THAN_TAI, payload, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(res.data);

    const a = document.createElement("a");
    a.href = url;
    a.download = `evoucher-${payload.orderCode} ${payload.dateUse}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};
