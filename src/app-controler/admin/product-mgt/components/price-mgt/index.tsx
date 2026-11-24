"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { CategorySubmitType, ProductBanaType, SiteType } from "@/types/ticket";
import { AgentType, SearchTableType } from "@/types";
import {
  AgentPriceAndTypeSubmit,
  AgentPriceDefaultSubmit,
  SearchProductType,
} from "@/app-controler/admin/product-mgt/type";
import {
  getListAgentPrice,
  getListAgentPriceDefault,
  getListCategory,
  getProductByFilter,
} from "@/app-controler/admin/product-mgt/api";
import { getSideItem, PRODUCT_DIALOG } from "@/app-controler/admin/product-mgt/contants";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { formatVND } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { getListAgent } from "@/app-controler/admin/agent-mgt/api";

import SearchBar from "./components/SearchBar";
import AgentPriceModal from "./components/AgentPriceModal";
import DefaultPriceModal from "./components/DefaultPriceSite";
import ProductForm from "./components/ProductForm";

type PriceManagementProps = {
  listSite: SiteType[];
};
const intForm: SearchProductType = {
  name: "",
  site_code: "",
};
export default function PriceManagement({ listSite }: PriceManagementProps) {
  const [totalPages, setTotalPage] = useState(0);
  const [params, setParams] = useState<SearchTableType<SearchProductType>>({
    searchValue: { ...intForm },
    currentPage: 1,
  });

  const [listProduct, setListProduct] = useState<ProductBanaType[]>([]);
  const [listAgent, setListAgent] = useState<AgentType[]>([]);

  const [listPrice, setListPrice] = useState<AgentPriceAndTypeSubmit[]>([]);

  const [listPriceDefault, setListPriceDefault] = useState<AgentPriceDefaultSubmit[]>([]);

  const [productItem, setProductItem] = useState<ProductBanaType | null>(null);

  const [listCategory, setListCategory] = useState<CategorySubmitType[]>([]);

  const [dialogType, setDialogType] = useState<string>("");

  const currentSite = useMemo(
    () => getSideItem(params.searchValue.site_code, listSite),
    [params.searchValue.site_code, listSite]
  );

  const updateSearchValue = (key: string, value: string) => {
    setParams((pre) => ({ ...pre, searchValue: { ...pre.searchValue, [key]: value } }));
  };

  const fetchListProduct = async (params: SearchTableType<SearchProductType>) => {
    const data = await getProductByFilter(params);
    if (data) {
      const { totalPages, listProduct } = data;
      setTotalPage(totalPages);
      setListProduct(listProduct);
    }
  };

  const handleSearch = () => {
    const { name, site_code } = params.searchValue;
    if (!name && !site_code) {
      toast.warning("Vui nhập thông tin tìm kiếm");
      return;
    }
    fetchListProduct(params);
  };

  useEffect(() => {
    if (params.searchValue.site_code) {
      fetchListProduct(params);
    }
  }, [params.searchValue.site_code]);

  const handleChangePage = (page: number) => {
    setParams((pre) => {
      const newValue = { ...pre, currentPage: page };
      fetchListProduct(newValue);
      return newValue;
    });
  };

  const fetchCategory = async () => {
    if (listCategory.length) {
      return;
    }
    const { data } = await getListCategory();
    if (data) {
      setListCategory(data);
    }
  };

  const handleGetListAgent = async () => {
    let agents = listAgent;
    if (agents.length === 0) {
      const { data } = await getListAgent({
        searchValue: {},
        currentPage: 1,
      });
      agents = data;
    }
    setListAgent(agents);
  };

  const handleOpenAgentForm = async (row: ProductBanaType) => {
    const { data: priceList } = await getListAgentPrice(row.site_code, row.code);
    await handleGetListAgent();
    setListPrice(priceList);
    setProductItem(row);
    setDialogType(PRODUCT_DIALOG.AGENT_PRICE);
  };

  const handleOpenDefaultPrice = async () => {
    if (currentSite?.code) {
      await handleGetListAgent();
      const { data } = await getListAgentPriceDefault(currentSite.code);
      setListPriceDefault(data);
      setDialogType(PRODUCT_DIALOG.DEFAULT_PRICE);
    }
  };

  const handleOpenProductForm = async () => {
    await handleGetListAgent();
    await fetchCategory();
    setDialogType(PRODUCT_DIALOG.PRODUC_DETAIL);
  };

  const handleEditProduct = async (product: ProductBanaType) => {
    setProductItem(product);
    handleOpenProductForm();
  };

  const handleCloseDailog = (refresh?: boolean) => {
    setDialogType("");
    setProductItem(null);
    if (refresh) {
      fetchListProduct(params);
    }
  };

  const columnProduct: TableColumn<ProductBanaType>[] = [
    {
      key: "name",
      title: "Tên vé",
    },
    {
      key: "site_code",
      title: "Công viên",
      render: (row) => getSideItem(row.site_code, listSite)?.name,
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
      key: "order",
      title: "Vị trí",
    },
    {
      key: "update_product",
      title: "",
      align: "center",
      render: (row) =>
        getSideItem(row.site_code, listSite)?.in_system ? (
          <Button size="sm" onClick={() => handleEditProduct(row)}>
            Sửa vé
          </Button>
        ) : null,
    },
    {
      key: "update_agent_price",
      title: "",
      align: "center",
      render: (row) => (
        <Button onClick={() => handleOpenAgentForm(row)} size="sm">
          Sửa giá đại lý
        </Button>
      ),
    },
  ];

  return (
    <main className="space-y-4">
      <SearchBar
        listSite={listSite}
        searchValue={params.searchValue}
        onSearch={handleSearch}
        onChangeSearch={updateSearchValue}
      />

      {currentSite ? (
        <>
          <button
            onClick={handleOpenDefaultPrice}
            className="h-10 rounded-md bg-teal-700 px-5 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            Sửa giá mặc định đại lý
          </button>

          {getSideItem(currentSite.code, listSite)?.in_system ? (
            <button
              onClick={handleOpenProductForm}
              className="h-10 rounded-md bg-teal-700 px-5 text-sm font-medium text-white ml-3 hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
            >
              Thêm vé mới
            </button>
          ) : null}
        </>
      ) : null}

      <CustomTable
        columns={columnProduct}
        data={listProduct}
        onChangePage={(page) => handleChangePage(page)}
        currentPage={params.currentPage}
        totalPages={totalPages}
      />

      {dialogType === PRODUCT_DIALOG.AGENT_PRICE && productItem ? (
        <AgentPriceModal
          listSite={listSite}
          listAgent={listAgent}
          prices={listPrice}
          product={productItem}
          onClose={handleCloseDailog}
        />
      ) : null}

      {dialogType === PRODUCT_DIALOG.DEFAULT_PRICE ? (
        <DefaultPriceModal
          listSite={listSite}
          listAgent={listAgent}
          prices={listPriceDefault}
          onClose={handleCloseDailog}
          siteCode={currentSite?.code}
        />
      ) : null}

      {dialogType === PRODUCT_DIALOG.PRODUC_DETAIL ? (
        <ProductForm
          listSite={listSite}
          listAgent={listAgent}
          prices={listPrice}
          product={productItem}
          listCategory={listCategory}
          siteCode={currentSite?.code}
          onClose={handleCloseDailog}
        />
      ) : null}
    </main>
  );
}
