import Link from "next/link";

import { MenuMgtType } from "@/types";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  menuList: MenuMgtType[];
}

export default function SideBarManager({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  menuList,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-[1px] md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={[
          "fixed md:sticky top-10 left-0 h-screen z-40 flex flex-col gap-5 ",
          "bg-paper border-r border-line px-3.5 py-5 bg-white top-[40px]",
          "transition-[width,transform, top] duration-300 ease-in-out overflow-x-hidden",
          collapsed ? "md:w-[76px]" : "md:w-[264px]",
          "w-[264px]",
          mobileOpen ? "translate-x-0 " : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* Brand row */}
        <div className="flex items-center justify-between px-2 pb-1">
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-line bg-paper text-ink-soft transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-600"
            aria-label="Thu gọn / mở rộng menu"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-1 flex flex-col gap-1">
          {menuList.map((menu, idx) => (
            <Link
              href={menu.link}
              key={idx}
              className={[
                "group flex cursor-pointer items-center gap-3 overflow-hidden whitespace-nowrap rounded-xl px-3 py-2.5 text-[14.5px] font-semibold transition-colors",
                collapsed ? "md:justify-center md:px-0" : "",
                ,
              ].join(" ")}
            >
              <svg
                className="w-5 h-5 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menu.icon} />
              </svg>
              <span className={["transition-opacity", collapsed ? "md:hidden" : ""].join(" ")}>
                {menu.lable}
              </span>
              {!collapsed && (
                <ChevronRight size={15} className="ml-auto opacity-50 md:block hidden" />
              )}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
