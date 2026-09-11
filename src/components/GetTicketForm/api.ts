import api from "@/axios";
import {
  GET_PRODUCT_IN_SYSTEM,
  GET_SITE_BY_FORM_TYPE,
  GET_SITE_BY_STATUS,
  SUN_GET_PRODOCT_LIST,
} from "@/commons/apiURL";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";

import { groupTickets } from "@/helpers/genCode";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();
const clientSupbase = createSupabaseBrowserClient();

export const getSiteByFormType = async (formType: string) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(GET_SITE_BY_FORM_TYPE, { formType });
    return data;
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getPriceBuyAgentLevel = async (site_code: string, agent_code: string) => {
  try {
    const { data, error } = await clientSupbase
      .from(DB_TABLE_NAME.AGENT_PRICE)
      .select("price")
      .eq("agent_code", agent_code)
      .eq("site_code", site_code)
      .maybeSingle();
    if (error) {
      setToastMessage(error.message);
    }
    return data;
  } catch {
    setToastMessage("Có lỗi xảy ra");
  }
};

export const getProductBySiteSun = async (siteCodes: string, date: string) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(SUN_GET_PRODOCT_LIST, {
      siteCodes,
      date,
    });

    if (data.errors[0]) {
      setToastMessage(data.messages[0]);
      return [];
    }
    if (data.result.length === 0) {
      setToastMessage(
        `SAP không cấu hình mở bán cho sản phẩm vào ngày ${dayjs(date, SERVER_DATE_FORMAT).format(BASIC_DATE_FORMAT)}`
      );
    }
    console.log("data", data.result);

    return groupTickets(data.result);
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const getProductionInSystem = async (site_code: string) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(GET_PRODUCT_IN_SYSTEM, { site_code });
    if (data.length === 0) {
      setToastMessage("Không có vé phù hợp");
      return [];
    }
    return groupTickets(data);
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getSiteByStatus = async (status?: boolean) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(GET_SITE_BY_STATUS, { status });

    return data;
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};
