'use client';

import React, { useState } from 'react';
import { useBasket } from '@/contexts/BasketContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PaymentModal } from '@/components/PaymentModal';
import { useToast } from '@/components/ui/use-toast';

export function Basket() {
  const { items, removeFromBasket, updateQuantity, getTotal, getItemCount, clearBasket } = useBasket();
  const total = getTotal();
  const itemCount = getItemCount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: 'Basket Empty',
        description: 'Your basket is empty. Add items to proceed.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order on server
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          currency: 'INR',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Open payment modal
      setOrderId(data.orderId);
      setShowPaymentModal(true);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: error.message || 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string, orderId: string) => {
    toast({
      title: 'Payment Successful!',
      description: `Your payment has been processed. Payment ID: ${paymentId}`,
    });
    clearBasket();
    setShowPaymentModal(false);
    setOrderId(null);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: 'Payment Error',
      description: error,
      variant: 'destructive',
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative bg-background/50 border-border/40 hover:bg-background/70 hover:text-foreground text-foreground hover:border-foreground/40"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="ml-2 hidden sm:inline">Basket</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Shopping Basket</SheetTitle>
          <SheetDescription>
            Review your items before checkout
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto text-foreground/20 mb-4" />
              <p className="text-foreground/60">Your basket is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="bg-background/50 border-border/40">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm sm:text-base">{item.name}</h4>
                          <p className="text-sm text-foreground/70 mt-1">
                            ₹{item.price.toFixed(2)} each
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-sm sm:text-base">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 mt-2 text-destructive hover:text-destructive"
                            onClick={() => removeFromBasket(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="border-t border-border/40 pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-foreground via-foreground/80 to-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Checkout'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearBasket}
                  className="w-full"
                >
                  Clear Basket
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
      
      {orderId && (
        <PaymentModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          orderId={orderId}
          amount={total}
          currency="INR"
          items={items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </Sheet>
  );
}

