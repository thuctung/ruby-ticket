import { Button } from "@/components/ui/button";
import DatePickerCustom from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkDateRange } from "@/helpers/dateTime";
import { formatVND } from "@/helpers/money";
import { SearchTicketSale } from "@/types";
import { LocationType } from "@/types/ticket";
import { useState } from "react";

type SearchTicketFormProps = {
  onChangeForm: (filter: SearchTicketSale) => void;
  onReset: () => void;
  locations: LocationType[];
  searchValue: SearchTicketSale;
};

export function SearchTicketForm({
  searchValue,
  locations,
  onReset,
  onChangeForm,
}: SearchTicketFormProps) {
  const [filter, setFilter] = useState<SearchTicketSale>({
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

  return (
    <div>
      <div className="mb-4 pl-4 flex flex-wrap items-center gap-3">
        <div className="space-y-2">
          <Label>Địa điểm</Label>
          <Select
            value={filter.location}
            onValueChange={(value) => handleChangeFilter("location", value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Địa điểm" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {locations.map((item: LocationType) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
