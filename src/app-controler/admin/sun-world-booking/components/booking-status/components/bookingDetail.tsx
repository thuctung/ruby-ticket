"use client";

import { useEffect, useState } from "react";
import { formatVND } from "@/helpers/money";
import {
  downloadTicketPDF,
  generateThirdPartyCodeRefund,
  rebuildDataTicket,
} from "@/helpers/ticket";
import {
  TicketInItemType,
  TicketItemReponseType,
  TicketReponseType,
  TicketResultQRType,
} from "@/types/ticket";
import { getTicketFOCAndCutomer } from "@/app-controler/checkout-client/contants";
import { get, isEmpty } from "lodash";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import TriCheckbox from "./ticket-checkbox";
import { STATUS_MAP, StatusData } from "../../../constant";
import { ButtonCommon } from "@/components/ui/customs/buttonCommon";
import {
  CheckChargeRefundType,
  CheckStatusTicketType,
  OrderType,
  RefuncTicketSubmitType,
  RefundHistorySubmit,
  RefundInfo,
  RefundResponeType,
  StatusTicketListType,
} from "../../../type";
import {
  checkUsegeTicket,
  getCharegeRefund,
  getOrderByThirdPartyCode,
  refundTicket,
  saveRefundHistory,
  updateOrderItemCancel,
} from "../../../api";
import { RefundFeeDialog } from "./refundChargeDetail";
import { useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType } from "@/types";
import { toast } from "react-toastify";
import { useCommonStore } from "@/stores/useCommonStore";
import { ROLES, STATUS_COMMON_TYPE } from "@/commons/constant";

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status as keyof typeof STATUS_MAP] ?? STATUS_MAP.cancelled;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${s.bg} ${s.text} ${s.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function InfoField({ label, value, mono = true }: any) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={`truncate text-sm font-medium text-slate-800 ${mono ? "font-mono" : ""}`}
        title={value}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : "rotate-0"
      }`}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const getTicketKey = (t: TicketInItemType) => t.ticketNumber;
const createKeyMap = (product: TicketItemReponseType) => {
  return `${product.productCode}###${product.productName}`;
};

