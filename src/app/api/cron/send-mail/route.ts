import { NextResponse } from "next/server";
import { sendMailTicketBaNa } from "@/axios/resendMail";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";
import { downloadTicketPDFServer } from "@/helpers/ticket-server";
import { getTicketFOCAndCutomer } from "@/app-controler/checkout-client/contants";
import { MailQueueType } from "@/types/send-mail";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from(DB_TABLE_NAME.EMAIL_QUEUE)
      .select("*")
      .eq("status", "pending")
      .lt("retry_count", 3)
      .order("created_at", {
        ascending: true,
      })
      .limit(2);
    if (error) {
      throw error;
    }

    if (!data?.length) {
      return NextResponse.json({
        success: true,
        message: "No pending emails",
      });
    }
    const mails: MailQueueType[] = data;

    let successCount = 0;
    let failedCount = 0;
    for (const mail of mails) {
      try {
        await supabaseAdmin
          .from(DB_TABLE_NAME.EMAIL_QUEUE)
          .update({
            status: "processing",
            processing_at: new Date().toISOString(),
          })
          .eq("id", mail.id);

        const { data }: any = await supabaseAdmin
          .from(DB_TABLE_NAME.TICKETS)
          .select("*")
          .eq("orderId", mail.order_id);
        const { customerTickets, focTickets } = getTicketFOCAndCutomer(data);
        const pdfBuffer = await downloadTicketPDFServer(
          customerTickets,
          mail.is_send_foc ? focTickets : []
        );

        // Send Resend
        await sendMailTicketBaNa({
          mail: mail.email,
          siteName: mail.site_name,
          orderCode: mail.order_code,
          fileAttch: pdfBuffer,
        });

        await supabaseAdmin
          .from(DB_TABLE_NAME.EMAIL_QUEUE)
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            error_message: null,
          })
          .eq("id", mail.id);

        await supabaseAdmin.from(DB_TABLE_NAME.TICKETS).delete().eq("orderId", mail.order_id);
        successCount++;
      } catch (error) {
        failedCount++;
        await supabaseAdmin
          .from(DB_TABLE_NAME.EMAIL_QUEUE)
          .update({
            status: "pending",
            retry_count: (mail.retry_count || 0) + 1,
            error_message: error instanceof Error ? error.message : String(error),
          })
          .eq("id", mail.id);
      }
    }

    return NextResponse.json({
      success: true,
      total: mails.length,
      successCount,
      failedCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Cron failed",
      },
      {
        status: 500,
      }
    );
  }
}
