import { Button } from "@/components/ui/button";
import { ResetButton } from "@/components/ui/customs/ressetButton";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { SelectBox } from "@/components/ui/customs/selectBox";
import DatePickerCustom from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkDateRange } from "@/helpers/dateTime";
import { formatVND } from "@/helpers/money";
import { SearchTicketSale } from "@/types";
import { SiteType } from "@/types/ticket";
import { useState } from "react";
import { StatusData } from "../contants";

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
        {/* <div className="space-y-2">
          <Label>Địa điểm</Label>

          <SelectBox
            value={filter.location || ""}
            onChange={(value) => handleChangeFilter("location", value)}
          >
            <option value="all">Tất cả</option>
            {SITES.map((item: SiteType) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </SelectBox>
        </div> */}
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

          <SelectBox
            value={filter.status || ""}
            onChange={(value) => handleChangeFilter("status", value)}
            className=" h-12"
          >
            <option value="">Tất cả</option>
            {Object.keys(StatusData).map((key: string) => (
              <option key={key} value={key}>
                {StatusData[key]}
              </option>
            ))}
          </SelectBox>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
            Địa điểm
          </label>
          <SelectBox
            value={filter.siteCode || ""}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-[#2A1414] outline-none transition focus:border-[#C81418] focus:ring-2 focus:ring-red-100 disabled:opacity-60"
            onChange={(value) => handleChangeFilter("siteCode", value)}
          >
            <option value="">Chọn công viên</option>
            {siteList.map((site) => (
              <option key={site.code} value={site.code}>
                {site.name}
              </option>
            ))}
          </SelectBox>
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
