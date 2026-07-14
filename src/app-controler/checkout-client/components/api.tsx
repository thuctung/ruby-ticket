import { draftDataSide } from "@/app-controler/affi/getTicket/draftDataTicket";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";

const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

export const getSideListSun = async () => {
  try {
    setGlobalLoading(true);
    // const data: any = await sunApi.get(`/ota/site/listing`, {
    //   params: {
    //     lang: "vi",
    //   },
    // });
    const data = draftDataSide;
    return data.result;
  } catch (e) {
    setToastMessage("Có lỗi xảy ra! Thử lại sau");
  } finally {
    setGlobalLoading(false);
  }
};
