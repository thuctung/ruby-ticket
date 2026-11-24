import { ROLES, STATUS_COMMON_TYPE } from "@/commons/constant";
import { BASIC_DATE_FORMAT } from "@/helpers/dateTime";
import { AdminSearchReport } from "@/types";
import dayjs from "dayjs";

export const df_From = dayjs(new Date()).add(-7, "day").format(BASIC_DATE_FORMAT);
export const df_To = dayjs(new Date()).format(BASIC_DATE_FORMAT);

export const intForm: AdminSearchReport = {
  from: df_From,
  to: df_To,
  email: "",
  location: "all",
  status: STATUS_COMMON_TYPE.SUCCESS,
  full_name: "",
};

export const BuyMethod = [
  { name: "Đại lý", code: ROLES.AFFILIATE },
  { name: "Khách lẻ", code: ROLES.CUSTOMER },
];
