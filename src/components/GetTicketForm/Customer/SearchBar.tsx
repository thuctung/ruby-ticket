"use client";

import DatePickerCustom from "@/components/ui/date-picker";
import DropdownSearch from "@/components/ui/dropdown-search";
import { SiteType } from "@/types/ticket";
import { Info, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toDate } from "../constants";

type SearchBarProp = {
  siteCode: string;
  setSiteCode: (value: string) => void;
  listSite: SiteType[];
  dateUse: string;
  setDateUse: (value: string) => void;
};

export default function SearchBar({
  siteCode,
  dateUse,
  setDateUse,
  setSiteCode,
  listSite,
}: SearchBarProp) {
  const [state, setState] = useState({
    siteCode: siteCode,
    dateUse: dateUse,
  });

  const onChangeForm = (key: string, value: string) => {
    setState((pre) => ({ ...pre, [key]: value }));
  };

  const handleSearch = () => {
    setSiteCode(state.siteCode);
    setDateUse(state.dateUse);
  };

  const lisStateCover = useMemo(
    () => listSite.map((item) => ({ value: item.code, label: item.name })),
    [listSite]
  );

  useEffect(() => {
    if (siteCode) {
      setState((pre) => ({ ...pre, siteCode }));
    }
  }, [siteCode]);

  return (
    <section className="relative z-10 mx-auto -mt-16 ">
      <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Chọn công viên</label>
            <DropdownSearch
              options={lisStateCover}
              value={state.siteCode}
              onChange={(value: string) => onChangeForm("siteCode", value)}
              placeholder="Chọn tên công viên"
              searchPlaceholder="Gõ để tìm..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Ngày sử dụng</label>
            <DatePickerCustom
              name="date_use"
              id="date_use"
              value={state.dateUse}
              onChange={(val: any) => onChangeForm("dateUse", val)}
              minDate={toDate}
              className="shadow-none border border-gray-200 h-12 rounded-xl"
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-700 md:h-[50px]"
            onClick={handleSearch}
          >
            <Search size={18} />
            Tìm kiếm
          </button>
        </div>

        <div className="mt-5 flex items-start gap-2 text-sm text-gray-500">
          <Info size={16} className="mt-0.5 shrink-0" />
          <span>Vui lòng chọn đúng ngày sử dụng. </span>
        </div>
      </div>
    </section>
  );
}
