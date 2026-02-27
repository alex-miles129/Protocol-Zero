import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  verifyPaymentSignature,
} from '@/lib/payment';
import { orders } from '@/lib/order-store';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderId, paymentId, signature } = await request.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Get order from storage
    const order = orders.get(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found', verified: false },
        { status: 404 }
      );
    }

    // Verify order belongs to user
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to this order', verified: false },
        { status: 403 }
      );
    }

    // Verify payment signature
    const isSignatureValid = verifyPaymentSignature(orderId, paymentId, order.amount, signature);

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature', verified: false },
        { status: 400 }
      );
    }

    // Update order status to completed
    order.status = 'completed';
    order.verifiedAt = new Date().toISOString();

    orders.set(orderId, order);

    // Payment verified successfully
    // Here you would typically:
    // 1. Update your database with the payment status
    // 2. Grant access to purchased items
    // 3. Send confirmation email
    // 4. Update user's membership status, etc.

    return NextResponse.json({
      verified: true,
      paymentId,
      orderId,
      amount: order.amount,
      currency: order.currency,
      transactionId: paymentId,
      ticket: order.ticketId ? { ticketId: order.ticketId, category: 'membership', status: 'open' } : null,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment', verified: false },
      { status: 500 }
    );
  }
}
