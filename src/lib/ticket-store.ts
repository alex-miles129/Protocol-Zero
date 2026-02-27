export interface SupportTicket {
  ticketId: string;
  category: 'membership';
  subject: string;
  description: string;
  orderId: string;
  transactionId: string;
  amount: number;
  currency: string;
  userId: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __supportTicketsStore__: Map<string, SupportTicket> | undefined;
}

const ticketsStore = globalThis.__supportTicketsStore__ ?? new Map<string, SupportTicket>();

if (!globalThis.__supportTicketsStore__) {
  globalThis.__supportTicketsStore__ = ticketsStore;
}

export const tickets = ticketsStore;

export function generateTicketId(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TKT-${ts}-${rand}`;
}

export function createMembershipTicket(input: {
  userId: string;
  orderId: string;
  transactionId: string;
  amount: number;
  currency: string;
}): SupportTicket {
  const ticketId = generateTicketId();
  const ticket: SupportTicket = {
    ticketId,
    category: 'membership',
    subject: `Membership purchase payment confirmation - ${input.orderId}`,
    description: `Auto-created after successful payment. TXN: ${input.transactionId}, ORDER: ${input.orderId}`,
    orderId: input.orderId,
    transactionId: input.transactionId,
    amount: input.amount,
    currency: input.currency,
    userId: input.userId,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  tickets.set(ticketId, ticket);
  return ticket;
}
