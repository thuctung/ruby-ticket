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

/**
 * Ruby Travel palette (dùng arbitrary values của Tailwind):
 *  ruby       #9B1030  – màu thương hiệu chính
 *  ruby-deep  #5C0A1B  – nền panel, chữ nhấn
 *  ruby-soft  #F7DDE3  – viền, nền nhạt
 *  blush      #FDF4F6  – nền trang
 *  champagne  #F3DDB0  – điểm nhấn phụ (mã đơn, đường kẻ)
 */

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
    });
  }

  return [amount, quantity];
};

const primaryButton =
  "inline-flex items-center justify-center rounded-full bg-[#9B1030] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7E0C27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B1030]";

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

  if (!orders || !orders.length) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FDF4F6] px-4 py-16 text-[#2B0A12]">
        <section className="w-full max-w-md rounded-3xl border border-[#F7DDE3] bg-white p-8 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7DDE3] text-[#9B1030]">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5M8.5 8.5l5 5m0-5-5 5" />
            </svg>
          </div>
          <h1 className="mt-5 text-2xl font-semibold">{t("cart.order_not_found")}</h1>
          <p className="mt-2 text-[#6B3B46]">
            {code
              ? `${t("cart.order_code")} “${code}” ${t("cart.check_order_code_email")}`
              : t("cart.order_not_found")}
          </p>
          <Link href="/" className={`${primaryButton} mt-6`}>
            {t("cart.continue_exploring")}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-col bg-[#FDF4F6] text-[#2B0A12] lg:grid lg:h-[70dvh] lg:min-h-0 lg:grid-cols-2 lg:grid-rows-1 lg:overflow-hidden">
      <aside className="relative order-1 overflow-hidden bg-[#5C0A1B] px-6 py-10 text-white sm:px-10 lg:order-2 lg:flex lg:h-full lg:flex-col lg:justify-between lg:py-14">
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -bottom-16 -right-20 w-80 text-[#9B1030]"
          fill="currentColor"
        >
          <path d="M60 20h80l40 50-80 110L20 70z" opacity="0.55" />
          <path d="M60 20 100 70 140 20z" opacity="0.5" />
          <path d="M20 70h160L100 180z" opacity="0.35" />
        </svg>

        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3DDB0] text-[#5C0A1B]">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t("cart.thank_you_booking")}
          </h1>
          <p className="mt-3 text-sm text-white/70">
            {t("cart.booking_time")}: {dayjs(firstItem?.created_at).format(FULL_DATE_FORMAT)}
          </p>

          <div className="mt-8 border-y border-dashed border-[#F3DDB0]/40 py-5">
            <p className="text-sm text-white/70">{t("cart.order_code")}</p>
            <p className="mt-1 break-all font-mono text-2xl font-semibold text-[#F3DDB0]">
              {firstItem?.order_code}
            </p>
          </div>

          <div
            className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-white/85"
            role="status"
          >
            <svg
              viewBox="0 0 24 24"
              className="mt-0.5 h-5 w-5 shrink-0 text-[#F3DDB0]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <p>
              {t("cart.ticket_sent_to")}
              <strong className="break-all text-white"> {firstItem?.user_email}</strong>.{" "}
              {t("cart.check_spam")}
            </p>
          </div>
        </div>

        <div className="relative mt-10 lg:mt-0">
          <div className="flex items-end justify-between gap-4">
            <span className="text-sm text-white/70">{t("cart.total_payment")}</span>
            <span className="text-3xl font-semibold text-white">{formatVND(totalAmount)}</span>
          </div>
          <p className="mt-6 text-sm text-white/70">{t("cart.booking_wishes")}</p>
          <Link
            href="/"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#F3DDB0] px-6 py-3 text-sm font-semibold text-[#5C0A1B] transition-colors hover:bg-[#EBCF96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3DDB0]"
          >
            {t("cart.continue_exploring")}
          </Link>
        </div>
      </aside>

      <section
        className="order-2 px-4 py-10 sm:px-10 lg:order-1 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:py-14"
        aria-labelledby="tickets-title"
      >
        <div className="mx-auto max-w-2xl">
          <h2 id="tickets-title" className="text-xl font-semibold">
            {t("cart.tickets_booked")}{" "}
            <span className="ml-1 rounded-full bg-[#9B1030] px-2.5 py-0.5 text-sm font-medium text-white">
              {totalTicket}
            </span>
          </h2>

          <ul className="mt-6 space-y-5">
            {orders.map((order, index) => (
              <TicketCard key={index} order={order} t={t} />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs text-[#8A5A66]">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-medium">{value}</dd>
    </div>
  );
}

function TicketCard({ order, t }: { order: OrderHistory; t: Function }) {
  const usageDate = dayjs(order.date_use);

  return (
    <li className="relative flex overflow-hidden rounded-2xl border border-[#F0CBD3] bg-white sm:flex-row">
      {/* Khối ngày sử dụng: điểm nhấn của vé */}
      <div className="flex w-20 shrink-0 flex-col items-center justify-center bg-[#9B1030] px-2 py-5 text-white sm:w-28"></div>

      {/* Đường xé vé */}
      <div aria-hidden="true" className="relative w-0 border-l-2 border-dashed border-[#F3DDB0]">
        <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-[#FDF4F6] ring-1 ring-[#F0CBD3]" />
        <span className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-[#FDF4F6] ring-1 ring-[#F0CBD3]" />
      </div>

      {/* Nội dung vé */}
      <div className="min-w-0 flex-1 p-4 sm:p-5">
        <h3 className="text-base font-semibold leading-snug sm:text-lg">{order.product_name}</h3>

        <dl className="mt-3 grid grid-cols-2 gap-3">
          <Info label={t("cart.usage_date")} value={usageDate.format(BASIC_DATE_FORMAT)} />
          <Info label={t("cart.quantity")} value={order.quantity} />
        </dl>

        <div className="flex flex-wrap items-end justify-between gap-2 border-t border-[#F7DDE3] pt-3">
          <p className="text-sm text-[#8A5A66]">
            {t("cart.ticket_price")}:{" "}
            <span className="font-medium text-[#2B0A12]">{formatVND(order.price)}</span>
          </p>
          <p className="text-sm text-[#8A5A66]">
            {t("cart.total_amount")}:{" "}
            <span className="text-base font-semibold text-[#9B1030]">
              {formatVND(order.price * order.quantity)}
            </span>
          </p>
        </div>
      </div>
    </li>
  );
}
