import api from "@/axios";
import sunApi from "@/axios/apiSun";
import {
  CREATE_ORDER_TICKET,
  LOGIN_SUN_SYSTEM,
  SUCCESS_ORDER_TICKET,
  UPDATE_STATUS_ORDER,
} from "@/commons/apiURL";
import { DB_TABLE_NAME, LOCAL_SUN_TOKEN, SUN_GROUP } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { ParamCreateTicketAgentType, ProductSubmitType, TicketReponseType } from "@/types/ticket";
import { groupTicketSunGroup } from "@/helpers/genCode";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();
const clientSupbase = createSupabaseBrowserClient();

export const getLocation = async () => {
  try {
    setGlobalLoading(true);
    const { data, error } = await clientSupbase
      .from(DB_TABLE_NAME.LOCATIONS)
      .select("*")
      .eq("status", true);
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

export const getTicketFromSunGroup = async (params: ProductSubmitType[]) => {
  try {
    setGlobalLoading(true);
    const { data, error }: any = await sunApi.post("/v2/order/create", {
      thirdPartyNumber: SUN_GROUP.thirdPartyNumber,
      products: params,
    });

    if (error) {
      setToastMessage(error.message);
      return;
    }
    if (data.errors?.length) {
      setToastMessage(data.errors[0].message);
      return;
    }
    return data.result as unknown as TicketReponseType;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateStatusOrderFail = async (order_id: string) => {
  try {
    setGlobalLoading(true);
    const { data, error }: any = await api.post(UPDATE_STATUS_ORDER, { order_id });
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
