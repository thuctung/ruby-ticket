"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type LoadingMessageType = {
  messsage: string;
  loading: boolean;
};

export function LodingMessage({ loading = false, messsage }: LoadingMessageType) {
  return (
    <Dialog open={loading}>
      <DialogContent
        title=""
        className="flex items-center justify-center [&>button]:hidden "
        style={{
          border: "none",
          background: "transparent",
          boxShadow: "none",
          width: "auto",
        }}
      >
        <DialogTitle></DialogTitle>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <p className="text-sm text-gray-600 ">{messsage}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
