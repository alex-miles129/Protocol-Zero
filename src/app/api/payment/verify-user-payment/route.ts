import { NextResponse } from 'next/server';
import { orders } from '@/lib/order-store';

type PaymentOrder = {
  orderId: string;
  userId: string;
  status: string;
  paymentId?: string;
  userReportedTxnId?: string;
  userReportedAt?: string;
  verifiedAt?: string;
  createdAt?: string;
  amount?: number;
};

function findLatestPaidOrder(discordUserId: string): PaymentOrder | null {
  const paidOrders = Array.from(orders.values()).filter((order: any) => {
    return (
      order.userId === discordUserId &&
      order.status !== 'failed' &&
      order.status !== 'cancelled' &&
      (order.paymentId || order.userReportedTxnId)
    );
  }) as PaymentOrder[];

  if (paidOrders.length === 0) {
    return null;
  }

  paidOrders.sort((a, b) => {
    const aTs = Date.parse(
      a.verifiedAt || a.userReportedAt || a.createdAt || '1970-01-01T00:00:00.000Z'
    );
    const bTs = Date.parse(
      b.verifiedAt || b.userReportedAt || b.createdAt || '1970-01-01T00:00:00.000Z'
    );
    return bTs - aTs;
  });

  return paidOrders[0];
}

export async function POST(request: Request) {
  try {
    const expectedApiKey = process.env.PAYMENT_VERIFY_API_KEY;
    if (expectedApiKey) {
      const providedApiKey = request.headers.get('x-api-key');
      if (providedApiKey !== expectedApiKey) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
    }

    const { discordUserId } = await request.json();
    if (!discordUserId || typeof discordUserId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'discordUserId is required' },
        { status: 400 }
      );
    }

    const latestOrder = findLatestPaidOrder(discordUserId);
    if (!latestOrder) {
      return NextResponse.json({ success: true, paid: false });
    }

    const isConfirmed = latestOrder.status === 'completed';
    const isUserReported = Boolean(latestOrder.userReportedTxnId);

    return NextResponse.json({
      success: true,
      paid: isConfirmed || isUserReported,
      paymentReported: isUserReported,
      paymentConfirmed: isConfirmed,
      status: latestOrder.status,
      orderId: latestOrder.orderId,
      transactionId: latestOrder.userReportedTxnId || latestOrder.paymentId || null,
      paymentId: latestOrder.paymentId || null,
      paidAt:
        latestOrder.verifiedAt || latestOrder.userReportedAt || latestOrder.createdAt || null,
      amount: latestOrder.amount ?? null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
