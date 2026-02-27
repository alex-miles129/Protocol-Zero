import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { orders } from '@/lib/order-store';
import { generatePaymentId } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, transactionId } = await request.json();

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
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access to this order' },
        { status: 403 }
      );
    }

    order.userReportedTxnId = transactionId.trim();
    order.userReportedAt = new Date().toISOString();
    order.paymentMethod = order.paymentMethod || 'upi';

    // Generate internal payment reference if not already available.
    if (!order.paymentId) {
      order.paymentId = generatePaymentId(orderId);
    }

    order.status = 'completed';
    order.verifiedAt = order.userReportedAt;

    orders.set(orderId, order);

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      transactionId: order.userReportedTxnId,
      paymentId: order.paymentId,
      status: order.status,
      reportedAt: order.userReportedAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to report payment' },
      { status: 500 }
    );
  }
}
