import { verifyOnePayHash } from "@/lib/onepay";
import { supabaseAdmin } from "./supabase/server";

type OnePayResult = {
  success: boolean;
  order_code?: string;
  response_code?: string;
  error?: string;
};

export async function processOnePayResult(params: Record<string, string>): Promise<OnePayResult> {
  // 1. Verify signature
  if (!verifyOnePayHash(params)) {
    return {
      success: false,
      error: "Invalid signature",
    };
  }

  // 2. Validate required parameters
  const merchTxnRef = params.vpc_MerchTxnRef;
  const merchant = params.vpc_Merchant;
  const orderInfo = params.vpc_OrderInfo;
  const amount = params.vpc_Amount;
  const responseCode = params.vpc_TxnResponseCode;
  const transactionNo = params.vpc_TransactionNo || "";

  if (!merchTxnRef || !merchant || !orderInfo || !amount || !responseCode) {
    return {
      success: false,
      error: "Missing transaction parameters",
    };
  }

  // 3. Verify merchant
  if (merchant !== process.env.ONEPAY_MERCHANT_ID) {
    return {
      success: false,
      error: "Merchant mismatch",
    };
  }

  // 4. Find original payment attempt
  const { data: transaction, error } = await supabaseAdmin
    .from("onepay_transactions")
    .select(
      `
        id,
        order_id,
        order_code,
        amount_vpc,
        status
      `
    )
    .eq("merch_txn_ref", merchTxnRef)
    .maybeSingle();

  if (error || !transaction) {
    return {
      success: false,
      error: "Transaction not found",
    };
  }

  // 5. Validate order and amount
  if (transaction.order_code !== orderInfo || Number(transaction.amount_vpc) !== Number(amount)) {
    return {
      success: false,
      error: "Order or amount mismatch",
    };
  }

  // 6. Do not allow failed attempts to overwrite success
  if (transaction.status === "success") {
    return {
      success: true,
      order_code: transaction.order_code,
      response_code: "0",
    };
  }

  // 7. Process successful payment
  if (responseCode === "0") {
    const { data, error: rpcError } = await supabaseAdmin.rpc("onepay_finalize_payment", {
      p_order_id: transaction.order_id,
      p_merch_txn_ref: merchTxnRef,
      p_response_code: responseCode,
      p_transaction_no: transactionNo,
      p_amount_vpc: Number(amount),
      p_payload: params,
    });

    if (rpcError) {
      console.error("[OnePay Finalize Error]", rpcError);

      return {
        success: false,
        error: "Unable to finalize payment",
      };
    }

    if (!data?.success) {
      return {
        success: false,
        error: "Payment was not confirmed",
        response_code: responseCode,
      };
    }

    return {
      success: true,
      order_code: transaction.order_code,
      response_code: responseCode,
    };
  }

  // 8. Mark unsuccessful attempt as failed
  const { error: updateError } = await supabaseAdmin
    .from("onepay_transactions")
    .update({
      status: "failed",
      response_code: responseCode,
      transaction_no: transactionNo,
      response_payload: params,
      updated_at: new Date().toISOString(),
    })
    .eq("id", transaction.id)
    .eq("status", "pending");

  if (updateError) {
    console.error("[OnePay Failed Attempt]", updateError);

    return {
      success: false,
      error: "Unable to update transaction",
    };
  }

  return {
    success: false,
    order_code: transaction.order_code,
    response_code: responseCode,
  };
}
