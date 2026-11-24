import { inputCls } from "@/components/ui/const-class";
import { SearchButton } from "@/components/ui/customs/searchButton";
import DatePickerCustom from "@/components/ui/date-picker";
import { SiteType } from "@/types/ticket";

type SearchRefundFormProps = {
  handleSearch: () => void;
  onChange: (key: string, value: string) => void;
  searchValue: any;
  listSideSun: SiteType[];
};

const SearchRefundForm = ({
  searchValue,
  listSideSun,
  onChange,
  handleSearch,
}: SearchRefundFormProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="fromDate" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Từ ngày
          </label>
          <DatePickerCustom
            value={searchValue.from}
            onChange={(date: string) => onChange("from", date)}
            maxDate={searchValue.to}
          />
        </div>
        <div>
          <label htmlFor="toDate" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Đến ngày
          </label>
          <DatePickerCustom
            value={searchValue.to}
            onChange={(date: string) => onChange("to", date)}
            minDate={searchValue.from}
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Email order
          </label>
          <div className="relative">
            <input
              id="email"
              type="text"
              value={searchValue.email}
              onChange={(e) => onChange("email", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <label
            htmlFor="third_party_number"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Third party number
          </label>
          <div className="relative">
            <input
              id="third_party_number"
              type="text"
              value={searchValue.third_party_number}
              onChange={(e) => onChange("third_party_number", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label htmlFor="status" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Công viên
          </label>
          <select
            value={searchValue.site_code}
            onChange={(e) => onChange("site_code", e.target.value)}
            className={inputCls}
          >
            <option value="">Tất cả</option>
            {listSideSun.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <SearchButton onClick={handleSearch} />
      </div>
    </div>
  );
};

export default SearchRefundForm;
