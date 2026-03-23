"use client";

import SideBarManager from "@/components/site/Manager/SideBar";
import { SIDEBAR_AFF } from "@/commons/constant";

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 p-6 min-h-screen bg-[#F8FAFC] lg:p-8">
      <div className="mx-auto flex flex-col gap-4 md:flex-row md:items-start max-w-7xl">
        <aside
          className="
         md:sticky md:top-18 
         h-fit 
         w-full md:w-64 
         font-sans text-slate-900
       "
        >
          <SideBarManager menuList={SIDEBAR_AFF} />
        </aside>

        <section className="flex-1 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white p-8 min-h-[100vh]">
          {children}
        </section>
      </div>
    </div>
  );
}
