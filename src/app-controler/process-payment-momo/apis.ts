import api from "@/axios";
import {
  CUSTOMER_CLAIM_ORDER,
  ORDER_ITEM_AFTER_PAYMENT,
  UPDATE_PAYMENT_STATUS,
} from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, UpdatePaymentStatusType } from "@/types";
import { get } from "lodash";
const { setToastMessage }: CommonType | any = useCommonStore.getState();

export const getOrderItem = async (orderCode: string) => {
  try {
    const { data }: any = await api.post(ORDER_ITEM_AFTER_PAYMENT, { orderCode });
    return get(data, "data");
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  }
};

export const claimOrder = async (orderCode: string) => {
  try {
    const { data }: any = await api.post(CUSTOMER_CLAIM_ORDER, { orderCode });
    return data;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  }
};

export const updatePaymentStatus = async (payload: UpdatePaymentStatusType) => {
  try {
    const { data }: any = await api.post(UPDATE_PAYMENT_STATUS, payload);
    return get(data, "data");
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  }
};
