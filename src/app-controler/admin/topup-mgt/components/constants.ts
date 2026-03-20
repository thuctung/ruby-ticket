import { TOPUPS_STATUS } from "@/commons/constant";
import { StatusType } from "@/types";

export const getStatusTopupName = (status: string) => {
  switch (status) {
    case TOPUPS_STATUS.APPROVED:
      return "Thành công";
    case TOPUPS_STATUS.PENDING:
      return "Đang xử lý";
    case TOPUPS_STATUS.REJECTED:
      return "Thất bại";
    default:
      return "";
  }
};

export const listTopupMgtStatus: StatusType[] = [
  { title: getStatusTopupName(TOPUPS_STATUS.APPROVED), value: TOPUPS_STATUS.APPROVED },
  { title: getStatusTopupName(TOPUPS_STATUS.PENDING), value: TOPUPS_STATUS.PENDING },
  { title: getStatusTopupName(TOPUPS_STATUS.REJECTED), value: TOPUPS_STATUS.REJECTED },
];

export const DrafDATA = {
  gateway: "MBBank",
  transactionDate: "2026-03-20 21:12:00",
  accountNumber: "66755886868",
  subAccount: null,
  code: null,
  content: "AFF5ATZE6NESS5X",
  transferType: "in",
  description: "BankAPINotify AFF5ATZE6NESS5X",
  transferAmount: 1000000,
  referenceCode: "FT26079067583586",
  accumulated: 0,
  id: 46130956,
};
