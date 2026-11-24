"use client";

import DatePickerCustom from "@/components/ui/date-picker";
import DropdownSearch from "@/components/ui/dropdown-search";
import { SiteType } from "@/types/ticket";
import { Info, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BOOKING_FORM_TYPE, toDate } from "../constants";

type SearchBarProp = {
  siteCode: string;
  setSiteCode: (value: string) => void;
  listSite: SiteType[];
  dateUse: string;
  formType?: string;
  setDateUse: (value: string) => void;
};

export default function SearchBar({
  siteCode,
  dateUse,
  setDateUse,
  setSiteCode,
  listSite,
  formType,
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
            <label className="text-[11px] font-semibold">Chọn công viên</label>
            <DropdownSearch
              options={lisStateCover}
              value={state.siteCode}
              onChange={(value: string) => onChangeForm("siteCode", value)}
              placeholder="Chọn tên công viên"
              searchPlaceholder="Nhập để tìm..."
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold">Ngày sử dụng</label>
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
            onClick={handleSearch}
            className=" flex items-center justify-center  gap-2 h-10 w-full rounded-lg bg-red-600 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <Search size={18} />
            Tìm kiếm
          </button>
        </div>
      </div>
    </section>
  );
}
