import { formatVND } from "@/lib/money";
import { useEffect } from "react";
import { RefundInfo } from "../../../type";

type RefundFeeDialogProps = {
  open: boolean;
  onClose: () => void;
  data: RefundInfo | null;
  onConfirm?: () => void;
  loading?: boolean;
};

export function RefundFeeDialog({
  open,
  onClose,
  data,
  onConfirm,
  loading = false,
}: RefundFeeDialogProps) {
  // Đóng bằng phím Esc + khoá scroll nền
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || !data) return null;

  const totalPaid = data.items.reduce((sum, i) => sum + i.unitPrice, 0);
  const totalRefund = totalPaid - data.totalReturnCharge;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="refund-dialog-title"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="refund-dialog-title" className="text-base font-semibold text-slate-900">
              Thông tin phí hoàn vé
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Ngày hoàn: {data.returnDate} · Mã: {data.thirdPartyNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Danh sách vé */}
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {data.items.map((item) => {
            const refund = item.unitPrice - item.returnCharge;
            return (
              <div key={item.ticketNumber} className="rounded-lg border border-slate-100 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs font-semibold text-slate-800">
                      {item.ticketNumber}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    Phí {item.returnRate}%
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Hiệu lực: {item.usageDateFrom} → {item.usageDateTo} · Còn {item.numberReturnDate}{" "}
                  ngày
                </p>

                <dl className="mt-3 space-y-1.5 text-sm">
                  <Row label="Giá vé" value={formatVND(item.unitPrice)} />
                  <Row
                    label={`Phí hoàn (${item.returnRate}%)`}
                    value={`- ${formatVND(item.returnCharge)}`}
                    valueClass="text-red-600"
                  />
                  <div className="border-t border-dashed border-slate-200 pt-1.5">
                    <Row
                      label="Hoàn lại"
                      value={formatVND(refund)}
                      labelClass="font-medium text-slate-800"
                      valueClass="font-semibold text-green-600"
                    />
                  </div>
                </dl>
              </div>
            );
          })}
        </div>

        {/* Tổng kết */}
        <div className="space-y-1.5 border-t border-slate-100 bg-slate-50 px-5 py-4 text-sm">
          <Row label={`Tổng giá vé (${data.items.length} vé)`} value={formatVND(totalPaid)} />
          <Row
            label="Tổng phí hoàn"
            value={`- ${formatVND(data.totalReturnCharge)}`}
            valueClass="text-red-600"
          />
          <Row
            label="Tổng tiền được hoàn"
            value={formatVND(totalRefund)}
            labelClass="font-semibold text-slate-900"
            valueClass="text-base font-bold text-green-600"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Đóng
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Xác nhận hoàn vé"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  labelClass = "text-slate-500",
  valueClass = "text-slate-800",
}: {
  label: string;
  value: string;
  labelClass?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={labelClass}>{label}</dt>
      <dd className={`font-mono ${valueClass}`}>{value}</dd>
    </div>
  );
}
