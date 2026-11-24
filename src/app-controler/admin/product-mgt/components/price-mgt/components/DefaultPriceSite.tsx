"use client";

import { useState } from "react";

import { AgentType } from "@/types";
import {
  getNoteTextDiscountDefault,
  getSideItem,
} from "@/app-controler/admin/product-mgt/contants";
import { SiteType } from "@/types/ticket";
import { AgentPriceDefaultSubmit } from "@/app-controler/admin/product-mgt/type";
import { saveAgentPriceDefault } from "@/app-controler/admin/product-mgt/api";
import { toast } from "react-toastify";
import { get } from "lodash";

type Props = {
  listSite: SiteType[];
  siteCode?: string;

  listAgent: AgentType[];
  prices?: AgentPriceDefaultSubmit[];
  onClose: () => void;
};

export default function DefaultPriceModal({
  listSite,
  siteCode,
  listAgent,
  prices,
  onClose,
}: Props) {
  const [saving, setSaving] = useState(false);

  const [rows, setRows] = useState<object>(() => {
    const init: any = {};
    for (const agent of listAgent) {
      const price = prices?.find((price) => price.agent_code === agent.code)?.price;
      init[agent.code] = price || 0;
    }
    return init;
  });
  const onChangeValue = (code: string, value: number) =>
    setRows((prev) => ({ ...prev, [code]: value }));

  const handleSave = async () => {
    if (!siteCode) return;
    setSaving(true);
    const params: AgentPriceDefaultSubmit[] = [];
    Object.keys(rows).forEach((key) => {
      params.push({
        price: get(rows, key),
        agent_code: key,
        site_code: siteCode,
      });
    });

    const result = await saveAgentPriceDefault(params);
    setSaving(false);
    if (result) {
      toast.success("Cập nhật thành công");
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
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      >
        <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
          Công viên: {siteCode ? getSideItem(siteCode, listSite)?.name : null}
        </h2>
        <div className="max-h-[335px] overflow-y-auto md:max-h-[500px]">
          {listAgent.map((item) => (
            <div key={item.code} className="rounded-md border border-slate-300 my-4 p-3">
              <label className="text-sm font-medium text-slate-700">{item.name}</label>
              <div className="flex justify-between flex-col ">
                <div className="flex flex-col justify-end mt-2 md:mt-0">
                  <input
                    autoFocus
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={get(rows, item.code)}
                    onChange={(e) => onChangeValue(item.code, Number(e.target.value))}
                    className="h-10 text-right rounded-md border border-slate-300 px-3 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                  />
                  <span className="text-right text-[11px] text-[#2786ff] mt-2">
                    {getNoteTextDiscountDefault(item.code, Number(get(rows, item.code) || 0))}
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
