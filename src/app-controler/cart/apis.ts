import api from "@/axios";
import { CREATE_PAYMENT_WITH_MOMO, CREATE_PAYMENT_WITH_ONE_PAY } from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";

const { setGlobalLoading, setToastMessage }: CommonType | any = useCommonStore.getState();

export const paymentMomo = async (orderCode: string, totalPayment: number) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(CREATE_PAYMENT_WITH_MOMO, { orderCode, totalPayment });
    return data;
  } catch (err: any) {
    setToastMessage(err.response?.data?.error || err.message || "Lỗi khi tải danh sách");
  } finally {
    setGlobalLoading(false);
  }
};

export const paymentOnePay = async (orderCode: string, paymentCode: string) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(CREATE_PAYMENT_WITH_ONE_PAY, { orderCode, paymentCode });

    return data;
  } catch (err: any) {
    setToastMessage(err.response?.data?.error || err.message || "Lỗi khi tải danh sách");
  } finally {
    setGlobalLoading(false);
  }
};
