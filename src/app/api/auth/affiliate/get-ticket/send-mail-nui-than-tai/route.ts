import { env } from "@/lib/env";
import { SendTicketInSystemMailType } from "@/app-controler/affi/getTicket/type";
import { generateBookingVoucher } from "@/helpers/e-voucher";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME, ERROR_MESSAGE, PHONE_ADMIN } from "@/commons/constant";
import { KEY_MODIFY_DATA } from "@/app-controler/affi/stats/contants";
import resendMail from "@/axios/resendMail";

const adminMail = env.SEND_MAIL_ADMIN;
export async function POST(req: Request) {
  const body: SendTicketInSystemMailType = await req.json();
  const {
    email,
    listTicket,
    phone,
    dateUse,
    orderCode,
    paymentCode,
    fullName,
    payloadUpdateBalance,
  } = body;
  try {
    const pdfBuffer: any = await generateBookingVoucher(body);
    const toMail = ["sales2@nuithantai.vn", "sales7@nuithantai.vn", adminMail];
    if (email !== adminMail) {
      toMail.push(email);
    }
    await resendMail.emails.send({
      from: "Ruby Travel System<noreply@rubytraveldanang.com>",
      to: toMail,
      subject: `Đặt vé Núi Thần Tài ${orderCode}, Ngày ${dateUse}`,
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
                  Vé điện tử được đính kèm trong email này. Vui lòng xuất trình mã khi sử dụng dịch vụ. </p> <p> Nếu cần hỗ trợ, vui lòng liên hệ bộ phận chăm sóc khách hàng: ${PHONE_ADMIN}.
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

    if (payloadUpdateBalance) {
      await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_UPDATE_ORDER_BALANCE, {
        p_order_id: payloadUpdateBalance.order_id,
        p_user_id: payloadUpdateBalance.user_id,
        p_balance: payloadUpdateBalance.balance,
        p_amount: payloadUpdateBalance.amount,
        p_status: payloadUpdateBalance.status,
        p_description: payloadUpdateBalance.description,
        p_ordercode: payloadUpdateBalance.orderCode,
      });
    }

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="evoucher.pdf"',
      },
    });
  } catch (e) {
    if (payloadUpdateBalance) {
      await supabaseAdmin
        .from(DB_TABLE_NAME.ORDERS)
        .update({
          status: KEY_MODIFY_DATA.ERROR,
          description: ERROR_MESSAGE.ERROR_SYSTEM_CREATE_TICKET,
        })
        .eq("id", payloadUpdateBalance.order_id);
    }
    return NextResponse.json(e, { status: 500 });
  }
}
