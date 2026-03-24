import { TableColumn } from "@/components/ui/customs/table";
import { BASIC_DATE_FORMAT, dayjsEx, FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { formatVND } from "@/helpers/money";
import { AdminReportResponseType, AdminSearchReport } from "@/types";
import dayjs from "dayjs";

const df_From = dayjs(new Date()).add(-7, "day").format(BASIC_DATE_FORMAT);
const df_To = dayjs(new Date()).format(BASIC_DATE_FORMAT);

export const intForm: AdminSearchReport = {
  from: df_From,
  to: df_To,
  email: "",
  location: "all",
};

export const columnAdminReport: TableColumn<AdminReportResponseType>[] = [
  {
    key: "user_email",
    title: "Email",
  },
  {
    key: "ticket_name",
    title: "Tên vé",
  },
  {
    key: "quantity",
    title: "Số vé",
    align: "center",
  },
  {
    key: "price",
    title: "Số tiền",
    render: (row) => formatVND(row.price),
  },
  {
    key: "subtotal",
    title: "Tổng tiền",
    className: "font-semibold",
    render: (row) => formatVND(row.subtotal),
  },
  {
    key: "buy_by",
    title: "Người mua",
    render: (row) =>
      row.buy_by === "customer" ? (
        <span className="text-green-500">Khách lẻ</span>
      ) : (
        <span className="text-yellow-500">Đại lý</span>
      ),
  },
  {
    key: "promo_name",
    title: "Khuyến mãi",
    render: (row) => row.promo_name || "Không",
  },
  {
    key: "phone",
    title: "Số điện thoại",
  },
  {
    key: "location_name",
    title: "Địa điểm",
  },
  {
    key: "quantity",
    title: "Ngày bán",
    render: (row) => dayjsEx(row.sale_date).format(FULL_DATE_FORMAT),
  },
];
