"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { AgentType } from "@/types";
import { SideSunGroupType } from "@/types/ticket";
import { formatVND } from "@/helpers/money";
import { AgentPriceSubmitType } from "../type";

export interface EditUserLevelDialogProps {
  open: boolean;
  onClose: () => void;
  listSide: SideSunGroupType[];
  agentList: AgentType[];
  onSubmit: (value: AgentPriceSubmitType) => void;
}

export default function CreatePriceForm({
  open,
  onClose,
  listSide,
  agentList,
  onSubmit,
}: EditUserLevelDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<AgentPriceSubmitType>({
    site_code: "",
    agent_code: "",
    price: 0,
  });

  const handleChangeForm = (key: string, value: any) => {
    setFormData((pre) => ({ ...pre, [key]: value }));
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (loading) return;
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-level-title"
    >
      <div
        ref={panelRef}
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#C81418] to-[#8C0E11] px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            aria-label="Đóng"
            className="absolute right-3 top-3 rounded-full p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 id="edit-level-title" className="text-base font-bold text-white">
            Tạo giá agent
          </h2>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5">
          <label className="mb-1.5 block text-xs font-medium text-gray-500">Khu vực</label>
          <div className="relative mb-5">
            <select
              value={formData.site_code}
              onChange={(e) => handleChangeForm("site_code", e.target.value)}
              disabled={loading}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-[#2A1414] outline-none transition focus:border-[#C81418] focus:ring-2 focus:ring-red-100 disabled:opacity-60"
            >
              {listSide.map((lv) => (
                <option key={lv.code} value={lv.code}>
                  {lv.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <label className="mb-1.5 block text-xs font-medium text-gray-500">Level</label>
          <div className="relative mb-5">
            <select
              value={formData.agent_code}
              onChange={(e) => handleChangeForm("agent_code", e.target.value)}
              disabled={loading}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-[#2A1414] outline-none transition focus:border-[#C81418] focus:ring-2 focus:ring-red-100 disabled:opacity-60"
            >
              {agentList.map((lv) => (
                <option key={lv.code} value={lv.code}>
                  {lv.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <label className="mb-1.5 block text-xs font-medium text-gray-500">Giá cộng thêm</label>
          <div className="relative ">
            <input
              value={formData.price}
              type="number"
              min={0}
              onChange={(e) => handleChangeForm("price", e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-[#2A1414] outline-none transition focus:border-[#C81418] focus:ring-2 focus:ring-red-100 disabled:opacity-60"
            />
            <div className="text-right">
              <span className=" text-xs">{formatVND(formData.price)}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-[#C81418] to-[#8C0E11] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Đang lưu..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
