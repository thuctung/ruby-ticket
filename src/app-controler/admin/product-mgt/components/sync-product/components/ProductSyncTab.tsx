"use client";

import { useMemo, useState } from "react";
import SyncDiffTable from "./SyncDiffTable";
import {
  computeDiff,
  DiffRow,
  summarize,
} from "@/app-controler/admin/product-mgt/components/sync-product/sync";

import { toast } from "react-toastify";
import dayjs from "dayjs";
import { SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { SiteType } from "@/types/ticket";
import { getProductToSync, updateProductPrices } from "@/app-controler/admin/product-mgt/api";
import { CommonType } from "@/types";
import { useCommonStore } from "@/stores/useCommonStore";
import { ProductUpdatePriceType } from "@/app-controler/admin/product-mgt/type";
import { fieldStyle } from "@/app-controler/admin/product-mgt/contants";

type SynProductType = {
  listSite: SiteType[];
};
export default function ProductSyncTab({ listSite }: SynProductType) {
  const listSiteOutSystem = useMemo(() => listSite.filter((item: SiteType) => !item.in_system), []);

  const [siteCode, setSiteCode] = useState("");
  const { setGlobalLoading }: CommonType | any = useCommonStore.getState();

  const [listProductDiff, setListProductDiff] = useState<any[]>([]);

  const summary = summarize(listProductDiff);
  const pendingCount = summary.new + summary.changed;

  const handleSync = async () => {
    const listProductFiter: ProductUpdatePriceType[] = [];
    listProductDiff.forEach((product: DiffRow) => {
      if (product.type !== "only_a" && product.type !== "unchanged") {
        listProductFiter.push({
          code: product.code,
          name: product.name,
          personType: product.personType,
          site_code: product?.site?.code || siteCode,
          publicPrice: product.newPublicPrice || 0,
          unitPrice: product.newUnitPrice || 0,
        });
      }
    });

    if (listProductFiter.length) {
      const result = await updateProductPrices(listProductFiter);
      if (result) {
        toast.success("Đồng bộ dữ liệu thành công");
        setListProductDiff([]);
      }
    }
  };

  const fetchListProduct = async () => {
    if (!siteCode) {
      toast.warning("Vui lòng chọng công viên");
      return;
    }
    setGlobalLoading(true);
    const [dataSun, dataSystem]: any = await getProductToSync(
      siteCode,
      dayjs(new Date()).format(SERVER_DATE_FORMAT)
    );
    const diff = computeDiff(dataSystem, dataSun);
    setListProductDiff(diff);
    setGlobalLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end">
        <div className="">
          <label htmlFor="side" className="mb-1 block text-sm font-medium text-slate-700">
            Công viên
          </label>
          <select
            id="side"
            value={siteCode}
            onChange={(e) => setSiteCode(e.target.value)}
            className={fieldStyle}
          >
            <option value="">Tất cả</option>
            {listSiteOutSystem.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchListProduct}
          style={{ height: 34 }}
          className=" mx-5 rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 mb-5">
        <button
          onClick={handleSync}
          className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Đồng bộ dữ liệu
        </button>
      </div>

      <SyncDiffTable rows={listProductDiff} />
    </div>
  );
}
