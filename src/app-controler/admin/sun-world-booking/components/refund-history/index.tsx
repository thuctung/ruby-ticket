"use client";

import { useEffect, useMemo, useState } from "react";

import { SearchTableType } from "@/types";
import { RefundHistorySubmit, SearchRefunType } from "../../type";
import { SiteType } from "@/types/ticket";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { df_From, df_To } from "@/app-controler/admin/history/constant";
import {
  getAffProductPriceOrder,
  getProfileByEmail,
  getRefundHistory,
  updateBalanceHistory,
} from "../../api";
import SearchRefundForm from "./components/search-form";
import { covertDateFormToServer } from "@/helpers/dateTime";
import { formatVND } from "@/lib/money";
import { Button } from "@/components/ui/button";

import RefundAgentDialog from "./components/add-moeny";
import { toast } from "react-toastify";
import { getSideItem, ROLES } from "@/commons/constant";

const initParam = { site_code: "", email: "", from: df_From, to: df_To, third_party_number: "" };
const initSearch = {
  searchValue: initParam,
  currentPage: 1,
};
export default function RefundHistory({ listSideSun }: { listSideSun: SiteType[] }) {
  const [totalPages, setTotalPage] = useState(0);
  const [params, setParams] = useState<SearchTableType<SearchRefunType>>(initSearch);

  const [litsHistory, setListHistory] = useState<RefundHistorySubmit[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [currentData, setCurrentData] = useState<RefundHistorySubmit | null>(null);

  const [priceAffBuy, setPriceAffBuy] = useState(0);

  const returnMoney = useMemo(() => {
    if (currentData) {
      return currentData.total_price - currentData.return_charge;
    }
    return 0;
  }, [currentData]);

  const handleOpenDialog = async (row: RefundHistorySubmit) => {
    const { data: price } = await getAffProductPriceOrder(row.third_party_number, row.product_code);
    setPriceAffBuy(price);
    setCurrentData(row);
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
    setCurrentData(null);
  };

  const onChangeSearch = (key: string, value: string) => {
    setParams((pre) => ({
      ...pre,
      searchValue: {
        ...pre.searchValue,
        [key]: value,
      },
    }));
  };

  const fetchListHistory = async (payload: SearchTableType<SearchRefunType>) => {
    const data = await getRefundHistory({
      currentPage: 1,
      searchValue: {
        ...payload.searchValue,
        from: covertDateFormToServer(payload.searchValue.from),
        to: covertDateFormToServer(payload.searchValue.to),
      },
    });
    if (data) {
      const { listHistory, totalPages } = data;
      setListHistory(listHistory);
      setTotalPage(totalPages);
    }
  };

  const handleSearch = () => {
    fetchListHistory(params);
  };
  const handleChangePage = (page: number) => {
    setParams((pre) => {
      const newValue = { ...pre, currentPage: page };
      fetchListHistory(newValue);
      return newValue;
    });
  };

  const handleReturnMoneyAffilate = async (baseCharge: number, surcharge: number) => {
    if (currentData) {
      const { data } = await getProfileByEmail(currentData.email_order);
      if (data) {
        const { role, agent_level, user_id } = data;
        if (
          role !== ROLES.AFFILIATE ||
          agent_level === ROLES.REGISTER ||
          agent_level === ROLES.CUSTOMER
        ) {
          toast.error("Đối tượng không phải là đại lý");
          return;
        }
        const resUpdate = await updateBalanceHistory({
          id: currentData.id || "",
          user_id,
          surcharge,
          total_fee: surcharge + currentData.return_charge,
          amount: baseCharge - surcharge,
          price_agent: priceAffBuy,
        });

        if (resUpdate) {
          toast.success("Hoàn tiền thành công");
          onCloseDialog();
          handleSearch();
        }
      } else {
        toast.error("Không tìm thấy đại lý");
      }
    }
  };

  const columnAffStats: TableColumn<RefundHistorySubmit>[] = [
    {
      key: "site_code",
      title: "Công viên",
      render: (row) => getSideItem(row.site_code, listSideSun)?.name,
    },
    {
      key: "email_order",
      title: "Email order",
      align: "center",
    },
    {
      key: "product_name",
      title: "Tên vé",
    },

    {
      key: "unit_price",
      title: "Giá gốc",
      render: (row) => formatVND(row.unit_price),
    },
    {
      key: "unit_price",
      title: "Giá đại lý mua",
      align: "right",
      render: (row) => formatVND(row.price_agent || 0),
    },
    {
      key: "quantity",
      title: "Số lượng",
      align: "center",
    },
    {
      key: "unit_price",
      title: "Tổng tiền",
      align: "center",
      render: (row) => formatVND(row.total_price),
    },
    {
      key: "return_rate",
      title: "Phần trăm phí",
      align: "center",
      render: (row) => `${row.return_rate}%`,
    },
    {
      key: "return_charge",
      title: "Phí hoàn Sunworld",
      align: "center",
      render: (row) => formatVND(row.return_charge),
    },
    {
      key: "surcharge",
      title: "Phụ phí",
      align: "center",
      render: (row) => formatVND(row.surcharge || 0),
    },

    {
      key: "total_fee",
      title: "Tổng phí",
      align: "center",
      render: (row) => formatVND(row?.total_fee || 0),
    },

    {
      key: "get_price",
      title: "Thực nhận",
      align: "center",
      render: (row) => formatVND(row?.real_amount || 0),
    },
    {
      key: "action",
      title: "Hoàn tiền",
      align: "center",
      render: (row) =>
        row.status === "UNPAID" ? (
          <Button onClick={() => handleOpenDialog(row)}>Hoàn tiền</Button>
        ) : (
          <p className="text-green-500">Đã hoàn</p>
        ),
    },
  ];

  useEffect(() => {
    fetchListHistory(initSearch);
  }, []);

  return (
    <main className="mx-auto w-full  px-4 py-8 sm:px-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lịch sử hoàn vé</h1>
      </header>
      <SearchRefundForm
        searchValue={params.searchValue}
        onChange={onChangeSearch}
        handleSearch={handleSearch}
        listSideSun={listSideSun}
      />

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <CustomTable
          columns={columnAffStats}
          data={litsHistory}
          totalPages={totalPages}
          currentPage={params.currentPage}
          onChangePage={(page) => handleChangePage(page)}
        />
      </section>

      {currentData ? (
        <RefundAgentDialog
          open={openDialog}
          unitPrice={currentData.unit_price * currentData.quantity}
          onClose={onCloseDialog}
          onSubmit={handleReturnMoneyAffilate}
          maxAmount={returnMoney}
          priceAff={priceAffBuy * currentData.quantity}
        />
      ) : null}
    </main>
  );
}
