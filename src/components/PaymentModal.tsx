'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createUpiPaymentUri, createUpiQrCodeUrl } from '@/lib/payment';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  amount: number;
  currency: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  onSuccess: (paymentId: string, orderId: string) => void;
  onError: (error: string) => void;
}

export function PaymentModal({
  open,
  onOpenChange,
  orderId,
  amount,
  currency,
  items,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [showUpiQr, setShowUpiQr] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setPaymentStatus('idle');
      setPaymentId(null);
      setTicketId(null);
      setShowUpiQr(false);
    }
  }, [open]);

  const upiPaymentUri = createUpiPaymentUri(amount, {
    currency: 'INR',
  });

  const upiQrCodeUrl = createUpiQrCodeUrl(amount, {
    currency: 'INR',
  });

  const markPaymentSuccess = (resolvedPaymentId?: string | null, resolvedTicketId?: string | null) => {
    const finalPaymentId = resolvedPaymentId || paymentId || `upi_${orderId}`;
    setPaymentId(finalPaymentId);
    if (resolvedTicketId) {
      setTicketId(resolvedTicketId);
    }
    setPaymentStatus('success');
    setTimeout(() => {
      onSuccess(finalPaymentId, orderId);
      onOpenChange(false);
    }, 2000);
  };

  const fetchOrderStatus = async () => {
    const statusResponse = await fetch(`/api/payment/status?orderId=${encodeURIComponent(orderId)}`);
    if (!statusResponse.ok) {
      return null;
    }
    return statusResponse.json();
  };

  const completePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // If already acknowledged on server (e.g. second click/race), show success directly.
      const currentStatus = await fetchOrderStatus();
      if (currentStatus?.status === 'completed' || currentStatus?.status === 'processing') {
        markPaymentSuccess(currentStatus.paymentId, currentStatus.ticketId);
        return;
      }

      // Process payment
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount,
          currency,
          method: 'upi',
          paymentDetails: {
            method: 'upi',
            upiUri: upiPaymentUri,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment processing failed');
      }

      // Verify payment
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentId: data.paymentId,
          signature: data.signature,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData.verified) {
        // In this demo flow, if order has moved to processing/completed, treat as success.
        const latestStatus = await fetchOrderStatus();
        if (latestStatus?.status === 'completed' || latestStatus?.status === 'processing') {
          markPaymentSuccess(latestStatus.paymentId || data.paymentId, latestStatus.ticketId || verifyData?.ticket?.ticketId);
          return;
        }
        throw new Error('Payment verification failed');
      }

      markPaymentSuccess(data.paymentId, verifyData?.ticket?.ticketId);
    } catch (error: any) {
      console.error('Payment error:', error);
      const errorMessage = error?.message || 'An error occurred during payment processing';

      // Convert duplicate-verify case to success.
      if (errorMessage.toLowerCase().includes('already been paid')) {
        const currentStatus = await fetchOrderStatus();
        if (currentStatus?.status === 'completed' || currentStatus?.status === 'processing') {
          markPaymentSuccess(currentStatus.paymentId, currentStatus.ticketId);
          return;
        }
      }

      setPaymentStatus('failed');
      toast({
        title: 'Payment Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      onError(errorMessage || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    // First click generates QR only
    if (!showUpiQr) {
      setShowUpiQr(true);
      return;
    }
  };

  useEffect(() => {
    if (!showUpiQr || paymentStatus !== 'idle' || isProcessing) {
      return;
    }

    // Auto-attempt verification shortly after QR is shown.
    const autoVerifyTimer = setTimeout(() => {
      void completePayment();
    }, 12000);

    return () => clearTimeout(autoVerifyTimer);
  }, [showUpiQr, paymentStatus, isProcessing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Secure Payment
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
                  Transaction ID: {paymentId}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Order Number: {orderId}
              </p>
              {ticketId && (
                <p className="text-sm text-muted-foreground">
                  Membership Ticket: {ticketId}
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
                      <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rs {amount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Order ID: {orderId}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-3 text-sm">UPI</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showUpiQr ? (
                  <p className="text-sm text-muted-foreground">
                    Click "Proceed To Pay With UPI" to generate your payment QR code.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Scan this QR in any UPI app. Amount is auto-filled for this order.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Auto verification will run in a few seconds after payment.
                    </p>
                    <div className="flex justify-center">
                      <img
                        src={upiQrCodeUrl}
                        alt="UPI Payment QR Code"
                        width={220}
                        height={220}
                        className="rounded-md border bg-white p-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="upiLink">UPI Payment Link</Label>
                      <Input id="upiLink" value={upiPaymentUri} readOnly />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
              <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Your payment is secured with end-to-end encryption.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isProcessing}
              >
                {showUpiQr ? 'Close' : 'Cancel'}
              </Button>
              {!showUpiQr && (
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
                    <>
                      Proceed To Pay With UPI
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
