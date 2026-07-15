"use client";

import { useEffect, useMemo, useState } from "react";
import { Fraunces, Be_Vietnam_Pro } from "next/font/google";
import { getProductBySiteSun, getSiteListSun } from "../api";
import {
  ProductBanaType,
  ProductSubmitType,
  ResultListProductType,
  SideSunGroupType,
  SubmitSelectTicket,
} from "@/types/ticket";
import { SelectBox } from "@/components/ui/customs/selectBox";
import DatePickerCustom from "@/components/ui/date-picker";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";

const display = Fraunces({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const toDate = dayjs(new Date()).format(BASIC_DATE_FORMAT);
const initFormValues = {
  email: "",
  phone: "",
  date_use: toDate,
  description: "",
};

const currency = (n: number) => n.toLocaleString("vi-VN") + " đ";
type SunGroupBooking = {
  location: string;
  onBuyTicket: (productsSubmit: SubmitSelectTicket) => void;
};
export default function SunGroupBooking({ location, onBuyTicket }: SunGroupBooking) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [listSideSunGroup, setListSideSungroup] = useState<SideSunGroupType[]>([]);
  const [siteSunCode, setSideSunCode] = useState("");

  const [listProductSun, setListProductSun] = useState<ResultListProductType[]>([]);

  const [formData, setFormData] = useState<any>(initFormValues);

  const sideName = useMemo(() => {
    if (listSideSunGroup.length && siteSunCode) {
      return listSideSunGroup.find((item) => item.code === siteSunCode)?.name || "";
    }
    return "";
  }, [listSideSunGroup, siteSunCode]);

  const selectedLines = useMemo(() => {
    const listProduct = listProductSun.flatMap((item) => item.ticket);
    return listProduct.filter((t) => (quantities[t.code] ?? 0) > 0);
  }, [listProductSun, quantities]);

  const totalTickets = selectedLines.reduce((sum, t) => sum + (quantities[t.code] ?? 0), 0);

  const total = selectedLines.reduce((sum, t) => sum + t.unitPrice * (quantities[t.code] ?? 0), 0);

  const setQty = (key: string, next: number) => {
    setQuantities((q) => ({ ...q, [key]: Math.max(0, Math.min(20, next)) }));
  };

  const setFieldFormData = (key: string, val: any, needCalPrice = false) => {
    setFormData((p: any) => ({ ...p, [key]: val }));
  };

  const fetchSiteSunGroup = async () => {
    const data = await getSiteListSun();
    if (data?.length) {
      setListSideSungroup(data);
    }
  };

  const fetchProductBySite = async (siteSunCode: string) => {
    const data: any = await getProductBySiteSun(
      siteSunCode,
      dayjs(formData.date_use, BASIC_DATE_FORMAT).format(SERVER_DATE_FORMAT)
    );
    if (data?.length) {
      console.log(data);
      setListProductSun(data);
    }
  };

  const handleBuyTicket = () => {
    const products: ProductSubmitType[] = selectedLines.map((item) => ({
      productCode: item.code,
      siteCode: siteSunCode,
      quantity: quantities[item.code],
      usageDate: item.pricePolicy.usageDate,
      usageDateTo: item.pricePolicy.validDateTo,
      performanceId: item.performances.performanceId,
      productsName: item.name,
      unitPrice: item.unitPrice,
    }));
    onBuyTicket({
      products: products,
      totalMoney: total,
      date_use: formData.date_use,
      siteCode: siteSunCode,
    });
  };

  useEffect(() => {
    if (siteSunCode) {
      fetchProductBySite(siteSunCode);
    }
  }, [siteSunCode]);

  useEffect(() => {
    if (location) {
      switch (location) {
        case "BANA": {
          fetchSiteSunGroup();
          break;
        }
        default:
      }
    }
  }, [location]);

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#EEF1EC] font-[family-name:var(--font-body)] text-[#1C2620]`}
    >
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <header className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A9A8E]">
            Đặt vé tham quan
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[#1F3A2F] sm:text-4xl">
            Sun Group
          </h1>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
          {/* Left: form */}
          <div className="space-y-6">
            {/* Step 1 */}
            <section className="rounded-2xl border border-[#E3DFCF] bg-[#F7F4EC] p-6 shadow-[0_1px_2px_rgba(31,58,47,0.05)] sm:p-8">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1F3A2F]">
                1. Chọn địa điểm &amp; ngày đi
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Địa điểm">
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
                </Field>

                <Field label="Ngày đi">
                  <DatePickerCustom
                    className="okok"
                    value={formData.date_use}
                    onChange={(val: any) => setFieldFormData("date_use", val)}
                    minDate={toDate}
                    name="date_use"
                    id="date_use"
                  />
                </Field>
              </div>
            </section>

            {listProductSun.map((item) => (
              <section className="rounded-2xl border border-[#E3DFCF] bg-[#F7F4EC] p-6 shadow-[0_1px_2px_rgba(31,58,47,0.05)] sm:p-8">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1F3A2F]">
                  Loại vé {item.personType}
                </h2>
                <p className="mt-1 text-sm text-[#6E7C73]">Chọn loại vé và nhập số lượng bạn cần</p>

                <div className="mt-5 divide-y divide-[#E3DFCF] rounded-xl border border-[#DCD6C2] bg-white">
                  {item.ticket.map((product) => (
                    <div
                      key={product.code}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1F3A2F]">{product.name}</p>
                        <p className="text-xs text-[#8A9A8E]">{product.restaurantName}</p>
                        {product.multiple > 1 ? (
                          <p className="mt-0.5 text-xs font-medium ">
                            <span className="line-through">{currency(product.publicPrice)}</span>
                            {"/"}
                            <span className="text-[#C89B3C]">{currency(product.unitPrice)}</span>
                          </p>
                        ) : (
                          <p className="mt-0.5 text-xs font-medium text-[#C89B3C]">
                            {currency(product.unitPrice)}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center rounded-lg border border-[#DCD6C2]">
                        <button
                          type="button"
                          aria-label={`Giảm số lượng ${product.name}`}
                          onClick={() => setQty(product.code, (quantities[product.code] ?? 0) - 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-l-lg text-lg font-medium text-[#6E7C73] transition hover:bg-[#F7F4EC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C]/40"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={20}
                          inputMode="numeric"
                          value={quantities[product.code] ?? 0}
                          onChange={(e) => setQty(product.code, Number(e.target.value) || 0)}
                          aria-label={`Số lượng ${product.name}`}
                          className="h-9 w-12 border-x border-[#DCD6C2] text-center text-sm font-semibold text-[#1C2620] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          aria-label={`Tăng số lượng ${product.name}`}
                          onClick={() => setQty(product.code, (quantities[product.code] ?? 0) + 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-r-lg text-lg font-medium text-[#6E7C73] transition hover:bg-[#F7F4EC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C]/40"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Step 2 — ticket name + quantity, side by side */}
          </div>

          {/* Right: summary (ticket stub) */}
          <div className="lg:sticky lg:top-6">
            <div className="relative overflow-hidden rounded-2xl border border-[#E3DFCF] bg-[#F7F4EC] shadow-[0_1px_2px_rgba(31,58,47,0.05)]">
              <div className="p-6 sm:p-7">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1F3A2F]">
                  Tóm tắt đơn hàng
                </h2>

                <dl className="mt-5 space-y-3 text-sm">
                  <Row label="Điểm đến" value={sideName} />
                  <Row label="Ngày đi" value={formData.date_use} strong />
                </dl>

                {selectedLines.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-dashed border-[#DCD6C2] pt-4 text-sm">
                    {selectedLines.map((t) => (
                      <div key={t.code} className="flex items-center justify-between gap-3">
                        <span className="text-[#6E7C73]">
                          {t.name} × {quantities[t.code]}
                        </span>
                        <span className="shrink-0 font-medium text-[#1C2620]">
                          {currency(t.unitPrice * (quantities[t.code] ?? 0))}
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
              </div>

              {/* Ticket-stub perforation */}
              <div className="relative">
                <div className="border-t border-dashed border-[#DCD6C2]" />
                <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#EEF1EC]" />
                <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#EEF1EC]" />
              </div>

              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6E7C73]">Tổng cộng</span>
                  <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#1F3A2F]">
                    {currency(total)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={totalTickets === 0}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F3A2F] py-3.5 text-sm font-semibold text-white transition hover:bg-[#183024] disabled:cursor-not-allowed disabled:bg-[#B7C2BB]"
                  onClick={handleBuyTicket}
                >
                  <TicketIcon />
                  Xuất vé
                </button>
              </div>
            </div>
          </div>
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
