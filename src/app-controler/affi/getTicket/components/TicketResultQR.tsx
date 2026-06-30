"use client";

import { jsPDF } from "jspdf";
import QRCodePDF from "qrcode";
import { getFontBase64 } from "./getFont";
import { TicketResultQRType } from "@/types/ticket";
import dayjs from "dayjs";
import { FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import TicketCard from "./TicketCard";
import { GUIDES } from "./constants";
import { formatVND } from "@/helpers/money";

type TicketResultQRProps = {
  tickets: TicketResultQRType[];
  onClose: () => void;
  location: string;
};
export default function TicketResultQR({ tickets, onClose, location }: TicketResultQRProps) {
  const { showConfirm }: CommonType | any = useCommonStore.getState();

  const downloadPDF = async () => {
    const PAGE_W = 220;
    const PAGE_H = 420;

    const pdf = new jsPDF({
      unit: "px",
      format: [PAGE_W, PAGE_H],
    });

    const fontBase64 = await getFontBase64();
    pdf.addFileToVFS("Roboto.ttf", fontBase64);
    pdf.addFont("Roboto.ttf", "Roboto", "normal");
    pdf.addFont("Roboto.ttf", "Roboto", "bold");
    pdf.setFont("Roboto");

    // Load logos
    const rubyLogo = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "/logo.png";
    });

    const sunWorldLogo = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "/sunworldbana.png";
    });

    // Colors dùng xuyên suốt (theo đúng mẫu thiết kế)
    const RED_BRIGHT = [200, 20, 24] as const; // dải tiêu đề / nút "Mã vé" / footer
    const RED_DARK = [120, 14, 14] as const; // badge "Mã đơn hàng"
    const RED_LABEL = [180, 20, 24] as const; // chữ label màu đỏ
    const TEXT_DARK = [40, 30, 30] as const;
    const TEXT_GUIDE = [70, 55, 55] as const;

    for (let i = 0; i < tickets.length; i++) {
      if (i > 0) pdf.addPage();

      const t = tickets[i];
      let y = 14;

      // Khung viền ngoài bo góc
      pdf.setDrawColor(225, 190, 190);
      pdf.setLineWidth(1);
      pdf.roundedRect(8, 8, PAGE_W - 16, PAGE_H - 16, 10, 10);

      // ===== HEADER: 2 logo =====
      pdf.addImage(sunWorldLogo, "PNG", 18, y, 70, 22);
      pdf.addImage(rubyLogo, "PNG", PAGE_W - 50, y, 32, 24);

      y += 34;

      // ===== TITLE BAR (đỏ) =====
      pdf.setFillColor(...RED_BRIGHT);
      pdf.rect(8, y, PAGE_W - 16, 26, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont("Roboto", "bold");
      pdf.text(t.ticket_name, PAGE_W / 2, y + 17, { align: "center" });

      y += 26 + 16;

      // ===== MÃ / ORDER NO. =====
      pdf.setTextColor(...RED_LABEL);
      pdf.setFont("Roboto", "bold");
      pdf.setFontSize(7);
      pdf.text("MÃ / ORDER NO.", 18, y);

      y += 6;

      pdf.setFillColor(...RED_DARK);
      pdf.roundedRect(18, y, 100, 18, 4, 4, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("Roboto", "bold");
      pdf.setFontSize(10);
      pdf.text(String(t.order_id || "34324324234"), 18 + 50, y + 12, { align: "center" });

      y += 30;

      // ===== NGÀY SỬ DỤNG / GIÁ TIỀN =====
      pdf.setTextColor(...RED_LABEL);
      pdf.setFont("Roboto", "normal");
      pdf.setFontSize(7);
      pdf.text("NGÀY SỬ DỤNG / VALID DATE", 18, y);
      pdf.text("GIÁ TIỀN / PRICE", PAGE_W - 18, y, { align: "right" });

      y += 13;

      pdf.setTextColor(...TEXT_DARK);
      pdf.setFont("Roboto", "bold");
      pdf.setFontSize(11);
      pdf.text(t.dateUse || "", 18, y);

      pdf.setTextColor(...RED_DARK);
      pdf.setFontSize(14);
      pdf.text(formatVND(t.price || 1000000), PAGE_W - 18, y, { align: "right" });

      y += 18;

      // ===== QR BOX =====
      const qrBoxH = 96;
      pdf.setDrawColor(...RED_BRIGHT);
      pdf.setLineWidth(1.2);
      pdf.roundedRect(18, y, PAGE_W - 36, qrBoxH, 8, 8);

      const qr = await QRCodePDF.toDataURL(t.ticket_code);
      pdf.addImage(qr, "PNG", 20, y + 10, 80, 80);

      pdf.setTextColor(...RED_LABEL);
      pdf.setFont("Roboto", "normal");
      pdf.setFontSize(7);
      pdf.text("SỐ / SERIAL", 104, y + 22);

      pdf.setTextColor(...TEXT_DARK);
      pdf.setFont("Roboto", "bold");
      pdf.setFontSize(11);
      pdf.text(`${i + 1}/${tickets.length}`, 104, y + 34);

      pdf.setFillColor(...RED_BRIGHT);
      pdf.roundedRect(104, y + 46, PAGE_W - 36 - 96, 28, 5, 5, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("Roboto", "normal");
      pdf.setFontSize(6);
      pdf.text("MÃ VÉ / CODE", 104 + (PAGE_W - 36 - 96) / 2, y + 57, {
        align: "center",
      });
      pdf.setFont("Roboto", "bold");
      pdf.setFontSize(9);
      pdf.text(t.ticket_code, 104 + (PAGE_W - 36 - 96) / 2, y + 68, {
        align: "center",
      });

      y += qrBoxH + 18;

      // ===== HƯỚNG DẪN / INSTRUCTIONS =====
      pdf.setTextColor(...RED_LABEL);
      pdf.setFont("Roboto", "bold");
      pdf.setFontSize(8);
      pdf.text("HƯỚNG DẪN / INSTRUCTIONS", 18, y);

      y += 10;

      pdf.setTextColor(...TEXT_GUIDE);
      pdf.setFont("Roboto", "normal");
      pdf.setFontSize(4.6);

      GUIDES.forEach((g) => {
        const lines = pdf.splitTextToSize(`${g}`, PAGE_W - 36);
        pdf.text(lines, 18, y);
        y += lines.length * 5.2 + 3;
      });

      // ===== FOOTER =====
      const r = 10;
      pdf.setFillColor(...RED_BRIGHT);
      pdf.roundedRect(8, PAGE_H - 34, PAGE_W - 16, 26, r, r, "F");
      pdf.rect(8, PAGE_H - 34, PAGE_W - 16, r, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("Roboto", "bold");
      pdf.setFontSize(9);
      pdf.text("RUBY TRAVEL", PAGE_W / 2 - 28, PAGE_H - 18, { align: "center" });

      pdf.setFont("Roboto", "normal");
      pdf.setFontSize(6);
      pdf.text("·  Hotline: 0705 551 668", PAGE_W / 2 + 36, PAGE_H - 18, {
        align: "center",
      });
    }

    pdf.save(`ve-banahills-${dayjs(new Date()).format(FULL_DATE_FORMAT)}.pdf`);
  };

  const handleClose = () => {
    showConfirm({
      message: "Đã tải vé về ?",
      okFunc: () => {
        onClose();
      },
    });
  };

  if (!tickets?.length) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[420px] max-h-[80vh] flex flex-col">
        {/* HEADER */}
        <div className="p-4 border-b text-center font-bold">Cảm ơn bạn đã mua vé!</div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-4">
          {tickets.map((t, i) => (
            <TicketCard key={i} ticketItem={t} />
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex gap-2">
          <button onClick={downloadPDF} className="flex-1 bg-blue-500 text-white py-2 rounded">
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
