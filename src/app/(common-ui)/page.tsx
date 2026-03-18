import HomePage from "@/app-controler/homepage";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

export const revalidate = 3600;

export default async function Home() {
  const srrSupbase = await createSupabaseServerClient();
  const { data } = await srrSupbase
    .from(DB_TABLE_NAME.LOCATIONS)
    .select("code,name,pre_price")
    .limit(20);
  return <HomePage locations={data || []} />;
}
