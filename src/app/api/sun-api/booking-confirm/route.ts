import { NextResponse } from "next/server";
import sunWorldApi from "@/axios/sunworldApi";
import { TicketResultQRType } from "@/types/ticket";
import { rebuildDataTicket } from "@/helpers/ticket";
import { PayloadGetTicketSunType } from "@/app-controler/checkout-client/type";
import { getTicketFOCAndCutomer } from "@/app-controler/checkout-client/contants";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { KEY_MODIFY_DATA } from "@/app-controler/affi/stats/contants";
import { get } from "lodash";
import { updateOrderError } from "@/helpers/update-status-order";

export async function POST(req: Request) {
  const { productSelected, orderCode, dateUse, orderId, customerEmail }: PayloadGetTicketSunType =
    await req.json();
  try {
    const { data }: any = await sunWorldApi.post(`/ota/booking/confirm`, { orderCode });
    const { result, messages, success } = data;

    if (success) {
      const { data: dataSaveOrder, error } = await supabaseAdmin.rpc(
        DB_TABLE_NAME.FUNC_COMPLETE_ORDER_CUSTOMER,
        {
          p_order_id: orderId,
          p_provider_order_code: orderCode,
          p_tickets: [],
          p_reference_code: result.referenceCode,
        }
      );

      if (dataSaveOrder) {
        const ticketBuild: TicketResultQRType[] | any = rebuildDataTicket(
          result,
          orderId,
          dateUse,
          productSelected
        );
        const siteName = get(ticketBuild, [0, "siteName"]) || "";
        const { customerTickets } = getTicketFOCAndCutomer(ticketBuild);

        await Promise.allSettled([
          supabaseAdmin.from(DB_TABLE_NAME.TICKETS).insert(ticketBuild).select(),
          supabaseAdmin.from(DB_TABLE_NAME.EMAIL_QUEUE).insert({
            email: customerEmail,
            order_id: orderId,
            site_name: siteName,
            order_code: result.orderCode,
            status: KEY_MODIFY_DATA.PENDING,
            is_send_foc: false,
          }),
        ]);
        return NextResponse.json({ data: customerTickets, messages: "" }, { status: 200 });
      } else {
        // LỖI TỪ DATABASE LƯU ORDER
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
        await updateOrderError(orderId, `DATABASE-${errorMessage}`, result.orderCode);
        return NextResponse.json(
          {
            data: { focTickets: [], customerTickets: [] },
            messages: "Lỗi khi tạo thông tin vé. Vui lòng liên hệ hỗ trợ",
          },
          { status: 200 }
        );
      }
    } else {
      const resMess = messages?.[0] || "Lỗi khi tạo vé";
      await updateOrderError(orderId, `SUNWORLD-${resMess}`);
      return NextResponse.json(
        { data: { focTickets: [], customerTickets: [] }, messages: resMess },
        { status: 200 }
      );
    }
  } catch (e) {
    // LỖI CỦA FUNCION
    const errorMessage = e instanceof Error ? e.message : JSON.stringify(e);
    await updateOrderError(orderId, `INSYSTEM-${errorMessage}`);
    return NextResponse.json(e, { status: 500 });
  }
}
