import api from "@/axios";
import { ADMIN_UPDATE_STATUS_TOPUP, GET_LIST_TOPUP_MGT } from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import {
  CommonType,
  ProfileUpdateStatusType,
  SearchAffiType,
  SearchTableType,
  TopupMgtResponseType,
} from "@/types";
import { get } from "lodash";

const { setGlobalLoading, setToastMessage }: CommonType | any = useCommonStore.getState();

export const getListTopupMgt = async (searchValue: SearchTableType<SearchAffiType>) => {
  setGlobalLoading(true);
  try {
    const response = await api.post(GET_LIST_TOPUP_MGT, searchValue);
    const data = get(response, ["data"]) || [];
    return data;
  } catch (err: any) {
    setToastMessage(err.response?.data?.error || err.message || "Lỗi khi tải danh sách");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateTopupMgtStatus = async (topupItems: TopupMgtResponseType) => {
  setGlobalLoading(true);
  try {
    const response = await api.post(ADMIN_UPDATE_STATUS_TOPUP, {
      content: topupItems.payment_code,
      transferAmount: topupItems.amount,
    });
    return response;
  } catch (err: any) {
    setToastMessage(err.response?.data?.error || err.message || "Có lỗi xảy");
  } finally {
    setGlobalLoading(false);
  }
};
