import { Input } from "@/components/ui/customs/input";
import { ResetButton } from "@/components/ui/customs/ressetButton";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { SelectBox } from "@/components/ui/customs/selectBox";

import { useState } from "react";
import { CategoryType, SearchProductType, SiteType } from "../type";

type SearchTicketFormProps = {
  onSearch: (value: SearchProductType) => void;
  listSite: SiteType[];
  listCategory: CategoryType[];
};

const initForm: SearchProductType = {
  siteCode: "",
  personType: "",
  name: "",
};

const SearchProduct = ({ listSite, listCategory, onSearch }: SearchTicketFormProps) => {
  const [filter, setFilter] = useState<SearchProductType>(initForm);

  const handleChangeFilter = (key: string, value: string) => {
    setFilter((pre) => ({ ...pre, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filter);
  };

  const handleReset = () => {
    onSearch(initForm);
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Quản lý giá vé</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              Chọn địa điểm
            </label>

            <SelectBox
              value={filter.siteCode}
              onChange={(value) => handleChangeFilter("siteCode", value)}
              className=" h-12"
            >
              <option value="">Tất cả</option>
              {listSite.map((site) => (
                <option key={site.name} value={site.code}>
                  {site.name}
                </option>
              ))}
            </SelectBox>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              Loại vé
            </label>

            <SelectBox
              value={filter.personType}
              onChange={(value) => handleChangeFilter("personType", value)}
              className=" h-12"
            >
              <option value="">Chọn loại vé</option>
              {listCategory.map((site) => (
                <option key={site.name} value={site.code}>
                  {site.name}
                </option>
              ))}
            </SelectBox>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              Tên vé
            </label>
            <Input
              type="text"
              placeholder="name"
              value={filter.name || ""}
              className="h-12"
              onChange={(value: string) => handleChangeFilter("name", value)}
            />
          </div>
        </div>
        <div className=" flex flex-wrap justify-end  pr-3">
          <div className="flex justify-end gap-3 mt-6">
            <SearchButton onClick={handleSearch} />
            <ResetButton onClick={handleReset} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchProduct;
