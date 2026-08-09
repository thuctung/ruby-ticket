import HomePage from "@/app-controler/homepage";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export const dynamic = "force-static";

export default async function Home() {
  const clientSupbase = await createSupabaseBrowserClient();
  const { data } = await clientSupbase
    .from(DB_TABLE_NAME.SITES)
    .select("code,name,pre_price,status")
    .limit(20);
  return <HomePage sites={data || []} />;
}
