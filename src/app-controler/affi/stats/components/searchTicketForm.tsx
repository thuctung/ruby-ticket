import { ResetButton } from "@/components/ui/customs/ressetButton";
import { SearchButton } from "@/components/ui/customs/searchButton";
import DatePickerCustom from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

import { checkDateRange } from "@/helpers/dateTime";
import { SearchTicketSale } from "@/types";
import { SiteType } from "@/types/ticket";
import { useState } from "react";
import { StatusData } from "../contants";
import { inputCls } from "@/components/ui/const-class";

type SearchTicketFormProps = {
  onChangeForm: (filter: SearchTicketSale) => void;
  onReset: () => void;
  searchValue: SearchTicketSale;
  siteList: SiteType[];
};

export function SearchTicketForm({
  searchValue,
  siteList,
  onReset,
  onChangeForm,
}: SearchTicketFormProps) {
  const [filter, setFilter] = useState<SearchTicketSale>({
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
    <div>
      <div className="mb-4 pl-4 flex flex-wrap items-center gap-3">
        <div className="space-y-2">
          <Label>Từ ngày</Label>
          <DatePickerCustom
            value={filter.from}
            onChange={(date: string) => handleChangeFilter("from", date)}
            maxDate={filter.to}
          />
        </div>
        <div className="space-y-2">
          <Label>Đến ngày</Label>
          <DatePickerCustom
            value={filter.to}
            onChange={(date: string) => handleChangeFilter("to", date)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
            Trạng thái
          </label>

          <select
            className={inputCls}
            value={filter.status || ""}
            onChange={(e) => handleChangeFilter("status", e.target.value)}
          >
            <option value="">Tất cả</option>
            {Object.keys(StatusData).map((key: string) => (
              <option key={key} value={key}>
                {StatusData[key]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
            Địa điểm
          </label>
          <select
            className={inputCls}
            value={filter.siteCode || ""}
            onChange={(e) => handleChangeFilter("siteCode", e.target.value)}
          >
            <option value="">Chọn công viên</option>
            {siteList.map((site) => (
              <option key={site.code} value={site.code}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className=" flex flex-wrap justify-end  pr-3">
        <div className="flex justify-end gap-3 mt-6">
          <SearchButton onClick={handleSerch} />
          <ResetButton onClick={onReset} />
        </div>
      </div>
    </div>
  );
}
