"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileStore } from "@/stores/useProfileStore";
import { ProfileType, SearchTableType, SearchTraction, TractionResponseType } from "@/types";
import { TractionTable } from "./components/transactionTable";
import { TransactionSearch } from "./components/transactionSearch";
import { useCallback, useEffect, useState } from "react";
import { getListTransaction } from "./apis";
import { TYPE_LIST } from "./constants";
import Pagination from "@/components/ui/pagination";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT } from "@/helpers/dateTime";

const df_From = dayjs(new Date()).add(-7, "day").format(BASIC_DATE_FORMAT);
const df_To = dayjs(new Date()).format(BASIC_DATE_FORMAT);

const intForm: SearchTraction = {
  type: "all",
  from: df_From,
  to: df_To,
};

export default function TransactionPageControl() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);

  const [listTransaction, setListTransaction] = useState<TractionResponseType[]>([]);

  const [params, setParams] = useState<SearchTableType<SearchTraction>>({
    searchValue: intForm,
    currentPage: 1,
  });

  const [totalPages, setTotalPage] = useState(0);

  const handleChangeForm = (value: SearchTraction) => {
    setParams((pre) => ({
      ...pre,
      searchValue: { ...value },
    }));
  };

  const handleResetForm = () => {
    setParams((pre) => ({
      ...pre,
      searchValue: intForm,
    }));
  };

  const fetchTransaction = async () => {
    const { data, totalPages }: any = await getListTransaction(params, profile.user_id);
    if (data) {
      setListTransaction(data);
      setTotalPage(totalPages);
    }
  };
  const handleUpdateSearch = () => {
    fetchTransaction();
  };
  useEffect(() => {
    if (profile.user_id) {
      fetchTransaction();
    }
  }, [params, profile.user_id]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Lịch sử giao dịch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card>
          <TransactionSearch
            onChangeForm={handleChangeForm}
            onReset={handleResetForm}
            searchValue={params.searchValue}
            onSearch={handleUpdateSearch}
            listStatus={TYPE_LIST}
          />
        </Card>
        <TractionTable transactions={listTransaction} />
        <Pagination
          onChange={(page) => setParams((pre) => ({ ...pre, currentPage: page }))}
          page={params.currentPage}
          totalPages={totalPages}
        />
      </CardContent>
    </Card>
  );
}
