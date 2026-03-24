import { Input } from "@/components/ui/customs/input";
import { ResetButton } from "@/components/ui/customs/ressetButton";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { SelectBox } from "@/components/ui/customs/selectBox";
import DatePickerCustom from "@/components/ui/date-picker";

import { checkDateRange } from "@/helpers/dateTime";
import { AdminSearchReport, SearchTicketSale } from "@/types";
import { LocationType } from "@/types/ticket";
import { Calendar, MapPin, User } from "lucide-react";
import { useState } from "react";
import { intForm } from "../constant";

type SearchTicketFormProps = {
  onChangeForm: (filter: SearchTicketSale) => void;
  onReset: () => void;
  locations: LocationType[];
  searchValue: SearchTicketSale;
};

export function SearchReport({
  searchValue,
  locations,
  onReset,
  onChangeForm,
}: SearchTicketFormProps) {
  const [filter, setFilter] = useState<AdminSearchReport>({
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

  const handleResetForm = () => {
    onReset();
    setFilter({ ...intForm });
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Thống kê vé bán</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Địa điểm */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              <MapPin size={14} /> Địa điểm
            </label>

            <SelectBox
              value={filter.location || "all"}
              onChange={(value) => handleChangeFilter("location", value)}
              className=" h-12"
            >
              <option value="all">Tất cả</option>
              {locations.map((item: LocationType) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </SelectBox>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              <Calendar size={14} /> Từ ngày (ngày bán)
            </label>
            <div>
              <DatePickerCustom
                className="h-12"
                value={filter.from}
                onChange={(date: string) => handleChangeFilter("from", date)}
                maxDate={filter.to}
              />
            </div>
          </div>

          {/* Đến ngày */}
          <div className="h-10">
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              <Calendar size={14} /> Đến ngày (ngày bán)
            </label>
            <DatePickerCustom
              className="h-12"
              value={filter.to}
              onChange={(date: string) => handleChangeFilter("to", date)}
            />
          </div>

          {/* Tên/Email aff */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              <User size={14} /> Email đại lý
            </label>
            <Input
              type="text"
              placeholder="email "
              value={filter.email || ""}
              className="h-12"
              onChange={(value: string) => handleChangeFilter("email", value)}
            />
          </div>
        </div>
        <div className=" flex flex-wrap justify-end  pr-3">
          <div className="flex justify-end gap-3 mt-6">
            <SearchButton onClick={handleSerch} />
            <ResetButton onClick={handleResetForm} />
          </div>
        </div>
      </div>
    </div>
  );
}
