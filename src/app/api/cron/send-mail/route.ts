import { NextResponse } from "next/server";
import { sendMailTicketBaNa } from "@/axios/resendMail";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { data: mails, error } = await supabaseAdmin
      .from("email_queue")
      .select("*")
      .eq("status", "pending")
      .lt("retry_count", 2)
      .order("created_at", {
        ascending: true,
      })
      .limit(10);

    if (error) {
      throw error;
    }

    if (!mails?.length) {
      return NextResponse.json({
        success: true,
        message: "No pending emails",
      });
    }

    let successCount = 0;
    let failedCount = 0;
    for (const mail of mails) {
      try {
        await supabaseAdmin
          .from("email_queue")
          .update({
            status: "processing",
            processing_at: new Date().toISOString(),
          })
          .eq("id", mail.id);

        const { data: pdfFile, error: downloadError } = await supabaseAdmin.storage
          .from("email-vouchers")
          .download(mail.file_path);

        if (downloadError || !pdfFile) {
          throw downloadError || new Error("PDF not found");
        }
        const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

        // Send Resend
        await sendMailTicketBaNa({
          mail: mail.email,
          siteName: mail.site_name,
          orderCode: mail.order_code,
          fileAttch: pdfBuffer,
        });

        await supabaseAdmin
          .from("email_queue")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            error_message: null,
          })
          .eq("id", mail.id);

        await supabaseAdmin.storage.from("email-vouchers").remove([mail.file_path]);
        successCount++;
      } catch (error) {
        failedCount++;
        await supabaseAdmin
          .from("email_queue")
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
