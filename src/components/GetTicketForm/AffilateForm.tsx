"use client";

import { body, mono } from "@/helpers/font-client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { SelectBox } from "@/components/ui/customs/selectBox";
import DatePickerCustom from "@/components/ui/date-picker";
import { BookingFormProps, getPriceAgentAndMultiple, PRODUCT_TYPE, toDate } from "./constants";
import { formatVND } from "@/helpers/money";

const currency = (n: number) => n.toLocaleString("vi-VN") + " đ";

export default function AffilateBookingForm({
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
  return (
    <div
      className={`${body.variable} ${mono.variable} min-h-screen bg-[#EEF1EC] font-[family-name:var(--font-body)] text-[#1C2620]`}
    >
      <div className="mx-auto  px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A9A8E]">
            Đặt vé tham quan
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
          {/* Left: form */}
          <div className="space-y-6 ">
            {/* Step 1 */}
            <section className="rounded-2xl border border-[#E3DFCF] bg-[#F7F4EC] p-6 shadow-[0_1px_2px_rgba(31,58,47,0.05)] sm:p-8">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1F3A2F]">
                1. Chọn địa điểm &amp; ngày đi
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Địa điểm">
                  <SelectBox
                    value={siteCode}
                    onChange={(value) => setSiteCode(value)}
                    className="h-13 "
                    firstOption
                  >
                    {listSite.map((side) => (
                      <option key={side.code} value={side.code}>
                        {side.name}
                      </option>
                    ))}
                  </SelectBox>
                </Field>

                <Field label="Ngày đi">
                  <DatePickerCustom
                    value={formData.date_use}
                    onChange={(val: any) => setFieldFormData("date_use", val, true)}
                    minDate={toDate}
                    name="date_use"
                    id="date_use"
                  />
                </Field>
              </div>
            </section>

            {listProduct.map((item, index: number) => (
              <section
                key={index}
                className="rounded-2xl border border-[#E3DFCF] bg-[#F7F4EC] p-6 shadow-[0_1px_2px_rgba(31,58,47,0.05)] sm:p-8 "
              >
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1F3A2F]">
                  {PRODUCT_TYPE[item.personType as keyof typeof PRODUCT_TYPE] || item.personType}
                </h2>
                <p className="mt-1 text-sm text-[#6E7C73]">Chọn loại vé và nhập số lượng bạn cần</p>

                <div className="mt-5 divide-y divide-[#E3DFCF] rounded-xl border border-[#DCD6C2] bg-white">
                  {item.ticket.map((product) => (
                    <div key={product.code} className="p-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1F3A2F]">{product.name}</p>
                        <p className="text-xs text-[#8A9A8E]">{product.restaurantName}</p>
                        {formatVND(getPriceAgentAndMultiple(product, formType, agentPrice))}
                        {product.multiple > 1 ? (
                          <p className="text-sm text-[red] leading-snug">{`Số vé phải là bội của: ${product.multiple}`}</p>
                        ) : null}
                      </div>
                      <div className="flex  justify-end">
                        <div className="flex shrink-0 items-center rounded-lg border border-[#DCD6C2] w-fit">
                          <button
                            type="button"
                            disabled={(quantities[product.code] ?? 0) === 0}
                            aria-label={`Giảm số lượng ${product.name}`}
                            onClick={() =>
                              setQty(product.code, (quantities[product.code] ?? 0) - 1)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-l-lg text-lg font-medium text-[#6E7C73] transition hover:bg-[#F7F4EC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C]/40"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={0}
                            inputMode="numeric"
                            value={quantities[product.code] ?? 0}
                            onChange={(e) => setQty(product.code, Number(e.target.value) || 0)}
                            aria-label={`Số lượng ${product.name}`}
                            className="h-9 w-12 border-x border-[#DCD6C2] text-center text-sm font-semibold text-[#1C2620] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            aria-label={`Tăng số lượng ${product.name}`}
                            onClick={() =>
                              setQty(product.code, (quantities[product.code] ?? 0) + 1)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-r-lg text-lg font-medium text-[#6E7C73] transition hover:bg-[#F7F4EC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C]/40"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Step 2 — ticket name + quantity, side by side */}
          </div>

          {/* Right: summary (ticket stub) */}

          <div className="lg:sticky lg:top-[58px] lg:self-start">
            <div className="relative overflow-hidden rounded-2xl border border-[#E3DFCF] bg-[#F7F4EC] shadow-[0_1px_2px_rgba(31,58,47,0.05)]">
              <div className="p-6 sm:p-7">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1F3A2F]">
                  Tóm tắt đơn hàng
                </h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <Row label="Điểm đến" value={siteName} />
                  <Row label="Ngày đi" value={formData.date_use} strong />
                </dl>
                {selectedLines.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-dashed border-[#DCD6C2] pt-4 text-sm">
                    {selectedLines.map((t, index) => (
                      <div
                        key={t.code}
                        className={`gap-3 border-r-2 border-r-[#ccc] rounded-r-[6px]  ${index !== selectedLines.length - 1 ? "mb-8" : ""}`}
                      >
                        <span className="text-[#6E7C73]">{t.name}</span>
                        <div className="flex items-center gap-3 shrink-0 justify-end mt-4">
                          <div className="flex items-center gap-1.5 rounded-md border border-[#DCD6C2] px-1.5 py-0.5">
                            <button
                              type="button"
                              aria-label={`Giảm số lượng ${t.name}`}
                              onClick={() => setQty(t.code, quantities[t.code] - 1)}
                              className="flex h-5 w-5 items-center justify-center rounded text-[#6E7C73] transition-colors hover:bg-[#F0EBDD] hover:text-[#1C2620] disabled:opacity-40"
                              disabled={(quantities[t.code] ?? 1) <= 1}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>

                            <span className="w-5 text-center text-[#1C2620]">
                              {quantities[t.code]}
                            </span>

                            <button
                              type="button"
                              aria-label={`Tăng số lượng ${t.name}`}
                              onClick={() => setQty(t.code, quantities[t.code] + 1)}
                              className="flex h-5 w-5 items-center justify-center rounded text-[#6E7C73] transition-colors hover:bg-[#F0EBDD] hover:text-[#1C2620]"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="font-medium text-[#1C2620]">
                            {currency(
                              getPriceAgentAndMultiple(t, formType, agentPrice) *
                                (quantities[t.code] ?? 0)
                            )}
                          </span>

                          <button
                            type="button"
                            aria-label={`Xóa ${t.name}`}
                            onClick={() => setQty(t.code, 0)}
                            className="flex h-5 w-5 items-center justify-center rounded text-[#6E7C73] transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
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
                {selectedLines.length ? (
                  <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[#1F3A2F]">
                    <input
                      type="checkbox"
                      checked={exportGuideTicket}
                      onChange={(e) => setExportGuideTicket?.(e.target.checked)}
                      className="h-4 w-4 rounded border-[#DCD6C2] text-[#1F3A2F] focus:ring-[#1F3A2F]"
                    />
                    <span>Xuất vé cho hướng dẫn viên</span>
                  </label>
                ) : null}

                <button
                  type="button"
                  disabled={totalTickets === 0 || loading}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F3A2F] py-3.5 text-sm font-semibold text-white transition hover:bg-[#183024] disabled:cursor-not-allowed disabled:bg-[#B7C2BB]"
                  onClick={handleBuyTicket}
                >
                  <TicketIcon />
                  {loading ? "Đang tạo..." : "Xuất vé"}
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
