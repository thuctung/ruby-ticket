import { ChevronRight, Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { MENUS } from "@/commons/constant";
import Image from "next/image";

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
          <div className="flex items-center">
            <Image
              src="/logo1.png"
              alt="Ruby Travel"
              width={48}
              height={48}
              className="object-contain mix-blend-multiply"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
            <span className="text-xl font-black text-blue-900 leading-none">Ruby Travel</span>
          </div>
        </div>

        {/* List Menu Item */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-2 pb-2">
            Menu
          </p>

          {MENUS.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group mb-0.5"
            >
              <span
                className={[
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                  item.iconBg,
                ].join(" ")}
              >
                <item.icon className={["w-[18px] h-[18px]", item.iconColor].join(" ")} />
              </span>
              <span className="flex-1 text-sm text-gray-700 font-medium">{item.name}</span>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
