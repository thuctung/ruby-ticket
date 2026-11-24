import { ROLES, STATUS_COMMON_TYPE, TYPE_TRANSACTION } from "@/commons/constant";

import { StatusType } from "@/types";

export const getTypeName = (status: string) => {
  switch (status) {
    case TYPE_TRANSACTION.ADD:
      return "Nạp tiền";
    case TYPE_TRANSACTION.BUY_TICKET:
      return "Rút vé";
    default:
      return "";
  }
};

export const TYPE_LIST: StatusType[] = [
  { title: getTypeName(TYPE_TRANSACTION.ADD), value: TYPE_TRANSACTION.ADD },
  { title: getTypeName(TYPE_TRANSACTION.BUY_TICKET), value: TYPE_TRANSACTION.BUY_TICKET },
];

export const StatusData = {
  [STATUS_COMMON_TYPE.PENDING]: "Đang xử lý",
  [STATUS_COMMON_TYPE.ERROR]: "Thất bại",
  [STATUS_COMMON_TYPE.SUCCESS]: "Thành công",
  [STATUS_COMMON_TYPE.CANCELED]: "Đã hủy",
  [STATUS_COMMON_TYPE.ONHOLD]: "Đợi thanh toán",
};

export const statusClass: Record<string, string> = {
  [STATUS_COMMON_TYPE.ERROR]: "text-red-600 bg-red-100",
  [STATUS_COMMON_TYPE.SUCCESS]: "text-green-600 bg-green-100 ",
  [STATUS_COMMON_TYPE.COMPLETED]: "text-green-600 bg-green-100 ",
  [STATUS_COMMON_TYPE.CANCELED]: "text-red-600 bg-red-100 ",
  [STATUS_COMMON_TYPE.ONHOLD]: "text-blue-600 bg-blue-100 ",
  [STATUS_COMMON_TYPE.PENDING]: "text-yellow-600 bg-yellow-100 ",
};
