import { NextResponse } from "next/server";
import sunWorldApi from "@/axios/sunworldApi";
import { TicketResultQRType } from "@/types/ticket";
import { rebuildDataTicket } from "@/helpers/ticket";
import { PayloadGetTicketSunType } from "@/app-controler/checkout-client/type";
import { getTicketFOCAndCutomer } from "@/app-controler/checkout-client/contants";
import { downloadTicketPDFServer } from "@/helpers/ticket-server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { KEY_MODIFY_DATA } from "@/app-controler/affi/stats/contants";
import { get } from "lodash";

export async function POST(req: Request) {
  try {
    const { productSelected, orderCode, dateUse, orderId, customerEmail }: PayloadGetTicketSunType =
      await req.json();
    const { data }: any = await sunWorldApi.post(`/ota/booking/confirm`, { orderCode });
    const { result, messages, success } = data;

    if (success) {
      await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_COMPLETE_ORDER_CUSTOMER, {
        p_order_id: orderId,
        p_provider_order_code: orderCode,
        p_tickets: [],
        p_reference_code: result.referenceCode,
      });

      const ticketBuild: TicketResultQRType[] | any = rebuildDataTicket(
        result,
        orderId,
        dateUse,
        productSelected
      );
      const siteName = get(ticketBuild, [0, "siteName"]) || "";

      const { customerTickets } = getTicketFOCAndCutomer(ticketBuild);

      try {
        const pdfBuffer = await downloadTicketPDFServer(customerTickets, []);

        const filePath = `email-vouchers/${orderCode}.pdf`;

        await Promise.allSettled([
          supabaseAdmin.storage
            .from(DB_TABLE_NAME.STORAGE_EMAIL_VOUCHERS)
            .upload(filePath, pdfBuffer, {
              contentType: "application/pdf",
              upsert: true,
            }),
          supabaseAdmin.from(DB_TABLE_NAME.EMAIL_QUEUE).insert({
            email: customerEmail,
            site_name: siteName,
            order_code: result.orderCode,
            file_path: filePath,
            status: KEY_MODIFY_DATA.PENDING,
          }),
        ]);
      } catch (e) {
        await supabaseAdmin.from(DB_TABLE_NAME.EMAIL_QUEUE).insert({
          email: customerEmail,
          site_name: siteName,
          order_code: result.orderCode,
          file_path: "",
          status: KEY_MODIFY_DATA.FAILED,
        });
      }

      return NextResponse.json({ data: customerTickets, messages: "" }, { status: 200 });
    } else {
      const message = messages?.[0] || "Lỗi từ xuất vé khách lẻ";
      await supabaseAdmin
        .from(DB_TABLE_NAME.ORDERS)
        .update({
          status: KEY_MODIFY_DATA.ERROR,
          description: message,
        })
        .eq("id", orderId);
      return NextResponse.json({ data: [], messages: message }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
