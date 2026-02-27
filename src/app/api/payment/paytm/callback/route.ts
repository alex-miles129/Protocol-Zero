import { NextResponse } from 'next/server';
import { orders } from '@/lib/order-store';
import {
  fetchPaytmTransactionStatus,
  verifyPaytmCallbackChecksum,
} from '@/lib/payment-providers/paytm';

function parseCallbackBody(bodyText: string): Record<string, string> {
  if (!bodyText) {
    return {};
  }

  const trimmed = bodyText.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const flat: Record<string, string> = {};
      Object.entries(parsed || {}).forEach(([key, value]) => {
        flat[key] = String(value ?? '');
      });
      return flat;
    } catch {
      // fall through to URL-encoded parsing
    }
  }

  const params = new URLSearchParams(bodyText);
  const parsed: Record<string, string> = {};
  params.forEach((value, key) => {
    parsed[key] = value;
  });
  return parsed;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const callbackParams = parseCallbackBody(rawBody);
    const orderId = callbackParams.ORDERID || callbackParams.ORDER_ID;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Missing ORDERID' }, { status: 400 });
    }

    const checksumValid = await verifyPaytmCallbackChecksum(callbackParams);
    if (!checksumValid) {
      return NextResponse.json({ success: false, error: 'Invalid checksum' }, { status: 400 });
    }

    const statusResponse = await fetchPaytmTransactionStatus(orderId);
    const resultStatus = statusResponse?.body?.resultInfo?.resultStatus;
    const txnId = statusResponse?.body?.txnId || callbackParams.TXNID || '';
    const txnDate = statusResponse?.body?.txnDate || callbackParams.TXNDATE || new Date().toISOString();

    const order = orders.get(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (resultStatus === 'TXN_SUCCESS') {
      order.status = 'completed';
      order.paymentId = txnId || order.paymentId;
      order.verifiedAt = txnDate;
    } else if (resultStatus === 'PENDING') {
      order.status = 'processing';
    } else {
      order.status = 'failed';
    }

    orders.set(orderId, order);

    return NextResponse.json({
      success: true,
      orderId,
      status: order.status,
      transactionId: order.paymentId || null,
      paidAt: order.verifiedAt || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process Paytm callback' },
      { status: 500 }
    );
  }
}
