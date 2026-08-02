"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ProfileType } from "@/types";
import { Input } from "@/components/ui/input";
import { formatVND } from "@/lib/money";

export interface AddMoneyDialogProps {
  open: boolean;
  curentUser: ProfileType;
  onClose: () => void;
  onSubmit: (money: number) => void;
}

export default function AddMoneyDialog({
  open,
  curentUser,
  onClose,
  onSubmit,
}: AddMoneyDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState(1000000);
  const [loading, setLoading] = useState(false);

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
      await onSubmit(amount);
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
            Nạp tiền cho nhân viên: {curentUser.full_name}
          </h2>
          <p className="mt-0.5 text-xs text-white/70">Email:{curentUser.email}</p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5">
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Số tiền: {formatVND(amount)}
          </label>
          <Input
            id="amount"
            type="number"
            inputMode="numeric"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <div className="mt-6 flex justify-end gap-2">
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
