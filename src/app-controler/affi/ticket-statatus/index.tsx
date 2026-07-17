"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, dayjsEx } from "@/helpers/dateTime";
import { SearchTicketStatus } from "./components/searchTicketForm";

import { CustomTable, TableColumn } from "@/components/ui/customs/table";

import { get } from "lodash";
import { statusClass, StatusData } from "./contants";
import { getSiteListSun } from "@/components/GetTicketSunGroupForm/api";
import { SideSunGroupType } from "@/types/ticket";
import { ParamStatusTicketType, TicketStatusType } from "./type";
import { getStatusTicket } from "./api";
import { toast } from "react-toastify";

export default function TicketStatusControler() {
  const [ticketLits, setTicketList] = useState<TicketStatusType[]>([]);

  const [listSideSun, setListSideSun] = useState<SideSunGroupType[]>([]);

  const handleSearch = async (value: ParamStatusTicketType) => {
    if (!value.orderCode || !value.siteCode) {
      toast.error("Chưa chọn thông tin");
      return;
    }
    const data = await getStatusTicket(value);
    if (!data.length) {
      toast.warning("Không có thông tin đơn hàng");
      return;
    }
    setTicketList(data);
  };

  const fetchListSite = async () => {
    const data = await getSiteListSun();
    if (data?.length) {
      setListSideSun(data);
    }
  };

  const columnAffStats: TableColumn<TicketStatusType>[] = [
    {
      key: "productName",
      title: "Tên vé",
      align: "left",
    },
    {
      key: "productCode",
      title: "Mã vé",
    },
    {
      key: "usageStatus",
      title: "Trạng thái",
      align: "center",
      render: (row) => (
        <span className={statusClass[row.usageStatus]}>{get(StatusData, row.usageStatus)}</span>
      ),
    },

    {
      key: "validDateFrom",
      title: "Ngày hiệu lực",
      render: (row) => dayjsEx(row.validDateFrom).format(BASIC_DATE_FORMAT),
      align: "center",
    },
    {
      key: "validDateTo",
      title: "Ngày hết hạn",
      align: "center",
      render: (row) => dayjsEx(row.validDateTo).format(BASIC_DATE_FORMAT),
    },
  ];

  useEffect(() => {
    fetchListSite();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Tra cứu thông tin vé </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <SearchTicketStatus onSearch={handleSearch} listSite={listSideSun} />

          <Separator />
          <CustomTable columns={columnAffStats} data={ticketLits} totalPages={1} />
        </CardContent>
      </Card>
    </div>
  );
}
