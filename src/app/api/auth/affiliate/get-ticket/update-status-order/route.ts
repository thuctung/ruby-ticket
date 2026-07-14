import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { order_id } = body;

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .update({
      status: "error",
    })
    .eq("id", order_id);
  if (error) {
    return Response.json({ error });
  }
  return Response.json({
    data,
  });
}
