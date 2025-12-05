import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Store | Protocol: Zero',
  description: 'Support the server and get exclusive perks in Protocol: Zero',
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

