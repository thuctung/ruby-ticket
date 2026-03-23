import { BASIC_DATE_FORMAT } from "@/helpers/dateTime";
import { AdminSearchReport } from "@/types";
import dayjs from "dayjs";

const df_From = dayjs(new Date()).add(-7, "day").format(BASIC_DATE_FORMAT);
const df_To = dayjs(new Date()).format(BASIC_DATE_FORMAT);

export const intForm: AdminSearchReport = {
  from: df_From,
  to: df_To,
  email: "",
  location: "all",
};