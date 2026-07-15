import { TYPE_TRANSACTION } from "@/commons/constant";
import { TableColumn } from "@/components/ui/customs/table";
import { dayjsEx } from "@/helpers/dateTime";
import { formatVND } from "@/helpers/money";
import { StatusType, TicketSalteResponseType } from "@/types";
import { TicketReponseType, TicketResultQRType } from "@/types/ticket";

import { jsPDF } from "jspdf";
import QRCodePDF from "qrcode";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, FULL_DATE_FORMAT, FULL_DATE_TIME_FORMAT } from "@/helpers/dateTime";
import { CommonType } from "@/types";
import { GUIDES, LogoBySite } from "@/app-controler/affi/getTicket/components/constants";

let cachedFontBase64: string | null = null;

export async function getFontBase64() {
  if (cachedFontBase64) return cachedFontBase64;

  const res = await fetch("/font/Roboto-Regular.ttf");
  const buffer = await res.arrayBuffer();

  // convert 1 lần duy nhất
  let binary = "";
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  cachedFontBase64 = btoa(binary);

  return cachedFontBase64;
}

export const downloadTicketPDF = async (tickets: TicketResultQRType[]) => {
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
  const logo = LogoBySite[tickets[0].siteCode as keyof typeof LogoBySite] ?? LogoBySite.HLS;

  const sunWorldLogo = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = logo;
  });

  // Colors dùng xuyên suốt (theo đúng mẫu thiết kế)
  const RED_BRIGHT = [200, 20, 24] as const; // dải tiêu đề / nút "Mã vé" / footer
  const RED_DARK = [120, 14, 14] as const; // badge "MÃ ĐƠN"
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

    // ===== TITLE BAR (đỏ) — hỗ trợ xuống dòng =====
    pdf.setFont("Roboto", "bold");
    pdf.setFontSize(11);
    const titleLines = pdf.splitTextToSize(t.productName, PAGE_W - 40);
    const lineHeight = 13;
    const titleBarPadding = 8;
    const titleBarH = titleLines.length * lineHeight + titleBarPadding * 2 - 4;

    pdf.setFillColor(...RED_BRIGHT);
    pdf.rect(8, y, PAGE_W - 16, titleBarH, "F");
    pdf.setTextColor(255, 255, 255);
    titleLines.forEach((line: string, idx: number) => {
      pdf.text(line, PAGE_W / 2, y + titleBarPadding + 6 + idx * lineHeight, {
        align: "center",
      });
    });

    y += titleBarH + 16;

    // ===== MÃ ĐƠN (trái) / ORDER (phải) =====
    const leftX = 18;
    const rightX = PAGE_W - 18;

    pdf.setTextColor(...RED_LABEL);
    pdf.setFont("Roboto", "bold");
    pdf.setFontSize(7);
    pdf.text("MÃ ĐƠN", leftX, y);
    pdf.text("ORDER", rightX - 50, y, { align: "right" });

    y += 6;

    pdf.setFillColor(...RED_DARK);
    pdf.roundedRect(leftX, y, 90, 18, 4, 4, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("Roboto", "bold");
    pdf.setFontSize(10);
    pdf.text(String(t.orderCode), leftX + 45, y + 12, { align: "center" });

    pdf.setFillColor(...RED_DARK);
    pdf.roundedRect(rightX - 70, y, 70, 18, 4, 4, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("Roboto", "bold");
    pdf.setTextColor("white");
    pdf.setFontSize(10);
    pdf.text(String(t.pnr), rightX - 10, y + 12, { align: "right" });

    y += 30;

    // ===== NGÀY SỬ DỤNG / VALID DATE
    pdf.setTextColor(...RED_LABEL);
    pdf.setFont("Roboto", "normal");
    pdf.setFontSize(7);
    pdf.text("Ngày sử dụng/ Use date", leftX, y);

    y += 13;

    pdf.setTextColor(...TEXT_DARK);
    pdf.setFont("Roboto", "bold");
    pdf.setFontSize(11);
    pdf.text(
      `${dayjs(t.validDateFrom, FULL_DATE_TIME_FORMAT).format(BASIC_DATE_FORMAT)}/${dayjs(t.validDateTo, FULL_DATE_TIME_FORMAT).format(BASIC_DATE_FORMAT)}` ||
        "",
      leftX,
      y
    );

    y += 18;

    // ===== QR BOX =====
    const qrBoxH = 96;
    pdf.setDrawColor(...RED_BRIGHT);
    pdf.setLineWidth(1.2);
    pdf.roundedRect(18, y, PAGE_W - 36, qrBoxH, 8, 8);

    const qr = await QRCodePDF.toDataURL(t.ticketNumber || t.productCode);
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
    pdf.text(t.ticketNumber, 104 + (PAGE_W - 36 - 96) / 2, y + 68, {
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
      const lines = pdf.splitTextToSize(`•  ${g}`, PAGE_W - 36);
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

export const rebuildDataTicket = (
  tickets: TicketReponseType,
  orderId: string,
  date_use: string
) => {
  const result: TicketResultQRType[] | any = tickets.items.flatMap((item) =>
    item.tickets.map((ticketChild) => ({
      productName: item.productName,
      productCode: item.productCode,
      siteCode: item.siteCode,
      unitPrice: item.unitPrice,
      productGroup: item.productGroup,
      isFaceIdRequired: item.isFaceIdRequired,

      ticketNumber: ticketChild.ticketNumber,
      validDateFrom: ticketChild.validDateFrom,
      validDateTo: ticketChild.validDateTo,
      status: ticketChild.status,
      verifyCode: ticketChild.verifyCode,
      orderCode: tickets.orderCode,
      orderId,
      date_use,
      pnr: tickets.pnr,
    }))
  );

  return result;
};
