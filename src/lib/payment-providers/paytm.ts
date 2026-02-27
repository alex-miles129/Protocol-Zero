import PaytmChecksum from 'paytmchecksum';

const PAYTM_MID = process.env.PAYTM_MID || '';
const PAYTM_MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY || '';
const PAYTM_WEBSITE = process.env.PAYTM_WEBSITE || 'WEBSTAGING';
const PAYTM_CALLBACK_URL = process.env.PAYTM_CALLBACK_URL || '';
const PAYTM_ENV = process.env.PAYTM_ENV || 'staging';

const PAYTM_HOST =
  PAYTM_ENV === 'production' ? 'https://securegw.paytm.in' : 'https://securegw-stage.paytm.in';

function assertPaytmConfig() {
  if (!PAYTM_MID || !PAYTM_MERCHANT_KEY) {
    throw new Error('PAYTM_MID or PAYTM_MERCHANT_KEY is not configured');
  }
}

export async function initiatePaytmTransaction(params: {
  orderId: string;
  amount: number;
  customerId: string;
  mobile?: string;
  email?: string;
  callbackUrl?: string;
}) {
  assertPaytmConfig();

  const callbackUrl =
    params.callbackUrl ||
    PAYTM_CALLBACK_URL ||
    `${PAYTM_HOST}/theia/paytmCallback?ORDER_ID=${encodeURIComponent(params.orderId)}`;

  const requestBody = {
    requestType: 'Payment',
    mid: PAYTM_MID,
    websiteName: PAYTM_WEBSITE,
    orderId: params.orderId,
    callbackUrl,
    txnAmount: {
      value: params.amount.toFixed(2),
      currency: 'INR',
    },
    userInfo: {
      custId: params.customerId,
      mobile: params.mobile || '',
      email: params.email || '',
    },
  };

  const signature = await PaytmChecksum.generateSignature(
    JSON.stringify(requestBody),
    PAYTM_MERCHANT_KEY
  );

  const response = await fetch(
    `${PAYTM_HOST}/theia/api/v1/initiateTransaction?mid=${PAYTM_MID}&orderId=${params.orderId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: requestBody,
        head: {
          signature,
        },
      }),
    }
  );

  const data = await response.json();
  return data;
}

export async function fetchPaytmTransactionStatus(orderId: string) {
  assertPaytmConfig();

  const body = {
    mid: PAYTM_MID,
    orderId,
  };

  const signature = await PaytmChecksum.generateSignature(
    JSON.stringify(body),
    PAYTM_MERCHANT_KEY
  );

  const response = await fetch(`${PAYTM_HOST}/v3/order/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      body,
      head: {
        signature,
      },
    }),
  });

  return response.json();
}

export async function verifyPaytmCallbackChecksum(callbackParams: Record<string, string>) {
  assertPaytmConfig();
  const checksum = callbackParams.CHECKSUMHASH || callbackParams.SIGNATURE || '';
  if (!checksum) {
    return false;
  }

  const payload = { ...callbackParams };
  delete payload.CHECKSUMHASH;
  delete payload.SIGNATURE;

  return PaytmChecksum.verifySignature(payload, PAYTM_MERCHANT_KEY, checksum);
}
