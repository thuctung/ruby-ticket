import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME, END_DATE_GMT7, START_DATE_GMT7 } from "@/commons/constant";
import { SearchSalteSumamryType } from "@/app-controler/admin/stats/type";

export async function POST(req: Request) {
  const body: SearchSalteSumamryType = await req.json();
  const { email, from, to, siteCode } = body;

  const p_start = `${from}${START_DATE_GMT7}`;
  const p_end = `${to}${END_DATE_GMT7}`;

  const paramAgent: any = {
    p_start,
    p_end,
    p_site_code: siteCode,
  };
  const paramAll: any = paramAgent;

  const [{ data: agentData, error: agentError }, { data: allData, error: allError }] =
    await Promise.all([
      supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_GET_AGENT_SALE_SUMARY, {
        ...paramAgent,
        p_email: email,
      }),
      supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_GET_ALL_SALE_SUMARY, paramAll),
    ]);
  if (agentError) return Response.json(agentError);

  if (allError) return Response.json(allError);

  return Response.json({
    allData,
    agentData,
  });
}
