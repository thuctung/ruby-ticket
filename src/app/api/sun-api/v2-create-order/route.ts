import { NextResponse } from "next/server";
import sunWorldApi from "@/axios/sunworldApi";
import { CreateOrderSunGroupPayload } from "@/app-controler/affi/getTicket/type";
import { TicketResultQRType } from "@/types/ticket";
import { rebuildDataTicket } from "@/helpers/ticket";
import { DB_TABLE_NAME } from "@/commons/constant";
import { getTicketFOCAndCutomer } from "@/app-controler/checkout-client/contants";
import { supabaseAdmin } from "@/lib/supabase/server";
import { downloadTicketPDFServer } from "@/helpers/ticket-server";

import { KEY_MODIFY_DATA } from "@/app-controler/affi/stats/contants";
import { get } from "lodash";

export async function POST(req: Request) {
  try {
    const body: CreateOrderSunGroupPayload = await req.json();

    const { date_use, order_id, thirdPartyNumber, products, email, phone, fullname } = body;

    const { data }: any = await sunWorldApi.post(`/v2/order/create`, {
      thirdPartyNumber,
      products,
      email,
      phone,
      fullname,
    });
    const { result, messages, success } = data;

    if (!success) {
      const resMess = messages?.[0] || "Lỗi khi tạo vé";
      await supabaseAdmin
        .from(DB_TABLE_NAME.ORDERS)
        .update({
          status: KEY_MODIFY_DATA.ERROR,
          description: resMess,
        })
        .eq("id", order_id);
      return NextResponse.json({ data: [], messages: resMess }, { status: 200 });
    } else if (result) {
      const ticketBuild: TicketResultQRType[] | any = rebuildDataTicket(
        result,
        order_id,
        date_use,
        products
      );
      const siteName = get(ticketBuild, [0, "siteName"]) || "";
      const { focTickets, customerTickets } = getTicketFOCAndCutomer(ticketBuild);

      await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_COMPLETE_ORDER, {
        p_order_id: order_id,
        p_provider_order_code: result.orderCode,
        p_tickets: ticketBuild,
        p_reference_code: result.referenceCode,
      });

      const pdfBuffer = await downloadTicketPDFServer(customerTickets, focTickets);
      const filePath = `email-vouchers/${result.orderCode}.pdf`;

      await supabaseAdmin.storage
        .from(DB_TABLE_NAME.STORAGE_EMAIL_VOUCHERS)
        .upload(filePath, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      await supabaseAdmin.from(DB_TABLE_NAME.EMAIL_QUEUE).insert({
        email: email,
        site_name: siteName,
        order_code: result.orderCode,
        file_path: filePath,
        status: KEY_MODIFY_DATA.PENDING,
      });

      return NextResponse.json(
        { data: { focTickets, customerTickets }, messages: "" },
        { status: 200 }
      );
    }
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
