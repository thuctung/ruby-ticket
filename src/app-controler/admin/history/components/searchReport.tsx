import { Input } from "@/components/ui/customs/input";
import { ResetButton } from "@/components/ui/customs/ressetButton";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { SelectBox } from "@/components/ui/customs/selectBox";
import DatePickerCustom from "@/components/ui/date-picker";

import { SearchTicketSale } from "@/types";
import { Calendar, MapPin, User } from "lucide-react";
import { StatusData } from "@/app-controler/affi/stats/contants";

type SearchTicketFormProps = {
  onChangeForm: (key: string, value: string) => void;
  onReset: () => void;
  onSearch: () => void;
  searchValue: SearchTicketSale;
  handleExcel: () => void;
};

export function SearchReport({
  searchValue,
  handleExcel,
  onReset,
  onChangeForm,
  onSearch,
}: SearchTicketFormProps) {
  const handleResetForm = () => {
    onReset();
  };

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
        </div>
        <div className=" flex flex-wrap justify-end  pr-3">
          <div className="flex justify-end gap-3 mt-6">
            <SearchButton onClick={onSearch} />
            <ResetButton onClick={handleResetForm} />
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
