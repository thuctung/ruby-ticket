import { TYPE_TRANSACTION } from "@/commons/constant";

import { StatusType } from "@/types";

export const getTypeName = (status: string) => {
  switch (status) {
    case TYPE_TRANSACTION.ADD:
      return "Nạp tiền";
    case TYPE_TRANSACTION.TICKET_BUY:
      return "Rút vé";
    default:
      return "";
  }
};

export const TYPE_LIST: StatusType[] = [
  { title: getTypeName(TYPE_TRANSACTION.ADD), value: TYPE_TRANSACTION.ADD },
  { title: getTypeName(TYPE_TRANSACTION.TICKET_BUY), value: TYPE_TRANSACTION.TICKET_BUY },
];

export const KEY_MODIFY_DATA = {
  ["SUCCESSS"]: "success",
  ["PENDING"]: "pending",
  ["ERROR"]: "error",
};

export const StatusData = {
  [KEY_MODIFY_DATA.PENDING]: "Đang xử lý",
  [KEY_MODIFY_DATA.ERROR]: "Thất bại",
  [KEY_MODIFY_DATA.SUCCESSS]: "Thành công",
};

export const statusClass: Record<string, string> = {
  error: "text-red-600 bg-red-100",
  success: "text-green-600 bg-green-100 ",
};
