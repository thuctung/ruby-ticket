import { CREATE_EDIT_AGENT, DELETE_AGENT, GET_AGENT_LIST } from "@/commons/apiURL";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";

import api from "@/axios";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();
const clientSupbase = createSupabaseBrowserClient();

export const getListAgent = async (params: any) => {
  try {
    setGlobalLoading(true);
    const { data, error }: any = await api.post(GET_AGENT_LIST, params);

    if (error) {
      setToastMessage(error.message);
      return;
    }
    return data;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const createEditAgent = async (params: any) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(CREATE_EDIT_AGENT, params);
    if (data.error) {
      setToastMessage(data.error);
      return;
    }
    return data;
  } catch (e: any) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};

export const deleteAgent = async (id: string) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(DELETE_AGENT, { id });
    if (data.error) {
      setToastMessage(data.error);
      return;
    }
    return data;
  } catch (e: any) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};
