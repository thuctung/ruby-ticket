"use client";

import { useState } from "react";
import { ACC_STATUS } from "@/commons/constant";
import { SearchAffiType, StatusType } from "@/types";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { ResetButton } from "@/components/ui/customs/ressetButton";
import { SelectBox } from "@/components/ui/customs/selectBox";
import { Input } from "@/components/ui/customs/input";

type AffiliateSearch = {
  onSearch: (value: SearchAffiType) => void;
  listStatus: StatusType[];
};

export function AffiliateSearch({ listStatus, onSearch }: any) {
  const [filters, setFilters] = useState({
    username: "",
    email: "",
    status: "",
  });

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const empty = { username: "", email: "", status: "" };
    setFilters(empty);
    onSearch(empty);
  };

  return (
    <div>
      <div className="mmb-4 pl-4 flex flex-wrap items-center gap-3">
        <div className="space-y-2">
          <Input
            type="string"
            placeholder="Username"
            value={filters.username}
            onChange={(value) => handleChange("username", value)}
          />
        </div>
        <div className="space-y-2">
          <Input
            type="string"
            placeholder="Email"
            value={filters.email}
            onChange={(value) => handleChange("email", value)}
          />
        </div>
        <div className="space-y-2">
          <SelectBox
            value={filters.status || ""}
            onChange={(value) => handleChange("status", value)}
          >
            <option value="all">Tất cả</option>
            {listStatus.map((item: StatusType) => (
              <option key={item.value} value={item.value}>
                {item.title}
              </option>
            ))}
          </SelectBox>
        </div>
      </div>
      <div className=" flex flex-wrap justify-end  pr-3">
        <div className="flex justify-end gap-3 mt-6">
          <SearchButton onClick={handleSearch} />
          <ResetButton onClick={handleReset} />
        </div>
      </div>
    </div>
  );
}
