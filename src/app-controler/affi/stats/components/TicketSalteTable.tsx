"use-client";

import { TicketSalteResponseType } from "@/types";
import { formatVND } from "@/helpers/money";
import { formatVNTime } from "@/helpers/dateTime";

type TicketSaleTableProps = {
  ticketSale: TicketSalteResponseType[];
};

export function TicketSaleTable({ ticketSale }: TicketSaleTableProps) {
  return (
    <div className="rounded-2xl border  table-wrapper">
      <table className="w-full text-sm">
        <thead className="text-left text-muted-foreground">
          <tr>
            <th className="p-3">Địa điểm</th>
            <th className="p-3">Tên vé</th>
            <th className="p-3">Số lượng</th>
            <th className="p-3">Số tiền</th>
            <th className="p-3">Ngày bán</th>
          </tr>
        </thead>
        <tbody>
          {ticketSale.length === 0 ? (
            <tr>
              <td className="p-3 text-muted-foreground" colSpan={5}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            ticketSale.map((ticketSale: TicketSalteResponseType, index: number) => (
              <tr key={index} className="border-t">
                <td className="p-3 font-medium">{ticketSale.location_name}</td>
                <td className="p-3">{ticketSale.ticket_name}</td>
                <td className="p-3 text-center">{ticketSale.quantity}</td>
                <td className="p-3">{formatVND(ticketSale.total)}</td>
                <td className="p-3">{formatVNTime(ticketSale.created_at)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
