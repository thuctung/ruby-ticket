import api from "@/axios";
import { GET_LIST_TOPUP_MGT, UPDATE_AFFILIATE_ROLE, UPDATE_AFFILIATE_STATUS, UPDATE_STATUS_TOPUP_MGT } from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, ProfileUpdateStatusType, SearchAffiType, SearchTableType } from "@/types";
import { get } from "lodash";


const { setGlobalLoading, setToastMessage }: CommonType | any = useCommonStore.getState();

export const getListTopupMgt = async (searchValue: SearchTableType<SearchAffiType>) => {

    setGlobalLoading(true);
    try {
        const response = await api.post(GET_LIST_TOPUP_MGT, searchValue);
        const data = get(response, ['data']) || [];
        return data
    } catch (err: any) {
        setToastMessage(err.response?.data?.error || err.message || 'Lỗi khi tải danh sách');
    } finally {
        setGlobalLoading(false);
    }
}

export const updateTopupMgtStatus = async (topup_id:string) => {
    setGlobalLoading(true);
    try {
        const response = await api.post(UPDATE_STATUS_TOPUP_MGT, {topup_id});
        return response
    } catch (err: any) {
        setToastMessage(err.response?.data?.error || err.message || 'Có lỗi xảy');
    } finally {
        setGlobalLoading(false);
    }
}
