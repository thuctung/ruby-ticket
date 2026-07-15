"use client";

import { TicketResultQRType } from "@/types/ticket";
import QRCode from "react-qr-code";
import { GUIDES, LogoBySite } from "./constants";
import Image from "next/image";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, FULL_DATE_TIME_FORMAT } from "@/helpers/dateTime";

export default function TicketCard({
  ticketItem,
  currentIndex,
  total,
}: {
  ticketItem: TicketResultQRType;
  currentIndex: number;
  total: number;
}) {
  const logo = LogoBySite[ticketItem.siteCode as keyof typeof LogoBySite] ?? LogoBySite.HLS;
  return (
    <div className="mx-auto w-[380px] overflow-hidden rounded-2xl border border-red-100 bg-orange-50/60 mb-10">
      {/* Header: logos */}
      <div className="relative flex items-center justify-between  px-4 pb-3.5 pt-4 bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_-20%,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="z-10 flex h-[42px] items-center rounded-lg  px-2.5 ">
          <Image
            src={logo}
            alt="Sun World Ba Na Hills"
            width={120}
            height={36}
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="z-10 flex h-[42px] items-center rounded-lg  px-2.5 ">
          <Image
            src="/logo.png"
            alt="Ruby Travel"
            width={70}
            height={36}
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      {/* Title */}
      <div className="relative bg-gradient-to-b from-transparent to-black/5 px-3.5  pt-1.5 text-center text-white">
        <div className="bg-gradient-to-br bg-red-700 pb-3.5 pt-1.5 -mx-3.5 -mt-1.5 px-3.5">
          <p className="mt-2 text-lg font-extrabold uppercase tracking-wide leading-snug">
            {ticketItem.productName}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-4 pt-5">
        {/* Order code */}
        <div className="mb-3.5 flex justify-between">
          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-wider text-red-700">Mã đơn</p>
            <span className="mt-1 inline-block rounded-md bg-red-900 px-3.5 py-1.5 text-sm font-extrabold tracking-wide text-white">
              {ticketItem.orderCode}
            </span>
          </div>
          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-wider text-red-700">Order</p>
            <span className="mt-1 inline-block rounded-md bg-red-900 px-3.5 py-1.5 text-sm font-extrabold tracking-wide text-white">
              {ticketItem.pnr}
            </span>
          </div>
        </div>

        {/* Date + Price */}
        <div className="mb-3.5 flex gap-3.5">
          <div className="flex-1">
            <p className="text-[9.5px] font-bold uppercase tracking-wider text-red-700">
              Ngày sử dụng / Valid Date
            </p>
            <p className="mt-0.5 text-[15px] font-bold text-stone-900">
              {dayjs(ticketItem.validDateFrom, FULL_DATE_TIME_FORMAT).format(BASIC_DATE_FORMAT)} /{" "}
              {dayjs(ticketItem.validDateTo, FULL_DATE_TIME_FORMAT).format(BASIC_DATE_FORMAT)}
            </p>
          </div>
        </div>

        <div className="mb-4 h-px bg-red-100" />

        {/* QR + serial */}
        <div className="mb-4 flex items-center gap-4 rounded-xl border-2 border-red-700 bg-white p-3.5">
          <QRCode value={ticketItem.ticketNumber} size={110} />
          <div className="flex-1">
            <p className="text-[9.5px] font-bold uppercase tracking-wider text-red-700">
              Số / Serial
            </p>
            <p className="mt-0.5 text-sm font-extrabold tracking-wide text-stone-900">
              {`${currentIndex + 1} / ${total}`}
            </p>
            <div className="mt-2.5 rounded-md bg-red-700 px-2.5 py-1.5 text-center text-white">
              <p className="text-[8.5px] tracking-wider opacity-90">Media Code</p>
              <p className="mt-0.5 text-sm font-extrabold"> {ticketItem.ticketNumber}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <p className="mb-2 text-[10.5px] font-extrabold uppercase tracking-wider text-red-700">
            Hướng dẫn / Instructions
          </p>
          <ul className="space-y-1.5">
            {GUIDES.map((item, i) => (
              <li key={i} className="relative pl-3 text-[9.3px] leading-relaxed text-stone-700">
                <span className="absolute left-0 font-bold text-red-700">–</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-red-700 px-5 py-3.5 text-center text-white">
        <span className="text-[15px] font-extrabold tracking-wider">RUBY TRAVEL</span>
        <span className="mx-2 opacity-70">·</span>
        <span className="text-xs">Hotline: 0705 551 668</span>
      </div>
    </div>
  );
}
