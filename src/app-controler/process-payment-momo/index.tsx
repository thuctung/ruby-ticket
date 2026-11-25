"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OrderType } from "@/types";
import { updatePaymentStatus } from "@/app-controler/process-payment-momo/apis";

import { claimOrder, getOrderItem } from "./apis";
import { getTicketForCustomer, PRODUCT_SELECTED_LOCALE } from "../cart/helper";
import { useTranslation } from "@/lib/i18n/client";
import { STATUS_COMMON_TYPE } from "@/commons/constant";

type Props = { orderCode: string; amount: number };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ProcessPaymentMomo({ orderCode, amount }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const started = useRef<string | null>(null);

  const [text, setText] = useState(t("momoPayment.confirmingPayment"));

  useEffect(() => {
    // Chống chạy lại khi component re-render
    if (started.current === orderCode) return;
    started.current = orderCode;

    let cancelled = false;
    const fail = async (reason: string) => {
      if (cancelled) return;
      await updatePaymentStatus({ orderCode, message: reason, status: STATUS_COMMON_TYPE.ERROR });
      router.replace(`/order-failed?reason=${encodeURIComponent(reason)}`);
    };

    const success = (order: OrderType) => {
      if (cancelled) return;
      router.replace(`/order-success/${order.third_party_number}`);
    };

    const run = async () => {
      try {
        setText(t("momoPayment.checkingOrder"));

        // 1. Lấy thông tin đơn hàng
        let order = await getOrderItem(orderCode);

        if (!order) {
          return fail("not_found");
        }
        debugger;

        // 2. Kiểm tra số tiền
        if (Number(order.total_amount) !== Number(amount)) {
          return fail("amount_mismatch");
        }

        // 3. Đơn hàng đã hoàn thành
        if (
          order.status_payment === STATUS_COMMON_TYPE.SUCCESS &&
          order.status === STATUS_COMMON_TYPE.SUCCESS
        ) {
          return success(order);
        }

        // 4. Update thanh toán thành công
        await updatePaymentStatus({
          orderCode,
          message: "Thanh toán thành công",
          status: STATUS_COMMON_TYPE.SUCCESS,
        });

        // 5. Claim đơn hàng - chỉ một request được quyền tạo vé
        setText(t("momoPayment.orderProcessing"));

        const { claimed } = await claimOrder(orderCode);

        if (cancelled) return;

        // 6. Nếu không claim được, có request khác đang xử lý
        if (!claimed) {
          for (let i = 0; i < 15; i++) {
            await sleep(2000);

            if (cancelled) return;

            order = await getOrderItem(orderCode);

            if (!order) {
              return fail("not_found");
            }

            if (
              order.status_payment === STATUS_COMMON_TYPE.SUCCESS &&
              order.status === STATUS_COMMON_TYPE.SUCCESS
            ) {
              return success(order);
            }

            if (
              order.status_payment === STATUS_COMMON_TYPE.FAILED ||
              order.status_payment === STATUS_COMMON_TYPE.ERROR
            ) {
              return fail("payment_failed");
            }
          }

          return fail("processing");
        }

        // 7. Đã claim thành công -> tiến hành tạo vé
        setText(t("momoPayment.creatingTicket"));

        const productSelected = localStorage.getItem(PRODUCT_SELECTED_LOCALE);

        if (!productSelected) {
          return fail("product_not_found");
        }

        const products = JSON.parse(productSelected);

        if (!Array.isArray(products) || products.length === 0) {
          return fail("product_invalid");
        }

        const currentOrderData = {
          orderCode: order.order_code,
          orderId: order.id,
          dateUse: order.order_items?.[0]?.date_use,
        };

        if (!currentOrderData.dateUse) {
          return fail("invalid_order_data");
        }

        // 8. Gọi API tạo vé
        const dataGetTicket = await getTicketForCustomer({
          currentOrderData,
          productSelected: products,
          email: order.user_email,
          route: router,
          showLoading: false,
          callback: () => {
            localStorage.removeItem(PRODUCT_SELECTED_LOCALE);
            return success(order);
          },
        });
        if (!dataGetTicket) {
          return fail("ticket_processing");
        }
      } catch (error) {
        fail("error");
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [orderCode, amount, router]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-4 text-center">
      <svg
        className="size-12 animate-spin text-blue-600"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-20"
        />
        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div>
        <p className="text-lg font-bold text-slate-900">{text}</p>
        <p className="mt-1 text-sm text-slate-500">{t("momoPayment.doNotClosePage")}</p>
      </div>
    </main>
  );
}
