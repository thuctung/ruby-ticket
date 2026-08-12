import jsPDF from "jspdf";
import { SendTicketInSystemMailType } from "@/app-controler/affi/getTicket/type";
import { getFontBase64, getFontBoldBase64, getImage } from "./loadFont";
import { getFontBase64Client, getFontBold64Client } from "./ticket";

const MARGIN = 6;

const NOTES = [
  "Quý khách vui lòng bảo mật vé.Vé đã mua không thể hoàn hủy và chỉ có giá trị sử dụng 1 lần.",
  "Mẫu e-voucher phải giữ nguyên định dạng của Ruby Travel. Mọi thay đổi và chỉnh sửa đều không được chấp nhận để sử dụng dịch vụ.",
  "Vui lòng đến quầy vé Công viên và trình vé điện tử đã mua để đổi vé vào cửa.",
];

export const generateBookingVoucherClient = async (data: SendTicketInSystemMailType) => {
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

  const fontBase64 = await getFontBase64Client();
  const fontBold = await getFontBold64Client();

  pdf.addFileToVFS("Roboto-Regular.ttf", fontBase64);
  pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");

  pdf.addFileToVFS("Roboto-Bold.ttf", fontBold);
  pdf.addFont("Roboto-Bold.ttf", "Roboto", "bold");

  // Load logos
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

  //FULLNAME
  if (data.fullName) {
    y += 14;
    pdf.setTextColor(...RED_LABEL);
    pdf.setFont("Roboto", "normal");
    pdf.text("Tên khách hàng:", leftX, y);
    pdf.setTextColor(...TEXT_DARK);
    pdf.setFont("Roboto", "bold");
    pdf.text(data.fullName || "", leftX + 57, y);
  }

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

  y += 12;
  const qtyColumnWidth = 40;
  const qtyX = rightX;
  const nameColumnWidth = rightX - leftX - qtyColumnWidth;
  // Content
  pdf.setFontSize(9);
  pdf.setTextColor(...TEXT_DARK);
  pdf.setFont("Roboto", "bold");
  data.listTicket.forEach((item) => {
    const ticketLines = pdf.splitTextToSize(item.name || "", nameColumnWidth);

    const lineHeight = 5;
    const rowHeight = Math.max(ticketLines.length * lineHeight, lineHeight);

    pdf.text(ticketLines, leftX, y);

    pdf.text(`x${item.quantity}`, qtyX, y + 2, {
      align: "right",
    });

    // Đường kẻ
    const dividerY = y + rowHeight;

    pdf.setDrawColor(220);
    pdf.setLineWidth(0.2);
    pdf.setLineDashPattern([1, 1], 0);
    pdf.line(leftX, dividerY, rightX, dividerY);

    // Sang dòng tiếp theo
    y += rowHeight + 12;
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

  pdf.save(`NUITHANTAI-${data.orderCode}-${data.dateUse}.pdf`);
};
