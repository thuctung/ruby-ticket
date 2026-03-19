"use client";

import SideBarManager from "@/components/site/Manager/SideBar";
import { SIDEBAR_ADMIN } from "@/commons/constant";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" flex-1 space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <aside className="md:w-64">
          <SideBarManager menuList={SIDEBAR_ADMIN} />
        </aside>
        <section className="flex-1">{children}</section>
      </div>
    </div>
  );
}
