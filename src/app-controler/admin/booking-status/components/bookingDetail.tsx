"use client";

import { useState } from "react";
import { formatVND } from "@/helpers/money";
import { downloadTicketPDF, rebuildDataTicket } from "@/helpers/ticket";
import { TicketReponseType, TicketResultQRType } from "@/types/ticket";
import { getTicketFOCAndCutomer } from "@/app-controler/checkout-client/contants";
import { get } from "lodash";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";

const STATUS_MAP = {
  cancelled: {
    label: "Đã huỷ",
    dot: "bg-rose-500",
    text: "text-rose-700",
    bg: "bg-rose-50",
    ring: "ring-rose-200",
  },
  success: {
    label: "Thành công",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
  },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status as keyof typeof STATUS_MAP] ?? STATUS_MAP.cancelled;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${s.bg} ${s.text} ${s.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function InfoField({ label, value, mono = true }: any) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={`truncate text-sm font-medium text-slate-800 ${mono ? "font-mono" : ""}`}
        title={value}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : "rotate-0"
      }`}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BookingDetailCard({ booking }: { booking: TicketReponseType }) {
  const [open, setOpen] = useState(false);

  const {
    orderCode,
    orderStatus,
    pnr,
    referenceCode,
    thirdPartyNumber,
    totalOrderPrice,
    items = [],
  } = booking;

  const handleDownloadFile = async () => {
    const date_use = get(booking, ["items", 0, "usageDate"]);
    const result: TicketResultQRType[] | any = rebuildDataTicket(
      booking,
      null,
      dayjs(date_use, SERVER_DATE_FORMAT).format(BASIC_DATE_FORMAT)
    );
    const { focTickets, customerTickets } = getTicketFOCAndCutomer(result);
    await downloadTicketPDF(customerTickets, focTickets);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <button
          onClick={handleDownloadFile}
          className="rounded-lg border border-gray-200 px-4 py-2 bg-green-200 text-sm font-medium text-green-600 transition hover:bg-green-300"
        >
          Tải vé
        </button>
      </div>

      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Mã đơn hàng</p>
          <p className="font-mono text-base font-semibold text-slate-900">{orderCode}</p>
        </div>
        <StatusBadge status={orderStatus} />
      </div>

      {/* Info grid */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 px-5">
        <InfoField label="Mã PNR" value={pnr} />
        <InfoField label="Reference code" value={referenceCode} />
        <InfoField label="Third-party code" value={thirdPartyNumber} />
        <InfoField label="Tổng tiền" value={formatVND(totalOrderPrice)} mono={false} />
      </div>

      {/* Perforated divider (ticket style) */}
      <div className="relative my-5 flex items-center px-5">
        <div className="-ml-8 h-4 w-4 rounded-full bg-slate-50" />
        <div className="flex-1 border-t border-dashed border-slate-300" />
        <div className="-mr-8 h-4 w-4 rounded-full bg-slate-50" />
      </div>

      {/* Toggle button */}
      <div className="px-5 pb-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.99]"
        >
          <span>Xem chi tiết sản phẩm ({items.length})</span>
          <ChevronIcon open={open} />
        </button>
      </div>

      {/* Collapsible product list */}
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="mx-5 mb-5 divide-y divide-slate-100 rounded-lg border border-slate-100">
            {items.length === 0 && (
              <li className="px-3.5 py-3 text-sm text-slate-400">Không có sản phẩm nào.</li>
            )}
            {items.map((p, index) => (
              <li key={index} className="flex items-center justify-between px-3.5 py-2.5 text-sm">
                <span className="text-slate-700">{p.productName}</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600">
                  x{p.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
