import { AdminSearchReport } from "@/types";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME, END_DATE_GMT7, START_DATE_GMT7 } from "@/commons/constant";
import * as XLSX from "xlsx";
import { dayjsEx, FULL_DATE_FORMAT } from "@/helpers/dateTime";

export async function POST(req: Request) {
  const { from, to, email, siteCode, full_name }: AdminSearchReport = await req.json();

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.VIEW_TICKET_SALE)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (email?.trim()) {
    query = query.like("user_email", `%${email.trim()}%`);
  }

  if (from) {
    query = query.gte("created_at", `${from}${START_DATE_GMT7}`);
  }
  if (siteCode) {
    query = query.eq("site_code", siteCode);
  }
  if (to) {
    query = query.lte("created_at", `${to}${END_DATE_GMT7}`);
  }
  query = query.eq("status", "success");

  const { data, error } = await query;

  if (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }

  const exportData = data.map((item) => ({
    "Mã đơn hàng": item.order_code,
    Email: item.user_email,
    "Tên đại lý": full_name,
    "Tên sản phẩm": item.product_name,
    "Số lượng": item.quantity,
    "Số tiền": item.total_amount,
    "Ngày mua": dayjsEx(item.created_at).format(FULL_DATE_FORMAT),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, full_name);

  const excelBuffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
  return new Response(excelBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=sales-report-${Date.now()}.xlsx`,
    },
  });
}
