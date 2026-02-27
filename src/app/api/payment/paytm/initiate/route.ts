import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { orders } from '@/lib/order-store';
import { initiatePaytmTransaction } from '@/lib/payment-providers/paytm';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const order = orders.get(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized access to this order' }, { status: 403 });
    }

    const paytmResponse = await initiatePaytmTransaction({
      orderId: order.orderId,
      amount: order.amount,
      customerId: order.userId,
      email: session.user.email || '',
    });

    const txnToken = paytmResponse?.body?.txnToken;
    if (!txnToken) {
      return NextResponse.json(
        { error: paytmResponse?.body?.resultInfo?.resultMsg || 'Failed to initiate Paytm payment' },
        { status: 400 }
      );
    }

    order.status = 'processing';
    order.paymentMethod = 'upi';
    orders.set(orderId, order);

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      txnToken,
      mid: process.env.PAYTM_MID,
      amount: order.amount,
      paytmHost:
        (process.env.PAYTM_ENV || 'staging') === 'production'
          ? 'https://securegw.paytm.in'
          : 'https://securegw-stage.paytm.in',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to initiate Paytm transaction' },
      { status: 500 }
    );
  }
}
