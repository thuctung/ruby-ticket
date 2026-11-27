import { STATUS_COMMON_TYPE } from "@/commons/constant";

export const statusClass: Record<string, string> = {
  [STATUS_COMMON_TYPE.PENDING]: "text-yellow-600 bg-yellow-100",
  [STATUS_COMMON_TYPE.APPROVED]: "text-green-600 bg-green-100",
  [STATUS_COMMON_TYPE.COMPLETED]: "text-green-600 bg-green-100",
  [STATUS_COMMON_TYPE.REJECTED]: "text-red-600 bg-red-100",
};
