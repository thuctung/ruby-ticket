import api from "@/axios";
import {
  DELETE_SITE_IMAGE,
  GET_ALL_SITE,
  GET_COMPANYS,
  GET_LOCATIONS,
  REBUILD_SERVER,
  UPDATE_SITE,
} from "@/commons/apiURL";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, SearchTableType } from "@/types";
import { SearchSiteType, SiteType } from "./type";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { get } from "lodash";
import { DB_TABLE_NAME } from "@/commons/constant";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getAllSiteMgt = async (params: SearchTableType<SearchSiteType>) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(GET_ALL_SITE, params);
    if (data) {
      const result = data.map((site: SiteType) => ({
        ...site,
        link_image_site: site.link_image_site?.map((image: any) => image.url) ?? [],
      }));
      return result;
    }
    return [];
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const getCompanyAndLoaction = async () => {
  try {
    setGlobalLoading(true);
    const [resComp, resLocation] = await Promise.all([
      api.get(GET_COMPANYS),
      api.get(GET_LOCATIONS),
    ]);
    const companysData = get(resComp, ["data", "data"]) || [];
    const loactionsData = get(resLocation, ["data", "data"]) || [];

    return { companysData, loactionsData };
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const updateSite = async (params: SiteType) => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(UPDATE_SITE, params);
    return data;
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

export const rebuildSerVer = async () => {
  try {
    setGlobalLoading(true);
    const { data } = await api.post(REBUILD_SERVER, {});
    return data;
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  } finally {
    setGlobalLoading(false);
  }
};

const clientSupbase = createSupabaseBrowserClient();

export async function uploadSiteImage(file: File, siteCode: string) {
  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `sites/${siteCode}/${fileName}`;

  const { data, error } = await clientSupbase.storage
    .from(DB_TABLE_NAME.STORAGE_IMAGE)
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data: urlData } = clientSupbase.storage.from("images").getPublicUrl(data.path);

  const { error: dbError } = await clientSupbase.from(DB_TABLE_NAME.LINK_IMAGE_SITE).insert({
    site_code: siteCode,
    url: urlData.publicUrl,
  });

  if (dbError) {
    throw dbError;
  }

  return urlData.publicUrl;
}

export async function deleteSiteImage(imageUrl: string, siteCode: string) {
  try {
    const marker = "/object/public/images/";
    const filePath = decodeURIComponent(new URL(imageUrl).pathname.split(marker)[1] || "");
    const { data } = await api.post(DELETE_SITE_IMAGE, { imageUrl, siteCode, filePath });
    return data;
  } catch (error: any) {
    setToastMessage(error.message || "Có lỗi xảy ra");
  }
}
