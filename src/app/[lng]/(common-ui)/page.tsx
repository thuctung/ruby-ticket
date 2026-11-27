import HomePageController from "@/app-controler/homepage";
import { getSitesHomePage } from "@/lib/api-server/get-site";

export const dynamic = "force-static";

export default async function HomePage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  const { data }: any = await getSitesHomePage();
  return <HomePageController lng={lng} sites={data || []} />;
}
