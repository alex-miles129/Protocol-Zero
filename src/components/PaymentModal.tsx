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
  const [userMarkedPaid, setUserMarkedPaid] = useState(false);
  const [userTransactionId, setUserTransactionId] = useState('');
  const [reportedTransactionId, setReportedTransactionId] = useState<string | null>(null);
  const [isReportingPayment, setIsReportingPayment] = useState(false);
  const [hasSubmittedTxn, setHasSubmittedTxn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setPaymentStatus('idle');
      setPaymentId(null);
      setTicketId(null);
      setShowUpiQr(false);
      setUserMarkedPaid(false);
      setUserTransactionId('');
      setReportedTransactionId(null);
      setIsReportingPayment(false);
      setHasSubmittedTxn(false);
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

  const handlePayment = async () => {
    // First click generates QR only
    if (!showUpiQr) {
      setShowUpiQr(true);
      setPaymentStatus('processing');
      return;
    }
  };

  useEffect(() => {
    if (!open || !showUpiQr || paymentStatus === 'success' || paymentStatus === 'failed') {
      return;
    }

    let active = true;

    const checkPaymentStatus = async () => {
      setIsProcessing(true);
      try {
        const currentStatus = await fetchOrderStatus();
        if (!active || !currentStatus) {
          return;
        }

        if (currentStatus.status === 'completed') {
          markPaymentSuccess(currentStatus.paymentId, currentStatus.ticketId);
          return;
        }

        if (currentStatus.transactionId && !reportedTransactionId) {
          setReportedTransactionId(currentStatus.transactionId);
        }

        if (currentStatus.status === 'failed' || currentStatus.status === 'cancelled') {
          setPaymentStatus('failed');
          onError('Payment failed');
          return;
        }

        if (currentStatus.expiresAt && new Date(currentStatus.expiresAt) < new Date()) {
          setPaymentStatus('failed');
          onError('Order has expired before payment confirmation.');
          return;
        }

        setPaymentStatus('processing');
      } catch (error: any) {
        if (!active) {
          return;
        }
        toast({
          title: 'Payment Status Check Failed',
          description: error?.message || 'Unable to check payment status right now.',
          variant: 'destructive',
        });
      } finally {
        if (active) {
          setIsProcessing(false);
        }
      }
    };

    void checkPaymentStatus();
    const pollTimer = setInterval(() => {
      void checkPaymentStatus();
    }, 5000);

    return () => {
      active = false;
      clearInterval(pollTimer);
    };
  }, [open, showUpiQr, paymentStatus]);

  const handleReportPayment = async () => {
    const trimmedTxn = userTransactionId.trim();
    if (!trimmedTxn) {
      toast({
        title: 'Transaction ID required',
        description: 'Please enter your UTR / Transaction ID.',
        variant: 'destructive',
      });
      return;
    }

    setIsReportingPayment(true);
    try {
      const response = await fetch('/api/payment/report-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          transactionId: trimmedTxn,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to report payment');
      }

      setReportedTransactionId(data.transactionId || trimmedTxn);
      setPaymentId(data.paymentId || null);
      setHasSubmittedTxn(true);

      toast({
        title: 'Payment marked by user',
        description: 'Details saved. Please reach out in ticket for verification.',
      });
    } catch (error: any) {
      toast({
        title: 'Unable to save payment details',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsReportingPayment(false);
    }
  };

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
                Your payment could not be confirmed. Please try again.
              </p>
              <Button onClick={() => setPaymentStatus('idle')} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        ) : hasSubmittedTxn ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="rounded-full bg-green-500/10 p-4">
              <CheckCircle2 className="h-14 w-14 text-green-500 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold text-green-500">User Confirmed</h3>
              <p className="text-muted-foreground">
                Reach out in ticket.
              </p>
            </div>
            <div className="w-full pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Close
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
                      Waiting for payment confirmation from server...
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
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => setUserMarkedPaid(true)}
                      className="w-full bg-white text-black hover:bg-white/90"
                    >
                      I Have Paid
                    </Button>
                    {userMarkedPaid && (
                      <>
                        {!hasSubmittedTxn ? (
                          <div className="rounded-md border p-3 text-sm space-y-2">
                            <p><strong>Order ID:</strong> {orderId}</p>
                            <div className="space-y-1">
                              <Label htmlFor="utrInput">Transaction ID (UTR)</Label>
                              <Input
                                id="utrInput"
                                placeholder="Enter UTR / TXN ID"
                                value={userTransactionId}
                                onChange={(e) => setUserTransactionId(e.target.value)}
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={handleReportPayment}
                              disabled={isReportingPayment}
                              className="w-full"
                            >
                              {isReportingPayment ? 'Saving...' : 'Submit Transaction ID'}
                            </Button>
                            <p>
                              <strong>TXN ID:</strong> {reportedTransactionId || userTransactionId.trim() || 'Not available yet'}
                            </p>
                            <p>
                              <strong>Payment ID:</strong> {paymentId || 'Not available yet'}
                            </p>
                            <p className="text-muted-foreground">
                              Payment confirmed by user. Please reach out in ticket.
                            </p>
                          </div>
                        ) : null}
                      </>
                    )}
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
