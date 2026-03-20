"use client";

import React, { useEffect, useState } from "react";

import {
  DataFormTicketSubmit,
  LocationType,
  PriceCustomerType,
  ProductType,
  PromotionType,
  ResumSelectedType,
  TicketByLocationType,
} from "@/types/ticket";

import { formatVND } from "@/lib/money";
import { useLang } from "@/lib/useLang";
import { getPriceCustomer, getPromotionByLocation, getTicketType, getTicketVariant } from "../api";
import DatePickerCustom from "@/components/ui/date-picker";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT } from "@/helpers/dateTime";
import { isEmpty } from "lodash";
import { checkoutSchema } from "../contants";
import { AGENT_CODE } from "@/commons/constant";
import { useDebounce } from "@/helpers/useDebounce";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";

type CheckoutFormProps = {
  location: string;
  locations: LocationType[];
  agentCode?: string;
  onChangeLocation: (value: string) => void;
  onSubmit: (values: any) => void;
};

const toDate = dayjs(new Date()).format(BASIC_DATE_FORMAT);

const initFormValues = {
  email: "",
  phone: "",
  date_use: toDate,
  description: "",
};

export function CheckoutForm({
  onSubmit,
  onChangeLocation,
  location,
  locations,
  agentCode = AGENT_CODE.CUSTOMER,
}: CheckoutFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setToastMessage }: CommonType | any = useCommonStore.getState();

  const [ticketTypes, setTicketTypes] = useState<TicketByLocationType[]>([]);
  const [ticketTypeCode, setTickeTypeCode] = useState("");

  const [ticketVariants, setTicketVariants] = useState<ProductType[]>([]);
  const [countTicketSelected, setCountTicketSelected] = useState<any>({});

  const [promotionList, setPromotionList] = useState<PromotionType[]>([]);
  const [isPromo, setIsPromo] = useState<any>({});

  const [formData, setFormData] = useState<any>(initFormValues);

  const [totalMoney, setTotalMoney] = useState(0);
  const [resumSelected, setResumeSelected] = useState<ResumSelectedType[]>([]);

  const [loadingGetPice, setLodingPrice] = useState(false);

  const locationNameSelected = locations?.find((l) => l.code === location)?.name || "";

  const setIsPromoSelected = (code: string, val: boolean) => {
    setIsPromo((p: any) => ({ [code]: val })); // chỉ đc áp dụng 1 ctrinh khuyến mãi
  };

  const setTicKetSelected = (code: string, val: any) => {
    console.log(code, val);
    setCountTicketSelected((p: any) => ({ ...p, [code]: val }));
  };

  const setFieldFormData = (key: string, val: any, needCalPrice = false) => {
    setFormData((p: any) => ({ ...p, [key]: val }));
  };

  const calMoney = (mapPriceSelect: Map<string, number>) => {
    const res: any = [];
    let totalMoney = 0;
    if (!isEmpty(mapPriceSelect)) {
      mapPriceSelect.keys().forEach((key: string) => {
        const numerTicet = countTicketSelected[key] ?? 0;
        const priceTicket = mapPriceSelect.get(key) ?? 0;
        const totalPriceTicket = numerTicet * priceTicket;
        const ticketVariant = ticketVariants.find((t) => t.code === key);
        totalMoney += totalPriceTicket;
        const result: ResumSelectedType = {
          base_price: ticketVariant?.price || 0,
          finalprice: priceTicket,
          totalPriceTicket,
          ticketName: ticketVariant?.ticket_name || "",
          numerTicet,
          ticket_variant_code: key,
          date_use: formData.date_use,
        };
        res.push(result);
      });
    }
    setResumeSelected(res);
    setTotalMoney(totalMoney);
  };

  const handleValidateForm = (e: React.FormEvent) => {
    if (agentCode !== AGENT_CODE.CUSTOMER) return true;
    e.preventDefault();
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      setToastMessage("Chưa nhập thông tin");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (handleValidateForm(e)) {
      const submit: DataFormTicketSubmit = {
        total_amount: totalMoney,
        formData,
        listTicket: resumSelected,
        locationNameSelected,
        date_use: formData.date_use,
      };
      onSubmit(submit);
      setErrors({});
    }
  };

  // fetch data
  const getPriceTicet = async () => {
    let promo = "";
    if (!isEmpty(isPromo)) {
      Object.keys(isPromo).forEach((key) => {
        if (isPromo[key]) {
          promo = key;
        }
      });
    }
    const listTicketCode = Object.keys(countTicketSelected).filter(
      (key) => countTicketSelected[key] > 0
    );

    if (listTicketCode.length) {
      setLodingPrice(true);
      const data = await getPriceCustomer(listTicketCode, promo, agentCode);
      if (data) {
        const priceMap: Map<string, number> = new Map(
          data.map((item: PriceCustomerType) => [item.ticket_variant_code, item.price])
        );
        calMoney(priceMap);
      }
      setLodingPrice(false);
    } else {
      setResumeSelected([]);
      setTotalMoney(0);
    }
  };

  const fetchPromotion = async () => {
    const data = await getPromotionByLocation(location);
    if (data) {
      setPromotionList(data);
    }
  };

  const fetchTicketTypeByLocation = async () => {
    const data = await getTicketType(location);
    if (data?.length) {
      setTicketTypes(data);
      setTickeTypeCode(data[0].code);
    }
  };

  const fetchTicketVariant = async () => {
    const data = await getTicketVariant(ticketTypeCode);
    if (data) {
      setTicketVariants(data);
    }
  };

  useEffect(() => {
    if (location) {
      fetchTicketTypeByLocation();
      fetchPromotion();
    }
  }, [location]);

  useEffect(() => {
    if (ticketTypeCode) {
      fetchTicketVariant();
    }
  }, [ticketTypeCode]);

  const debouncedCount = useDebounce(countTicketSelected, 1000, setLodingPrice);
  const debouncedPromo = useDebounce(isPromo, 1000, setLodingPrice);

  useEffect(() => {
    getPriceTicet();
  }, [debouncedCount, debouncedPromo]);

  useEffect(() => {
    setTotalMoney(0);
    setResumeSelected([]);
    setCountTicketSelected({});
    setIsPromo({});
  }, [location, ticketTypeCode]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMN 1: FORM THÔNG TIN (Chiếm 2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* BLOCK 1: HÀNH TRÌNH & LOẠI VÉ */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-900">1. Thông tin chuyến đi</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Điểm đến</label>
                  <select
                    value={location}
                    onChange={(e) => onChangeLocation(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-xl bg-gray-50 text-lg font-medium focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                  >
                    {locations.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Ngày đi</label>
                  <div className="w-full p-2 border border-gray-200 rounded-xl bg-gray-50 text-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition">
                    <DatePickerCustom
                      style={{
                        width: "100%",
                      }}
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Loại vé</label>
                <div className="grid grid-cols-2 gap-3 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                  {ticketTypes.map((opt) => (
                    <button
                      key={opt.code}
                      className={` transition p-2 rounded-lg font-bold text-lg  ${opt.code === ticketTypeCode ? "bg-white text-blue-700  shadow-sm border border-gray-200 flex justify-center items-center gap-2" : "text-gray-600  font-medium text-lg hover:bg-gray-200"} `}
                      type="button"
                      onClick={() => setTickeTypeCode(opt.code)}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-900">2. Số lượng vé</h2>
              <p className="text-sm text-gray-500 mb-6">
                Nhập số lượng theo từng đối tượng (tùy theo loại vé bạn chọn)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-1 rounded-xl border border-gray-100 mb-6">
                {ticketVariants.map((item) => (
                  <div
                    className="bg-white p-2 rounded-lg border border-gray-100 text-center shadow-inner"
                    key={item.code}
                  >
                    <label className="block text-gray-900 font-medium mb-3 text-medium">
                      {item.category_name}
                    </label>
                    <input
                      id={item.code}
                      inputMode="numeric"
                      type="number"
                      min={0}
                      max={99}
                      value={countTicketSelected[item.code] ?? 0}
                      onChange={(e) => setTicKetSelected(item.code, e.target.value)}
                      className="w-24 text-center p-1 text-xl font-black text-blue-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
                    />
                  </div>
                ))}
              </div>

              {promotionList.length ? (
                <div className=" rounded-xl border bg-muted/20 p-4">
                  {promotionList.map((p) => (
                    <div key={p.code} className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-lg font-bold text-orange-950 cursor-pointer">
                          {p.promo_name}
                        </p>
                        <span className="text-sm text-orange-800">
                          Chú ý:Giá vé áp dụng cho {p.promo_name}, vui lòng xuất căn cước khi vào
                          cổng.
                        </span>
                      </div>
                      <input
                        id="central_resident"
                        type="checkbox"
                        checked={isPromo[p.code] || false}
                        onChange={(e) => setIsPromoSelected(p.code, e.target.checked)}
                        className="w-6 h-6 rounded-md border-gray-300 text-orange-600 focus:ring-orange-200 transition"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {agentCode === AGENT_CODE.CUSTOMER ? (
              <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-900">3. Thông tin nhận vé</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Email nhận vé (QR Code)
                    </label>
                    <input
                      type="email"
                      id="email"
                      onChange={(e) => setFieldFormData("email", e.target.value)}
                      value={formData.email}
                      placeholder="Ví dụ: nguyenvan@gmail.com"
                      className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 transition"
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Số điện thoại liên hệ
                    </label>
                    <input
                      type="tel"
                      placeholder="Ví dụ: 0987654321"
                      id="phone"
                      onChange={(e) => setFieldFormData("phone", e.target.value)}
                      value={formData.phone}
                      className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 transition"
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Ghi chú (Tùy chọn)</label>
                  <textarea
                    rows={3}
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFieldFormData("description", e.target.value)}
                    placeholder="Ví dụ: Cần xuất hóa đơn GTGT, giờ đón dự kiến..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 transition"
                  ></textarea>
                </div>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-10 relative">
              <h3 className="text-2xl font-bold mb-6 text-gray-950">Tóm tắt đơn hàng</h3>

              <div className="space-y-4 text-gray-700 pb-6 mb-6 border-b border-gray-100">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-500">Điểm đến</span>
                  <span className="font-semibold text-gray-900">{locationNameSelected}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-500">Ngày đi</span>
                  <span className="font-semibold text-gray-900">{formData.date_use}</span>
                </div>
              </div>
              {resumSelected.map((item, index) => (
                <div key={index}>
                  <div className="text-gray-600 pt-2 text-sm pl-4 border-l-2 border-gray-100 space-y-1">
                    <div className="flex justify-between">
                      <span>{item.ticketName}</span>
                      <span> x {Number(item.numerTicet)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Giá gốc:</span>
                      <span className="text-xs line-through ">{formatVND(item.base_price)}</span>
                    </div>
                    <div className="f-width text-right ">
                      <span className="font-semibold">{formatVND(item.finalprice)}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-6">
                <div className="flex justify-between items-baseline pt-4 border-t-2 border-dashed border-gray-200">
                  <span className="text-base font-medium text-gray-950">Tổng cộng</span>
                  <div className="text-right">
                    <span className="text-medium font-extrabold text-blue-900 tracking-tight">
                      {formatVND(totalMoney)}
                    </span>
                  </div>
                </div>

                <button
                  disabled={totalMoney === 0 || loadingGetPice}
                  onClick={handleSubmit}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-xl font-extrabold text-xl shadow-md transition duration-150 transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  {agentCode === AGENT_CODE.CUSTOMER ? "Thanh toán" : "Xuuất vé"}
                </button>
              </div>
              {loadingGetPice && (
                <div className="absolute inset-0 grid place-items-center bg-white/50">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
