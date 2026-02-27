import crypto from 'crypto';

// Payment Gateway Configuration
const PAYMENT_SECRET = process.env.PAYMENT_SECRET || crypto.randomBytes(32).toString('hex');
const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY || crypto.randomBytes(16).toString('hex');

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  userId: string;
  userName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  expiresAt: string;
}

export interface PaymentIntent {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  method?: 'card' | 'upi' | 'wallet' | 'netbanking';
  createdAt: string;
}

interface UpiPaymentOptions {
  payeeAddress?: string;
  payeeName?: string;
  currency?: string;
  transactionNote?: string;
  transactionRef?: string;
}

const DEFAULT_UPI_PAYEE_ADDRESS = 'mastermindaggaming@oksbi';
const DEFAULT_UPI_PAYEE_NAME = 'Protocol Zero';
const DEFAULT_UPI_CURRENCY = 'INR';

// Generate secure order ID
export function generateOrderId(userId: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `ord_${timestamp}_${userId.substring(0, 8)}_${random}`;
}

// Generate secure payment ID
export function generatePaymentId(orderId: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `pay_${timestamp}_${orderId.substring(4, 12)}_${random}`;
}

// Create secure payment token
export function createPaymentToken(orderId: string, amount: number, userId: string): string {
  const payload = {
    orderId,
    amount,
    userId,
    timestamp: Date.now(),
  };
  
  const data = JSON.stringify(payload);
  const token = crypto
    .createHmac('sha256', PAYMENT_SECRET)
    .update(data)
    .digest('hex');
  
  return Buffer.from(JSON.stringify({ data: payload, token })).toString('base64');
}

// Verify payment token
export function verifyPaymentToken(token: string): { valid: boolean; data?: any } {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const { data, token: signature } = decoded;
    
    const expectedToken = crypto
      .createHmac('sha256', PAYMENT_SECRET)
      .update(JSON.stringify(data))
      .digest('hex');
    
    if (signature !== expectedToken) {
      return { valid: false };
    }
    
    // Check token expiration (15 minutes)
    const tokenAge = Date.now() - data.timestamp;
    if (tokenAge > 15 * 60 * 1000) {
      return { valid: false };
    }
    
    return { valid: true, data };
  } catch {
    return { valid: false };
  }
}

// Create payment signature for verification
export function createPaymentSignature(orderId: string, paymentId: string, amount: number): string {
  const text = `${orderId}|${paymentId}|${amount}`;
  return crypto
    .createHmac('sha256', PAYMENT_SECRET)
    .update(text)
    .digest('hex');
}

// Verify payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  amount: number,
  signature: string
): boolean {
  const expectedSignature = createPaymentSignature(orderId, paymentId, amount);
  
  // timingSafeEqual requires buffers of the same length
  if (signature.length !== expectedSignature.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Build UPI URI for QR/deep-link payments (dynamic amount via `am`)
export function createUpiPaymentUri(amount: number, options: UpiPaymentOptions = {}): string {
  const params = new URLSearchParams({
    pa: options.payeeAddress || DEFAULT_UPI_PAYEE_ADDRESS,
    pn: options.payeeName || DEFAULT_UPI_PAYEE_NAME,
    am: amount.toFixed(2),
    cu: options.currency || DEFAULT_UPI_CURRENCY,
  });

  if (options.transactionNote) {
    params.set('tn', options.transactionNote);
  }

  if (options.transactionRef) {
    params.set('tr', options.transactionRef);
  }

  return `upi://pay?${params.toString()}`;
}

// Uses a public QR rendering endpoint to convert UPI URI into a scannable QR image
export function createUpiQrCodeUrl(
  amount: number,
  options: UpiPaymentOptions = {},
  size = 260
): string {
  const upiUri = createUpiPaymentUri(amount, options);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiUri)}`;
}

/**
 * Process payment
 * 
 * CURRENTLY: Simulates payment processing (for demo/testing)
 * 
 * TO RECEIVE REAL PAYMENTS:
 * 1. Install Stripe: npm install stripe @stripe/stripe-js
 * 2. Add Stripe keys to .env.local
 * 3. Replace this function with processStripePayment from payment-providers/stripe.ts
 * 
 * Example:
 * import { processStripePayment } from './payment-providers/stripe';
 * return await processStripePayment(orderId, amount, method, paymentDetails);
 */
export async function processPayment(
  orderId: string,
  amount: number,
  method: 'card' | 'upi' | 'wallet' | 'netbanking',
  paymentDetails: Record<string, any>
): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  // ⚠️ SIMULATION MODE - Replace with real payment processor integration
  // See docs/PAYMENT_INTEGRATION.md for setup instructions
  
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate payment success (95% success rate for demo)
  const success = Math.random() > 0.05;
  
  if (success) {
    const paymentId = generatePaymentId(orderId);
    return { success: true, paymentId };
  } else {
    return { success: false, error: 'Payment processing failed. Please try again.' };
  }
  
  // 🔄 TO USE STRIPE (uncomment and configure):
  // try {
  //   const { processStripePayment } = await import('./payment-providers/stripe');
  //   return await processStripePayment(orderId, amount, method, paymentDetails);
  // } catch (error: any) {
  //   return { success: false, error: error.message || 'Payment processing failed' };
  // }
}

// Validate payment amount
export function validateAmount(amount: number): { valid: boolean; error?: string } {
  if (!amount || amount <= 0) {
    return { valid: false, error: 'Invalid payment amount' };
  }
  
  if (amount < 1) {
    return { valid: false, error: 'Minimum payment amount is ₹1.00' };
  }
  
  if (amount > 1000000) {
    return { valid: false, error: 'Maximum payment amount is ₹10,00,000.00' };
  }
  
  return { valid: true };
}

export { PAYMENT_SECRET, PAYMENT_API_KEY };
