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
  ["CANCEL"]: "cancel",
  ["ONHOLD"]: "onhold",
};

export const StatusData = {
  [KEY_MODIFY_DATA.PENDING]: "Đang xử lý",
  [KEY_MODIFY_DATA.ERROR]: "Thất bại",
  [KEY_MODIFY_DATA.SUCCESSS]: "Thành công",
  [KEY_MODIFY_DATA.CANCEL]: "Đã hủy",
  [KEY_MODIFY_DATA.ONHOLD]: "Đợi thanh toán",
};

export const statusClass: Record<string, string> = {
  [KEY_MODIFY_DATA.ERROR]: "text-red-600 bg-red-100",
  [KEY_MODIFY_DATA.SUCCESSS]: "text-green-600 bg-green-100 ",
  [KEY_MODIFY_DATA.CANCEL]: "text-red-600 bg-red-100 ",
  [KEY_MODIFY_DATA.ONHOLD]: "text-blue-600 bg-blue-100 ",
  [KEY_MODIFY_DATA.PENDING]: "text-yellow-600 bg-yellow-100 ",
};
