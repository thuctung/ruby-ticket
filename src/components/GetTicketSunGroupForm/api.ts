import api from "@/axios";
import sunApi from "@/axios/apiSun";
import {
  CREATE_ORDER_TICKET,
  LOGIN_SUN_SYSTEM,
  SUCCESS_ORDER_TICKET,
  UPDATE_STATUS_ORDER,
} from "@/commons/apiURL";
import { DB_TABLE_NAME, LOCAL_SUN_TOKEN, SUN_GROUP } from "@/commons/constant";
import { SUN_PROXY_GET_DATA } from "@/commons/outApiURL";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import {
  ParamCreateTicketAgentType,
  ProductSubmitType,
  SubmitSelectTicket,
  TicketReponseType,
} from "@/types/ticket";
import { groupTicketSunGroup } from "@/helpers/genCode";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();
const clientSupbase = createSupabaseBrowserClient();

export const loginSunSystem = async () => {
  try {
    setGlobalLoading(true);
    const { data, error }: any = await api.post(LOGIN_SUN_SYSTEM);
    if (data) {
      localStorage.setItem(LOCAL_SUN_TOKEN, data?.access_token);
      return;
    }
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const getSiteListSun = async () => {
  try {
    setGlobalLoading(true);
    const { data }: any = await sunApi.get(`/ota/site/listing`, {
      params: {
        lang: "vi",
      },
    });
    return data.result;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const getProductBySiteSun = async (siteCodes: string, date: string) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await sunApi.get(`/ota/product/listing`, {
      params: {
        lang: "vi",
        siteCodes,
        date,
        page: 1,
        per_page: 50,
      },
    });
    if (data.result?.length) {
      return groupTicketSunGroup(data.result);
    }
    return [];
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};
