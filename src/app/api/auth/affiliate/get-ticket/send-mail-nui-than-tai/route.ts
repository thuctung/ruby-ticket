import { Resend } from "resend";
import { env } from "@/lib/env";
import { SendTicketInSystemMailType } from "@/app-controler/affi/getTicket/type";
import { generateBookingVoucher } from "@/helpers/e-voucher";

const resend = new Resend(env.SEND_MAIL_KEY);
const adminMail = env.SEND_MAIL_ADMIN;
export async function POST(req: Request) {
  const body: SendTicketInSystemMailType = await req.json();
  const { email, listTicket, phone, dateUse, orderCode, paymentCode, fullName } = body;
  const pdfBuffer = await generateBookingVoucher(body);

  const toMail = ["sales2@nuithantai.vn", "sales7@nuithantai.vn", adminMail];
  if (email !== adminMail) {
    toMail.push(email);
  }

  await resend.emails.send({
    from: "Ruby Travel System<noreply@rubytraveldanang.com>",
    to: toMail,
    subject: `Đặt vé Núi Thần Tài-${orderCode}, Ngày ${dateUse}`,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
         <h2 style="color: #d32f2f;">Xác nhận đặt vé thành công</h2>
          <p> Cảm ơn bạn đã đặt vé. Đơn hàng của bạn đã được ghi nhận với thông tin như sau: </p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
             <tbody>
                <tr>
                   <td style="padding: 8px; font-weight: bold; width: 180px;">Mã đơn hàng</td>
                    <td style="padding: 8px;">${orderCode}</td>
                </tr>
                <tr>
                   <td style="padding: 8px; font-weight: bold; width: 180px;">Ngày sử dụng</td>
                    <td style="padding: 8px;">${dateUse}</td>
                </tr>
                ${
                  paymentCode
                    ? ` <tr>
                          <td style="padding: 8px; font-weight: bold;">Mã thanh toán:</td>
                          <td style="padding: 8px;">${paymentCode}</td>
                        </tr>`
                    : ""
                }
                ${
                  fullName
                    ? ` <tr>
                            <td style="padding: 8px; font-weight: bold;">Tên khách hàng</td>
                            <td style="padding: 8px;">${fullName}</td>
                        </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Email</td>
                  <td style="padding: 8px;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Số điện thoại</td>
                   <td style="padding: 8px;">${phone}</td>\
                </tr>
              </tbody>
            </table>
            <h3>Danh sách sản phẩm</h3>
            <table style=" width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #ddd; " >
              <thead>
                <tr style="background-color: #f5f5f5;">
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;"> Sản phẩm </th>
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: center;"> Số lượng </th>
                </tr>
              </thead>
                <tbody>
                 ${listTicket
                   .map(
                     (item) => `
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"> ${item.name} </td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;"> ${item.quantity} </td>
                  </tr> `
                   )
                   .join("")}
              </tbody>
            </table>
            <p style="margin-top: 24px;">
                  Vé điện tử được đính kèm trong email này. Vui lòng xuất trình mã khi sử dụng dịch vụ. </p> <p> Nếu cần hỗ trợ, vui lòng liên hệ bộ phận chăm sóc khách hàng: 0705 551 668.
            </p>
            <p> Trân trọng,<br /> Ruby Travel </p>
       </div>
    `,
    attachments: [
      {
        filename: `NUI_THAN_TAI_${orderCode}_${dateUse}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  return Response.json({
    success: true,
    pdf: Buffer.from(pdfBuffer).toString("base64"),
  });
}
