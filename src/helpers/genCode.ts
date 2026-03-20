import { TYPE_TRANSFER } from "@/commons/constant";
import { customAlphabet } from "nanoid";

const key: string = process.env.NEXT_PUBLIC_GEN_CODE_TOPUP || "";

export const nanoid = customAlphabet(key, 12);

export const getCodeTopup = (prex = TYPE_TRANSFER.AFF) => `${prex}${nanoid()}`;
