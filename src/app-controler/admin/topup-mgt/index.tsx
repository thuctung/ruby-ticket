"use client";

import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SearchAffiType, SearchTableType, TopupMgtResponseType } from "@/types";
import { get } from "lodash";
import { AffiliateSearch } from "../affiliate-mgt/components/search-form";
import { listTopupMgtStatus } from "./components/constants";
import { TopupMgtList } from "./components/topupList";
import { createTraction, getListTopupMgt, updateTopupMgtStatus } from "./apis";
import Pagination from "@/components/ui/pagination";

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
        <TopupMgtList history={listTopupMgt} onApproveTopup={handleUpdateStatus} />
        <Pagination
          onChangePage={(page) => setParams((pre) => ({ ...pre, currentPage: page }))}
          page={params.currentPage}
          totalPages={totalPages}
        />
      </CardContent>
    </Card>
  );
}
