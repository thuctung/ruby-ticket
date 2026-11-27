import api from "@/axios";
import { GET_CATEGORY, GET_PRICE_AGENT_DEFAULT } from "@/commons/apiURL";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { get } from "lodash";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getListAgentPriceDefaultBySite = async (site_code: string, agent_code: string) => {
  try {
    const { data }: any = await api.post(GET_PRICE_AGENT_DEFAULT, { site_code, agent_code });
    if (data.data.length) {
      return get(data, ["data", 0, "price"]);
    }
    return 0;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  }
};

export const getListCategory = async (loading = true) => {
  try {
    if (loading) {
      setGlobalLoading(true);
    }
    const { data }: any = await api.get(GET_CATEGORY);
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    if (loading) {
      setGlobalLoading(false);
    }
  }
};
