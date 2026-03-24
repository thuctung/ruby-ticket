import { TYPE_TRANSACTION } from "@/commons/constant";
import { TableColumn } from "@/components/ui/customs/table";
import { dayjsEx, FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { formatVND } from "@/helpers/money";
import { StatusType, TractionResponseType } from "@/types";

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
const statusClass: Record<string, string> = {
  [TYPE_TRANSACTION.TICKET_BUY]: "text-red-600 bg-red-100",
  [TYPE_TRANSACTION.ADD]: "text-green-600 bg-green-100 ",
};

export const columnTransaction: TableColumn<TractionResponseType>[] = [
  {
    key: "type",
    title: "Loại",
    render: (row) => (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold ${statusClass[row.type]}`}
      >
        {getTypeName(row.type)}
      </span>
    ),
  },
  {
    key: "amount",
    title: "Số tiền",
    render: (row) => formatVND(row.amount),
    align: "right",
  },
  {
    key: "created_at",
    title: "Thời gian",
    render: (row) => dayjsEx(row.created_at).format(FULL_DATE_FORMAT),
    align: "center",
  },
  {
    key: "description",
    title: "Mô tả",
    render: (row) =>
      row.description ? (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded-md text-blue-600 font-mono">
          {row.description}
        </code>
      ) : null,
  },
];
