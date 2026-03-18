import api from "@/axios";
import { GET_LIST_PRICING, UPSERT_PRICING, GET_LOCATIONS, GET_TICKE_TYPE, GET_PRODUCTS } from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { get } from "lodash";

const { setGlobalLoading, setToastMessage }: CommonType | any = useCommonStore.getState();

export const getLocations = async () => {
    try {
        setGlobalLoading(true)
        const res = await api.get(GET_LOCATIONS)
        const location = get(res, 'data', []);
        return location
    } catch (e) {
        setToastMessage('Có lỗi xảy ra khi lấy danh sách địa điểm!');
        return [];
    } finally {
        setGlobalLoading(false)
    }
}

export const getTicketTypes = async (loaction: string) => {
    try {
        setGlobalLoading(true)
        const res = await api.post(GET_TICKE_TYPE, { loaction })
        const ticketTypes = get(res, 'data', []);
        return ticketTypes
    } catch (e) {
        setToastMessage('Có lỗi xảy ra khi lấy loại vé!');
        return [];
    } finally {
        setGlobalLoading(false)
    }
}

export const getProductsByTicketType = async (ticket_type_code: string) => {
    try {
        setGlobalLoading(true)
        const res = await api.post(GET_PRODUCTS, { ticket_type_code })
        const products = get(res, 'data', []);
        return products
    } catch (e) {
        setToastMessage('Có lỗi xảy ra khi lấy danh sách sản phẩm!');
        return [];
    } finally {
        setGlobalLoading(false)
    }
}

export const getListPricing = async () => {
    setGlobalLoading(true);
    try {
        const response = await api.get(GET_LIST_PRICING);
        const data = get(response, ['data', 'pricing']) || [];
        return data;
    } catch (err: any) {
        setToastMessage(err.response?.data?.error || err.message || 'Lỗi khi tải danh sách giá vé');
        return [];
    } finally {
        setGlobalLoading(false);
    }
}

export const upsertPrice = async (payload: any) => {
    setGlobalLoading(true);
    try {
        const response = await api.post(UPSERT_PRICING, payload);
        const data = get(response, ['data', 'pricing']);
        setToastMessage('Cập nhật giá vé thành công', 'success');
        return data;
    } catch (err: any) {
        setToastMessage(err.response?.data?.error || err.message || 'Lỗi khi cập nhật giá vé');
        return null;
    } finally {
        setGlobalLoading(false);
    }
}
