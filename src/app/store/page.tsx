import { PageLayout } from '@/components/PageLayout';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Store | Protocol: Zero',
  description: 'Support the server and get exclusive perks in Protocol: Zero',
};

const storeItems = [
  {
    id: 1,
    name: 'VIP Membership',
    description: 'Get exclusive access to VIP areas and special perks',
    price: '$9.99',
    features: ['VIP Discord role', 'Special in-game tag', 'Access to VIP areas', 'Priority server queue'],
    image: 'https://placehold.co/600x400/purple/white?text=VIP',
  },
  {
    id: 2,
    name: 'Premium Vehicle Pack',
    description: 'Unlock a collection of exclusive premium vehicles',
    price: '$14.99',
    features: ['5 exclusive vehicles', 'Custom paint jobs', 'Vehicle modifications', 'Priority garage slots'],
    image: 'https://placehold.co/600x400/pink/white?text=Vehicles',
  },
  {
    id: 3,
    name: 'Property Bundle',
    description: 'Start your roleplay with premium properties',
    price: '$19.99',
    features: ['2 exclusive properties', 'Custom interiors', 'Property storage upgrade', 'Business location priority'],
    image: 'https://placehold.co/600x400/cyan/white?text=Properties',
  },
];

export default function StorePage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent mb-4">
            Support the Server
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Support Protocol: Zero and enhance your gameplay experience with exclusive perks and features.
            All purchases help us maintain and improve the server.
          </p>
        </div>

        <div className="mt-8 p-4 bg-foreground/5 rounded-lg border border-foreground/20">
            <p className="text-sm text-foreground/70">
              Note: These are Just For Show Here To Buy Go to Our Tebex page <a href="https://crimetownrp.tebex.io/" className="text-primary hover:underline">https://crimetownrp.tebex.io/</a>.
            </p>
          </div>

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