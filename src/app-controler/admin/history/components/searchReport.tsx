import { Input } from "@/components/ui/customs/input";
import { ResetButton } from "@/components/ui/customs/ressetButton";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { SelectBox } from "@/components/ui/customs/selectBox";
import DatePickerCustom from "@/components/ui/date-picker";

import { SearchTicketSale } from "@/types";
import { Calendar, MapPin, User } from "lucide-react";
import { StatusData } from "@/app-controler/affi/stats/contants";
import DropdownSearch from "@/components/ui/dropdown-search";
import { ListAffDropdownType } from "../type";
import { SiteType } from "@/types/ticket";

type SearchTicketFormProps = {
  onChangeForm: (key: string, value: string) => void;
  onSearch: () => void;
  searchValue: SearchTicketSale;
  handleExcel: () => void;
  listAff: ListAffDropdownType[];
  listSite: SiteType[];
};

export function SearchReport({
  searchValue,
  listAff,
  listSite,
  handleExcel,
  onChangeForm,
  onSearch,
}: SearchTicketFormProps) {
  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Lịch sử rút vé</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              <Calendar size={14} /> Từ ngày (ngày bán)
            </label>
            <div>
              <DatePickerCustom
                value={searchValue.from}
                onChange={(date: string) => onChangeForm("from", date)}
                maxDate={searchValue.to}
              />
            </div>
          </div>
          {/* Đến ngày */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              <Calendar size={14} /> Đến ngày (ngày bán)
            </label>
            <div>
              <DatePickerCustom
                value={searchValue.to}
                onChange={(date: string) => onChangeForm("to", date)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              Trạng thái
            </label>

            <SelectBox
              value={searchValue.status || ""}
              onChange={(value) => onChangeForm("status", value)}
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
              Công viên
            </label>

            <SelectBox
              value={searchValue.siteCode || ""}
              onChange={(value) => onChangeForm("siteCode", value)}
              className=" h-12"
            >
              <option value="">Tất cả</option>
              {listSite.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </SelectBox>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              <User size={14} /> Tên đại lý
            </label>
            <DropdownSearch
              options={listAff}
              value={searchValue.email}
              onChange={(value: string) => onChangeForm("email", value)}
              placeholder="Chọn tên đại lý"
              searchPlaceholder="Gõ để tìm..."
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
              value={searchValue.email || ""}
              className="h-12"
              onChange={(value: string) => onChangeForm("email", value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              Third party code
            </label>
            <Input
              type="text"
              placeholder=""
              value={searchValue.third_party_number || ""}
              className="h-12"
              onChange={(value: string) => onChangeForm("third_party_number", value)}
            />
          </div>
        </div>
        <div className=" flex flex-wrap justify-end  pr-3">
          <div className="flex justify-end gap-3 mt-6">
            <SearchButton onClick={onSearch} />
            <button
              onClick={handleExcel}
              className="px-6 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-white transition-all"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
