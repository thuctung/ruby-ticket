"use client";

import { useState } from "react";
import { CustomerErrors } from "./customer";
import { useTranslation } from "@/lib/i18n/client";
import { useCartStore } from "@/stores/useCartStore";
import { CustomerInfoType } from "@/app-controler/buy-ticket/type";

type Props = {
  errors: CustomerErrors;
  showAllErrors: boolean;
};

const inputBase =
  "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2";

export function CustomerForm({ errors, showAllErrors }: Props) {
  const { t } = useTranslation();
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerInfoType, boolean>>>({});

  const { customerInfo, setCustomerInfo } = useCartStore((s) => s);

  const fields: {
    key: keyof CustomerInfoType;
    label: string;
    placeholder: string;
    type: string;
    autoComplete: string;
    inputMode?: "email" | "tel" | "text";
    wide?: boolean;
  }[] = [
    {
      key: "fullname",
      label: t("cart.full_name"),
      placeholder: "Nguyễn Văn A",
      type: "text",
      autoComplete: "fullname",
      wide: true,
    },
    {
      key: "email",
      label: t("cart.email"),
      placeholder: "ban@email.com",
      type: "email",
      autoComplete: "email",
      inputMode: "email",
    },
    {
      key: "phone",
      label: t("cart.phone_number"),
      placeholder: "0912 345 678",
      type: "tel",
      autoComplete: "tel",
      inputMode: "tel",
    },
  ];

  return (
    <div className="rounded-2xl bg-white shadow-[0_12px_32px_-16px_rgba(28,91,65,0.35)] ring-1 ring-slate-900/5 p-5">
      <h2 className="text-base font-bold text-slate-900">{t("cart.contact_information")}</h2>
      <p className="mt-1 text-sm text-slate-500">{t("cart.ticket_delivery_notice")}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const error = (touched[f.key] || showAllErrors) && errors[f.key];
          const id = `customer-${f.key}`;
          return (
            <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
              <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
                {f.label}
              </label>
              <input
                id={id}
                name={f.key}
                type={f.type}
                inputMode={f.inputMode}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                value={customerInfo[f.key]}
                onChange={(e) => setCustomerInfo({ ...customerInfo, [f.key]: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, [f.key]: true }))}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`${inputBase} ${
                  error
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:border-[#1c5b41] focus:ring-[#1c5b41]/20"
                }`}
              />
              {error && (
                <p id={`${id}-error`} className="mt-1.5 text-sm text-red-500">
                  {t(error)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
