import api from "@/axios";
import { CREATE_ORDER_TICKET, GET_PRODUCTS, GET_QR_TOPUP, GET_TICKE_TYPE } from "@/commons/apiURL";
import { DB_TABLE_NAME } from "@/commons/constant";
import { getCodeTopup, } from "@/helpers/genCode";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { ItemSelectType } from "@/types/ticket";
import { get } from "lodash";



const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getTicletByLocation = async (loaction: string) => {
    try {
        setGlobalLoading(true)
        const res = await api.post(GET_TICKE_TYPE, {
            loaction
        })
        const product = get(res, 'data', []);
        return product
    } catch (e) {
        setToastMessage('Có lỗi xảy ra! Thử lại sau');
    } finally {
        setGlobalLoading(false)

    }
}

export const getProducts = async (ticket_type_code: string) => {
    try {
        setGlobalLoading(true)
        const res = await api.post(GET_PRODUCTS, { ticket_type_code })
        const product = get(res, 'data', []);
        return product
    } catch (e) {
        setToastMessage('Có lỗi xảy ra! Thử lại sau');
    } finally {
        setGlobalLoading(false)

    }
}


export const createOrderTicket = async (user_id: string, ticketsSelected: ItemSelectType[]) => {
    try {
        setGlobalLoading(true)
        const items = ticketsSelected.map(item => ({ ticket_variant_code: item.code, quantity: item.quantity }))
        const { data, error }: any = await api.post(CREATE_ORDER_TICKET, {
            user_id,
            items
        })
        if (!data.success) {
            setToastMessage(data?.message)
            return
        }
    } catch (e) {
        console.log(e)
        setToastMessage('Có lỗi xảy ra! Thử lại sau');
    } finally {
        setGlobalLoading(false)

    }
}
