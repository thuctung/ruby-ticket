import { inputCls } from "@/components/ui/const-class";
import { SearchButton } from "@/components/ui/customs/searchButton";

type SearchTicketStatusProps = {
  setOrderCode: (value: string) => void;
  orderCode: string;
  onSearch: () => void;
};

export function SearchBookingStatus({
  orderCode,
  setOrderCode,
  onSearch,
}: SearchTicketStatusProps) {
  return (
    <div>
      <div className="mb-4 pl-4 flex flex-wrap items-center gap-3">
        <div className="space-y-2 flex w-full gap-5">
          <div>
            <input
              type="text"
              value={orderCode}
              placeholder="Mã order"
              onChange={(e) => setOrderCode(e.target.value)}
              className={inputCls}
            />
          </div>

          <SearchButton onClick={onSearch} />
        </div>
      </div>
    </div>
  );
}
