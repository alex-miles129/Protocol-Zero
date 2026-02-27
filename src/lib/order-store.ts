type PaymentOrderRecord = Record<string, any>;

declare global {
  // eslint-disable-next-line no-var
  var __paymentOrdersStore__: Map<string, PaymentOrderRecord> | undefined;
}

const ordersStore = globalThis.__paymentOrdersStore__ ?? new Map<string, PaymentOrderRecord>();

if (!globalThis.__paymentOrdersStore__) {
  globalThis.__paymentOrdersStore__ = ordersStore;
}

export const orders = ordersStore;
