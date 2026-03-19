import { BANK_INFO } from "@/commons/constant";

export const getBankInfo = (amount: number, code: string) => {
  return `https://img.vietqr.io/image/${BANK_INFO.bankName}-${BANK_INFO.bankNum}-compact.png?amount=${amount}&addInfo=${code}&accountName=${BANK_INFO.bankAccName}`;
};
