import { CommonType } from "@/types";
import { SiteType } from "@/types/ticket";
import { create } from "zustand";

export const useClienttore = create((set) => ({
  sites: [] as SiteType[],

  setLocationClient: (value: string) => set((state: CommonType) => ({ ...state, sites: value })),
}));
