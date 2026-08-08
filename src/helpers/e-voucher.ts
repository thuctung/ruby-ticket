/**
 * generateBookingVoucher.ts
 * -----------------------------------------------------------------------
 * Template tạo PDF phiếu đặt dịch vụ (booking voucher) bằng jsPDF,
 * dùng cho Next.js (chạy phía client - "use client").
 *
 * Cài đặt:
 *   npm install jspdf
 *
 * Cách dùng (trong 1 component/page Next.js):
 *
 *   "use client";
 *   import { generateBookingVoucher } from "@/lib/generateBookingVoucher";
 *

 *
 * -----------------------------------------------------------------------
 */

import jsPDF from "jspdf";
import { getFontBase64Client, getFontBold64Client } from "./ticket";
import { SendTicketInSystemMailType, TicketInSystem } from "@/app-controler/affi/getTicket/type";

export interface NoteLine {
  vi: string;
  en?: string;
}

export interface BookingVoucherData {
  orderCode: string;
  parkName: string;
  packageName: string;
  nationality: string;
  nationalityEn?: string;
  date: string;
  leadTraveler: string;
  phone?: string;
  note?: string;
  adults: number;
  kids: number;
  openingHours: string;
  openingHoursEn?: string;
  bungalowNote?: string;
  buffetTime?: string;
  buffetTimeEn?: string;
  importantNotes: NoteLine[];
  includes: NoteLine[];
  hotline: string;
  email: string;
  /** Optional logo images as base64 dataURL (PNG/JPEG) */
  logoLeft?: string;
  logoRight?: string;
  listTicket: TicketInSystem[];
}

// ------------------------------------------------------------------------
// Layout constants (mm, A4-ish narrow voucher width)
// ------------------------------------------------------------------------
const PAGE_WIDTH = 105; // narrow receipt-like width, change to 210 for full A4
const MARGIN = 6;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  text: [255, 255, 255] as [number, number, number],
  subtext: [90, 90, 90] as [number, number, number],
  border: [180, 180, 180] as [number, number, number],
  headerBg: [235, 245, 235] as [number, number, number],
  highlightBg: [255, 235, 59] as [number, number, number],
  bullet: [200, 30, 30] as [number, number, number],
};

