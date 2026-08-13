import api from "@/axios";
import {
  COUNT_TICKET_SALE,
  GET_ORDER_DETAIL,
  GET_ORDER_HISTORY,
  SUN_GET_ORDER,
} from "@/commons/apiURL";
import { BASIC_DATE_FORMAT, dayjsEx, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, SearchTableType, SearchTicketSale, SearchTicketSalePayload } from "@/types";
import dayjs from "dayjs";
import { get } from "lodash";
import { CountTicketSaleParamType } from "./type";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const countTicketSale = async (
  from: string,
  to: string,
  user_id: string,
  siteCode?: string
) => {
  try {
    const dateForm = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);

    const body: CountTicketSaleParamType = {
      user_id,
      from: dayjs(dateForm).format(SERVER_DATE_FORMAT),
      to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
      siteCode,
    };
    const response = await api.post(COUNT_TICKET_SALE, body);
    const data = get(response, "data") || [];
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getOrderHistory = async (
  params: SearchTableType<SearchTicketSale>,
  user_id?: string
) => {
  try {
    setGlobalLoading(true);
    const { currentPage, searchValue } = params;
    const { from, to, status, siteCode } = searchValue;
    const dateForm = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);

    const body: SearchTicketSalePayload = {
      user_id,
      currentPage,
      status,
      from: dayjs(dateForm).format(SERVER_DATE_FORMAT),
      to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
      siteCode,
    };
    const response = await api.post(GET_ORDER_HISTORY, body);
    const data = get(response, "data") || [];
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getOrderDetail = async (order_id?: string) => {
  try {
    setGlobalLoading(true);
    const body = {
      order_id,
    };
    const response = await api.post(GET_ORDER_DETAIL, body);
    const { data } = get(response, "data") || [];
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getOrdeTicketDetail = async (orderCode: string) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(SUN_GET_ORDER, { orderCode });
    if (data.errors?.[0]?.messsage) {
      setToastMessage(data.error[0]?.messsage);
      return [];
    }
    return data.result;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};
