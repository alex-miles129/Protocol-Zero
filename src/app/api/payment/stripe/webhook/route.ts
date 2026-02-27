/**
 * Stripe Webhook Endpoint
 * 
 * This endpoint handles Stripe webhook events (payment success, failure, etc.)
 * 
 * To set up:
 * 1. Run: stripe listen --forward-to localhost:3001/api/payment/stripe/webhook
 * 2. Copy the webhook signing secret
 * 3. Add to .env.local: STRIPE_WEBHOOK_SECRET=whsec_...
 */

import { NextResponse } from 'next/server';
import { verifyStripeWebhook } from '@/lib/payment-providers/stripe';
import { orders } from '@/lib/order-store';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    const event = verifyStripeWebhook(body, signature, webhookSecret);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          const order = orders.get(orderId);
          if (order) {
            order.status = 'completed';
            order.paymentId = paymentIntent.id;
            order.verifiedAt = new Date().toISOString();
            orders.set(orderId, order);

            // Here you would:
            // 1. Save to database
            // 2. Grant access to purchased items
            // 3. Send confirmation email
            // 4. Update user membership, etc.
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          const order = orders.get(orderId);
          if (order) {
            order.status = 'failed';
            orders.set(orderId, order);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}





