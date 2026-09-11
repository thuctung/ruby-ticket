import HomePage from "@/app-controler/homepage";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { LangKey } from "@/types";

export const dynamic = "force-static";

export default async function Home({ params }: { params: Promise<{ locale: LangKey }> }) {
  const { locale } = await params;
  const clientSupbase = await createSupabaseBrowserClient();
  const { data }: any = await clientSupbase
    .from(DB_TABLE_NAME.SITES)
    .select("code,name,pre_price,status")
    .order("order", { ascending: true })
    .limit(6);
  return <HomePage sites={data || []} locale={locale} />;
}
