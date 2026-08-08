"use client";

import { useEffect, useState } from "react";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { CategoryType, ProductType, SearchProductType, SiteType } from "./type";
import { isEmpty } from "lodash";
import { getProductionInSystem, getSiteByStatus } from "@/components/GetTicketForm/api";
import { ProductBanaType } from "@/types/ticket";
import { formatVND } from "@/lib/money";
import { AgentType, CommonType } from "@/types";
import { deleteProduct, getProductInSystem, getSiteAndCategory, updateProduct } from "./api";
import FormProduct from "./components/form-product";
import SearchProduct from "./components/search-product";
import { toast } from "react-toastify";
import { useCommonStore } from "@/stores/useCommonStore";

const EMPTY_FORM: ProductType = {
  id: "",
  code: "",
  name: "",
  personType: "CHILD",
  site_code: "",
  description: "",
  publicPrice: 0,
  unitPrice: 0,
};

export default function TicketPricePageController() {
  const { setToastMessage, showConfirm }: CommonType | any = useCommonStore.getState();

  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const [listSite, setListSite] = useState<SiteType[]>([]);

  const [curentData, setCurrentData] = useState<SearchProductType | null>();

  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  const [listProductBySite, setListProductBySite] = useState<ProductType[]>([]);

  const [form, setForm] = useState<ProductType | null>(null);

  const columnAdminReport: TableColumn<ProductType>[] = [
    {
      key: "code",
      title: "Mã",
    },
    {
      key: "name",
      title: "Tên site",
    },
    {
      key: "publicPrice",
      title: "Giá công bố",
      render: (row) => formatVND(row.publicPrice),
    },
    {
      key: "unitPrice",
      title: "Giá đại lý",
      render: (row) => formatVND(row.unitPrice),
    },
    {
      key: "personType",
      title: "Loại vé",
    },
    {
      key: "",
      title: "Thao tác",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEditProduct(row)}
            className="rounded-md border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-blue-500 transition hover:border-emerald-500 hover:text-emerald-400"
          >
            Sửa
          </button>
          <button
            onClick={() => handleDeleteTicket(row)}
            className="rounded-md border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-red-500 transition hover:border-rose-500 hover:text-rose-400"
          >
            Xóa
          </button>
        </div>
      ),
    },
  ];

  const openCreateModal = () => {
    setModalMode("create");
    setForm(EMPTY_FORM);
  };

  const handleEditProduct = (product: ProductType) => {
    if (product) {
      setModalMode("edit");
      setForm(product);
    }
  };

  const fetchSiteAndCategory = async () => {
    const { sites, categories }: any = await getSiteAndCategory();
    if (sites) {
      setListSite(sites);
    }
    if (categories) {
      setCategoryList(categories);
    }
  };

  const handleSearchProduct = async (value: SearchProductType) => {
    if (value.siteCode) {
      setCurrentData(value);
      const data = await getProductInSystem({ currentPage: 1, searchValue: value });
      setListProductBySite(data);
    } else {
      setToastMessage("Vui lòng chọn công viên");
    }
  };

  const handleSubmitForm = async (value: ProductType) => {
    if (value && curentData) {
      await updateProduct({ ...value, site_code: curentData.siteCode });
      handleCloseModal();
      handleSearchProduct(curentData);
      toast.success("Thành công");
    } else {
      setToastMessage("Chưa chọn công viên");
    }
  };
  const handleDeleteTicket = (value: ProductType) => {
    showConfirm({
      message: `Xác nhận xóa: ${value.name}`,
      textOk: "Xác nhận",

      okFunc: async () => {
        if (value.id) {
          const data = await deleteProduct(value.id);
          if (data && curentData) {
            handleSearchProduct(curentData);
            toast.success("Thành công");
          }
        }
      },
    });
  };

  const handleCloseModal = () => {
    setForm(null);
  };

  useEffect(() => {
    fetchSiteAndCategory();
  }, []);

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <PlusIcon />
            Tạo ticket mới
          </button>
        </div>

        <SearchProduct
          onSearch={handleSearchProduct}
          listSite={listSite}
          listCategory={categoryList}
        />

        <CustomTable
          currentPage={1}
          columns={columnAdminReport}
          data={listProductBySite}
          totalPages={1}
          // onChangePage={(value) => setParams((pre) => ({ ...pre, currentPage: value }))}
        />
      </div>

      {!isEmpty(form) && (
        <FormProduct
          currentProduct={form}
          onClose={handleCloseModal}
          onSubmit={handleSubmitForm}
          mode={modalMode}
          listCategory={categoryList}
        />
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
