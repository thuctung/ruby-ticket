"use client";

import { useEffect, useState } from "react";

import { formatVND } from "@/lib/money";
import { getSaleSumary } from "./api";
import { AdminSearchReport, SearchTableType, SearchTicketSale } from "@/types";
import { SearchReport } from "./components/searchReport";

import { intForm } from "./constant";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { AllSaleType, SaleSumaryType } from "./type";
import { CurrentMoney } from "./components/current-money";
import ShowAllData from "./components/show-all";

export default function AdminStatsPageControler() {
  const [saleSumaryList, setSaleSumarayList] = useState<SaleSumaryType[]>([]);

  const [allSale, setAllSale] = useState<AllSaleType[]>([]);

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

  const fetchSaleSumary = async () => {
    const data = await getSaleSumary(params.searchValue);

    if (data) {
      const { allData, agentData } = data;
      setSaleSumarayList(agentData);
      setAllSale(allData);
    }
  };

  const columnAdminReport: TableColumn<SaleSumaryType>[] = [
    {
      key: "user_email",
      title: "Email",
    },
    {
      key: "total_tickets",
      title: "Số vé",
    },

    {
      key: "total_amount",
      title: "Tổng tiền",
      className: "font-semibold",
      render: (row) => formatVND(row.total_amount),
    },
  ];

  useEffect(() => {
    fetchSaleSumary();
  }, [params]);

  return (
    <div className="space-y-6">
      <CurrentMoney />
      <SearchReport
        onChangeForm={handleChangeForm}
        onReset={handleResetForm}
        searchValue={params.searchValue}
      />

      <ShowAllData dataSale={allSale} />

      <CustomTable
        tableTitle="Tra cứu đại lý"
        currentPage={params.currentPage}
        columns={columnAdminReport}
        data={saleSumaryList}
        totalPages={1}
        onChangePage={(value) => setParams((pre) => ({ ...pre, currentPage: value }))}
      />
    </div>
  );
}
