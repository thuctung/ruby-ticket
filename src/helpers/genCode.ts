import { TYPE_TRANSFER } from "@/commons/constant";
import { ProductBanaType, ResultListProductType } from "@/types/ticket";
import { customAlphabet } from "nanoid";

const key: string = process.env.NEXT_PUBLIC_GEN_CODE_TOPUP || "";

export const nanoid = customAlphabet(key, 12);

export const getCodeTopup = (prex = TYPE_TRANSFER.AFF) => `${prex}${nanoid()}`;

const PERSON_TYPE_ORDER = ["ADULT", "SENIORS", "CHILD", "U25"];

const LIST_PRODUCT_CUSTOM = {
  ["7291302E-D73E-3802-4D29-01954640CFB2"]: 1,
  ["D8C45D26-BEDC-6817-4638-01954640AA36"]: 1,
  ["E2300E78-815E-EDD6-48AD-01954640B753"]: 1,
  ["72234F87-DC83-48D3-41BA-01954640925C"]: 1,
  ["EC984FE8-9A38-56B2-02EB-019B569AFA36"]: 1,
  ["C2F74D42-3A86-765A-4FAB-01954640DC5E"]: 1,
  ["CCE114EA-63D6-A654-4709-01954640AE79"]: 1,
  ["AC13DF90-1886-0B61-5859-019546410BD0"]: 1,
  ["6B6F8E3C-A9A0-6C50-46A0-01954640AC57"]: 1,
  ["D44091AB-284C-5330-47DE-01954640B2F4"]: 1,
  ["FF002473-7CB0-72C1-4E6E-01954640D5F4"]: 1,
  ["A862C95A-6CB4-1875-4D98-01954640D1B0"]: 1,
  ["E2919353-C2AA-25F5-4F42-01954640DA2B"]: 1,
  ["36D29FF9-4642-9A90-51BA-01954640E73C"]: 1,
  ["F622CB3A-77AE-DF08-4224-01954640947F"]: 1,
  ["6678FBF0-0E86-37D8-4981-01954640BBCE"]: 1,
  ["26913750-EB96-4D7B-36D6-0195A38A8973"]: 1,
  ["B7C3FB38-D755-0BB2-623D-01956A507831"]: 1,
  ["C03A672C-DE1A-09A8-1E87-019F2ABF6FE3"]: 1,
  ["D0754CD4-0CC9-4D3D-74ED-019F2AC16E44"]: 1,
  ["16C331DE-1413-8E14-42BC-019F2ACB8E03"]: 1,
};

export const groupTicketSunGroup = (tickets: any[]) => {
  const nearlyTicket: any = [];

  const grouped = Object.entries(
    tickets.reduce(
      (acc, item) => {
        if (LIST_PRODUCT_CUSTOM[item.code as keyof typeof LIST_PRODUCT_CUSTOM]) {
          nearlyTicket.push(item);
        } else {
          (acc[item.personType] ??= []).push(item);
        }
        return acc;
      },
      {} as Record<string, typeof tickets>
    )
  )
    .map(([personType, items]: any) => {
      const res: ResultListProductType = {
        personType,
        ticket: items,
      };
      return res;
    })
    .sort((a, b) => {
      const aIndex = PERSON_TYPE_ORDER.indexOf(a.personType);
      const bIndex = PERSON_TYPE_ORDER.indexOf(b.personType);

      // Cả 2 đều không có trong danh sách => giữ nguyên thứ tự
      if (aIndex === -1 && bIndex === -1) return 0;

      // a là loại mới => xuống cuối
      if (aIndex === -1) return 1;

      // b là loại mới => xuống cuối
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });
  if (nearlyTicket.length) {
    return [{ personType: "BEST_SELLER", ticket: nearlyTicket }, ...grouped];
  }
  return grouped;
};
