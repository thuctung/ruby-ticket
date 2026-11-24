"use client";

import { useState } from "react";

import { ProductBanaType, SiteType } from "@/types/ticket";

import { fieldStyle, getSideItem } from "@/app-controler/admin/product-mgt/contants";
import { SearchProductType } from "@/app-controler/admin/product-mgt/type";
import { toast } from "react-toastify";
import { getProductByFilter } from "@/app-controler/admin/product-mgt/api";
import { SearchTableType } from "@/types";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/money";

type ProductMgtType = {
  listSite: SiteType[];
};
const intForm: SearchProductType = {
  name: "",
  site_code: "",
};
export default function ProductManagementTab({ listSite }: ProductMgtType) {
  const [totalPages, setTotalPage] = useState(0);

  const [params, setParams] = useState<SearchTableType<SearchProductType>>({
    searchValue: { ...intForm },
    currentPage: 1,
  });

  const [listProduct, setListProduct] = useState<ProductBanaType[]>([]);

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
  const handleChangePage = (page: number) => {
    setParams((pre) => {
      const newValue = { ...pre, currentPage: page };
      fetchListProduct(newValue);
      return newValue;
    });
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
        getSideItem(row.site_code, listSite)?.in_system ? <Button size="sm">Sửa vé</Button> : null,
    },
    {
      key: "update_agent_price",
      title: "",
      align: "center",
      render: (row) => <Button size="sm">Sửa giá đại lý</Button>,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-end">
        <div className="w-full sm:w-64">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Tên vé
          </label>
          <input
            id="name"
            value={params.searchValue.name}
            onChange={(e) => updateSearchValue("name", e.target.value)}
            placeholder="Nhập tên sản phẩm"
            className={fieldStyle}
          />
        </div>

        <div className="">
          <label htmlFor="site" className="mb-1 block text-sm font-medium text-slate-700">
            Công viên
          </label>
          <select
            id="site_code"
            value={params.searchValue.site_code}
            onChange={(e) => updateSearchValue("site_code", e.target.value)}
            className={fieldStyle}
          >
            <option value="">Tất cả</option>
            {listSite.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSearch}
          style={{ height: 34 }}
          className=" mx-5 rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          Tìm kiếm
        </button>
      </div>
      <CustomTable
        columns={columnProduct}
        data={listProduct}
        onChangePage={(page) => handleChangePage(page)}
        currentPage={params.currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
