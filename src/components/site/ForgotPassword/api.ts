import api from "@/axios";
import { FORGOT_PASSWORD } from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";

const { setToastMessage }: CommonType | any = useCommonStore.getState();

export const sendEmailResetPassword = async (email: string) => {
  try {
    const { data, error }: any = await api.post(FORGOT_PASSWORD, { email });
    setToastMessage("Vui lòng kiểm tra mail");
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  }
};
