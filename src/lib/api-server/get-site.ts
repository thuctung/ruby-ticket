import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export const getSitesHomePage = async () => {
  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.SITES)
    .select(`*,location:location(code,name,en,zh,ko)`)
    .eq("status", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("[getSitesHomePage] failed:", error.message);
    throw new Error(error.message); // để build fail thay vì cache trang rỗng
  }

  return { data: data ?? [] };
};
