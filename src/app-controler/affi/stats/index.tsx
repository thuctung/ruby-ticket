"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { countTicketSale } from "./api";
import { AdminReportResponseType, ProfileType, SearchTableType, SearchTicketSale } from "@/types";
import { useProfileStore } from "@/stores/useProfileStore";
import { BASIC_DATE_FORMAT, dayjsEx, FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { SearchTicketForm } from "./components/searchTicketForm";

import { Revenue } from "./components/Revenue";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { formatVND } from "@/helpers/money";
import { get } from "lodash";
import { statusClass, StatusData } from "./contants";
import { getSiteByStatus } from "@/components/GetTicketForm/api";
import { SiteType } from "@/types/ticket";
import { df_From, df_To } from "@/app-controler/admin/history/constant";
import { getTicketSaleAdmin } from "@/app-controler/admin/history/api";
import { CountTicketType } from "./type";
import { getSideItem } from "@/commons/constant";

const intForm: SearchTicketSale = {
  location: "",
  from: df_From,
  to: df_To,
  status: "",
  siteCode: "",
};

const initCount: CountTicketType = { ticketSale: 0, ticketReund: 0, total: 0, refundCharge: 0 };
export default function AffiliateStatsControler() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const [totalPages, setTotalPage] = useState(0);

  const [orderList, setOrderList] = useState<AdminReportResponseType[]>([]);

  const [countTicket, setCountTicket] = useState(initCount);

  const [siteList, setSiteList] = useState<SiteType[]>([]);

  const [params, setParams] = useState<SearchTableType<SearchTicketSale>>({
    searchValue: intForm,
    currentPage: 1,
  });

  const handleChangeForm = (value: SearchTicketSale) => {
    setParams((pre) => ({
      ...pre,
      searchValue: { ...value },
    }));
  };

  const handleResetForm = () => {
    setParams({
      searchValue: intForm,
      currentPage: 1,
    });
  };

  const fetchTicketSale = async () => {
    if (!profile.email) return;
    const data = await getTicketSaleAdmin({
      ...params,
      searchValue: {
        ...params.searchValue,
        email: profile.email,
      },
    });
    if (data) {
      const { totalPages, listOrder } = data;
      setTotalPage(totalPages);
      setOrderList(listOrder);
    }
  };

  const handleCountTicketSale = async () => {
    if (!profile.email) return;
    const data = await countTicketSale(
      params.searchValue.from,
      params.searchValue.to,
      profile.email,
      params.searchValue.siteCode
    );
    const res = data || initCount;
    setCountTicket(res);
  };

  const fetchSiteList = async () => {
    const data = await getSiteByStatus(true);
    if (data) {
      setSiteList(data);
    }
  };
  useEffect(() => {
    if (profile.user_id) {
      fetchTicketSale();
      handleCountTicketSale();
    }
  }, [params, profile.user_id]);

  useEffect(() => {
    fetchSiteList();
  }, []);

  const columnAffStats: TableColumn<AdminReportResponseType>[] = [
    {
      key: "order_code",
      title: "Order code",
      align: "left",
    },
    {
      key: "site_code",
      title: "Địa điểm",
      align: "left",
      render: (row) => getSideItem(row.site_code, siteList)?.name,
    },
    {
      key: "product_name",
      title: "Tên vé",
      align: "left",
    },
    {
      key: "price",
      title: "Giá vé",
      render: (row) => formatVND(row.price),
    },
    {
      key: "quantity",
      title: "Số lượng",
    },
    {
      key: "total",
      title: "Số tiền",
      render: (row) => formatVND(row.total),
    },
    {
      key: "third_party_number",
      title: "Third party number",
    },
    {
      key: "date_use",
      title: "Ngày sử dụng",
      render: (row) => dayjsEx(row.date_use).format(BASIC_DATE_FORMAT),
      align: "center",
    },

    {
      key: "status",
      title: "Trạng thái",
      align: "center",
      render: (row) => (
        <span className={statusClass[row.status]}>{get(StatusData, row.status)}</span>
      ),
    },

    {
      key: "created_at",
      title: "Ngày rút",
      render: (row) => dayjsEx(row.created_at).format(FULL_DATE_FORMAT),
      align: "center",
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Thống kê </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <SearchTicketForm
            onChangeForm={handleChangeForm}
            onReset={handleResetForm}
            searchValue={params.searchValue}
            siteList={siteList}
          />
          <Revenue
            total={countTicket.total}
            ticket={countTicket.ticketSale}
            cancel={countTicket.ticketReund}
            refundCharge={countTicket.refundCharge}
            from={params.searchValue.from}
            to={params.searchValue.to}
          />
          <Separator />
          <CustomTable
            columns={columnAffStats}
            data={orderList}
            onChangePage={(page) => setParams((pre) => ({ ...pre, currentPage: page }))}
            currentPage={params.currentPage}
            totalPages={totalPages}
          />
        </CardContent>
      </Card>
    </div>
  );
}
