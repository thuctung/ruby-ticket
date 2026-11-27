import HomePageController from "@/app-controler/homepage";
import { DB_TABLE_NAME } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export const dynamic = "force-static";

export default async function HomePage({ params }: { params: Promise<{ lng: string }> }) {
  const clientSupbase = await createSupabaseBrowserClient();
  const { lng } = await params;

  const { data }: any = await clientSupbase
    .from(DB_TABLE_NAME.SITES)
    .select(`* , link_image_site ( url)`)
    .order("order", { ascending: true })
    .limit(6);
  return <HomePageController lng={lng} sites={data || []} />;
}
