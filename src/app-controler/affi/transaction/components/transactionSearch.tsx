"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { SearchTraction, StatusType } from "@/types";
import { Label } from "@/components/ui/label";
import DatePickerCustom from "@/components/ui/date-picker";

type TransactionSearch = {
  onChangeForm: (filter: SearchTraction) => void;
  onReset: () => void;
  listStatus: StatusType[];
  searchValue: SearchTraction;
};

export function TransactionSearch({
  listStatus,
  onSearch,
  searchValue,
  onChangeForm,
  onReset,
}: any) {
  const [filter, setFilter] = useState<SearchTraction>({
    ...searchValue,
  });

  const handleChangeFilter = (key: string, value: string) => {
    setFilter((pre) => ({ ...pre, [key]: value }));
  };
  const handleSerch = () => {
    onChangeForm(filter);
  };

  return (
    <div>
      <div className="mb-4 pl-4 flex flex-wrap items-center gap-3">
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
        <div className="space-y-2">
          <Label>Loại giao dịch</Label>

          <Select value={filter.type} onValueChange={(value) => handleChangeFilter("type", value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {listStatus.map((item: StatusType) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className=" flex flex-wrap justify-end  pr-3">
        <div className="space-y-2 ">
          <Button onClick={handleSerch}>Search</Button>

          <Button className="ml-3" variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
