"use client";

import SideBarManager from "@/components/site/Manager/SideBar";
import { SIDEBAR_ADMIN } from "@/commons/constant";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen bg-[#F8FAFC] p-8">
      <div className="mx-auto  flex flex-col gap-4 md:flex-row md:items-start ">
        <aside className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
          <SideBarManager menuList={SIDEBAR_ADMIN} />
        </aside>
        <section className="flex-1 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white p-8">
          {children}
        </section>
      </div>
    </div>
  );
}
