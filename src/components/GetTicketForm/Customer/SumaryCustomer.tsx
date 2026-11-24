import { Trash2 } from "lucide-react";
import { formatVND } from "@/helpers/money";
import { getPriceAgentAndMultiple } from "../constants";
import { useState } from "react";
import { useIsMobile } from "@/helpers/useResize";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AgentPriceType, ProductBanaType, SiteType } from "@/types/ticket";
import { useCartStore } from "@/stores/useCartStore";

type OrderSummaryProps = {
  selectedLines: any;
  siteName: string;
  dateUse: string;
  totalTickets: number;
  formType: string;
  mapAgentPrice: Map<string, AgentPriceType>;
  agentPriceDefault: number;
  total: number;
  quantities: any;
  loading: boolean;
  onBuyTicket: () => void;
  onRemove: (id: string) => void;
  exportGuideTicket: any;
  setExportGuideTicket: any;
  setQty: (code: string, next: number) => void;
};

export default function SummaryCustomer({
  selectedLines,
  quantities,
  siteName,
  dateUse,
  total,
  formType,
  mapAgentPrice,
  loading,
  agentPriceDefault,
  onBuyTicket,
  setQty,
}: OrderSummaryProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const classDesktop = isMobile ? "bottom-0 overflow-hidden" : "top-20";
  const classList = isMobile ? "max-h-[200px]" : "max-h-[400px]";
  const style = open ? "530px" : "92px";
  const removeItem = useCartStore((s) => s.removeItem);

  const removeItemFromCart = (code: string) => {
    setQty(code, 0);
    removeItem(code);
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
                    <span className="w-20 text-[#1C2620]">SL: {quantities[t.code]}</span>
                    <div className="flex">
                      <span className="font-semibold text-[#2d8020]">
                        {formatVND(
                          getPriceAgentAndMultiple(t, formType, mapAgentPrice, agentPriceDefault) *
                            (quantities[t.code] ?? 0)
                        )}
                      </span>
                      <button
                        type="button"
                        aria-label={`Xóa ${t.name}`}
                        onClick={() => removeItemFromCart(t.code)}
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
          disabled={selectedLines.length === 0 || loading}
          type="button"
          className="w-full mt-5 rounded-xl bg-gradient-to-r from-[#ffb12b] to-[#f26b1d] px-3 py-3 font-semibold text-white shadow-md shadow-orange-400/30 transition hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300 disabled:text-white/80 disabled:shadow-none disabled:hover:brightness-100 disabled:active:scale-100"
        >
          Tạo đơn
        </button>
      </div>
    </aside>
  );
}
