import HomePage from "@/app-controler/homepage";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const srrSupbase = createSupabaseBrowserClient()

export default async function Home() {
  const { data } = await srrSupbase
    .from(DB_TABLE_NAME.LOCATIONS)
    .select("code,name,pre_price")
    .limit(20);
  return <HomePage locations={data || []} />;
}
