import { BEST_SELLER, TYPE_TRANSFER } from "@/commons/constant";
import { ResultListProductType } from "@/types/ticket";
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
  ["CCE114EA-63D6-A654-4709-01954640AE79"]: 1,
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
  ["7F179022-B863-A5AE-55D7-01954640FCC5"]: 1,
  ["8A10504F-FAE8-8451-57EE-019546410985"]: 1,
  ["F0D9C0CD-61B5-972C-5716-0195464103DF"]: 1,
  ["5E8483C1-259F-617D-563F-01954640FF05"]: 1,
  ["A8BE0FB5-AB16-8B40-50E9-01954640E2E8"]: 1,
  ["67AD118B-D334-E53A-56A9-019546410185"]: 1,
  ["8E6C4D28-60FA-A2F3-4150-019546409011"]: 1,
  ["F2408218-A6D5-F736-054C-0195463F28A1"]: 1,
  ["64E2F7D9-97F0-7310-4E04-01954640D3CF"]: 1,
  ["C522BC15-0B7A-B290-4917-01954640B983"]: 1,
  ["8903DC30-9806-3E68-5151-01954640E519"]: 1,
};

export const groupTicketSunGroup = (tickets: any[]) => {
  const nearlyTicket: any = [];

  const grouped = Object.entries(
    tickets.reduce(
      (acc, item) => {
        const newItem = { ...item, site_code: item?.site?.code || item.site_code };
        if (LIST_PRODUCT_CUSTOM[item.code as keyof typeof LIST_PRODUCT_CUSTOM]) {
          nearlyTicket.push(newItem);
        } else {
          (acc[item.personType] ??= []).push(newItem);
        }
        return acc;
      },
      {} as Record<string, typeof tickets>
    )
  )
    .map(([personType, items]: any) => {
      const res: ResultListProductType = {
        personType,
        ticket: items.sort((a: any, b: any) => a?.order - b?.order),
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
    return [{ personType: BEST_SELLER, ticket: nearlyTicket }, ...grouped];
  }
  return grouped;
};
