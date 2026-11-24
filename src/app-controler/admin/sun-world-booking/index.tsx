"use client";

import { useEffect, useMemo, useState } from "react";
import AdminBookingStatus from "./components/booking-status";
import TicketStatus from "./components/ticket-statatus";
import { getSiteByStatus } from "@/components/GetTicketForm/api";
import { SiteType } from "../site/type";
import type { SiteType as TicketSiteType } from "@/types/ticket";
import { getCurrentMoeny } from "./api";
import { get } from "lodash";
import { formatVND } from "@/lib/money";
import RefundHistory from "./components/refund-history";
import { useProfileStore } from "@/stores/useProfileStore";
import { ProfileType } from "@/types";
import { ROLES } from "@/commons/constant";

type TabProps = { listSideSun: TicketSiteType[]; onFetchMoney: Function };

const TABS: {
  id: "status" | "booking" | "refund";
  label: string;
  Component: React.ComponentType<TabProps>;
}[] = [
  { id: "booking", label: "Tra cứu booking", Component: AdminBookingStatus },
  { id: "status", label: "Trạng thái vé", Component: TicketStatus },
  { id: "refund", label: "Lịch sử hoàn hủy", Component: RefundHistory },
];
type TabId = (typeof TABS)[number]["id"];

export default function SunworldBookingController() {
  const [active, setActive] = useState<TabId>("booking");
  const [currentPrice, setCurrentPrice] = useState(0);
  const profile: ProfileType = useProfileStore((state: any) => state.profile);

  const [listSideSun, setListSideSun] = useState<TicketSiteType[]>([]);

  const TAB_MODE = useMemo(() => {
    if (profile.role === ROLES.ADMIN) {
      return TABS;
    }
    return TABS.filter((item) => item.id !== "refund");
  }, [profile.role]);

  const ActiveTab = TABS.find((t) => t.id === active)!.Component;

  const fetchListSite = async () => {
    const data = await getSiteByStatus(true);
    if (data?.length) {
      setListSideSun(
        data.filter((item: SiteType) => !item.in_system) as unknown as TicketSiteType[]
      );
    }
  };

  const fetchCurrentMoney = async () => {
    const data = await getCurrentMoeny();
    if (data) {
      const credit = get(data, [0, "activity"]) || 0;
      setCurrentPrice(credit);
    }
  };

  useEffect(() => {
    fetchListSite();
    fetchCurrentMoney();
  }, []);

  return (
    <main className="min-h-screen  text-slate-900">
      <div className="mx-auto ">
        <h1 className="text-xl font-semibold">Tra cứu booking Sunworld</h1>
        {profile.role && profile.role === ROLES.ADMIN ? (
          <section className="rounded-2xl border mt-3 border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex">
              <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    Số tiền hiện tại
                  </div>
                  <div className="mt-1 text-3xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    {formatVND(currentPrice)}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <div
          role="tablist"
          aria-label="Chức năng tra cứu"
          className="mt-6 flex gap-1  border-b border-slate-200"
        >
          {TAB_MODE.map((t) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                onClick={() => setActive(t.id)}
                className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  selected
                    ? "border-teal-700 text-teal-800"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          className="pt-6"
        >
          <ActiveTab key={active} listSideSun={listSideSun} onFetchMoney={fetchCurrentMoney} />
        </div>
      </div>
    </main>
  );
}
