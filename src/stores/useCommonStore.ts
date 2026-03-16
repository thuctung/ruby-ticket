import { CommonType } from "@/types";
import { create } from "zustand";


export const useCommonStore = create((set) => ({
 
   loadingGlobal: false,

   messageToast: '',

   confirm:{
    message:'',
    okFunc: null
   },

  setGlobalLoading: (value: string) => set((state: CommonType) => ({ ...state, loadingGlobal: value })),

  setToastMessage: (value: string) => set((state: CommonType) => ({ ...state, messageToast: value })),

  showConfirm:(value:string) => set((state: CommonType) => ({ ...state, confirm: value })),

}));



