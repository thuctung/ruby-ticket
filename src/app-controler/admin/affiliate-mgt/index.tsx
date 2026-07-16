"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  AdminAffiResponseType,
  AgentType,
  ProfileType,
  ProfileUpdateStatusType,
  SearchAffiType,
  SearchTableType,
} from "@/types";
import { getListAffi, updateAffProfile } from "./apis";
import { get, isEmpty } from "lodash";
import { AffiliateSearch } from "./components/search-form";
import { CUSTOMER, getStatusName, listAccStatus, statusClass } from "./constants";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { formatVND } from "@/helpers/money";
import { Button } from "@/components/ui/button";
import { ACC_STATUS } from "@/commons/constant";
import { getListAgent } from "../agent-mgt/api";
import EditUserLevelDialog from "./components/edit-level";

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

  const [userEdit, setUserEdit] = useState<ProfileType | null>();

  const [agentList, setAgentList] = useState<AgentType[]>([]);

  const handleGetListAff = useCallback(async () => {
    const data = await getListAffi(params);
    setTotalPage(get(data, "totalPages", 1));
    setRespose(data);
  }, [params]);

  const handleUpdateStatus = useCallback(
    async (status: string, user_id: string) => {
      const paramUpdate: ProfileUpdateStatusType = {
        status,
        user_id,
      };
      const response = await updateAffProfile(paramUpdate);
      if (response?.data) {
        handleGetListAff();
      }
    },
    [handleGetListAff]
  );

  const handleUpdateSearch = useCallback(
    (value: SearchAffiType) => {
      setParams({
        searchValue: value,
        currentPage: 1,
      });
    },
    [setParams]
  );

  const fetchListAgent = async () => {
    const { data, totalPages } = await getListAgent({
      currentPage: 1,
    });
    if (data?.length) {
      const filterData = data.filter((item: AgentType) => item.code !== CUSTOMER);
      setAgentList(filterData);
    }
    setTotalPage(totalPages);
  };

  const openEditLevel = (user: ProfileType) => {
    setUserEdit(user);
  };

  const handleEditLevel = async (level: string) => {
    if (userEdit) {
      const paramUpdate: any = {
        status: userEdit.status,
        user_id: userEdit.user_id,
        agent_level: level,
      };
      const { data }: any = await updateAffProfile(paramUpdate);
      if (data) {
        handleGetListAff();
      }
    }
  };

  useEffect(() => {
    handleGetListAff();
    fetchListAgent();
  }, []);

  const columnAffMgt: TableColumn<ProfileType>[] = [
    {
      key: "full_name",
      title: "Tên",
    },
    {
      key: "username",
      title: "Username",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "phone",
      title: "Phone",
    },
    {
      key: "agent_level",
      title: "Đại lý",
      render: (row) => (
        <span>
          {agentList.find((item) => item.code === row.agent_level)?.name || row.agent_level}
        </span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <span className={`rounded-full border px-2 py-1 text-xs  ${statusClass[row.status]}`}>
          {getStatusName(row.status)}
        </span>
      ),
    },
    {
      key: "balance",
      title: "Số dư",
      render: (row) => formatVND(row.balance),
    },

    {
      key: "action",
      title: "Action",
      align: "center",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {row.status === ACC_STATUS.PENDING ? (
            <Button size="sm" onClick={() => handleUpdateStatus(ACC_STATUS.APPROVED, row.user_id)}>
              Chấp nhận
            </Button>
          ) : null}
          {row.status === ACC_STATUS.APPROVED ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleUpdateStatus(ACC_STATUS.SUSPENDED, row.user_id)}
            >
              Dừng làm aff
            </Button>
          ) : null}
          {row.status === ACC_STATUS.SUSPENDED ? (
            <Button
              onClick={() => handleUpdateStatus(ACC_STATUS.APPROVED, row.user_id)}
              size="sm"
              variant="secondary"
            >
              Mở lại
            </Button>
          ) : null}
        </div>
      ),
    },
    {
      key: "actionss",
      title: "",
      render: (row) => (
        <Button onClick={() => openEditLevel(row)} size="sm" variant="default">
          Sửa level
        </Button>
      ),
    },
  ];

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

          <CustomTable
            columns={columnAffMgt}
            data={profiles}
            onChangePage={(page) => setParams((pre) => ({ ...pre, currentPage: page }))}
            currentPage={params.currentPage}
            totalPages={totalPages}
          />
        </CardContent>
      </Card>
      <EditUserLevelDialog
        open={!isEmpty(userEdit)}
        onClose={() => setUserEdit(null)}
        userName={userEdit?.full_name || ""}
        currentLevel={userEdit?.agent_level || ""}
        levels={agentList}
        onSubmit={(value) => handleEditLevel(value)}
      />
    </div>
  );
}
