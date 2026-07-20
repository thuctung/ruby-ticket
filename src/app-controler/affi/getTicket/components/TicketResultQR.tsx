"use client";

import { TicketResultQRType } from "@/types/ticket";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import TicketCard from "./TicketCard";
import { downloadTicketPDF } from "@/helpers/ticket";
import FOCTicketCard from "./FOCTicket";

type TicketResultQRProps = {
  tickets: TicketResultQRType[];
  onClose: () => void;
  location: string;
};

export default function TicketResultQR({ tickets, onClose, location }: TicketResultQRProps) {
  const { showConfirm }: CommonType | any = useCommonStore.getState();

  const handleClose = () => {
    showConfirm({
      message: "Đã tải vé về ?",
      okFunc: () => {
        onClose();
      },
    });
  };

  const focTicket = tickets?.filter((item) => item.verifyCode) || [];

  const finNalTicket = tickets?.filter((item) => !item.verifyCode) || [];

  if (!tickets?.length) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[420px] max-h-[80vh] flex flex-col">
        {/* HEADER */}
        <div className="p-4 border-b text-center font-bold">Cảm ơn bạn đã mua vé!</div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-4">
          {finNalTicket.map((t, i) => (
            <TicketCard key={i} ticketItem={t} currentIndex={i} total={finNalTicket.length} />
          ))}

          {focTicket.map((t, i) => (
            <FOCTicketCard key={i} ticketItem={t} currentIndex={i} total={finNalTicket.length} />
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex gap-2">
          <button
            onClick={() => downloadTicketPDF(finNalTicket, focTicket)}
            className="flex-1 bg-blue-500 text-white py-2 rounded"
          >
            Tải vé (PDF)
          </button>

          <button onClick={handleClose} className="flex-1 bg-gray-300 py-2 rounded">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
