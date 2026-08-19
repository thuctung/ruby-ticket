import { Resend } from "resend";
import { SendMailBaNaType } from "@/types/send-mail";

const resendMail = new Resend(process.env.SEND_MAIL_KEY);

export const sendMailTicketBaNa = async (payloadSendMailBaNa: SendMailBaNaType) => {
  const { mail, siteName, orderCode, fileAttch } = payloadSendMailBaNa;
  return await resendMail.emails.send({
    from: "Ruby Travel System<noreply@rubytraveldanang.com>",
    to: mail,
    subject: `Đặt vé ${siteName} ${orderCode}`,
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
        content: fileAttch,
      },
    ],
  });
};

export default resendMail;
