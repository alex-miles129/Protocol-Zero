/**
 * Stripe Payment Modal Component
 * 
 * This is an example of how to integrate Stripe Elements
 * for card payments. Install: npm install @stripe/react-stripe-js @stripe/stripe-js
 */

'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Uncomment when Stripe is installed:
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalStripeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  amount: number;
  currency: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  onSuccess: (paymentId: string, orderId: string) => void;
  onError: (error: string) => void;
}

export function PaymentModalStripe({
  open,
  onOpenChange,
  orderId,
  amount,
  currency,
  items,
  onSuccess,
  onError,
}: PaymentModalStripeProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Step 1: Create payment intent
      const intentResponse = await fetch('/api/payment/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount,
          currency,
        }),
      });

      const intentData = await intentResponse.json();

      if (!intentResponse.ok || !intentData.success) {
        throw new Error(intentData.error || 'Failed to create payment intent');
      }

      // Step 2: Confirm payment with Stripe
      // In a real implementation, you would use Stripe Elements here
      // to collect card details securely and confirm the payment
      
      // For now, this is a placeholder - you need to:
      // 1. Install @stripe/react-stripe-js and @stripe/stripe-js
      // 2. Use Stripe Elements to collect card details
      // 3. Confirm the payment using the client secret

      // Simulated confirmation (replace with actual Stripe confirmation)
      const confirmResponse = await fetch('/api/payment/stripe/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: intentData.paymentIntentId,
        }),
      });

      const confirmData = await confirmResponse.json();

      if (!confirmResponse.ok || !confirmData.success) {
        throw new Error(confirmData.error || 'Payment confirmation failed');
      }

      setPaymentId(confirmData.paymentId);
      setPaymentStatus('success');

      setTimeout(() => {
        onSuccess(confirmData.paymentId, orderId);
        onOpenChange(false);
      }, 2000);
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred during payment processing',
        variant: 'destructive',
      });
      onError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Secure Payment with Stripe
          </DialogTitle>
          <DialogDescription>
            Complete your payment securely
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold">Payment Successful!</h3>
              <p className="text-muted-foreground">
                Your payment has been processed successfully.
              </p>
              {paymentId && (
                <p className="text-sm text-muted-foreground mt-4">
                  Payment ID: {paymentId}
                </p>
              )}
            </div>
          </div>
        ) : paymentStatus === 'failed' ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900 p-4">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold">Payment Failed</h3>
              <p className="text-muted-foreground">
                Your payment could not be processed. Please try again.
              </p>
              <Button onClick={() => setPaymentStatus('idle')} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> This is a placeholder component. To use Stripe:
                <br />
                1. Install: <code>npm install @stripe/react-stripe-js @stripe/stripe-js</code>
                <br />
                2. Add Stripe Elements for card input
                <br />
                3. Use the client secret to confirm payment
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-foreground via-foreground/80 to-foreground text-background"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${amount.toFixed(2)}`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}





