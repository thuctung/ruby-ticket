import api from "@/axios";
import sunApi from "@/axios/apiSun";
import {
  ADMIN_GET_SALE_SUMARY,
  COUNT_REPORT,
  COUNT_TICKET_SALE,
  GET_ADMIN_REPORT,
  GET_TICKET_SALE,
} from "@/commons/apiURL";
import { BASIC_DATE_FORMAT, dayjsEx, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { useCommonStore } from "@/stores/useCommonStore";
import { AdminSearchReport, CommonType, SearchTableType } from "@/types";
import dayjs from "dayjs";
import { get } from "lodash";
import { SearchSalteSumamryType } from "./type";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getTicketSaleAdmin = async (params: SearchTableType<AdminSearchReport>) => {
  try {
    setGlobalLoading(true);
    const { currentPage, searchValue } = params;
    const { location, from, to, email } = searchValue;
    const dateForm = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);

    const body: any = {
      currentPage,
      location: location === "all" ? "" : location,
      from: dayjs(dateForm).format(SERVER_DATE_FORMAT),
      to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
      email,
    };

    const response = await api.post(GET_ADMIN_REPORT, {
      currentPage,
      searchValue: body,
    });

    const data = get(response, "data") || [];
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const countReportAdmin = async (from: string, to: string) => {
  try {
    const dateForm = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);

    const body: any = {
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
    const { data } = await sunApi.get("/ota/account/balance");

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

    const { to, from, email } = payload;
    const dateForm = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);

    const body: any = {
      from: dayjs(dateForm).format(SERVER_DATE_FORMAT),
      to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
      email,
    };
    const { data } = await api.post(ADMIN_GET_SALE_SUMARY, body);
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

console.log("sdfsd");
