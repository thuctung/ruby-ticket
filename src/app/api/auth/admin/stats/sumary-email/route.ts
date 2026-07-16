import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME, END_DATE_GMT7, START_DATE_GMT7 } from "@/commons/constant";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { email, from, to } = body;

  const p_start = `${from}${START_DATE_GMT7}`;
  const p_end = `${to}${END_DATE_GMT7}`;

  const param: any = {
    p_start,
    p_end,
  };
  if (email) {
    param["p_email"] = email;
  }

  const [{ data: agentData, error: agentError }, { data: allData, error: allError }] =
    await Promise.all([
      supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_GET_AGENT_SALE_SUMARY, param),
      supabaseAdmin.rpc(DB_TABLE_NAME.FUNC_GET_ALL_SALE_SUMARY, {
        p_start,
        p_end,
      }),
    ]);

  if (agentError) return Response.json(agentError);

  if (allError) return Response.json(allError);

  return Response.json({
    allData,
    agentData,
  });
}
