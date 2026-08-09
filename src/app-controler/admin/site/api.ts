import api from "@/axios";
import { GET_ALL_SITE, UPDATE_SITE } from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, SearchTableType } from "@/types";
import { SearchSiteType, SiteType } from "./type";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getAllSiteMgt = async (params: SearchTableType<SearchSiteType>) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(GET_ALL_SITE, params);
    return data;
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateSite = async (params: SiteType) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(UPDATE_SITE, params);
    return data;
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};
