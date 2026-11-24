import { getTranslation } from "@/lib/i18n";
import Link from "next/link";

type Tone = "error" | "warning" | "info";

type Reason = {
  title: string;
  desc: string;
  tone: Tone;
  canRetry: boolean; // false = đã trả tiền hoặc đang xử lý, KHÔNG khuyến khích thanh toán lại
};
// Mã lỗi MoMo hay gặp. Đối chiếu thêm với bảng result code của MoMo.
const MOMO_CODES: Record<string, string> = {
  "1006": "momoPayment.momoCancelled",
  "1007": "momoPayment.cardBlocked",
  "1702": "momoPayment.invalidCardNumber",
  "1713": "momoPayment.cardRestricted",
  "4010": "momoPayment.otpFailed",
};

function getReason(reason?: string): Reason {
  switch (reason) {
    case "invalid":
      return {
        title: "momoPayment.transactionAuthenticationFailed",
        desc: "momoPayment.invalidPaymentResponse",
        tone: "warning",
        canRetry: true,
      };
    case "processing":
      return {
        title: "momoPayment.orderPendingTitle",
        desc: "momoPayment.orderPendingDescription",
        tone: "info",
        canRetry: false,
      };
    case "ticket":
      return {
        title: "momoPayment.ticketIssuanceFailedTitle",
        desc: "momoPayment.ticketIssuanceFailedDescription",
        tone: "warning",
        canRetry: false,
      };
    case "not_found":
      return {
        title: "momoPayment.orderNotFoundTitle",
        desc: "momoPayment.orderNotFoundDescription",
        tone: "error",
        canRetry: true,
      };
    case "amount_mismatch":
      return {
        title: "momoPayment.amountMismatchTitle",
        desc: "momoPayment.amountMismatchDescription",
        tone: "warning",
        canRetry: false,
      };
    case "error":
      return {
        title: "momoPayment.generalErrorTitle",
        desc: "momoPayment.generalErrorDescription",
        tone: "error",
        canRetry: false,
      };
    default: {
      // reason là mã lỗi MoMo (ví dụ "1006") hoặc không có
      const momoMsg = reason ? MOMO_CODES[reason] : undefined;
      return {
        title: "momoPayment.paymentFailedTitle",
        desc: momoMsg ?? "momoPayment.paymentFailedDescription",
        tone: "error",
        canRetry: true,
      };
    }
  }
}

const TONE: Record<Tone, { box: string; icon: React.ReactNode }> = {
  error: {
    box: "text-red-600 bg-red-50",
    icon: <path d="M6 6l12 12M18 6 6 18" />,
  },
  warning: {
    box: "text-amber-600 bg-amber-50",
    icon: <path d="M12 8v5m0 3h.01" />,
  },
  info: {
    box: "text-blue-600 bg-blue-50",
    icon: <path d="M12 7v5l3 2" />,
  },
};

export default async function OrderFailedPage({
  params,
  searchParams,
}: {
  params: Promise<{ lng: string }>;
  searchParams: Promise<{ reason?: string; orderCode?: string }>;
}) {
  const { lng } = await params;
  const { reason, orderCode } = await searchParams;
  const { t } = await getTranslation(lng);

  const info = getReason(reason);
  const tone = TONE[info.tone];

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl ring-1 ring-slate-900/5">
        <div
          className={`mx-auto mb-5 flex size-16 items-center justify-center rounded-full ${tone.box}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {tone.icon}
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{t(info.title)}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{t(info.desc)}</p>

        {orderCode && (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="text-slate-500">{t("momoPayment.orderCode")}</p>
            <p className="mt-0.5 break-all font-semibold text-slate-900">{orderCode}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {info.canRetry ? (
            <Link
              href={`/${lng}/cart`}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]"
            >
              {t("momoPayment.retryPayment")}
            </Link>
          ) : (
            <a
              href="mailto:support@your-domain.com"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]"
            >
              {t("momoPayment.contactSupport")}
            </a>
          )}

          <Link
            href={`/${lng}`}
            className="py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
          >
            {t("momoPayment.backToHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
