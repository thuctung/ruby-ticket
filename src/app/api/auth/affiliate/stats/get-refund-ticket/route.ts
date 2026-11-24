import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME, END_DATE_GMT7, START_DATE_GMT7 } from "@/commons/constant";
import { CountTicketSaleParamType } from "@/app-controler/affi/stats/type";

export async function POST(req: Request) {
  const body: CountTicketSaleParamType = await req.json();
  const { email, from, to, siteCode } = body;

  const paramAgent: any = {
    p_start: `${from}${START_DATE_GMT7}`,
    p_end: `${to}${END_DATE_GMT7}`,
    p_site_code: siteCode,
    p_email: email,
  };
  const { data, error } = await supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_GET_REFUND_SUMARY, paramAgent);

  if (error) {
    return Response.json({});
  }
  return Response.json({
    data,
  });
}
