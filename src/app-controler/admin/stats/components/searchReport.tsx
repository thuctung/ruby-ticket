import { Input } from "@/components/ui/customs/input";
import { ResetButton } from "@/components/ui/customs/ressetButton";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { SelectBox } from "@/components/ui/customs/selectBox";
import DatePickerCustom from "@/components/ui/date-picker";

import { checkDateRange } from "@/helpers/dateTime";
import { AdminSearchReport, SearchTicketSale } from "@/types";
import { SiteType } from "@/types/ticket";
import { Calendar, MapPin, User } from "lucide-react";
import { useState } from "react";
import { intForm } from "../constant";

type SearchTicketFormProps = {
  onChangeForm: (filter: SearchTicketSale) => void;
  onReset: () => void;
  searchValue: SearchTicketSale;
};

export function SearchReport({ searchValue, onReset, onChangeForm }: SearchTicketFormProps) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
