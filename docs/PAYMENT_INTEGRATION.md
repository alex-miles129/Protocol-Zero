# Payment Integration Guide

## Current Status
The current payment gateway is a **simulation/demo** system. To receive real payments, you need to integrate with an actual payment processor.

## Payment Processor Options

### For India (INR):
1. **Stripe** - International, works in India, excellent API
2. **Razorpay** - Popular in India, good UPI support
3. **Paytm** - Indian payment gateway
4. **Cashfree** - Indian payment gateway
5. **Instamojo** - Simple Indian payment gateway

### International:
1. **Stripe** - Best overall, works globally
2. **PayPal** - Widely recognized
3. **Square** - Good for businesses

## Recommended: Stripe Integration

Stripe is recommended because:
- ✅ Works in India with INR support
- ✅ Excellent developer experience
- ✅ Secure and PCI compliant
- ✅ Supports cards, UPI, wallets, net banking
- ✅ Automatic payouts to your bank account
- ✅ Great documentation

## Setup Steps

### 1. Create Stripe Account
1. Go to https://stripe.com
2. Sign up for an account
3. Complete business verification
4. Get your API keys from Dashboard → Developers → API keys

### 2. Add Environment Variables
Add to your `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (for webhooks)
```

### 3. Install Stripe
```bash
npm install stripe @stripe/stripe-js
```

### 4. Integration
See the integration example in `src/lib/payment-providers/stripe.ts`

## How Money Reaches Your Account

1. **Customer pays** → Payment processed by Stripe
2. **Stripe holds funds** → In your Stripe account balance
3. **Automatic payouts** → Stripe transfers to your bank account (daily/weekly)
4. **You receive money** → In your connected bank account

### Stripe Payout Schedule:
- **India**: Daily payouts (next business day)
- **Fees**: 2% + ₹2 per successful card payment
- **UPI**: Lower fees (~0.5%)

## Alternative: Direct Bank Integration

For direct bank transfers (NEFT/RTGS), you would need:
- Bank API access (requires business account with API access)
- Payment gateway license (complex, expensive)
- PCI DSS compliance

**Recommendation**: Use a payment processor like Stripe instead.





