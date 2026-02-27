/**
 * Stripe Payment Integration
 * 
 * To use this:
 * 1. Install: npm install stripe @stripe/stripe-js
 * 2. Add to .env.local:
 *    STRIPE_SECRET_KEY=sk_test_...
 *    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
 * 3. Replace the processPayment function in src/lib/payment.ts
 */

import Stripe from 'stripe';

// Initialize Stripe
// Note: Install stripe package first: npm install stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

export interface StripePaymentResult {
  success: boolean;
  paymentId?: string;
  clientSecret?: string;
  error?: string;
}

/**
 * Create a Stripe Payment Intent
 * This creates a payment that can be completed on the frontend
 */
export async function createStripePaymentIntent(
  amount: number,
  currency: string = 'inr',
  metadata: Record<string, string> = {}
): Promise<StripePaymentResult> {
  try {
    if (!stripe) {
      return {
        success: false,
        error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.',
      };
    }

    // Convert amount to smallest currency unit (paise for INR)
    const amountInSmallestUnit = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret || undefined,
    };
  } catch (error: any) {
    console.error('Stripe payment intent creation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create payment intent',
    };
  }
}

/**
 * Confirm a Stripe Payment Intent
 * This completes the payment
 */
export async function confirmStripePayment(
  paymentIntentId: string,
  paymentMethodId?: string
): Promise<StripePaymentResult> {
  try {
    if (!stripe) {
      return {
        success: false,
        error: 'Stripe is not configured',
      };
    }

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        paymentId: paymentIntent.id,
      };
    } else {
      return {
        success: false,
        error: `Payment status: ${paymentIntent.status}`,
      };
    }
  } catch (error: any) {
    console.error('Stripe payment confirmation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to confirm payment',
    };
  }
}

/**
 * Retrieve payment status
 */
export async function getStripePaymentStatus(
  paymentIntentId: string
): Promise<{ status: string; amount: number; currency: string } | null> {
  try {
    if (!stripe) {
      return null;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert from smallest unit
      currency: paymentIntent.currency,
    };
  } catch (error) {
    console.error('Stripe payment retrieval error:', error);
    return null;
  }
}

/**
 * Process payment with Stripe
 * This is the main function to replace the simulated processPayment
 */
export async function processStripePayment(
  orderId: string,
  amount: number,
  method: 'card' | 'upi' | 'wallet' | 'netbanking',
  paymentDetails: Record<string, any>
): Promise<{ success: boolean; paymentId?: string; clientSecret?: string; error?: string }> {
  try {
    // Create payment intent
    const result = await createStripePaymentIntent(amount, 'inr', {
      orderId,
      method,
    });

    if (!result.success) {
      return result;
    }

    // For card payments, return client secret for frontend confirmation
    if (method === 'card' && result.clientSecret) {
      return {
        success: true,
        paymentId: result.paymentId,
        clientSecret: result.clientSecret,
      };
    }

    // For other methods (UPI, wallet, netbanking), you may need different handling
    // Stripe supports these through Payment Methods API
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Payment processing failed',
    };
  }
}

/**
 * Verify webhook signature (for handling Stripe webhooks)
 */
export function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event | null {
  try {
    if (!stripe) {
      return null;
    }
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

