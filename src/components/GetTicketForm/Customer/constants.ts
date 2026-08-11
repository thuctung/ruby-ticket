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
  if (siteCode === "BNC") {
    return ftBaNA;
  } else if (siteCode === "NUITHANTAI") {
    return ftNTT;
  }
  return orther;
};

export const getBgImg = (personType: string, siteCode: string) => {
  if (siteCode === "BNC") {
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
  } else if (siteCode === "NUITHANTAI") {
    return "/nui-than-tai-3.webp";
  } else {
    return "";
  }
};

export const geNoteSiteCode = (siteCode: string) => {
  switch (siteCode) {
    case "BNC":
      return "";
    case "NUITHANTAI":
      return "Miễn phí vé với trẻ em dưới 1 met (đi kèm người lớn)";
    case "DUTHUYEN":
      return "Miễn phí vé với trẻ em dưới 1 tuổi (đi kèm người lớn)";
    default:
      return "";
  }
};
