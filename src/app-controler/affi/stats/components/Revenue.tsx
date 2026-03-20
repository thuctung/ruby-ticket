import { formatVND } from "@/helpers/money";

type RevenueProps = { total: number; ticket: number; from: string; to: string };

export function Revenue({ total, ticket, from, to }: RevenueProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
      <div className="flex items-center gap-2 mb-6 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm font-medium">
          Từ: {from} ~ {to}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-1">
            Tổng tiền
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-900">{formatVND(total)}</span>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <p className="text-orange-600 text-sm font-semibold uppercase tracking-wider mb-1">
            Số vé đã bán
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-orange-900">{ticket}</span>
            <span className="text-orange-700 font-medium">vé</span>
          </div>
        </div>
      </div>
    </div>
  );
}
