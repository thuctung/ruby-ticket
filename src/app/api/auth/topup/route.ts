import { BANK_INFO } from "@/commons/constant"
import { NextResponse } from "next/server"



export async function POST(req: Request) {
  const { amount , code} = await req.json()

  const qr = `https://img.vietqr.io/image/${BANK_INFO.bankName}-${BANK_INFO.bankNum}-compact.png?amount=${amount}&addInfo=${code}&accountName=${BANK_INFO.bankAccName}`

  return NextResponse.json({
    code,
    amount,
    qr
  })
}