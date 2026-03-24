import { TYPE_TRANSACTION } from "@/commons/constant";
import { TableColumn } from "@/components/ui/customs/table";
import { dayjsEx, FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { formatVND } from "@/helpers/money";
import { StatusType, TicketSalteResponseType } from "@/types";

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

export const columnAffStats: TableColumn<TicketSalteResponseType>[] = [
  {
    key: "location_name",
    title: "Địa điểm",
  },
  {
    key: "ticket_name",
    title: "Tên vé",
    align: "right",
  },
  {
    key: "quantity",
    title: "Số lượng",
    align: "center",
  },
  {
    key: "total",
    title: "Số tiền",
    render: (row) => formatVND(row.total),
  },
  {
    key: "created_at",
    title: "Ngày bán",
    render: (row) => dayjsEx(row.created_at).format(FULL_DATE_FORMAT),
    align: "center",
  },
];
