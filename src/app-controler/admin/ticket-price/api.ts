import api from "@/axios";
import {
  DELETE_PRODUCT,
  GET_PRODUCT_CATEGORY,
  GET_PRODUCT_PARAMS,
  GET_SITE_BY_STATUS,
  UPDATE_PRODUCT,
} from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, SearchTableType } from "@/types";
import { ProductType, SearchProductType } from "./type";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getSiteAndCategory = async () => {
  try {
    setGlobalLoading(true);
    const [{ data: sites }, { data: categories }] = await Promise.all([
      api.post(GET_SITE_BY_STATUS, { status: undefined, in_system: true }),
      api.get(GET_PRODUCT_CATEGORY),
    ]);
    return { sites, categories };
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getProductInSystem = async (params: SearchTableType<SearchProductType>) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(GET_PRODUCT_PARAMS, params);
    return data;
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateProduct = async (params: ProductType) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(UPDATE_PRODUCT, params);
    return data;
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const deleteProduct = async (id: string) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(DELETE_PRODUCT, { id });
    return data;
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};
