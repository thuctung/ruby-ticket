"use-client";

import { TractionResponseType } from "@/types";
import { TYPE_TRANSACTION } from "@/commons/constant";
import { getTypeName } from "../constants";
import { formatVND } from "@/helpers/money";
import { formatVNTime } from "@/helpers/dateTime";

type TractionTableProps = {
  transactions: TractionResponseType[];
};

export function TractionTable({ transactions }: TractionTableProps) {
  const statusClass: Record<string, string> = {
    [TYPE_TRANSACTION.TICKET_BUY]: "text-red-600 bg-red-100",
    [TYPE_TRANSACTION.ADD]: "text-green-600 bg-green-100 ",
  };

  return (
    <div className="overflow-auto rounded-2xl border">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm table-wrapper">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="p-4 text-xs font-bold text-gray-400 uppercase">Loại</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">Số tiền</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase">Thời gian</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase">Mô tả</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.length === 0 ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  Không có data
                </td>
              </tr>
            ) : (
              transactions.map((transactions: TractionResponseType, index: number) => (
                <tr className="hover:bg-gray-50/50 transition-colors group" key={index}>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold ${statusClass[transactions.type]}`}
                    >
                      {getTypeName(transactions.type)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-gray-900 tabular-nums text-base">
                      {formatVND(transactions.amount)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 font-medium">
                    {formatVNTime(transactions.created_at)}
                  </td>
                  <td className="p-4">
                    {transactions.description ? (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded-md text-blue-600 font-mono">
                        {transactions.description}
                      </code>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
