import api from "@/axios";
import { GET_LIST_INVENTORY, UPSERT_INVENTORY } from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { get } from "lodash";

const { setGlobalLoading, setToastMessage }: CommonType | any = useCommonStore.getState();

export const getListInventory = async () => {
    setGlobalLoading(true);
    try {
        const response = await api.get(GET_LIST_INVENTORY);
        const data = get(response, ['data', 'inventory']) || [];
        return data;
    } catch (err: any) {
        setToastMessage(err.response?.data?.error || err.message || 'Lỗi khi tải danh sách inventory');
        return [];
    } finally {
        setGlobalLoading(false);
    }
}

export const upsertInventory = async (payload: { product_key: string; date: string; capacity: number }) => {
    setGlobalLoading(true);
    try {
        const response = await api.post(UPSERT_INVENTORY, payload);
        const data = get(response, ['data', 'inventory']);
        setToastMessage('Cập nhật inventory thành công', 'success');
        return data;
    } catch (err: any) {
        setToastMessage(err.response?.data?.error || err.message || 'Lỗi khi cập nhật inventory');
        return null;
    } finally {
        setGlobalLoading(false);
    }
}
