import { STATUS_COMMON_TYPE } from "@/commons/constant";
import { StatusType } from "@/types";

export const getStatusName = (status: string) => {
  switch (status) {
    case STATUS_COMMON_TYPE.APPROVED:
      return "Đang hoạt động";
    case STATUS_COMMON_TYPE.PENDING:
      return "Đợi duyệt";
    case STATUS_COMMON_TYPE.SUSPENDED:
      return "Tạm dừng";
    default:
      return "";
  }
};

export const listAccStatus: StatusType[] = [
  { title: getStatusName(STATUS_COMMON_TYPE.APPROVED), value: STATUS_COMMON_TYPE.APPROVED },
  { title: getStatusName(STATUS_COMMON_TYPE.PENDING), value: STATUS_COMMON_TYPE.PENDING },
  { title: getStatusName(STATUS_COMMON_TYPE.SUSPENDED), value: STATUS_COMMON_TYPE.SUSPENDED },
];

export const statusClass: Record<string, string> = {
  [STATUS_COMMON_TYPE.PENDING]: "text-yellow-600 bg-yellow-100",
  [STATUS_COMMON_TYPE.APPROVED]: "text-green-600 bg-green-100",
  [STATUS_COMMON_TYPE.SUSPENDED]: "text-red-600 bg-red-100",
};
