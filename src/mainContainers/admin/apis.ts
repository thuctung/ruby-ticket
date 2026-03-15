import api from "@/axios";
import { GET_LIST_AFFILIATE, UPDATE_AFFILIATE_ROLE, UPDATE_AFFILIATE_STATUS } from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, ProfileUpdateStatusType, SearchAffiType, SearchTableType } from "@/types";
import { get } from "lodash";


const { setGlobalLoading, setToastMessage }: CommonType | any = useCommonStore.getState();
export const getListAffi = async (searchValue: SearchTableType<SearchAffiType>) => {

    setGlobalLoading(true);
    try {
        const response = await api.post(GET_LIST_AFFILIATE, searchValue);
        const data = get(response, ['data']) || [];
        return data
    } catch (err: any) {
        setToastMessage(err.response?.data?.error || err.message || 'Lỗi khi tải danh sách');
    } finally {
        setGlobalLoading(false);
    }
}

export const updateStatus = async (param: ProfileUpdateStatusType) => {
    setGlobalLoading(true);
    try {
        const response = await api.post(UPDATE_AFFILIATE_STATUS, param);
        return response
    } catch (err: any) {
        setToastMessage(err.response?.data?.error || err.message || 'Lỗi khi tải danh sách');
    } finally {
        setGlobalLoading(false);
    }
}

export const updateRole = async () => {
    setGlobalLoading(true);
    try {
        const response = await api.post(UPDATE_AFFILIATE_ROLE);
        return response
    } catch (err: any) {
        setToastMessage(err.response?.data?.error || err.message || 'Lỗi khi tải danh sách');
    } finally {
        setGlobalLoading(false);
    }
}
