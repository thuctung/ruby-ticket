"use client";

import { useState } from "react";
import { SearchTraction, StatusType } from "@/types";
import DatePickerCustom from "@/components/ui/date-picker";
import { checkDateRange } from "@/helpers/dateTime";

type TransactionSearch = {
  onChangeForm: (filter: SearchTraction) => void;
  onReset: () => void;
  listStatus: StatusType[];
  searchValue: SearchTraction;
};

export function TransactionSearch({ listStatus, searchValue, onChangeForm, onReset }: any) {
  const [filter, setFilter] = useState<SearchTraction>({
    ...searchValue,
  });

  const handleChangeFilter = (key: string, value: string) => {
    setFilter((pre) => ({ ...pre, [key]: value }));
  };
  const handleSerch = () => {
    if (checkDateRange(filter.from, filter.to)) {
      onChangeForm(filter);
    }
  };

  return (
    <div className="bg-gray-50/50 p-6 rounded-3xl  rounded-3xl border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 h-full">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
            Loại giao dịch
          </label>
          <select
            className="w-full h-13 bg-white border-none shadow-sm rounded-2xl p-3 outline-none cursor-pointer"
            value={filter.type}
            onChange={(e) => handleChangeFilter("type", e.target.value)}
          >
            <option value="all">Tất cả</option>
            {listStatus.map((item: StatusType) => (
              <option key={item.value} value={item.value}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
            Từ ngày
          </label>
          <DatePickerCustom
            value={filter.from}
            onChange={(date: string) => handleChangeFilter("from", date)}
            maxDate={filter.to}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
            Đến ngày
          </label>
          <DatePickerCustom
            value={filter.to}
            onChange={(date: string) => handleChangeFilter("to", date)}
            maxDate={filter.to}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleSerch}
          className="px-8 py-2.5 rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          Tìm kiếm
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-white transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
