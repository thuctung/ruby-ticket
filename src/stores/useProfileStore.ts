import { ACC_STATUS, ROLES } from "@/commons/constant";
import { ProfileType } from "@/types/profile";
import { create } from "zustand";

const initValue: ProfileType = {
  user_id: '',
  email: '',
  username: '',
  full_name: '',
  phone: '',
  address: '',
  role: ROLES.CUSTOMER,
  status: ACC_STATUS.PENDING,
}

export type ProfileStoteType = {
  profile: ProfileType,
  errorMessage: string,
  isLogin: boolean
}

export const useProfileStore = create((set) => ({
  profile: initValue,
  errorMessage: '',
  isLogin: false,

  setProfile: (value: ProfileType) => set((state: ProfileStoteType) => ({ ...state, profile: value })),

  setErrorMessage: (value: string) => set((state: ProfileStoteType) => ({ ...state, errorMessage: value })),

  setLoading: (value: string) => set((state: ProfileStoteType) => ({ ...state, isLogin: value })),

  logout: () =>
    set((state:any) => ({
      ...state,
      profile:initValue,
      errorMessage:''
    })),
}));