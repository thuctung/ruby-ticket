import api from "@/axios";
import { CREATE_ORDER_TICKET, GET_LOCATIONS, GET_PRODUCTS, GET_QR_TOPUP, GET_TICKE_TYPE } from "@/commons/apiURL";
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


export const getLocation = async () => {
    try {
        setGlobalLoading(true)
        const res = await api.get(GET_LOCATIONS)
        const location = get(res, 'data', []);
        return location
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


export const createOrderTicket = async (user_id: string, ticketsSelected: ItemSelectType[],total_amount:number, p_date_use:string) => {
    try {
        setGlobalLoading(true)
        const items = ticketsSelected.map(item => ({ ticket_variant_code: item.code, quantity: item.quantity }))
        const { data, error }: any = await api.post(CREATE_ORDER_TICKET, {
            user_id,
            total_amount,
            p_date_use,
            items
        })
        if (!data.success) {
            setToastMessage(data?.message)
            return
        }
        return data
    } catch (e) {
        console.log(e)
        setToastMessage('Có lỗi xảy ra! Thử lại sau');
    } finally {
        setGlobalLoading(false)

    }
}
