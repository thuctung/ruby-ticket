import { useEffect, useState } from "react";
import { formatVND } from "@/helpers/money";

import { getCurrentMoeny } from "../api";
import { PriceSunWorldType } from "../type";
import { SITE_CODES } from "@/commons/constant";

export function CurrentMoney() {
  const [listPrice, setListPrice] = useState<PriceSunWorldType[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  const fetchCurrentMoney = async () => {
    const data = await getCurrentMoeny();
    if (data) {
      setListPrice(data);
    }
  };

  useEffect(() => {
    if (listPrice.length) {
      const findITem =
        listPrice.find((item) => item.siteCode === SITE_CODES.BANAHILL)?.activity || 0;
      setCurrentPrice(findITem);
    }
  }, [listPrice]);

  useEffect(() => {
    fetchCurrentMoney();
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              Số tiền hiện tại
            </div>
            <div className="mt-1 text-3xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {formatVND(currentPrice)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: any) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
