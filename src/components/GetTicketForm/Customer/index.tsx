"use client";

import { AlertCircle } from "lucide-react";
import { BookingFormProps, CustomerInfoSchema } from "../constants";
import { CommonType } from "@/types";
import { useCommonStore } from "@/stores/useCommonStore";
import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import CustomerInfoForm from "./CustomerInfoForm";
import OrderSummary from "./OrderSummary";
import TicketCard from "./TicketCard";
import TicketTabs from "./TicketTabs";
import { ProductBanaType } from "@/types/ticket";
import { geNoteSiteCode } from "./constants";
import OrderAffSummary from "../Affilate/Summary";
import { getOrder } from "../Affilate/constants";
import { SITE_CODES } from "@/commons/constant";

export default function CustomerForm({
  siteCode,
  listSite,
  formData,
  listProduct,
  quantities,
  totalTickets,
  total,
  siteName,
  selectedLines,
  agentPrice,
  formType,
  loading,
  exportGuideTicket,
  setExportGuideTicket,
  setQty,
  setFieldFormData,
  setSiteCode,
  handleBuyTicket,
}: BookingFormProps) {
  const { setToastMessage }: CommonType | any = useCommonStore.getState();

  const onBuyTicket = () => {
    const result = CustomerInfoSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[String(issue.path[0])] = issue.message;
      });
      setToastMessage("Vui lòng điền đúng thông tin email/số điện thoại");
      return false;
    }
    handleBuyTicket();
  };

  const [filter, setFilter] = useState("");

  const [tickets, personTypes] = useMemo(() => {
    let listTicket: ProductBanaType[] = [];
    const listPersonType: string[] = [];
    listProduct.forEach((item) => {
      listTicket = listTicket.concat([...item.ticket]);
      listPersonType.push(item.personType);
    });
    return [listTicket.sort((a, b) => (a.order ?? 1) - (b.order ?? 1)), listPersonType];
  }, [listProduct]);

  const listTicketFilter = useMemo(() => {
    let result: ProductBanaType[] = [];
    if (!filter) {
      result = tickets;
    } else {
      result = tickets.filter((item) => item.personType === filter);
    }
    if (siteCode === SITE_CODES.BANAHILL) {
      return result.sort((a, b) => getOrder(a.id) - getOrder(b.id));
    }
    return result;
  }, [filter, tickets, siteCode]);

  return (
    <>
      <div className=" mx-auto max-w-7xl  sm:px-6 lg:px-8">
        <SearchBar
          listSite={listSite}
          siteCode={siteCode}
          setSiteCode={setSiteCode}
          dateUse={formData.date_use}
          setDateUse={(value) => setFieldFormData("date_use", value)}
        />
      </div>

      <CustomerInfoForm value={formData} errors={{}} onChange={setFieldFormData} />

      {listTicketFilter.length > 0 && (
        <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Danh sách vé</h2>

              <div className="mt-4">
                <TicketTabs
                  formType={formType}
                  active={filter}
                  onChange={setFilter}
                  listType={personTypes}
                />
              </div>

              <div className="mt-5 flex flex-col gap-4">
                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3.5 text-sm text-amber-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{geNoteSiteCode(siteCode)}</p>
                    <p className="mt-0.5 text-amber-600/90">
                      Vui lòng mang theo giấy tờ tuỳ thân để được kiểm tra khi cần thiết.
                    </p>
                  </div>
                </div>
                {listTicketFilter.map((ticket) => (
                  <TicketCard
                    key={ticket.code}
                    ticket={ticket}
                    quantities={quantities[ticket.code]}
                    formType={formType}
                    agentPrice={agentPrice}
                    setQty={setQty}
                  />
                ))}
              </div>
            </div>

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
              onBuyTicket={onBuyTicket}
              loading={loading}
              exportGuideTicket={exportGuideTicket}
              setExportGuideTicket={setExportGuideTicket}
              setQty={setQty}
            />
          </div>
        </main>
      )}
    </>
  );
}
