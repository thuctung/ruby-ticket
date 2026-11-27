"use client";

import { useEffect, useState } from "react";
import { getSiteByStatus } from "@/components/GetTicketForm/api";
import { SiteType } from "@/types/ticket";
import PriceMgtController from "./components/price-mgt";

import ProductSyncTab from "./components/sync-product";
import Tabs from "./components/sync-product/components/Tabs";

const TABS = [
  { key: "manage", label: "Thông tin vé" },
  { key: "sync", label: "Đồng bộ vé Sunworld" },
];

export default function ProductsManagementController() {
  const [active, setActive] = useState("manage");
  const [listSite, setListSite] = useState<SiteType[]>([]);

  const fetchSites = async () => {
    const sites = await getSiteByStatus(true);
    if (sites && sites.length) {
      setListSite(sites);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return (
    <main className="  px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Quản lý vé</h1>
      <Tabs tabs={TABS} active={active} onChange={setActive} />
      <section className="pt-6">
        {active === "manage" ? (
          <PriceMgtController listSite={listSite} />
        ) : (
          <ProductSyncTab listSite={listSite} />
        )}
      </section>
    </main>
  );
}
