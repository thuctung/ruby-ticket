"use client";

import { formatVND } from "@/lib/money";
import { SiteType } from "@/types/ticket";

type Props = {
  site: SiteType;
};

export default function DefaultPriceCard({ site }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-end">
      <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
        Mặc định Đại lý cộng thêm (đ)
        <input
          disabled
          min={0}
          value={formatVND(site?.price_agent_default || 0)}
          style={{ backgroundColor: "#eeeeee" }}
          className="h-10 rounded-md text-right border border-slate-300 px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
        />
      </label>

      <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
        Mặc định Giảm cho khách lẻ(%)
        <input
          disabled
          value={`${site?.percent_customer_default || 0}%`}
          style={{ backgroundColor: "#eeeeee" }}
          className="h-10 rounded-md text-right bg-[#eeeeee] border border-slate-300 px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
        />
      </label>
    </div>
  );
}
