import { getStatusTopupName } from "@/app-controler/admin/topup-mgt/components/constants";
import { statusClass } from "@/app-controler/admin/topup-mgt/constants";
import { TableColumn } from "@/components/ui/customs/table";
import { dayjsEx, FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { formatVND } from "@/helpers/money";
import { TopupHistoryResponseType } from "@/types";

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
    align: "center",
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
