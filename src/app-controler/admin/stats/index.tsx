"use client";

import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/lib/money";
import { listSales, type AffiliateSale } from "@/lib/affiliateStore";
import { getProduct, listProducts, type ProductKey } from "@/lib/products";
import { t } from "@/lib/i18n/t";
import { useLang } from "@/lib/useLang";
import {  countReportAdmin, getTicketSaleAdmin } from "./api";
import {
  AdminReportResponseType,
  AdminSearchReport,
  CountReportResponse,
  SearchTableType,
  SearchTicketSale,
} from "@/types";
import { BASIC_DATE_FORMAT, dayjsEx, FULL_DATE_FORMAT } from "@/helpers/dateTime";
import dayjs from "dayjs";
import { Calendar, DollarSign, MapPin, Search, Ticket, User } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { SearchReport } from "./components/searchReport";
import { LocationType } from "@/types/ticket";
import { getLocation } from "@/app-controler/affi/getTicket/api";
import { intForm } from "./constant";

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

const daysAgoISO = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

type SellerType = "affiliate" | "customer";

export default function AdminStatsPageControler() {
  const lang = useLang();
  const products = listProducts();

  const [from, setFrom] = useState(daysAgoISO(7));
  const [to, setTo] = useState(todayISO());
  const [productKey, setProductKey] = useState<ProductKey | "all">("all");
  const [affiliateQuery, setAffiliateQuery] = useState("");

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onStorage = () => setTick((x) => x + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const sales = useMemo<AffiliateSale[]>(() => {
    // tick triggers recompute on localStorage updates
    void tick;
    return listSales();
  }, [tick]);

  const filtered = useMemo(() => {
    const q = affiliateQuery.trim().toLowerCase();
    return sales.filter((s) => {
      const soldDay = s.createdAt.slice(0, 10);
      if (soldDay < from || soldDay > to) return false;
      if (productKey !== "all" && s.productKey !== productKey) return false;
      if (q) {
        const seller = (s.affiliateEmail ?? "").toLowerCase();
        if (!seller.includes(q)) return false;
      }
      return true;
    });
  }, [sales, from, to, productKey, affiliateQuery]);

  const totals = useMemo(() => {
    const tickets = filtered.reduce(
      (acc, s) => acc + s.qtyLON + s.qtyGIA + s.qtyNHO + s.qtyChung + s.qtyCHILDANDAUL,
      0
    );
    const revenue = filtered.reduce((acc, s) => acc + s.total, 0);
    return { tickets, revenue };
  }, [filtered]);

  const rows = useMemo(() => {
    return filtered
      .slice()
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((s) => {
        const sellerType: SellerType = s.affiliateEmail ? "affiliate" : "customer";
        const seller = s.affiliateEmail ?? "Customer";
        const p = getProduct(s.productKey);
        return {
          ...s,
          sellerType,
          seller,
          productName: t(lang, p.nameKey),
        };
      });
  }, [filtered, lang]);

  const [totalPages, setTotalPage] = useState(0);
  const [locationList, setLocationList] = useState<LocationType[]>([]);
  const [countReport, setCountReport] = useState({ quantity: 0, total_amount: 0 });

  const [reportList, setReportList] = useState<AdminReportResponseType[]>([]);

  const [params, setParams] = useState<SearchTableType<AdminSearchReport>>({
    searchValue: { ...intForm },
    currentPage: 1,
  });

  const handleChangeForm = (value: SearchTicketSale) => {
    setParams({
      currentPage: 1,
      searchValue: { ...value },
    });
  };

  const handleResetForm = () => {
    setParams({
      searchValue: { ...intForm },
      currentPage: 1,
    });
  };

  const fetchTicketSale = async () => {
    const data = await getTicketSaleAdmin(params);
    if (data) {
      const { totalPages, listOrder } = data;
      setTotalPage(totalPages);
      setReportList(listOrder);
    }
  };

  const handleGetLocation = async () => {
    const resLocation = await getLocation();
    if (resLocation) {
      setLocationList(resLocation);
    }
  };

  const handleCountReport = async () => {
    const { data } = await countReportAdmin(params.searchValue.from, params.searchValue.to);
    if (data) {
      const result = data.reduce(
        (acc: { quantity: number; total_amount: number }, item: CountReportResponse) => {
          return {
            quantity: acc.quantity + item.quantity,
            total_amount: acc.total_amount + item.total_amount,
          };
        },
        { quantity: 0, total_amount: 0 }
      );
      console.log(result);
      setCountReport(result);
    }
  };

  useEffect(() => {
    fetchTicketSale();
  }, [params]);

  useEffect(() => {
    handleGetLocation();
  }, []);

  useEffect(() => {
    handleCountReport()
  },[params.searchValue.from, params.searchValue.to])



  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <SearchReport
        locations={locationList}
        onChangeForm={handleChangeForm}
        onReset={handleResetForm}
        searchValue={params.searchValue}
      />

      {/* Card Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border-l-4 border-blue-500 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Tổng tiền <span className="lowercase text-xs">{params.searchValue.from} ~ {params.searchValue.to}</span>
            </p>
            <p className="text-2xl font-bold text-gray-900">{formatVND(countReport.total_amount)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-l-4 border-emerald-500 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <Ticket size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tổng vé</p>
            <p className="text-2xl font-bold text-gray-900">{countReport.quantity}</p>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden py-4">
        <div className="table-wrapper ">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-bottom border-gray-100 text-gray-600 text-sm uppercase font-semibold">
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Tên vé</th>
                <th className="p-4 border-b text-center">Số vé</th>
                <th className="p-4 border-b">Số tiền</th>
                <th className="p-4 border-b">Tổng tiền </th>
                <th className="p-4 border-b">Người mua</th>
                <th className="p-4 border-b">Khuyến mãi</th>
                <th className="p-4 border-b">Số điện thoại</th>
                <th className="p-4 border-b">Địa điểm</th>
                <th className="p-4 border-b">Ngày bán</th>
              </tr>
            </thead>
            <tbody>
              {reportList.length ? (
                reportList.map((item, index) => (
                  <tr key={index} className="bg-gray-50 border-bottom border-gray-100 text-gray-600 text-sm  font-semibold">
                    <td className="p-4 border-b">{item.user_email}</td>
                    <td className="p-4 border-b">{item.ticket_name}</td>
                    <td className="p-4 border-b text-center">{item.quantity}</td>
                    <td className="p-4 border-b text-center">{formatVND(item.price)}</td>
                    <td className="p-4 border-b text-center">{formatVND(item.subtotal)}</td>
                    <td className="p-4 border-b text-center">
                      {item.buy_by === "customer" ? "Khách lẻ" : "Đại lý"}
                    </td>
                    <td className="p-4 border-b">{item.promo_name || "Không"}</td>
                    <td className="p-4 border-b">{item.phone}</td>
                    <td className="p-4 border-b">{item.location_name}</td>
                    <td className="p-4 border-b">
                      {dayjsEx(item.sale_date).format(FULL_DATE_FORMAT)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p>Chưa có dữ liệu</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          onChangePage={(page) => setParams((pre) => ({ ...pre, currentPage: page }))}
          page={params.currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
