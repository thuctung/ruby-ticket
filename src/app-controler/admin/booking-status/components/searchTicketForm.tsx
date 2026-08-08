import { ParamStatusTicketType } from "@/app-controler/affi/ticket-statatus/type";
import { ResetButton } from "@/components/ui/customs/ressetButton";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { SelectBox } from "@/components/ui/customs/selectBox";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteType } from "@/types/ticket";

import { useState } from "react";

type SearchTicketStatusProps = {
  onSearch: (value: string) => void;
};

export function SearchBookingStatus({ onSearch }: SearchTicketStatusProps) {
  const [orderCode, setOrderCode] = useState<string>("");

  const handleSerch = () => {
    onSearch(orderCode);
  };

  return (
    <div>
      <div className="mb-4 pl-4 flex flex-wrap items-center gap-3">
        <div className="space-y-2">
          <input
            type="text"
            value={orderCode}
            placeholder="Mã order"
            onChange={(e) => setOrderCode(e.target.value)}
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
