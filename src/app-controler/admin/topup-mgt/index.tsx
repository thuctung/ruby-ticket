"use client";

import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SearchAffiType, SearchTableType, TopupMgtResponseType } from "@/types";
import { AffiliateSearch } from "../affiliate-mgt/components/search-form";
import { getStatusTopupName, listTopupMgtStatus } from "./components/constants";
import { createTraction, getListTopupMgt, updateTopupMgtStatus } from "./apis";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { formatVND } from "@/helpers/money";
import { Button } from "@/components/ui/button";
import { TOPUPS_STATUS } from "@/commons/constant";
import { dayjsEx, FULL_DATE_FORMAT } from "@/helpers/dateTime";
import { statusClass } from "./constants";

export default function TopupMgtControl() {
  const [listTopupMgt, setListTopMgt] = useState<TopupMgtResponseType[]>([]);
  const [totalPages, setTotalPage] = useState(1);

  const [params, setParams] = useState<SearchTableType<SearchAffiType>>({
    searchValue: {
      email: "",
      username: "",
      status: "",
    },
    currentPage: 1,
  });

  const columnAffStats: TableColumn<TopupMgtResponseType>[] = [
    {
      key: "created_at",
      title: "Ngày nạp",
      render: (row) => dayjsEx(row.created_at).format(FULL_DATE_FORMAT),
    },
    {
      key: "username",
      title: "Username",
      align: "right",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "amount",
      title: "Số tiền",
      render: (row) => formatVND(row.amount),
    },
    {
      key: "payment_code",
      title: "Mã nạp",
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <span className={`rounded-full border px-2 py-1 text-xs  ${statusClass[row.status]}`}>
          {getStatusTopupName(row.status)}
        </span>
      ),
    },
    {
      key: "action",
      title: "Action",
      align: "center",
      render: (row) => (
        <Button
          size="sm"
          onClick={() => handleUpdateStatus(row)}
          disabled={row.status !== TOPUPS_STATUS.PENDING}
        >
          {TOPUPS_STATUS.PENDING ? "Chấp nhận" : "Đã duyệt"}
        </Button>
      ),
    },
  ];

  const handleUpdateSearch = useCallback(
    (value: SearchAffiType) => {
      setParams((pre) => ({
        ...pre,
        searchValue: value,
      }));
    },
    [setParams]
  );

  const handleGetListAff = useCallback(async () => {
    const { listTopup, totalPages } = await getListTopupMgt(params);
    setListTopMgt(listTopup);
    setTotalPage(totalPages);
  }, [params]);

  const handleUpdateStatus = useCallback(
    async (topupItem: TopupMgtResponseType) => {
      const response = await updateTopupMgtStatus(topupItem.topup_id);
      if (response?.data) {
        createTraction({
          user_id: topupItem.user_id,
          amount: topupItem.amount,
          payment_code: topupItem.payment_code,
        });
        handleGetListAff();
      }
    },
    [handleGetListAff]
  );

  useEffect(() => {
    handleGetListAff();
  }, [params]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Quản lý Nạp tiền</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card>
          <AffiliateSearch onSearch={handleUpdateSearch} listStatus={listTopupMgtStatus} />
        </Card>
        <CustomTable
          columns={columnAffStats}
          data={listTopupMgt}
          onChangePage={(page) => setParams((pre) => ({ ...pre, currentPage: page }))}
          currentPage={params.currentPage}
          totalPages={totalPages}
        />
      </CardContent>
    </Card>
  );
}
