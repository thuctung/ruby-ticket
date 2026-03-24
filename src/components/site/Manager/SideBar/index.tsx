import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuMgtType } from "@/types";

type SideBarManagerProps = {
  menuList: MenuMgtType[];
};
export default function SideBarManager({ menuList }: SideBarManagerProps) {
  return (
    <div className="bg-white p-2 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-xs space-y-3">
      {menuList.map((item, idx) => (
        <Link href={item.link} key={idx}>
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-100">
            <div
              className={`p-2 rounded-xl transition-colors ${idx === 0 ? "bg-white shadow-sm" : "bg-gray-100 group-hover:bg-blue-100"}`}
            >
              <svg
                className="w-5 h-5 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight flex-1 text-left whitespace-nowrap">
              {item.lable}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 opacity-30 group-hover:opacity-100 transition-all transform group-hover:translate-x-1`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </Link>
      ))}
    </div>
  );
}
