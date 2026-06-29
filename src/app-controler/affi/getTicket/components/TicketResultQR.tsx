"use client";

import { jsPDF } from "jspdf";
import QRCodePDF from "qrcode";
import QRCode from "react-qr-code";
import { getFontBase64 } from "./getFont";
import { TicketResultQRType } from "@/types/ticket";
import dayjs from "dayjs";
import { FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import TicketCard from "./TicketCard";
import { GUIDES, NOTES } from "./constants";

type TicketResultQRProps = {
  tickets: TicketResultQRType[];
  onClose: () => void;
  location: string;
};
export default function TicketResultQR({ tickets, onClose, location }: TicketResultQRProps) {
  const { showConfirm }: CommonType | any = useCommonStore.getState();

  const downloadPDF = async () => {
    const PAGE_W = 400;
    const PAGE_H = 780;

    const pdf = new jsPDF({
      unit: "px",
      format: [PAGE_W, PAGE_H],
    });

    const fontBase64 = await getFontBase64();
    pdf.addFileToVFS("Roboto.ttf", fontBase64);
    pdf.addFont("Roboto.ttf", "Roboto", "normal");
    pdf.setFont("Roboto");

    // Load Ruby logo
    const rubyLogo = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "/rubytravel.jpg";
    });

    const sunWorldLogo = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "/sunworldbana.png";
    });

    for (let i = 0; i < tickets.length; i++) {
      const t = tickets[i];
      if (i > 0) pdf.addPage([PAGE_W, PAGE_H]);

      let y = 0;

      pdf.addImage(sunWorldLogo, "PNG", 5, 10, 150, 50);

      pdf.addImage(rubyLogo, "JPEG", 340, y, 59, 50);

      y = 60;

      // ===== TIÊU ĐỀ VÉ =====
      pdf.setFillColor(240, 240, 240);
      pdf.rect(0, y, PAGE_W, 36, "F");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(13);
      pdf.text("NGƯỜI LỚN NGOÀI TỈNH_VÉ CÁP TREO", PAGE_W / 2, y + 22, { align: "center" });

      y += 36;

      // ===== VÙNG QR + THÔNG TIN =====
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(0, y, PAGE_W, y);

      // QR code bên trái
      const qr = await QRCodePDF.toDataURL(t.ticket_code);
      pdf.addImage(qr, "PNG", 12, y + 8, 100, 100);

      // Thông tin ngày/giờ/giá bên phải QR
      const infoX = 125;
      let infoY = y + 20;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);

      pdf.text("Ngày sử dụng/ Use date:", infoX, infoY);
      infoY += 13;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(t.dateUse || "29/06/2026 - 05/07/2026", infoX, infoY);

      infoY += 16;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Giờ/Hours:", infoX, infoY);
      infoY += 13;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text("08:00-22:00", infoX, infoY);

      infoY += 16;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Giá/Price:", infoX, infoY);
      infoY += 13;
      pdf.setFontSize(11);
      pdf.setTextColor(220, 30, 30);
      pdf.text(t.price?.toString() || "1.000.000 VND", infoX, infoY);

      y += 118;

      // ===== MÃ VÉ =====
      pdf.setDrawColor(200, 200, 200);
      pdf.line(0, y, PAGE_W, y);
      y += 10;

      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Order: ${t.order_id || "27097050"}`, 16, y + 10);
      pdf.text(`Mã đơn/OrderId: ${t.ticket_code || "BHT0K3EC"}`, 16, y + 22);
      pdf.text(`STT/No: ${i + 1}/${tickets.length}`, 16, y + 34);
      y += 46;

      // ===== DIVIDER răng cưa =====
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(1);
      pdf.setLineDashPattern([4, 3], 0);
      pdf.line(0, y, PAGE_W, y);
      pdf.setLineDashPattern([], 0);

      y += 10;

      // ===== HƯỚNG DẪN SỬ DỤNG =====
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, y, PAGE_W, 14, "F");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text("HƯỚNG DẪN SỬ DỤNG/USER GUIDE:", 16, y + 10);
      y += 25;

      pdf.setFontSize(8);
      pdf.setTextColor(40, 40, 40);
      GUIDES.forEach((line) => {
        const wrapped = pdf.splitTextToSize(line, PAGE_W - 24);
        pdf.text(wrapped, 16, y);
        y += wrapped.length * 10;
      });

      y += 4;

      // ===== LƯU Ý/NOTE =====
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, y, PAGE_W, 14, "F");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text("LƯU Ý/NOTE:", 16, y + 10);
      y += 25;

      pdf.setFontSize(8);
      pdf.setTextColor(40, 40, 40);
      NOTES.forEach((line) => {
        const wrapped = pdf.splitTextToSize(line, PAGE_W - 24);
        pdf.text(wrapped, 16, y);
        y += wrapped.length * 10 + 2;
      });

      y += 8;

      // ===== DIVIDER =====
      pdf.setDrawColor(200, 200, 200);
      pdf.line(16, y, PAGE_W - 16, y);
      y += 12;

      // ===== FOOTER - Ruby Travel =====
      // Ruby logo trái
      pdf.addImage(rubyLogo, "JPEG", 16, y, 36, 36);

      // Thông tin Ruby
      pdf.setFontSize(12);
      pdf.setTextColor(220, 30, 30);
      pdf.text("RUBY TRAVEL", 60, y + 14);
      pdf.setFontSize(9);
      pdf.setTextColor(50, 50, 50);
      pdf.text("Tel: 0705 551 668", 60, y + 26);

      // Tên vé bên phải footer
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(t.ticket_name || "", PAGE_W - 16, y + 20, { align: "right" });

      y += 12;
      // Số thứ tự vé
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.text(`${i + 1}/${tickets.length}`, PAGE_W - 16, PAGE_H - 12, { align: "right" });
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
            <TicketCard key={i} t={t} />
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
