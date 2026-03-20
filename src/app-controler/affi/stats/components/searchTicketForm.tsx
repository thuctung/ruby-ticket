import { Button } from "@/components/ui/button";
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
import { LocationType } from "@/types/ticket";
import { useState } from "react";

type SearchTicketFormProps = {
  onChangeForm: (filter: SearchTicketSale) => void;
  onReset: () => void;
  locations: LocationType[];
  searchValue: SearchTicketSale;
};

export function SearchTicketForm({
  searchValue,
  locations,
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
          <Label>Địa điểm</Label>

          <select
            className="w-full h-13 bg-white border-none shadow-sm rounded-2xl p-3 outline-none cursor-pointer"
            value={filter.location}
            onChange={(e) => handleChangeFilter("location", e.target.value)}
          >
            <option value="all">Tất cả</option>
            {locations.map((item: LocationType) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
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
      </div>
      <div className=" flex flex-wrap justify-end  pr-3">
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
    </div>
  );
}
