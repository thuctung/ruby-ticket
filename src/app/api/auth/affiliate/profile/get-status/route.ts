import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { user_id } = body;

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.PROFILES)
    .select("status")
    .eq("user_id", user_id)
    .single();

  if (error) {
    return Response.json({ error });
  }
  return Response.json({
    data,
  });
}
