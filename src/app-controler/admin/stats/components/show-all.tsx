"use client";

import React, { useMemo } from "react";
import { Building2, Users, Ticket, Wallet } from "lucide-react";
import { formatVND } from "@/helpers/money";
import { AllSaleType } from "../type";
import { AGENT, CUSTOMER } from "@/commons/constant";
import { isEmpty } from "lodash";

// ---------------------------------------------------------------------------
// Mock data — thay bằng số liệu thật (props hoặc fetch từ API)
// ---------------------------------------------------------------------------
const DATA = {
  agent: { tickets: 186, amount: 55_800_000 },
  customer: { tickets: 94, amount: 21_150_000 },
};

export default function ShowAllData({ dataSale }: { dataSale: AllSaleType[] }) {
  const coverData = Object.fromEntries(dataSale.map((item) => [item.payment_method, item]));
  const totals = useMemo(() => {
    if (!isEmpty(coverData)) {
      const tickets =
        (coverData[CUSTOMER]?.total_tickets || 0) + (coverData[AGENT]?.total_tickets || 0);
      const amount =
        (coverData[CUSTOMER]?.total_amount || 0) + (coverData[AGENT]?.total_amount || 0);
      return {
        tickets,
        amount,
      };
    }
    return {};
  }, [dataSale]);

  return (
    <div className=" bg-slate-50 ">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* ============ Bảng tổng hợp so sánh ============ */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4 text-sm font-semibold text-slate-900">
            Tổng hợp
          </div>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 text-left font-medium">Loại</th>
                <th className="px-6 py-3 text-right font-medium">Số vé</th>
                <th className="px-6 py-3 text-right font-medium">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-2 text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Đại lý (Agent)
                  </span>
                </td>
                <td className="px-6 py-3 text-right text-slate-700">
                  {coverData[AGENT]?.total_tickets || 0}
                </td>
                <td className="px-6 py-3 text-right font-semibold text-slate-900">
                  {formatVND(coverData[AGENT]?.total_amount || 0)}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-2 text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                    Khách lẻ (Customer)
                  </span>
                </td>
                <td className="px-6 py-3 text-right text-slate-700">
                  {coverData[CUSTOMER]?.total_tickets || 0}
                </td>
                <td className="px-6 py-3 text-right font-semibold text-slate-900">
                  {formatVND(coverData[CUSTOMER]?.total_amount || 0)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50">
                <td className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Tổng cộng
                </td>
                <td className="px-6 py-3 text-right font-semibold text-slate-900">
                  {totals?.tickets?.toLocaleString("vi-VN")}
                </td>
                <td className="px-6 py-3 text-right font-semibold text-blue-700">
                  {formatVND(totals.amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    </div>
  );
}
