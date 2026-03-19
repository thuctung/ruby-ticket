"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export function LoadingGlobal() {
  const { loadingGlobal }: CommonType = useCommonStore((state: any) => state);

  return (
    <Dialog open={loadingGlobal}>
      <DialogContent
        title=""
        className="flex items-center justify-center [&>button]:hidden p-0"
        style={{
          border: "none",
          background: "transparent",
          boxShadow: "none",
          width: "auto",
        }}
      >
        <DialogTitle></DialogTitle>
        <style>{`
          @keyframes bounce-vertical {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }
          .animate-bounce-vertical {
            animation: bounce-vertical 1s infinite;
          }
        `}</style>
        <Image
          width={40}
          height={40}
          src="/logo1.png"
          alt="Logo"
          className="h-10 w-10  animate-bounce-vertical"
        />
      </DialogContent>
    </Dialog>
  );
}
