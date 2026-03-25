"use client";

import { useEffect, useState } from "react";

import { formatVND } from "@/lib/money";
import { countReportAdmin, getTicketSaleAdmin } from "./api";
import {
  AdminReportResponseType,
  AdminSearchReport,
  CountReportResponse,
  SearchTableType,
  SearchTicketSale,
} from "@/types";
import { DollarSign, Ticket } from "lucide-react";
import { SearchReport } from "./components/searchReport";
import { LocationType } from "@/types/ticket";
import { getLocation } from "@/app-controler/affi/getTicket/api";
import { columnAdminReport, intForm } from "./constant";
import { CustomTable } from "@/components/ui/customs/table";

export default function AdminStatsPageControler() {
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
    handleCountReport();
  }, [params.searchValue.from, params.searchValue.to]);

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
              Tổng tiền{" "}
              <span className="lowercase text-xs">
                {params.searchValue.from} ~ {params.searchValue.to}
              </span>
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatVND(countReport.total_amount)}
            </p>
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

      <CustomTable
        columns={columnAdminReport}
        data={reportList}
        onChangePage={(page) => setParams((pre) => ({ ...pre, currentPage: page }))}
        currentPage={params.currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
