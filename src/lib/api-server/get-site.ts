import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export const getSites = async () => {
  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.SITES)
    .select(
      `code, name, ko,zh,en, status, pre_price,description_vi,description_en,description_zh,description_ko,location:location(code,name,en,zh,ko), link_image_site ( url)`
    )
    .order("order", { ascending: true });

  if (error) {
    throw new Error(error.message); // để build fail thay vì cache trang rỗng
  }

  return { data: data ?? [] };
};

export const getSitesHomePage = async () => {
  const { data, error } = await supabaseAdmin
    .from(DB_TABLE_NAME.SITES)
    .select(`* , link_image_site ( url)`)
    .order("order", { ascending: true })
    .limit(6);

  if (error) {
    throw new Error(error.message);
  }

  return { data: data ?? [] };
};
