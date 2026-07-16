import api from "@/axios";
import { UPDATE_PROFILE } from "@/commons/apiURL";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
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
