import { STATUS_COMMON_TYPE } from "@/commons/constant";
import { StatusType } from "@/types";

export const getStatusTopupName = (status: string) => {
  switch (status) {
    case STATUS_COMMON_TYPE.APPROVED:
    case STATUS_COMMON_TYPE.COMPLETED:
      return "Thành công";
    case STATUS_COMMON_TYPE.PENDING:
      return "Đang xử lý";
    case STATUS_COMMON_TYPE.REJECTED:
      return "Thất bại";
    case STATUS_COMMON_TYPE.ERROR:
      return "Lỗi";
    default:
      return "";
  }
};

export const listTopupMgtStatus: StatusType[] = [
  { title: getStatusTopupName(STATUS_COMMON_TYPE.COMPLETED), value: STATUS_COMMON_TYPE.COMPLETED },
  { title: getStatusTopupName(STATUS_COMMON_TYPE.PENDING), value: STATUS_COMMON_TYPE.PENDING },
  { title: getStatusTopupName(STATUS_COMMON_TYPE.REJECTED), value: STATUS_COMMON_TYPE.REJECTED },
];
