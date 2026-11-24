import api from "@/axios";
import {
  GET_AGENT_PRICE,
  GET_CATEGORY,
  GET_PRICE_AGENT_DEFAULT,
  GET_PRODUCT_FILTER,
  GET_PRODUCT_IN_SYSTEM,
  SUN_GET_PRODOCT_LIST,
  UPDATE_AGENT_PRICE_AND_TYPE,
  UPDATE_PRICE_AGENT_DEFAULT,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_PRICES,
} from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, SearchTableType } from "@/types";
import {
  AgentPriceAndTypeSubmit,
  AgentPriceDefaultSubmit,
  ProductUpdatePriceType,
  SearchProductType,
} from "./type";
import { ProductType } from "@/types/ticket";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getProductToSync = async (siteCodes: string, date: string) => {
  try {
    const [dataSun, dataSystem] = await Promise.all([
      api.post(SUN_GET_PRODOCT_LIST, {
        siteCodes,
        date,
      }),
      api.post(GET_PRODUCT_IN_SYSTEM, { site_code: siteCodes }),
    ]);

    if (dataSun.data.result && dataSystem.data) {
      return [dataSun.data.result, dataSystem.data];
    }
    return [];
  } catch (e) {
    setGlobalLoading(false);
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  }
};

export const updateProductPrices = async (listProducts: ProductUpdatePriceType[]) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(UPDATE_PRODUCT_PRICES, {
      listProducts,
    });

    if (data.errors?.[0]) {
      setToastMessage(data.errors?.[0]);
    }
    return true;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getProductByFilter = async (params: SearchTableType<SearchProductType>) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(GET_PRODUCT_FILTER, params);

    if (data.errors?.[0]) {
      setToastMessage(data.errors?.[0]);
    }
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateAgentPriceAndType = async (litsPrice: AgentPriceAndTypeSubmit[]) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(UPDATE_AGENT_PRICE_AND_TYPE, litsPrice);

    if (data.errors?.[0]) {
      setToastMessage(data.errors?.[0]);
    }
    return true;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getListAgentPrice = async (site_code: string, product_code: string) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(GET_AGENT_PRICE, { site_code, product_code });
    if (data.errors?.[0]) {
      setToastMessage(data.errors?.[0]);
    }
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getListAgentPriceDefault = async (site_code: string) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(GET_PRICE_AGENT_DEFAULT, { site_code });
    if (data.errors?.[0]) {
      setToastMessage(data.errors?.[0]);
    }
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const saveAgentPriceDefault = async (listAgentPriceDefault: AgentPriceDefaultSubmit[]) => {
  try {
    setGlobalLoading(true);
    const { data }: any = await api.post(UPDATE_PRICE_AGENT_DEFAULT, listAgentPriceDefault);
    if (data.errors?.[0]) {
      setToastMessage(data.errors?.[0]);
    }
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getListCategory = async (loading = true) => {
  try {
    if (loading) {
      setGlobalLoading(true);
    }
    const { data }: any = await api.get(GET_CATEGORY);
    return data;
  } catch (error) {
    setToastMessage("Có lỗi xảy ra");
  } finally {
    if (loading) {
      setGlobalLoading(false);
    }
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
