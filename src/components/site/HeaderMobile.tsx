import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { t } from "@/lib/i18n/t";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { MENUS } from "@/commons/constant";
import Link from "next/link";

export function HeaderMobile({ pathname }: { pathname: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[280px]">
        {/* 2. Nội dung Sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="text-xl font-black text-blue-900 leading-none">Ruby Travel</span>
          </div>
        </div>

        {/* List Menu Item */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {MENUS.map((item, idx) => (
              <li key={idx}>
                <Link
                  onClick={(e) => {
                    if (item.link === "/#experiences")
                      if (pathname === "/") {
                        e.preventDefault();
                        const el = document.getElementById("experiences");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }
                  }}
                  href={item.link}
                  className="hover:text-blue-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
                >
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-100 transition">
                    <svg
                      className="w-5 h-5 text-gray-500 group-hover:text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                    <span className="font-semibold">{item.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
