"use client";

import SideBarManager from "@/components/site/Manager/SideBar";
import { SIDEBAR_AFF } from "@/commons/constant";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <SideBarManager
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        menuList={SIDEBAR_AFF}
      />
      <main className="min-w-0 flex-1 px-4 py-5 pb-16 md:px-7 md:py-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-paper md:hidden"
              aria-label="Mở menu"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
