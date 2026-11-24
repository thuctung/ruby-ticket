"use client";

import { SiteType } from "@/types/ticket";
import { SearchProductType } from "@/app-controler/admin/product-mgt/type";

type Props = {
  listSite: SiteType[];
  searchValue: SearchProductType;
  onSearch: () => void;
  onChangeSearch: (key: string, value: string) => void;
};

export default function SearchBar({ listSite, searchValue, onChangeSearch, onSearch }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-end">
      <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
        Tên site
        <select
          value={searchValue.site_code}
          onChange={(e) => onChangeSearch("site_code", e.target.value)}
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
        >
          <option value="">Tất cả site</option>
          {listSite.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-[2] flex-col gap-1 text-sm font-medium text-slate-700">
        Tên vé
        <input
          value={searchValue.name}
          onChange={(e) => onChangeSearch("name", e.target.value)}
          placeholder="Ví dụ: Vé cáp treo người lớn"
          className="h-10 rounded-md border border-slate-300 px-3 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
        />
      </label>

      <div className="flex gap-2">
        <button
          onClick={onSearch}
          className="h-10 rounded-md bg-teal-700 px-5 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}
