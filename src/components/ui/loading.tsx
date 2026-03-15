"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";
import { Loader2 } from "lucide-react"


export function LoadingGlobal() {
      const { loadingGlobal }: CommonType = useCommonStore((state: any) => state);

  return (
    <Dialog open={loadingGlobal}>
      <DialogContent title="" className="flex items-center justify-center p-10">
       <DialogTitle className="sr-only">Loading</DialogTitle>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">
          Loading...
        </span>
      </DialogContent>
    </Dialog>
  )
}