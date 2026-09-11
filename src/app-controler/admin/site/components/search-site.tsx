import { Input } from "@/components/ui/customs/input";
import { ResetButton } from "@/components/ui/customs/ressetButton";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { SelectBox } from "@/components/ui/customs/selectBox";
import DatePickerCustom from "@/components/ui/date-picker";

import { checkDateRange } from "@/helpers/dateTime";
import { Calendar, User } from "lucide-react";
import { useState } from "react";
import { StatusData } from "@/app-controler/affi/stats/contants";
import { SearchSiteType } from "../type";

type SearchTicketFormProps = {
  onChangeForm: (filter: SearchSiteType) => void;
  onReset: () => void;
  searchValue: SearchSiteType;
};

export function SearchSite({ searchValue, onReset, onChangeForm }: SearchTicketFormProps) {
  const [filter, setFilter] = useState<any>({
    ...searchValue,
  });
  const handleChangeFilter = (key: string, value: string) => {
    setFilter((pre: any) => ({ ...pre, [key]: value }));
  };

  const handleSerch = () => {
    if (checkDateRange(filter.from, filter.to)) {
      onChangeForm(filter);
    }
  };

  const handleResetForm = () => {
    onReset();
    setFilter({});
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Quản lý công viên</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              Tên site
            </label>
            <Input
              type="text"
              placeholder="name"
              value={filter.name || ""}
              className="h-12"
              onChange={(value: string) => handleChangeFilter("name", value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              Trạng thái Khách lẻ
            </label>

            <SelectBox
              value={filter.status || ""}
              onChange={(value) => handleChangeFilter("status", value)}
              className=" h-12"
            >
              <option value="">Tất cả</option>
              <option value="true">Đang mở</option>
              <option value="false">Đóng</option>
            </SelectBox>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              Trạng thái Đại lý
            </label>

            <SelectBox
              value={filter.status_affilate || ""}
              onChange={(value) => handleChangeFilter("status_affilate", value)}
              className=" h-12"
            >
              <option value="">Tất cả</option>
              <option value="true">Đang mở</option>
              <option value="false">Đóng</option>
            </SelectBox>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              Khu vực
            </label>

            <SelectBox
              value={filter.in_system || ""}
              onChange={(value) => handleChangeFilter("in_system", value)}
              className=" h-12"
            >
              <option value="">Tất cả</option>
              <option value="true">Trong hệ thống</option>
              <option value="false">Ngoài hệ thống</option>
            </SelectBox>
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
