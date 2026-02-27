/**
 * Stripe Payment Intent Creation Endpoint
 * 
 * This endpoint creates a Stripe Payment Intent for processing payments
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createStripePaymentIntent } from '@/lib/payment-providers/stripe';
import { validateAmount } from '@/lib/payment';
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

    const { orderId, amount, currency = 'INR' } = await request.json();

    // Validate amount
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      return NextResponse.json(
        { error: amountValidation.error },
        { status: 400 }
      );
    }

    // Get order
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

    // Create Stripe payment intent
    const result = await createStripePaymentIntent(
      amount,
      currency.toLowerCase(),
      {
        orderId,
        userId: session.user.id,
        userName: session.user.name || session.user.email || 'Customer',
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Update order with payment intent ID
    order.stripePaymentIntentId = result.paymentId;
    orders.set(orderId, order);

    return NextResponse.json({
      success: true,
      paymentIntentId: result.paymentId,
      clientSecret: result.clientSecret,
    });
  } catch (error: any) {
    console.error('Error creating Stripe payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}





