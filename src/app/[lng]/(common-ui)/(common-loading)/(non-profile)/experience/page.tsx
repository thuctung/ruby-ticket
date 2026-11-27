import ExperienceController from "@/app-controler/experience";
import { getSites } from "@/lib/api-server/get-site";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default async function CartPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  const { data: sites }: any = await getSites();

  return <ExperienceController sites={sites} lng={lng} />;
}
