"use client";

import { TicketResultQRType } from "@/types/ticket";
import QRCode from "react-qr-code";
import { GUIDES, NOTES } from "./constants";
import Image from "next/image";

export default function TicketCard({ t }: { t: TicketResultQRType }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white font-sans shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <Image
          src="/sunworldbana.png"
          alt="Sunworld"
          width={120}
          height={30}
          className="object-contain"
        />

        <Image
          src="/rubytravel.jpg"
          alt="Ruby Travel"
          width={50}
          height={50}
          className="object-contain"
        />
      </div>

      {/* TITLE */}
      <div className="border-b border-gray-300 bg-gray-100 px-3 py-2 text-center text-[13px] font-bold">
        NGƯỜI LỚN NGOÀI TỈNH_VÉ CÁP TREO
      </div>

      {/* QR + INFO */}
      <div className="flex gap-3 px-4 py-3">
        <QRCode value={t.ticket_code} size={110} />

        <div className="flex-1 text-[11px] leading-[1.8]">
          <div className="text-[10px] text-gray-400">Ngày sử dụng/ Use date:</div>
          <div className="font-semibold">{t.dateUse ?? "—"}</div>

          <div className="mt-1 text-[10px] text-gray-400">Giờ/Hours:</div>
          <div>08:00–22:00</div>

          <div className="mt-1 text-[10px] text-gray-400">Giá/Price:</div>
          <div className="font-bold text-[#CC1F1F]">{t.price ?? "1.000.000 VND"}</div>
        </div>
      </div>

      {/* MÃ VÉ */}
      <div className="border-t border-gray-200 px-4 py-2 text-[10px] leading-[1.9] text-gray-600">
        <div>Order: {t.order_id ?? "—"}</div>
        <div>Mã đơn/OrderId: {t.ticket_code}</div>
        <div>STT/No: {t.order_id ?? "—"}</div>
      </div>

      {/* DIVIDER */}
      <div className="border-t-[1.5px] border-dashed border-gray-300" />

      {/* HƯỚNG DẪN */}
      <div className="px-4 py-2">
        <div className="mb-1 bg-gray-100 px-2 py-1 text-[10px] font-bold">
          HƯỚNG DẪN SỬ DỤNG/USER GUIDE:
        </div>

        {GUIDES.map((g, idx) => (
          <div key={idx} className="text-[9px] leading-[1.6] text-gray-700">
            {g}
          </div>
        ))}
      </div>

      {/* LƯU Ý */}
      <div className="px-4 pb-2 pt-1">
        <div className="mb-1 bg-gray-100 px-2 py-1 text-[10px] font-bold">LƯU Ý/NOTE:</div>

        {NOTES.map((n, idx) => (
          <div key={idx} className="text-[9px] leading-[1.6] text-gray-700">
            {n}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex items-center gap-2.5 border-t border-gray-200 px-4 py-2.5">
        <Image src="/rubytravel.jpg" alt="Ruby" width={36} height={36} className="object-contain" />

        <div>
          <div className="text-[13px] font-bold text-[#CC1F1F]">RUBY TRAVEL</div>
          <div className="text-[10px] text-gray-600">Tel: 0705 551 668</div>
        </div>

        <div className="ml-auto text-right text-[9px] text-gray-400">{t.ticket_name}</div>
      </div>
    </div>
  );
}
