import api from "@/axios";
import { GET_TRANSACTION } from "@/commons/apiURL";
import { BASIC_DATE_FORMAT, dayjsEx, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, SearchTableType, SearchTraction } from "@/types";
import dayjs from "dayjs";
import { get } from "lodash";

const { setGlobalLoading, setToastMessage }: CommonType | any = useCommonStore.getState();

export const getListTransaction = async (
  params: SearchTableType<SearchTraction>,
  user_id: string
) => {
  try {
    setGlobalLoading(true);
    const { currentPage, searchValue } = params;
    const { type, from, to } = searchValue;
    const dateForm = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);
    const body: any = {
      user_id,
      currentPage,
      type: type === "all" ? "" : type,
      from: dayjs(dateForm).format(SERVER_DATE_FORMAT),
      to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
    };

    const response = await api.post(GET_TRANSACTION, body);
    const data = get(response, "data") || [];
    return data;
  } catch (err: any) {
    setToastMessage(err.response?.data?.error || err.message || "Lỗi khi tải danh sách");
  } finally {
    setGlobalLoading(false);
  }
};
