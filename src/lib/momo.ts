import crypto from "crypto";

export type MomoParams = Record<string, string | undefined>;

export function verifyMomoSignature(p: MomoParams) {
  const accessKey = process.env.MOMO_ACCESS_KEY!;
  const secretKey = process.env.MOMO_SECRET_KEY!;

  const raw =
    `accessKey=${accessKey}&amount=${p.amount}&extraData=${p.extraData ?? ""}` +
    `&message=${p.message}&orderId=${p.orderId}&orderInfo=${p.orderInfo}` +
    `&orderType=${p.orderType}&partnerCode=${p.partnerCode}&payType=${p.payType}` +
    `&requestId=${p.requestId}&responseTime=${p.responseTime}` +
    `&resultCode=${p.resultCode}&transId=${p.transId}`;

  const expected = crypto.createHmac("sha256", secretKey).update(raw).digest("hex");
  return expected === p.signature;
}
