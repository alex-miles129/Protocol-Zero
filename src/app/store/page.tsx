'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { memberships } from '@/data/memberships';
import { MembershipBadge } from '@/components/MembershipBadge';
import { useBasket } from '@/contexts/BasketContext';
import { Basket } from '@/components/Basket';
import Image from 'next/image';

const storeItems = [
  {
    id: 1,
    name: 'VIP Membership',
    description: 'Get exclusive access to VIP areas and special perks',
    price: '₹895.00',
    features: ['VIP Discord role', 'Special in-game tag', 'Access to VIP areas', 'Priority server queue'],
    image: 'https://placehold.co/600x400/purple/white?text=VIP',
  },
  {
    id: 2,
    name: 'Premium Vehicle Pack',
    description: 'Unlock a collection of exclusive premium vehicles',
    price: '₹1,343.00',
    features: ['5 exclusive vehicles', 'Custom paint jobs', 'Vehicle modifications', 'Priority garage slots'],
    image: 'https://placehold.co/600x400/pink/white?text=Vehicles',
  },
  {
    id: 3,
    name: 'Property Bundle',
    description: 'Start your roleplay with premium properties',
    price: '₹1,790.00',
    features: ['2 exclusive properties', 'Custom interiors', 'Property storage upgrade', 'Business location priority'],
    image: 'https://placehold.co/600x400/cyan/white?text=Properties',
  },
];

export default function StorePage() {
  const { addToBasket } = useBasket();
  const [activeTab, setActiveTab] = useState('membership');

  const handleAddToBasket = (membership: typeof memberships[0]) => {
    addToBasket({
      id: membership.id,
      name: membership.name,
      price: membership.price,
      category: 'membership',
    });
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Basket */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent mb-4">
            Support the Server
          </h1>
            <p className="text-foreground/70 max-w-2xl">
            Support Protocol: Zero and enhance your gameplay experience with exclusive perks and features.
            All purchases help us maintain and improve the server.
          </p>
          </div>
          <div className="flex-shrink-0">
            <Basket />
          </div>
        </div>

        <div className="mt-8 p-4 bg-foreground/5 rounded-lg border border-foreground/20">
            <p className="text-sm text-foreground/70">
              Note: These are Just For Show Here To Buy Go to Our Tebex page <a href="https://crimetownrp.tebex.io/" className="text-primary hover:underline">https://crimetownrp.tebex.io/</a>.
            </p>
          </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 w-full">
          <div className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="other">Other Items</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="membership" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {memberships.map((membership) => (
                <div
                  key={membership.id}
                  className="bg-background/50 border border-border/40 rounded-lg overflow-hidden hover:border-foreground/40 transition-colors flex flex-col items-center p-6 space-y-4"
                >
                  <div className="flex-shrink-0">
                    <MembershipBadge
                      type={membership.id as 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'ultimate' | 'supreme'}
                      className="w-32 h-32"
                    />
                  </div>
                  <div className="text-center space-y-2 flex-1">
                    <h3 className="text-xl font-semibold">{membership.name}</h3>
                    <p className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
                      ₹{membership.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleAddToBasket(membership)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                  >
                    Add to Basket
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="other" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {storeItems.map((item) => (
            <div
              key={item.id}
              className="bg-background/50 border border-border/40 rounded-lg overflow-hidden hover:border-foreground/40 transition-colors"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                      unoptimized
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">{item.name}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
                <ul className="space-y-2">
                  {item.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-foreground/70">
                      <svg
                        className="w-4 h-4 mr-2 text-foreground"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 flex items-center justify-between border-t border-border/40">
                  <span className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
                    {item.price}
                  </span>
                  <Button
                    className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground text-background hover:opacity-90 transition-opacity"
                  >
                    Purchase
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 p-6 bg-foreground/5 rounded-lg border border-foreground/20">
          <h2 className="text-xl font-semibold mb-4">Important Information</h2>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li>• All purchases are final and non-refundable</li>
            <li>• Perks are bound to your account and cannot be transferred</li>
            <li>• Some features may be subject to server rules and guidelines</li>
            <li>• For support with purchases, please contact us on Discord</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
} 
