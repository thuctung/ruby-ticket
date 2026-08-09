import api from "@/axios";
import { EXPORT_EXCEL, GET_ADMIN_REPORT } from "@/commons/apiURL";
import { BASIC_DATE_FORMAT, dayjsEx, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { useCommonStore } from "@/stores/useCommonStore";
import { AdminSearchReport, CommonType, SearchTableType } from "@/types";
import dayjs from "dayjs";
import { get } from "lodash";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getTicketSaleAdmin = async (params: SearchTableType<AdminSearchReport>) => {
  try {
    setGlobalLoading(true);
    const { currentPage, searchValue } = params;
    const { location, from, to, email, payment_method, status } = searchValue;
    const dateFrom = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);

    const body: any = {
      currentPage,
      location: location === "all" ? "" : location,
      from: dayjs(dateFrom).format(SERVER_DATE_FORMAT),
      to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
      email,
      payment_method,
      status,
    };

    const response = await api.post(GET_ADMIN_REPORT, {
      currentPage,
      searchValue: body,
    });

    const data = get(response, "data") || [];
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const exportExcel = async (payload: AdminSearchReport) => {
  try {
    setGlobalLoading(true);
    const { from, to } = payload;
    const dateFrom = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);
    const res: any = await api.post(
      EXPORT_EXCEL,
      {
        ...payload,
        from: dayjs(dateFrom).format(SERVER_DATE_FORMAT),
        to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
      },
      {
        responseType: "blob",
      }
    );
    const url = URL.createObjectURL(res.data);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-report.xlsx";
    a.click();

    URL.revokeObjectURL(url);
  } catch (e) {
    setToastMessage("Lỗi khi xuất excel");
  } finally {
    setGlobalLoading(false);
  }
};
