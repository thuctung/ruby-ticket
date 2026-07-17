import { ResetButton } from "@/components/ui/customs/ressetButton";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { SelectBox } from "@/components/ui/customs/selectBox";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SideSunGroupType } from "@/types/ticket";

import { useState } from "react";
import { ParamStatusTicketType } from "../type";

type SearchTicketStatusProps = {
  onSearch: (value: ParamStatusTicketType) => void;
  listSite: SideSunGroupType[];
};

export function SearchTicketStatus({ listSite, onSearch }: SearchTicketStatusProps) {
  const [value, setValue] = useState<ParamStatusTicketType>({
    orderCode: "",
    siteCode: "",
  });

  const handleSerch = () => {
    onSearch(value);
  };

  const handleChangeForm = (key: string, value: string) => {
    setValue((pre) => ({ ...pre, [key]: value }));
  };
  return (
    <div>
      <div className="mb-4 pl-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <SelectBox
            value={value.siteCode}
            onChange={(value) => handleChangeForm("siteCode", value)}
            className="h-13 "
            firstOption
          >
            {listSite.map((side) => (
              <option key={side.code} value={side.code}>
                {side.name}
              </option>
            ))}
          </SelectBox>
        </div>
        <div className="space-y-2">
          <input
            type="text"
            value={value.orderCode}
            placeholder="Mã order"
            onChange={(e) => handleChangeForm("orderCode", e.target.value)}
            className="w-full p-2.5 border h-[52px] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>
      <div className=" flex flex-wrap justify-end  pr-3">
        <div className="flex justify-end gap-3 mt-6">
          <SearchButton onClick={handleSerch} />
        </div>
      </div>
    </div>
  );
}