function addWrappedText(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 4.2
): number {
  const lines = pdf.splitTextToSize(text, maxWidth);
  pdf.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function drawDivider(pdf: jsPDF, y: number): number {
  pdf.setDrawColor(...COLORS.border);
  pdf.setLineWidth(0.2);
  pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  return y + 4;
}

const NOTES = [
  "Quý khách vui lòng bảo mật vé.Vé đã mua không thể hoàn hủy và chỉ có giá trị sử dụng 1 lần.",
  "Mẫu e-voucher phải giữ nguyên định dạng của Ruby Travel. Mọi thay đổi và chỉnh sửa đều không được chấp nhận để sử dụng dịch vụ.",
  "Vui lòng đến quầy vé Công viên và trình vé điện tử đã mua để đổi vé vào cửa.",
];

export const generateBookingVoucher = async (data: SendTicketInSystemMailType) => {
  const PAGE_W = 250;
  const PAGE_H = 300 + data.listTicket.length * 20;
  const RED_LABEL = [180, 20, 24] as const;
  const TEXT_DARK = [40, 30, 30] as const;
  const TEXT_GUIDE = [70, 55, 55] as const;

  const pdf = new jsPDF({
    unit: "px",
    format: [PAGE_W, PAGE_H],
  });

  pdf.setDrawColor(225, 190, 190);
  pdf.setLineWidth(1);
  pdf.roundedRect(8, 8, PAGE_W - 16, PAGE_H - 16, 10, 10);

  const rubyLogo = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "/logo.png";
  });

  const thanTaiLogo = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "/nuithantai/logo.webp";
  });

  const fontBase64 = await getFontBase64Client();
  const fontBold = await getFontBold64Client();
  pdf.addFileToVFS("Roboto-Regular.ttf", fontBase64);
  pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");

  pdf.addFileToVFS("Roboto-Bold.ttf", fontBold);
  pdf.addFont("Roboto-Bold.ttf", "Roboto", "bold");

  pdf.setFont("Roboto", "bold");

  let y = MARGIN + 15;
  pdf.addImage(thanTaiLogo, "WEBP", 18, y, 70, 22);
  pdf.addImage(rubyLogo, "PNG", PAGE_W - 50, y, 32, 24);

  y += 30;

  pdf.setFont("Roboto", "bold");
  pdf.setFontSize(14);
  const titleLines = pdf.splitTextToSize("Công Viên Núi Thần Tài", PAGE_W - 40);
  const lineHeight = 13;
  const titleBarPadding = 8;
  const titleBarH = titleLines.length * lineHeight + titleBarPadding * 2 - 4;

  pdf.setTextColor(0, 0, 0);
  titleLines.forEach((line: string, idx: number) => {
    pdf.text(line, PAGE_W / 2, y + titleBarPadding + 6 + idx * lineHeight, {
      align: "center",
    });
  });

  y += titleBarH + 10;
  const leftX = 18;
  const rightX = PAGE_W - 18;

  pdf.setFontSize(10);
  pdf.setTextColor(...RED_LABEL);

  // MÃ VÉ - NGÀY SỬ DỤNG
  pdf.setTextColor(...RED_LABEL);
  pdf.setFont("Roboto", "normal");
  pdf.text("Mã vé: ", leftX, y);
  pdf.text("Ngày sử dụng: ", rightX - 41, y, { align: "right" });

  pdf.setTextColor(...TEXT_DARK);
  pdf.setFont("Roboto", "bold");
  pdf.text(data.orderCode, leftX + 24, y);
  pdf.text(data.dateUse, rightX, y, { align: "right" });

  y += 14;
  //EMAIL
  pdf.setTextColor(...RED_LABEL);
  pdf.setFont("Roboto", "normal");
  pdf.text("Email: ", leftX, y);
  pdf.setTextColor(...TEXT_DARK);
  pdf.setFont("Roboto", "bold");
  pdf.text(process.env.NEXT_PUBLIC_EMAIL_COMPANY || "", leftX + 23, y);
  y += 14;
  // SDT
  pdf.setTextColor(...RED_LABEL);
  pdf.setFont("Roboto", "normal");
  pdf.text("Số điện thoại: ", leftX, y);
  pdf.setTextColor(...TEXT_DARK);
  pdf.setFont("Roboto", "bold");
  pdf.text(data.phone || "", leftX + 48, y);

  y += 20;
  //Thông tin vé
  pdf.setFontSize(14);
  pdf.text("Thông tin vé", leftX, y);

  y += 15;
  pdf.setFontSize(10);
  pdf.setTextColor(...RED_LABEL);
  pdf.setFont("Roboto", "normal");
  pdf.text("Tên vé: ", leftX, y);
  pdf.text("Số lượng", rightX, y, { align: "right" });

  pdf.setTextColor(...TEXT_DARK);
  pdf.setFont("Roboto", "bold");
  y += 14;
  data.listTicket.forEach((item) => {
    pdf.text(item.name, leftX, y);
    pdf.text(`x${String(item.quantity)}`, rightX - 20, y, { align: "left" });

    pdf.setDrawColor(180);
    pdf.setLineWidth(0.3);
    pdf.setLineDashPattern([1, 1], 0);
    pdf.line(leftX, y + 4, rightX, y + 4);
    y += 18;
  });
  pdf.setLineDashPattern([], 0);

  //LƯU Ý
  y += 10;
  pdf.setFontSize(14);
  pdf.text("Lưu Ý", leftX, y);
  y += 15;

  const funcRenderTexts = (texts: string[] | any) => {
    if (texts?.length) {
      pdf.setFont("Roboto", "normal");
      pdf.setTextColor(...TEXT_GUIDE);
      pdf.setFontSize(8);
      pdf.setLineHeightFactor(1.5);
      texts?.forEach((g: string, index: number) => {
        const lines = pdf.splitTextToSize(`- ${g}`, PAGE_W - 36);
        pdf.text(lines, 18, y);
        const dimensions = pdf.getTextDimensions(lines);
        y += dimensions.h + 5;
      });
    }
  };
  funcRenderTexts(NOTES);

  // ===== FOOTER =====
  const r = 2;
  pdf.setFillColor(...RED_LABEL);
  // pdf.roundedRect(8, PAGE_H - 34, PAGE_W - 16, 26, r, r, "F");
  pdf.rect(8, PAGE_H - 44, PAGE_W - 16, r, "F");
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("Roboto", "normal");
  pdf.setFontSize(12);
  pdf.text("RUBY TRAVEL", PAGE_W / 2 - 28, PAGE_H - 22, { align: "center" });

  pdf.setFont("Roboto", "normal");
  pdf.setFontSize(9);
  pdf.text("·  Hotline: 0705 551 668", PAGE_W / 2 + 36, PAGE_H - 22, {
    align: "center",
  });

  pdf.save(`voucher-${data.orderCode}.pdf`);
  return pdf;
};
