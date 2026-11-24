"use client";

import { useState } from "react";
import { Tag, X, Check } from "lucide-react";
import { Coupon } from "../types";
import { formatVND } from "@/lib/money";
import { useTranslation } from "@/lib/i18n/client";

type Props = {
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  couponError: string;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
};

export function OrderSummary({
  subtotal,
  discount,
  total,
  appliedCoupon,
  couponError,
  onApplyCoupon,
  onRemoveCoupon,
}: Props) {
  const [code, setCode] = useState("");
  const { t } = useTranslation();

  const handleCheck = () => {
    if (!code.trim()) return;
    onApplyCoupon(code.trim());
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-bold text-slate-900">{t("cart.order_summary")}</h2>

      {/* Coupon */}
      <div>
        <label htmlFor="coupon" className="mb-1.5 block text-sm font-medium text-slate-700">
          {t("cart.discount_code")}
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-xl bg-[#1c5b41]/10 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm text-[#1c5b41]">
              <Check className="h-4 w-4" />
              <span className="font-semibold">{appliedCoupon.code}</span>
              <span className="text-[#1c5b41]/70">· {appliedCoupon.label}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onRemoveCoupon();
                setCode("");
              }}
              aria-label="Bỏ mã giảm giá"
              className="rounded-full p-1 text-[#1c5b41] hover:bg-[#1c5b41]/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="coupon"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder={t("cart.enter_code")}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#1c5b41] focus:ring-2 focus:ring-[#1c5b41]/20"
              />
            </div>
            <button
              type="button"
              onClick={handleCheck}
              disabled={!code.trim()}
              className="rounded-xl bg-[#1c5b41] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#164a35] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("cart.apply")}
            </button>
          </div>
        )}
        {couponError && <p className="mt-1.5 text-sm text-red-500">{couponError}</p>}
      </div>

      {/* Totals */}
      <dl className="space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between text-slate-600">
          <dt> {t("cart.subtotal")}</dt>
          <dd className="tabular-nums">{formatVND(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-slate-600">
          <dt> {t("cart.discount")}</dt>
          <dd className={`tabular-nums ${discount > 0 ? "text-[#1c5b41]" : ""}`}>
            {discount > 0 ? `- ${formatVND(discount)}` : formatVND(0)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
          <dt className="font-bold text-slate-900">{t("cart.total")}</dt>
          <dd className="text-xl font-extrabold text-[#fe9614] tabular-nums">{formatVND(total)}</dd>
        </div>
      </dl>
    </div>
  );
}
