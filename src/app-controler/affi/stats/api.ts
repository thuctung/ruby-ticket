import api from "@/axios";
import { COUNT_TICKET_SALE, GET_REFUND_SUMMARY_AFF } from "@/commons/apiURL";
import { BASIC_DATE_FORMAT, dayjsEx, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, SearchTableType, SearchTicketSale, SearchTicketSalePayload } from "@/types";
import dayjs from "dayjs";
import { get } from "lodash";
import { CountTicketSaleParamType, CountTicketType } from "./type";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const countTicketSale = async (
  from: string,
  to: string,
  email: string,
  siteCode?: string
) => {
  try {
    setGlobalLoading(true);
    const dateForm = dayjsEx(from, BASIC_DATE_FORMAT);
    const dateTo = dayjsEx(to, BASIC_DATE_FORMAT);

    const body: CountTicketSaleParamType = {
      email,
      from: dayjs(dateForm).format(SERVER_DATE_FORMAT),
      to: dayjs(dateTo).format(SERVER_DATE_FORMAT),
      siteCode,
    };

    const [resSale, resRefund] = await Promise.all([
      api.post(COUNT_TICKET_SALE, body),
      api.post(GET_REFUND_SUMMARY_AFF, body),
    ]);
    const ticketSale = get(resSale, ["data", "data", 0]);
    const ticketRefund = get(resRefund, ["data", "data", 0]);
    
    if (ticketSale || ticketRefund) {
      const result: CountTicketType = {
        ticketSale: ticketSale?.total_tickets || 0,
        ticketReund: ticketRefund?.total_refund_tickets || 0,
        total: ticketSale?.total_amount || 0,
        refundCharge: ticketRefund?.total_refund_charge || 0,
      };
      return result;
    }

    return null;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};
