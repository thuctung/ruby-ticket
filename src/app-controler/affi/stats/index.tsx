"use client";

import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  countTicketSale,
  getAffHistory,
  getLocation,
  getOrderDetail,
  getOrderHistory,
} from "./api";
import {
  CountTicketSaleResponse,
  OrderDetailType,
  OrderHistoryType,
  ProfileType,
  SearchTableType,
  SearchTicketSale,
  TicketSalteResponseType,
} from "@/types";
import { useProfileStore } from "@/stores/useProfileStore";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, dayjsEx, FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { LocationType } from "@/types/ticket";
import { SearchTicketForm } from "./components/searchTicketForm";

import { Revenue } from "./components/Revenue";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { formatVND } from "@/helpers/money";
import { SITE_SUB_GROUP } from "@/commons/constant";
import { get, isEmpty } from "lodash";
import { statusClass, StatusData } from "./contants";
import { Button } from "@/components/ui/button";
import OrderDetailDialog from "./components/OrderDetail";

const df_From = dayjs(new Date()).add(-30, "day").format(BASIC_DATE_FORMAT);
const df_To = dayjs(new Date()).format(BASIC_DATE_FORMAT);

const intForm: SearchTicketSale = {
  location: "",
  from: df_From,
  to: df_To,
};

export default function AffiliateStatsControler() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const [totalPages, setTotalPage] = useState(0);
  const [locationList, setLocationList] = useState<LocationType[]>([]);

  const [orderList, setOrderList] = useState<OrderHistoryType[]>([]);

  const [countTicket, setCountTicket] = useState({ quantity: 0, total: 0 });

  const [orderDetails, setOrderDetails] = useState<OrderDetailType[]>([]);

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
    const { data, totalPages } = await getOrderHistory(params, profile.user_id);
    if (data) {
      setOrderList(data);
    }
    setTotalPage(totalPages);
  };

  const handleGetLocation = useCallback(async () => {
    const resLocation = await getLocation();
    if (resLocation) {
      setLocationList(resLocation);
    }
  }, []);

  const handleCountTicketSale = async () => {
    const { data } = await countTicketSale(
      params.searchValue.from,
      params.searchValue.to,
      profile.user_id
    );
    if (data) {
      const result = data.reduce(
        (acc: { quantity: number; total: number }, item: CountTicketSaleResponse) => {
          return {
            quantity: acc.quantity + item.quantity,
            total: acc.total + item.total,
          };
        },
        { quantity: 0, total: 0 }
      );
      setCountTicket(result);
    }
  };

  const onShowDialogDetail = async (orderItem: OrderHistoryType) => {
    const data = await getOrderDetail(orderItem.id);
    const result: OrderDetailType[] = data?.map((item: any) => ({
      ...item,
      order_code: orderItem.order_code,
    }));
    setOrderDetails(result);
  };

  const columnAffStats: TableColumn<OrderHistoryType>[] = [
    {
      key: "site_code",
      title: "Địa điểm",
      align: "left",
      render: (row) => get(SITE_SUB_GROUP, row.site_code),
    },
    {
      key: "order_code",
      title: "Order code",
      align: "left",
    },
    {
      key: "total",
      title: "Số tiền",
      render: (row) => formatVND(row.total_amount),
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
      title: "Ngày bán",
      render: (row) => dayjsEx(row.created_at).format(FULL_DATE_FORMAT),
      align: "center",
    },
    {
      key: "action",
      title: "",
      render: (row) => <Button onClick={() => onShowDialogDetail(row)}>Chi tiết </Button>,
      align: "center",
    },
  ];

  useEffect(() => {
    handleGetLocation();
  }, []);

  useEffect(() => {
    if (profile.user_id) {
      fetchTicketSale();
    }
  }, [params, profile.user_id]);

  useEffect(() => {
    if (profile.user_id) {
      handleCountTicketSale();
    }
  }, [params.searchValue.from, params.searchValue.to, profile.user_id]);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Thống kê </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <SearchTicketForm
            locations={locationList}
            onChangeForm={handleChangeForm}
            onReset={handleResetForm}
            searchValue={params.searchValue}
          />

          <Revenue
            total={countTicket.total}
            ticket={countTicket.quantity}
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
      <OrderDetailDialog
        open={orderDetails.length > 0}
        onClose={() => setOrderDetails([])}
        orderDetails={orderDetails}
      />
    </div>
  );
}
