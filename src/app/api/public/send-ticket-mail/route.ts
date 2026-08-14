import { Resend } from "resend";
import { env } from "@/lib/env";
import { downloadTicketPDFServer } from "@/helpers/ticket-server";
import { SendTicketMailType } from "@/app-controler/checkout-client/type";

const resend = new Resend(env.SEND_MAIL_KEY);

export async function POST(req: Request) {
  const { email, customerTickets, focTickets, orderCode, siteName }: SendTicketMailType =
    await req.json();

  const pdfBuffer = await downloadTicketPDFServer(customerTickets, focTickets);

  await resend.emails.send({
    from: "Ruby Travel System<noreply@rubytraveldanang.com>",
    to: email,
    subject: `Đặt vé ${siteName}  ${orderCode}`,
    html: `
          <p>
            Cảm ơn bạn đã đặt vé tại <strong>Ruby Travel</strong>.
            Đơn hàng của bạn đã được ghi nhận thành công.
          </p>

          <p>
            <strong>Mã đơn hàng:</strong> ${orderCode}<br />
          </p>
         <p style="margin-top: 24px;">
                  Vé điện tử được đính kèm trong email này. Vui lòng xuất trình mã khi sử dụng dịch vụ. </p> <p> Nếu cần hỗ trợ, vui lòng liên hệ bộ phận chăm sóc khách hàng: 0705 551 668.
            </p>
            <p> Trân trọng,<br /> Ruby Travel </p>
    `,
    attachments: [
      {
        filename: `${orderCode}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  return new Response("ok", { status: 200 });
}
