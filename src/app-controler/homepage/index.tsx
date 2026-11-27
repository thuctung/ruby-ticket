import { Banner } from "./components/banner";
import TravelServices from "./components/TravelServices";
import { ExperiencesSection } from "./components/ExperiencesSection";
import { CollaboratorSection } from "./components/CollaboratorSection";
import { FaqSection } from "./components/FaqSection";
import { SiteType } from "@/app-controler/admin/site/type";
import CompanyOwnerInfo from "./components/CompanyInfo";

const HomePageController = async ({ lng, sites }: { lng: string; sites: SiteType[] }) => {
  return (
    <div className="bg-white text-neutral-900 antialiased font-sans selection:bg-blue-500 selection:text-white">
      <Banner />
      <TravelServices />
      <ExperiencesSection lng={lng} sites={sites} />
      <CollaboratorSection />
      <FaqSection />
      <CompanyOwnerInfo lng={lng} />
    </div>
  );
};
export default HomePageController;
