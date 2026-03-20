"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  AdminAffiResponseType,
  ProfileUpdateStatusType,
  SearchAffiType,
  SearchTableType,
} from "@/types";
import { getListAffi, updateRole, updateStatus } from "./apis";
import { get } from "lodash";
import { AffiTable } from "./components/afffi-table";
import { AffiliateSearch } from "./components/search-form";
import { listAccStatus } from "./constants";
import Pagination from "@/components/ui/pagination";

export default function AffiliateMgt() {
  const [response, setRespose] = useState<AdminAffiResponseType>();

  const profiles = useMemo(() => get(response, "profiles"), [response]) || [];
  const [totalPages, setTotalPage] = useState(0);

  const [params, setParams] = useState<SearchTableType<SearchAffiType>>({
    searchValue: {
      email: "",
      username: "",
      status: "",
    },
    currentPage: 1,
  });

  const handleGetListAff = useCallback(async () => {
    const data = await getListAffi(params);
    setRespose(data);
  }, [params]);

  const handleUpdateStatus = useCallback(
    async (status: string, user_id: string) => {
      const paramUpdate: ProfileUpdateStatusType = {
        status,
        user_id,
      };
      const response = await updateStatus(paramUpdate);
      if (response?.data) {
        handleGetListAff();
      }
    },
    [handleGetListAff]
  );

  const handleUpdateSearch = useCallback(
    (value: SearchAffiType) => {
      setParams((pre) => ({
        ...pre,
        searchValue: value,
      }));
    },
    [setParams]
  );

  const handleResetPass = useCallback(() => {
    updateRole();
  }, []);

  useEffect(() => {
    handleGetListAff();
  }, [handleGetListAff]);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Quản lý Affiliate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <AffiliateSearch onSearch={handleUpdateSearch} listStatus={listAccStatus} />
          </Card>
          <AffiTable
            profiles={profiles}
            onUpdateStatus={handleUpdateStatus}
            onResetPass={handleResetPass}
          />
          <Pagination
            onChange={(page) => setParams((pre) => ({ ...pre, currentPage: page }))}
            page={params.currentPage}
            totalPages={totalPages}
          />
        </CardContent>
      </Card>
    </div>
  );
}
