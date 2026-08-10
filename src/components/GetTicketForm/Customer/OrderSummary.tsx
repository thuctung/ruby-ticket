import { Hourglass, RefreshCw, ShieldCheck, Ticket as TicketIcon, X } from "lucide-react";
import { CATEGORY_STYLES, Ticket } from "./type";
import { formatVND } from "@/helpers/money";
import { getPriceAgentAndMultiple } from "../constants";

const PERKS = [
  {
    icon: TicketIcon,
    title: "Xác nhận tức thì",
    desc: "Vé điện tử sẽ được gửi ngay sau khi thanh toán",
  },
  {
    icon: RefreshCw,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn",
  },
  {
    icon: ShieldCheck,
    title: "Đổi trả linh hoạt",
    desc: "Hỗ trợ đổi/huỷ vé theo chính sách",
  },
];

type OrderSummaryProps = {
  selectedLines: any;
  sideName: string;
  dateUse: string;
  totalTickets: number;
  formType: string;
  agentPrice: number;
  total: number;
  quantities: any;
  loading: boolean;
  onBuyTicket: () => void;
  onRemove: (id: string) => void;
};

export default function OrderSummary({
  selectedLines,
  quantities,
  sideName,
  dateUse,
  total,
  formType,
  totalTickets,
  agentPrice,
  loading,
  onRemove,
  onBuyTicket,
}: OrderSummaryProps) {
  return (
    <aside className="sticky top-20 h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">Thông tin đơn hàng</h3>
      <div className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Điểm đến</span>
          <span className="font-semibold text-[#2A1414]">{sideName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Ngày đi</span>
          <span className="font-semibold text-[#2A1414]">{dateUse}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {selectedLines.length === 0 && (
          <p className="text-sm text-gray-400">Chưa có vé nào được chọn.</p>
        )}
        {selectedLines.length &&
          selectedLines.map((t: any) => {
            return (
              <div key={t.code} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <button
                    aria-label="Xoá vé"
                    onClick={() => onRemove(t.code)}
                    className="text-gray-300 transition-colors hover:text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Số lượng × {quantities[t.code]}</span>
                  <span className="font-semibold text-red-600">
                    {formatVND(
                      getPriceAgentAndMultiple(t, formType, agentPrice) * (quantities[t.code] ?? 0)
                    )}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-base font-bold text-gray-900">Tổng cộng</span>
        <span className="text-xl font-extrabold text-red-600">{formatVND(total)}</span>
      </div>

      <button
        disabled={totalTickets === 0 || loading}
        onClick={onBuyTicket}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        <Hourglass size={18} />
        {loading ? "Đang tạo..." : "Đặt vé ngay"}
      </button>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <ShieldCheck size={14} />
        Thanh toán an toàn, bảo mật thông tin
      </div>
    </aside>
  );
}
