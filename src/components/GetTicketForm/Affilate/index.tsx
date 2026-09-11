"use client";

import { BOOKING_FORM_TYPE, BookingFormProps, PRODUCT_TYPE } from "../constants";
import SearchBar from "../Customer/SearchBar";
import TicketCard from "../Customer/TicketCard";
import OrderAffSummary from "./Summary";
import { getOrder } from "./constants";
import { useMemo, useState } from "react";
import TicketTabs from "../Customer/TicketTabs";

export default function AffilateBooking({
  siteCode,
  listSite,
  formData,
  listProduct,
  quantities,
  totalTickets,
  selectedLines,
  total,
  siteName,
  exportGuideTicket,
  agentPrice,
  formType,
  loading,
  setExportGuideTicket,
  setFieldFormData,
  setSiteCode,
  setQty,
  handleBuyTicket,
}: BookingFormProps) {
  const [filter, setFilter] = useState("");

  const [listProductFilter, listType] = useMemo(() => {
    const listType = listProduct.map((product) => product.personType);
    if (!filter) {
      return [listProduct, listType];
    } else {
      const filterList = listProduct.filter((product) => product.personType === filter) || [];
      return [filterList, listType];
    }
  }, [listProduct, filter]);

  return (
    <div className="pt-16">
      <SearchBar
        listSite={listSite}
        siteCode={siteCode}
        setSiteCode={setSiteCode}
        dateUse={formData.date_use}
        setDateUse={(value) => setFieldFormData("date_use", value)}
      />
      {listProductFilter.length ? (
        <div className="mt-4">
          <TicketTabs
            formType={BOOKING_FORM_TYPE.AFFILATE}
            active={filter}
            onChange={setFilter}
            listType={listType}
          />
        </div>
      ) : null}

      <div className="mx-auto">
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
          <div className="space-y-6 ">
            {listProductFilter.map((item, index: number) => (
              <section
                key={index}
                className=" md:p-6 sm:p-8 md:rounded-2xl md:border md:border-[#E3DFCF]"
              >
                <h2 className="text-xl font-semibold text-[#ff0f0f]">
                  {PRODUCT_TYPE[item.personType as keyof typeof PRODUCT_TYPE] || item.personType}
                </h2>

                {item.ticket
                  .sort((a, b) => getOrder(a.id) - getOrder(b.id))
                  .map((product) => (
                    <div key={product.code} className="mt-5">
                      <TicketCard
                        ticket={product}
                        quantities={quantities[product.code]}
                        formType={formType}
                        agentPrice={agentPrice}
                        setQty={setQty}
                      />
                    </div>
                  ))}
              </section>
            ))}

            {/* Step 2 — ticket name + quantity, side by side */}
          </div>

          {/* Right: summary (ticket stub) */}
          <OrderAffSummary
            siteName={siteName}
            dateUse={formData.date_use}
            selectedLines={selectedLines}
            quantities={quantities}
            onRemove={(code) => setQty(code, 0)}
            totalTickets={totalTickets}
            formType={formType}
            agentPrice={agentPrice}
            total={total}
            onBuyTicket={handleBuyTicket}
            loading={loading}
            exportGuideTicket={exportGuideTicket}
            setExportGuideTicket={setExportGuideTicket}
            setQty={setQty}
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#6E7C73]">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[#8A9A8E]">{label}</dt>
      <dd className={strong ? "font-semibold text-[#1F3A2F]" : "text-[#1C2620]"}>{value}</dd>
    </div>
  );
}

function TicketIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a1.5 1.5 0 0 0 0 3v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a1.5 1.5 0 0 0 0-3V8Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M10 6v12" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 2" />
    </svg>
  );
}
