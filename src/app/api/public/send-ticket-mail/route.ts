import { SendTicketMailType } from "@/app-controler/checkout-client/type";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { downloadTicketPDFServer } from "@/helpers/ticket-server";

const resend = new Resend(env.SEND_MAIL_KEY);

export async function POST(req: Request) {
  const { email, customerTickets, focTickets, orderCode }: SendTicketMailType = await req.json();

  const pdfBuffer = await downloadTicketPDFServer(customerTickets, focTickets);

  await resend.emails.send({
    from: "Ruby Travel System<noreply@rubytraveldanang.com>",
    to: email,
    subject: `Vé ${orderCode}`,
    html: `
      <p>Cảm ơn bạn đã đặt vé.</p>
      <p>Mã đơn hàng: ${orderCode}</p>
    `,
    attachments: [
      {
        filename: `${orderCode}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${orderCode}.pdf`,
    },
  });
}
