import { CommonType } from "@/types";
import { create } from "zustand";


export const useCommonStore = create((set) => ({
 
   loadingGlobal: false,

   messageToast: '',

  setGlobalLoading: (value: string) => set((state: CommonType) => ({ ...state, loadingGlobal: value })),

  setToastMessage: (value: string) => set((state: CommonType) => ({ ...state, messageToast: value })),

}));



