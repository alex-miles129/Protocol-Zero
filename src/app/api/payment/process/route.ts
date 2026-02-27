import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  processPayment,
  createPaymentSignature,
  verifyPaymentToken,
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

    const { orderId, amount, currency, method, paymentDetails, paymentToken } = await request.json();

    if (!orderId || !amount || !method) {
      return NextResponse.json(
        { error: 'Missing required payment details' },
        { status: 400 }
      );
    }

    // Verify payment token if provided
    if (paymentToken) {
      const tokenVerification = verifyPaymentToken(paymentToken);
      if (!tokenVerification.valid) {
        return NextResponse.json(
          { error: 'Invalid or expired payment token' },
          { status: 400 }
        );
      }
      
      if (tokenVerification.data.orderId !== orderId) {
        return NextResponse.json(
          { error: 'Payment token does not match order' },
          { status: 400 }
        );
      }
    }

    // Get order from storage
    const order = orders.get(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order belongs to user
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to this order' },
        { status: 403 }
      );
    }

    // Check if order is expired
    if (new Date(order.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Order has expired. Please create a new order.' },
        { status: 400 }
      );
    }

    // Check if order is already completed
    if (order.status === 'completed') {
      return NextResponse.json(
        { error: 'This order has already been paid' },
        { status: 400 }
      );
    }

    // Verify amount matches
    if (Math.abs(order.amount - amount) > 0.01) {
      return NextResponse.json(
        { error: 'Payment amount does not match order amount' },
        { status: 400 }
      );
    }

    // Process payment
    const paymentResult = await processPayment(orderId, amount, method, paymentDetails);

    if (!paymentResult.success) {
      // Update order status to failed
      order.status = 'failed';
      orders.set(orderId, order);
      
      return NextResponse.json(
        { 
          success: false,
          error: paymentResult.error || 'Payment processing failed' 
        },
        { status: 400 }
      );
    }

    // Create payment signature
    const signature = createPaymentSignature(orderId, paymentResult.paymentId!, amount);

    // Update order status
    order.status = 'processing';
    order.paymentId = paymentResult.paymentId;
    order.paymentMethod = method;
    orders.set(orderId, order);

    return NextResponse.json({
      success: true,
      paymentId: paymentResult.paymentId,
      orderId,
      signature,
      message: 'Payment processed successfully',
    });
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to process payment' 
      },
      { status: 500 }
    );
  }
}





