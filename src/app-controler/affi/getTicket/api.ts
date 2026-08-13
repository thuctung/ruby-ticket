import api from "@/axios";
import {
  AFF_GET_STATUS,
  CREATE_ORDER_TICKET,
  SEND_MAIL_TICKET_NUI_THAN_TAI,
  SUCCESS_ORDER_TICKET,
  SUN_V2_CREATE_ORDER,
  UPDATE_ORDER_BALANCE,
  UPDATE_STATUS_ORDER_ERROR,
} from "@/commons/apiURL";

import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { ParamCreateTicketAgentType, ProductSubmitType, TicketReponseType } from "@/types/ticket";
import { get } from "lodash";
import {
  CreateOrderSunGroupPayload,
  PayloadUdateOrderBalanceType,
  SendTicketInSystemMailType,
  UpdateSuccessOrderParam,
} from "./type";

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

export const getTicketFromSunGroup = async (
  params: ProductSubmitType[],
  thirdPartyNumber: string,
  userBooking: any
) => {
  try {
    setGlobalLoading(true);
    const paload: CreateOrderSunGroupPayload = {
      thirdPartyNumber,
      products: params,
      ...userBooking,
    };
    const { data, error }: any = await api.post(SUN_V2_CREATE_ORDER, paload);
    if (data.errors?.length) {
      setToastMessage(data.messages?.[0] || "");
      return;
    }
    return data.result as unknown as TicketReponseType;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateStatusOrderFail = async (order_id: string, description: string) => {
  try {
    setGlobalLoading(true);
    const { data, error }: any = await api.post(UPDATE_STATUS_ORDER_ERROR, {
      order_id,
      description,
    });
    if (error) {
      setToastMessage(error.message);
      return;
    }
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateSuccessOrder = async (payload: UpdateSuccessOrderParam) => {
  try {
    const { data, error }: any = await api.post(SUCCESS_ORDER_TICKET, payload);
    if (error) {
      setToastMessage(error.message);
      return;
    }
  } catch (e) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
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
    const { data }: any = await api.post(SEND_MAIL_TICKET_NUI_THAN_TAI, payload);
    return data;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateOrderAndBalaceInSystem = async (payload: PayloadUdateOrderBalanceType) => {
  try {
    await api.post(UPDATE_ORDER_BALANCE, payload);
  } catch (e) {
  } finally {
  }
};
