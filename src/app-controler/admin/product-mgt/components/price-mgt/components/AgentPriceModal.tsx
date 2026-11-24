"use client";

import { useState } from "react";

import { AgentType } from "@/types";
import {
  DISCOUNT_TYPE_PRICE,
  getNoteTextDiscount,
  getSideItem,
  LIST_OPTION_DISCOUNT,
} from "@/app-controler/admin/product-mgt/contants";
import { formatVND } from "@/lib/money";
import { ProductBanaType, SiteType } from "@/types/ticket";
import { AgentPriceAndTypeSubmit } from "@/app-controler/admin/product-mgt/type";
import { updateAgentPriceAndType } from "@/app-controler/admin/product-mgt/api";
import { toast } from "react-toastify";

type Row = { type: string; price: string };

type Props = {
  listSite: SiteType[];
  listAgent: AgentType[];
  product: ProductBanaType;
  prices?: AgentPriceAndTypeSubmit[];
  onClose: () => void;
};

export default function AgentPriceModal({ listSite, listAgent, product, prices, onClose }: Props) {
  const [saving, setSaving] = useState(false);

  const [rows, setRows] = useState<Record<string, Row>>(() => {
    const init: Record<string, Row> = {};
    for (const agent of listAgent) {
      const p = prices?.find((price) => price.agent_code === agent.code);
      init[agent.code] = {
        type: p?.type ?? DISCOUNT_TYPE_PRICE.ADD_PRICE,
        price: p ? String(p.price) : "",
      };
    }
    return init;
  });
  const onChangeValue = (code: string, field: keyof Row, value: string) =>
    setRows((prev) => ({ ...prev, [code]: { ...prev[code], [field]: value } }));

  const handleSave = async () => {
    setSaving(true);
    const payload: AgentPriceAndTypeSubmit[] = [];
    Object.keys(rows).forEach((key) => {
      if (Number(rows[key].price) >= 0) {
        payload.push({
          site_code: product.site_code,
          product_code: product.code,
          agent_code: key,
          price: Number(rows[key].price),
          type: rows[key].type,
        });
      }
    });
    const result = await updateAgentPriceAndType(payload);
    if (result) {
      toast.success("Cập nhật giá thành công");
      setSaving(false);
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
      >
        <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
          {product.name}
        </h2>
        <p className="text-sm text-slate-500">{getSideItem(product.site_code, listSite)?.name}</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 rounded-md bg-slate-50 p-3 text-sm">
          <div>
            <dt className="text-slate-500">Giá công bố</dt>
            <dd className="font-medium tabular-nums text-slate-900">
              {formatVND(product.publicPrice)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Giá đại lý</dt>
            <dd className="font-medium tabular-nums text-slate-900">
              {formatVND(product.unitPrice)}
            </dd>
          </div>
        </dl>
        <div className="max-h-[335px] overflow-y-auto md:max-h-[500px]">
          {listAgent.map((item) => (
            <div key={item.code} className="rounded-md border border-slate-300 my-4 p-3">
              <label className="text-sm font-medium text-slate-700">{item.name}</label>
              <div className="flex justify-between flex-col md:flex-row">
                <select
                  value={rows[item.code].type}
                  onChange={(e) => onChangeValue(item.code, "type", e.target.value)}
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                >
                  {LIST_OPTION_DISCOUNT.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <div className="flex flex-col justify-end mt-2 md:mt-0">
                  <input
                    autoFocus
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={rows[item.code].price}
                    onChange={(e) => onChangeValue(item.code, "price", e.target.value)}
                    className="h-10 text-right rounded-md border border-slate-300 px-3 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                  />
                  <span className="text-right text-[11px] text-[#2786ff] mt-2">
                    {getNoteTextDiscount(
                      item.code,
                      Number(rows[item.code].price || 0),
                      rows[item.code].type
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-slate-300 px-4 text-sm text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-10 rounded-md bg-teal-700 px-5 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
