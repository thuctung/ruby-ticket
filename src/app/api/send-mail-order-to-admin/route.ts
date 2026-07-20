// app/api/send-ticket-email/route.ts

import { Resend } from "resend";
import { NextResponse } from "next/server";
import { formatVND } from "@/helpers/money";
import { env } from "@/lib/env";

const resend = new Resend(env.SEND_MAIL_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { phoneUser, tickets, paymentCode, totalAmount } = body;

    await resend.emails.send({
      from: "Ruby Travel System<rubytraveldanang.com>",
      to: "rubytraveldanang@gmail.com",
      subject: `Vé điện tử ${paymentCode}`,
      html: `
            <h2>Thông tin đặt vé</h2>

            <p>Số điện thoại: <strong>${phoneUser}</strong></p>

            <p>Mã thanh toán: <strong>${paymentCode}</strong></p>

            <p>Số tiền: <strong>${formatVND(totalAmount)}</strong></p>

            <table
                border="1"
                cellpadding="8"
                cellspacing="0"
                width="100%"
                style="border-collapse: collapse; margin-top: 16px;"
            >
                <thead>
                <tr>
                    <th>Tên vé</th>
                    <th>Số lượng</th>
                </tr>
                </thead>
                <tbody>
            ${tickets
              .map(
                (item: any, index: number) => `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${item.ticketName}</td>
                    <td align="center">${item.quantity}</td>
                    </tr>
                `
              )
              .join("")}
            </tbody>
        </table>
        `,
    });
    return NextResponse.json({
      success: true,
    });
  } catch (e) {
    return NextResponse.json({
      error: true,
    });
  }
}
