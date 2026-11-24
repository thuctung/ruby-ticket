"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";
import { formatVND } from "@/lib/money";
import { ButtonCommon } from "@/components/ui/customs/buttonCommon";
import { ResetButton } from "@/components/ui/customs/ressetButton";
import { inputCls } from "@/components/ui/const-class";

type RefundAgentDialogProps = {
  open: boolean;
  maxAmount: number;
  priceAff: number;
  unitPrice:number;
  onClose: () => void;
  onSubmit: (amount: number, surcharge:number) => void;
};

type PriceOption = "agent" | "sunworld" | "unitprice";


export default function RefundAgentDialog({
  open,
  maxAmount,
  priceAff,
  unitPrice,
  onClose,
  onSubmit,
}: RefundAgentDialogProps) {
  const [surcharge, setSurcharge] = useState(0);
  const [option, setOption] = useState<PriceOption>("sunworld");

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const sunworldRefund = Math.max(0, maxAmount);

  const basePrice = option === "agent" ? priceAff : sunworldRefund;

  const total = useMemo(
    () => Math.max(0, basePrice - surcharge),
    [basePrice, surcharge]
  );

  const handleSubmit =() => {
    onSubmit(basePrice,surcharge )
  }

  const handleChangeSurcharge = (value: string) => {
    setSurcharge(Math.max(0, Number(value) || 0));
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="refund-dialog-title"
        className="w-full max-w-[420px] rounded-3xl bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h2
            id="refund-dialog-title"
            className="text-lg font-bold tracking-tight text-slate-900"
          >
            Thông tin phí hoàn tiền
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="-mr-1.5 -mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
         

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-700">
              Chọn giá áp dụng
            </p>
            <div className="space-y-2">
              <PriceOptionItem
                id="opt-agent"
                checked={option === "agent"}
                onChange={() => setOption("agent")}
                label="Đại lý mua"
                value={priceAff}
              />
              <PriceOptionItem
                id="opt-unitprice"
                checked={option === "unitprice"}
                onChange={() => setOption("unitprice")}
                label="Giá gốc"
                value={unitPrice}
              />
              <PriceOptionItem
                id="opt-sunworld"
                checked={option === "sunworld"}
                onChange={() => setOption("sunworld")}
                label="Giá Sunworld hoàn"
                value={maxAmount}
              />
            </div>
          </div>

          {/* Phụ phí */}
          <div>
            <label
              htmlFor="refund-surcharge"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Phụ phí
            </label>
            <input
              id="refund-surcharge"
              value={surcharge}
              type="number"
              min={0}
              onChange={(e) => handleChangeSurcharge(e.target.value)}
              className={`${inputCls} text-right`}
            />
            <p className="mt-1 text-right text-[12px] text-slate-500">
              {formatVND(surcharge)}
            </p>
          </div>

          {/* Thành tiền */}
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Tạm tính
              </span>
              <span className="font-medium text-slate-700">
                {formatVND(basePrice)}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
              <span>Phụ phí</span>
              <span className="font-medium text-slate-700">
                - {formatVND(surcharge)}
              </span>
            </div>
            <div className="my-3 border-t border-dashed border-slate-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Thành tiền
              </span>
              <span className="text-lg font-bold text-slate-900">
                {formatVND(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <ResetButton title="Hủy" onClick={onClose} />
          <ButtonCommon title="Xác nhận" onClick={handleSubmit} />
        </div>
      </div>
    </div>,
    document.body
  );
}

function PriceOptionItem({
  id,
  checked,
  onChange,
  label,
  value,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  value: number;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors ${
        checked
          ? "border-slate-900 bg-slate-50"
          : "border-slate-200 hover:bg-slate-50"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-slate-900"
        />
        <span className="text-slate-700">{label}</span>
      </span>
      <span className="font-medium text-slate-900">{formatVND(value)}</span>
    </label>
  );
}