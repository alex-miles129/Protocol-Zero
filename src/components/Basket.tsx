'use client';

import React from 'react';
import { useBasket } from '@/contexts/BasketContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Basket() {
  const { items, removeFromBasket, updateQuantity, getTotal, getItemCount, clearBasket } = useBasket();
  const total = getTotal();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    // In a real application, this would redirect to a payment processor
    // For now, we'll just show an alert
    if (items.length === 0) {
      alert('Your basket is empty!');
      return;
    }
    
    const itemsList = items.map(item => 
      `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    alert(`Checkout Summary:\n\n${itemsList}\n\nTotal: ₹${total.toFixed(2)}\n\nRedirecting to payment...`);
    
    // Clear basket after checkout
    clearBasket();
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
                  className="w-full bg-gradient-to-r from-foreground via-foreground/80 to-foreground text-background hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  Checkout
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
    </Sheet>
  );
}

