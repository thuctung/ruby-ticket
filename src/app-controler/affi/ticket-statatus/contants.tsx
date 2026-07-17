import { TYPE_TRANSACTION } from "@/commons/constant";

import { StatusType } from "@/types";
export const KEY_STATUS_TICKET = {
  ["Used"]: "Used",
  ["Unused"]: "Unused",
  ["Expired"]: "Expired",
};

export const StatusData = {
  [KEY_STATUS_TICKET.Used]: "Đã sử dụng",
  [KEY_STATUS_TICKET.Unused]: "Chưa sử dụng",
  [KEY_STATUS_TICKET.Expired]: "Hết hạn",
};

export const statusClass: Record<string, string> = {
  [KEY_STATUS_TICKET.Used]: "text-blue-600 bg-blue-100 ",
  [KEY_STATUS_TICKET.Unused]: "text-green-600 bg-green-100 ",
  [KEY_STATUS_TICKET.Expired]: "text-red-600 bg-red-100 ",
};
