import { SITE_CODES } from "@/commons/constant";
import {
  DoorOpen,
  CableCar,
  Compass,
  Landmark,
  Waves,
  Snowflake,
  CloudSun,
  FerrisWheel,
  Flower2,
  TreePine,
  Music,
  Bike,
  Sparkles,
} from "lucide-react";

const ftNTT = ["Vào cổng", "Tham quan", "Đền thờ", "Trượt ván"];
const ftBaNA = ["Vườn hoa", "Cáp treo khứ hồi", "Vòng quay", "Biểu diễn"];

const orther = ["Trải nghiệm đặc biệt", "Biểu diễn"];

const CONTROIDG = ["Trải nghiệm đặc biệt", "Rừng thông", "Vườn hoa", "Cáp treo khứ hồi"];

export const FEATURE_ICON_BANA: Record<string, React.ElementType> = {
  "Vào cổng": DoorOpen,
  "Cáp treo khứ hồi": CableCar,
  "Tham quan": Compass,
  "Trượt tuyết": Snowflake,
  "Săn mây": CloudSun,
  "Vòng quay": FerrisWheel,
  "Vườn hoa": Flower2,
  "Biểu diễn": Music,
  "Trải nghiệm đặc biệt": Sparkles,
  "Đền thờ": Landmark,
  "Tắm khoáng": Waves,
  "Trượt ván": Bike,
  "Rừng thông": TreePine,
};

export const featues = (siteCode: string) => {
  switch (siteCode) {
    case SITE_CODES.BANAHILL: {
      return ftBaNA;
    }
    case SITE_CODES.NUITHANTAI: {
      return ftNTT;
    }
    case SITE_CODES.CONGTROI: {
      return CONTROIDG;
    }
    default: {
      return orther;
    }
  }
};

export const getBgImg = (personType: string, siteCode: string) => {
  if (siteCode === SITE_CODES.BANAHILL) {
    switch (personType) {
      case "ADULT":
        return "/ba-na-lon.jpg";
      case "SENIOR":
        return "/ba-na-gia.jpg";
      case "CHILD":
        return "/ba-na-nho.jpg";
      default:
        return "/bana2.jpg";
    }
  } else if (siteCode === SITE_CODES.NUITHANTAI) {
    return "/nui-than-tai-3.webp";
  } else if (siteCode === SITE_CODES.DUTHUYEN) {
    return "/cau-rong.png";
  } else if (siteCode === SITE_CODES.KWHOIAN) {
    return "/hoi-an-banner.jpg";
  } else if (siteCode === SITE_CODES.CONGTROI) {
    return "/cong-troi-banner.webp";
  } else {
    return "";
  }
};
export const geNoteSiteCode = (siteCode: string) => {
  switch (siteCode) {
    case SITE_CODES.BANAHILL:
      return "Trẻ từ 1m đến 1m4 tính vé Trẻ em, Người cao tuổi đủ 70 tuổi trở lên, miễn phí trẻ dưới 1m.";
    case SITE_CODES.NUITHANTAI:
      return "Trẻ từ 1m đến 1m4 tính vé Trẻ em, miễn phí trẻ dưới 1m(đi kèm người lớn)";
    case SITE_CODES.DUTHUYEN:
      return "Miễn phí vé với trẻ em dưới 1 tuổi (Thêm vào đơn để được xếp chỗ ngồi)";
    default:
      return "";
  }
};
