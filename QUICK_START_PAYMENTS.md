# Quick Start: Receiving Real Payments

## Current Status
Your payment gateway is currently in **simulation mode**. Payments are not real and money won't be transferred.

## Quick Setup (5 minutes)

### Option 1: Stripe (Recommended)

1. **Sign up for Stripe**
   ```bash
   # Visit: https://stripe.com
   # Create account → Complete verification → Get API keys
   ```

2. **Install Stripe**
   ```bash
   npm install stripe @stripe/stripe-js @stripe/react-stripe-js
   ```

3. **Add API Keys**
   Create/update `.env.local`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...  # Get from: stripe listen --forward-to localhost:3001/api/payment/stripe/webhook
   ```

4. **Update Payment Processing**
   Edit `src/lib/payment.ts` and replace the `processPayment` function:
   ```typescript
   // Replace the simulation with:
   const { processStripePayment } = await import('./payment-providers/stripe');
   return await processStripePayment(orderId, amount, method, paymentDetails);
   ```

5. **Test Payment**
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC

### Option 2: Other Payment Gateways

See `docs/PAYMENT_INTEGRATION.md` for:
- Razorpay integration
- Paytm integration
- Cashfree integration
- PayPal integration

## How Money Reaches Your Account

### With Stripe:
1. **Customer pays** → Stripe processes payment
2. **Funds held** → In your Stripe dashboard balance
3. **Automatic payout** → Stripe transfers to your bank (daily in India)
4. **You receive** → Money in your connected bank account

### Payout Schedule:
- **India**: Daily (next business day)
- **Fees**: 2% + ₹2 per successful card payment
- **UPI**: Lower fees (~0.5%)

### Setup Bank Account:
1. Go to Stripe Dashboard → Settings → Bank accounts
2. Add your Indian bank account
3. Verify with test deposit
4. Start receiving payouts automatically

## Testing

### Test Mode (No Real Money):
- Use test API keys (start with `sk_test_` and `pk_test_`)
- Use test cards from Stripe docs
- No real money is transferred

### Live Mode (Real Payments):
- Switch to live keys (start with `sk_live_` and `pk_live_`)
- Real payments will be processed
- Money will be transferred to your bank

## Support

- **Stripe Docs**: https://stripe.com/docs
- **Stripe India**: https://stripe.com/in
- **Integration Guide**: See `docs/PAYMENT_INTEGRATION.md`

## Important Notes

⚠️ **Before going live:**
- Complete business verification
- Add your bank account
- Test thoroughly in test mode
- Set up webhooks for payment status updates
- Review Stripe's terms and fees

✅ **Security:**
- Never commit API keys to git
- Use environment variables
- Enable webhook signature verification
- Follow PCI compliance guidelines





