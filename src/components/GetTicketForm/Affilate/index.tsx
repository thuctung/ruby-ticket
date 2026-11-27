"use client";

import { BOOKING_FORM_TYPE, BookingFormProps, PRODUCT_TYPE } from "../constants";
import SearchBar from "../Customer/SearchBar";
import OrderAffSummary from "./Summary";
import { getOrder } from "./constants";
import { useMemo, useState } from "react";
import TicketTabs from "../Customer/TicketTabs";
import TicketCardAff from "./TicketCardAff";

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
  mapAgentPrice,
  formType,
  currentSite,
  loading,
  agentPriceDefault,
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
                className=" md:p-6 sm:p-8 bg-[#fffaf0] md:rounded-2xl md:border md:border-[#E3DFCF]"
              >
                <h2 className="text-xl font-semibold text-[#ff0f0f]">
                  {PRODUCT_TYPE[item.personType as keyof typeof PRODUCT_TYPE] || item.personType}
                </h2>

                {item.ticket
                  .sort((a, b) => getOrder(a?.id || 1) - getOrder(b?.id || 1))
                  .map((product) => (
                    <div key={product.code}>
                      <TicketCardAff
                        ticket={product}
                        quantities={quantities[product.code]}
                        formType={formType}
                        mapAgentPrice={mapAgentPrice}
                        setQty={setQty}
                        agentPriceDefault={agentPriceDefault}
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
            agentPriceDefault={agentPriceDefault}
            mapAgentPrice={mapAgentPrice}
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
