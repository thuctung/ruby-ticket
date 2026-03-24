import { getStatusTopupName } from "@/app-controler/admin/topup-mgt/components/constants";
import { TOPUPS_STATUS } from "@/commons/constant";
import { TableColumn } from "@/components/ui/customs/table";
import { dayjsEx, FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { formatVND } from "@/helpers/money";
import { TopupHistoryResponseType } from "@/types";

const statusClass: Record<string, string> = {
  [TOPUPS_STATUS.PENDING]: "text-yellow-600 bg-yellow-100",
  [TOPUPS_STATUS.APPROVED]: "text-green-600 bg-green-100",
  [TOPUPS_STATUS.REJECTED]: "text-red-600 bg-red-100",
};

export const columnsTopupAffHistory: TableColumn<TopupHistoryResponseType>[] = [
  {
    key: "created_at",
    title: "Ngày nạp",
    render: (row) => dayjsEx(row.created_at).format(FULL_DATE_FORMAT),
  },
  {
    key: "amount",
    title: "Số tiền",
    render: (row) => formatVND(row.amount),
    align: "right",
  },
  {
    key: "payment_code",
    title: "Mã nạp",
    render: (row) => row.payment_code,
    align: "right",
  },
  {
    key: "real_amount",
    title: "Thực nhận",
    render: (row) => formatVND(row.real_amount),
    align: "right",
  },
  {
    key: "status",
    title: "Trạng thái",
    render: (row) => (
      <span className={`rounded-full border px-2 py-1 text-xs ${statusClass[row.status] ?? ""}`}>
        {getStatusTopupName(row.status)}
      </span>
    ),
  },
];
