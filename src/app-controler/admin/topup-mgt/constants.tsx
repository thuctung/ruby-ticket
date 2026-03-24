import { TOPUPS_STATUS } from "@/commons/constant";

export const statusClass: Record<string, string> = {
  [TOPUPS_STATUS.PENDING]: "text-yellow-600 bg-yellow-100",
  [TOPUPS_STATUS.APPROVED]: "text-green-600 bg-green-100",
  [TOPUPS_STATUS.REJECTED]: "text-red-600 bg-red-100",
};
