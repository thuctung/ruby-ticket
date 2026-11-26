"use client";

import { QrCode, CreditCard, ShieldCheck } from "lucide-react";
import { CreatedOrder, PaymentMethodId } from "../types";
import { formatVND } from "@/lib/money";
import { useTranslation } from "@/lib/i18n/client";
import Image from "next/image";

const BANK = {
  id: process.env.NEXT_PUBLIC_BANK_ID ?? "VCB",
  account: process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "0123456789",
  name: process.env.NEXT_PUBLIC_BANK_NAME ?? "CONG TY ABC",
};

const METHODS: {
  id: PaymentMethodId;
  name: string;
  desc: string;
  icon: React.ReactNode;
  disable: boolean;
}[] = [
  {
    id: "qr",
    name: "cart.qr_payment",
    desc: "cart.supported_payment_apps",
    icon: <QrCode className="h-5 w-5" />,
    disable: false,
  },
  {
    id: "card",
    name: "cart.credit_debit_card",
    desc: "Visa, Mastercard, JCB",
    icon: <CreditCard className="h-5 w-5" />,
    disable: true,
  },
];

type Props = {
  value: PaymentMethodId | null;
  onChange: (id: PaymentMethodId) => void;
  order: CreatedOrder | null; // có sau khi server tạo đơn
};

export function PaymentMethods({ value, onChange, order }: Props) {
  const { t } = useTranslation();

  const qrUrl = order
    ? `https://img.vietqr.io/image/${BANK.id}-${BANK.account}-compact2.png` +
      `?amount=${order.amount}&addInfo=${encodeURIComponent(order.orderCode)}` +
      `&accountName=${encodeURIComponent(BANK.name)}`
    : null;

  return (
    <fieldset className="space-y-3 rounded-2xl bg-white shadow-[0_12px_32px_-16px_rgba(28,91,65,0.35)] ring-1 ring-slate-900/5 p-5">
      <legend className="sr-only">{t("cart.payment_method")}</legend>
      <h2 className="text-base font-bold text-slate-900">{t("cart.payment_method")}</h2>

      <div className="space-y-2">
        {METHODS.map((m) => {
          const selected = value === m.id;
          return (
            <div key={m.id}>
              <label
                className={`flex items-center gap-3 rounded-xl border p-3 transition-colors cursor-pointer ${
                  selected
                    ? "border-[#1c5b41] bg-[#1c5b41]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.id}
                  checked={selected}
                  disabled={m.disable}
                  onChange={() => onChange(m.id)}
                  className="sr-only"
                />
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    selected ? "bg-[#1c5b41] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {m.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900">{t(m.name)}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {m.disable ? t("cart.coming_soon") : t(m.desc)}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                    selected
                      ? "border-[#fe9614] bg-[#fe9614] ring-2 ring-inset ring-white"
                      : "border-slate-300"
                  }`}
                />
              </label>

              {/* Chuyển khoản QR: hiện QR + nội dung CK sau khi đã có mã đơn */}
              {selected && m.id === "qr" && (
                <div className="mt-2 rounded-xl bg-slate-50 p-4">
                  {order && qrUrl ? (
                    <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrUrl}
                        alt="Mã QR chuyển khoản"
                        className="h-36 w-36 shrink-0 rounded-lg bg-white"
                      />
                      <dl className="space-y-1 text-sm text-slate-600">
                        <div>
                          {t("cart.bank")}: <b>{BANK.id}</b>
                        </div>
                        <div>
                          {t("cart.account_number")}: <b>{BANK.account}</b>
                        </div>
                        <div>
                          {t("cart.amount")}: <b>{formatVND(order.amount)}</b>
                        </div>
                        <div>
                          {t("cart.transfer_description")}:
                          <b className="break-all text-[#1c5b41]">{order.orderCode}</b>
                        </div>
                        <p className="pt-1 text-xs text-slate-500">
                          {t("cart.keep_transfer_description")}
                        </p>
                      </dl>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">{t("cart.qr_payment_instruction")}</p>
                  )}
                </div>
              )}

              {/* Thẻ: không thu thông tin thẻ ở web mình, chuyển sang cổng thanh toán */}
              {selected && m.id === "card" && (
                <div className="mt-2 flex items-start gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1c5b41]" />
                  {t("cart.redirect_to_payment_gateway")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
