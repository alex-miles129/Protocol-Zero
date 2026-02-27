import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  generateOrderId,
  createPaymentToken,
  validateAmount,
} from '@/lib/payment';
import { orders } from '@/lib/order-store';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to proceed with payment.' },
        { status: 401 }
      );
    }

    const { amount, items, currency = 'INR' } = await request.json();

    // Validate amount
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      return NextResponse.json(
        { error: amountValidation.error },
        { status: 400 }
      );
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid items. At least one item is required.' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = generateOrderId(session.user.id);
    
    // Calculate expiry time (15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Create order object
    const order = {
      orderId,
      amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
      currency,
      items,
      userId: session.user.id,
      userName: session.user.name || session.user.email || 'Customer',
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    // Store order (in production, save to database)
    orders.set(orderId, order);

    // Create secure payment token
    const paymentToken = createPaymentToken(orderId, order.amount, session.user.id);

    return NextResponse.json({
      orderId,
      amount: order.amount,
      currency: order.currency,
      paymentToken,
      expiresAt: order.expiresAt,
    });
  } catch (error: any) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
