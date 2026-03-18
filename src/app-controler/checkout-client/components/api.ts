import api from "@/axios";
import { GET_HOME_HIGHLIGHTS } from "@/commons/apiURL";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";

const clientSupbase = createSupabaseBrowserClient()
const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getLocationClient = async () => {
    try {
        setGlobalLoading(true)
        const { data, error } = await clientSupbase
            .from(DB_TABLE_NAME.LOCATIONS)
            .select("*")
        if (error) {
            setToastMessage(error.message)
        }
        return data
    } catch {
        setToastMessage('Có lỗi xảy ra')
    }
    finally {
        setGlobalLoading(false)
    }
};



export const getTicketType = async (location: string) => {
    try {
        setGlobalLoading(true)
        const { data, error } = await clientSupbase
            .from(DB_TABLE_NAME.TICKET_TYPES)
            .select("*")
            .eq('location_code', location)
        if (error) {
            setToastMessage(error.message)
        }
        return data
    } catch {
        setToastMessage('Có lỗi xảy ra')
    }
    finally {
        setGlobalLoading(false)
    }
};


export const getTicketVariant = async (ticketTypeCode: string) => {
    try {
        setGlobalLoading(true)
        const { data, error } = await clientSupbase
            .from(DB_TABLE_NAME.VIEW_TICET_VARIANTS_AND_CATEGORY)
            .select('*')
            .eq('ticket_type_code', ticketTypeCode)
        if (error) {
            setToastMessage(error.message)
        }
        return data
    } catch {
        setToastMessage('Có lỗi xảy ra')
    }
    finally {
        setGlobalLoading(false)
    }
};