export default function BookingDetailCard({
  booking,
  onReloadData,
  onFetchMoney,
  userEmail,
}: {
  booking: TicketReponseType;
  onReloadData: Function;
  onFetchMoney: Function;
  userEmail: string;
}) {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const {
    orderCode,
    orderStatus,
    pnr,
    referenceCode,
    thirdPartyNumber,
    items = [],
    totalOrderPrice,
  } = booking;
  const { setGlobalLoading }: CommonType | any = useCommonStore.getState();

  const [open, setOpen] = useState(true);
  const [refundOpen, setRefundOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [refundData, setRefundData] = useState<RefundInfo | null>(null);
  const [statusTicketMap, setStatusTicketMap] = useState<Record<string, StatusTicketListType>>({});

  const siteCode = get(items, [0, "siteCode"]) || "";
  const usageDate = get(items, [0, "usageDate"]) || "";

  const handleDownloadFile = async () => {
    const date_use = get(booking, ["items", 0, "usageDate"]);
    const result: TicketResultQRType[] | any = rebuildDataTicket(
      booking,
      null,
      dayjs(date_use, SERVER_DATE_FORMAT).format(BASIC_DATE_FORMAT)
    );
    const { focTickets, customerTickets } = getTicketFOCAndCutomer(result);
    await downloadTicketPDF(customerTickets, focTickets);
  };

  const [ticketMap, setTicketMap] = useState<Map<string, string[]>>(new Map());

  const handleSelectTicket = (productCode: string, ticketNumber: string, checked: boolean) => {
    setTicketMap((prev) => {
      const currentProductCode = prev.keys().next().value;
      const newMap =
        currentProductCode && currentProductCode !== productCode
          ? new Map<string, string[]>()
          : new Map(prev);
      const current = newMap.get(productCode) || [];
      if (checked) {
        newMap.set(productCode, [...new Set([...current, ticketNumber])]);
      } else {
        const updated = current.filter((code) => code !== ticketNumber);
        if (updated.length) {
          newMap.set(productCode, updated);
        } else {
          newMap.delete(productCode);
        }
      }
      return newMap;
    });
  };

  const handleCheckAll = (product: TicketItemReponseType, value: boolean) => {
    setTicketMap((prev) => {
      const newMap = new Map<string, string[]>();

      if (value) {
        newMap.set(
          createKeyMap(product),
          product.tickets.map((item) => item.ticketNumber)
        );
      }

      return newMap;
    });
  };
  const listSelected = Array.from(ticketMap.values()).flat();

  const checkChargeRefund = async () => {
    if (!listSelected.length) {
      toast.warning("Chọn vé cần kiểm tra");
      return;
    }
    const params: CheckChargeRefundType = {
      returnDate: usageDate,
      thirdPartyNumber,
      items: listSelected.map((item) => ({
        siteCode,
        ticketNumber: item,
      })),
    };
    const data = await getCharegeRefund(params);
    if (data) {
      setRefundData(data);
      setRefundOpen(true);
    }
  };

  const getOrderDetail = async (thirdPartyNumber: string) => {
    const order: OrderType = await getOrderByThirdPartyCode(thirdPartyNumber);
    return order;
  };

  const getProductName = (listKey: string[], productCode: string) => {
    return listKey.find((item) => item.startsWith(`${productCode}###`))?.split("###")[1] || "";
  };

  const updateStatusOrderItem = async (refundReponse: RefundResponeType) => {
    const { productId, quantity } = refundReponse.items[0];
    const data = await updateOrderItemCancel({
      third_party_number: refundReponse.referenceThirdPartyNumber,
      product_code: productId,
      quantity,
    });
  };

  const handleSaveRefundHistory = async (refundReponse: RefundResponeType) => {
    if (!refundReponse) return;
    const orderItem = await getOrderDetail(refundReponse.referenceThirdPartyNumber);
    const listKey = [...ticketMap.keys()];

    const refundItems: RefundHistorySubmit[] = refundReponse.items.map((item) => ({
      third_party_number: refundReponse.referenceThirdPartyNumber,
      product_code: item.productId,
      quantity: item.quantity,
      return_rate: item.returnRate,
      return_charge: item.returnCharge,
      total_price: item.totalPrice,
      unit_price: item.unitPrice,
      email_order: orderItem?.user_email,
      site_code: orderItem?.site_code,
      product_name: getProductName(listKey, item.productId),
    }));
    await saveRefundHistory(refundItems);
    await updateStatusOrderItem(refundReponse);
  };

  const handleRefundTicket = async () => {
    if (!listSelected.length) {
      toast.warning("Chọn vé cần hoàn");
      return;
    }
    setLoading(true);
    setGlobalLoading(true);

    const params: RefuncTicketSubmitType = {
      thirdPartyNumber: generateThirdPartyCodeRefund(siteCode),
      returnReason: "Hủy vé",
      referenceOrders: [
        {
          email: profile.email || process.env.NEXT_PUBLIC_EMAIL_COMPANY || "",
          fullname: profile.full_name || "",
          referenceThirdPartyNumber: thirdPartyNumber,
          tickets: listSelected.map((item) => ({
            siteCode,
            ticketNumber: item,
          })),
        },
      ],
    };
    const data = await refundTicket(params);
    if (data) {
      const resFund: RefundResponeType = get(data, 0);
      await handleSaveRefundHistory(resFund);
      toast.success("Hoàn vé thành công");
      if (onFetchMoney) onFetchMoney();
      onReloadData();
      handleCheckStatusTicket();
      setRefundOpen(false);
    }
    setLoading(false);
    setGlobalLoading(false);
  };

  const handleCheckStatusTicket = async () => {
    if (!listSelected.length) {
      toast.warning("Chọn vé cần kiểm tra");
      return;
    }
    const param: CheckStatusTicketType = {
      siteCode,
      ticketNumbers: listSelected,
    };
    const data = await checkUsegeTicket(param);
    if (data) {
      const ticketMap: Record<string, StatusTicketListType> = Object.fromEntries(
        data.map((t: StatusTicketListType) => [t.ticketNumber, t])
      );
      setStatusTicketMap(ticketMap);
    }
  };

  const getStatusTicket = (ticketNumber: string) => {
    if (!isEmpty(statusTicketMap)) {
      return statusTicketMap[ticketNumber]?.status || "";
    }
    return "";
  };

  useEffect(() => {
    setRefundData(null);
    setStatusTicketMap({});
    setRefundData(null);
    setTicketMap(new Map([]));
  }, [booking]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {orderStatus === STATUS_COMMON_TYPE.SUCCESS && (
        <div className="flex items-center justify-end gap-3 px-5 pt-5">
          <button
            onClick={handleDownloadFile}
            className="rounded-lg border border-gray-200 bg-green-200 px-4 py-2 text-sm font-medium text-green-600 transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tải vé
          </button>
        </div>
      )}

      <div className="flex items-start  gap-3 px-5 pt-5">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Mã đơn hàng</p>
          <p className="font-mono text-base font-semibold text-slate-900">{orderCode}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 px-5">
        <InfoField label="Tổng tiền" value={formatVND(totalOrderPrice)} />
        <InfoField label="Mã PNR" value={pnr} />
        <InfoField label="Email booking" value={userEmail} />
        <InfoField label="Reference code" value={referenceCode} />
        <InfoField label="Third-party code" value={thirdPartyNumber} />
        <InfoField label="Trạng thái" value={<StatusBadge status={orderStatus} />} mono={false} />
      </div>

      <div className="flex justify-end gap-[20px]  px-[10px] py-5">
        {profile.role && profile.role === ROLES.ADMIN ? (
          <>
            <ButtonCommon title="Xem phí hoàn vé" onClick={checkChargeRefund} />
            <ButtonCommon title="Hoàn vé" onClick={handleRefundTicket} />
          </>
        ) : null}
        <ButtonCommon title="Xem trạng thái vé" onClick={handleCheckStatusTicket} />
      </div>

      <div className="px-5 pb-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.99]"
        >
          <span>Xem chi tiết</span>
          <ChevronIcon open={open} />
        </button>
      </div>

      <div
        className={`grid transition-all duration-200 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-5 mb-5 space-y-3">
            {items.map((p, index) => {
              const tickets: TicketInItemType[] = p.tickets ?? [];
              const allListTicketNumber = tickets.map((item) => getTicketKey(item));
              const selectedTickets = ticketMap.get(createKeyMap(p)) || [];
              const hasSelected = allListTicketNumber.some((ticket) =>
                selectedTickets.includes(ticket)
              );

              const checkAll = selectedTickets.length === allListTicketNumber.length;
              const groupSome = !checkAll && hasSelected;

              return (
                <div key={index} className="overflow-hidden rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between gap-2 bg-slate-50 px-3.5 py-2.5">
                    {allListTicketNumber.length > 0 && p.unitPrice ? (
                      <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-800">
                        <TriCheckbox
                          checked={checkAll}
                          indeterminate={groupSome}
                          onChange={(value) => handleCheckAll(p, value)}
                        />
                        {p.productName}
                      </label>
                    ) : (
                      <span className="text-sm font-medium text-slate-800">{p.productName}</span>
                    )}
                    <span className="rounded-md bg-slate-200 px-2 py-0.5 font-mono text-xs font-medium text-slate-600">
                      {formatVND(p.unitPrice)} x{p.quantity}
                    </span>
                  </div>

                  <ul className="divide-y divide-slate-100">
                    {tickets.map((t, tIndex) => {
                      const canSelect = Boolean(p.unitPrice);
                      const key = canSelect ? getTicketKey(t) : `${p.productCode}-${tIndex}`;
                      const content = (
                        <>
                          {canSelect && (
                            <input
                              type="checkbox"
                              checked={
                                ticketMap.get(createKeyMap(p))?.includes(t.ticketNumber) ?? false
                              }
                              onChange={(e) =>
                                handleSelectTicket(
                                  createKeyMap(p),
                                  t.ticketNumber,
                                  e.target.checked
                                )
                              }
                              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 accent-green-600"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate font-mono text-xs font-semibold text-slate-800">
                                {t.ticketNumber}
                              </span>
                              {canSelect ? (
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                    getStatusTicket(t.ticketNumber) === "Active"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-slate-100 text-red-500"
                                  }`}
                                >
                                  {StatusData[getStatusTicket(t.ticketNumber)]}
                                </span>
                              ) : null}
                            </div>
                            {canSelect ? (
                              <p className="mt-0.5 text-xs text-slate-500">
                                Hiệu lực: {t.validDateFrom.slice(0, 10)} →{" "}
                                {t.validDateTo.slice(0, 10)}
                              </p>
                            ) : null}
                          </div>
                        </>
                      );
                      return (
                        <li key={key}>
                          {canSelect ? (
                            <label className="flex cursor-pointer items-start gap-2.5 px-3.5 py-2.5 text-sm hover:bg-slate-50">
                              {content}
                            </label>
                          ) : (
                            <div className="flex items-start gap-2.5 px-3.5 py-2.5 pl-[2.375rem] text-sm opacity-70">
                              {content}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <RefundFeeDialog
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        data={refundData}
        loading={isLoading}
        onConfirm={handleRefundTicket}
      />
    </div>
  );
}
