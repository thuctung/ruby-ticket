import sunApi from "@/axios/apiSun";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getStatusBooking = async (orderCode: string) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await sunApi.get(`/ota/order/get`, {
      params: {
        lang: "vi",
        orderCode,
      },
    });
    if (data.result) {
      return data.result;
    } else if (data.messages[0]) {
      setToastMessage(data.messages[0]);
      return null;
    }
    return null;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};
