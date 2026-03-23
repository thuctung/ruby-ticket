"use-client";

import { getStatusTopupName } from "@/app-controler/admin/topup-mgt/components/constants";
import { TOPUPS_STATUS } from "@/commons/constant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { fullDateTimeFormat } from "@/helpers/dateTime";
import { formatVND } from "@/lib/money";
import { TopupHistoryResponseType } from "@/types";

type TopupHistoryProps = {
  history: TopupHistoryResponseType[];
};

export function TopupHistory({ history }: TopupHistoryProps) {
  const statusClass: Record<string, string> = {
    [TOPUPS_STATUS.PENDING]: "text-yellow-600 bg-yellow-100",
    [TOPUPS_STATUS.APPROVED]: "text-green-600 bg-green-100",
    [TOPUPS_STATUS.REJECTED]: "text-red-600 bg-red-100",
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Lịch sử nạp tiền</CardTitle>
      </CardHeader>
      <CardContent>
        <div className=" rounded-2xl border  table-wrapper">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="p-3">Ngày nạp</th>
                <th className="p-3">Số tiền</th>
                <th className="p-3">Mã nạp</th>
                <th className="p-3">Thực nhận</th>
                <th className="p-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {history?.length === 0 ? (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={5}>
                    Không tìm thây lịch sử
                  </td>
                </tr>
              ) : (
                history.map((item: any, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 font-medium">{fullDateTimeFormat(item.created_at)}</td>
                    <td className="p-3">{formatVND(item.amount)}</td>
                    <td className="p-3">{item.payment_code}</td>
                    <td className="p-3">{item.real_amount ? formatVND(item.amount) : ""}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full border px-2 py-1 text-xs  ${statusClass[item.status]}`}
                      >
                        {getStatusTopupName(item.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
