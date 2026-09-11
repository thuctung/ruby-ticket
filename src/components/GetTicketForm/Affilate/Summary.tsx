import { Minus, Plus, Trash2 } from "lucide-react";
import { formatVND } from "@/helpers/money";
import { BOOKING_FORM_TYPE, getPriceAgentAndMultiple } from "../constants";
import { useState } from "react";
import { useIsMobile } from "@/helpers/useResize";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ProductBanaType } from "@/types/ticket";

type OrderSummaryProps = {
  selectedLines: any;
  siteName: string;
  dateUse: string;
  totalTickets: number;
  formType: string;
  agentPrice: number;
  total: number;
  quantities: any;
  loading: boolean;
  onBuyTicket: () => void;
  onRemove: (id: string) => void;
  exportGuideTicket: any;
  setExportGuideTicket: any;
  setQty: (code: string, next: number) => void;
};

export default function OrderAffSummary({
  selectedLines,
  quantities,
  siteName,
  dateUse,
  total,
  formType,
  totalTickets,
  agentPrice,
  loading,
  setExportGuideTicket,
  exportGuideTicket,
  onBuyTicket,
  setQty,
}: OrderSummaryProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const classDesktop = isMobile ? "bottom-0 overflow-hidden" : "top-20";
  const classList = isMobile ? "max-h-[200px]" : "max-h-[400px]";
  const style = open ? "530px" : "92px";

  const handleChangeQuantity = (ticket: ProductBanaType, value: number, input = false) => {
    let num = quantities[ticket.code] ?? 0;
    if (ticket.multiple > 1) {
      num += value;
    } else if (input) {
      num = value;
    } else {
      num += value;
    }
    setQty(ticket.code, num);
  };

  return (
    <aside
      className={`sticky  rounded-2xl border border-gray-100 bg-white shadow-sm  h-fit ${classDesktop} transition-height `}
      style={{
        height: isMobile ? style : "fit-content",
      }}
    >
      <div className="m-4">
        {isMobile ? (
          <div
            className="mb-4 text-center flex justify-center items-center text-[red]"
            onClick={() => setOpen((pre) => !pre)}
          >
            <p className="text-center">{open ? "Tạm ẩn" : "Xem chi tiết"}</p>
            {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        ) : null}
        <h3 className="text-lg font-bold text-gray-900 text-center">Thông tin đơn hàng</h3>
        <div className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Điểm đến</span>
            <span className="font-semibold text-[#2A1414]">{siteName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Ngày đi</span>
            <span className="font-semibold text-[#2A1414]">{dateUse}</span>
          </div>
        </div>
        <br />
        <div className={`mt-4 flex flex-col gap-4 h-auto overflow-auto ${classList}`}>
          {selectedLines.length > 0 ? (
            selectedLines.map((t: any) => {
              return (
                <div
                  key={t.code}
                  className=" border-b border-dashed border-[#DCD6C2] pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 rounded-md border border-[#DCD6C2] px-1.5 py-0.5">
                      <button
                        type="button"
                        aria-label={`Giảm số lượng ${t.name}`}
                        onClick={() => handleChangeQuantity(t, -t.multiple)}
                        className="flex h-5 w-5 items-center justify-center rounded text-[#6E7C73] transition-colors hover:bg-[#F0EBDD] hover:text-[#1C2620] disabled:opacity-40"
                        disabled={(quantities[t.code] ?? 1) <= 1}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span className="w-5 text-center text-[#1C2620]">{quantities[t.code]}</span>

                      <button
                        type="button"
                        aria-label={`Tăng số lượng ${t.name}`}
                        onClick={() => handleChangeQuantity(t, t.multiple)}
                        className="flex h-5 w-5 items-center justify-center rounded text-[#6E7C73] transition-colors hover:bg-[#F0EBDD] hover:text-[#1C2620]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-red-600">
                        {formatVND(
                          getPriceAgentAndMultiple(t, formType, agentPrice) *
                            (quantities[t.code] ?? 0)
                        )}
                      </span>
                      <button
                        type="button"
                        aria-label={`Xóa ${t.name}`}
                        onClick={() => setQty(t.code, 0)}
                        className="flex h-5 w-5 items-center justify-center rounded text-[#6E7C73] transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-400">Chưa có vé nào được chọn.</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-red-300 pt-4">
          <span className="text-base font-bold text-gray-900">Tổng cộng</span>
          <span className="text-xl font-extrabold text-red-600">{formatVND(total)}</span>
        </div>

        <button
          disabled={totalTickets === 0 || loading}
          onClick={onBuyTicket}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loading ? "Đang tạo..." : "Xuất vé"}
        </button>
        {selectedLines.length && formType === BOOKING_FORM_TYPE.AFFILATE ? (
          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[#1F3A2F]">
            <input
              type="checkbox"
              checked={exportGuideTicket}
              onChange={(e) => setExportGuideTicket?.(e.target.checked)}
              className="h-4 w-4 rounded border-[#DCD6C2] text-[#1F3A2F] focus:ring-[#1F3A2F]"
            />
            <span>Xuất vé cho hướng dẫn viên</span>
          </label>
        ) : null}
      </div>
    </aside>
  );
}
