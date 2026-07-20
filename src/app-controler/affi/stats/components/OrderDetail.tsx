"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { OrderDetailType } from "@/types";
import { getOrdeTicketDetail } from "../api";
import { TicketResultQRType } from "@/types/ticket";
import { downloadTicketPDF, rebuildDataTicket } from "@/helpers/ticket";
import { KEY_MODIFY_DATA } from "../contants";

export interface OrderTicketItem {
  id: string | number;
  name: string; // tên vé
  quantity: number; // số lượng
  price: number; // giá tiền / vé
}

export interface OrderDetailDialogProps {
  open: boolean;
  onClose: () => void;
  orderDetails: OrderDetailType[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export default function OrderDetailDialog({ open, onClose, orderDetails }: OrderDetailDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const total = orderDetails.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleDownloadTicket = async () => {
    const data = await getOrdeTicketDetail(orderDetails[0].order_code);
    const result: TicketResultQRType[] | any = rebuildDataTicket(
      data,
      "",
      orderDetails[0].date_use
    );
    const focTicket = result?.filter((item: TicketResultQRType) => item.verifyCode) || [];
    const finNalTicket = result?.filter((item: TicketResultQRType) => !item.verifyCode) || [];
    downloadTicketPDF(finNalTicket, focTicket);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-dialog-title"
    >
      <div
        ref={panelRef}
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#C81418] to-[#8C0E11] px-8 py-5">
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-3 top-3 rounded-full p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-[11px] font-medium uppercase tracking-wide text-white/70">
            Chi tiết đơn hàng
          </p>
        </div>

        {/* Table */}
        <div className="max-h-96 overflow-y-auto px-8 pt-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-red-700/70">
                <th className="pb-3 font-semibold">Tên vé</th>
                <th className="pb-3 pl-6 text-center font-semibold">SL</th>
                <th className="pb-3 pl-6 text-center font-semibold">Ngày dùng</th>
                <th className="pb-3 pl-6 text-right font-semibold">Giá tiền</th>
                <th className="pb-3 pl-6 text-right font-semibold">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orderDetails.map((item) => (
                <tr key={item.id} className="text-gray-700">
                  <td className="py-3 pr-4 font-medium text-gray-800">{item.product_name}</td>
                  <td className="py-3 pl-6 text-center">{item.quantity}</td>
                  <td className="py-3 pl-6 text-center">{item.date_use}</td>
                  <td className="py-3 pl-6 text-right tabular-nums whitespace-nowrap">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-3 pl-6 text-right font-semibold tabular-nums text-gray-900 whitespace-nowrap">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Tổng cộng */}
        <div className="mx-8 mt-4 flex items-center justify-between rounded-xl bg-red-50 px-5 py-3.5">
          <span className="text-sm font-medium text-red-800">Tổng cộng</span>
          <span className="text-lg font-bold text-[#8C0E11] tabular-nums">
            {formatCurrency(total)}
          </span>
        </div>

        <div className="flex justify-end gap-2 px-8 py-5">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Đóng
          </button>
          {orderDetails[0].status === KEY_MODIFY_DATA.SUCCESSS ? (
            <button
              onClick={handleDownloadTicket}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-white    font-medium text-gray-600 transition bg-[#C81418] "
            >
              Tải vé
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
