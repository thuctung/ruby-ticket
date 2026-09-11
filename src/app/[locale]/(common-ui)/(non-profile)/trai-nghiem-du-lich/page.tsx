import DestinationsPageController from "@/app-controler/trai-nghiem-du-lich";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default async function DestinationsPage() {
  const clientSupbase = await createSupabaseBrowserClient();
  const { data }: any = await clientSupbase
    .from(DB_TABLE_NAME.SITES)
    .select("code,name,pre_price,status")
    .order("order", { ascending: true })
    .limit(20);
  return <DestinationsPageController sites={data || []} />;
}
