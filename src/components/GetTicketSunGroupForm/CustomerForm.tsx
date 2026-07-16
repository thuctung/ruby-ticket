"use client";

import { useMemo, useState } from "react";
import { Calendar, ChevronDown, Minus, Plus, Ticket } from "lucide-react";
import { BookingFormProps, CustomerInfoSchema } from "./constants";
import { SelectBox } from "../ui/customs/selectBox";
import DatePickerCustom from "../ui/date-picker";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT } from "@/helpers/dateTime";
import { CommonType } from "@/types";
import { useCommonStore } from "@/stores/useCommonStore";

interface TicketOption {
  id: string;
  name: string;
  price: number;
}

interface TicketGroup {
  id: string;
  label: string;
  hint: string;
  items: TicketOption[];
}

const LOCATIONS = [
  "Sun World Sầm Sơn",
  "Sun World Bà Nà Hills",
  "Sun World Hạ Long",
  "Sun World Fansipan Legend",
];
const currency = (n: number) => n.toLocaleString("vi-VN") + " đ";

const TICKET_GROUPS: TicketGroup[] = [
  {
    id: "child",
    label: "Loại vé CHILD",
    hint: "Chọn loại vé và nhập số lượng bạn cần",
    items: [{ id: "child-tt", name: "TE THANH HÓA - VÉ CÔNG VIÊN NƯỚC SẦM SƠN", price: 180000 }],
  },
  {
    id: "adult",
    label: "Loại vé ADULT",
    hint: "Chọn loại vé và nhập số lượng bạn cần",
    items: [{ id: "adult-tt", name: "NL THANH HÓA - VÉ CÔNG VIÊN NƯỚC SẦM SƠN", price: 225000 }],
  },
];

const formatCurrency = (value: number) => new Intl.NumberFormat("vi-VN").format(value) + " đ";
const toDate = dayjs(new Date()).format(BASIC_DATE_FORMAT);

export default function CustomerBookingForm({
  siteSunCode,
  setSideSunCode,
  listSideSunGroup,
  setFieldFormData,
  formData,
  listProductSun,
  setQty,
  quantities,
  totalTickets,
  total,
  sideName,
  selectedLines,
  agentPrice,
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

  return (
    <div className="min-h-screen bg-[#FFF7F7] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Card 1: địa điểm & ngày đi */}
            <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm shadow-red-900/5">
              <h2 className="text-base font-bold text-[#2A1414]">1. Chọn địa điểm &amp; ngày đi</h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">Địa điểm</label>
                  <div className="relative">
                    <SelectBox
                      value={siteSunCode}
                      onChange={(value) => setSideSunCode(value)}
                      className="h-13 "
                      firstOption
                    >
                      {listSideSunGroup.map((side) => (
                        <option key={side.code} value={side.code}>
                          {side.name}
                        </option>
                      ))}
                    </SelectBox>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">Ngày đi</label>
                  <div className="relative">
                    <DatePickerCustom
                      className="okok"
                      value={formData.date_use}
                      onChange={(val: any) => setFieldFormData("date_use", val)}
                      minDate={toDate}
                      name="date_use"
                      id="date_use"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Card 2: thông tin khách hàng */}
            <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm shadow-red-900/5">
              <h2 className="text-base font-bold text-[#2A1414]">2. Thông tin khách hàng</h2>
              <p className="mt-0.5 text-xs text-gray-500">Vui lòng điền đúng thông tin</p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFieldFormData("email", e.target.value)}
                    placeholder="abc@gmail.com"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm font-medium text-[#2A1414] outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-[#C81418] focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFieldFormData("phone", e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm font-medium text-[#2A1414] outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-[#C81418] focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>
            </section>

            {listProductSun.map((group, index: number) => (
              <section
                key={index}
                className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm shadow-red-900/5"
              >
                <h2 className="text-base font-bold text-[#2A1414]">{group.personType}</h2>
                {/* <p className="mt-0.5 text-xs text-gray-500">{group.hint}</p> */}

                <div className="mt-4 space-y-3">
                  {group.ticket.map((item) => {
                    const qty = quantities[item.id] ?? 0;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-[#FFFAFA] px-4 py-3.5"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#C81418]">
                            <Ticket className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold leading-snug text-[#2A1414]">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-[#C81418]">
                              {formatCurrency(item.publicPrice)}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-white p-1">
                          <button
                            onClick={() => {
                              console.log("123");
                              setQty(item.code, (quantities[item.code] ?? 0) - 1);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <input
                            type="number"
                            min={0}
                            max={20}
                            inputMode="numeric"
                            value={quantities[item.code] ?? 0}
                            onChange={(e) => setQty(item.code, Number(e.target.value) || 0)}
                            aria-label={`Số lượng ${item.name}`}
                            className="h-9 w-12 border-x border-[#DCD6C2] text-center text-sm font-semibold text-[#1C2620] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => setQty(item.code, (quantities[item.code] ?? 0) + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C81418] text-white transition hover:bg-[#A61115]"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Right column: tóm tắt đơn hàng */}
          <aside className="h-fit rounded-2xl border border-red-100 bg-white p-6 shadow-sm shadow-red-900/5 lg:sticky lg:top-10">
            <h2 className="text-base font-bold text-[#2A1414]">Tóm tắt đơn hàng</h2>

            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Điểm đến</span>
                <span className="font-semibold text-[#2A1414]">{sideName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Ngày đi</span>
                <span className="font-semibold text-[#2A1414]">{formData.date_use}</span>
              </div>
            </div>

            <div className="my-4 border-t border-dashed border-gray-200" />

            {selectedLines.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-dashed border-[#DCD6C2] pt-4 text-sm">
                {selectedLines.map((t) => (
                  <div key={t.code} className="flex items-center justify-between gap-3">
                    <span className="text-[#6E7C73]">
                      {t.name} × {quantities[t.code]}
                    </span>
                    <span className="shrink-0 font-medium text-[#1C2620]">
                      {currency(t.publicPrice * (quantities[t.code] ?? 0))}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {selectedLines.length === 0 && (
              <p className="mt-4 border-t border-dashed border-[#DCD6C2] pt-4 text-sm text-[#8A9A8E]">
                Chưa chọn vé nào
              </p>
            )}

            <div className="my-4 border-t border-dashed border-gray-200" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Tổng cộng</span>
              <span className="text-xl font-extrabold text-[#C81418]">{currency(total)}</span>
            </div>

            <button
              disabled={totalTickets === 0}
              onClick={onBuyTicket}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C81418] to-[#8C0E11] py-3 text-sm font-bold text-white shadow-md shadow-red-900/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none"
            >
              <Ticket className="h-4 w-4" />
              Rút vé
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
