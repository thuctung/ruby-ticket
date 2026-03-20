import api from "@/axios";
import { COUNT_TICKET_SALE, GET_TICKET_SALE } from "@/commons/apiURL";
import { DB_TABLE_NAME } from "@/commons/constant";
import { BASIC_DATE_FORMAT, dayjsEx, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, SearchTableType, SearchTicketSale } from "@/types";
import dayjs from "dayjs";
import { get } from "lodash";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();
const clientSupbase = createSupabaseBrowserClient();

export const getAffHistory = async (params: SearchTableType<SearchTicketSale>, user_id: string) => {
  try {
    setGlobalLoading(true);
    const { currentPage, searchValue } = params;
    const { location, from, to } = searchValue;
    const dateForm = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);

    const body: any = {
      user_id,
      currentPage,
      location: location === "all" ? "" : location,
      from: dayjs(dateForm).format(SERVER_DATE_FORMAT),
      to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
    };
    const response = await api.post(GET_TICKET_SALE, body);
    const data = get(response, "data") || [];
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getLocation = async () => {
  try {
    setGlobalLoading(true);
    const { data, error } = await clientSupbase.from(DB_TABLE_NAME.LOCATIONS).select("*");
    if (error) {
      setToastMessage(error.message);
    }
    return data;
  } catch {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const countTicketSale = async (from: string, to: string, user_id: string) => {
  try {
    const dateForm = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);

    const body: any = {
      user_id,
      from: dayjs(dateForm).format(SERVER_DATE_FORMAT),
      to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
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
