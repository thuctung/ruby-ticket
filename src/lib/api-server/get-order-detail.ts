import apiServer from "@/axios/apiServer";
import { GET_ORDER_DETAIL_BY_CODE } from "@/commons/apiURL";

export const getOrderDetail = async (thirdPartyCode: string) => {
  try {
    const { data } = await apiServer.post(GET_ORDER_DETAIL_BY_CODE, { thirdPartyCode });
    return data || [];
  } catch (error) {
    return [];
  }
};
