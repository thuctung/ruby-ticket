import HomePageController from "@/app-controler/homepage";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export const dynamic = "force-static";

export default async function HomePage({ params }: { params: Promise<{ lng: string }> }) {
  const clientSupbase = await createSupabaseBrowserClient();
  const { lng } = await params;

  const { data }: any = await clientSupbase
    .from(DB_TABLE_NAME.SITES)
    .select("code,name,pre_price,status")
    .order("order", { ascending: true })
    .limit(20);
  return <HomePageController lng={lng} sites={data || []} />;
}
