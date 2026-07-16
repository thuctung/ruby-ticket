"use client";

import { useEffect, useState } from "react";

import { formatVND } from "@/lib/money";
import { getTicketSaleAdmin } from "./api";
import { AdminSearchReport, SearchTableType, SearchTicketSale } from "@/types";
import { SearchReport } from "./components/searchReport";
import { LocationType } from "@/types/ticket";
import { getLocation } from "@/app-controler/affi/getTicket/api";
import { intForm } from "./constant";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { AdminReportResponseType } from "./type";
import { BASIC_DATE_FORMAT, dayjsEx, FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { get } from "lodash";
import { statusClass, StatusData } from "@/app-controler/affi/stats/contants";
import { CUSTOMER } from "@/commons/constant";

export default function AdminHistoryPageControler() {
  const [totalPages, setTotalPage] = useState(0);
  const [locationList, setLocationList] = useState<LocationType[]>([]);

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

  const columnAdminReport: TableColumn<AdminReportResponseType>[] = [
    {
      key: "user_email",
      title: "Email",
    },
    {
      key: "product_name",
      title: "Tên vé",
    },
    {
      key: "product_name",
      title: "Ngày rút",
      render: (row) => dayjsEx(row.created_at).format(FULL_DATE_FORMAT),
    },
    {
      key: "quantity",
      title: "Số vé",
      align: "center",
    },
    {
      key: "price",
      title: "Số tiền",
      render: (row) => formatVND(row.price),
    },
    {
      key: "total_amount",
      title: "Tổng tiền",
      className: "font-semibold",
      render: (row) => formatVND(row.total),
    },
    {
      key: "payment_method",
      title: "Người mua",
      render: (row) =>
        row.payment_method === CUSTOMER ? (
          <span className="text-green-500">Khách lẻ</span>
        ) : (
          <span className="text-yellow-500">Đại lý</span>
        ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <span className={statusClass[row.status]}>{get(StatusData, row.status)}</span>
      ),
    },
    {
      key: "phone",
      title: "Số điện thoại",
    },
    {
      key: "quantity",
      title: "Ngày dùng",
      render: (row) => dayjsEx(row.date_use).format(BASIC_DATE_FORMAT),
    },
  ];

  useEffect(() => {
    fetchTicketSale();
  }, [params]);

  useEffect(() => {
    handleGetLocation();
  }, []);

  return (
    <div className="space-y-6">
      <SearchReport
        onChangeForm={handleChangeForm}
        locations={locationList}
        onReset={handleResetForm}
        searchValue={params.searchValue}
      />

      <CustomTable
        currentPage={params.currentPage}
        columns={columnAdminReport}
        data={reportList}
        totalPages={totalPages}
        onChangePage={(value) => setParams((pre) => ({ ...pre, currentPage: value }))}
      />
    </div>
  );
}
