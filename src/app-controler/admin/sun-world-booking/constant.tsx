import { ROLES } from "@/commons/constant";
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
  status: "",
};

export const BuyMethod = [
  { name: "Đại lý", code: ROLES.AFFILIATE },
  { name: "Khách lẻ", code: ROLES.CUSTOMER },
];

export const KEY_STATUS_TICKET = {
  ["Used"]: "Used",
  ["Unused"]: "Unused",
  ["Expired"]: "Expired",
  ["Void"]: "Void",
  ["Active"]: "Active",
};

export const StatusData = {
  [KEY_STATUS_TICKET.Used]: "Đã sử dụng",
  [KEY_STATUS_TICKET.Unused]: "Chưa sử dụng",
  [KEY_STATUS_TICKET.Expired]: "Hết hạn",
  [KEY_STATUS_TICKET.Void]: "Đã hủy",
  [KEY_STATUS_TICKET.Active]: "Active",
};

export const statusClass: Record<string, string> = {
  [KEY_STATUS_TICKET.Used]: "text-blue-600 bg-blue-100 ",
  [KEY_STATUS_TICKET.Unused]: "text-green-600 bg-green-100 ",
  [KEY_STATUS_TICKET.Active]: "text-green-600 bg-green-100 ",
  [KEY_STATUS_TICKET.Expired]: "text-red-600 bg-red-100 ",
  [KEY_STATUS_TICKET.Void]: "text-red-600 bg-red-100 ",
};

export const STATUS_MAP = {
  cancelled: {
    label: "Đã huỷ",
    dot: "bg-rose-500",
    text: "text-amber-700",
    bg: "bg-rose-50",
    ring: "ring-rose-200",
  },
  success: {
    label: "Thành công",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
  },
  onhold: {
    label: "Đang đặt vé",
    dot: "bg-green-500",
    text: "text-green-700",
    bg: "bg-green-50",
    ring: "ring-green-200",
  },
};
