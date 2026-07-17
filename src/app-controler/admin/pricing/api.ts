import api from "@/axios";
import { CREATE_AGENT_PRICE, GET_PRICE_AGENT, UPDATE_AGENT_PRICE } from "@/commons/apiURL";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";

import { AgentPriceSubmitType, AgentPriceType } from "./type";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getListPriceBySiteCode = async (siteCode: string) => {
  try {
    setGlobalLoading(true);

    const { data }: any = await api.post(GET_PRICE_AGENT, { siteCode });

    return data;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const createAgentPrice = async (param: AgentPriceSubmitType) => {
  try {
    setGlobalLoading(true);

    const { data }: any = await api.post(CREATE_AGENT_PRICE, param);
    if (data.message) {
      setToastMessage(data.message);
      return;
    }
    return data;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateAgentPrice = async (listPrice: AgentPriceType[]) => {
  try {
    setGlobalLoading(true);

    const { data }: any = await api.post(UPDATE_AGENT_PRICE, { listPrice });
    if (data.message) {
      setToastMessage(data.message);
      return;
    }
    return data;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};
