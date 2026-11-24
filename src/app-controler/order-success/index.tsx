"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { formatVND } from "@/lib/money";
import { OrderHistory } from "./type";
import { get } from "lodash";
import { useEffect } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useTranslation } from "@/lib/i18n/client";

type OrderSuccessControllerProps = {
  code: string;
  orders: OrderHistory[];
};

const getAmountAndQuantity = (orders: OrderHistory[]) => {
  let amount = 0,
    quantity = 0;
  if (orders) {
    orders.forEach((order) => {
      amount += order.total;
      quantity += order.quantity;
    }, 0);
  }

  return [amount, quantity];
};

export default function OrderSuccessController({ code, orders }: OrderSuccessControllerProps) {
  const { t } = useTranslation();
  const firstItem = get(orders, 0);
  const [totalAmount, totalTicket] = getAmountAndQuantity(orders);

  const { clear: clearCart } = useCartStore((s) => s);

  useEffect(() => {
    if (orders && orders.length) {
      clearCart();
    }
  }, [orders]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-stone-100 px-4 py-10 text-slate-900 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-amber-100 via-amber-50 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-40 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <div className="relative mx-auto max-w-3xl">
        <div className="mx-auto max-w-3xl">
          {orders && orders?.length ? (
            <>
              <header className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {t("cart.thank_you_booking")}
                </h1>
                <p className="mt-2 text-slate-600">
                  {t("cart.booking_time")}: {dayjs(firstItem?.created_at).format(FULL_DATE_FORMAT)}
                </p>
                <p className="mt-4 inline-block rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-slate-200">
                  {t("cart.order_code")}:{" "}
                  <span className="font-mono font-semibold">{firstItem?.order_code}</span>
                </p>
              </header>

              <section
                className="mt-8 flex items-start gap-3 rounded-xl bg-indigo-50 p-4 text-indigo-950 ring-1 ring-indigo-100"
                role="status"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                <p className="text-sm leading-relaxed">
                  {t("cart.ticket_sent_to")}
                  <strong> {firstItem?.user_email}</strong>. {t("cart.check_spam")}
                </p>
              </section>

              <section className="mt-10" aria-labelledby="tickets-title">
                <h2 id="tickets-title" className="text-lg font-semibold">
                  {t("cart.tickets_booked")} ({totalTicket})
                </h2>
                <ul className="mt-4 space-y-4">
                  {orders?.map((order, index) => (
                    <TicketCard key={index} order={order} t={t} />
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between rounded-xl bg-white px-5 py-4 ring-1 ring-slate-200">
                  <span className="text-slate-600">{t("cart.total_payment")} </span>
                  <span className="text-xl font-semibold">{formatVND(totalAmount)}</span>
                </div>
              </section>

              <footer className="mt-10 text-center">
                <p className="text-slate-600">{t("cart.booking_wishes")}</p>
                <Link
                  href="/"
                  className="mt-5 inline-flex rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                >
                  {t("cart.continue_exploring")}
                </Link>
              </footer>
            </>
          ) : (
            <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-amber-600">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5M8.5 8.5l5 5m0-5-5 5" />
                </svg>
              </div>
              <h1 className="mt-5 text-2xl font-semibold">{t("cart.order_not_found")}</h1>
              <p className="mx-auto mt-2 max-w-md text-slate-600">
                {code
                  ? `${t("cart.order_code")} “${code}” ${t("cart.check_order_code_email")}`
                  : t("cart.order_not_found")}
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                {t("cart.continue_exploring")}
              </Link>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-0.5 break-words font-medium">{value}</dd>
    </div>
  );
}

function TicketCard({ order, t }: { order: OrderHistory; t: Function }) {
  return (
    <li className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-amber-900/5 ring-1 ring-slate-200 transition-shadow hover:shadow-lg hover:shadow-amber-900/10 md:flex-row">
      {/* Dải màu mép vé */}
      <div
        aria-hidden="true"
        className="h-1.5 w-full shrink-0 bg-gradient-to-r from-amber-400 via-amber-300 to-indigo-400 md:h-auto md:w-2 md:bg-gradient-to-b"
      />

      {/* Thông tin chính */}
      <div className="relative flex-1 overflow-hidden p-5 sm:p-6">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 rotate-12 text-amber-100"
          fill="currentColor"
        >
          <path d="M3 9a2 2 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z" />
        </svg>

        <h3 className="relative max-w-[85%] text-lg font-semibold leading-snug text-slate-900">
          {order.product_name}
        </h3>

        <dl className="relative mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <Info
            label={t("cart.usage_date")}
            value={dayjs(order.date_use).format(BASIC_DATE_FORMAT)}
          />
          <Info label={t("cart.quantity")} value={order.quantity} />
          {order.status_payment && <Info label="Người sử dụng" value={order.status_payment} />}
        </dl>
      </div>

      {/* Cuống vé */}
      <div className="relative flex flex-col justify-between gap-4 border-t-2 border-dashed border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/60 p-5 md:w-52 md:border-l-2 md:border-t-0">
        <span
          aria-hidden="true"
          className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-stone-100 ring-1 ring-slate-200"
        />
        <span
          aria-hidden="true"
          className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full bg-stone-100 ring-1 ring-slate-200 md:-bottom-2.5 md:-left-2.5 md:right-auto md:top-auto"
        />

        <div className="flex items-end justify-between gap-4 md:flex-col md:items-start md:justify-start md:gap-3">
          <div>
            <p className="text-xs text-amber-900/70">{t("cart.ticket_price")}</p>
            <p className="text-xl font-bold tracking-tight text-slate-900">
              {formatVND(order.price)}
            </p>
          </div>
          <div className="text-right md:text-left">
            <p className="text-xs text-amber-900/70">{t("cart.total_amount")}</p>
            <p className="mt-0.5 inline-block rounded-md bg-amber-400 px-2 py-0.5 font-mono text-sm font-semibold text-slate-900">
              {formatVND(order.price * order.quantity)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
