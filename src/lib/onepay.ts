import { createHmac, timingSafeEqual } from "node:crypto";

type OnePayParams = Record<string, string>;

function getSecret(): Buffer {
  const secret = process.env.ONEPAY_SECURE_SECRET;

  if (!secret || !/^[a-fA-F0-9]+$/.test(secret) || secret.length % 2 !== 0) {
    throw new Error("Invalid OnePay Secure Secret");
  }

  return Buffer.from(secret, "hex");
}

function getHashString(params: OnePayParams): string {
  return Object.keys(params)
    .filter(
      (key) =>
        (key.startsWith("vpc_") || key.startsWith("user_")) &&
        key !== "vpc_SecureHash" &&
        key !== "vpc_SecureHashType"
    )
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
}

export function createOnePayHash(params: OnePayParams): string {
  return createHmac("sha256", getSecret())
    .update(getHashString(params), "utf8")
    .digest("hex")
    .toUpperCase();
}

export function verifyOnePayHash(params: OnePayParams): boolean {
  const receivedHash = params.vpc_SecureHash;

  if (!receivedHash || !/^[a-fA-F0-9]{64}$/.test(receivedHash)) {
    return false;
  }

  const expectedHash = createOnePayHash(params);

  const received = Buffer.from(receivedHash, "hex");
  const expected = Buffer.from(expectedHash, "hex");

  return received.length === expected.length && timingSafeEqual(received, expected);
}

export function buildOnePayUrl(params: OnePayParams): string {
  const paymentUrl = process.env.ONEPAY_PAYMENT_URL;

  if (!paymentUrl) {
    throw new Error("Missing ONEPAY_PAYMENT_URL");
  }

  const signedParams = {
    ...params,
    vpc_SecureHash: createOnePayHash(params),
  };

  const url = new URL(paymentUrl);

  Object.entries(signedParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}

export function getOnePayParams(searchParams: URLSearchParams): OnePayParams {
  const result: OnePayParams = {};

  searchParams.forEach((value, key) => {
    if (key.startsWith("vpc_") || key.startsWith("user_")) {
      result[key] = value;
    }
  });

  return result;
}

export function getOnePayConfig() {
  const merchantId = process.env.ONEPAY_MERCHANT_ID;
  const accessCode = process.env.ONEPAY_ACCESS_CODE;
  const returnUrl = process.env.ONEPAY_RETURN_URL;
  const ipnUrl = process.env.ONEPAY_IPN_URL;

  if (!merchantId || !accessCode || !returnUrl || !ipnUrl) {
    throw new Error("Missing OnePay configuration");
  }

  return {
    merchantId,
    accessCode,
    returnUrl,
    ipnUrl,
  };
}
