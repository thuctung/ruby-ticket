import api from "@/axios";
import { GET_QR_TOPUP } from "@/commons/apiURL";
import { DB_TABLE_NAME } from "@/commons/constant";
import {  getCodeTopup,  } from "@/helpers/genCode";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { get } from "lodash";


const supabaseClient = createSupabaseBrowserClient();
const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();


export const creteNewTopup = async (amount: number, user_id: string, payment_code:string, callback?: Function) => {
    try {
        setGlobalLoading(true)
        const {  error } = await supabaseClient.from(DB_TABLE_NAME.TOPUPS).insert({
            user_id,
            amount,
            payment_code
        })
        if (error) {
            setToastMessage(error.message)
        } else if (typeof callback === "function") callback(amount, payment_code)
    } catch (e) {
             setToastMessage('Có lỗi xảy ra! Thử lại sau');

    }
    finally {
        setGlobalLoading(false)
    }
}


export const getListTopupByAff = async (user_id: string) => {
    try {
        setGlobalLoading(true)
        const { data, error }: any = await supabaseClient.from(DB_TABLE_NAME.TOPUPS)
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", { ascending: false })
        if (error) {
            setToastMessage(error.message)
            return
        }
        return data
    } catch (e) {
              setToastMessage('Có lỗi xảy ra! Thử lại sau');

    }
    finally {
        setGlobalLoading(false)
    }
}

export const getQRCodeBank =  async (amount:number) => {
   try{
    setGlobalLoading(true)
     const code =getCodeTopup();
     const res = await api.post(GET_QR_TOPUP, {
      amount,
      code
    })
    const data = get(res, 'data', {}) 
    return data
   }catch(e){
              setToastMessage('Có lỗi xảy ra! Thử lại sau');

   }finally{
    setGlobalLoading(false)

   }
  }