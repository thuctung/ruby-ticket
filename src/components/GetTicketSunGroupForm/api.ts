import api from "@/axios";
import { SUCCESS_ORDER_TICKET, SUN_GET_PRODOCT_LIST, SUN_GET_SITE_LIST } from "@/commons/apiURL";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";

import { groupTicketSunGroup } from "@/helpers/genCode";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();
const clientSupbase = createSupabaseBrowserClient();

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
    return groupTicketSunGroup(data.result);
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateSuccessOrder = async (payload: any) => {
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

export const getSiteListSun = async () => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.get(SUN_GET_SITE_LIST);
    return data.result;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const getSiteInSystem = async () => {
  const { data, error } = await clientSupbase.from(DB_TABLE_NAME.SITES).select("*");

  if (error) throw error;

  return data;
};

export const getAllSite = async () => {
  try {
    setGlobalLoading(true);

    const [sunSites, systemSites] = await Promise.all([getSiteListSun(), getSiteInSystem()]);
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};
