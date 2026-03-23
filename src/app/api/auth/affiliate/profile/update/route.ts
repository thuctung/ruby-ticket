import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { user_id, phone, address, full_name } = body;

  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.PROFILES)
    .update({
      phone,
      address,
      full_name,
    })
    .eq("user_id", user_id)
    .select()
    .single();

  if (error) {
    return Response.json({ error });
  }
  return Response.json({
    data,
  });
}
