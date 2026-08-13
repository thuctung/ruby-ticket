import api from "@/axios";
import {
  ADMIN_GET_SALE_SUMARY,
  COUNT_REPORT,
  GET_ADMIN_REPORT,
  SUN_GET_BALANCE,
} from "@/commons/apiURL";
import { BASIC_DATE_FORMAT, dayjsEx, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { useCommonStore } from "@/stores/useCommonStore";
import { AdminSearchReport, CommonType, SearchDateRangePayload, SearchTableType } from "@/types";
import dayjs from "dayjs";
import { get } from "lodash";
import { SearchSalteSumamryType } from "./type";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const countReportAdmin = async (from: string, to: string) => {
  try {
    const dateForm = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);

    const body: SearchDateRangePayload = {
      from: dayjs(dateForm).format(SERVER_DATE_FORMAT),
      to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
    };
    const response = await api.post(COUNT_REPORT, body);
    const data = get(response, "data") || [];
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getCurrentMoeny = async () => {
  try {
    const { data } = await api.get(SUN_GET_BALANCE);

    if (data.errors?.[0]) {
      setToastMessage(data.errors?.[0]);
    }
    return data.result;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getSaleSumary = async (payload: SearchSalteSumamryType) => {
  try {
    setGlobalLoading(true);

    const { to, from, email, siteCode } = payload;
    const dateForm = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);

    const body: SearchSalteSumamryType = {
      from: dayjs(dateForm).format(SERVER_DATE_FORMAT),
      to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
      email,
      siteCode,
    };
    const { data } = await api.post(ADMIN_GET_SALE_SUMARY, body);
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};
