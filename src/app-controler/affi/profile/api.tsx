import api from "@/axios";
import {
  CHANGE_PASSWORD,
  COUNT_TICKET_SALE,
  GET_TICKET_SALE,
  UPDATE_PROFILE,
} from "@/commons/apiURL";
import { DB_TABLE_NAME } from "@/commons/constant";
import { BASIC_DATE_FORMAT, dayjsEx, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, ProfileType, SearchTableType, SearchTicketSale } from "@/types";
import dayjs from "dayjs";
import { get } from "lodash";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();
const clientSupbase = createSupabaseBrowserClient();

export const updateProfile = async (params: {
  phone: string;
  address: string;
  full_name: string;
  user_id: string;
}) => {
  try {
    setGlobalLoading(true);
    const response = await api.post(UPDATE_PROFILE, params);
    const data = get(response, "data") || [];
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const changePassword = async (password: string, oldPassword: string, email: string) => {
  try {
    debugger;
    setGlobalLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: oldPassword });
    if (error) {
      setToastMessage("Mật khẩu cũ không đúng");
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      return setToastMessage("Không thể cập nhật mật khẩu");
    }
    return true;
  } finally {
    setGlobalLoading(false);
  }
};
