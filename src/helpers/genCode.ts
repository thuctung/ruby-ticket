import { TYPE_TRANSFER } from "@/commons/constant";
import { ProductBanaType, ResultListProductType } from "@/types/ticket";
import { customAlphabet } from "nanoid";

const key: string = process.env.NEXT_PUBLIC_GEN_CODE_TOPUP || "";

export const nanoid = customAlphabet(key, 12);

export const getCodeTopup = (prex = TYPE_TRANSFER.AFF) => `${prex}${nanoid()}`;

export const groupTicketSunGroup = (tickets: any[]) => {
  const grouped = Object.entries(
    tickets.reduce(
      (acc, item) => {
        (acc[item.personType] ??= []).push(item);
        return acc;
      },
      {} as Record<string, typeof tickets>
    )
  ).map(([personType, items]: any) => {
    const res: ResultListProductType = {
      personType,
      ticket: items,
    };
    return res;
  });

  return grouped;
};
