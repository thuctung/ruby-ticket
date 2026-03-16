"use client";

import { useLang } from "@/lib/useLang";

import SideBarManager from "@/components/site/Manager/SideBar";
import { SIDEBAR_AFF } from "@/commons/constant";

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="mx-auto  flex-1 space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <aside className="md:w-64">
          <SideBarManager menuList={SIDEBAR_AFF} />
        </aside>
        <section className="flex-1">{children}</section>
      </div>
    </div>
  );
}
