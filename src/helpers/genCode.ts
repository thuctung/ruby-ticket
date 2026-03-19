import { customAlphabet } from "nanoid";

const key: string = process.env.NEXT_PUBLIC_GEN_CODE_TOPUP || "";

export const nanoid = customAlphabet(key, 12);

export const getCodeTopup = (prex = "AF") => prex + nanoid();
