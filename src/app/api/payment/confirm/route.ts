import { NextResponse } from 'next/server';
import { orders } from '@/lib/order-store';

export async function POST(request: Request) {
  try {
    const expectedApiKey =
      process.env.PAYMENT_CONFIRM_API_KEY || process.env.PAYMENT_VERIFY_API_KEY;

    if (expectedApiKey) {
      const providedApiKey = request.headers.get('x-api-key');
      if (providedApiKey !== expectedApiKey) {
        return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 });
      }
    }

    const { orderId, transactionId, paidAt } = await request.json();

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'orderId is required' },
        { status: 400 }
      );
    }

    if (!transactionId || typeof transactionId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'transactionId is required' },
        { status: 400 }
      );
    }

    const order = orders.get(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Idempotent confirm
    order.status = 'completed';
    order.paymentId = transactionId;
    order.paymentMethod = order.paymentMethod || 'upi';
    order.verifiedAt = paidAt || new Date().toISOString();
    orders.set(orderId, order);

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      transactionId: order.paymentId,
      paidAt: order.verifiedAt,
      status: order.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}
