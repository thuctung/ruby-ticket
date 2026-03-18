import { CommonType } from "@/types";
import { LocationType } from "@/types/ticket";
import { create } from "zustand";


export const useClienttore = create((set) => ({

   locations: [] as LocationType [],

  setLocationClient: (value: string) => set((state: CommonType) => ({ ...state, locations: value })),

}));



